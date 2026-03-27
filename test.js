import fetch from 'node-fetch';

async function test() {
  const currencyCode = "GHS";
  const query = `
    mutation {
      partyCreateWorkflow(
        input: [
          { location: { countryCode: GH }, type: ORIGIN }
          { location: { countryCode: US }, type: DESTINATION }
        ]
      ) {
        id
      }
      itemCreateWorkflow(
        input: [
          {
            amount: 20
            currencyCode: ${currencyCode}
            countryOfOrigin: GH
            quantity: 1
            hsCode: "6109.10"
            productId: "item1"
            description: "Cotton T-shirt"
          }
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
          serviceLevelCode: "standard"
          amount: 15
          currencyCode: ${currencyCode}
        }
      ) {
        id
      }
      landedCostCalculateWorkflow(
        input: {
          endUse: NOT_FOR_RESALE
          calculationMethod: DDP
          currencyCode: ${currencyCode}
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

  const res = await fetch("https://api.zonos.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "credentialToken": "credential_live_1fc1f1dd-62e5-4f9a-9359-e0c4b889315f"
    },
    body: JSON.stringify({ query })
  });
  console.log(JSON.stringify(await res.json(), null, 2));
}
test();
