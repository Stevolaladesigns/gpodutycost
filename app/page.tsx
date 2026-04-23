'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  LayoutDashboard,
  BarChart3,
  Users,
  LogOut,
  Package,
  Globe,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Printer,
  RefreshCcw,
  Pencil,
  Power,
  PowerOff,
  Save,
  X,
  Settings,
  Lock,
  ShieldCheck,
  Bell,
  UserCog,
  Search,
  Eye,
  EyeOff,
  Download,
  Zap,
  Mail,
  ScanBarcode,
  FileText,
  User,
  Edit,
  ChevronDown,
  MapPin,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Barcode from 'react-barcode';
import { auth, db } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// --- API Helpers ---
const API = {
  async getLandedCost(data: any) {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
    const res = await fetch('/api/zonos/landed-cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      const zonosError = json.errors && json.errors[0]?.message;
      const errorMsg = zonosError || json.message || json.error || 'Request failed';
      throw new Error(errorMsg);
    }
    return json;
  }
};

// --- Helpers ---
const formatDate = (val: any) => {
  if (!val) return null;
  let d: Date;
  if (typeof val === 'string') d = new Date(val);
  else if (val && (val as any).toDate && typeof (val as any).toDate === 'function') d = (val as any).toDate();
  else if (val && (val as any).seconds) d = new Date((val as any).seconds * 1000);
  else d = new Date(val);

  // Visual safety check: if a record is stuck on 3/28 while it's still 3/27, 
  // we show it as 3/27 (today) to fix the visual 'jump' caused by previous timezone drift.
  try {
    const dateStr = d.toISOString().substring(0, 10);
    const todayStr = new Date().toISOString().substring(0, 10);
    if (dateStr === '2026-03-28' && todayStr === '2026-03-27') {
      return new Date(d.getTime() - 24 * 60 * 60 * 1000);
    }
  } catch { }

  return d;
};

// --- Components ---

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your details and try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left side - Login Form (50%) */}
      <div className="flex-1 lg:w-[50%] flex items-center justify-center p-8 lg:p-16 shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #f8f9ff 0%, #eef0fb 50%, #fff5ef 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: '#F26522' }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: '#0A1172' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 blur-2xl pointer-events-none"
          style={{ background: '#F26522' }} />

        {/* Dot grid texture */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #0A1172 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gp-blue/10 border border-white/60 p-8 lg:p-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center justify-center w-24 h-16">
              <img src="/logo.png" alt="Ghana Post Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">Log In</h2>
          <p className="text-gray-500 mb-10">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gp-orange/20 focus:border-gp-orange transition-all placeholder:text-gray-400"
                placeholder="Enter Your Email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gp-orange/20 focus:border-gp-orange transition-all placeholder:text-gray-400"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-gp-orange peer-checked:border-gp-orange transition-all"></div>
                  <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember Me</span>
              </label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100"
              >
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F26522] text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Powered by GPO Digital Systems
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Hero Image (50%) */}
      <div className="lg:w-[50%] relative hidden lg:block overflow-hidden">
        <img
          src="/building.webp"
          alt="Ghana Post Building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Deep blue overlay */}
        <div className="absolute inset-0 bg-[#0A1172]/70 backdrop-blur-[1px]"></div>

        {/* Logo in top right */}
        <div className="absolute top-10 right-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center w-32 h-20"
          >
            <img src="/logo.png" alt="Ghana Post Logo" className="w-full h-full object-contain" />
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold mb-6 tracking-tight"
          >
            Welcome back!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/80 max-w-md leading-relaxed"
          >
            Enter your credentials to access the<br /> GPO Duty Cost Portal.
          </motion.p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-10 inset-x-0 text-center text-white/40 text-sm font-medium">
          © {new Date().getFullYear()} Ghana Post. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function AutocompleteInput({
  value,
  onChange,
  onSelect,
  options,
  placeholder,
  label
}: {
  value: string;
  onChange: (val: string) => void;
  onSelect: (val: string, item: any) => void;
  options: { label: string; sub: string; original: any }[];
  placeholder: string;
  label: string | React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.sub.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setSearch(value);
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/10"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-black/10 rounded-xl shadow-xl max-h-60 overflow-y-auto left-0">
          {filtered.slice(0, 50).map((opt, i) => (
            <div
              key={i}
              className="px-4 py-3 hover:bg-gp-blue/5 cursor-pointer text-sm text-gray-700 flex flex-col border-b border-black/5 last:border-0"
              onMouseDown={(e) => {
                // use onMouseDown instead of onClick to prevent onBlur from closing early
                e.preventDefault();
                onSelect(opt.label, opt.original);
                setOpen(false);
              }}
            >
              <span className="font-semibold text-gp-blue">{opt.label}</span>
              <span className="text-[10px] uppercase font-bold text-gp-blue/40">{opt.sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LandedCostForm({ user }: { user: any }) {
  const [hsCodesData, setHsCodesData] = useState<{ code: string, desc: string }[]>([]);
  const [descOptions, setDescOptions] = useState<any[]>([]);
  const [uniqueHsCodes, setUniqueHsCodes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/hs-codes.json')
      .then(res => res.json())
      .then(data => {
        setHsCodesData(data);
        setDescOptions(data.map((d: any) => ({ label: d.desc, sub: d.code, original: d })));
        const unique = Array.from(new Set(data.map((d: any) => d.code)));
        setUniqueHsCodes(unique.map(code => {
          const match = data.find((d: any) => d.code === code);
          return { label: code as string, sub: match?.desc || '', original: match };
        }));
      })
      .catch(err => console.error("Failed to load HS codes", err));
  }, []);

  const [formData, setFormData] = useState({
    currency: 'GHS',
    ship_from_country: 'GH',
    tracking_number: '',
    ship_to: { country: '', state: '', postal_code: '', city: '' },
    items: [{ id: Date.now() + Math.random(), description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: '' }],
    shipping: { amount: 0, service_level: 'standard' }
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPrinted, setHasPrinted] = useState(false);
  const isPrintingRef = useRef(false);

  const logTransaction = async (success: number, payloadRes: any, errorMsg?: string) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        user_id: user.id || auth.currentUser?.uid,
        user_name: user.full_name || user.email || null,
        post_office: user.post_office || 'UNKNOWN',
        destination_country: formData.ship_to.country,
        destination_state: formData.ship_to.state || null,
        destination_postal: formData.ship_to.postal_code || null,
        tracking_number: formData.tracking_number || null,
        currency: formData.currency,
        request_payload: JSON.stringify(formData),
        response_payload: payloadRes ? JSON.stringify(payloadRes) : null,
        success,
        error_message: errorMsg || null,
        created_at: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to log transaction", e);
    }
  };

  const handleCalculate = async () => {
    // Basic validations
    const trackingNo = formData.tracking_number?.trim() || "";
    if (!trackingNo) {
      setError("Please provide a Tracking Number");
      return;
    }
    const trackingRegex = /^[A-Za-z]{2}\d{9}[A-Za-z]{2}$/;
    if (!trackingRegex.test(trackingNo)) {
      setError("Tracking Number must start with 2 letters, followed by 9 numbers, and end with 2 letters (e.g. CP225658529GH)");
      return;
    }
    if (!formData.ship_to.country?.trim()) {
      setError("Please provide a Destination Country Code (e.g. US)");
      return;
    }
    if (!formData.ship_to.state?.trim()) {
      setError("Please provide a Destination State/Region");
      return;
    }
    if (!formData.ship_to.city?.trim()) {
      setError("Please provide a Destination City");
      return;
    }
    if (!formData.ship_to.postal_code?.trim()) {
      setError("Please provide a Destination Postal Code");
      return;
    }

    // Item validations
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      const itemNum = formData.items.length > 1 ? ` for item ${i + 1}` : "";

      if (!item.description?.trim()) {
        setError(`Please provide a Description${itemNum}`);
        return;
      }
      if (!item.amount || Number(item.amount) <= 0) {
        setError(`Please provide a valid Price${itemNum}`);
        return;
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        setError(`Please provide a valid Quantity${itemNum}`);
        return;
      }
      if (!item.hs_code?.trim()) {
        setError(`Please provide an HS Code${itemNum}`);
        return;
      }
    }

    if (formData.shipping.amount === undefined || formData.shipping.amount === null) {
      setError("Please provide a Shipping Cost (use 0 if included)");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    const cleanedData = {
      ...formData,
      items: formData.items.map(it => ({
        ...it,
        quantity: it.quantity === '' ? 1 : it.quantity
      }))
    };

    try {
      const res = await API.getLandedCost(cleanedData);
      setResult(res);
      setHasPrinted(false); // Reset print status for new calculation
      isPrintingRef.current = false;
    } catch (err: any) {
      setError(err.message);
      // Removed: logTransaction(0, null, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintQuotation = async () => {
    if (result && !hasPrinted && !isPrintingRef.current) {
      isPrintingRef.current = true;
      setHasPrinted(true); // Button will hide immediately
      // Log successful transaction when printing
      await logTransaction(1, result);
      // 300ms delay gives the UI time to re-render without the button before print engine starts
      setTimeout(() => {
        window.print();
        isPrintingRef.current = false;
      }, 300);
    }
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      currency: 'GHS',
      ship_from_country: 'GH',
      tracking_number: '',
      ship_to: { country: '', state: '', postal_code: '', city: '' },
      items: [{ id: Date.now() + Math.random(), description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: '' }],
      shipping: { amount: 0, service_level: 'standard' }
    }));
    setResult(null);
    setError('');
    setHasPrinted(false);
    isPrintingRef.current = false;
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now() + Math.random(), description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: 'GH' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const updateMultipleItemFields = (index: number, updates: Record<string, any>) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], ...updates };
      return { ...prev, items: newItems };
    });
  };

  const renderReceiptContent = () => (
    <div className="w-full h-full flex flex-col justify-start">
      {/* Reduced padding and margins for extreme compactness */}
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3 mt-1">
        <div>
          <img src="/logo.png" className="h-9 object-contain mb-1" alt="Ghana Post" />
          <h1 className="text-lg font-bold text-black uppercase tracking-tight leading-none">Duty Cost Quotation</h1>
          <p className="text-[9px] font-bold mt-0.5 text-black/60 tracking-widest uppercase">GPO Central System</p>
        </div>
        <div className="text-right flex flex-col items-end pt-1">
          <Barcode value={formData.tracking_number || 'UNKNOWN'} width={1.2} height={30} fontSize={10} background="transparent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <h3 className="font-bold text-[9px] uppercase tracking-widest text-black/40 mb-1">Shipment details</h3>
          <div className="space-y-0 font-medium text-[13px] leading-snug">
            <p>Origin: {formData.ship_from_country}</p>
            <p>Destination: {formData.ship_to.country} ({formData.ship_to.state || '-'}, {formData.ship_to.city || '-'})</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Branch: {user.post_office || 'General Post Office'}</p>
            <p>User: {user.full_name || user.email}</p>
          </div>
        </div>
        <div className="bg-black/5 p-3 rounded-xl text-center flex flex-col justify-center border border-black/5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-black/60 mb-0.5">Total Duty Cost</p>
          <p className="text-2xl font-black">{formData.currency} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-bold border-b border-black pb-1 mb-2 text-[9px] uppercase tracking-widest">Items Summary</h3>
        <table className="w-full text-left text-[11px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-black/20 font-bold text-[8px] uppercase tracking-widest bg-black/5">
              <th className="py-1 px-1">#</th>
              <th className="py-1 px-1">Description</th>
              <th className="py-1 px-1">HS Code</th>
              <th className="py-1 px-1 text-center">Qty</th>
              <th className="py-1 px-1 text-right">Unit Price</th>
              <th className="py-1 px-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item: any, idx: number) => (
              <tr key={item.id} className="border-b border-black/10" style={{ pageBreakInside: 'avoid' }}>
                <td className="py-1 px-1 text-black/50 font-bold">{idx + 1}</td>
                <td className="py-1 px-1 font-bold" style={{ maxWidth: '120px', wordBreak: 'break-word' }}>{item.description || 'Unknown Item'}</td>
                <td className="py-1 px-1 text-black/60 font-mono text-[9px]">{item.hs_code || 'N/A'}</td>
                <td className="py-1 px-1 text-center font-bold">{item.quantity || 1}</td>
                <td className="py-1 px-1 text-right text-black/70">{formData.currency} {Number(item.amount).toFixed(2)}</td>
                <td className="py-1 px-1 text-right font-bold">{formData.currency} {(Number(item.amount) * (Number(item.quantity) || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-[240px] ml-auto text-[12px]">
        <h3 className="font-bold border-b border-black pb-0.5 mb-1.5 text-[9px] uppercase tracking-widest">Cost Breakdown</h3>
        <div className="flex justify-between py-0.5 border-b border-black/5">
          <span className="font-medium text-black/60">Items Total</span>
          <span className="font-bold">{formData.currency} {(result.subtotal || result.amountSubtotals?.items || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-black/5">
          <span className="font-medium text-black/60">Duties</span>
          <span className="font-bold">{formData.currency} {(result.duty !== undefined ? result.duty : (result.amountSubtotals?.duties || 0)).toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-black/5">
          <span className="font-medium text-black/60">Shipping</span>
          <span className="font-bold">{formData.currency} {Number(result.shipping !== undefined ? result.shipping : (result.amountSubtotals?.shipping || 0)).toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-black/5">
          <span className="font-medium text-black/60">Fees</span>
          <span className="font-bold">{formData.currency} {Number(result.amountSubtotals?.fees || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1 mt-0.5 border-t border-black text-base">
          <span className="font-black">Total Duty Cost</span>
          <span className="font-black">{formData.currency} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-auto pt-2 text-center text-[8px] text-black/30 font-bold tracking-widest uppercase border-t border-black/5">
        Generated by GPO Duty Cost Portal
      </div>
    </div>
  );

  return (
    <div className="space-y-6 relative">
      {/* Hidden Print Layout */}
      {result && (
        <div className="hidden print:flex print:flex-col print-layout bg-white text-black w-full h-[297mm] overflow-hidden">
          <style>{`
            @media print {
              @page { size: A4 portrait; margin: 0; }
              html, body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                width: 210mm;
                height: 297mm;
              }
              nav, header, aside, .no-print, button, .screen-only { display: none !important; }
              main { margin: 0 !important; padding: 0 !important; width: 100% !important; display: block !important; }
              .print-layout {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 99999 !important;
                visibility: visible !important;
                opacity: 1 !important;
                overflow: hidden !important;
              }
              .receipt-half {
                height: 148.5mm !important;
                padding: 8mm 12mm !important;
                position: relative !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
              }
              .split-line-container {
                height: 0;
                width: 100%;
                border-top: 1px dashed #ccc !important;
                position: relative;
                z-index: 10;
              }
            }
          `}</style>

          <div className="receipt-half">
            {renderReceiptContent()}
          </div>

          <div className="split-line-container"></div>

          <div className="receipt-half">
            {renderReceiptContent()}
          </div>
        </div>
      )}

      <div className="print:hidden space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="text-gp-blue" />
                Shipment Details
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gp-blue/5 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">
                <Globe size={12} />
                Zonos API Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gp-blue mb-1">Currency</label>
                <div className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 font-medium">
                  GHS (Ghana Cedis)
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gp-blue mb-1">Origin Country Code</label>
                <div className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 font-medium tracking-widest">
                  GH
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Tracking</h3>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Tracking Number</label>
                <input
                  placeholder="e.g. CP225658529GH "
                  value={formData.tracking_number}
                  onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10 uppercase"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Destination</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Country Code</label>
                  <input
                    placeholder="e.g. US"
                    value={formData.ship_to.country}
                    onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, country: e.target.value.toUpperCase() } })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">State/Region</label>
                  <input
                    placeholder="e.g. New York"
                    value={formData.ship_to.state}
                    onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, state: e.target.value.toUpperCase() } })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">City</label>
                  <input
                    placeholder="e.g. New York"
                    value={formData.ship_to.city}
                    onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, city: e.target.value.toUpperCase() } })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Zip Code</label>
                  <input
                    placeholder="e.g. 10001"
                    value={formData.ship_to.postal_code}
                    onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, postal_code: e.target.value.toUpperCase() } })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10 uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Items</h3>
                <button onClick={addItem} className="text-gp-blue hover:bg-gp-blue/10 p-1 rounded-full transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              {formData.items.map((item: any, idx) => (
                <div key={item.id} className="p-4 bg-gp-light rounded-2xl relative space-y-4 border border-gp-blue/5">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="absolute top-3 right-3 z-20 text-red-500 hover:bg-red-50 p-2 rounded-full transition-all active:scale-95 shadow-sm bg-white/80"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <AutocompleteInput
                    label="Description"
                    placeholder="e.g. Cotton T-shirt"
                    value={item.description}
                    onChange={(val) => updateItem(idx, 'description', val)}
                    onSelect={(val, original) => {
                      updateMultipleItemFields(idx, {
                        description: val,
                        hs_code: original.code
                      });
                    }}
                    options={descOptions}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Unit Price</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.amount || ''}
                        onChange={(e) => updateItem(idx, 'amount', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Quantity</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <AutocompleteInput
                      label="HS Code"
                      placeholder="e.g. 6109.10"
                      value={item.hs_code}
                      onChange={(val) => updateItem(idx, 'hs_code', val)}
                      onSelect={(val, original) => {
                        const updates: any = { hs_code: val };
                        if (!item.description) {
                          updates.description = original.desc;
                        }
                        updateMultipleItemFields(idx, updates);
                      }}
                      options={uniqueHsCodes}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Shipping</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Shipping Cost</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.shipping.amount || ''}
                    onChange={(e) => setFormData({ ...formData, shipping: { ...formData.shipping, amount: Number(e.target.value) } })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Service Level</label>
                  <div className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 font-medium">
                    Standard
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-gp-orange text-white py-4 rounded-2xl font-bold text-lg hover:bg-gp-orange/90 transition-all shadow-lg shadow-gp-orange/20 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Duty Cost'}
            </button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4"
                >
                  <AlertCircle className="text-red-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-900">Calculation Failed</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gp-blue">Quotation Result</h2>
                    <div className="bg-gp-orange/10 text-gp-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Verified
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gp-blue p-6 rounded-3xl text-center text-white">
                      <p className="text-white/70 text-sm uppercase font-bold tracking-widest mb-1">Total Duty Cost</p>
                      <p className="text-4xl font-bold">
                        {formData.currency} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Items Total</span>
                        <span className="font-bold">{formData.currency} {(result.subtotal || result.amountSubtotals?.items || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Duties</span>
                        <span className="font-bold">{formData.currency} {(result.duty !== undefined ? result.duty : (result.amountSubtotals?.duties || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Taxes</span>
                        <span className="font-bold">{formData.currency} {(result.tax !== undefined ? result.tax : (result.amountSubtotals?.taxes || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Fees</span>
                        <span className="font-bold">{formData.currency} {(result.fee !== undefined ? result.fee : (result.amountSubtotals?.fees || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Shipping</span>
                        <span className="font-bold">{formData.currency} {(result.shipping !== undefined ? result.shipping : (result.amountSubtotals?.shipping || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gp-blue/40">Duty & Tax Details</h3>
                    {(result.duties || []).map((duty: any, idx: number) => (
                      <div key={`duty-${idx}`} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gp-blue/5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gp-blue">{duty.description || 'Import Duty'}</span>
                          <span className="text-[10px] text-gp-blue/60 uppercase tracking-widest">{duty.item?.productId || duty.type || 'Duty'}</span>
                        </div>
                        <span className="text-sm font-bold">{duty.currency || formData.currency} {Number(duty.amount || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {(result.taxes || []).map((tax: any, idx: number) => (
                      <div key={`tax-${idx}`} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gp-blue/5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gp-blue">{tax.description || 'Import Tax'}</span>
                          <span className="text-[10px] text-gp-blue/60 uppercase tracking-widest">{tax.type || 'Tax'}</span>
                        </div>
                        <span className="text-sm font-bold">{tax.currency || formData.currency} {Number(tax.amount || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-black/5">
                    {!hasPrinted && (
                      <button
                        onClick={handlePrintQuotation}
                        className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg bg-gp-blue text-white hover:bg-gp-blue/90 shadow-gp-blue/20"
                      >
                        <Printer size={20} />
                        Print Quotation
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-black/5 text-gp-blue py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/10 transition-colors"
                    >
                      <RefreshCcw size={20} />
                      Start New Calculation
                    </button>
                  </div>



                </motion.div>
              ) : !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-gp-blue/40 p-12 border-2 border-dashed border-black/5 rounded-3xl">
                  <Package size={48} className="mb-4 opacity-20" />
                  <p className="text-center font-medium">Enter shipment details to generate a duty cost quotation.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

function DutyEstimateChecker({ user }: { user: any }) {
  const [hsCodesData, setHsCodesData] = useState<{ code: string, desc: string }[]>([]);
  const [descOptions, setDescOptions] = useState<any[]>([]);
  const [uniqueHsCodes, setUniqueHsCodes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/hs-codes.json')
      .then(res => res.json())
      .then(data => {
        setHsCodesData(data);
        setDescOptions(data.map((d: any) => ({ label: d.desc, sub: d.code, original: d })));
        const unique = Array.from(new Set(data.map((d: any) => d.code)));
        setUniqueHsCodes(unique.map(code => {
          const match = data.find((d: any) => d.code === code);
          return { label: code as string, sub: match?.desc || '', original: match };
        }));
      })
      .catch(err => console.error("Failed to load HS codes", err));
  }, []);

  const [formData, setFormData] = useState({
    currency: 'GHS',
    ship_from_country: 'GH',
    tracking_number: 'CP225658529GH',
    ship_to: { country: 'US', state: 'NEW YORK', postal_code: '10001', city: 'NEW YORK' },
    items: [{ id: Date.now() + Math.random(), description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: 'GH' }],
    shipping: { amount: 0, service_level: 'standard' }
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    // Item validations
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      const itemNum = formData.items.length > 1 ? ` for item ${i + 1}` : "";

      if (!item.description?.trim()) {
        setError(`Please provide a Description${itemNum}`);
        return;
      }
      if (!item.amount || Number(item.amount) <= 0) {
        setError(`Please provide a valid Price${itemNum}`);
        return;
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        setError(`Please provide a valid Quantity${itemNum}`);
        return;
      }
      if (!item.hs_code?.trim()) {
        setError(`Please provide an HS Code${itemNum}`);
        return;
      }
    }

    if (formData.shipping.amount === undefined || formData.shipping.amount === null) {
      setError("Please provide a Shipping Cost (use 0 if included)");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    const cleanedData = {
      ...formData,
      items: formData.items.map(it => ({
        ...it,
        quantity: it.quantity === '' ? 1 : it.quantity
      }))
    };

    try {
      const res = await API.getLandedCost(cleanedData);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      items: [{ id: Date.now() + Math.random(), description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: 'GH' }],
      shipping: { amount: 0, service_level: 'standard' }
    }));
    setResult(null);
    setError('');
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now() + Math.random(), description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: 'GH' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const updateMultipleItemFields = (index: number, updates: Record<string, any>) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], ...updates };
      return { ...prev, items: newItems };
    });
  };

  return (
    <div className="space-y-6 relative">
      <div className="print:hidden space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="text-gp-blue" />
                Duty Estimate Checker
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gp-blue/5 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">
                <Globe size={12} />
                Zonos API Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gp-blue mb-1">Currency</label>
                <div className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 font-medium">
                  GHS (Ghana Cedis)
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gp-blue mb-1">Origin Country Code</label>
                <div className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 font-medium tracking-widest">
                  GH
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Tracking</h3>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Tracking Number</label>
                <input
                  readOnly
                  value={formData.tracking_number}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 uppercase cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Destination</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Country Code</label>
                  <input
                    readOnly
                    value={formData.ship_to.country}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 uppercase cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">State/Region</label>
                  <input
                    readOnly
                    value={formData.ship_to.state}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 uppercase cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">City</label>
                  <input
                    readOnly
                    value={formData.ship_to.city}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 uppercase cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Zip Code</label>
                  <input
                    readOnly
                    value={formData.ship_to.postal_code}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 uppercase cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Items</h3>
                <button onClick={addItem} className="text-gp-blue hover:bg-gp-blue/10 p-1 rounded-full transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              {formData.items.map((item: any, idx) => (
                <div key={item.id} className="p-4 bg-gp-light rounded-2xl relative space-y-4 border border-gp-blue/5">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="absolute top-3 right-3 z-20 text-red-500 hover:bg-red-50 p-2 rounded-full transition-all active:scale-95 shadow-sm bg-white/80"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <AutocompleteInput
                    label="Description"
                    placeholder="e.g. Cotton T-shirt"
                    value={item.description}
                    onChange={(val) => updateItem(idx, 'description', val)}
                    onSelect={(val, original) => {
                      updateMultipleItemFields(idx, {
                        description: val,
                        hs_code: original.code
                      });
                    }}
                    options={descOptions}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Unit Price</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.amount || ''}
                        onChange={(e) => updateItem(idx, 'amount', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Quantity</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <AutocompleteInput
                      label="HS Code"
                      placeholder="e.g. 6109.10"
                      value={item.hs_code}
                      onChange={(val) => updateItem(idx, 'hs_code', val)}
                      onSelect={(val, original) => {
                        const updates: any = { hs_code: val };
                        if (!item.description) {
                          updates.description = original.desc;
                        }
                        updateMultipleItemFields(idx, updates);
                      }}
                      options={uniqueHsCodes}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gp-blue/60">Shipping</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Shipping Cost</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.shipping.amount || ''}
                    onChange={(e) => setFormData({ ...formData, shipping: { ...formData.shipping, amount: Number(e.target.value) } })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Service Level</label>
                  <div className="w-full px-3 py-2 rounded-xl border border-black/10 bg-black/5 text-gray-500 font-medium">
                    Standard
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-gp-orange text-white py-4 rounded-2xl font-bold text-lg hover:bg-gp-orange/90 transition-all shadow-lg shadow-gp-orange/20 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Estimated Duty Cost'}
            </button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4"
                >
                  <AlertCircle className="text-red-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-900">Estimation Failed</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gp-blue">Estimated Result</h2>
                    <div className="bg-gp-orange/10 text-gp-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Verified
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gp-blue p-6 rounded-3xl text-center text-white">
                      <p className="text-white/70 text-sm uppercase font-bold tracking-widest mb-1">Total Duty Cost</p>
                      <p className="text-4xl font-bold">
                        {formData.currency} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Items Total</span>
                        <span className="font-bold">{formData.currency} {(result.subtotal || result.amountSubtotals?.items || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Duties</span>
                        <span className="font-bold">{formData.currency} {(result.duty !== undefined ? result.duty : (result.amountSubtotals?.duties || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Taxes</span>
                        <span className="font-bold">{formData.currency} {(result.tax !== undefined ? result.tax : (result.amountSubtotals?.taxes || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Fees</span>
                        <span className="font-bold">{formData.currency} {(result.fee !== undefined ? result.fee : (result.amountSubtotals?.fees || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-black/5">
                        <span className="text-gp-blue font-medium">Shipping</span>
                        <span className="font-bold">{formData.currency} {(result.shipping !== undefined ? result.shipping : (result.amountSubtotals?.shipping || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gp-blue/40">Duty & Tax Details</h3>
                    {(result.duties || []).map((duty: any, idx: number) => (
                      <div key={`duty-${idx}`} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gp-blue/5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gp-blue">{duty.description || 'Import Duty'}</span>
                          <span className="text-[10px] text-gp-blue/60 uppercase tracking-widest">{duty.item?.productId || duty.type || 'Duty'}</span>
                        </div>
                        <span className="text-sm font-bold">{duty.currency || formData.currency} {Number(duty.amount || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {(result.taxes || []).map((tax: any, idx: number) => (
                      <div key={`tax-${idx}`} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gp-blue/5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gp-blue">{tax.description || 'Import Tax'}</span>
                          <span className="text-[10px] text-gp-blue/60 uppercase tracking-widest">{tax.type || 'Tax'}</span>
                        </div>
                        <span className="text-sm font-bold">{tax.currency || formData.currency} {Number(tax.amount || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-black/5">
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-black/5 text-gp-blue py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/10 transition-colors"
                    >
                      <RefreshCcw size={20} />
                      Start New Calculation
                    </button>
                  </div>
                </motion.div>
              ) : !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-gp-blue/40 p-12 border-2 border-dashed border-black/5 rounded-3xl">
                  <Package size={48} className="mb-4 opacity-20" />
                  <p className="text-center font-medium">Enter shipment details to estimate duty cost.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

function Reports({ user, formatDate, isAdmin }: { user: any, formatDate: any, isAdmin: boolean }) {
  // Users with 'ALL' report access default to 'ALL' scope
  const [scope, setScope] = useState<'MINE' | 'ALL'>((isAdmin || user?.permissions?.reportAccess === 'ALL') ? 'ALL' : 'MINE');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [printMode, setPrintMode] = useState<'LIST' | 'SINGLE'>('LIST');
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deletion Audit State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [txToDelete, setTxToDelete] = useState<any>(null);
  const [deleteReason, setDeleteReason] = useState('');



  // Filters
  const [searchTrackUser, setSearchTrackUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [txPage, setTxPage] = useState(1);
  const TX_PER_PAGE = 25;

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const txRef = collection(db, 'transactions');
      let q;
      const perms = user.permissions;
      const reportAccess = perms?.reportAccess || (isAdmin ? 'ALL' : 'OWN');

      if (reportAccess === 'ALL') {
        if (scope === 'MINE') {
          q = query(txRef, where('post_office', '==', user.post_office));
        } else {
          q = query(txRef);
        }
      } else if (reportAccess === 'SPECIFIC') {
        const ids = [user.id, ...(perms?.accessibleUserIds || [])];
        q = query(txRef, where('user_id', 'in', ids.slice(0, 30)));
      } else {
        q = query(txRef, where('user_id', '==', user.id));
      }

      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as any) }));

      // Always sort client-side to handle potential Firebase data inconsistencies (e.g., mixed Date/String types)
      data.sort((a, b) => {
        const dateA = formatDate(a.created_at)?.getTime() || 0;
        const dateB = formatDate(b.created_at)?.getTime() || 0;
        return dateB - dateA;
      });

      setTransactions(data);
    } catch (err: any) {
      console.error('Failed to fetch reports', err);
      setError('Failed to load transaction reports. Please check your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (t: any) => {
    if (!isAdmin) return;
    setTxToDelete(t);
    setDeleteReason('');
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!txToDelete || !deleteReason.trim()) return;
    setDeletingId(txToDelete.id);
    setShowDeleteModal(false);
    try {
      const res = txToDelete.response_payload ? JSON.parse(txToDelete.response_payload) : null;
      const total = res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0;
      
      // Log the deletion to audit trail
      await addDoc(collection(db, 'deletion_logs'), {
        deleted_by_id: user.id || auth.currentUser?.uid,
        deleted_by_name: user.full_name || user.email || 'Admin',
        reason: deleteReason,
        deleted_at: serverTimestamp(),
        original_transaction: {
          id: txToDelete.id,
          user_id: txToDelete.user_id || 'N/A',
          user_name: txToDelete.user_name || 'Unknown',
          post_office: txToDelete.post_office || 'N/A',
          tracking_number: txToDelete.tracking_number || 'N/A',
          total_cost: total,
          currency: txToDelete.currency || 'GHS',
          created_at: txToDelete.created_at || serverTimestamp()
        }
      });

      // Execute actual deletion
      await deleteDoc(doc(db, 'transactions', txToDelete.id));
      setTransactions(prev => prev.filter(t => t.id !== txToDelete.id));
    } catch (err) {
      console.error('Failed to delete transaction', err);
      alert('Failed to delete transaction. Please try again.');
    } finally {
      setDeletingId(null);
      setTxToDelete(null);
      setDeleteReason('');
    }
  };


  const handlePrintSingle = (t: any) => {
    setPrintMode('SINGLE');
    setSelectedTx(t);
    // Increased delay for stable rendering
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handlePrintList = () => {
    setPrintMode('LIST');
    setSelectedTx(null);
    // Increased delay for stable rendering
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportReport = () => {
    if (filteredTx.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Date", "Time", "User", "Branch", "Tracking #", "Status", "Cost Paid"];
    const csvRows = [headers.join(",")];

    filteredTx.forEach(t => {
      const d = formatDate(t.created_at);
      const date = d ? d.toLocaleDateString() : 'N/A';
      const time = d ? d.toLocaleTimeString() : '';
      const displayName = t.user_name || (t.user_id ? t.user_id.substring(0, 8) + '...' : 'Unknown');
      const branch = t.post_office || '';
      const tracking = t.tracking_number || '-';
      const status = t.success === 1 ? 'Success' : 'Failed';
      const res = t.response_payload ? JSON.parse(t.response_payload) : null;
      const total = res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0;

      const row = [
        `"${date}"`,
        `"${time}"`,
        `"${displayName.replace(/"/g, '""')}"`,
        `"${branch.replace(/"/g, '""')}"`,
        `"${tracking}"`,
        `"${status}"`,
        `"${t.currency || ''} ${total.toFixed(2)}"`
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Duty_Cost_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchReports();
  }, [scope, isAdmin, user.id, user.permissions, user.post_office]);

  const filteredTx = transactions.filter(t => {
    const matchSearch = (t.tracking_number?.toLowerCase() || '').includes(searchTrackUser.toLowerCase()) ||
      (t.user_id?.toLowerCase() || '').includes(searchTrackUser.toLowerCase()) ||
      (t.user_name?.toLowerCase() || '').includes(searchTrackUser.toLowerCase()) ||
      (t.post_office?.toLowerCase() || '').includes(searchTrackUser.toLowerCase());

    let matchDate = true;
    if (startDate || endDate) {
      const d = formatDate(t.created_at);
      const txDate = d ? d.toISOString().substring(0, 10) : '';
      if (startDate && txDate < startDate) matchDate = false;
      if (endDate && txDate > endDate) matchDate = false;
    }

    return matchSearch && matchDate;
  });

  const txTotalPages = Math.max(1, Math.ceil(filteredTx.length / TX_PER_PAGE));
  const paginatedTx = filteredTx.slice((txPage - 1) * TX_PER_PAGE, txPage * TX_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => { setTxPage(1); }, [searchTrackUser, startDate, endDate, scope]);

  return (
    <div className="space-y-6">
      {/* Hidden Print Layout (SUMMARY) */}
      {printMode === 'LIST' && (
        <div className="hidden print:block print-layout bg-white text-black w-full">
          <style>{`
          @media print {
            @page { size: auto; margin: 20mm; }
            html, body {
              background: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            nav, header, aside, .no-print, button, .screen-only { display: none !important; }
            main { margin: 0 !important; padding: 0 !important; width: 100% !important; display: block !important; }
            .print-layout {
              display: block !important;
              position: relative !important;
              width: 100% !important;
              padding: 0 10mm !important;
              z-index: 99999 !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            thead { display: table-header-group; }
            tr { page-break-inside: avoid; }
            th, td { overflow: hidden; word-wrap: break-word; }
          }
        `}</style>
          <div className="flex justify-between items-end border-b-2 border-gp-blue pb-4 mb-6">
            <div>
              <img src="/logo.png" className="h-12 object-contain mb-2" alt="Ghana Post" />
              <h1 className="text-2xl font-bold text-gp-blue uppercase tracking-tight">Duty Cost Transaction Report</h1>
              <p className="text-sm font-medium text-black/60">Generated: {new Date().toLocaleString()}</p>
              {(startDate || endDate) && (
                <p className="text-xs font-bold text-gp-orange mt-1">
                  Period: {startDate || 'Beginning'} — {endDate || 'Today'}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-black/40 uppercase tracking-widest">{scope === 'ALL' ? 'All Branches' : `Branch: ${user.post_office || 'General Post Office'}`}</p>
              <p className="text-[10px] font-bold text-black/30 mt-1 uppercase">Printed By: {user.full_name ? user.full_name.trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase() : user.email}</p>
            </div>
          </div>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-black/20 bg-gray-50">
                <th className="py-3 px-2 w-[15%]">Date</th>
                <th className="py-3 px-2 w-[35%]">User Name / Branch</th>
                <th className="py-3 px-2 w-[25%]">Tracking #</th>
                <th className="py-3 px-2 w-[25%] text-right">Cost Paid</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.filter(t => t.success === 1).map(t => {
                const res = t.response_payload ? JSON.parse(t.response_payload) : null;
                const total = res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0;
                return (
                  <tr key={t.id} className="border-b border-black/10">
                    <td className="py-3 px-2">{t.created_at ? formatDate(t.created_at)?.toLocaleDateString() : 'N/A'}</td>
                    <td className="py-3 px-2">
                      <span className="font-bold">{t.user_name || 'Unknown'}</span><br />
                      <span className="text-xs text-black/60 font-medium">{t.post_office}</span>
                    </td>
                    <td className="py-3 px-2 font-mono text-xs overflow-hidden break-all">{t.tracking_number || '-'}</td>
                    <td className="py-3 px-2 text-right font-bold">{t.currency} {total.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Summary / Footer Section */}
          <div className="mt-8 border-t-4 border-black pt-6 flex justify-end text-black">
            <div className="bg-gp-light/30 p-6 rounded-2xl border border-black/5 text-right min-w-[300px]">
              <p className="text-xs font-black uppercase tracking-widest text-gp-blue/40 mb-2">Total Amount (Successful)</p>
              <p className="text-3xl font-black text-gp-blue">
                GHS {filteredTx.filter(t => t.success === 1).reduce((acc, t) => {
                  const res = t.response_payload ? JSON.parse(t.response_payload) : null;
                  return acc + (res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0);
                }, 0).toFixed(2)}
              </p>
              <p className="text-[10px] font-bold text-gp-orange mt-2 uppercase tracking-tight italic">
                * Includes {filteredTx.filter(t => t.success === 1).length} successful records
              </p>
            </div>
          </div>
        </div>
      )}

      {printMode === 'SINGLE' && selectedTx && (
        <div className="hidden print:flex print:flex-col print-layout bg-white text-black w-full h-[297mm] overflow-hidden">
          <style>{`
            @media print {
              @page { size: A4 portrait; margin: 0; }
              html, body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                width: 210mm;
                height: 297mm;
              }
              nav, header, aside, .no-print, button, .screen-only { display: none !important; }
              main { margin: 0 !important; padding: 0 !important; width: 100% !important; display: block !important; }
              .print-layout {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 99999 !important;
                visibility: visible !important;
                opacity: 1 !important;
                overflow: hidden !important;
              }
              .receipt-half {
                height: 148.5mm !important;
                padding: 8mm 12mm !important;
                position: relative !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
              }
              .split-line-container {
                height: 0;
                width: 100%;
                border-top: 1px dashed #ccc !important;
                position: relative;
                z-index: 10;
              }
            }
          `}</style>
          {(() => {
            const formData = selectedTx.request_payload ? JSON.parse(selectedTx.request_payload) : {};
            const result = selectedTx.response_payload ? JSON.parse(selectedTx.response_payload) : {};
            const dateStr = formatDate(selectedTx.created_at)?.toLocaleDateString() || new Date().toLocaleDateString();
            const branchName = selectedTx.post_office;
            const rawUserName = selectedTx.user_name || 'System';
            const userName = rawUserName !== 'System'
              ? rawUserName.trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase()
              : 'System';

            const SingleReceipt = () => (
              <div className="w-full h-full flex flex-col justify-start">
                <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3 mt-1">
                  <div>
                    <img src="/logo.png" className="h-9 object-contain mb-1" alt="Ghana Post" />
                    <h1 className="text-lg font-bold text-black uppercase tracking-tight leading-none">Duty Cost Quotation</h1>
                    <p className="text-[9px] font-bold mt-0.5 text-black/60 tracking-widest uppercase">GPO Central System</p>
                  </div>
                  <div className="text-right flex flex-col items-end pt-1">
                    <Barcode value={formData.tracking_number || 'UNKNOWN'} width={1.2} height={30} fontSize={10} background="transparent" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-black">
                  <div>
                    <h3 className="font-bold text-[9px] uppercase tracking-widest text-black/40 mb-1">Shipment details</h3>
                    <div className="space-y-0 font-medium text-[13px] leading-snug">
                      <p>Origin: {formData.ship_from_country || 'GH'}</p>
                      <p>Destination: {formData.ship_to?.country} ({formData.ship_to?.state || '-'}, {formData.ship_to?.city || '-'})</p>
                      <p>Date: {dateStr}</p>
                      <p>Branch: {branchName}</p>
                      <p>User: {userName}</p>
                    </div>
                  </div>
                  <div className="bg-black/5 p-3 rounded-xl text-center flex flex-col justify-center border border-black/5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-black/60 mb-0.5">Total Duty Cost</p>
                    <p className="text-2xl font-black">{formData.currency || 'GHS'} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-3 text-black">
                  <h3 className="font-bold border-b border-black pb-1 mb-2 text-[9px] uppercase tracking-widest">Items Summary</h3>
                  <table className="w-full text-left text-[11px]" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr className="border-b border-black/20 font-bold text-[8px] uppercase tracking-widest bg-black/5">
                        <th className="py-1 px-1">#</th>
                        <th className="py-1 px-1">Description</th>
                        <th className="py-1 px-1">HS Code</th>
                        <th className="py-1 px-1 text-center">Qty</th>
                        <th className="py-1 px-1 text-right">Unit Price</th>
                        <th className="py-1 px-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(formData.items || []).map((item: any, idx: number) => (
                        <tr key={idx} className="border-b border-black/10" style={{ pageBreakInside: 'avoid' }}>
                          <td className="py-1 px-1 text-black/50 font-bold">{idx + 1}</td>
                          <td className="py-1 px-1 font-bold" style={{ maxWidth: '120px', wordBreak: 'break-word' }}>{item.description || 'Unknown Item'}</td>
                          <td className="py-1 px-1 text-black/60 font-mono text-[9px]">{item.hs_code || 'N/A'}</td>
                          <td className="py-1 px-1 text-center font-bold">{item.quantity || 1}</td>
                          <td className="py-1 px-1 text-right text-black/70">{formData.currency || 'GHS'} {Number(item.amount).toFixed(2)}</td>
                          <td className="py-1 px-1 text-right font-bold">{formData.currency || 'GHS'} {(Number(item.amount) * (Number(item.quantity) || 1)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="max-w-[240px] ml-auto text-black text-[12px]">
                  <h3 className="font-bold border-b border-black pb-0.5 mb-1.5 text-[9px] uppercase tracking-widest">Cost Breakdown</h3>
                  <div className="flex justify-between py-0.5 border-b border-black/5">
                    <span className="font-medium text-black/60">Items Total</span>
                    <span className="font-bold">{formData.currency || 'GHS'} {(result.subtotal || result.amountSubtotals?.items || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-black/5">
                    <span className="font-medium text-black/60">Duties</span>
                    <span className="font-bold">{formData.currency || 'GHS'} {(result.duty !== undefined ? result.duty : (result.amountSubtotals?.duties || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-black/5">
                    <span className="font-medium text-black/60">Shipping</span>
                    <span className="font-bold">{formData.currency || 'GHS'} {Number(result.shipping !== undefined ? result.shipping : (result.amountSubtotals?.shipping || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-black/5">
                    <span className="font-medium text-black/60">Fees</span>
                    <span className="font-bold">{formData.currency || 'GHS'} {Number(result.amountSubtotals?.fees || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 mt-0.5 border-t border-black text-base">
                    <span className="font-black">Total Landed Cost</span>
                    <span className="font-black">{formData.currency || 'GHS'} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-2 text-center text-[8px] text-black/30 font-bold tracking-widest uppercase border-t border-black/5">
                  Generated by GPO Duty Cost Portal
                </div>
              </div>
            );

            return (
              <>
                <div className="receipt-half">
                  <SingleReceipt />
                </div>
                <div className="split-line-container"></div>
                <div className="receipt-half">
                  <SingleReceipt />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Main Screen UI - Hidden during printing */}
      <div className="print:hidden space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gp-blue">
              <BarChart3 className="text-gp-blue" />
              Duty Cost Transactions
            </h2>
            <p className="text-sm text-gp-blue/60 font-medium mt-1">View, search, and print reports of duty cost calculations</p>
          </div>
          {(user.permissions?.reportAccess === 'ALL' || (isAdmin && !user.permissions)) && (
            <div className="flex items-center gap-2">
              <div className="flex bg-white p-1 rounded-xl border border-black/5 shadow-sm">
                <button
                  onClick={() => setScope('ALL')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${scope === 'ALL' ? 'bg-gp-orange text-white shadow-md shadow-gp-orange/20' : 'text-gp-orange hover:bg-gp-orange/10'}`}
                >
                  All Offices
                </button>
                <button
                  onClick={() => setScope('MINE')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${scope === 'MINE' ? 'bg-gp-blue text-white shadow-md shadow-gp-blue/20' : 'text-gp-blue hover:bg-gp-light'}`}
                >
                  My Office
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
            <button onClick={fetchReports} className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg text-xs font-bold transition-colors">Retry</button>
          </div>
        )}

        {/* Filters & Actions */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gp-blue/30 group-focus-within:text-gp-orange transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search by Tracking #, User, or Branch..."
                value={searchTrackUser}
                onChange={e => setSearchTrackUser(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/5 bg-gp-light/50 text-sm focus:outline-none focus:ring-2 focus:ring-gp-orange/20 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-1 bg-gp-light/50 p-1 rounded-2xl border border-black/5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white transition-all">
                <span className="text-[9px] font-black text-gp-blue/30 uppercase tracking-tighter">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-gp-blue focus:outline-none w-28"
                />
              </div>
              <div className="w-[1px] h-4 bg-black/5"></div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white transition-all">
                <span className="text-[9px] font-black text-gp-blue/30 uppercase tracking-tighter">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-gp-blue focus:outline-none w-28"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintList}
              className="bg-gp-blue text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-gp-blue/90 transition-all shadow-lg shadow-gp-blue/10 active:scale-95"
            >
              <Printer size={18} />
              Print Report
            </button>
            {user.role !== 'OPERATIONS' && (
              <button
                onClick={handleExportReport}
                className="bg-green-600 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
              >
                <Download size={18} />
                Export Report
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 bg-gp-light/30">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">Date & Time</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">User & Branch</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">Tracking #</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60 text-right">Cost Paid</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {paginatedTx.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gp-blue/40 font-medium italic">
                      No transactions found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedTx.map(t => {
                    const res = t.response_payload ? JSON.parse(t.response_payload) : null;
                    const total = res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0;
                    const displayName = t.user_name || (t.user_id ? t.user_id.substring(0, 8) + '...' : 'Unknown');
                    return (
                      <tr key={t.id} className="hover:bg-gp-light/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gp-blue">
                            {t.created_at ? formatDate(t.created_at)?.toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gp-blue/40">
                            {t.created_at ? formatDate(t.created_at)?.toLocaleTimeString() : ''}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-sm text-[#1a1a1a]">{displayName}</p>
                          <p className="text-xs font-medium text-gp-orange">Branch: {t.post_office}</p>
                        </td>
                        <td className="p-4 font-mono text-sm font-semibold">{t.tracking_number || '-'}</td>
                        <td className="p-4">
                          {t.success === 1 ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter flex w-fit items-center gap-1">
                              <CheckCircle2 size={12} /> Success
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter flex w-fit items-center gap-1">
                              <AlertCircle size={12} /> Failed
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-extrabold text-lg">{t.currency} {total.toFixed(2)}</p>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handlePrintSingle(t)}
                              title="Print receipt"
                              className="p-2 rounded-xl text-gp-blue hover:bg-gp-blue/10 transition-all"
                            >
                              <Printer size={16} />
                            </button>
                            {user.role === 'ADMIN' && (
                              <button
                                onClick={() => handleDelete(t)}
                                disabled={deletingId === t.id}
                                title="Delete this record"
                                className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {deletingId === t.id
                                  ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-500 rounded-full animate-spin" />
                                  : <Trash2 size={16} />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination bar */}
        {filteredTx.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-black/5">
            <p className="text-xs font-bold text-gp-blue/40">
              Showing {(txPage - 1) * TX_PER_PAGE + 1}–{Math.min(txPage * TX_PER_PAGE, filteredTx.length)} of {filteredTx.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1}
                className="p-2 rounded-lg hover:bg-gp-light disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} className="text-gp-blue" />
              </button>
              {Array.from({ length: txTotalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === txTotalPages || Math.abs(p - txPage) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gp-blue/30">...</span>}
                    <button onClick={() => setTxPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${txPage === p ? 'bg-gp-orange text-white shadow-md' : 'text-gp-blue hover:bg-gp-light'}`}>
                      {p}
                    </button>
                  </React.Fragment>
                ))}
              <button onClick={() => setTxPage(p => Math.min(txTotalPages, p + 1))} disabled={txPage === txTotalPages}
                className="p-2 rounded-lg hover:bg-gp-light disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={16} className="text-gp-blue" />
              </button>
            </div>
          </div>
        )}

        {/* Deletion Reason Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/20 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                    <Trash2 className="text-red-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">Confirm Deletion</h3>
                    <p className="text-sm font-medium text-gray-500">Provide a reason for record removal</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 mb-6">
                    <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">Transaction to Delete:</p>
                    <p className="text-sm font-bold text-gp-blue">{txToDelete?.tracking_number || 'N/A'}</p>
                    <p className="text-[10px] font-bold text-red-600/60 uppercase mt-1">This action cannot be undone and will be logged.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gp-blue/40 mb-2 ml-1">Reason for Deletion</label>
                    <textarea
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      placeholder="Enter reason (e.g., Duplicate entry, Testing...)"
                      className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-gp-light focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/10 min-h-[120px] text-sm font-medium transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-6 py-3.5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeDelete}
                      disabled={deleteReason.trim().length < 5}
                      className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      Delete Record
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Deletion Logs Component ---
function DeletionLogs({ formatDate }: { formatDate: any }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logPage, setLogPage] = useState(1);
  const LOGS_PER_PAGE = 20;

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'deletion_logs'), orderBy('deleted_at', 'desc'));
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to fetch deletion logs", err);
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const orig = log.original_transaction || {};
    const searchStr = searchQuery.toLowerCase();
    const matchSearch = 
      (log.deleted_by_name?.toLowerCase() || '').includes(searchStr) ||
      (orig.tracking_number?.toLowerCase() || '').includes(searchStr) ||
      (orig.user_name?.toLowerCase() || '').includes(searchStr);

    let matchDate = true;
    if (startDate || endDate) {
      const d = formatDate(log.deleted_at);
      const logDate = d ? d.toISOString().substring(0, 10) : '';
      if (startDate && logDate < startDate) matchDate = false;
      if (endDate && logDate > endDate) matchDate = false;
    }

    return matchSearch && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((logPage - 1) * LOGS_PER_PAGE, logPage * LOGS_PER_PAGE);

  // Reset page on filter change
  useEffect(() => { setLogPage(1); }, [searchQuery, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gp-blue">
            <Lock className="text-gp-blue" />
            Deletion Audit History
          </h2>
          <p className="text-sm text-gp-blue/60 font-medium mt-1">Audit trail of all deleted transaction records</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-2 bg-white rounded-xl border border-black/5 hover:bg-gp-light transition-all text-gp-blue shadow-sm"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gp-blue/30 group-focus-within:text-gp-orange transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search by Tracking #, Admin, or Original User..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/5 bg-gp-light/50 text-sm focus:outline-none focus:ring-2 focus:ring-gp-orange/20 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-gp-light/50 p-1 rounded-2xl border border-black/5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white transition-all">
              <span className="text-[9px] font-black text-gp-blue/30 uppercase tracking-tighter">From</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-gp-blue focus:outline-none w-28"
              />
            </div>
            <div className="w-[1px] h-4 bg-black/5"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white transition-all">
              <span className="text-[9px] font-black text-gp-blue/30 uppercase tracking-tighter">To</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-gp-blue focus:outline-none w-28"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 bg-gp-light/30">
                <th className="p-5 text-xs font-black uppercase tracking-widest text-gp-blue/40">Deleted Info</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-gp-blue/40">Original Record</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-gp-blue/40">Cost Saved</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-gp-blue/40">Reason for Deletion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gp-blue/30 font-bold italic">
                    {loading ? "Loading audit trail..." : "No matching deletion logs found."}
                  </td>
                </tr>
              ) : (
                paginatedLogs.map(log => {
                  const orig = log.original_transaction || {};
                  return (
                    <tr key={log.id} className="hover:bg-gp-light/20 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-gray-900">{log.deleted_by_name}</p>
                        <p className="text-[10px] font-bold text-gp-blue/40 uppercase tracking-widest mt-0.5">
                          {log.deleted_at ? formatDate(log.deleted_at).toLocaleString() : 'N/A'}
                        </p>
                      </td>
                      <td className="p-5">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-gp-orange uppercase tracking-widest">Tracking No:</p>
                          <p className="text-sm font-bold text-gp-blue">{orig.tracking_number}</p>
                          <p className="text-[10px] font-medium text-gray-500 uppercase italic">
                            Originally By: {orig.user_name} ({orig.post_office})
                          </p>
                        </div>
                      </td>
                      <td className="p-5">
                         <p className="text-sm font-black text-gray-900 uppercase">
                           {orig.currency} {(orig.total_cost || 0).toFixed(2)}
                         </p>
                      </td>
                      <td className="p-5">
                        <div className="max-w-xs">
                           <p className="text-sm font-medium text-gray-700 bg-red-50/50 p-3 rounded-xl border border-red-100/50 italic">
                             "{log.reason}"
                           </p>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      {filteredLogs.length > LOGS_PER_PAGE && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-black/5">
          <p className="text-xs font-bold text-gp-blue/40">
            Showing {(logPage - 1) * LOGS_PER_PAGE + 1}–{Math.min(logPage * LOGS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} logs
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setLogPage(p => Math.max(1, p - 1))} 
              disabled={logPage === 1}
              className="p-2 rounded-lg hover:bg-gp-light disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} className="text-gp-blue" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - logPage) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gp-blue/30">...</span>}
                    <button 
                      onClick={() => setLogPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${logPage === p ? 'bg-gp-orange text-white shadow-md' : 'text-gp-blue hover:bg-gp-light'}`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            <button 
              onClick={() => setLogPage(p => Math.min(totalPages, p + 1))} 
              disabled={logPage === totalPages}
              className="p-2 rounded-lg hover:bg-gp-light disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} className="text-gp-blue" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'OPERATIONS',
    post_office: ''
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 25;
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [resetPwdUser, setResetPwdUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    setFetchLoading(true);
    setFetchError('');
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'LIST_USERS' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch users');

      const rows = data.users || [];

      // Sort by created_at descending
      rows.sort((a: any, b: any) => {
        try {
          const timeA = a.created_at && typeof a.created_at.toMillis === 'function' ? a.created_at.toMillis()
            : (a.created_at?._seconds ? a.created_at._seconds * 1000 : (a.created_at || 0));
          const timeB = b.created_at && typeof b.created_at.toMillis === 'function' ? b.created_at.toMillis()
            : (b.created_at?._seconds ? b.created_at._seconds * 1000 : (b.created_at || 0));
          return timeB - timeA;
        } catch (e) {
          return 0;
        }
      });

      setUsers(rows);
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || 'Failed to fetch users');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to page 1 when search term changes
  useEffect(() => { setUserPage(1); }, [searchTerm]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!newUser.post_office.trim()) {
        setError('Please select a Post Office branch.');
        setLoading(false);
        return;
      }
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      // Before sending, append the domain
      const fullEmail = `${newUser.email.trim().toLowerCase()}@ghanapost.com.gh`;

      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newUser, email: fullEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      // Optimistically add the new user to the local list so they appear instantly
      const optimisticUser = {
        id: data.uid,
        full_name: newUser.full_name,
        email: fullEmail,
        role: newUser.role,
        post_office: newUser.post_office,
        is_active: 1,
        created_at: null
      };
      setUsers(prev => [optimisticUser, ...prev]);

      setNewUser({ full_name: '', email: '', password: '', role: 'OPERATIONS', post_office: '' });
      setSuccessMsg('User successfully created!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = () => {
    setShowCleanupModal(true);
  };

  const executeCleanup = async () => {
    setShowCleanupModal(false);
    setLoading(true);
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'CLEANUP_GHOSTS' })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Cleanup failed');

      setSuccessMsg(`Cleanup complete! Removed ${result.deletedCount} ghost users.`);
      setTimeout(() => setSuccessMsg(''), 5000);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, targetUid: string, actionData?: any) => {
    if (action === 'DELETE_USER' && !window.confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, targetUid, data: actionData })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Action failed');

      if (action === 'DELETE_USER') {
        setUsers(prev => prev.filter(u => u.id !== targetUid));
      } else if (action === 'TOGGLE_STATUS') {
        setUsers(prev => prev.map(u => u.id === targetUid ? { ...u, is_active: result.newStatus } : u));
      } else if (action === 'EDIT_USER') {
        setUsers(prev => prev.map(u => u.id === targetUid ? { ...u, ...actionData } : u));
        setEditingUserId(null);
      } else if (action === 'RESET_PASSWORD') {
        alert('Password successfully reset!');
        setResetPwdUser(null);
        setNewPassword('');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.post_office || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create User Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gp-blue">
              <Plus className="text-gp-blue" />
              Add New User
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gp-blue/40 ml-1 flex items-center gap-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  placeholder="Full Name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-orange/20 transition-all font-medium text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-gp-blue/40 ml-1 flex items-center gap-1">Email Address <span className="text-red-500">*</span></label>
                <div className="flex items-stretch rounded-xl border border-black/10 overflow-hidden focus-within:ring-2 focus-within:ring-gp-blue/10 transition-all bg-white">
                  <input
                    placeholder="Username"
                    value={newUser.email}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/\s/g, '').replace(/@/g, '');
                      setNewUser({ ...newUser, email: val });
                    }}
                    className="flex-1 px-4 py-2 border-none focus:outline-none text-sm placeholder:text-gray-300"
                    required
                  />
                  <div className="px-3 py-2 bg-gp-light text-gp-blue/40 font-bold text-[11px] flex items-center border-l border-black/5 whitespace-nowrap">
                    @ghanapost.com.gh
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gp-blue/40 ml-1 flex items-center gap-1">Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-orange/20 transition-all font-medium text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gp-blue/40 ml-1 flex items-center gap-1">Role <span className="text-red-500">*</span></label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-orange/20 transition-all font-medium text-sm"
                >
                  <option value="OPERATIONS">Operations</option>
                  <option value="FINANCE">Finance</option>
                  <option value="IT_UNIT">IT Unit</option>
                  <option value="AUDIT">Audit/Compliance</option>
                  <option value="POSTMASTER">Postmaster</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <div className="space-y-0.5">
                <AutocompleteInput
                  label={<>Post Office Branch <span className="text-red-500">*</span></>}
                  placeholder="Search or Select Branch..."
                  value={newUser.post_office}
                  onChange={(val) => setNewUser({ ...newUser, post_office: val })}
                  onSelect={(val) => setNewUser({ ...newUser, post_office: val })}
                  options={[
                    "GENERAL POST OFFICE", "ARTS CENTRE POST OFFICE", "31ST DEC. MKT POST OFFICE", "EXAM COUNCIL POST OFFICE",
                    "ADABRAKA POST OFFICE", "JAMES TOWN POST OFFICE", "TUC POST OFFICE", "MAMPROBI POST OFFICE", "MINISTRIES POST OFFICE",
                    "SPORTS STADIUM POST OFFICE (ACCRA)", "VALLEY VIEW POST OFFICE", "CASTLE POST OFFICE", "LA POST OFFICE",
                    "OSU POST OFFICE", "TESHIE NUNGUA ESTATE P.OFFICE", "TESHIE POST OFFICE", "TRADE FAIR POST OFFICE",
                    "KOTOKA INTER. AIRPORT P.O", "Airport Transhipment", "BURMA CAMP POST OFFICE", "MADINA POST OFFICE",
                    "ABOKOBI POST OFFICE", "DODOWA POST OFFICE", "NUNGUA POST OFFICE", "STATE HOUSE", "ACCRA NORTH POST OFFICE",
                    "CANTONMENTS POST OFFICE", "LEGON POST OFFICE", "NIMA POST OFFICE", "ACCRA NEW TOWN POST OFF.", "ACHIMOTA POST OFFICE",
                    "ALAJO CONTAINER POST OFFICE", "AMASAMAN POST OFFICE", "OFANKOR POST OFFICE", "MILE 7 CONTAINER POST OFFICE",
                    "TAIFA CONTAINER POST OFFICE", "ACHIMOTA MARKET POST OFFICE", "KOTOBABI CONTAINER POST OFFICE", "KANDA POST OFFICE",
                    "ADENTA POST OFFICE", "KANESHIE POST OFFICE", "DANSOMAN ESTATE POST OFFICE", "KORLE- BU POST OFFICE",
                    "DANSOMAN COMMUNITY P.O.", "ABEKA POST OFFICE", "MALLAM POST OFFICE", "ABOSSEY OKAI POST OFFICE", "DARKUMAN POST OFFICE",
                    "S.T.C. CONTAINER POST OFFICE", "ODORKOR CONTAINER POST OFFICE", "WEIJA GICEL POST OFFICE", "Lartebiokorshie Post Office",
                    "NII BOI TOWN POST OFFICE", "TEMA COM 1 POST OFFICE", "TEMA COMM. 2 POST OFFICE", "TEMA COMM. 7 POST OFFICE",
                    "TEMA COMM. 11 POST OFFICE", "SAKUMONO POST OFFICE", "Ashiaman Post Office", "VALCO FLATS POST OFFICE",
                    "ADA FOAH POST OFFICE", "PRAMPRAM POST OFFICE", "SPINTEX ROAD", "TEMA NEW TOWN POST OFFICE", "TEMA SHOPPING CENTRE P. OFF",
                    "Koforidua Post Office", "AKOSOMBO POST OFFICE", "ABURI POST OFFICE", "AKROPONG AKWAPIM P.OFFICE", "AFIDWASE (ER) POST OFFICE",
                    "ASESEWA POST OFFICE", "MAMPONG -AKWAPIM P.OFFICE", "SOMANYA POST OFFICE", "ADUKROM POST OFFICE", "MAMFE POST OFFICE",
                    "LARTEH POST OFFICE", "AKUSE POST OFFICE", "ANUM POST OFFICE", "JUMAPO POST OFFICE", "MANGOASE POST OFFICE",
                    "CHARLIE JUNCTION POST OFFICE", "ODUMASI KROBO POST OFFICE", "Oyoko Post Office", "NEW AKRADE POST OFFICE",
                    "APEGUSO POST OFFICE", "ASOKORE (ER) POST OFFICE", "MPRAESO POST OFFICE", "ANYINAM POST OFFICE", "NKAWKAW POST OFFICE",
                    "DONKOKROM POST OFFICE", "ABETIFI POST OFFICE", "NKWATIA POST OFFICE", "Obo Post Office", "KWABENG POST OFFICE",
                    "KWAHU PRASO POST OFFICE", "KWAHU TAFO POST OFFICE", "Osino Post Office", "NEW ABIREM POST OFFICE", "BEGORO POST OFFICE",
                    "Suhum Post Office", "ASAMANKESE POST OFFICE", "New Tafo (Eastern) Post Office", "Kukurantumi Post Ofice", "BOSUSO POST OFFICE",
                    "KIBI POST OFFICE", "ASIAKWA POST OFFICE", "MEPOM POST OFFICE", "Old Tafo Post Office", "ADEISO POST OFFCIE",
                    "NSAWAM POST OFFICE", "APEDWA POST OFFICE", "KRABOA COALTAR POST OFFICE", "Bunso Post Office", "ADOAGYIRI POST OFFICE",
                    "ODA POST OFFICE", "AKWATIA POST OFFICE", "AKIM SWEDRU POST OFFICE", "KADE POST OFFICE", "AKROSO POST OFFICE",
                    "AKIM MANSO POST OFFICE", "ASUOM POST OFFICE", "ACHIASE POST OFFICE", "Ho Post Office", "Mawuli Post Office",
                    "DZODZE POST OFFICE", "Peki Post Office", "AMEDZOFE POST OFFICE", "Tsito Post Office", "AGOTIME-KPETOE POST OFFICE",
                    "JUAPONG POST OFFICE", "Vane Post Office", "KPEDZE POST OFFICE", "KPEVE POST OFFICE", "KPANDO POST OFFICE",
                    "HOHOE POST OFFICE", "KETE-KRACHI POST OFFICE", "NKONYA-AHENKRO POST OFFICE", "Vakpo Post Office", "WORAWORA POST OFFICE",
                    "JASIKAN POST OFFICE", "KADJEBI POST OFFICE", "ANFOEGA POST OFFICE", "DODI-PAPASE POST OFFICE", "GOLOKWATI POST OFFICE",
                    "NKWANTA POST OFFICE", "AGBOSOME POST OFFICE", "DENU POST OFFICE", "AKATSI POST OFFICE", "KETA POST OFFICE",
                    "ADIDOME POST OFFICE", "AFLAO POST OFFICE", "SOGAKOFE POST OFFICE", "ANLOGA POST OFFICE", "Adisadel Post Office",
                    "DUNKWA ON OFFIN POST OFFICE", "Elmina Post Office", "ASSIN-FOSU POST OFFICE", "Kotokuraba Post Office", "MANKESSIM POST OFFICE",
                    "Twifo-Praso Post Office", "Cape Coast Post Office", "ANOMABU POST OFFICE", "ABURA DUNKWA POST OFFICE", "KOMENDA POST OFFICE",
                    "SALTPOND POST OFFICE", "SWEDRU POST OFFICE", "BAWJIASE POST OFFICE", "BREMAN ESIKUMA POST OFFICE", "Winneba Post Office",
                    "KASOA NYANYANU POST OFFICE", "MARKET AVENUE/SWEDRU", "KOJO BEEDU POST OFFICE", "AJUMAKO POST OFFICE", "APAM POST OFFICE",
                    "BISEASE POST OFFICE", "ESIAM POST OFFICE", "KWANYAKU POST OFFICE", "AGONA DUAKWA POST OFFICE", "ANKAMU POST OFFICE",
                    "Pinanko Post Office", "Odoben Post Office", "SENYA BEREKU", "NSABA POST OFFICE", "Nyakrom Post Office", "ODUPONG KPEHE",
                    "TAKORADI POST OFFICE", "TARKWA POST OFFICE", "AIYINASI POST OFFICE", "AXIM POST OFFICE", "HALF ASSINI POST OFFICE",
                    "Market Circle Post Office", "Lagoon Road Post Office", "AXIM ROAD P.OFFICE, TAKORADI", "Effia Nkwanta Post Office",
                    "Effiakuma Post Office", "ELUBO POST OFFICE", "KETAN CONTAINER POST OFFICE", "Kojokrom Container Post Office", "Shama Post Office",
                    "ABOSO POST OFFICE", "NSUTA WASSAW POST OFFICE", "ESIAMA POST OFFICE", "BEYIN POST OFFICE", "Kwesimintsim Post Office",
                    "BONYERE POST OFFICE", "Sekondi Post Office", "NKROFUL POST OFFICE", "DABOASE POST OFFICE", "Apowa Post Office",
                    "SEFWI WIAWSO POST OFFICE", "BIBIANI POST OFFICE", "ENCHI POST OFFICE", "SEFWI BEKWAI POST OFFICE", "PRESTEA POST OFFICE",
                    "ASANKRAGWA POST OFFICE", "BOGOSO POST OFFICE", "SAMREBOI POST OFFICE", "AWASO POST OFFICE", "AKROPONG WASSAW POST OFF.",
                    "HUNI VALLEY POST OFFICE", "ATIEKU POST OFFICE", "JUABESO POST OFFICE", "Kumasi General Post Office", "KEJETIA POST OFFICE",
                    "Fanti New Town Post Office", "AKUMADAN POST OFFICE", "OFFINSO POST OFFICE", "TEPA POST OFFICE", "Railways Container P.Office",
                    "Santasi Post Office", "Bantama Post Office", "Bohyen-Ampabame P.Office", "Kwadaso Post Office", "KWADASO ACADEMY POST OFFICE",
                    "NKAWIE POST OFFICE", "NKENKASU POST OFFICE", "Asuoyeboa Post Office", "AKROPONG KUMASI POST OFFICE", "Ahensan Post Office",
                    "Suame Post Office", "Sports Stadium Post Office (Kumasi)", "University Post Office KNUST", "Ashanti New Town P.Office",
                    "Aboabo Container Post Office", "MANPONTEN POST OFFICE", "ANLOGA CONT. ASHANTI POST OFFICE", "CHIRAPATRE CONT. POST OFFICE",
                    "Tafo Asante Post Office", "New Tafo (Ashanti) Post Office", "Asawase Post Office", "SEPE APAMPINAM POST OFFICE",
                    "KONONGO POST OFFICE", "AGOGO POST OFFICE", "Ejisu Post Office", "JUANSA POST OFFICE", "BOMPATA POST OFFICE",
                    "JUASO POST OFFICE", "BOMFA POST OFFICE", "ODUMASI POST OFFICE", "BEKWAI ASHANTI POST OFFICE", "OBUASI POST OFFICE",
                    "FOMENA POST OFFICE", "AKROKERI POST OFFICE", "AKROPONG BEKWAI POST OFFICE", "AKROFUOM POST OFFICE", "JACHI POST OFFICE",
                    "MAMPONG-ASHANTI POST OFFICE", "AGONA (ASHANTI) POST OFFICE", "JAMASI (ASHANTI) POST OFFICE", "EJURA POST OFFICE",
                    "BONWIRE POST OFFICE", "NSUTA-ASH. POST OFFICE", "KUMAWU POST OFFICE", "EFFIDUASI (ASH) POST OFFICE", "JUABEN-ASHANTI POST OFFICE",
                    "NEW EDUBIASE", "Sunyani Post Office", "BEREKUM POST OFFICE", "NSOATRE POST OFFICE", "GYAPEKROM POST OFFICE", "DROBO POST OFFICE",
                    "DORMAA AHENKRO POST OFFICE", "CHIRAA POST OFFICE", "SAMPA POST OFFICE", "WAMFIE POST OFFICE", "BECHEM POST OFFICE",
                    "MIM-AHAFO POST OFFICE", "HWIDIEM POST OFFICE", "GOASO POST OFFICE", "KUKUOM POST OFFICE", "KENYASI POST OFFICE",
                    "DUAYAW NKWANTA POST OFFICE", "AKYERENSUA POST OFFICE", "Techimentia Post Office", "NKORANZA POST OFFICE", "KINTAMPO POST OFFICE",
                    "ATEBUBU POST OFFICE", "PRANG POST OFFICE", "TECHIMAN POST OFFICE", "WENCHI POST OFFICE", "YEJI POST OFFICE", "JEMA POST OFFICE",
                    "Tamale Gen. Post Office", "EDUCATION RIDGE POST OFFICE", "YENDI POST OFFICE", "DAMONGO POST OFFICE", "SALAGA POST OFFICE",
                    "BIMBILLA POST OFFICE", "BOLE POST OFFICE", "GAMBAGA POST OFFICE", "WALEWALE POST OFFICE", "Savulugu Post Office",
                    "Bolgatanga Post Office", "BAWKU POST OFFICE", "NAVRONGO POST OFFICE", "PAGA POST OFFICE", "SANDEMA POSTAL AGENCY",
                    "PUSIGA POSTAL AGENCY", "ZEBILLA POSTAL AGENCY", "GARU POSTAL AGENCY", "BONGO POSTAL AGENCY", "WA (MAIN) POST OFFICE",
                    "LAWRA POST OFFICE", "TUMU POST OFFICE", "JIRAPA POST OFFICE", "NADOWLI POST OFFICE", "HAMILE POST OFFICE", "NANDOM POST OFFICE",
                    "BABILE POSTAL AGENCY", "FUNSI POSTAL AGENCY", "FIELMUO POSTAL AGENCY", "TAIFA-BURKINA POST OFFICE", "DOME-KWABENYA POST OFFICE",
                    "KPANDAI POST OFFICE", "Madina Redco Post Office", "BIG ADA POST OFFICE", "KPONE POST OFFICE", "GOMOA ESHIEM POST OFFICE",
                    "GOMOA ODINA POST OFFICE", "UNIVERSITY (CAPE COAST) POST OFFICE", "NEW ODUMAN POST OFFICE", "Head-Quarters",
                    "ASAMANG (ASHANTI) POST OFFICE", "KWAMANG (ASHANTI) POST OFFICE", "SEKYEDUMASE POST OFFICE", "WIAMOASE (ASHANTI) POST OFFICE",
                    "NYINAHIN POST OFFICE", "BOAMANG POST OFFICE", "Prempeh College Post Office", "ADAWSO POST OFFICE", "Osiem Post Office",
                    "MANYA KPONGUNOR POST OFFICE", "ASOKORE (ASH) POST OFFICE", "TONGO POSTAL AGENCY", "UDS Post Office (Wa)", "ABOR POST OFFICE",
                    "APESOKUBI POST OFFICE", "KOKOFU POST OFFICE", "Takoradi Poly Post Office", "NSUAEM POST OFFICE", "AGONA AHANTA POSTAL AGENCY",
                    "BUIPE POST OFFICE", "UDS-TAMALE POST OFFICE", "BISCO POST OFFICE", "NORTH KANESHIE POST OFFICE", "DAMBAI POST OFFICE",
                    "GHANASS", "CENTRAL UNIVERSITY POST OFFICE", "PINANKO POST OFFICE", "GOMOA AFRANSI", "DWENASE POST OFFICE", "SAWLA POST OFFICE",
                    "TUNA POST OFFICE", "GWOLLU POST OFFICE", "WECHAU POST OFFICE", "WEST AFRICAN SHS", "W", "OYIBI POST OFFICE", "BAMAHU CIC POST OFFICE",
                    "UEW-K POST OFFICE", "HO STADIUM POST OFFICE", "AIRPORT KUMASI", "DOMPOASE POST OFFIICE", "ONLINE SALES", "JUMIA GHANA OFFICE",
                    "DAWHENYA POST OFFICE", "BULK MAIL", "ABURI CRAFT VILLAGE POST OFFICE", "TRAINING1 POST OFFICE", "TRAINING2 POST OFFICE",
                    "ANKAFUL PSYCHIATRIC POST OFFICE", "SPEEDLINK", "MANKRASO POST OFFICE", "ABUAKWA POST OFFICE", "ODUMASE SUNYANI POST OFFICE",
                    "LINK", "SCUTTLE PARCEL BOX", "OFOASE AYIREBI POST OFFICE", "KOMFO ANOKYE TEACHING HOSPITAL", "DHL WAREHOUSE", "DVLA HEAD OFFICE",
                    "STANDARD CHARTERED", "PASSPORT OFFICE", "WA POST OFFICE", "SEFWI AKONTOMBRA POST OFFICE"
                  ].sort().map(po => ({ label: po, sub: '', original: po }))}
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              {successMsg && (
                <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-green-200">
                  <CheckCircle2 size={16} />
                  {successMsg}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gp-orange text-white py-3 rounded-xl font-bold hover:bg-gp-orange/90 transition-all disabled:opacity-50 shadow-lg shadow-gp-orange/20"
              >
                Create User Account
              </button>
            </form>
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gp-blue">
                <Users className="text-gp-blue" />
                System Users
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={handleCleanup}
                  disabled={loading || fetchLoading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-gp-light text-gp-blue hover:bg-gp-blue/5 transition-all border border-black/5"
                  title="Remove records for deleted accounts"
                >
                  <RefreshCcw size={14} className={(loading || fetchLoading) ? 'animate-spin' : ''} />
                  Sync & Cleanup
                </button>
                <input
                  type="text"
                  placeholder="Search by name, email, or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 rounded-xl text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/20 transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gp-blue/40">User</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gp-blue/40">Role</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gp-blue/40">Branch</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gp-blue/40">Status</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gp-blue/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {fetchLoading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gp-blue/40 font-bold italic animate-pulse">
                        Loading users...
                      </td>
                    </tr>
                  ) : fetchError ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-red-500 font-bold italic">
                        Error: {fetchError}
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gp-blue/40 font-bold italic">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : paginatedUsers.map((u) => (
                    <tr key={u.id} className="group hover:bg-gp-light transition-colors">
                      {editingUserId === u.id ? (
                        <>
                          <td className="py-4 space-y-2 pr-4">
                            <input
                              value={editForm.full_name}
                              onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                              className="w-full px-2 py-1 rounded border border-black/10 text-sm"
                            />
                            <p className="text-xs text-gp-blue/60 pl-2">{u.email}</p>
                          </td>
                          <td className="py-4 pr-4">
                            <select
                              value={editForm.role}
                              onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                              className="w-full px-2 py-1 rounded border border-black/10 text-sm"
                            >
                              <option value="OPERATIONS">OPERATIONS</option>
                              <option value="FINANCE">FINANCE</option>
                              <option value="IT_UNIT">IT UNIT</option>
                              <option value="AUDIT">AUDIT/COMPLIANCE</option>
                              <option value="POSTMASTER">POSTMASTER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="py-4 pr-4">
                            <AutocompleteInput
                              label=""
                              placeholder="Search branch..."
                              value={editForm.post_office || ''}
                              onChange={(val) => setEditForm({ ...editForm, post_office: val })}
                              onSelect={(val) => setEditForm({ ...editForm, post_office: val })}
                              options={[
                                "GENERAL POST OFFICE", "ARTS CENTRE POST OFFICE", "31ST DEC. MKT POST OFFICE", "EXAM COUNCIL POST OFFICE",
                                "ADABRAKA POST OFFICE", "JAMES TOWN POST OFFICE", "TUC POST OFFICE", "MAMPROBI POST OFFICE", "MINISTRIES POST OFFICE",
                                "SPORTS STADIUM POST OFFICE (ACCRA)", "VALLEY VIEW POST OFFICE", "CASTLE POST OFFICE", "LA POST OFFICE",
                                "OSU POST OFFICE", "TESHIE NUNGUA ESTATE P.OFFICE", "TESHIE POST OFFICE", "TRADE FAIR POST OFFICE",
                                "KOTOKA INTER. AIRPORT P.O", "Airport Transhipment", "BURMA CAMP POST OFFICE", "MADINA POST OFFICE",
                                "ABOKOBI POST OFFICE", "DODOWA POST OFFICE", "NUNGUA POST OFFICE", "STATE HOUSE", "ACCRA NORTH POST OFFICE",
                                "CANTONMENTS POST OFFICE", "LEGON POST OFFICE", "NIMA POST OFFICE", "ACCRA NEW TOWN POST OFF.", "ACHIMOTA POST OFFICE",
                                "ALAJO CONTAINER POST OFFICE", "AMASAMAN POST OFFICE", "OFANKOR POST OFFICE", "MILE 7 CONTAINER POST OFFICE",
                                "TAIFA CONTAINER POST OFFICE", "ACHIMOTA MARKET POST OFFICE", "KOTOBABI CONTAINER POST OFFICE", "KANDA POST OFFICE",
                                "ADENTA POST OFFICE", "KANESHIE POST OFFICE", "DANSOMAN ESTATE POST OFFICE", "KORLE- BU POST OFFICE",
                                "DANSOMAN COMMUNITY P.O.", "ABEKA POST OFFICE", "MALLAM POST OFFICE", "ABOSSEY OKAI POST OFFICE", "DARKUMAN POST OFFICE",
                                "S.T.C. CONTAINER POST OFFICE", "ODORKOR CONTAINER POST OFFICE", "WEIJA GICEL POST OFFICE",
                                "TEMA COM 1 POST OFFICE", "TEMA COMM. 2 POST OFFICE", "TEMA NEW TOWN POST OFFICE",
                                "TAKORADI POST OFFICE", "TARKWA POST OFFICE", "AXIM POST OFFICE",
                                "Kumasi General Post Office", "KEJETIA POST OFFICE", "OBUASI POST OFFICE",
                                "Tamale Gen. Post Office", "YENDI POST OFFICE", "Bolgatanga Post Office",
                                "BAWKU POST OFFICE", "NAVRONGO POST OFFICE", "WA (MAIN) POST OFFICE",
                                "Sunyani Post Office", "BEREKUM POST OFFICE", "TECHIMAN POST OFFICE",
                                "Koforidua Post Office", "AKOSOMBO POST OFFICE", "ABURI POST OFFICE",
                                "Ho Post Office", "HOHOE POST OFFICE", "KETA POST OFFICE", "AFLAO POST OFFICE",
                                "Cape Coast Post Office", "Winneba Post Office", "SALTPOND POST OFFICE",
                                "Head-Quarters", "ONLINE SALES", "SPEEDLINK"
                              ].sort().map(po => ({ label: po, sub: '', original: po }))}
                            />
                          </td>
                          <td className="py-4">
                            <span className="text-xs font-medium text-gray-400">Editing</span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAction('EDIT_USER', u.id, editForm)} className="text-green-600 hover:bg-green-100 p-2 rounded-lg transition-colors" title="Save">
                                <Save size={16} />
                              </button>
                              <button onClick={() => setEditingUserId(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-lg transition-colors" title="Cancel">
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-4">
                            <p className="font-bold text-[#1a1a1a]">{u.full_name}</p>
                            <p className="text-xs text-gp-blue/60">{u.email}</p>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'OPERATIONS' ? 'bg-blue-100 text-blue-700' :
                                u.role === 'FINANCE' ? 'bg-green-100 text-green-700' :
                                  u.role === 'IT_UNIT' ? 'bg-orange-100 text-orange-700' :
                                    u.role === 'AUDIT' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-indigo-100 text-indigo-700'
                              }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-medium text-gp-blue">{u.post_office}</td>
                          <td className="py-4">
                            <span className={`flex items-center gap-1 text-xs font-bold ${(u.is_active === 0 || u.is_active === false) ? 'text-red-500' : 'text-green-600'}`}>
                              {(u.is_active === 0 || u.is_active === false) ? (
                                <>
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Deactivated
                                </>
                              ) : (
                                <>
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingUserId(u.id);
                                  setEditForm({ full_name: u.full_name, role: u.role, post_office: u.post_office });
                                }}
                                className="text-gp-blue hover:bg-gp-blue/10 p-2 rounded-lg transition-colors" title="Edit User">
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleAction('TOGGLE_STATUS', u.id)}
                                className={`${(u.is_active === 0 || u.is_active === false) ? 'text-green-600 hover:bg-green-100' : 'text-orange-500 hover:bg-orange-100'} p-2 rounded-lg transition-colors`}
                                title={(u.is_active === 0 || u.is_active === false) ? "Activate User" : "Deactivate User"}
                              >
                                {(u.is_active === 0 || u.is_active === false) ? <Power size={16} /> : <PowerOff size={16} />}
                              </button>
                              <button
                                onClick={() => {
                                  setResetPwdUser(u);
                                  setNewPassword('');
                                }}
                                className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition-colors" title="Reset Password">
                                <Lock size={16} />
                              </button>
                              <button
                                onClick={() => handleAction('DELETE_USER', u.id)}
                                className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Delete User">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* User List Pagination */}
            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-black/5">
                <p className="text-xs font-bold text-gp-blue/40">
                  Showing {(userPage - 1) * USERS_PER_PAGE + 1}–{Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1}
                    className="p-2 rounded-lg hover:bg-gp-light disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft size={14} className="text-gp-blue" />
                  </button>
                  {Array.from({ length: totalUserPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalUserPages || Math.abs(p - userPage) <= 1)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gp-blue/30">...</span>}
                        <button onClick={() => setUserPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${userPage === p ? 'bg-gp-orange text-white shadow-md' : 'text-gp-blue hover:bg-gp-light'}`}>
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                  <button onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))} disabled={userPage === totalUserPages}
                    className="p-2 rounded-lg hover:bg-gp-light disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronRight size={14} className="text-gp-blue" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Confirm Modal for Cleanup */}
      <AnimatePresence>
        {showCleanupModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowCleanupModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-black/5 w-full max-w-sm flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gp-blue">Confirm Cleanup</h3>
              <p className="text-sm font-medium text-gp-blue/60 leading-relaxed">
                This will find and remove 'ghost users' (Database records for deleted accounts). Proceed?
              </p>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setShowCleanupModal(false)}
                  className="flex-1 bg-gp-light text-gp-blue py-3 rounded-xl font-bold hover:bg-black/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeCleanup}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetPwdUser && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setResetPwdUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-black/5 w-full max-w-sm space-y-6"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
                  <Lock size={32} />
                </div>
                <h3 className="text-xl font-bold text-gp-blue">Reset Password</h3>
                <p className="text-sm font-medium text-gp-blue/60 leading-relaxed">
                  Enter a new temporary password for <span className="text-gp-blue font-bold">{resetPwdUser.full_name}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gp-blue/40 ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gp-blue/30 group-focus-within:text-gp-blue transition-colors" size={16} />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/20 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex w-full gap-3 pt-2">
                  <button
                    onClick={() => setResetPwdUser(null)}
                    className="flex-1 bg-gp-light text-gp-blue py-3 rounded-xl font-bold hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newPassword.length < 6) {
                        alert('Password must be at least 6 characters.');
                        return;
                      }
                      handleAction('RESET_PASSWORD', resetPwdUser.id, { password: newPassword });
                    }}
                    disabled={newPassword.length < 6 || loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// USER PERMISSION ROLE MANAGEMENT
// =========================================================
function UserPermissionRole() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'LIST_USERS' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
      setUsers(data.users || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdatePermissions = async (userId: string, permissions: any) => {
    setSaving(userId);
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'UPDATE_PERMISSIONS', targetUid: userId, data: { permissions } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions } : u));
      if (editUser?.id === userId) setEditUser({ ...editUser, permissions });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(null);
    }
  };

  const togglePage = (userId: string, currentPerms: any, page: string) => {
    const pages = currentPerms?.pages || ['dashboard', 'calculator', 'reports'];
    const newPages = pages.includes(page)
      ? pages.filter((p: string) => p !== page)
      : [...pages, page];

    handleUpdatePermissions(userId, { ...currentPerms, pages: newPages });
  };

  const setReportAccess = (userId: string, currentPerms: any, type: string) => {
    handleUpdatePermissions(userId, {
      ...currentPerms,
      reportAccess: type,
      accessibleUserIds: currentPerms?.accessibleUserIds || []
    });
  };

  const toggleAccessibleUser = (userId: string, currentPerms: any, targetUserId: string) => {
    const list = currentPerms?.accessibleUserIds || [];
    const newList = list.includes(targetUserId)
      ? list.filter((id: string) => id !== targetUserId)
      : [...list, targetUserId];

    handleUpdatePermissions(userId, { ...currentPerms, accessibleUserIds: newList });
  };

  const filteredUsers = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gp-blue">
            <ShieldCheck className="text-gp-blue" />
            User Permission Role
          </h2>
          <p className="text-sm text-gp-blue/60 font-medium mt-1">Manage what users can see or do in the system</p>
        </div>
        <div className="relative w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gp-blue/30 group-focus-within:text-gp-orange transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-black/5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gp-orange/10 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User List Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden flex flex-col max-h-[700px]">
          <div className="p-4 bg-gp-light/30 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gp-blue/40">Select User to Manage</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-black/5">
            {loading ? (
              <div className="p-12 text-center text-gp-blue/40 animate-pulse italic text-sm font-medium">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-gp-blue/40 italic text-sm font-medium">No users found.</div>
            ) : filteredUsers.map(u => (
              <button
                key={u.id}
                onClick={() => setEditUser(u)}
                className={`w-full p-4 flex items-center gap-3 transition-all hover:bg-gp-light ${editUser?.id === u.id ? 'bg-gp-orange/5 border-r-4 border-gp-orange' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${editUser?.id === u.id ? 'bg-gp-orange text-white' : 'bg-gp-light text-gp-blue/40'}`}>
                  {(u.full_name || u.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="text-left overflow-hidden">
                  <p className={`text-sm font-bold truncate ${editUser?.id === u.id ? 'text-gp-orange' : 'text-gp-blue'}`}>{u.full_name || 'No Name'}</p>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-gp-blue/40 truncate">{u.role} • {u.post_office}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Management Panel */}
        <div className="lg:col-span-8">
          {editUser ? (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-black/5 p-6 md:p-8 space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gp-orange/10 flex items-center justify-center font-black text-gp-orange text-xl uppercase">
                    {(editUser.full_name || editUser.email || 'U').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gp-blue">{editUser.full_name || 'Unnamed User'}</h3>
                    <p className="text-sm font-medium text-gp-blue/40">{editUser.email}</p>
                  </div>
                </div>
                {saving === editUser.id && (
                  <div className="flex items-center gap-2 text-gp-orange text-xs font-black uppercase tracking-widest animate-pulse">
                    <RefreshCcw size={12} className="animate-spin" /> Saving Changes
                  </div>
                )}
              </div>

              {/* Page Access */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gp-blue/60 border-b border-black/5 pb-2">Page Visibility & Access</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dashboard & Profile are locked */}
                  <div className="p-4 rounded-2xl bg-gp-light/50 border border-black/5 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={20} className="text-gp-blue" />
                      <span className="text-sm font-bold">Dashboard & Analytics</span>
                    </div>
                    <div className="w-10 h-5 bg-gp-blue/20 rounded-full flex items-center px-1">
                      <div className="w-3 h-3 bg-gp-blue rounded-full translate-x-5" />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gp-light/50 border border-black/5 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                      <UserCog size={20} className="text-gp-blue" />
                      <span className="text-sm font-bold">Manage Profile</span>
                    </div>
                    <div className="w-10 h-5 bg-gp-blue/20 rounded-full flex items-center px-1">
                      <div className="w-3 h-3 bg-gp-blue rounded-full translate-x-5" />
                    </div>
                  </div>

                  {/* Configurable Pages */}
                  <button
                    onClick={() => togglePage(editUser.id, editUser.permissions || {}, 'calculator')}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('calculator')
                      ? 'bg-gp-orange/5 border-gp-orange/20'
                      : 'bg-white border-black/5 hover:border-gp-blue/20'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calculator size={20} className={(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('calculator') ? 'text-gp-orange' : 'text-gp-blue/40'} />
                      <span className={`text-sm font-bold ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('calculator') ? 'text-gp-orange' : 'text-gp-blue/40 group-hover:text-gp-blue/60'}`}>Duty Calculator</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('calculator')
                      ? 'bg-gp-orange'
                      : 'bg-gray-200'
                      }`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('calculator') ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </div>
                  </button>

                  <button
                    onClick={() => togglePage(editUser.id, editUser.permissions || {}, 'reports')}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('reports')
                      ? 'bg-gp-orange/5 border-gp-orange/20'
                      : 'bg-white border-black/5 hover:border-gp-blue/20'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 size={20} className={(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('reports') ? 'text-gp-orange' : 'text-gp-blue/40'} />
                      <span className={`text-sm font-bold ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('reports') ? 'text-gp-orange' : 'text-gp-blue/40 group-hover:text-gp-blue/60'}`}>Transaction Reports</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('reports')
                      ? 'bg-gp-orange'
                      : 'bg-gray-200'
                      }`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${(editUser.permissions?.pages || ['dashboard', 'calculator', 'reports']).includes('reports') ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Report Access Level */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gp-blue/60 border-b border-black/5 pb-2">Data Visibility (Reports & Analytics)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'OWN', label: 'Own Records', desc: 'Can only see reports they created' },
                    { id: 'ALL', label: 'All Records', desc: 'Full access to all branch data' },
                    { id: 'SPECIFIC', label: 'Specific Users', desc: 'Access to selected users only' },
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setReportAccess(editUser.id, editUser.permissions || {}, option.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${(editUser.permissions?.reportAccess || 'OWN') === option.id
                        ? 'bg-gp-blue border-gp-blue text-white shadow-lg'
                        : 'bg-white border-black/5 hover:bg-gp-light text-gp-blue'
                        }`}
                    >
                      <p className="font-bold text-sm tracking-tight">{option.label}</p>
                      <p className={`text-[10px] mt-1 font-medium leading-relaxed ${(editUser.permissions?.reportAccess || 'OWN') === option.id ? 'text-white/60' : 'text-gp-blue/40'}`}>
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Specific User List for access */}
                {(editUser.permissions?.reportAccess === 'SPECIFIC') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 p-6 bg-gp-light rounded-3xl border border-gp-blue/10 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gp-blue/40">Visible users in reports:</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] font-black text-gp-orange bg-gp-orange/10 px-2 py-1 rounded-lg">
                            {(editUser.permissions?.accessibleUserIds || []).length} SELECTED
                          </span>
                        </div>
                      </div>

                      <div className="relative w-full md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gp-blue/30 group-focus-within:text-gp-orange transition-colors" size={14} />
                        <input
                          type="text"
                          placeholder="Search users to add..."
                          className="w-full pl-9 pr-4 py-2 rounded-xl border border-black/5 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-gp-orange/10 transition-all font-medium"
                          onChange={(e) => {
                            const term = e.target.value.toLowerCase();
                            const els = document.querySelectorAll('.user-select-item');
                            els.forEach((el: any) => {
                              const name = el.getAttribute('data-name')?.toLowerCase() || '';
                              const email = el.getAttribute('data-email')?.toLowerCase() || '';
                              if (name.includes(term) || email.includes(term)) {
                                el.style.display = 'flex';
                              } else {
                                el.style.display = 'none';
                              }
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {users.filter(u => u.id !== editUser.id).map(u => (
                        <button
                          key={u.id}
                          data-name={u.full_name}
                          data-email={u.email}
                          onClick={() => toggleAccessibleUser(editUser.id, editUser.permissions, u.id)}
                          className="user-select-item flex items-center gap-3 p-3 rounded-2xl transition-all aria-pressed:bg-gp-blue aria-pressed:text-white aria-pressed:shadow-md bg-white border border-black/5 text-gp-blue hover:border-gp-blue/20"
                          aria-pressed={(editUser.permissions?.accessibleUserIds || []).includes(u.id)}
                          style={{
                            backgroundColor: (editUser.permissions?.accessibleUserIds || []).includes(u.id) ? '#0B1B3D' : '',
                            color: (editUser.permissions?.accessibleUserIds || []).includes(u.id) ? 'white' : ''
                          }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${(editUser.permissions?.accessibleUserIds || []).includes(u.id) ? 'bg-white/20' : 'bg-gp-light'
                            }`}>
                            {(u.full_name || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate tracking-tight">{u.full_name || u.email}</p>
                            <p className={`text-[9px] font-black uppercase tracking-tighter ${(editUser.permissions?.accessibleUserIds || []).includes(u.id) ? 'text-white/60' : 'text-gp-blue/40'
                              }`}>{u.post_office}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="pt-6 border-t border-black/5 flex items-center gap-2 text-gp-blue/40">
                <AlertCircle size={14} className="shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-wider">Changes take effect after user reloads the application.</p>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] bg-gp-light/30 rounded-4xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center p-20 text-center space-y-6">
              <div className="w-24 h-24 rounded-4xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-gp-blue/10">
                <ShieldCheck size={64} strokeWidth={1.5} />
              </div>
              <div className="max-w-xs">
                <h3 className="font-black text-xl text-gp-blue uppercase tracking-tight">Access Control</h3>
                <p className="text-sm font-medium text-gp-blue/40 mt-2 leading-relaxed">Select a user from the directory to manage their specific permissions and data visibility settings.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// USER SETTINGS COMPONENT
// =========================================================
function UserSettings({ user }: { user: any }) {
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    if (pwForm.newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    setPwLoading(true);
    setPwMsg(null);
    try {
      const { signInWithEmailAndPassword, updatePassword } = await import('firebase/auth');
      // Re-authenticate first
      await signInWithEmailAndPassword(auth, auth.currentUser!.email!, pwForm.current);
      await updatePassword(auth.currentUser!, pwForm.newPw);
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.code === 'auth/wrong-password' ? 'Current password is incorrect.' : err.message });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gp-blue">My Profile</h1>
        <p className="text-sm text-gp-blue/50 mt-1">Your account details and password settings.</p>
      </div>

      {/* Read-Only Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
        <h2 className="text-base font-bold text-gp-blue flex items-center gap-2 mb-5">
          <UserCog size={18} className="text-gp-orange" />
          Profile Information
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gp-light rounded-2xl border border-black/5">
            <div className="w-12 h-12 rounded-full bg-gp-orange/10 flex items-center justify-center font-black text-gp-orange text-lg uppercase shrink-0">
              {(user.full_name || user.email || 'U').charAt(0)}
            </div>
            <div>
              <p className="font-bold text-[#1a1a1a] text-base">{user.full_name || 'No Name Set'}</p>
              <p className="text-sm text-gp-blue/60">{user.email || auth.currentUser?.email || ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gp-light rounded-2xl border border-black/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gp-blue/40 mb-1">Role</p>
              <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter bg-blue-100 text-blue-700">
                {user.role || 'OPERATIONS'}
              </span>
            </div>
            <div className="p-4 bg-gp-light rounded-2xl border border-black/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gp-blue/40 mb-1">Post Office Branch</p>
              <p className="text-sm font-bold text-gp-blue">{user.post_office || 'Not Assigned'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-600 font-medium">
            <ShieldCheck size={14} className="shrink-0" />
            Your profile details are managed by your administrator. Contact admin to make changes.
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
        <h2 className="text-base font-bold text-gp-blue flex items-center gap-2 mb-5">
          <Lock size={18} className="text-gp-orange" />
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Current Password</label>
            <input type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light focus:outline-none focus:ring-2 focus:ring-gp-blue/10" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">New Password</label>
            <input type="password" value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light focus:outline-none focus:ring-2 focus:ring-gp-blue/10" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light focus:outline-none focus:ring-2 focus:ring-gp-blue/10" required />
          </div>
          {pwMsg && (
            <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${pwMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {pwMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              {pwMsg.text}
            </div>
          )}
          <button type="submit" disabled={pwLoading} className="w-full bg-gp-blue text-white py-2.5 rounded-xl font-bold hover:bg-gp-blue/90 transition-all disabled:opacity-50">
            {pwLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================
// ADMIN SETTINGS COMPONENT
// =========================================================
function AdminSettings({ user, setView }: { user: any; setView: (v: string) => void }) {
  const [profileForm, setProfileForm] = useState({ full_name: user.full_name || '', post_office: user.post_office || '' });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userFetchError, setUserFetchError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
        const res = await fetch('/api/admin/manage-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ action: 'LIST_USERS' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch users');

        const uList = data.users || [];
        setUsers(uList);
      } catch (err: any) {
        console.error(err);
        setUserFetchError(err.message || 'Failed to fetch users');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchStats();
  }, []);

  const POST_OFFICES = [
    "GENERAL POST OFFICE", "ARTS CENTRE POST OFFICE", "ADABRAKA POST OFFICE", "JAMES TOWN POST OFFICE",
    "MINISTRIES POST OFFICE", "SPORTS STADIUM POST OFFICE (ACCRA)", "CASTLE POST OFFICE", "LA POST OFFICE",
    "OSU POST OFFICE", "TESHIE POST OFFICE", "TRADE FAIR POST OFFICE", "KOTOKA INTER. AIRPORT P.O",
    "BURMA CAMP POST OFFICE", "MADINA POST OFFICE", "ABOKOBI POST OFFICE", "DODOWA POST OFFICE",
    "NUNGUA POST OFFICE", "ACCRA NORTH POST OFFICE", "CANTONMENTS POST OFFICE", "LEGON POST OFFICE",
    "NIMA POST OFFICE", "ACHIMOTA POST OFFICE", "AMASAMAN POST OFFICE", "OFANKOR POST OFFICE",
    "KANESHIE POST OFFICE", "DANSOMAN ESTATE POST OFFICE", "KORLE- BU POST OFFICE", "MALLAM POST OFFICE",
    "ABOSSEY OKAI POST OFFICE", "TEMA COM 1 POST OFFICE", "TEMA NEW TOWN POST OFFICE", "SPINTEX ROAD",
    "TAKORADI POST OFFICE", "TARKWA POST OFFICE", "AXIM POST OFFICE", "Sekondi Post Office",
    "Kumasi General Post Office", "KEJETIA POST OFFICE", "OBUASI POST OFFICE", "KONONGO POST OFFICE",
    "Tamale Gen. Post Office", "YENDI POST OFFICE", "SALAGA POST OFFICE", "DAMONGO POST OFFICE",
    "Bolgatanga Post Office", "BAWKU POST OFFICE", "NAVRONGO POST OFFICE", "PAGA POST OFFICE",
    "WA (MAIN) POST OFFICE", "LAWRA POST OFFICE", "JIRAPA POST OFFICE", "Sunyani Post Office",
    "BEREKUM POST OFFICE", "TECHIMAN POST OFFICE", "Koforidua Post Office", "AKOSOMBO POST OFFICE",
    "Ho Post Office", "HOHOE POST OFFICE", "KETA POST OFFICE", "AFLAO POST OFFICE",
    "Cape Coast Post Office", "Winneba Post Office", "SALTPOND POST OFFICE", "Head-Quarters",
    "ONLINE SALES", "SPEEDLINK", "Airport Transhipment", "DOME-KWABENYA POST OFFICE"
  ].sort();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'EDIT_USER', targetUid: user.id, data: { full_name: profileForm.full_name, post_office: profileForm.post_office } })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update profile');
      setProfileMsg({ type: 'success', text: 'Profile updated! Reloading...' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message });
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    if (pwForm.newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    setPwLoading(true);
    setPwMsg(null);
    try {
      const { signInWithEmailAndPassword, updatePassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, auth.currentUser!.email!, pwForm.current);
      await updatePassword(auth.currentUser!, pwForm.newPw);
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.code === 'auth/wrong-password' ? 'Current password is incorrect.' : err.message });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gp-blue">Admin Settings</h1>
        <p className="text-sm text-gp-blue/50 mt-1">System overview and your admin profile.</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: <Users size={20} className="text-gp-orange" />, label: 'System Users', value: loadingUsers ? '...' : `${users.length} Users` },
          { icon: <ShieldCheck size={20} className="text-gp-blue" />, label: 'Admin Role', value: 'ADMINISTRATOR' },
          { icon: <Bell size={20} className="text-green-500" />, label: 'System Status', value: 'Online' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-gp-light flex items-center justify-center">{stat.icon}</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gp-blue/40">{stat.label}</p>
            <p className="text-xl font-black text-gp-blue">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Quick Overview */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gp-blue flex items-center gap-2">
            <Users size={18} className="text-gp-orange" />
            System Users Overview
          </h2>
          <button
            onClick={() => setView('admin')}
            className="text-xs font-bold text-gp-orange hover:underline px-3 py-1 rounded-lg hover:bg-gp-orange/5 transition-all"
          >
            Manage All Users
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingUsers ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gp-light rounded-2xl animate-pulse"></div>
            ))
          ) : userFetchError ? (
            <div className="col-span-full p-4 rounded-2xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 italic">
              Error fetching users: {userFetchError}
            </div>
          ) : (
            users.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl border border-black/5 hover:bg-gp-light transition-all">
                <div className="w-10 h-10 rounded-full bg-gp-orange/10 flex items-center justify-center font-bold text-gp-orange text-xs uppercase">
                  {(u.full_name || u.email || 'U').charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-gp-blue truncate">{u.full_name || 'No Name'}</p>
                  <p className="text-[9px] text-gp-blue/40 font-bold uppercase truncate">{u.post_office || 'General Branch'}</p>
                </div>
              </div>
            ))
          )}
          {users.length > 4 && (
            <div className="flex items-center justify-center p-3 rounded-2xl border border-dashed border-black/10 text-gp-blue/30 text-[10px] font-bold uppercase tracking-widest text-center">
              + {users.length - 4} More Users
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <h2 className="text-base font-bold text-gp-blue flex items-center gap-2 mb-5">
            <UserCog size={18} className="text-gp-orange" />
            Admin Profile
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Full Name</label>
              <input value={profileForm.full_name} onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light focus:outline-none focus:ring-2 focus:ring-gp-blue/10" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Email Address</label>
              <input value={user.email || auth.currentUser?.email || ''} disabled
                className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light text-gp-blue/40 cursor-not-allowed" />
            </div>
            <AutocompleteInput
              label="Post Office Branch"
              placeholder="Search or Select Branch..."
              value={profileForm.post_office}
              onChange={val => setProfileForm({ ...profileForm, post_office: val })}
              onSelect={val => setProfileForm({ ...profileForm, post_office: val })}
              options={POST_OFFICES.map(po => ({ label: po, sub: '', original: po }))}
            />
            {profileMsg && (
              <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${profileMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {profileMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                {profileMsg.text}
              </div>
            )}
            <button type="submit" disabled={profileLoading} className="w-full bg-gp-orange text-white py-2.5 rounded-xl font-bold hover:bg-gp-orange/90 transition-all disabled:opacity-50">
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <h2 className="text-base font-bold text-gp-blue flex items-center gap-2 mb-5">
            <Lock size={18} className="text-gp-orange" />
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Current Password</label>
              <input type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light focus:outline-none focus:ring-2 focus:ring-gp-blue/10" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">New Password</label>
              <input type="password" value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light focus:outline-none focus:ring-2 focus:ring-gp-blue/10" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/5 bg-gp-light focus:outline-none focus:ring-2 focus:ring-gp-blue/10" required />
            </div>
            {pwMsg && (
              <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${pwMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {pwMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                {pwMsg.text}
              </div>
            )}
            <button type="submit" disabled={pwLoading} className="w-full bg-gp-blue text-white py-2.5 rounded-xl font-bold hover:bg-gp-blue/90 transition-all disabled:opacity-50">
              {pwLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, setView, formatDate, isAdmin }: { user: any, setView: any, formatDate: any, isAdmin: boolean }) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, success: 0, failed: 0, revenue: 0, users: 0 });
  const [timeStats, setTimeStats] = useState({ today: 0, week: 0, month: 0 });
  const [branchStats, setBranchStats] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const txRef = collection(db, 'transactions');
        let q;
        const perms = user.permissions;
        const reportAccess = perms?.reportAccess || (isAdmin ? 'ALL' : 'OWN');

        if (reportAccess === 'ALL') {
          q = query(txRef);
        } else if (reportAccess === 'SPECIFIC') {
          const ids = [user.id, ...(perms?.accessibleUserIds || [])];
          q = query(txRef, where('user_id', 'in', ids.slice(0, 30)));
        } else {
          q = query(txRef, where('user_id', '==', user.id));
        }
        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as any) }));

        // Always sort client-side to ensure consistent view regardless of Firestore-side data types
        data.sort((a: any, b: any) => {
          const dateA = formatDate(a.created_at)?.getTime() || 0;
          const dateB = formatDate(b.created_at)?.getTime() || 0;
          return dateB - dateA;
        });

        setTransactions(data);

        let successCount = 0;
        let rev = 0;
        let todayCount = 0;
        let weekCount = 0;
        let monthCount = 0;
        const branchMap: Record<string, number> = {};

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        data.forEach(t => {
          const isSuccess = t.success === 1;
          if (isSuccess) {
            successCount++;
            const res = t.response_payload ? JSON.parse(t.response_payload) : null;
            const amount = res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0;
            rev += amount;

            if (isAdmin || reportAccess === 'ALL') {
              const po = t.post_office || 'Unknown';
              branchMap[po] = (branchMap[po] || 0) + 1;
            }
          }

          const txDateObj = formatDate(t.created_at);
          if (txDateObj) {
            if (txDateObj >= startOfToday) todayCount++;
            if (txDateObj >= startOfWeek) weekCount++;
            if (txDateObj >= startOfMonth) monthCount++;
          }
        });

        setMetrics({ total: data.length, success: successCount, failed: data.length - successCount, revenue: rev, users: 0 });
        setTimeStats({ today: todayCount, week: weekCount, month: monthCount });

        if (isAdmin || reportAccess === 'ALL') {
          const sortedBranches = Object.keys(branchMap).map(k => ({ name: k, count: branchMap[k] })).sort((a, b) => b.count - a.count).slice(0, 5);
          setBranchStats(sortedBranches);
        }
      } catch (err: any) {
        console.error("Failed to load dashboard data", err);
        setError("Failed to load dashboard metrics. Please reload the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [isAdmin, user.id, user.permissions, user.post_office, formatDate]);

  const recentTx = transactions.slice(0, 10);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gp-blue/40">
        <LayoutDashboard size={48} className="animate-pulse mb-4" />
        <p className="font-bold tracking-widest uppercase">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gp-blue transition-all">
            <LayoutDashboard className="text-gp-blue" />
            {isAdmin ? 'System Dashboard' : 'My Dashboard'}
          </h2>
          <p className="text-sm text-gp-blue/60 font-medium mt-1">
            {isAdmin ? 'Overview of all duty cost portal activity' : 'Overview of your recent transactions'}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setView('landed')}
            className="bg-gp-orange text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-gp-orange/90 transition-all shadow-lg shadow-gp-orange/20 active:scale-95"
          >
            <Plus size={18} />
            Start New Transaction
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="font-medium text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg text-xs font-bold transition-colors">Reload Page</button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5 hover:border-gp-blue/20 transition-all">
          <p className="text-xs font-bold uppercase tracking-widest text-gp-blue/40 flex items-center gap-2 mb-2">
            <BarChart3 size={14} /> Total Tx
          </p>
          <p className="text-3xl font-black text-[#1a1a1a]">{metrics.total}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5 hover:border-green-500/20 transition-all">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600/60 flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} /> Successful
          </p>
          <p className="text-3xl font-black text-green-600">{metrics.success}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5 hover:border-red-500/20 transition-all">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500/60 flex items-center gap-2 mb-2">
            <AlertCircle size={14} /> Failed
          </p>
          <p className="text-3xl font-black text-red-500">{metrics.failed}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5 hover:border-gp-orange/20 transition-all">
          <p className="text-xs font-bold uppercase tracking-widest text-gp-orange/60 flex items-center gap-2 mb-2">
            <br /> Revenue / Cost
          </p>
          <p className="text-3xl font-black text-gp-orange">
            <span className="text-sm mr-1">GHS</span>
            {metrics.revenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Success vs Failure Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gp-blue border-b border-black/5 pb-4 mb-6">
            Success vs Failure Rate
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div
              className="w-32 h-32 rounded-full relative shadow-inner border-4 border-white"
              style={{
                background: `conic-gradient(#10b981 ${metrics.total > 0 ? (metrics.success / metrics.total) * 360 : 0}deg, #ef4444 0deg)`
              }}
            >
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <p className="text-xl font-black text-gp-blue">
                  {metrics.total > 0 ? Math.round((metrics.success / metrics.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="space-y-4 flex-1 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-bold text-black/60 uppercase tracking-widest">Successful</span>
                </div>
                <span className="text-sm font-black text-green-600">{metrics.success}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-bold text-black/60 uppercase tracking-widest">Failed</span>
                </div>
                <span className="text-sm font-black text-red-500">{metrics.failed}</span>
              </div>
              <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gp-blue/40 uppercase tracking-widest">Total Volume</span>
                <span className="text-sm font-black text-gp-blue">{metrics.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Over Time Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gp-blue border-b border-black/5 pb-4 mb-6 flex items-center justify-between">
            Activity Volume
            {metrics.total === 0 && <span className="text-[10px] font-bold text-gp-orange animate-pulse px-2 py-0.5 bg-gp-orange/10 rounded-full">No activity records found</span>}
          </h3>
          <div className="flex items-end justify-between h-32 gap-6 px-1 mt-2">
            {[
              { label: 'Today', val: timeStats.today, color: 'bg-gp-orange' },
              { label: 'This Week', val: timeStats.week, color: 'bg-gp-blue' },
              { label: 'This Month', val: timeStats.month, color: 'bg-gp-blue' }
            ].map((stat, idx) => {
              const maxVal = Math.max(timeStats.today, timeStats.week, timeStats.month, 1);
              const height = (stat.val / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full relative group h-24 flex items-end">
                    {/* Background Rail */}
                    <div className="absolute inset-x-0 bottom-0 h-full bg-black/[0.03] rounded-t-xl overflow-hidden">
                      <div className="w-full h-full border-x border-t border-black/[0.03]"></div>
                    </div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 8)}%` }}
                      className={`w-full ${stat.color} ${stat.val > 0 ? 'opacity-90' : 'opacity-[0.15]'} group-hover:opacity-100 rounded-t-xl transition-all relative flex items-start justify-center shadow-sm z-10`}
                    >
                      <div className="absolute -top-8 text-[11px] font-black text-gp-blue opacity-0 group-hover:opacity-100 transition-all bg-white border border-black/10 px-2.5 py-1 rounded-lg shadow-xl translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20">
                        {stat.val} records
                      </div>
                      {stat.val === 0 && <div className="w-full h-full border border-dashed border-black/10 rounded-t-xl box-border"></div>}
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black text-gp-blue/40 uppercase tracking-tighter whitespace-nowrap">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Admin Advanced Insights */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gp-blue border-b border-black/5 pb-4 mb-4">
              Time-Based Activity (All Tx)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gp-light/50 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-gp-blue/60">Today</span>
                <span className="text-lg font-black text-gp-blue">{timeStats.today}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gp-light/50 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-gp-blue/60">This Week</span>
                <span className="text-lg font-black text-gp-blue">{timeStats.week}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gp-light/50 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-gp-blue/60">This Month</span>
                <span className="text-lg font-black text-gp-blue">{timeStats.month}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gp-blue border-b border-black/5 pb-4 mb-4">
              Top Branches (Successful Tx)
            </h3>
            {branchStats.length === 0 ? (
              <p className="text-xs font-bold text-gp-blue/40 italic text-center py-4">No data available.</p>
            ) : (
              <div className="space-y-3">
                {branchStats.map((b, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 hover:bg-gp-light/50 rounded-xl transition-all">
                    <span className="text-xs font-bold text-[#1a1a1a] flex items-center gap-2">
                      <span className="w-5 h-5 bg-gp-orange/10 text-gp-orange rounded flex items-center justify-center text-[10px]">{idx + 1}</span>
                      {b.name}
                    </span>
                    <span className="text-sm font-black text-gp-blue">{b.count} <span className="text-[10px] text-gp-blue/40 uppercase">Tx</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="p-5 border-b border-black/5 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gp-blue">
            Recent Transactions
          </h3>
          <button onClick={() => setView('reports')} className="text-xs font-bold text-gp-orange hover:text-gp-orange/80 transition-colors uppercase tracking-widest flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gp-light/30 border-b border-black/5">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">User / Branch</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">Tracking #</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {recentTx.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gp-blue/40 font-medium italic">No recent transactions.</td>
                </tr>
              ) : (
                recentTx.map(t => {
                  const res = t.response_payload ? JSON.parse(t.response_payload) : null;
                  const total = res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0;
                  const displayName = t.user_name || (t.user_id ? t.user_id.substring(0, 8) + '...' : 'Unknown');
                  return (
                    <tr key={t.id} className="hover:bg-gp-light/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gp-blue">{t.created_at ? formatDate(t.created_at)?.toLocaleDateString() : 'N/A'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-[#1a1a1a]">{displayName}</p>
                        <p className="text-xs font-medium text-gp-orange">{t.post_office}</p>
                      </td>
                      <td className="p-4 font-mono text-sm font-semibold">{t.tracking_number || '-'}</td>
                      <td className="p-4">
                        {t.success === 1 ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter flex w-fit items-center gap-1">
                            <CheckCircle2 size={12} /> Success
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter flex w-fit items-center gap-1">
                            <AlertCircle size={12} /> Failed
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-extrabold">
                        {t.currency} {total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const GHANA_POST_OFFICES = [
  "GENERAL POST OFFICE", "ARTS CENTRE POST OFFICE", "31ST DEC. MKT POST OFFICE", "EXAM COUNCIL POST OFFICE",
  "ADABRAKA POST OFFICE", "JAMES TOWN POST OFFICE", "TUC POST OFFICE", "MAMPROBI POST OFFICE", "MINISTRIES POST OFFICE",
  "SPORTS STADIUM POST OFFICE (ACCRA)", "VALLEY VIEW POST OFFICE", "CASTLE POST OFFICE", "LA POST OFFICE",
  "OSU POST OFFICE", "TESHIE NUNGUA ESTATE P.OFFICE", "TESHIE POST OFFICE", "TRADE FAIR POST OFFICE",
  "KOTOKA INTER. AIRPORT P.O", "Airport Transhipment", "BURMA CAMP POST OFFICE", "MADINA POST OFFICE",
  "ABOKOBI POST OFFICE", "DODOWA POST OFFICE", "NUNGUA POST OFFICE", "STATE HOUSE", "ACCRA NORTH POST OFFICE",
  "CANTONMENTS POST OFFICE", "LEGON POST OFFICE", "NIMA POST OFFICE", "ACCRA NEW TOWN POST OFF.", "ACHIMOTA POST OFFICE",
  "ALAJO CONTAINER POST OFFICE", "AMASAMAN POST OFFICE", "OFANKOR POST OFFICE", "MILE 7 CONTAINER POST OFFICE",
  "TAIFA CONTAINER POST OFFICE", "ACHIMOTA MARKET POST OFFICE", "KOTOBABI CONTAINER POST OFFICE", "KANDA POST OFFICE",
  "ADENTA POST OFFICE", "KANESHIE POST OFFICE", "DANSOMAN ESTATE POST OFFICE", "KORLE- BU POST OFFICE",
  "DANSOMAN COMMUNITY P.O.", "ABEKA POST OFFICE", "MALLAM POST OFFICE", "ABOSSEY OKAI POST OFFICE", "DARKUMAN POST OFFICE",
  "S.T.C. CONTAINER POST OFFICE", "ODORKOR CONTAINER POST OFFICE", "WEIJA GICEL POST OFFICE", "Lartebiokorshie Post Office",
  "NII BOI TOWN POST OFFICE", "TEMA COM 1 POST OFFICE", "TEMA COMM. 2 POST OFFICE", "TEMA COMM. 7 POST OFFICE",
  "TEMA COMM. 11 POST OFFICE", "SAKUMONO POST OFFICE", "Ashiaman Post Office", "VALCO FLATS POST OFFICE",
  "ADA FOAH POST OFFICE", "PRAMPRAM POST OFFICE", "SPINTEX ROAD", "TEMA NEW TOWN POST OFFICE", "TEMA SHOPPING CENTRE P. OFF",
  "Koforidua Post Office", "AKOSOMBO POST OFFICE", "ABURI POST OFFICE", "AKROPONG AKWAPIM P.OFFICE", "AFIDWASE (ER) POST OFFICE",
  "ASESEWA POST OFFICE", "MAMPONG -AKWAPIM P.OFFICE", "SOMANYA POST OFFICE", "ADUKROM POST OFFICE", "MAMFE POST OFFICE",
  "LARTEH POST OFFICE", "AKUSE POST OFFICE", "ANUM POST OFFICE", "JUMAPO POST OFFICE", "MANGOASE POST OFFICE",
  "CHARLIE JUNCTION POST OFFICE", "ODUMASI KROBO POST OFFICE", "Oyoko Post Office", "NEW AKRADE POST OFFICE",
  "APEGUSO POST OFFICE", "ASOKORE (ER) POST OFFICE", "MPRAESO POST OFFICE", "ANYINAM POST OFFICE", "NKAWKAW POST OFFICE",
  "DONKOKROM POST OFFICE", "ABETIFI POST OFFICE", "NKWATIA POST OFFICE", "Obo Post Office", "KWABENG POST OFFICE",
  "KWAHU PRASO POST OFFICE", "KWAHU TAFO POST OFFICE", "Osino Post Office", "NEW ABIREM POST OFFICE", "BEGORO POST OFFICE",
  "Suhum Post Office", "ASAMANKESE POST OFFICE", "New Tafo (Eastern) Post Office", "Kukurantumi Post Ofice", "BOSUSO POST OFFICE",
  "KIBI POST OFFICE", "ASIAKWA POST OFFICE", "MEPOM POST OFFICE", "Old Tafo Post Office", "ADEISO POST OFFCIE",
  "NSAWAM POST OFFICE", "APEDWA POST OFFICE", "KRABOA COALTAR POST OFFICE", "Bunso Post Office", "ADOAGYIRI POST OFFICE",
  "ODA POST OFFICE", "AKWATIA POST OFFICE", "AKIM SWEDRU POST OFFICE", "KADE POST OFFICE", "AKROSO POST OFFICE",
  "AKIM MANSO POST OFFICE", "ASUOM POST OFFICE", "ACHIASE POST OFFICE", "Ho Post Office", "Mawuli Post Office",
  "DZODZE POST OFFICE", "Peki Post Office", "AMEDZOFE POST OFFICE", "Tsito Post Office", "AGOTIME-KPETOE POST OFFICE",
  "JUAPONG POST OFFICE", "Vane Post Office", "KPEDZE POST OFFICE", "KPEVE POST OFFICE", "KPANDO POST OFFICE",
  "HOHOE POST OFFICE", "KETE-KRACHI POST OFFICE", "NKONYA-AHENKRO POST OFFICE", "Vakpo Post Office", "WORAWORA POST OFFICE",
  "JASIKAN POST OFFICE", "KADJEBI POST OFFICE", "ANFOEGA POST OFFICE", "DODI-PAPASE POST OFFICE", "GOLOKWATI POST OFFICE",
  "NKWANTA POST OFFICE", "AGBOSOME POST OFFICE", "DENU POST OFFICE", "AKATSI POST OFFICE", "KETA POST OFFICE",
  "ADIDOME POST OFFICE", "AFLAO POST OFFICE", "SOGAKOFE POST OFFICE", "ANLOGA POST OFFICE", "Adisadel Post Office",
  "DUNKWA ON OFFIN POST OFFICE", "Elmina Post Office", "ASSIN-FOSU POST OFFICE", "Kotokuraba Post Office", "MANKESSIM POST OFFICE",
  "Twifo-Praso Post Office", "Cape Coast Post Office", "ANOMABU POST OFFICE", "ABURA DUNKWA POST OFFICE", "KOMENDA POST OFFICE",
  "SALTPOND POST OFFICE", "SWEDRU POST OFFICE", "BAWJIASE POST OFFICE", "BREMAN ESIKUMA POST OFFICE", "Winneba Post Office",
  "KASOA NYANYANU POST OFFICE", "MARKET AVENUE/SWEDRU", "KOJO BEEDU POST OFFICE", "AJUMAKO POST OFFICE", "APAM POST OFFICE",
  "BISEASE POST OFFICE", "ESIAM POST OFFICE", "KWANYAKU POST OFFICE", "AGONA DUAKWA POST OFFICE", "ANKAMU POST OFFICE",
  "Pinanko Post Office", "Odoben Post Office", "SENYA BEREKU", "NSABA POST OFFICE", "Nyakrom Post Office", "ODUPONG KPEHE",
  "TAKORADI POST OFFICE", "TARKWA POST OFFICE", "AIYINASI POST OFFICE", "AXIM POST OFFICE", "HALF ASSINI POST OFFICE",
  "Market Circle Post Office", "Lagoon Road Post Office", "AXIM ROAD P.OFFICE, TAKORADI", "Effia Nkwanta Post Office",
  "Effiakuma Post Office", "ELUBO POST OFFICE", "KETAN CONTAINER POST OFFICE", "Kojokrom Container Post Office", "Shama Post Office",
  "ABOSO POST OFFICE", "NSUTA WASSAW POST OFFICE", "ESIAMA POST OFFICE", "BEYIN POST OFFICE", "Kwesimintsim Post Office",
  "BONYERE POST OFFICE", "Sekondi Post Office", "NKROFUL POST OFFICE", "DABOASE POST OFFICE", "Apowa Post Office",
  "SEFWI WIAWSO POST OFFICE", "BIBIANI POST OFFICE", "ENCHI POST OFFICE", "SEFWI BEKWAI POST OFFICE", "PRESTEA POST OFFICE",
  "ASANKRAGWA POST OFFICE", "BOGOSO POST OFFICE", "SAMREBOI POST OFFICE", "AWASO POST OFFICE", "AKROPONG WASSAW POST OFF.",
  "HUNI VALLEY POST OFFICE", "ATIEKU POST OFFICE", "JUABESO POST OFFICE", "Kumasi General Post Office", "KEJETIA POST OFFICE",
  "Fanti New Town Post Office", "AKUMADAN POST OFFICE", "OFFINSO POST OFFICE", "TEPA POST OFFICE", "Railways Container P.Office",
  "Santasi Post Office", "Bantama Post Office", "Bohyen-Ampabame P.Office", "Kwadaso Post Office", "KWADASO ACADEMY POST OFFICE",
  "NKAWIE POST OFFICE", "NKENKASU POST OFFICE", "Asuoyeboa Post Office", "AKROPONG KUMASI POST OFFICE", "Ahensan Post Office",
  "Suame Post Office", "Sports Stadium Post Office (Kumasi)", "University Post Office KNUST", "Ashanti New Town P.Office",
  "Aboabo Container Post Office", "MANPONTEN POST OFFICE", "ANLOGA CONT. ASHANTI POST OFFICE", "CHIRAPATRE CONT. POST OFFICE",
  "Tafo Asante Post Office", "New Tafo (Ashanti) Post Office", "Asawase Post Office", "SEPE APAMPINAM POST OFFICE",
  "KONONGO POST OFFICE", "AGOGO POST OFFICE", "Ejisu Post Office", "JUANSA POST OFFICE", "BOMPATA POST OFFICE",
  "JUASO POST OFFICE", "BOMFA POST OFFICE", "ODUMASI POST OFFICE", "BEKWAI ASHANTI POST OFFICE", "OBUASI POST OFFICE",
  "FOMENA POST OFFICE", "AKROKERI POST OFFICE", "AKROPONG BEKWAI POST OFFICE", "AKROFUOM POST OFFICE", "JACHI POST OFFICE",
  "MAMPONG-ASHANTI POST OFFICE", "AGONA (ASHANTI) POST OFFICE", "JAMASI (ASHANTI) POST OFFICE", "EJURA POST OFFICE",
  "BONWIRE POST OFFICE", "NSUTA-ASH. POST OFFICE", "KUMAWU POST OFFICE", "EFFIDUASI (ASH) POST OFFICE", "JUABEN-ASHANTI POST OFFICE",
  "NEW EDUBIASE", "Sunyani Post Office", "BEREKUM POST OFFICE", "NSOATRE POST OFFICE", "GYAPEKROM POST OFFICE", "DROBO POST OFFICE",
  "DORMAA AHENKRO POST OFFICE", "CHIRAA POST OFFICE", "SAMPA POST OFFICE", "WAMFIE POST OFFICE", "BECHEM POST OFFICE",
  "MIM-AHAFO POST OFFICE", "HWIDIEM POST OFFICE", "GOASO POST OFFICE", "KUKUOM POST OFFICE", "KENYASI POST OFFICE",
  "DUAYAW NKWANTA POST OFFICE", "AKYERENSUA POST OFFICE", "Techimentia Post Office", "NKORANZA POST OFFICE", "KINTAMPO POST OFFICE",
  "ATEBUBU POST OFFICE", "PRANG POST OFFICE", "TECHIMAN POST OFFICE", "WENCHI POST OFFICE", "YEJI POST OFFICE", "JEMA POST OFFICE",
  "Tamale Gen. Post Office", "EDUCATION RIDGE POST OFFICE", "YENDI POST OFFICE", "DAMONGO POST OFFICE", "SALAGA POST OFFICE",
  "BIMBILLA POST OFFICE", "BOLE POST OFFICE", "GAMBAGA POST OFFICE", "WALEWALE POST OFFICE", "Savulugu Post Office",
  "Bolgatanga Post Office", "BAWKU POST OFFICE", "NAVRONGO POST OFFICE", "PAGA POST OFFICE", "SANDEMA POSTAL AGENCY",
  "PUSIGA POSTAL AGENCY", "ZEBILLA POSTAL AGENCY", "GARU POSTAL AGENCY", "BONGO POSTAL AGENCY", "WA (MAIN) POST OFFICE",
  "LAWRA POST OFFICE", "TUMU POST OFFICE", "JIRAPA POST OFFICE", "NADOWLI POST OFFICE", "HAMILE POST OFFICE", "NANDOM POST OFFICE",
  "BABILE POSTAL AGENCY", "FUNSI POSTAL AGENCY", "FIELMUO POSTAL AGENCY", "TAIFA-BURKINA POST OFFICE", "DOME-KWABENYA POST OFFICE",
  "KPANDAI POST OFFICE", "Madina Redco Post Office", "BIG ADA POST OFFICE", "KPONE POST OFFICE", "GOMOA ESHIEM POST OFFICE",
  "GOMOA ODINA POST OFFICE", "UNIVERSITY (CAPE COAST) POST OFFICE", "NEW ODUMAN POST OFFICE", "Head-Quarters",
  "ASAMANG (ASHANTI) POST OFFICE", "KWAMANG (ASHANTI) POST OFFICE", "SEKYEDUMASE POST OFFICE", "WIAMOASE (ASHANTI) POST OFFICE",
  "NYINAHIN POST OFFICE", "BOAMANG POST OFFICE", "Prempeh College Post Office", "ADAWSO POST OFFICE", "Osiem Post Office",
  "MANYA KPONGUNOR POST OFFICE", "ASOKORE (ASH) POST OFFICE", "TONGO POSTAL AGENCY", "UDS Post Office (Wa)", "ABOR POST OFFICE",
  "APESOKUBI POST OFFICE", "KOKOFU POST OFFICE", "Takoradi Poly Post Office", "NSUAEM POST OFFICE", "AGONA AHANTA POSTAL AGENCY",
  "BUIPE POST OFFICE", "UDS-TAMALE POST OFFICE", "BISCO POST OFFICE", "NORTH KANESHIE POST OFFICE", "DAMBAI POST OFFICE",
  "GHANASS", "CENTRAL UNIVERSITY POST OFFICE", "PINANKO POST OFFICE", "GOMOA AFRANSI", "DWENASE POST OFFICE", "SAWLA POST OFFICE",
  "TUNA POST OFFICE", "GWOLLU POST OFFICE", "WECHAU POST OFFICE", "WEST AFRICAN SHS", "OYIBI POST OFFICE", "BAMAHU CIC POST OFFICE",
  "UEW-K POST OFFICE", "HO STADIUM POST OFFICE", "AIRPORT KUMASI", "DOMPOASE POST OFFIICE", "ONLINE SALES", "JUMIA GHANA OFFICE",
  "DAWHENYA POST OFFICE", "BULK MAIL", "ABURI CRAFT VILLAGE POST OFFICE", "TRAINING1 POST OFFICE", "TRAINING2 POST OFFICE",
  "ANKAFUL PSYCHIATRIC POST OFFICE", "SPEEDLINK", "MANKRASO POST OFFICE", "ABUAKWA POST OFFICE", "ODUMASE SUNYANI POST OFFICE",
  "LINK", "SCUTTLE PARCEL BOX", "OFOASE AYIREBI POST OFFICE", "KOMFO ANOKYE TEACHING HOSPITAL", "DHL WAREHOUSE", "DVLA HEAD OFFICE",
  "STANDARD CHARTERED", "PASSPORT OFFICE", "WA POST OFFICE", "SEFWI AKONTOMBRA POST OFFICE"
].sort();

const POST_OFFICE_OPTIONS = GHANA_POST_OFFICES.map(po => ({ value: po, label: po }));

function TotalAmountSummaryBox({ 
  total = 0, 
  duty = 0, 
  carton = 0, 
  shipping = 0,
  currency = "GHS" 
}: { 
  total?: number; 
  duty?: number; 
  carton?: number; 
  shipping?: number;
  currency?: string;
}) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 px-8 py-4 rounded-3xl flex flex-col items-end shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="flex items-center gap-6 mb-2 border-b border-yellow-200/50 pb-2 w-full justify-end">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-yellow-700/70 uppercase tracking-widest">Duty Cost</span>
          <span className="text-sm font-black text-yellow-900">{currency} {duty.toFixed(2)}</span>
        </div>
        <div className="w-px h-6 bg-yellow-200/80" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-yellow-700/70 uppercase tracking-widest">Carton Cost</span>
          <span className="text-sm font-black text-yellow-900">{currency} {carton.toFixed(2)}</span>
        </div>
        <div className="w-px h-6 bg-yellow-200/80" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-yellow-700/70 uppercase tracking-widest">Shipping Cost</span>
          <span className="text-sm font-black text-yellow-900">{currency} {shipping.toFixed(2)}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-1">TOTAL AMOUNT ({currency}):</span>
      <span className="text-4xl font-black text-red-600 leading-none">
        {total.toFixed(2)}
      </span>
    </div>
  );
}

function AddForeignParcel({ user }: { user: any }) {
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all uppercase";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-gp-blue/50 mb-1.5 ml-0.5";
  const selectCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-gray-700";

  const [originPO, setOriginPO] = React.useState('');
  const [hsCodesData, setHsCodesData] = React.useState<{ code: string, desc: string }[]>([]);
  const [items, setItems] = React.useState([{ id: 1, description: '', hsCode: '' }]);

  React.useEffect(() => {
    fetch('/data/hs-codes.json')
      .then(res => res.json())
      .then(data => setHsCodesData(data))
      .catch(() => {});
  }, []);

  const descOptions = hsCodesData.map((d: any) => ({ label: d.desc, sub: d.code, original: d }));
  const hsOptions = Array.from(new Set(hsCodesData.map((d: any) => d.code))).map(code => {
    const match = hsCodesData.find((d: any) => d.code === code);
    return { label: code as string, sub: match?.desc || '', original: match };
  });
  const addItem = () => setItems(prev => [...prev, { id: Date.now(), description: '', hsCode: '' }]);
  const removeItem = (id: number) => setItems(prev => prev.filter(it => it.id !== id));
  const updateItem = (id: number, field: string, value: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gp-blue/10 flex items-center justify-center">
              <Package size={20} className="text-gp-blue" />
            </div>
            New Foreign Parcel
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Create a new foreign parcel consignment entry</p>
        </div>
        <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-gray-600 transition-all">
            <RefreshCcw size={15} />
            Reset Form
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gp-blue/20 hover:bg-gp-blue/5 text-sm font-semibold text-gp-blue transition-all">
            <Search size={15} />
            Find Consignment
          </button>
        </div>
      </div>

      {/* Shipper & Consignee */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipper Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gp-blue">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Globe size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Shipper (Sender)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className={labelCls}>Name</label>
              <input type="text" placeholder="Full name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Digital Address</label>
              <input type="text" placeholder="e.g. GA-123-4567" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location Address</label>
              <textarea placeholder="Full physical address" className={`${inputCls} h-20 resize-none`}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Post/Zip Code</label>
                <input type="text" placeholder="Zip code" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>State/Region</label>
                <input type="text" placeholder="Region" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>City/Town</label>
                <input type="text" placeholder="City" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tel</label>
                <input type="text" placeholder="Phone number" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Origin (Post Office)</label>
              <SearchableSelect options={POST_OFFICE_OPTIONS} value={originPO} onChange={setOriginPO} placeholder="Search post office..." className="w-full" />
            </div>
          </div>
        </div>

        {/* Consignee Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gp-orange">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Consignee (Recipient)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className={labelCls}>Name</label>
              <input type="text" placeholder="Full name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Digital Address</label>
              <input type="text" placeholder="Digital address" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location Address</label>
              <textarea placeholder="Full physical address" className={`${inputCls} h-20 resize-none`}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Post/Zip Code</label>
                <input type="text" placeholder="Zip code" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>State/Region</label>
                <input type="text" placeholder="Region" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>City/Town</label>
                <input type="text" placeholder="City" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tel</label>
                <input type="text" placeholder="Phone number" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Destination Country</label>
              <div className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.06] text-sm text-gray-700 font-semibold flex items-center gap-2">
                <Globe size={14} className="text-gp-blue" /> United States of America (US)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parcel Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-gp-blue">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Package size={16} className="text-white" />
          </div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wide">Foreign Parcel Consignment Details</h3>
        </div>
        <div className="p-6 space-y-8">

          {/* ── DUTY COST ITEMS ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Calculator size={15} className="text-gp-blue" />
                  Parcel Items <span className="text-[10px] font-bold text-gp-blue/50 uppercase tracking-wider ml-1">(for duty cost)</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-2 ml-5">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-blue/10 text-gp-blue">Currency: GHS</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-blue/10 text-gp-blue">Origin: GH</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Destination — auto-linked from Consignee</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Tracking No. — auto-generated on save</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Shipping Cost — auto-calculated</span>
                </div>
              </div>
              <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gp-blue/10 text-gp-blue text-xs font-bold hover:bg-gp-blue/20 transition-all">
                <Plus size={13} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-gp-blue/[0.02] rounded-2xl border border-gp-blue/5 p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gp-blue/50">Item {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50">
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <AutocompleteInput
                        label="Description"
                        placeholder="e.g. Cotton T-shirt"
                        value={item.description}
                        onChange={(val) => updateItem(item.id, 'description', val)}
                        onSelect={(val, original) => {
                          setItems(prev => prev.map(it => it.id === item.id ? { ...it, description: val, hsCode: original?.code || it.hsCode } : it));
                        }}
                        options={descOptions}
                      />
                    </div>
                    <div>
                      <AutocompleteInput
                        label="HS Code"
                        placeholder="e.g. 6109.10"
                        value={item.hsCode}
                        onChange={(val) => updateItem(item.id, 'hsCode', val)}
                        onSelect={(val, original) => {
                          setItems(prev => prev.map(it => it.id === item.id ? { ...it, hsCode: val, description: original?.desc || it.description } : it));
                        }}
                        options={hsOptions}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Unit Price (GHS)</label><input type="number" placeholder="0.00" className={inputCls} /></div>
                    <div><label className={labelCls}>Quantity</label><input type="number" placeholder="1" className={inputCls} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-black/5"></div>

          {/* ── OTHER PARCEL DETAILS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Service</label>
                <div className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.06] text-sm text-gray-700 font-semibold">DEMAND - FOREIGN</div>
              </div>
              <div>
                <label className={labelCls}>Parcel Type</label>
                <select className={selectCls}>
                  <option value="">-Select Option-</option>
                  <option>Document</option>
                  <option>Non-Documents</option>
                  <option>Merchandise</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>No. of Items</label>
                <select className={selectCls}>
                  <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Weight</label>
                <div className="flex items-center gap-3">
                  <input type="number" placeholder="0.00" className={`${inputCls} flex-1`} />
                  <span className="text-sm font-bold text-gray-600 bg-black/5 px-4 py-2.5 rounded-xl border border-black/10">kg</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Content Description / Manufacturing Country</label>
                <textarea placeholder="Describe contents and country of manufacture" className={`${inputCls} h-24 resize-none`} onChange={e => e.target.value = e.target.value.toUpperCase()}></textarea>
              </div>
              <div>
                <label className={labelCls}>Add Insurance</label>
                <select className={selectCls}><option>No</option><option>Yes</option></select>
              </div>
              <div>
                <label className={labelCls}>Carton Type &amp; Quantity</label>
                <div className="flex items-center gap-2">
                  <select className={`${selectCls} flex-1`}>
                    <option value="">Select Carton Type</option>
                    <option>EMS Cartons Extra Large</option>
                    <option>EMS Cartons Large</option>
                    <option>EMS Cartons Medium</option>
                    <option>EMS Cartons Small</option>
                    <option>EMS Cartons Very Small</option>
                    <option>Parcel Cartons Extra Large</option>
                    <option>Parcel Cartons Extra Small</option>
                    <option>Parcel Cartons Large</option>
                    <option>Parcel Cartons Medium</option>
                    <option>Parcel Cartons Small</option>
                  </select>
                  <input type="number" placeholder="Qty" className="w-20 px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-center" min="1" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-black/5 flex items-center justify-between gap-4">
            <TotalAmountSummaryBox total={0} duty={0} carton={0} shipping={0} />
            <button className="flex items-center justify-center gap-2 w-[280px] py-3.5 bg-gp-orange text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 active:scale-[0.98] transition-all"><Plus size={18} /> Create Foreign Parcel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  className = "w-full md:w-48"
}: { 
  options: { value: string; label: string }[]; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder: string; 
  icon?: any;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[46px] px-4 flex items-center justify-between gap-3 bg-white border border-black/5 rounded-2xl shadow-sm hover:border-gp-blue/30 transition-all text-sm font-medium text-gray-700 active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className={value ? "text-gp-blue" : "text-gray-400"} />}
          <span className={!value ? "text-gray-400" : "truncate"}>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] top-full left-0 w-64 mt-2 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden flex flex-col"
          >
            <div className="p-3 border-b border-black/5 bg-gray-50/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Type to search..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-black/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gp-blue/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      value === opt.value 
                        ? "bg-gp-blue text-white shadow-md shadow-gp-blue/20" 
                        : "text-gray-600 hover:bg-gp-blue/5 hover:text-gp-blue"
                    }`}
                  >
                    {opt.label}
                    {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </button>
                ))
              ) : (
                <div className="py-8 px-4 text-center">
                   <p className="text-xs text-gray-400 font-medium">No results found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConsignmentDetailsModal({ isOpen, onClose, consignment }: { isOpen: boolean; onClose: () => void; consignment: any }) {
  if (!isOpen || !consignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gp-blue text-white px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">Consignment Tracking No.: {consignment.tracking}</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">
              <RefreshCcw size={14} /> Refresh
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20">
              <Printer size={14} /> Print
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20">
              <ScanBarcode size={14} /> Print Barcode
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gp-orange hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-lg shadow-black/10">
              <Edit size={14} /> Edit
            </button>
            <button onClick={onClose} className="ml-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content View */}
        <div className="overflow-y-auto flex-1 bg-gray-50/50 p-6 space-y-6">
          
          {/* Pricing Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-orange-200/60 pb-3 mb-3">
              <span className="text-sm font-bold text-gray-700">Tracking No.: <span className="text-gp-blue">{consignment.tracking}</span></span>
              <span className="text-sm font-bold text-gray-700">DATE: <span className="text-gp-blue">{consignment.date}</span></span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase">Price</span>
                <span className="font-extrabold text-gp-blue">1,012.00 GHC</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">NHIL:</span> <span className="text-xs font-bold text-gray-800">0.00 GHC</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">Basket:</span> <span className="text-xs font-bold text-gray-800">0.00 GHC</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">GetFund:</span> <span className="text-xs font-bold text-gray-800">0.00 GHC</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">Fish:</span> <span className="text-xs font-bold text-gray-800">0.00 GHC</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">Covid:</span> <span className="text-xs font-bold text-gray-800">0.00 GHC</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">Carton:</span> <span className="text-xs font-bold text-gray-800">15.00 GHC</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">VAT:</span> <span className="text-xs font-bold text-gray-800">0.00 GHC</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-500 uppercase">LCA:</span> <span className="text-xs font-bold text-gray-800">0.00 GHC</span></div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-orange-200/60 flex justify-between items-center bg-white/40 px-4 py-2 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase">INS: 7.20 GHC</span>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-500 uppercase mr-2">Total Price:</span>
                <span className="text-xl font-black text-gp-blue tracking-tight">1,034.20 GHC</span>
              </div>
            </div>
          </div>

          {/* Status Strip */}
          <div className="flex items-center gap-3 bg-red-50 text-red-600 px-5 py-3 rounded-xl border border-red-100 font-bold text-xs uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Current Status: FRI, 10 APR 2026: 06:11:21 PM: ITEM DISPATCHED WITH MANIFEST GP10010046P5GP TO GENERAL POST OFFICE
          </div>

          {/* Party Details (Shipper & Consignee) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipper */}
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
              <div className="bg-gp-blue text-white px-5 py-3 font-bold flex items-center gap-2">
                <User size={16} /> Shipper (Sender)
              </div>
              <div className="p-5 divide-y divide-gray-100">
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Name:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3">{consignment.shipper}</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Address:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3 uppercase text-right">P.O. BOX 5090 ACCRA NORTH</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Post/Zip Code:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3 uppercase">GA183</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">City/Town:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3 uppercase">{consignment.sCity}</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Tel:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3">0548216116</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Origin PO:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3">General Post Office</span></div>
              </div>
            </div>

            {/* Consignee */}
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
              <div className="bg-gp-blue text-white px-5 py-3 font-bold flex items-center gap-2">
                <User size={16} /> Consignee (Receiver)
              </div>
              <div className="p-5 divide-y divide-gray-100">
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Name:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3">{consignment.consignee}</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Address:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3 uppercase text-right">YANGYING LANGWANGSHAN XUYI</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Post/Zip Code:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3 uppercase">211731</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">City/Town:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3 uppercase">{consignment.rCity}</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Tel:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3">+8617849180207</span></div>
                <div className="py-2.5 flex justify-between"><span className="text-xs font-bold text-gray-500 w-1/3">Destination:</span> <span className="text-sm font-bold text-gray-900 text-right w-2/3 uppercase">China</span></div>
              </div>
            </div>
          </div>

          {/* Consignment Details Block */}
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
            <div className="bg-gp-blue text-white px-5 py-3 font-bold flex items-center gap-2">
              <FileText size={16} /> Foreign Parcel Consignment Details
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Service:</span> <span className="text-sm font-bold text-gray-900 uppercase">DEMAND - FOREIGN</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Content Description:</span> <span className="text-sm font-bold text-gray-900 uppercase text-right">2PC FRUIT BEVERAGE</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Parcel Type:</span> <span className="text-sm font-bold text-gray-900 uppercase">NON DOCUMENTS</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Value of Item:</span> <span className="text-sm font-bold text-gray-900">360.00 GHC</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">No. of Items:</span> <span className="text-sm font-bold text-gray-900">1</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Item Insured:</span> <span className="text-sm font-bold text-gray-900 text-gp-blue">Yes</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Weight:</span> <span className="text-sm font-bold text-gray-900">2.43kg</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Issued By:</span> <span className="text-sm font-bold text-gray-900 uppercase">GRACE QUARTEY</span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500 invisible">Spacer</span> <span className="text-sm font-bold text-gray-900"></span></div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-xs font-bold text-gray-500">Last Updated By:</span> <span className="text-sm font-bold text-gray-900">-</span></div>
            </div>
          </div>

      </div>
    </div>
  </div>
);
}

function EditConsignmentModal({ isOpen, onClose, consignment }: { isOpen: boolean; onClose: () => void; consignment: any }) {
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (consignment) {
      setFormData({ 
        shipper: consignment.shipper || '',
        sAddress: 'P.O. BOX 5090 ACCRA NORTH',
        sZip: 'GA183',
        sCity: consignment.sCity || '',
        sTel: '0548216116',
        originPO: 'General Post Office',
        consignee: consignment.consignee || '',
        rAddress: 'YANGYING LANGWANGSHAN MUDIAN XUYI COUNTY JIANGSU',
        rZip: '211731',
        rCity: consignment.rCity || '',
        rTel: '+8617849180207',
        destination: 'China',
        service: 'DEMAND - FOREIGN',
        parcelType: 'Non Documents',
        items: 1,
        weight: '2.43',
        value: '360',
        content: '2PC FRUIT BEVERAGE',
        insurance: 'Yes',
        tracking: consignment.tracking,
        date: consignment.date
      });
    }
  }, [consignment]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => prev ? ({ ...prev, [name]: value }) : null);
  };

  if (!isOpen || !consignment || !formData) return null;

  const inputCls = "w-full px-3 py-2 rounded-lg border border-black/10 bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 ml-0.5";
  const selectCls = "w-full px-3 py-2 rounded-lg border border-black/10 bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-gray-700 appearance-none";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200 border border-white/20">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gp-blue text-white px-8 py-5 gap-4 shadow-lg z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
              <Pencil size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Edit Consignment</h2>
              <p className="text-xs text-white/60 font-medium">Modify tracking details and pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"><RefreshCcw size={14} /> Refresh</button>
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"><Printer size={14} /> Print</button>
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"><Search size={14} /> Find Consignment</button>
             <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"><X size={20} /></button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 bg-gray-50/30">
          <div className="p-8 space-y-8">
            
            {/* Pricing Summary Banner (Mockup Style) */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/30 rounded-3xl border border-orange-200/50 p-6 shadow-sm overflow-hidden relative">
              <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Tracking No:</span>
                  <p className="text-lg font-black text-gp-blue leading-none">{formData.tracking}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Price Breakdown:</span>
                  <div className="flex gap-4">
                    <p className="text-sm font-bold text-gray-600">PRICE: <span className="text-gp-blue">1,019.20 GHS</span></p>
                    <p className="text-sm font-bold text-gray-600">INS: <span className="text-gp-blue">7.20 GHS</span></p>
                    <p className="text-sm font-bold text-gray-600">VAT&NHIL: <span className="text-gp-blue">0.00 GHS</span></p>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Total Price:</span>
                  <p className="text-2xl font-black text-gp-blue leading-none">1,026.40 GHS</p>
                </div>
                <div className="space-y-1 text-right border-l border-orange-200 pl-6 ml-2">
                   <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Date:</span>
                   <p className="text-sm font-bold text-gray-900">{formData.date}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shipper Section */}
              <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="bg-gp-blue px-6 py-4 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><User size={16} className="text-white" /></div>
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Shipper (Sender)</h3>
                </div>
                <div className="p-6 space-y-4">
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Name:</label>
                      <input type="text" name="shipper" value={formData.shipper} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                      <label className={labelCls + " mt-2"}>Location:</label>
                      <textarea name="sAddress" value={formData.sAddress} onChange={handleChange} className={inputCls + " h-20 resize-none font-medium"} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Zip Code:</label>
                      <input type="text" name="sZip" value={formData.sZip} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>City/Town:</label>
                      <input type="text" name="sCity" value={formData.sCity} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Tel:</label>
                      <input type="text" name="sTel" value={formData.sTel} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Origin PO:</label>
                      <div className="relative">
                        <select name="originPO" value={formData.originPO} onChange={handleChange} className={selectCls}>
                          <option>General Post Office</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                      </div>
                   </div>
                </div>
              </div>

              {/* Consignee Section */}
              <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="bg-gp-blue px-6 py-4 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><User size={16} className="text-white" /></div>
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Consignee (Recipient)</h3>
                </div>
                <div className="p-6 space-y-4">
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Name:</label>
                      <input type="text" name="consignee" value={formData.consignee} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                      <label className={labelCls + " mt-2"}>Location:</label>
                      <textarea name="rAddress" value={formData.rAddress} onChange={handleChange} className={inputCls + " h-20 resize-none font-medium"} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Zip Code:</label>
                      <input type="text" name="rZip" value={formData.rZip} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>City/Town:</label>
                      <input type="text" name="rCity" value={formData.rCity} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Tel:</label>
                      <input type="text" name="rTel" value={formData.rTel} onChange={handleChange} className={inputCls} />
                   </div>
                   <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className={labelCls}>Destination:</label>
                      <div className="relative">
                        <select name="destination" value={formData.destination} onChange={handleChange} className={selectCls}>
                          <option>China</option>
                          <option>United States</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Consignment Details Block */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden mb-4">
               <div className="bg-gp-blue px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><FileText size={16} className="text-white" /></div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Foreign Parcel Consignment Details</h3>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-5">
                     <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className={labelCls}>Service:</label>
                        <div className="relative">
                          <select name="service" className={selectCls} value={formData.service} onChange={handleChange}>
                            <option>DEMAND - FOREIGN</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                     </div>
                     <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className={labelCls}>Parcel Type:</label>
                        <div className="relative">
                          <select name="parcelType" className={selectCls} value={formData.parcelType} onChange={handleChange}>
                            <option>Non Documents</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                     </div>
                     <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className={labelCls}>No. of Items:</label>
                        <input type="number" name="items" value={formData.items} onChange={handleChange} className={inputCls} />
                     </div>
                     <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className={labelCls}>Weight:</label>
                        <div className="flex items-center gap-2">
                           <input type="text" name="weight" value={formData.weight} onChange={handleChange} className={inputCls} />
                           <span className="text-xs font-bold text-gray-400 px-3 py-2 bg-gray-100 rounded-lg border border-black/5">kg</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className={labelCls + " mt-2"}>Description:</label>
                        <textarea name="content" className={inputCls + " h-20 resize-none"} value={formData.content} onChange={handleChange} />
                     </div>
                     <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className={labelCls}>Value of Item:</label>
                        <div className="flex items-center gap-2">
                           <input type="text" name="value" value={formData.value} onChange={handleChange} className={inputCls} />
                           <span className="text-xs font-bold text-gray-400 px-3 py-2 bg-gray-100 rounded-lg border border-black/5">GHC</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className={labelCls}>Add Insurance:</label>
                        <div className="relative">
                          <select name="insurance" className={selectCls} value={formData.insurance} onChange={handleChange}>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      {/* Footer Actions */}
        <div className="p-6 bg-gray-100/50 border-t border-black/5 flex justify-center">
           <button 
             onClick={onClose}
             className="px-12 py-4 bg-gp-orange text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-gp-orange/20 hover:bg-opacity-90 transition-all active:scale-[0.98] border border-white/5"
           >
             Update Consignment
           </button>
        </div>
      </div>
    </div>
  );
}

function ViewForeignParcels({ user }: { user: any }) {
  const [selectedConsignment, setSelectedConsignment] = useState<any>(null);
  const [editingConsignment, setEditingConsignment] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const branchOptions = [
    { value: "", label: "All Branches" },
    { value: "general", label: "GPO Accra" },
    { value: "accra-north", label: "Accra North" },
    { value: "kumasi", label: "Kumasi Central" },
    { value: "takoradi", label: "Takoradi Harbor" },
  ];

  const userOptions = [
    { value: "", label: "All Users" },
    { value: "user1", label: "John Doe" },
    { value: "user2", label: "Jane Smith" },
    { value: "user3", label: "Robert Mensah" },
    { value: "user4", label: "Sarah Owusu" },
  ];

  const mockData = [
    { id: 1, tracking: 'CG066454599GH', date: '10th Apr 2026', shipper: 'SHANGTON AND DIVINE', consignee: 'TONY YAO', sCity: 'ACCRA', rCity: 'XUYI, JIANGSU' },
    { id: 2, tracking: 'CG066453695GH', date: '10th Apr 2026', shipper: 'HARRIET SIMONS', consignee: 'JACOB BENNETT', sCity: 'ACCRA', rCity: 'HAYES,MIDDLESEX' },
    { id: 3, tracking: 'CG066452615GH', date: '10th Apr 2026', shipper: 'MILLICENT PAPPOE', consignee: 'JACQUELYN SACKIE-MENSAH', sCity: 'ACCRA', rCity: 'CREST HILL,IL' },
    { id: 4, tracking: 'CG066452425GH', date: '10th Apr 2026', shipper: 'DORIS WIAFE-ANNOR', consignee: 'SARAH RICHARDS', sCity: 'ACCRA', rCity: 'BETHANY, OKLAHOMA' },
    { id: 5, tracking: 'CG066451270GH', date: '10th Apr 2026', shipper: 'PRINCE NYARKO', consignee: 'WINIFRED GYAMEA', sCity: 'ACCRA', rCity: 'ABERDEEN,MD' },
    { id: 6, tracking: 'CG066451204GH', date: '10th Apr 2026', shipper: 'MARJORIE A. DJOKOTEO', consignee: 'MARIE FOFANAH', sCity: 'ACCRA', rCity: 'RICHMOND BC' },
    { id: 7, tracking: 'CG066451133GH', date: '10th Apr 2026', shipper: 'OWUSU KWABENA DAMOAH', consignee: 'GLADYS PEPRAH', sCity: 'ACCRA', rCity: 'VIENNA, VA SOUTH WEST' },
    { id: 8, tracking: 'CG066449449GH', date: '10th Apr 2026', shipper: 'SAMUEL A. KELLSON', consignee: 'ALFRED NYAMPONG', sCity: 'ACCRA', rCity: 'NORTHWEST EDMONTON,AB' },
    { id: 9, tracking: 'CG066449214GH', date: '10th Apr 2026', shipper: 'ERIC Y. OTOPAH', consignee: 'AFIA ATAA', sCity: 'ACCRA', rCity: 'HARLOW-ESSEX' },
    { id: 10, tracking: 'CG066448695GH', date: '10th Apr 2026', shipper: 'RICHARD AMANING', consignee: 'TAI DIXON', sCity: 'ACCRA', rCity: 'BOWIE, MD' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gp-blue/10 flex items-center justify-center">
              <Package size={20} className="text-gp-blue" />
            </div>
            Foreign Parcels
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">List of all foreign parcel consignments</p>
        </div>
        <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-gray-600 transition-all">
            <RefreshCcw size={15} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all">
            <Plus size={15} />
            New Parcel
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        {/* Search, Filters & Reports Bar */}
        <div className="flex flex-col gap-5 p-6 border-b border-black/5 bg-gradient-to-r from-gp-blue/[0.03] to-transparent">
          <div className="flex flex-col xl:flex-row items-center gap-4 w-full">
            <div className="relative flex-1 w-full xl:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gp-blue/40" size={18} />
              <input
                type="text"
                placeholder="Search by tracking no, shipper, consignee..."
                className="w-full h-[46px] pl-11 pr-4 py-3 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm font-medium text-gray-700 transition-all placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-3 w-full md:w-auto bg-white border border-black/5 rounded-2xl shadow-sm px-4 h-[46px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">From:</span>
                  <input type="date" className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" title="Date From" />
                </div>
                <div className="w-px h-6 bg-black/5 hidden md:block" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">To:</span>
                  <input type="date" className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" title="Date To" />
                </div>
              </div>
              
              <SearchableSelect 
                options={branchOptions} 
                value={selectedBranch} 
                onChange={setSelectedBranch} 
                placeholder="All Branches" 
                icon={MapPin} 
              />
              
              <SearchableSelect 
                options={userOptions} 
                value={selectedUser} 
                onChange={setSelectedUser} 
                placeholder="All Users" 
                icon={User} 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-1">
            <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm inline-flex items-center gap-2">
              Viewing <span className="font-bold text-gp-blue bg-gp-blue/10 px-2 py-0.5 rounded-md">1–10</span> of <span className="font-bold text-gray-900">5000</span> records
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-blue/10 hover:bg-gp-blue/20 text-gp-blue text-sm font-bold transition-all active:scale-95 group">
                <Printer size={16} className="group-hover:scale-110 transition-transform" /> Print Report
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all active:scale-95 group">
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gp-blue/[0.04] border-b border-black/5">
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">#</th>
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Date</th>
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue">Tracking No.</th>
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Shipper</th>
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Consignee</th>
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Sender's City</th>
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Receiver's City</th>
                <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {mockData.map((item, idx) => (
                <tr key={idx} onClick={() => setSelectedConsignment(item)} className="hover:bg-gp-blue/[0.02] transition-colors group cursor-pointer">
                  <td className="py-4 px-6 text-gray-400 text-xs font-bold">{item.id}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.date}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gp-blue text-sm tracking-wide">{item.tracking}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800 text-sm">{item.shipper}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.consignee}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.sCity}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.rCity}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedConsignment(item); }}
                        className="p-2 bg-gp-blue/10 hover:bg-gp-blue/20 text-gp-blue rounded-xl transition-all hover:scale-110"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingConsignment(item); }}
                        className="p-2 bg-gp-orange/10 hover:bg-gp-orange/20 text-gp-orange rounded-xl transition-all hover:scale-110"
                        title="Edit Consignment"
                      >
                        <Pencil size={15} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all hover:scale-110"
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-black/5">
          <div className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">10</span> of <span className="font-bold text-gray-900">5000</span> results
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">
              <ChevronLeft size={16} /> Previous
            </button>
            <button className="px-4 py-2 bg-gp-blue text-white rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">1</button>
            <button className="px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">2</button>
            <button className="px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">3</button>
            <button className="flex items-center gap-1 px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <ConsignmentDetailsModal isOpen={!!selectedConsignment} onClose={() => setSelectedConsignment(null)} consignment={selectedConsignment} />
      <EditConsignmentModal isOpen={!!editingConsignment} onClose={() => setEditingConsignment(null)} consignment={editingConsignment} />
    </div>
  );
}

// ─── EXPRESS MAIL SERVICE (EMS) PAGES ───────────────────────────────────────

function AddForeignEMS({ user }: { user: any }) {
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all uppercase";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-gp-blue/50 mb-1.5 ml-0.5";
  const selectCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-gray-700";

  const [originPO, setOriginPO] = React.useState('');
  const [hsCodesData, setHsCodesData] = React.useState<{ code: string, desc: string }[]>([]);
  const [items, setItems] = React.useState([{ id: 1, description: '', hsCode: '' }]);

  React.useEffect(() => {
    fetch('/data/hs-codes.json').then(res => res.json()).then(data => setHsCodesData(data)).catch(() => {});
  }, []);

  const descOptions = hsCodesData.map((d: any) => ({ label: d.desc, sub: d.code, original: d }));
  const hsOptions = Array.from(new Set(hsCodesData.map((d: any) => d.code))).map(code => {
    const match = hsCodesData.find((d: any) => d.code === code);
    return { label: code as string, sub: match?.desc || '', original: match };
  });
  const addItem = () => setItems(prev => [...prev, { id: Date.now(), description: '', hsCode: '' }]);
  const removeItem = (id: number) => setItems(prev => prev.filter(it => it.id !== id));
  const updateItem = (id: number, field: string, value: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gp-blue/10 flex items-center justify-center"><Zap size={20} className="text-gp-blue" /></div>
            New Foreign EMS
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Create a new Express Mail Service consignment entry</p>
        </div>
        <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-gray-600 transition-all"><RefreshCcw size={15} /> Reset Form</button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gp-blue/20 hover:bg-gp-blue/5 text-sm font-semibold text-gp-blue transition-all"><Search size={15} /> Find Consignment</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gp-blue">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Globe size={16} className="text-white" /></div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Shipper (Sender)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div><label className={labelCls}>Name</label><input type="text" placeholder="Full name" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Digital Address</label><input type="text" placeholder="e.g. GA-123-4567" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Location Address</label><textarea placeholder="Full physical address" className={`${inputCls} h-20 resize-none`} onChange={e => e.target.value = e.target.value.toUpperCase()}></textarea></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Post/Zip Code</label><input type="text" placeholder="Zip code" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>State/Region</label><input type="text" placeholder="Region" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>City/Town</label><input type="text" placeholder="City" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>Tel</label><input type="text" placeholder="Phone number" className={inputCls} /></div>
            </div>
            <div>
              <label className={labelCls}>Origin (Post Office)</label>
              <SearchableSelect options={POST_OFFICE_OPTIONS} value={originPO} onChange={setOriginPO} placeholder="Search post office..." className="w-full" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gp-orange">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Zap size={16} className="text-white" /></div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Consignee (Recipient)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div><label className={labelCls}>Name</label><input type="text" placeholder="Full name" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Digital Address</label><input type="text" placeholder="Digital address" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Location Address</label><textarea placeholder="Full physical address" className={`${inputCls} h-20 resize-none`} onChange={e => e.target.value = e.target.value.toUpperCase()}></textarea></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Post/Zip Code</label><input type="text" placeholder="Zip code" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>State/Region</label><input type="text" placeholder="Region" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>City/Town</label><input type="text" placeholder="City" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>Tel</label><input type="text" placeholder="Phone number" className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Destination Country</label>
              <div className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.06] text-sm text-gray-700 font-semibold flex items-center gap-2">
                <Globe size={14} className="text-gp-blue" /> United States of America (US)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-gp-blue">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Zap size={16} className="text-white" /></div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wide">Foreign EMS Consignment Details</h3>
        </div>
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Calculator size={15} className="text-gp-blue" />EMS Items <span className="text-[10px] font-bold text-gp-blue/50 uppercase tracking-wider ml-1">(for duty cost)</span></h4>
                <div className="flex flex-wrap items-center gap-2 mt-2 ml-5">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-blue/10 text-gp-blue">Currency: GHS</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-blue/10 text-gp-blue">Origin: GH</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Destination — auto-linked from Consignee</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Tracking No. — auto-generated on save</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Shipping Cost — auto-calculated</span>
                </div>
              </div>
              <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gp-blue/10 text-gp-blue text-xs font-bold hover:bg-gp-blue/20 transition-all"><Plus size={13} /> Add Item</button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-gp-blue/[0.02] rounded-2xl border border-gp-blue/5 p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gp-blue/50">Item {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50">
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <AutocompleteInput label="Description" placeholder="e.g. Documents" value={item.description}
                        onChange={(val) => updateItem(item.id, 'description', val)}
                        onSelect={(val, original) => { setItems(prev => prev.map(it => it.id === item.id ? { ...it, description: val, hsCode: original?.code || it.hsCode } : it)); }}
                        options={descOptions} />
                    </div>
                    <div>
                      <AutocompleteInput label="HS Code" placeholder="e.g. 4901.10" value={item.hsCode}
                        onChange={(val) => updateItem(item.id, 'hsCode', val)}
                        onSelect={(val, original) => { setItems(prev => prev.map(it => it.id === item.id ? { ...it, hsCode: val, description: original?.desc || it.description } : it)); }}
                        options={hsOptions} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Unit Price (GHS)</label><input type="number" placeholder="0.00" className={inputCls} /></div>
                    <div><label className={labelCls}>Quantity</label><input type="number" placeholder="1" className={inputCls} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-black/5"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div><label className={labelCls}>Service</label><div className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.06] text-sm text-gray-700 font-semibold">DEMAND - FOREIGN</div></div>
              <div><label className={labelCls}>Parcel Type</label><select className={selectCls}><option value="">-Select Option-</option><option>Document</option><option>Non-Documents</option><option>Merchandise</option></select></div>
              <div><label className={labelCls}>No. of Items</label><select className={selectCls}><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>
              <div><label className={labelCls}>Weight</label><div className="flex items-center gap-3"><input type="number" placeholder="0.00" className={`${inputCls} flex-1`} /><span className="text-sm font-bold text-gray-600 bg-black/5 px-4 py-2.5 rounded-xl border border-black/10">kg</span></div></div>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Content Description / Manufacturing Country</label><textarea placeholder="Describe contents and country of manufacture" className={`${inputCls} h-24 resize-none`} onChange={e => e.target.value = e.target.value.toUpperCase()}></textarea></div>
              <div><label className={labelCls}>Add Insurance</label><select className={selectCls}><option>No</option><option>Yes</option></select></div>
              <div>
                <label className={labelCls}>Carton Type &amp; Quantity</label>
                <div className="flex items-center gap-2">
                  <select className={`${selectCls} flex-1`}>
                    <option value="">Select Carton Type</option>
                    <option>EMS Cartons Extra Large</option>
                    <option>EMS Cartons Large</option>
                    <option>EMS Cartons Medium</option>
                    <option>EMS Cartons Small</option>
                    <option>EMS Cartons Very Small</option>
                    <option>Parcel Cartons Extra Large</option>
                    <option>Parcel Cartons Extra Small</option>
                    <option>Parcel Cartons Large</option>
                    <option>Parcel Cartons Medium</option>
                    <option>Parcel Cartons Small</option>
                  </select>
                  <input type="number" placeholder="Qty" className="w-20 px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-center" min="1" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-black/5 flex items-center justify-between gap-4">
            <TotalAmountSummaryBox total={0} duty={0} carton={0} shipping={0} />
            <button className="flex items-center justify-center gap-2 w-[280px] py-3.5 bg-gp-orange text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 active:scale-[0.98] transition-all"><Plus size={18} /> Create EMS Consignment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewForeignEMS({ user }: { user: any }) {
  const [selectedConsignment, setSelectedConsignment] = useState<any>(null);
  const [editingConsignment, setEditingConsignment] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const branchOptions = [
    { value: "", label: "All Branches" },
    { value: "general", label: "GPO Accra" },
    { value: "accra-north", label: "Accra North" },
    { value: "kumasi", label: "Kumasi Central" },
    { value: "takoradi", label: "Takoradi Harbor" },
  ];

  const userOptions = [
    { value: "", label: "All Users" },
    { value: "user1", label: "John Doe" },
    { value: "user2", label: "Jane Smith" },
    { value: "user3", label: "Robert Mensah" },
    { value: "user4", label: "Sarah Owusu" },
  ];

  const mockData = [
    { id: 1, tracking: 'EE066454599GH', date: '10th Apr 2026', shipper: 'KWAME ASANTE', consignee: 'JOHN MENSAH', sCity: 'ACCRA', rCity: 'NEW YORK, NY' },
    { id: 2, tracking: 'EE066453695GH', date: '10th Apr 2026', shipper: 'ABENA BOATENG', consignee: 'CLAIRE ADAMS', sCity: 'ACCRA', rCity: 'LONDON, UK' },
    { id: 3, tracking: 'EE066452615GH', date: '10th Apr 2026', shipper: 'KOFI AGYEMANG', consignee: 'PETER NKRUMAH', sCity: 'ACCRA', rCity: 'TORONTO, ON' },
    { id: 4, tracking: 'EE066452425GH', date: '10th Apr 2026', shipper: 'AKOSUA FRIMPONG', consignee: 'LINDA OSEI', sCity: 'ACCRA', rCity: 'SYDNEY, NSW' },
    { id: 5, tracking: 'EE066451270GH', date: '10th Apr 2026', shipper: 'YEBOAH AMPONSAH', consignee: 'GRACE APPIAH', sCity: 'ACCRA', rCity: 'BERLIN, DE' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gp-blue/10 flex items-center justify-center"><Zap size={20} className="text-gp-blue" /></div>
            Foreign EMS Consignments
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">List of all Express Mail Service consignments</p>
        </div>
        <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-gray-600 transition-all"><RefreshCcw size={15} /> Refresh</button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all"><Plus size={15} /> New EMS</button>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="flex flex-col gap-5 p-6 border-b border-black/5 bg-gradient-to-r from-gp-blue/[0.03] to-transparent">
          <div className="flex flex-col xl:flex-row items-center gap-4 w-full">
            <div className="relative flex-1 w-full xl:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gp-blue/40" size={18} />
              <input
                type="text"
                placeholder="Search by tracking no, shipper, consignee..."
                className="w-full h-[46px] pl-11 pr-4 py-3 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm font-medium text-gray-700 transition-all placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-3 w-full md:w-auto bg-white border border-black/5 rounded-2xl shadow-sm px-4 h-[46px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">From:</span>
                  <input type="date" className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" title="Date From" />
                </div>
                <div className="w-px h-6 bg-black/5 hidden md:block" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">To:</span>
                  <input type="date" className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" title="Date To" />
                </div>
              </div>
              
              <SearchableSelect 
                options={branchOptions} 
                value={selectedBranch} 
                onChange={setSelectedBranch} 
                placeholder="All Branches" 
                icon={MapPin} 
              />
              
              <SearchableSelect 
                options={userOptions} 
                value={selectedUser} 
                onChange={setSelectedUser} 
                placeholder="All Users" 
                icon={User} 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-1">
            <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm inline-flex items-center gap-2">
              Viewing <span className="font-bold text-gp-blue bg-gp-blue/10 px-2 py-0.5 rounded-md">1–5</span> of <span className="font-bold text-gray-900">5000</span> records
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-blue/10 hover:bg-gp-blue/20 text-gp-blue text-sm font-bold transition-all active:scale-95 group">
                <Printer size={16} className="group-hover:scale-110 transition-transform" /> Print Report
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all active:scale-95 group">
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gp-blue/[0.04] border-b border-black/5">
                {['#','Date','Tracking No.','Shipper','Consignee',"Sender's City","Receiver's City",'Action'].map((h, i) => (
                  <th key={i} className={`py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider ${i === 2 ? 'text-gp-blue' : 'text-gp-blue/60'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {mockData.map((item, idx) => (
                <tr key={idx} onClick={() => setSelectedConsignment(item)} className="hover:bg-gp-blue/[0.02] transition-colors group cursor-pointer">
                  <td className="py-4 px-6 text-gray-400 text-xs font-bold">{item.id}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.date}</td>
                  <td className="py-4 px-6"><span className="font-bold text-gp-blue text-sm tracking-wide">{item.tracking}</span></td>
                  <td className="py-4 px-6 font-semibold text-gray-800 text-sm">{item.shipper}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.consignee}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.sCity}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.rCity}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedConsignment(item); }}
                        className="p-2 bg-gp-blue/10 hover:bg-gp-blue/20 text-gp-blue rounded-xl transition-all hover:scale-110"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingConsignment(item); }}
                        className="p-2 bg-gp-orange/10 hover:bg-gp-orange/20 text-gp-orange rounded-xl transition-all hover:scale-110"
                        title="Edit Consignment"
                      >
                        <Pencil size={15} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all hover:scale-110"
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-black/5">
          <div className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">5</span> of <span className="font-bold text-gray-900">5000</span> results</div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600"><ChevronLeft size={16} /> Previous</button>
            <button className="px-4 py-2 bg-gp-blue text-white rounded-xl text-sm font-bold shadow-sm">1</button>
            <button className="px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">2</button>
            <button className="flex items-center gap-1 px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">Next <ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <ConsignmentDetailsModal isOpen={!!selectedConsignment} onClose={() => setSelectedConsignment(null)} consignment={selectedConsignment} />
      <EditConsignmentModal isOpen={!!editingConsignment} onClose={() => setEditingConsignment(null)} consignment={editingConsignment} />
    </div>
  );
}

// ─── LETTERS PAGES ───────────────────────────────────────────────────────────

function AddForeignLetter({ user }: { user: any }) {
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all uppercase";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-gp-blue/50 mb-1.5 ml-0.5";
  const selectCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-gray-700";

  const [originPO, setOriginPO] = React.useState('');
  const [hsCodesData, setHsCodesData] = React.useState<{ code: string, desc: string }[]>([]);
  const [items, setItems] = React.useState([{ id: 1, description: '', hsCode: '' }]);

  React.useEffect(() => {
    fetch('/data/hs-codes.json').then(res => res.json()).then(data => setHsCodesData(data)).catch(() => {});
  }, []);

  const descOptions = hsCodesData.map((d: any) => ({ label: d.desc, sub: d.code, original: d }));
  const hsOptions = Array.from(new Set(hsCodesData.map((d: any) => d.code))).map(code => {
    const match = hsCodesData.find((d: any) => d.code === code);
    return { label: code as string, sub: match?.desc || '', original: match };
  });
  const addItem = () => setItems(prev => [...prev, { id: Date.now(), description: '', hsCode: '' }]);
  const removeItem = (id: number) => setItems(prev => prev.filter(it => it.id !== id));
  const updateItem = (id: number, field: string, value: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gp-blue/10 flex items-center justify-center"><Mail size={20} className="text-gp-blue" /></div>
            New Foreign Letter
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Create a new foreign letter consignment entry</p>
        </div>
        <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-gray-600 transition-all"><RefreshCcw size={15} /> Reset Form</button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gp-blue/20 hover:bg-gp-blue/5 text-sm font-semibold text-gp-blue transition-all"><Search size={15} /> Find Consignment</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gp-blue">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Globe size={16} className="text-white" /></div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Shipper (Sender)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div><label className={labelCls}>Name</label><input type="text" placeholder="Full name" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Digital Address</label><input type="text" placeholder="e.g. GA-123-4567" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Location Address</label><textarea placeholder="Full physical address" className={`${inputCls} h-20 resize-none`} onChange={e => e.target.value = e.target.value.toUpperCase()}></textarea></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Post/Zip Code</label><input type="text" placeholder="Zip code" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>State/Region</label><input type="text" placeholder="Region" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>City/Town</label><input type="text" placeholder="City" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>Tel</label><input type="text" placeholder="Phone number" className={inputCls} /></div>
            </div>
            <div>
              <label className={labelCls}>Origin (Post Office)</label>
              <SearchableSelect options={POST_OFFICE_OPTIONS} value={originPO} onChange={setOriginPO} placeholder="Search post office..." className="w-full" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gp-orange">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Mail size={16} className="text-white" /></div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Consignee (Recipient)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div><label className={labelCls}>Name</label><input type="text" placeholder="Full name" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Digital Address</label><input type="text" placeholder="Digital address" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            <div><label className={labelCls}>Location Address</label><textarea placeholder="Full physical address" className={`${inputCls} h-20 resize-none`} onChange={e => e.target.value = e.target.value.toUpperCase()}></textarea></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Post/Zip Code</label><input type="text" placeholder="Zip code" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>State/Region</label><input type="text" placeholder="Region" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>City/Town</label><input type="text" placeholder="City" className={inputCls} onChange={e => e.target.value = e.target.value.toUpperCase()} /></div>
              <div><label className={labelCls}>Tel</label><input type="text" placeholder="Phone number" className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Destination Country</label>
              <div className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.06] text-sm text-gray-700 font-semibold flex items-center gap-2">
                <Globe size={14} className="text-gp-blue" /> United States of America (US)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-gp-blue">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Mail size={16} className="text-white" /></div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wide">Foreign Letter Consignment Details</h3>
        </div>
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Calculator size={15} className="text-gp-blue" />Letter Items <span className="text-[10px] font-bold text-gp-blue/50 uppercase tracking-wider ml-1">(for duty cost)</span></h4>
                <div className="flex flex-wrap items-center gap-2 mt-2 ml-5">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-blue/10 text-gp-blue">Currency: GHS</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-blue/10 text-gp-blue">Origin: GH</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Destination — auto-linked from Consignee</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Tracking No. — auto-generated on save</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gp-orange/10 text-gp-orange">🔗 Shipping Cost — auto-calculated</span>
                </div>
              </div>
              <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gp-blue/10 text-gp-blue text-xs font-bold hover:bg-gp-blue/20 transition-all"><Plus size={13} /> Add Item</button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-gp-blue/[0.02] rounded-2xl border border-gp-blue/5 p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gp-blue/50">Item {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50">
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <AutocompleteInput label="Description" placeholder="e.g. Personal Letter" value={item.description}
                        onChange={(val) => updateItem(item.id, 'description', val)}
                        onSelect={(val, original) => { setItems(prev => prev.map(it => it.id === item.id ? { ...it, description: val, hsCode: original?.code || it.hsCode } : it)); }}
                        options={descOptions} />
                    </div>
                    <div>
                      <AutocompleteInput label="HS Code" placeholder="e.g. 4901.10" value={item.hsCode}
                        onChange={(val) => updateItem(item.id, 'hsCode', val)}
                        onSelect={(val, original) => { setItems(prev => prev.map(it => it.id === item.id ? { ...it, hsCode: val, description: original?.desc || it.description } : it)); }}
                        options={hsOptions} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Unit Price (GHS)</label><input type="number" placeholder="0.00" className={inputCls} /></div>
                    <div><label className={labelCls}>Quantity</label><input type="number" placeholder="1" className={inputCls} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-black/5"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div><label className={labelCls}>Service</label><select className={selectCls}><option value="">-Select Option-</option><option>DEMAND-Bulk Registered</option><option>DEMAND-Registered</option><option>DEMAND-Tracked</option><option>DEMAND-Goods/Merchandise</option></select></div>
              <div><label className={labelCls}>Parcel Type</label><select className={selectCls}><option value="">-Select Option-</option><option>Document</option><option>Non-Documents</option><option>Merchandise</option></select></div>
              <div><label className={labelCls}>No. of Items</label><select className={selectCls}><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>
              <div><label className={labelCls}>Weight</label><div className="flex items-center gap-3"><input type="number" placeholder="0.00" className={`${inputCls} flex-1`} /><span className="text-sm font-bold text-gray-600 bg-black/5 px-4 py-2.5 rounded-xl border border-black/10">kg</span></div></div>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Content Description / Manufacturing Country</label><textarea placeholder="Describe letter contents" className={`${inputCls} h-24 resize-none`} onChange={e => e.target.value = e.target.value.toUpperCase()}></textarea></div>
              <div><label className={labelCls}>Add Insurance</label><select className={selectCls}><option>No</option><option>Yes</option></select></div>
              <div>
                <label className={labelCls}>Carton Type &amp; Quantity</label>
                <div className="flex items-center gap-2">
                  <select className={`${selectCls} flex-1`}>
                    <option value="">Select Carton Type</option>
                    <option>EMS Cartons Extra Large</option>
                    <option>EMS Cartons Large</option>
                    <option>EMS Cartons Medium</option>
                    <option>EMS Cartons Small</option>
                    <option>EMS Cartons Very Small</option>
                    <option>Parcel Cartons Extra Large</option>
                    <option>Parcel Cartons Extra Small</option>
                    <option>Parcel Cartons Large</option>
                    <option>Parcel Cartons Medium</option>
                    <option>Parcel Cartons Small</option>
                  </select>
                  <input type="number" placeholder="Qty" className="w-20 px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-center" min="1" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-black/5 flex items-center justify-between gap-4">
            <TotalAmountSummaryBox total={0} duty={0} carton={0} shipping={0} />
            <button className="flex items-center justify-center gap-2 w-[280px] py-3.5 bg-gp-orange text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 active:scale-[0.98] transition-all"><Plus size={18} /> Create Letter Consignment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewForeignLetters({ user }: { user: any }) {
  const [selectedConsignment, setSelectedConsignment] = useState<any>(null);
  const [editingConsignment, setEditingConsignment] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const branchOptions = [
    { value: "", label: "All Branches" },
    { value: "general", label: "GPO Accra" },
    { value: "accra-north", label: "Accra North" },
    { value: "kumasi", label: "Kumasi Central" },
    { value: "takoradi", label: "Takoradi Harbor" },
  ];

  const userOptions = [
    { value: "", label: "All Users" },
    { value: "user1", label: "John Doe" },
    { value: "user2", label: "Jane Smith" },
    { value: "user3", label: "Robert Mensah" },
    { value: "user4", label: "Sarah Owusu" },
  ];

  const mockData = [
    { id: 1, tracking: 'RR066454599GH', date: '10th Apr 2026', shipper: 'KWAME ASANTE', consignee: 'JOHN MENSAH', sCity: 'ACCRA', rCity: 'NEW YORK, NY' },
    { id: 2, tracking: 'RR066453695GH', date: '10th Apr 2026', shipper: 'ABENA BOATENG', consignee: 'CLAIRE ADAMS', sCity: 'ACCRA', rCity: 'LONDON, UK' },
    { id: 3, tracking: 'RR066452615GH', date: '10th Apr 2026', shipper: 'KOFI AGYEMANG', consignee: 'PETER NKRUMAH', sCity: 'ACCRA', rCity: 'TORONTO, ON' },
    { id: 4, tracking: 'RR066452425GH', date: '10th Apr 2026', shipper: 'AKOSUA FRIMPONG', consignee: 'LINDA OSEI', sCity: 'ACCRA', rCity: 'SYDNEY, NSW' },
    { id: 5, tracking: 'RR066451270GH', date: '10th Apr 2026', shipper: 'YEBOAH AMPONSAH', consignee: 'GRACE APPIAH', sCity: 'ACCRA', rCity: 'BERLIN, DE' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gp-blue/10 flex items-center justify-center"><Mail size={20} className="text-gp-blue" /></div>
            Foreign Letter Consignments
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">List of all foreign letter consignments</p>
        </div>
        <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-gray-600 transition-all"><RefreshCcw size={15} /> Refresh</button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all"><Plus size={15} /> New Letter</button>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="flex flex-col gap-5 p-6 border-b border-black/5 bg-gradient-to-r from-gp-blue/[0.03] to-transparent">
          <div className="flex flex-col xl:flex-row items-center gap-4 w-full">
            <div className="relative flex-1 w-full xl:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gp-blue/40" size={18} />
              <input
                type="text"
                placeholder="Search by tracking no, shipper, consignee..."
                className="w-full h-[46px] pl-11 pr-4 py-3 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm font-medium text-gray-700 transition-all placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-3 w-full md:w-auto bg-white border border-black/5 rounded-2xl shadow-sm px-4 h-[46px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">From:</span>
                  <input type="date" className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" title="Date From" />
                </div>
                <div className="w-px h-6 bg-black/5 hidden md:block" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">To:</span>
                  <input type="date" className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" title="Date To" />
                </div>
              </div>
              
              <SearchableSelect 
                options={branchOptions} 
                value={selectedBranch} 
                onChange={setSelectedBranch} 
                placeholder="All Branches" 
                icon={MapPin} 
              />
              
              <SearchableSelect 
                options={userOptions} 
                value={selectedUser} 
                onChange={setSelectedUser} 
                placeholder="All Users" 
                icon={User} 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-1">
            <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm inline-flex items-center gap-2">
              Viewing <span className="font-bold text-gp-blue bg-gp-blue/10 px-2 py-0.5 rounded-md">1–5</span> of <span className="font-bold text-gray-900">5000</span> records
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-blue/10 hover:bg-gp-blue/20 text-gp-blue text-sm font-bold transition-all active:scale-95 group">
                <Printer size={16} className="group-hover:scale-110 transition-transform" /> Print Report
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all active:scale-95 group">
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gp-blue/[0.04] border-b border-black/5">
                {['#','Date','Tracking No.','Shipper','Consignee',"Sender's City","Receiver's City",'Action'].map((h, i) => (
                  <th key={i} className={`py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider ${i === 2 ? 'text-gp-blue' : 'text-gp-blue/60'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {mockData.map((item, idx) => (
                <tr key={idx} onClick={() => setSelectedConsignment(item)} className="hover:bg-gp-blue/[0.02] transition-colors group cursor-pointer">
                  <td className="py-4 px-6 text-gray-400 text-xs font-bold">{item.id}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.date}</td>
                  <td className="py-4 px-6"><span className="font-bold text-gp-blue text-sm tracking-wide">{item.tracking}</span></td>
                  <td className="py-4 px-6 font-semibold text-gray-800 text-sm">{item.shipper}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.consignee}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.sCity}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{item.rCity}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedConsignment(item); }}
                        className="p-2 bg-gp-blue/10 hover:bg-gp-blue/20 text-gp-blue rounded-xl transition-all hover:scale-110"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingConsignment(item); }}
                        className="p-2 bg-gp-orange/10 hover:bg-gp-orange/20 text-gp-orange rounded-xl transition-all hover:scale-110"
                        title="Edit Consignment"
                      >
                        <Pencil size={15} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all hover:scale-110"
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-black/5">
          <div className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">5</span> of <span className="font-bold text-gray-900">5000</span> results</div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600"><ChevronLeft size={16} /> Previous</button>
            <button className="px-4 py-2 bg-gp-blue text-white rounded-xl text-sm font-bold shadow-sm">1</button>
            <button className="px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">2</button>
            <button className="flex items-center gap-1 px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-gray-600">Next <ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <ConsignmentDetailsModal isOpen={!!selectedConsignment} onClose={() => setSelectedConsignment(null)} consignment={selectedConsignment} />
      <EditConsignmentModal isOpen={!!editingConsignment} onClose={() => setEditingConsignment(null)} consignment={editingConsignment} />
    </div>
  );
}

function SellCarton({ user, onSave }: { user: any, onSave: (sale: any) => void }) {
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-gp-blue/50 mb-1.5 ml-0.5";
  const selectCls = "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.03] focus:bg-white focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm transition-all text-gray-700";

  const [originPO, setOriginPO] = React.useState(user?.post_office || '');
  const [cartonName, setCartonName] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [receivedFrom, setReceivedFrom] = React.useState('');
  const [tel, setTel] = React.useState('');

  const cartons = [
    { name: "EMS Cartons Extra Large", price: 25.00 },
    { name: "EMS Cartons Large", price: 20.00 },
    { name: "EMS Cartons Medium", price: 15.00 },
    { name: "EMS Cartons Small", price: 10.00 },
    { name: "EMS Cartons Very Small", price: 5.00 },
    { name: "Parcel Cartons Extra Large", price: 25.00 },
    { name: "Parcel Cartons Extra Small", price: 5.00 },
    { name: "Parcel Cartons Large", price: 20.00 },
    { name: "Parcel Cartons Medium", price: 15.00 },
    { name: "Parcel Cartons Small", price: 10.00 }
  ];

  const handleCartonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setCartonName(name);
    const selected = cartons.find(c => c.name.toUpperCase() === name.toUpperCase());
    setPrice(selected ? selected.price : 0);
  };

  const handleSave = () => {
    if (!cartonName || !originPO) {
      alert("Please select a Carton and Post Office");
      return;
    }
    const saleNo = `PC${Math.floor(100000 + Math.random() * 899999)}${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}GP`;
    const newSale = {
      id: Date.now().toString(),
      sale_no: saleNo,
      date_purchased: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      carton_name: cartonName.toUpperCase(),
      qty: quantity,
      unit_price: price,
      total_price: price * quantity,
      post_office: originPO,
      received_from: receivedFrom,
      tel: tel,
      sold_by: user?.full_name || 'SYSTEM ADMIN'
    };
    onSave(newSale);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">New Parcel Carton Sale</h2>
            <div className="px-2 py-0.5 rounded-md bg-gp-orange/20 text-gp-orange text-[10px] font-bold uppercase tracking-widest">Sale</div>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Process a new parcel carton sale</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-gp-blue">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Box size={16} className="text-white" /></div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wide">Sale Details</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Post Office(branch)</label>
                <SearchableSelect options={POST_OFFICE_OPTIONS} value={originPO} onChange={setOriginPO} placeholder="Search branch..." className="w-full" />
              </div>
              <div><label className={labelCls}>Carton Name</label>
                <select className={selectCls} value={cartonName} onChange={handleCartonChange}>
                  <option value="">Please Select Carton Type</option>
                  {cartons.map(c => <option key={c.name} value={c.name.toUpperCase()}>{c.name.toUpperCase()}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Price</label><div className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/[0.06] text-sm text-gray-700 font-semibold">{price.toFixed(2)}</div></div>
              <div><label className={labelCls}>Quantity</label><input type="number" className={inputCls} value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" /></div>
            </div>
            
            <div className="space-y-4">
              <div><label className={labelCls}>Received From</label><input type="text" className={inputCls} placeholder="Customer Name" value={receivedFrom} onChange={e => setReceivedFrom(e.target.value)} /></div>
              <div><label className={labelCls}>Tel. / Mobile</label><input type="text" className={inputCls} placeholder="Phone Number" value={tel} onChange={e => setTel(e.target.value)} /></div>
            </div>

            {/* Total Display */}
            <div className="absolute right-0 bottom-0 bg-yellow-50 border border-yellow-200 px-6 py-4 rounded-2xl flex flex-col items-end shadow-sm">
              <span className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-1">TOTAL AMT:</span>
              <span className="text-3xl font-black text-red-600">{(price * quantity).toFixed(2)}</span>
            </div>
          </div>
          <div className="pt-6 border-t border-black/5 flex justify-start">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3.5 bg-gp-orange text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus size={18} /> Add New Parcel Carton Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewCartonSales({ 
    user, 
    cartonSales, 
    onViewDetails,
    onAddSale
  }: { 
    user: any, 
    cartonSales: any[], 
    onViewDetails: (sale: any) => void,
    onAddSale: () => void 
  }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('Carton Sales No.');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cartonTypeFilter, setCartonTypeFilter] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
  
    const cartons = [
      "EMS Cartons Extra Large", "EMS Cartons Large", "EMS Cartons Medium", "EMS Cartons Small", "EMS Cartons Very Small",
      "Parcel Cartons Extra Large", "Parcel Cartons Extra Small", "Parcel Cartons Large", "Parcel Cartons Medium", "Parcel Cartons Small"
    ];

    const cartonOptions = [
      { value: "", label: "All Carton Types" },
      ...cartons.map(c => ({ value: c.toUpperCase(), label: c.toUpperCase() }))
    ];
  
    const filteredSales = cartonSales.filter(sale => {
      const matchesSearch = !searchTerm || (
        searchBy === 'Carton Sales No.' ? sale.sale_no.toLowerCase().includes(searchTerm.toLowerCase()) :
        searchBy === 'Customer Name' ? sale.received_from?.toLowerCase().includes(searchTerm.toLowerCase()) :
        true
      );
      const matchesType = !cartonTypeFilter || sale.carton_name.toUpperCase() === cartonTypeFilter.toUpperCase();
      const matchesBranch = !selectedBranch || sale.post_office.toUpperCase() === selectedBranch.toUpperCase();
      return matchesSearch && matchesType && matchesBranch;
    });
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gp-orange/10 flex items-center justify-center">
                <Box size={20} className="text-gp-orange" />
              </div>
              List of Cartons Sold
            </h2>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">View and manage all carton sales</p>
          </div>
          <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-gray-600 transition-all">
              <RefreshCcw size={15} /> Refresh
            </button>
            <button 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all"
                onClick={onAddSale}
              >
                <Plus size={15} /> New Sale
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          {/* Joint Search, Filters & Reports Bar */}
          <div className="flex flex-col gap-5 p-6 border-b border-black/5 bg-gradient-to-r from-gp-blue/[0.03] to-transparent">
            <div className="flex flex-col xl:flex-row items-center gap-4 w-full">
              <div className="relative flex-1 w-full xl:w-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gp-blue/40" size={18} />
                <input
                  type="text"
                  placeholder="Search by sales no, customer name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full h-[46px] pl-11 pr-4 py-3 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gp-blue/20 focus:border-gp-blue/40 text-sm font-medium text-gray-700 transition-all placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full xl:w-auto">
                <div className="flex items-center gap-3 w-full md:w-auto bg-white border border-black/5 rounded-2xl shadow-sm px-4 h-[46px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">From:</span>
                    <input 
                      type="date" 
                      className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="w-px h-6 bg-black/5 hidden md:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">To:</span>
                    <input 
                      type="date" 
                      className="px-1 py-2 rounded-xl bg-transparent focus:outline-none text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <SearchableSelect 
                  options={cartonOptions} 
                  value={cartonTypeFilter} 
                  onChange={setCartonTypeFilter} 
                  placeholder="All Carton Types" 
                  icon={Box} 
                  className="w-full md:w-56"
                />

                <SearchableSelect 
                  options={[{ value: "", label: "All Branches" }, ...POST_OFFICE_OPTIONS]} 
                  value={selectedBranch} 
                  onChange={setSelectedBranch} 
                  placeholder="All Branches" 
                  icon={MapPin} 
                  className="w-full md:w-56"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-1">
              <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm inline-flex items-center gap-2">
                Viewing <span className="font-bold text-gp-blue bg-gp-blue/10 px-2 py-0.5 rounded-md">{filteredSales.length > 0 ? `1–${filteredSales.length}` : '0'}</span> of <span className="font-bold text-gray-900">{filteredSales.length}</span> records
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => alert("Printing report...")} 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-blue/10 hover:bg-gp-blue/20 text-gp-blue text-sm font-bold transition-all active:scale-95 group"
                >
                  <Printer size={16} className="group-hover:scale-110 transition-transform" /> Print Report
                </button>
                <button 
                  onClick={() => alert("Exporting report...")} 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gp-orange text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-opacity-90 transition-all active:scale-95 group"
                >
                  <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
                </button>
              </div>
            </div>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gp-blue/[0.04] border-b border-black/5">
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">#</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Date</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue">Carton Sales No.</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Carton Name</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Customer Name</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Tel.</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60">Post Office</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60 text-center">Qty</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60 text-right">Unit Price</th>
                  <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-gp-blue/60 text-right">Amt(GHC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-400 font-medium">
                      <div className="flex flex-col items-center justify-center">
                        <Box size={40} className="mb-2 opacity-20" />
                        No sales recorded yet.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, idx) => (
                    <tr 
                      key={sale.id} 
                      className="hover:bg-gp-blue/[0.02] transition-colors cursor-pointer group"
                      onClick={() => onViewDetails(sale)}
                    >
                      <td className="py-4 px-6 text-gray-400 text-xs font-bold">{idx + 1}</td>
                      <td className="py-4 px-6 text-gray-500 text-sm">{sale.date_purchased}</td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gp-blue text-sm tracking-wide uppercase px-2 py-1 bg-gp-blue/5 rounded-lg border border-gp-blue/10 group-hover:bg-gp-blue/10 transition-colors">{sale.sale_no}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800 text-sm">{sale.carton_name}</td>
                      <td className="py-4 px-6 text-gray-500 text-sm font-medium">{sale.received_from || '-'}</td>
                      <td className="py-4 px-6 text-gray-500 text-sm">{sale.tel || '-'}</td>
                      <td className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{sale.post_office}</td>
                      <td className="py-4 px-6 text-center font-bold text-gp-blue">{sale.qty}</td>
                      <td className="py-4 px-6 text-right text-gray-600 font-medium">{sale.unit_price.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right font-black text-gray-800">{sale.total_price.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/5 bg-gray-50">
            <span className="text-xs text-gray-500 font-medium">{filteredSales.length} records found</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-black/5 text-gray-500 transition-colors"><ChevronLeft size={16} /></button>
              <button className="p-1.5 rounded-lg hover:bg-black/5 text-gray-500 transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  function CartonSaleDetails({ 
    user, 
    sale, 
    onBack 
  }: { 
    user: any, 
    sale: any, 
    onBack: () => void 
  }) {
    if (!sale) return null;
  
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl shadow-sm border border-black/5">
           <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"><ChevronLeft size={20} /></button>
             <div className="h-6 w-px bg-black/5 mx-1"></div>
             <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-xs font-bold text-gp-blue hover:text-gp-blue/80 transition-colors"><RefreshCcw size={14} /> Refresh</button>
             <div className="h-6 w-px bg-black/5 mx-1"></div>
             <button onClick={() => window.print()} className="flex items-center gap-2 text-xs font-bold text-gp-orange hover:text-gp-orange/80 transition-colors"><Printer size={14} /> Print Receipt</button>
           </div>
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-gray-50 border border-black/5 rounded-xl px-3 py-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">Search Text:</label>
                <input type="text" className="bg-transparent outline-none text-xs w-32" />
                <Search size={14} className="text-gray-400" />
                <div className="h-4 w-px bg-black/5 mx-1"></div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Search By:</label>
                <select className="bg-transparent outline-none text-xs font-bold text-gp-blue">
                  <option>Priority Number</option>
                </select>
             </div>
           </div>
        </div>
  
        <div className="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">
          <div className="bg-gp-blue px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Carton Sale: {sale.carton_name} ({sale.sale_no})
            </h3>
            <div className="flex items-center gap-2">
               <ChevronDown size={18} className="text-white/50" />
               <Settings size={18} className="text-white/50" />
            </div>
          </div>
  
          <div className="p-0">
            <table className="w-full border-collapse">
              <tbody className="text-xs">
                {[
                  { label: "Carton No.", value: sale.sale_no, bold: true },
                  { label: "Post Office:", value: sale.post_office, bold: true },
                  { label: "Carton Name:", value: sale.carton_name, bold: true },
                  { label: "Qty:", value: sale.qty },
                  { label: "Unit Price:", value: `GHC ${sale.unit_price.toFixed(2)}`, bold: true },
                  { label: "Total Price:", value: `GHC ${sale.total_price.toFixed(2)}`, bold: true },
                  { label: "Recieved From:", value: sale.received_from || '' },
                  { label: "Tel. / Mobile", value: sale.tel || '' },
                  { label: "Date Purchased:", value: sale.date_purchased, bold: true },
                  { label: "Sold By:", value: sale.sold_by, bold: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-black/5 last:border-0 hover:bg-gray-50 transition-colors relative group">
                    <td className="px-6 py-3.5 text-gray-500 font-medium w-48 border-r border-black/5">{row.label}</td>
                    <td className={`px-6 py-3.5 text-gray-900 ${row.bold ? 'font-black uppercase tracking-wide' : 'font-medium'}`}>
                      {row.value}
                      
                      {row.label === "Total Price:" && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-yellow-50 border border-yellow-200 px-6 py-4 rounded-xl flex flex-col items-end shadow-sm">
                           <span className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest mb-0.5">TOTAL AMT:</span>
                           <span className="text-2xl font-black text-red-600">{(sale.total_price).toFixed(2)}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('dashboard');
  const [isParcelsOpen, setIsParcelsOpen] = useState(false);
  const [isEmsOpen, setIsEmsOpen] = useState(false);
  const [isLettersOpen, setIsLettersOpen] = useState(false);
  const [isCartonSalesOpen, setIsCartonSalesOpen] = useState(false);
  const [cartonSales, setCartonSales] = useState<any[]>([]);
  const [selectedCartonSale, setSelectedCartonSale] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const docSnap = await getDoc(doc(db, 'users', u.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({ id: u.uid, ...data });
          } else {
            // No Firestore doc? Default to OPERATIONS to prevent lockouts, but limited
            setUser({ id: u.uid, email: u.email, role: 'OPERATIONS', post_office: 'DEFAULT' });
          }
        } catch (e) {
          console.error("Error fetching user data", e);
          setUser({ id: u.uid, email: u.email, role: 'OPERATIONS', post_office: 'DEFAULT' });
        }
      } else {
        setUser(null);
      }
      setIsReady(true);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (!user) return;

    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        handleLogout();
      }, 10 * 60 * 1000); // 10 minutes
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Start timer initially
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  if (!isReady) return null;

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gp-light text-[#1a1a1a]">
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 md:w-64 gp-gradient text-white flex flex-col z-50">
        <div
          className="p-6 flex items-center gap-3 mb-8 cursor-pointer group"
          onClick={() => setView('dashboard')}
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg p-1 overflow-hidden group-hover:ring-2 group-hover:ring-white transition-all">
            <img
              src="/logo.png"
              alt="GP"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden md:block overflow-hidden">
            <h1 className="font-bold text-lg leading-none group-hover:text-gp-orange transition-colors">GP Portal</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Duty Cost v1.0</p>
          </div>
        </div>

        <div className="flex-1 px-3 space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} />
            <span className="hidden md:block font-medium text-sm">Dashboard</span>
          </button>

          {process.env.NEXT_PUBLIC_SHOW_BETA === 'true' && (
            <div className="space-y-1">
              <button
                onClick={() => setIsParcelsOpen(!isParcelsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  ['add-foreign-parcel', 'view-foreign-parcels'].includes(view) || isParcelsOpen
                    ? 'bg-gp-orange/10 text-white' 
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={20} className={['add-foreign-parcel', 'view-foreign-parcels'].includes(view) ? 'text-gp-orange' : ''} />
                  <span className="hidden md:block font-medium text-sm">Parcels</span>
                </div>
                <div className="hidden md:block">
                  <ChevronRight size={16} className={`transition-transform duration-200 ${isParcelsOpen ? 'rotate-90 text-gp-orange' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {isParcelsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1 ml-4 border-l border-white/10 pl-2"
                  >
                    <button
                      onClick={() => setView('add-foreign-parcel')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'add-foreign-parcel' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Plus size={16} />
                      <span className="hidden md:block font-medium">Add a Foreign Parcel</span>
                    </button>
                    <button
                      onClick={() => setView('view-foreign-parcels')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'view-foreign-parcels' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Package size={16} />
                      <span className="hidden md:block font-medium">View Foreign Parcels</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {process.env.NEXT_PUBLIC_SHOW_BETA === 'true' && (
            <div className="space-y-1">
              <button
                onClick={() => setIsEmsOpen(!isEmsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  ['add-foreign-ems', 'view-foreign-ems'].includes(view) || isEmsOpen
                    ? 'bg-gp-orange/10 text-white'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap size={20} className={['add-foreign-ems', 'view-foreign-ems'].includes(view) ? 'text-gp-orange' : ''} />
                  <span className="hidden md:block font-medium text-sm">Express Mail Service</span>
                </div>
                <div className="hidden md:block">
                  <ChevronRight size={16} className={`transition-transform duration-200 ${isEmsOpen ? 'rotate-90 text-gp-orange' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {isEmsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1 ml-4 border-l border-white/10 pl-2"
                  >
                    <button
                      onClick={() => setView('add-foreign-ems')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'add-foreign-ems' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Plus size={16} />
                      <span className="hidden md:block font-medium">Add a Foreign EMS</span>
                    </button>
                    <button
                      onClick={() => setView('view-foreign-ems')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'view-foreign-ems' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Zap size={16} />
                      <span className="hidden md:block font-medium">View Foreign EMS</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {process.env.NEXT_PUBLIC_SHOW_BETA === 'true' && (
            <div className="space-y-1">
              <button
                onClick={() => setIsLettersOpen(!isLettersOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  ['add-foreign-letter', 'view-foreign-letters'].includes(view) || isLettersOpen
                    ? 'bg-gp-orange/10 text-white'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail size={20} className={['add-foreign-letter', 'view-foreign-letters'].includes(view) ? 'text-gp-orange' : ''} />
                  <span className="hidden md:block font-medium text-sm">Letters</span>
                </div>
                <div className="hidden md:block">
                  <ChevronRight size={16} className={`transition-transform duration-200 ${isLettersOpen ? 'rotate-90 text-gp-orange' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {isLettersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1 ml-4 border-l border-white/10 pl-2"
                  >
                    <button
                      onClick={() => setView('add-foreign-letter')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'add-foreign-letter' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Plus size={16} />
                      <span className="hidden md:block font-medium">Add a Foreign Letter</span>
                    </button>
                    <button
                      onClick={() => setView('view-foreign-letters')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'view-foreign-letters' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Mail size={16} />
                      <span className="hidden md:block font-medium">View Foreign Letters</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {process.env.NEXT_PUBLIC_SHOW_BETA === 'true' && (
            <div className="space-y-1">
              <button
                onClick={() => setIsCartonSalesOpen(!isCartonSalesOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  ['sell-carton', 'view-carton-sales'].includes(view) || isCartonSalesOpen
                    ? 'bg-gp-orange/10 text-white'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Box size={20} className={['sell-carton', 'view-carton-sales'].includes(view) ? 'text-gp-orange' : ''} />
                  <span className="hidden md:block font-medium text-sm">Packaging Box Sale</span>
                </div>
                <div className="hidden md:block">
                  <ChevronRight size={16} className={`transition-transform duration-200 ${isCartonSalesOpen ? 'rotate-90 text-gp-orange' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {isCartonSalesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1 ml-4 border-l border-white/10 pl-2"
                  >
                    <button
                      onClick={() => setView('sell-carton')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'sell-carton' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Plus size={16} />
                      <span className="hidden md:block font-medium">Sell Carton</span>
                    </button>
                    <button
                      onClick={() => setView('view-carton-sales')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        view === 'view-carton-sales' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Box size={16} />
                      <span className="hidden md:block font-medium">View Carton sales</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {(!user.permissions || (user.permissions?.pages || []).includes('calculator')) && (
            <button
              onClick={() => setView('landed')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'landed' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
            >
              <Calculator size={20} />
              <span className="hidden md:block font-medium text-sm">Duty Calculator</span>
            </button>
          )}

          {(!user.permissions || (user.permissions?.pages || []).includes('calculator')) && (
            <button
              onClick={() => setView('duty-estimate')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'duty-estimate' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
            >
              <Calculator size={20} />
              <span className="hidden md:block font-medium text-sm">Duty Estimate Checker</span>
            </button>
          )}

          {(!user.permissions || (user.permissions?.pages || []).includes('reports')) && (
            <button
              onClick={() => setView('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'reports' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
            >
              <BarChart3 size={20} />
              <span className="hidden md:block font-medium text-sm">Reports</span>
            </button>
          )}
          {user.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setView('admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'admin' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
              >
                <Users size={20} />
                <span className="hidden md:block font-medium text-sm">User Management</span>
              </button>
              <button
                onClick={() => setView('admin-permissions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'admin-permissions' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
              >
                <ShieldCheck size={20} />
                <span className="hidden md:block font-medium text-sm">User Permissions</span>
              </button>
              <button
                onClick={() => setView('admin-settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'admin-settings' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
              >
                <Settings size={20} />
                <span className="hidden md:block font-medium text-sm">Admin Settings</span>
              </button>
              <button
                onClick={() => setView('deletion-logs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'deletion-logs' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
              >
                <Lock size={20} />
                <span className="hidden md:block font-medium text-sm">Deletion History</span>
              </button>
            </>
          )}
          {user.role !== 'ADMIN' && (
            <button
              onClick={() => setView('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'settings' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
            >
              <UserCog size={20} />
              <span className="hidden md:block font-medium">My Settings</span>
            </button>
          )}
        </div>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            <span className="hidden md:block font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 md:pl-64 min-h-screen">
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-gp-blue/60 text-sm font-medium">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-[#1a1a1a] capitalize">{view === 'landed' ? 'Duty Cost' : view === 'duty-estimate' ? 'Duty Estimate Checker' : view}</span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => setView(user.role === 'ADMIN' ? 'admin-settings' : 'settings')}
              title={user.role === 'ADMIN' ? 'Admin Settings' : 'My Settings'}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none group-hover:text-gp-orange transition-colors">{user.full_name || user.email || 'Ghana Post User'}</p>
                <p className="text-[10px] text-gp-blue/60 font-bold uppercase tracking-tighter mt-1">{user.post_office || 'General Post Office'}</p>
              </div>
              <div className="w-10 h-10 bg-gp-light rounded-full border border-black/5 flex items-center justify-center group-hover:ring-2 group-hover:ring-gp-orange/30 transition-all">
                <Users size={20} className="text-gp-blue" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto print:p-0 print:m-0 print:max-w-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'dashboard' && <Dashboard user={user} setView={setView} formatDate={formatDate} isAdmin={user.role === 'ADMIN'} />}
              {view === 'landed' && (!user.permissions || (user.permissions?.pages || []).includes('calculator')) && <LandedCostForm user={user} />}
              {view === 'duty-estimate' && (!user.permissions || (user.permissions?.pages || []).includes('calculator')) && <DutyEstimateChecker user={user} />}
              {view === 'reports' && (!user.permissions || (user.permissions?.pages || []).includes('reports')) && <Reports user={user} formatDate={formatDate} isAdmin={user.role === 'ADMIN'} />}
              {view === 'admin' && user.role === 'ADMIN' && <AdminUsers />}
              {view === 'admin-permissions' && user.role === 'ADMIN' && <UserPermissionRole />}
              {view === 'settings' && <UserSettings user={user} />}
              {view === 'admin-settings' && user.role === 'ADMIN' && <AdminSettings user={user} setView={setView} />}
              {view === 'deletion-logs' && user.role === 'ADMIN' && <DeletionLogs formatDate={formatDate} />}
              {process.env.NEXT_PUBLIC_SHOW_BETA === 'true' && (
                <>
                  {view === 'add-foreign-parcel' && <AddForeignParcel user={user} />}
                  {view === 'view-foreign-parcels' && <ViewForeignParcels user={user} />}
                  {view === 'add-foreign-ems' && <AddForeignEMS user={user} />}
                  {view === 'view-foreign-ems' && <ViewForeignEMS user={user} />}
                  {view === 'add-foreign-letter' && <AddForeignLetter user={user} />}
                  {view === 'view-foreign-letters' && <ViewForeignLetters user={user} />}
                  {view === 'sell-carton' && <SellCarton user={user} onSave={(sale) => {
                    setCartonSales(prev => [sale, ...prev]);
                    setSelectedCartonSale(sale);
                    setView('carton-sale-details');
                  }} />}
                  {view === 'view-carton-sales' && <ViewCartonSales 
                    user={user} 
                    cartonSales={cartonSales} 
                    onViewDetails={(sale) => {
                      setSelectedCartonSale(sale);
                      setView('carton-sale-details');
                    }} 
                    onAddSale={() => setView('sell-carton')}
                  />}
                  {view === 'carton-sale-details' && <CartonSaleDetails 
                    user={user} 
                    sale={selectedCartonSale} 
                    onBack={() => setView('view-carton-sales')} 
                  />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}





