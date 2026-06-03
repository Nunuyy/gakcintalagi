import React, { useState } from "react";
import {
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Camera,
  MessageSquare,
  QrCode,
  Leaf,
  User,
  ChevronLeft,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  ShieldAlert,
  Award,
  Activity,
  BarChart3,
  Crosshair,
  Search,
  SlidersHorizontal,
  Box,
  X,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Monitor Samsung 24 inch Bekas Skripsi",
    price: 850000,
    originalPrice: 1500000,
    aiFairPrice: 900000,
    condition: "90% Mulus",
    seller: "Alya (FSRD)",
    university: "Institut Teknologi Bandung",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80",
    category: "Elektronik",
    description:
      "Jarang dipakai, cuma buat nugas akhir. Layar no dead pixel. Bonus kabel HDMI.",
  },
  {
    id: 2,
    title: "Jaket Denim Vintage 90s",
    price: 120000,
    originalPrice: 350000,
    aiFairPrice: 150000,
    condition: "Thrift - Very Good",
    seller: "Rian (Fikom)",
    university: "Universitas Padjadjaran",
    image:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=500&q=80",
    category: "Fashion",
    description: "Warna masih pekat, kancing lengkap. Cocok buat ngampus.",
  },
  {
    id: 3,
    title: "Buku Kalkulus Edisi 9",
    price: 50000,
    originalPrice: 250000,
    aiFairPrice: 60000,
    condition: "Ada coretan stabilo",
    seller: "Budi (FTMD)",
    university: "Institut Teknologi Bandung",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
    category: "Buku",
    description: "Buku legendaris. Udah lulus matkulnya jadi dijual aja.",
  },
];

const SAFE_ZONES = [
  {
    id: 1,
    name: "Lobby Perpustakaan Pusat",
    cctv: true,
    crowd: "Tinggi",
    lat: -6.89,
    lng: 107.61,
  },
  {
    id: 2,
    name: "Kantin Asrama",
    cctv: true,
    crowd: "Sedang",
    lat: -6.892,
    lng: 107.615,
  },
  {
    id: 3,
    name: "Taman Rektorat",
    cctv: false,
    crowd: "Rendah",
    lat: -6.895,
    lng: 107.611,
  },
];

const FOMOTicker = () => (
  <div className="bg-emerald-500 text-white text-xs font-semibold py-1.5 overflow-hidden flex items-center relative z-40 shadow-md">
    <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex items-center gap-6">
      <span>🎉 Rian baru saja membeli Jaket Denim di Unpad!</span>
      <span>🔥 3 orang sedang melihat Monitor Samsung di ITB.</span>
      <span>♻️ Siska menghemat 5kg emisi karbon hari ini!</span>
      <span>🎉 Rian baru saja membeli Jaket Denim di Unpad!</span>
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      html { scroll-behavior: smooth; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  </div>
);

export default function GakCintaLagiApp() {
  // Global State
  const [user, setUser] = useState({
    isVerified: false,
    name: "Guest Student",
    carbonSaved: 12.5,
    waterSaved: 350,
    balance: 0,
    activeTx: null,
  });

  // UI States (Modals & Drawers)
  const [activeProduct, setActiveProduct] = useState(null); // Drawer
  const [negoBotOpen, setNegoBotOpen] = useState(false); // Nested Drawer
  const [checkoutFlowStep, setCheckoutFlowStep] = useState(0); // 0: Closed, 1: Verify, 2: Checkout, 3: Success
  const [qrScannerOpen, setQrScannerOpen] = useState(false); // Modal
  const [activeAdminTab, setActiveAdminTab] = useState("admin"); // 'admin' | 'ops'
  const [selectedZone, setSelectedZone] = useState(SAFE_ZONES[0]);

  // Navigation Helper for smooth scroll
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBuyClick = () => {
    if (user.isVerified) {
      setCheckoutFlowStep(2); // Skip to checkout
    } else {
      setCheckoutFlowStep(1); // Go to verify KTM
    }
  };

  const handleVerifyStudent = () => {
    setUser((prev) => ({ ...prev, isVerified: true, name: "Nunuy Amalia" }));
    setCheckoutFlowStep(2); // Move to checkout step after verification
  };

  const completeCheckout = (product, zone) => {
    setUser((prev) => ({
      ...prev,
      activeTx: { product, zone, status: "Menunggu Bertemu" },
    }));
    setCheckoutFlowStep(3); // Success Screen
    setTimeout(() => {
      setCheckoutFlowStep(0);
      setActiveProduct(null);
      scrollToSection("dashboard-section");
    }, 2500);
  };

  const completeQRScan = () => {
    setQrScannerOpen(false);
    setUser((prev) => ({
      ...prev,
      activeTx: { ...prev.activeTx, status: "Selesai" },
    }));
    alert(
      "QR Tervalidasi! Dana escrow berhasil dilepaskan ke dompet penjual. Transaksi Aman & Selesai."
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative shadow-2xl overflow-x-hidden font-sans border-x border-gray-200 pb-24">
      {/* GLOBAL STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm rounded-b-3xl">
        <FOMOTicker />
        <div className="px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero-section")}
          >
            <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm shadow-emerald-500/30">
              <Leaf size={18} />
            </div>
            <h1 className="font-extrabold text-xl tracking-tight text-gray-900">
              gakcinta<span className="text-emerald-500">lagi.</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100/80 p-2 rounded-full hover:bg-gray-200 transition">
              <Search size={18} className="text-gray-600" />
            </button>
            <button
              className="bg-gray-100/80 p-2 rounded-full relative hover:bg-gray-200 transition"
              onClick={() => scrollToSection("dashboard-section")}
            >
              <User size={18} className="text-gray-600" />
              {user.isVerified && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO & GEOLOCATOR */}
      <section id="hero-section" className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-medium border border-emerald-100 shadow-sm">
          <MapPin size={18} className="animate-pulse" />
          <div className="flex-1">
            <p className="text-xs text-emerald-600/80">Area Deteksi AI</p>
            <span>
              <strong className="text-emerald-800">
                Institut Teknologi Bandung
              </strong>{" "}
              (2km)
            </span>
          </div>
          <div className="bg-emerald-200 p-1.5 rounded-lg">
            <ShieldCheck size={16} className="text-emerald-700" />
          </div>
        </div>
      </section>

      {/* SECTION 2: MARKET EXPLORER */}
      <section id="market-section" className="px-4 mt-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-800">
              Penemuan Hari Ini 🔥
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Barang bekas kampus terverifikasi
            </p>
          </div>
          {/* SEBELUMNYA (ADA TYPO "Gitpx-3") */}
<button className="text-emerald-500 font-medium text-xs flex items-center bg-emerald-50 Gitpx-3 py-1.5 rounded-full">
            <SlidersHorizontal size={12} className="mr-1" /> Filter
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.id}
              onClick={() => setActiveProduct(product)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-95 transition-transform hover:shadow-md"
            >
              <div className="relative h-36">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-black text-gray-800 uppercase tracking-wider shadow-sm">
                  {product.condition}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug h-10">
                  {product.title}
                </h3>
                <div className="mt-2">
                  <p className="text-emerald-600 font-black text-sm">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-gray-400 line-through">
                    Rp {product.originalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                    {product.seller[0]}
                  </div>
                  <span className="truncate">{product.seller}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: 3D VIRTUAL CLOSET */}
      <section id="closet-section" className="mx-4 mt-10 mb-6">
        <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden h-[450px] flex flex-col">
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <h3 className="font-black text-lg mb-1 flex items-center gap-2">
                <Box size={20} className="text-emerald-400" /> 3D Virtual Closet
              </h3>
              <p className="text-xs text-gray-400 w-5/6 leading-relaxed">
                Geser area bawah ini untuk mengeksplorasi gaya teman kampusmu secara interaktif.
              </p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Beta
            </span>
          </div>

          <div className="flex-1 relative perspective-[1000px] overflow-visible group cursor-grab active:cursor-grabbing">
            <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
              <div className="relative w-40 h-56 transform-style-3d group-hover:rotate-y-[15deg] transition-transform duration-700">
                <div className="absolute inset-0 bg-gray-800/80 border border-gray-700 rounded-2xl flex items-center justify-center text-gray-500 text-xs text-center p-4">
                  Pusat Leomari Alya
                </div>

                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-2.5 translate-z-[120px] rotate-y-[-15deg] transition-all duration-500 group-hover:translate-z-[140px]">
                  <img
                    src={MOCK_PRODUCTS[0].image}
                    className="w-full h-32 object-cover rounded-xl mb-2"
                    alt="item"
                  />
                  <h3 className="text-gray-900 font-bold text-[10px] line-clamp-1">
                    {MOCK_PRODUCTS[0].title}
                  </h3>
                  <p className="text-emerald-600 font-black text-xs mt-0.5">
                    Rp 850k
                  </p>
                </div>

                <div className="absolute inset-0 bg-gray-100 rounded-2xl shadow-xl p-2.5 translate-z-[-60px] translate-x-[100px] rotate-y-[35deg] opacity-60 transition-all duration-500 group-hover:opacity-80">
                  <img
                    src={MOCK_PRODUCTS[1].image}
                    className="w-full h-32 object-cover rounded-xl mb-2"
                    alt="item"
                  />
                  <p className="text-emerald-600 font-black text-xs mt-1">
                    Rp 120k
                  </p>
                </div>

                <div className="absolute inset-0 bg-gray-100 rounded-2xl shadow-xl p-2.5 translate-z-[-60px] -translate-x-[100px] rotate-y-[-35deg] opacity-60 transition-all duration-500 group-hover:opacity-80">
                  <img
                    src={MOCK_PRODUCTS[2].image}
                    className="w-full h-32 object-cover rounded-xl mb-2"
                    alt="item"
                  />
                  <p className="text-emerald-600 font-black text-xs mt-1">
                    Rp 50k
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-gray-700/50">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              <div className="text-[10px] text-gray-300 font-semibold tracking-wide flex gap-2 items-center">
                <ChevronLeft size={14} /> SWIPE{" "}
                <ChevronLeft className="rotate-180" size={14} />
              </div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <style>{`
          .perspective-\\[1000px\\] { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .translate-z-\\[120px\\] { transform: translateZ(120px); }
          .translate-z-\\[140px\\] { transform: translateZ(140px); }
          .translate-z-\\[-60px\\] { transform: translateZ(-60px); }
          .translate-x-\\[100px\\] { transform: translateX(100px); }
          .-translate-x-\\[100px\\] { transform: translateX(-100px); }
          .rotate-y-\\[-15deg\\] { transform: rotateY(-15deg); }
          .rotate-y-\\[15deg\\] { transform: rotateY(15deg); }
          .rotate-y-\\[35deg\\] { transform: rotateY(35deg); }
          .rotate-y-\\[-35deg\\] { transform: rotateY(-35deg); }
        `}</style>
      </section>

      {/* SECTION 4: USER DASHBOARD & JOURNEY */}
      <section id="dashboard-section" className="px-4 mt-8 pb-8 border-b-8 border-gray-100">
        <h2 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
          <User size={20} className="text-emerald-500" /> Dasbor Mahasiswa
        </h2>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden mb-5">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <ShieldCheck size={100} />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full p-1 relative shadow-inner">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt="avatar"
                className="w-full h-full bg-emerald-100 rounded-full"
              />
              {user.isVerified && (
                <div className="absolute bottom-0 right-0 bg-emerald-400 p-1 rounded-full border-2 border-white">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl">{user.name}</h3>
              <p className="text-xs text-emerald-100 mt-1 font-medium bg-black/20 px-2 py-1 rounded inline-block">
                {user.isVerified ? "✓ Verified Student (ITB)" : "Belum Verifikasi"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/20">
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wide">Emisi Ditekan</p>
              <p className="font-black text-lg flex items-center gap-1">
                <Leaf size={14} /> {user.carbonSaved} kg
              </p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wide">Air Dihemat</p>
              <p className="font-black text-lg flex items-center gap-1">
                <Box size={14} /> {user.waterSaved} L
              </p>
            </div>
          </div>
        </div>

        {/* Active Transactions Area */}
        <h3 className="font-bold text-gray-800 mb-3">Transaksi Berjalan (Escrow)</h3>
        {user.activeTx ? (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden mb-4 transition-all">
            {user.activeTx.status === "Selesai" && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur z-10 flex flex-col items-center justify-center">
                <CheckCircle size={40} className="text-emerald-500 mb-2" />
                <p className="font-bold text-gray-800">Transaksi Selesai</p>
                <p className="text-xs text-gray-500">Dana telah diteruskan ke penjual.</p>
              </div>
            )}

            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase animate-pulse">
                  {user.activeTx.status}
                </span>
                <h4 className="font-bold text-sm mt-2">{user.activeTx.product.title}</h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={10} /> {user.activeTx.zone.name}
                </p>
              </div>
              <span className="font-black text-emerald-600 text-sm">
                Rp {user.activeTx.product.price.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 flex gap-3 items-center mb-4 border border-blue-100">
              <ShieldCheck size={20} className="text-blue-500 flex-shrink-0" />
              <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                Dana diamankan Escrow. Temui penjual dan scan QR barang untuk melepas dana.
              </p>
            </div>

            <button
              onClick={() => setQrScannerOpen(true)}
              className="w-full bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition"
            >
              <QrCode size={16} /> Buka Scanner QR
            </button>
          </div>
        ) : (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center text-gray-500 flex flex-col items-center justify-center">
            <ShoppingBag size={32} className="mb-2 text-gray-400 opacity-50" />
            <p className="text-sm font-semibold">Belum ada transaksi.</p>
            <p className="text-xs mt-1">Eksplor barang kampusmu sekarang!</p>
          </div>
        )}
      </section>

      {/* SECTION 5: BEHIND THE SCENES (ADMIN & OPS) */}
      <section id="admin-section" className="px-4 py-8 bg-slate-900 text-slate-200 mt-8 rounded-t-[40px]">
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white flex justify-center items-center gap-2">
            <Lock size={18} className="text-slate-400" /> Control Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">Preview fitur backend untuk manajemen bisnis</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveAdminTab("admin")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeAdminTab === "admin" ? "bg-emerald-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            National Admin (GMV)
          </button>
          <button
            onClick={() => setActiveAdminTab("ops")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeAdminTab === "ops" ? "bg-indigo-500 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Campus Ops (Safe Zones)
          </button>
        </div>

        {/* Admin Content */}
        {activeAdminTab === "admin" && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-inner">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Vol. Escrow</p>
                <h3 className="text-xl font-black text-emerald-400">Rp 142.5M</h3>
                <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                  <Zap size={10} /> +12% MoM
                </p>
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-inner">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">KYC Fallback</p>
                <h3 className="text-xl font-black text-orange-400">24 Tiket</h3>
                <p className="text-[10px] text-slate-400 mt-1">Antrean Moderasi Manual</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-950 p-3 flex justify-between items-center">
                <span className="text-xs font-bold text-white">Manual KYC Moderation</span>
                <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold border border-red-500/30">
                  Action Req
                </span>
              </div>
              <div className="p-4 flex gap-4">
                <div className="w-20 h-14 bg-slate-700 rounded-lg flex items-center justify-center text-[8px] text-slate-400 border border-slate-600 text-center">
                  Scan KTM Blur
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-white">Budi S.</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-1">
                    OCR Confidence 72%. Verifikasi manual diperlukan.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] px-3 py-1 rounded font-bold transition">
                      Approve
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white text-[10px] px-3 py-1 rounded font-bold transition">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ops Content */}
        {activeAdminTab === "ops" && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-indigo-900/40 p-4 rounded-2xl border border-indigo-500/30 mb-4">
              <h3 className="font-bold text-indigo-300 text-xs mb-3 flex items-center gap-2 uppercase tracking-wide">
                <MapPin size={14} /> Safe Zone Heatmap (ITB)
              </h3>
              <div className="space-y-2">
                {SAFE_ZONES.map((z) => (
                  <div key={z.id} className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-200">{z.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      z.crowd === "Tinggi" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {z.crowd} Vol
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-900/20 p-4 rounded-2xl border border-orange-500/30">
              <h3 className="font-bold text-orange-300 text-xs mb-3 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle size={14} /> Active Dispute
              </h3>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="text-[10px] font-bold text-orange-400 mb-1">Tiket #DIS-001</p>
                <p className="text-xs font-semibold text-white">Komplain Kondisi Barang</p>
                <p className="text-[10px] text-slate-400 mt-1">Pembeli menolak scan QR serah terima karena barang retak.</p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 rounded-lg mt-3 font-bold transition shadow-lg shadow-orange-500/20">
                  Intervensi & Refund
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* GLOBAL BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around p-3 pb-5 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <button onClick={() => scrollToSection("hero-section")} className="flex flex-col items-center gap-1 text-emerald-500 transition-colors">
          <ShoppingBag size={22} className="fill-emerald-100" />
          <span className="text-[10px] font-bold">Jelajah</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400 -mt-6 relative hover:-translate-y-1 transition-transform">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-4 rounded-full shadow-xl shadow-emerald-500/40 border-4 border-gray-50 flex items-center justify-center">
            <Camera size={24} />
          </div>
          <span className="text-[10px] font-bold text-gray-600 mt-1">Jual (AI Scan)</span>
        </button>

        <button onClick={() => scrollToSection("dashboard-section")} className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-500 transition-colors">
          <div className="relative">
            <User size={22} />
            {user.activeTx && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
          </div>
          <span className="text-[10px] font-bold">Dasbor</span>
        </button>
      </div>

      {/* OVERLAY 1: PRODUCT DETAIL DRAWER */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setActiveProduct(null)}></div>
          <div className="relative bg-white w-full max-w-md mx-auto h-[90vh] rounded-t-[40px] shadow-2xl flex flex-col overflow-hidden">
            
            <div className="w-full flex justify-center py-3 bg-white absolute top-0 z-20 rounded-t-[40px]">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <button onClick={() => setActiveProduct(null)} className="absolute top-4 right-4 z-20 bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200">
              <X size={20} />
            </button>

            <div className="overflow-y-auto flex-1 pb-24 hide-scrollbar pt-6">
              <div className="h-72 bg-gray-100 w-full relative">
                <img src={activeProduct.image} className="w-full h-full object-cover" alt="Product" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur flex items-center gap-2">
                  <Box size={14} /> Geser untuk melihat 360°
                </div>
              </div>

              <div className="px-5 pt-6 pb-4 bg-white relative z-10 -mt-4 rounded-t-3xl">
                <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">{activeProduct.title}</h1>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black text-emerald-600 tracking-tight">Rp {activeProduct.price.toLocaleString("id-ID")}</span>
                  <span className="text-sm text-gray-400 line-through mb-1 font-medium">Rp {activeProduct.originalPrice.toLocaleString("id-ID")}</span>
                </div>

                {/* AI Price Meter */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <div className="bg-blue-500 text-white p-2 rounded-xl mt-0.5"><Activity size={20} /></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">AI Price Meter</p>
                      <p className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Good Deal</p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500 w-[75%]"></div>
                      <div className="h-full bg-yellow-400 w-[25%]"></div>
                    </div>
                    <p className="text-[11px] text-blue-800 mt-1.5">Harga wajar AI: <strong>Rp {activeProduct.aiFairPrice.toLocaleString("id-ID")}</strong>. Lebih murah dibanding pasar secondhand makro!</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">{activeProduct.description}</p>
              </div>
            </div>

            {/* Action Bottom Bar inside Product Drawer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-30">
              <button 
                onClick={() => setNegoBotOpen(true)}
                className="flex-1 py-3 border border-emerald-500 text-emerald-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50"
              >
                <MessageSquare size={16} /> Nego via AI Bot
              </button>
              <button 
                onClick={handleBuyClick}
                className="flex-1 py-3 bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
              >
                Ambil Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: NEGO BOT DRAWER (NESTED) */}
      {negoBotOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setNegoBotOpen(false)}></div>
          <div className="relative bg-slate-900 w-full max-w-md mx-auto h-[60vh] rounded-t-[35px] text-white flex flex-col p-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-emerald-400 animate-bounce" />
                <h3 className="font-bold text-sm">AI Auto-Nego Agent</h3>
              </div>
              <button onClick={() => setNegoBotOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto text-xs hide-scrollbar">
              <div className="bg-slate-800 p-3 rounded-2xl max-w-[85%]">
                Halo! Saya bot negosiator otomatis. Harga pas saat ini adalah <strong>Rp {activeProduct?.price.toLocaleString("id-ID")}</strong>. Mau coba tawar berapa?
              </div>
              <div className="bg-emerald-600 p-3 rounded-2xl max-w-[85%] ml-auto text-right">
                Boleh Rp {(activeProduct?.price - 50000).toLocaleString("id-ID")} gak? Kak, buat sesama mahasiswa.
              </div>
              <div className="bg-slate-800 p-3 rounded-2xl max-w-[85%]">
                🤖 <em>Menganalisis profil kelulusan & urgensi penjual...</em> <br />
                Penjual butuh dana cepat untuk wisuda! Penjual setuju di harga <strong>Rp {(activeProduct?.price - 30000).toLocaleString("id-ID")}</strong> sebagai titik tengah! deal?
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <button 
                onClick={() => {
                  setNegoBotOpen(false);
                  handleBuyClick();
                }}
                className="w-full bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl"
              >
                Terima & Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 3: CHECKOUT & VERIFY STEPS */}
      {checkoutFlowStep > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCheckoutFlowStep(0)}></div>
          <div className="relative bg-white w-full max-w-md mx-auto p-6 rounded-t-[40px] shadow-2xl text-gray-800 min-h-[40vh]">
            
            {/* Step 1: Verify Student ID */}
            {checkoutFlowStep === 1 && (
              <div className="text-center py-4">
                <ShieldAlert size={44} className="text-emerald-500 mx-auto mb-3" />
                <h3 className="font-black text-lg text-gray-900">Verifikasi KTM Diperlukan</h3>
                <p className="text-xs text-gray-500 mt-2 px-4 leading-relaxed">
                  Sistem keamanan klaster mewajibkan Anda memverifikasi status mahasiswa aktif sebelum melakukan transaksi demi mencegah penipuan makro.
                </p>
                <div className="my-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-left">
                  <Camera size={24} className="text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-xs text-emerald-900">Scan KTM Digital</h4>
                    <p className="text-[10px] text-emerald-700">Otomatis deteksi OCR & Database Kampus.</p>
                  </div>
                </div>
                <button 
                  onClick={handleVerifyStudent}
                  className="w-full bg-emerald-500 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Simulasikan Verifikasi Berhasil
                </button>
              </div>
            )}

            {/* Step 2: Choose Safe Meetup Zone & Escrow */}
            {checkoutFlowStep === 2 && (
              <div>
                <h3 className="font-black text-lg text-gray-900 mb-1">Amankan Titik Escrow</h3>
                <p className="text-xs text-gray-500 mb-4">Pilih Safe Zone kampus terverifikasi CCTV untuk bertukar barang.</p>
                
                <div className="space-y-2 mb-6">
                  {SAFE_ZONES.map((zone) => (
                    <div 
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                        selectedZone.id === zone.id ? "border-emerald-500 bg-emerald-50/50" : "border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-800">{zone.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{zone.cctv ? "✓ Tercover CCTV" : "Tanpa CCTV"} · Kepadatan: {zone.crowd}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedZone.id === zone.id ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                        {selectedZone.id === zone.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-gray-500 leading-normal mb-5">
                  🛡️ Dana Anda akan ditahan sementara oleh sistem <strong>Escrow GakCintaLagi</strong>. Penjual baru menerima uang setelah Anda memvalidasi fisik barang lewat QR Code.
                </div>

                <button 
                  onClick={() => completeCheckout(activeProduct, selectedZone)}
                  className="w-full bg-emerald-500 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Kunci Escrow & Buat Janji Temu
                </button>
              </div>
            )}

            {/* Step 3: Success Animation / Screen */}
            {checkoutFlowStep === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-ping absolute left-1/2 -translate-x-1/2 opacity-20"></div>
                <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4 relative z-10" />
                <h3 className="font-black text-xl text-gray-900">Escrow Berhasil Dikunci!</h3>
                <p className="text-xs text-gray-500 mt-2 px-6 leading-relaxed">
                  Transaksi berhasil tercatat. Silakan menuju ke <strong>{selectedZone.name}</strong> untuk menemui penjual.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* OVERLAY 4: QR SCANNER VALIDATION MODAL */}
      {qrScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 text-white max-w-md mx-auto">
          <div className="flex justify-between items-center pt-4">
            <h3 className="font-bold text-sm tracking-wide">VALIDASI PIN SERAH TERIMA</h3>
            <button onClick={() => setQrScannerOpen(false)} className="bg-white/10 p-2 rounded-full"><X size={18} /></button>
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="w-64 h-64 border-4 border-emerald-400 border-dashed rounded-3xl relative flex items-center justify-center p-8 bg-white/5 overflow-hidden">
              <div className="w-full h-0.5 bg-emerald-400 absolute top-0 left-0 right-0 animate-[scan_2s_linear_infinite]"></div>
              <QrCode size={120} className="text-white/30" />
            </div>
            <p className="text-xs text-gray-400 text-center mt-6 px-10 leading-relaxed">
              Posisikan kamera Anda ke QR Code barang yang ditempelkan/ditunjukkan oleh penjual untuk melepas dana proteksi escrow.
            </p>
            <style>{`
              @keyframes scan {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
            `}</style>
          </div>

          <button 
            onClick={completeQRScan}
            className="w-full bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg mb-6"
          >
            Simulasikan Berhasil Scan QR Barang
          </button>
        </div>
      )}
    </div>
  );
}
