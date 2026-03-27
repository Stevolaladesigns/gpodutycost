import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    await admin.auth().verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid/expired token" }, { status: 401 });
  }

  const ZONOS_GRAPHQL_URL = "https://api.zonos.com/graphql";
  const ZONOS_CREDENTIAL_TOKEN = process.env.ZONOS_CREDENTIAL_TOKEN || "credential_live_1fc1f1dd-62e5-4f9a-9359-e0c4b889315f";

  const body = await request.json();
  const { currency, ship_from_country, ship_to, items, shipping } = body;

  const itemInputs = items.map((it: any) => `{
    amount: ${Number(it.amount)}
    currencyCode: ${currency}
    countryOfOrigin: ${it.country_of_origin || ship_from_country}
    quantity: ${Number(it.quantity)}
    hsCode: "${it.hs_code || ''}"
    productId: "${it.id || ''}"
    description: "${it.description || ''}"
  }`).join('\n');

  const query = `
    mutation {
      partyCreateWorkflow(
        input: [
          { location: { countryCode: ${ship_from_country} }, type: ORIGIN }
          { location: { countryCode: ${ship_to.country} }, type: DESTINATION }
        ]
      ) {
        id
      }
      itemCreateWorkflow(
        input: [
          ${itemInputs}
        ]
      ) {
        id
        hsCode
      }
      cartonizeWorkflow {
        id
      }
      shipmentRatingCreateWorkflow(
        input: {
          serviceLevelCode: "${shipping.service_level === 'express' ? 'dhl_express_worldwide' : 'postal_deminimis_us'}"
          amount: ${Number(shipping.amount)}
          currencyCode: ${currency}
        }
      ) {
        id
      }
      landedCostCalculateWorkflow(
        input: {
          endUse: NOT_FOR_RESALE
          calculationMethod: DDP
          currencyCode: ${currency}
          tariffRate: ZONOS_PREFERRED
        }
      ) {
        id
        duties {
          amount
          currency
          description
          note
          type
          formula
          item {
            productId
          }
        }
        taxes {
          amount
          currency
          description
          type
        }
        fees {
          amount
          currency
          description
        }
        amountSubtotals {
          shipping
          fees
          discounts
          duties
          items
          landedCostTotal
          taxes
        }
      }
    }
  `;

  try {
    const zonosResp = await fetch(ZONOS_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "credentialToken": ZONOS_CREDENTIAL_TOKEN
      },
      body: JSON.stringify({ query })
    });

    const json = await zonosResp.json();

    if (json.errors || !zonosResp.ok) {
      console.error(`Zonos GraphQL API Error:`, JSON.stringify(json, null, 2));
      const message = json.errors?.[0]?.message || "Failed to calculate duty cost";
      return NextResponse.json({
        error: "Zonos API Error",
        message,
        details: json
      }, { status: zonosResp.status === 200 ? 400 : zonosResp.status });
    }

    // Map GraphQL response to the frontend expectations
    const lcData = json.data?.landedCostCalculateWorkflow?.[0];
    
    if (!lcData) {
      return NextResponse.json({ error: "Missing landed cost data in response" }, { status: 500 });
    }

    return NextResponse.json(lcData);
  } catch (e: any) {
    console.error("Duty Cost Calculation Exception:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}
