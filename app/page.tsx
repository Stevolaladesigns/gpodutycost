'use client';
import React, { useState, useEffect } from 'react';
import {
  Calculator,
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
  EyeOff
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

// --- Components ---

function Login() {
  const [email, setEmail] = useState('ITsupport@ghanapost.com.gh');
  const [password, setPassword] = useState('ITsupport@26');
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
      {/* Left side - Hero Image (55%) */}
      <div className="lg:w-[55%] relative hidden lg:block overflow-hidden">
        <img
          src="/building.webp"
          alt="Ghana Post Building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Deep blue overlay to match the screenshot */}
        <div className="absolute inset-0 bg-[#0A1172]/70 backdrop-blur-[1px]"></div>

        {/* Logo in top left */}
        <div className="absolute top-10 left-10">
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
            Enter your credentials to access the<br></br> GPO Duty Cost Portal.
          </motion.p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-10 inset-x-0 text-center text-white/40 text-sm font-medium">
          © {new Date().getFullYear()} Ghana Post. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form (45%) */}
      <div className="flex-1 lg:w-[45%] flex items-center justify-center p-8 lg:p-16 bg-white shrink-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
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
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gp-orange/20 focus:border-gp-orange transition-all placeholder:text-gray-400"
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
                  className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gp-orange/20 focus:border-gp-orange transition-all placeholder:text-gray-400"
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
                  <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
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

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Powered by GPO Digital Systems
            </p>
          </div>
        </motion.div>
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
  label: string;
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
    items: [{ description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: '' }],
    shipping: { amount: 0, service_level: 'standard' }
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.error("Failed to log transaction", e);
    }
  };

  const handleCalculate = async () => {
    if (!formData.ship_from_country) {
      setError("Please provide an Origin Country Code (e.g. GH)");
      return;
    }
    if (!formData.ship_to.country) {
      setError("Please provide a Destination Country Code (e.g. US)");
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
      await logTransaction(1, res);
    } catch (err: any) {
      setError(err.message);
      await logTransaction(0, null, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      currency: 'GHS',
      ship_from_country: 'GH',
      tracking_number: '',
      ship_to: { country: '', state: '', postal_code: '', city: '' },
      items: [{ description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: '' }],
      shipping: { amount: 0, service_level: 'standard' }
    });
    setResult(null);
    setError('');
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', amount: 0, quantity: '', hs_code: '', country_of_origin: 'GH' }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
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
    <div className="space-y-6">
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
                onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10"
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
                  onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, country: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">State/Region</label>
                <input
                  placeholder="e.g. NY"
                  value={formData.ship_to.state}
                  onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, state: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">City</label>
                <input
                  placeholder="e.g. New York"
                  value={formData.ship_to.city}
                  onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, city: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Postal Code</label>
                <input
                  placeholder="e.g. 10001"
                  value={formData.ship_to.postal_code}
                  onChange={(e) => setFormData({ ...formData, ship_to: { ...formData.ship_to, postal_code: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-gp-blue/10"
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
            {formData.items.map((item, idx) => (
              <div key={idx} className="p-4 bg-gp-light rounded-2xl relative space-y-4 border border-gp-blue/5">
                {idx > 0 && (
                  <button onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded-full">
                    <Trash2 size={16} />
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
                    <label className="block text-[10px] font-bold uppercase text-gp-blue/40 mb-1 ml-1">Price</label>
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
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-gp-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gp-blue/90 transition-colors shadow-lg shadow-gp-blue/20"
                  >
                    <Printer size={20} />
                    Print Quotation
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-black/5 text-gp-blue py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/10 transition-colors"
                  >
                    <RefreshCcw size={20} />
                    Start New Calculation
                  </button>
                </div>

                {/* Print Layout */}
                <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 text-black overflow-hidden h-screen">
                  <style>{`
                    @media print {
                      @page { size: auto; margin: 0; }
                      html, body {
                        height: 100vh;
                        overflow: hidden;
                        margin: 0;
                        padding: 0;
                      }
                    }
                  `}</style>
                  <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8 mt-4">
                    <div>
                      <img src="/logo.png" className="h-16 object-contain mb-4" alt="Ghana Post" />
                      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Duty Cost Quotation</h1>
                      <p className="text-sm font-bold mt-1 text-black/60 tracking-widest uppercase">GPO Central System</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <Barcode value={formData.tracking_number || 'UNKNOWN'} width={1.8} height={50} fontSize={14} background="transparent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-black/40 mb-2">Shipment details</h3>
                      <div className="space-y-1 font-medium">
                        <p>Origin: {formData.ship_from_country}</p>
                        <p>Destination: {formData.ship_to.country} ({formData.ship_to.state || '-'}, {formData.ship_to.city || '-'})</p>
                        <p>Date: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="bg-black/5 p-6 rounded-2xl text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-1">Total Duty Cost</p>
                      <p className="text-4xl font-extrabold">{formData.currency} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="font-bold border-b-2 border-black pb-2 mb-4 text-sm uppercase tracking-widest">Items Summary</h3>
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-black/10">
                        <div className="flex flex-col">
                          <span className="font-bold">{(item.quantity || 1)}x {item.description || 'Unknown Item'}</span>
                          <span className="text-xs text-black/60 font-medium">HS Code: {item.hs_code || 'N/A'}</span>
                        </div>
                        <span className="font-bold">{formData.currency} {(Number(item.amount) * (Number(item.quantity) || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="max-w-md ml-auto">
                    <h3 className="font-bold border-b-2 border-black pb-2 mb-4 text-sm uppercase tracking-widest">Cost Breakdown</h3>
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="font-medium text-black/60">Items Total</span>
                      <span className="font-bold">{formData.currency} {(result.subtotal || result.amountSubtotals?.items || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="font-medium text-black/60">Duties</span>
                      <span className="font-bold">{formData.currency} {(result.duty !== undefined ? result.duty : (result.amountSubtotals?.duties || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="font-medium text-black/60">Taxes</span>
                      <span className="font-bold">{formData.currency} {(result.tax !== undefined ? result.tax : (result.amountSubtotals?.taxes || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="font-medium text-black/60">Fees</span>
                      <span className="font-bold">{formData.currency} {(result.fee !== undefined ? result.fee : (result.amountSubtotals?.fees || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="font-medium text-black/60">Shipping</span>
                      <span className="font-bold">{formData.currency} {(result.shipping !== undefined ? result.shipping : (result.amountSubtotals?.shipping || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-4 mt-2 border-t-2 border-black text-xl">
                      <span className="font-extrabold">Total Landed Cost</span>
                      <span className="font-extrabold">{formData.currency} {(result.total || result.amountSubtotals?.landedCostTotal || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="fixed bottom-10 left-10 right-10 text-center text-xs text-black/40 font-bold tracking-widest uppercase border-t border-black/10 pt-4">
                    Generated by GPO Duty Cost Portal
                  </div>
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
  );
};

function Reports({ user }: { user: any }) {
  const isAdmin = user.role === 'ADMIN';
  // Non-admins are always locked to their own branch
  const [scope, setScope] = useState(isAdmin ? 'ALL' : 'MINE');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [searchTrackUser, setSearchTrackUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [txPage, setTxPage] = useState(1);
  const TX_PER_PAGE = 50;

  const fetchReports = async () => {
    setLoading(true);
    try {
      const txRef = collection(db, 'transactions');
      let q = query(txRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);

      const txs: any[] = [];
      const dailyMap: any = {};

      snapshot.forEach(docSnap => {
        const t = docSnap.data();
        // Non-admins always see only their branch; admins respect scope toggle
        const isOwnBranch = t.post_office === user.post_office;
        if (!isAdmin) {
          if (!isOwnBranch) return;
        } else if (scope === 'MINE') {
          if (!isOwnBranch) return;
        }

        txs.push({ id: docSnap.id, ...t });

        const dateStr = t.created_at || new Date().toISOString();
        const dailyKey = dateStr.substring(0, 10);
        dailyMap[dailyKey] = (dailyMap[dailyKey] || 0) + 1;
      });

      setTransactions(txs);
      setDailyData(Object.keys(dailyMap).sort().reverse().map(k => ({ period: k, count: dailyMap[k] })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (txId: string) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to delete this transaction? This cannot be undone.')) return;
    setDeletingId(txId);
    try {
      await deleteDoc(doc(db, 'transactions', txId));
      setTransactions(prev => prev.filter(t => t.id !== txId));
    } catch (err) {
      console.error('Failed to delete transaction', err);
      alert('Failed to delete transaction. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [scope]);

  const filteredTx = transactions.filter(t => {
    const matchSearch = (t.tracking_number?.toLowerCase() || '').includes(searchTrackUser.toLowerCase()) ||
      (t.user_id?.toLowerCase() || '').includes(searchTrackUser.toLowerCase());

    let matchDate = true;
    if (startDate || endDate) {
      const txDate = t.created_at ? t.created_at.substring(0, 10) : '';
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
      {/* Hidden Print Layout */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 text-black">
        <style>{`
          @media print {
            @page { size: auto; margin: 10mm; }
            html, body { background: white; color: black; }
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
            <p className="text-[10px] font-bold text-black/30 mt-1 uppercase">Printed By: {user.full_name || user.email}</p>
          </div>
        </div>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-black/20">
              <th className="py-2">Date</th>
              <th className="py-2">User ID. / Branch</th>
              <th className="py-2">Tracking #</th>
              <th className="py-2 text-right">Cost Paid</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.map(t => {
              const res = t.response_payload ? JSON.parse(t.response_payload) : null;
              const total = res ? (res.total || res.amountSubtotals?.landedCostTotal || 0) : 0;
              return (
                <tr key={t.id} className="border-b border-black/10">
                  <td className="py-2">{t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-2">
                    <span className="font-bold">{t.user_id?.substring(0, 8)}...</span><br />
                    <span className="text-xs text-black/60">{t.post_office}</span>
                  </td>
                  <td className="py-2 font-mono text-xs">{t.tracking_number || '-'}</td>
                  <td className="py-2 text-right font-bold">{t.currency} {total.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gp-blue">
            <BarChart3 className="text-gp-blue" />
            Duty Cost Transactions
          </h2>
          <p className="text-sm text-gp-blue/60 font-medium mt-1">View, search, and print reports of duty cost calculations</p>
        </div>
        {isAdmin && (
          <div className="flex bg-white p-1 rounded-xl border border-black/5 shadow-sm">
            <button
              onClick={() => setScope('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${scope === 'ALL' ? 'bg-gp-orange text-white shadow-md shadow-gp-orange/20' : 'text-gp-orange hover:bg-gp-orange/10'}`}
            >
              All Offices
            </button>
            <button
              onClick={() => setScope('MINE')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${scope === 'MINE' ? 'bg-gp-blue text-white shadow-md shadow-gp-blue/20' : 'text-gp-blue hover:bg-gp-blue/10'}`}
            >
              My Office
            </button>
          </div>
        )}
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gp-blue/30 group-focus-within:text-gp-orange transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search Tracking # or User ID..."
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

        <button
          onClick={() => window.print()}
          className="bg-gp-blue text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-gp-blue/90 transition-all shadow-lg shadow-gp-blue/10 active:scale-95"
        >
          <Printer size={18} />
          Print Report
        </button>
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
                {isAdmin && <th className="p-4 text-xs font-bold uppercase tracking-widest text-gp-blue/60 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {paginatedTx.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-gp-blue/40 font-medium italic">
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
                        <p className="font-bold text-gp-blue">{t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gp-blue/40">
                          {t.created_at ? new Date(t.created_at).toLocaleTimeString() : ''}
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
                      {isAdmin && (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(t.id)}
                            disabled={deletingId === t.id}
                            title="Delete this record"
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {deletingId === t.id
                              ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-500 rounded-full animate-spin" />
                              : <Trash2 size={16} />}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredTx.length > TX_PER_PAGE && (
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
  const USERS_PER_PAGE = 20;
  const [showCleanupModal, setShowCleanupModal] = useState(false);

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
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      // Optimistically add the new user to the local list so they appear instantly
      const optimisticUser = {
        id: data.uid,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        post_office: newUser.post_office,
        is_active: 1,
        created_at: null
      };
      setUsers(prev => [optimisticUser, ...prev]);

      setNewUser({ full_name: '', email: '', password: '', role: 'OPERATIONS', post_office: '' });
      setSuccessMsg('User successfully created!');
      setTimeout(() => setSuccessMsg(''), 4000);

      // Also refetch in the background for accurate server data
      setTimeout(() => {
        fetchUsers();
      }, 2000);
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

      if (action === 'EDIT_USER') setEditingUserId(null);
      fetchUsers();
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
              <input
                placeholder="Full Name"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-black/10"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-black/10"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-black/10"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-black/10"
              >
                <option value="OPERATIONS">Operations</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <AutocompleteInput
                label="Post Office Branch"
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
                  "STANDARD CHARTERED", "PASSPORT OFFICE", "SEFWI AKONTOMBRA POST OFFICE"
                ].sort().map(po => ({ label: po, sub: '', original: po }))}
              />
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
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
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
            {filteredUsers.length > USERS_PER_PAGE && (
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

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('landed');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const isLegacyAdmin = u.email?.toLowerCase() === 'itsupport@ghanapost.com.gh';
          const docSnap = await getDoc(doc(db, 'users', u.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({ id: u.uid, ...data, role: isLegacyAdmin ? 'ADMIN' : (data.role || 'OPERATIONS') });
          } else {
            // No Firestore doc — check if this is the known legacy admin account
            setUser({ id: u.uid, email: u.email, role: isLegacyAdmin ? 'ADMIN' : 'OPERATIONS', post_office: isLegacyAdmin ? 'Head-Quarters' : 'DEFAULT' });
          }
        } catch (e) {
          console.error("Error fetching user data", e);
          const isLegacyAdmin = u.email?.toLowerCase() === 'itsupport@ghanapost.com.gh';
          setUser({ id: u.uid, email: u.email, role: isLegacyAdmin ? 'ADMIN' : 'OPERATIONS', post_office: isLegacyAdmin ? 'Head-Quarters' : 'DEFAULT' });
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

  if (!isReady) return null;

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gp-light text-[#1a1a1a]">
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 md:w-64 gp-gradient text-white flex flex-col z-50">
        <div className="p-6 flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg p-1 overflow-hidden">
            <img
              src="/logo.png"
              alt="GP"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden md:block overflow-hidden">
            <h1 className="font-bold text-lg leading-none">GP Portal</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Duty Cost v1.0</p>
          </div>
        </div>

        <div className="flex-1 px-3 space-y-2">
          <button
            onClick={() => setView('landed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'landed' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <Calculator size={20} />
            <span className="hidden md:block font-medium">Calculator</span>
          </button>
          <button
            onClick={() => setView('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'reports' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <BarChart3 size={20} />
            <span className="hidden md:block font-medium">Reports</span>
          </button>
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setView('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'admin' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
            >
              <Users size={20} />
              <span className="hidden md:block font-medium">Users</span>
            </button>
          )}
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setView('admin-settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'admin-settings' ? 'bg-gp-orange text-white shadow-lg shadow-gp-orange/20' : 'text-white/60 hover:bg-white/5'}`}
            >
              <Settings size={20} />
              <span className="hidden md:block font-medium">Admin Settings</span>
            </button>
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
            <span className="text-[#1a1a1a] capitalize">{view === 'landed' ? 'Duty Cost' : view}</span>
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

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'landed' && <LandedCostForm user={user} />}
              {view === 'reports' && <Reports user={user} />}
              {view === 'admin' && user.role === 'ADMIN' && <AdminUsers />}
              {view === 'settings' && <UserSettings user={user} />}
              {view === 'admin-settings' && user.role === 'ADMIN' && <AdminSettings user={user} setView={setView} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}





