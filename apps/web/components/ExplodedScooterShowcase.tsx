'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Search,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useVehicle } from '@/lib/vehicleContext';

interface ExplodedPart {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  oemNumber: string;
  grade: 'OEM Genuine' | 'Tier-1 OES' | 'Export Grade';
  compatibility: string;
  description: string;
  position: { x: number; y: number }; // Percentage coordinates in 2D/3D frame
  explodedOffset: { x: number; y: number }; // Offset in px when exploded
  icon: string;
  image?: string;
}

const SCOOTER_PARTS: ExplodedPart[] = [
  {
    id: 'cvt-belt',
    name: 'CVT Drive Belt & Variator Pulley',
    hindiName: 'ड्राइव बेल्ट एवं रोलर पुली',
    category: 'Transmission & Drive',
    oemNumber: '23100-KZR-601 / 22102-KWP-900',
    grade: 'OEM Genuine',
    compatibility: 'Honda Activa 5G/6G, TVS Jupiter, Suzuki Access 125',
    description: 'High-tensile aramid fiber reinforced transmission belt with precision balance variator clutch weights for smooth acceleration.',
    position: { x: 38, y: 58 },
    explodedOffset: { x: -160, y: 70 },
    icon: '⛓️'
  },
  {
    id: 'cylinder-block',
    name: '4-Stroke Cylinder Block & Piston Kit',
    hindiName: 'इंजन सिलेंडर ब्लॉक एवं पिस्टन किट',
    category: 'Engine Components',
    oemNumber: '12100-KWP-D00 / 13101-KWP-900',
    grade: 'Tier-1 OES',
    compatibility: 'Activa 110/125, Dio, Jupiter, Maestro Edge',
    description: 'Diamond-honed aluminum cylinder bore with low-friction moly-coated piston, precision piston rings, and gudgeon pin.',
    position: { x: 50, y: 52 },
    explodedOffset: { x: 140, y: -90 },
    icon: '⚙️'
  },
  {
    id: 'disc-rotor',
    name: 'Front Ventilated Disc Rotor & Caliper',
    hindiName: 'फ्रंट डिस्क ब्रेक रोटर एवं कैलिपर',
    category: 'Braking System',
    oemNumber: '45251-K03-N41 / 45150-KWP-901',
    grade: 'OEM Genuine',
    compatibility: 'Activa 125 Disc, Access 125 Special, Ntorq 125 Race',
    description: 'Heat-treated high carbon stainless steel perforated disc with dual-piston hydraulic caliper and semi-metallic brake pads.',
    position: { x: 74, y: 68 },
    explodedOffset: { x: 180, y: 80 },
    icon: '🛑'
  },
  {
    id: 'shock-absorber',
    name: 'Rear Hydraulic Shock Absorber',
    hindiName: 'रियर शॉक एब्जॉर्बर सस्पेंशन',
    category: 'Suspension',
    oemNumber: '52400-KWP-D01 / 52400-K24-901',
    grade: 'Export Grade',
    compatibility: 'Universal Scooter 300mm-330mm Eye-to-Fork Fitment',
    description: '3-step adjustable preload heavy-duty chrome damper spring built for rugged export road conditions.',
    position: { x: 30, y: 45 },
    explodedOffset: { x: -180, y: -80 },
    icon: '🔧'
  },
  {
    id: 'carb-throttle',
    name: 'Carburetor / EFI Throttle Body Assembly',
    hindiName: 'कार्बोरेटर / ईएफआई थ्रॉटल बॉडी',
    category: 'Fuel Induction',
    oemNumber: '16100-KWP-901 / 16400-K0R-V01',
    grade: 'OEM Genuine',
    compatibility: 'BS-IV Carburetor & BS-VI PGM-FI Fuel Injection',
    description: 'Factory calibrated air-fuel atomization assembly with precision brass main jet and idle air control valve.',
    position: { x: 44, y: 40 },
    explodedOffset: { x: -40, y: -130 },
    icon: '🌪️'
  },
  {
    id: 'headlight-led',
    name: 'LED Projector Headlight Assembly',
    hindiName: 'एलईडी प्रोजेक्टर हेडलाइट असेंबली',
    category: 'Electrical & Lighting',
    oemNumber: '33100-K0R-V01 / 33120-KWP-900',
    grade: 'Tier-1 OES',
    compatibility: 'Activa 6G LED, Jupiter ZX, Access 125 LED',
    description: 'High-intensity projector lens with impact-resistant polycarbonate clear outer visor and waterproof connector.',
    position: { x: 68, y: 28 },
    explodedOffset: { x: 130, y: -110 },
    icon: '💡'
  }
];

const TUKTUK_PARTS: ExplodedPart[] = [
  {
    id: 'tuktuk-differential',
    name: 'Heavy-Duty Crown Wheel & Pinion Differential',
    hindiName: 'टुक-टुक डिफरेंशियल क्राउन व्हील एवं पिनियन',
    category: 'Drivetrain',
    oemNumber: 'BA-5510-18 / AA-1010-45',
    grade: 'OEM Genuine',
    compatibility: 'Bajaj RE Compact 4S, TVS King Deluxe, Piaggio Ape',
    description: 'Case-hardened helical gear set engineered for maximum torque transfer in commercial passenger and cargo auto-rickshaws.',
    position: { x: 38, y: 64 },
    explodedOffset: { x: -170, y: 70 },
    icon: '⚙️'
  },
  {
    id: 'tuktuk-cylinder',
    name: '200cc 4-Stroke Engine Cylinder Block Kit',
    hindiName: '200cc फोर-स्ट्रोक इंजन ब्लॉक किट',
    category: 'Engine Components',
    oemNumber: 'BA-5110-33 / G-5010-89',
    grade: 'OEM Genuine',
    compatibility: 'Bajaj RE 205cc DTS-i, TVS King 200cc 4-Stroke',
    description: 'Cast iron cooling-finned cylinder block with graphite-coated heavy-duty piston and export specification gasket set.',
    position: { x: 50, y: 48 },
    explodedOffset: { x: 150, y: -80 },
    icon: '🔩'
  },
  {
    id: 'tuktuk-starter',
    name: 'Commercial Starter Motor & Self Assembly',
    hindiName: 'कमर्शियल सेल्फ स्टार्टर मोटर',
    category: 'Electrical',
    oemNumber: 'BA-3510-14 / TVS-K-3401',
    grade: 'Tier-1 OES',
    compatibility: 'Bajaj RE Maxima, Compact, TVS King Duramax',
    description: 'High-torque 12V 0.8kW starter motor with integrated solenoid switch and copper armature winding.',
    position: { x: 42, y: 35 },
    explodedOffset: { x: -60, y: -120 },
    icon: '⚡'
  },
  {
    id: 'tuktuk-axle',
    name: 'Rear Drive Axle Shaft & CV Flange',
    hindiName: 'रियर ड्राइव एक्सल शाफ्ट',
    category: 'Transmission & Axle',
    oemNumber: 'BA-5514-02 / AA-5512-10',
    grade: 'Export Grade',
    compatibility: 'All 3-Wheeler Commercial Auto-Rickshaw Chassis',
    description: 'Forged chrome-moly steel rear axle shaft designed to withstand extreme commercial cargo payloads.',
    position: { x: 68, y: 66 },
    explodedOffset: { x: 160, y: 70 },
    icon: '🔧'
  }
];

export default function ExplodedScooterShowcase() {
  const { openSelector, selectedVehicle } = useVehicle();
  const [vehicleType, setVehicleType] = useState<'SCOOTER' | 'TUKTUK'>('SCOOTER');
  
  // Stages:
  // 0: Assembled (Full view)
  // 1: Fairing / Panels Opened
  // 2: 3D Exploded Mechanical Systems
  // 3: Component Inspection
  const [stage, setStage] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePart, setActivePart] = useState<ExplodedPart | null>(null);
  const [gifAvailable, setGifAvailable] = useState<boolean>(true);

  const activePartsList = vehicleType === 'SCOOTER' ? SCOOTER_PARTS : TUKTUK_PARTS;

  // Auto-play disassembly sequence
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Stage multipliers: how far parts move outward
  const stageOffsets = [0, 0.35, 1, 1.3];
  const currentMultiplier = stageOffsets[stage];

  return (
    <section className="relative w-full bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FB] to-[#EEF2F6] text-[#232323] overflow-hidden pt-8 pb-12 border-b border-[#C8C9CE]/40">
      
      {/* Background Subtle Technical Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: `radial-gradient(rgba(84, 165, 190, 0.12) 1px, transparent 1px), radial-gradient(rgba(191, 181, 158, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      {/* Ambient Lighting Spheres in Scooter Palette */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#54A5BE]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#BFB59E]/15 blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-6 border-b border-[#C8C9CE]/40">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#54A5BE]/10 text-[#54A5BE] border border-[#54A5BE]/25 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#54A5BE] animate-ping" />
              <span>3D Exploded Spare Parts Architecture • 100% Genuine Fitment</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#232323]">
              Scroll &amp; Inspect Genuine Parts for{' '}
              <span className="text-[#54A5BE] underline decoration-[#BFB59E] decoration-4 underline-offset-4">
                {vehicleType === 'SCOOTER' ? 'Scooters & Motorcycles' : 'Tuk-Tuks & 3-Wheelers'}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl font-medium">
              Har ek part ko alag karke dekhein (3D Exploded View). Engine se lekar transmission, brake aur chassis tak — OEM code ke sath direct export order karein.
            </p>
          </div>

          {/* Vehicle Type Switcher & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Vehicle Selector */}
            <div className="inline-flex p-1 bg-white border border-[#C8C9CE] rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setVehicleType('SCOOTER');
                  setActivePart(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  vehicleType === 'SCOOTER'
                    ? 'bg-[#54A5BE] text-white shadow-sm'
                    : 'text-[#232323] hover:text-[#54A5BE]'
                }`}
              >
                <span>🛵 Scooter &amp; Motorcycle</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setVehicleType('TUKTUK');
                  setActivePart(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  vehicleType === 'TUKTUK'
                    ? 'bg-[#54A5BE] text-white shadow-sm'
                    : 'text-[#232323] hover:text-[#54A5BE]'
                }`}
              >
                <span>🛺 Tuk-Tuk &amp; 3-Wheeler</span>
              </button>
            </div>

            {/* Auto-Play Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isPlaying
                  ? 'bg-[#5A3E36] text-white border-[#5A3E36]'
                  : 'bg-white text-[#232323] border-[#C8C9CE] hover:border-[#54A5BE]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#54A5BE]" />}
              <span>{isPlaying ? 'Pause 3D' : 'Auto 3D Play'}</span>
            </button>
          </div>
        </div>

        {/* Stage Slider Controller */}
        <div className="mt-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#C8C9CE]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#232323] shrink-0">
            <Layers className="w-4 h-4 text-[#54A5BE]" />
            <span>DISASSEMBLY STAGES:</span>
          </div>

          {/* Interactive Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-3xl">
            {[
              { id: 0, label: '01. Assembled', desc: 'Full Vehicle' },
              { id: 1, label: '02. Body Panels', desc: 'Outer Shell' },
              { id: 2, label: '03. Exploded Parts', desc: '3D Mechanical' },
              { id: 3, label: '04. Deep X-Ray', desc: 'Micro Spec' },
            ].map((stg) => (
              <button
                key={stg.id}
                type="button"
                onClick={() => setStage(stg.id)}
                className={`py-2 px-3 rounded-xl text-start transition-all border ${
                  stage === stg.id
                    ? 'bg-[#54A5BE]/10 border-[#54A5BE] text-[#275765] shadow-xs ring-1 ring-[#54A5BE]/30'
                    : 'bg-white border-[#C8C9CE]/50 text-gray-600 hover:border-[#54A5BE]/40'
                }`}
              >
                <div className="text-xs font-bold text-[#232323]">{stg.label}</div>
                <div className="text-[11px] text-gray-500 font-medium">{stg.desc}</div>
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-medium hidden lg:block shrink-0">
            <span className="text-[#54A5BE] font-bold">💡 Tip:</span> Click any part pin to view details
          </div>
        </div>

        {/* MAIN 3D EXPLODED CANVAS AREA */}
        <div className="relative mt-6 min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] bg-white rounded-3xl border border-[#C8C9CE]/60 shadow-lg shadow-black/5 overflow-hidden flex items-center justify-center">
          
          {/* Subtle Technical Blueprint Coordinates */}
          <div className="absolute top-4 left-6 text-[11px] font-mono text-gray-400 select-none">
            ENGINEERING CAD VIEW • EXPLODED SCALE: {currentMultiplier.toFixed(2)}x • MODEL: {vehicleType}
          </div>

          <div className="absolute top-4 right-6 flex items-center gap-3 text-xs text-gray-500 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>EXPORT SPEC: BS-IV / BS-VI / EURO-4</span>
          </div>

          {/* Central Vehicle Visual Pedestal */}
          <div className="relative w-full max-w-4xl h-[400px] sm:h-[480px] flex items-center justify-center p-4">
            
            {/* Studio Floor Pedestal Ellipse */}
            <div 
              className="absolute bottom-6 w-[85%] h-24 rounded-[100%] bg-gradient-to-r from-transparent via-[#C8C9CE]/35 to-transparent blur-md pointer-events-none"
              style={{
                transform: `scale(${1 + currentMultiplier * 0.15})`
              }}
            />

            {/* Central Animated Vehicle Base */}
            <div 
              className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
              style={{
                transform: `scale(${stage === 0 ? 1.05 : stage === 1 ? 0.98 : stage === 2 ? 0.92 : 0.88})`
              }}
            >
              {/* If user GIF exists, show it; with graceful image fallback */}
              {gifAvailable ? (
                <img
                  src="/api/hero-gif"
                  alt="3D Exploded Scooter Parts Disassembly"
                  onError={() => setGifAvailable(false)}
                  className="max-h-[380px] sm:max-h-[440px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(35,35,35,0.15)] transition-all duration-700"
                />
              ) : (
                <img
                  src={
                    vehicleType === 'SCOOTER'
                      ? '/images/hero-motorcycle-showcase.png'
                      : '/images/hero-tuktuk-xray.jpg'
                  }
                  alt="3D Exploded Parts Breakdown"
                  className="max-h-[360px] sm:max-h-[420px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(35,35,35,0.15)] transition-all duration-700"
                />
              )}
            </div>

            {/* EXPLODED PART HOTSPOTS & FLOATING CONNECTORS */}
            {stage > 0 && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {activePartsList.map((part) => {
                  const offsetX = part.explodedOffset.x * currentMultiplier;
                  const offsetY = part.explodedOffset.y * currentMultiplier;
                  const isSelected = activePart?.id === part.id;

                  return (
                    <div
                      key={part.id}
                      className="absolute pointer-events-auto transition-transform duration-700 ease-out"
                      style={{
                        left: `${part.position.x}%`,
                        top: `${part.position.y}%`,
                        transform: `translate(${offsetX}px, ${offsetY}px)`,
                      }}
                    >
                      {/* Interactive Pin */}
                      <button
                        type="button"
                        onClick={() => setActivePart(isSelected ? null : part)}
                        className={`group relative -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 p-1.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                          isSelected
                            ? 'bg-[#54A5BE] text-white ring-4 ring-[#54A5BE]/30 scale-110'
                            : 'bg-white/95 text-[#232323] hover:bg-[#54A5BE] hover:text-white border border-[#C8C9CE]'
                        }`}
                      >
                        {/* Pulse Ring */}
                        <span className="w-7 h-7 rounded-full bg-[#54A5BE]/20 group-hover:bg-white/20 flex items-center justify-center font-bold text-xs">
                          {part.icon}
                        </span>

                        <span className="text-xs font-bold pe-2 max-w-[120px] sm:max-w-[160px] truncate">
                          {part.name.split('&')[0]}
                        </span>

                        <span className="w-5 h-5 rounded-full bg-[#54A5BE] text-white flex items-center justify-center text-[10px] font-bold">
                          <Plus className="w-3 h-3" />
                        </span>
                      </button>

                      {/* Floating Mini Spec Tag */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#232323] text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap opacity-80 pointer-events-none font-mono">
                        {part.grade}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PART DETAIL MODAL / POPUP OVERLAY */}
            {activePart && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md bg-white/95 backdrop-blur-lg border-2 border-[#54A5BE] rounded-2xl p-5 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#54A5BE]/15 text-2xl flex items-center justify-center">
                      {activePart.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#54A5BE]/10 text-[#54A5BE] border border-[#54A5BE]/20">
                        {activePart.category}
                      </span>
                      <h4 className="text-base font-bold text-[#232323] mt-0.5 leading-snug">
                        {activePart.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">{activePart.hindiName}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePart(null)}
                    className="text-gray-400 hover:text-[#232323] text-lg font-bold p-1"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">OEM Part Number:</span>
                    <span className="font-mono font-bold text-[#275765] bg-[#E9F5F8] px-2 py-0.5 rounded">
                      {activePart.oemNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Export Quality Grade:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {activePart.grade}
                    </span>
                  </div>

                  <div className="py-1">
                    <span className="text-gray-500 font-medium block">Fitment Models:</span>
                    <span className="text-[#232323] font-semibold">{activePart.compatibility}</span>
                  </div>

                  <p className="text-gray-600 text-[11px] leading-relaxed pt-1">
                    {activePart.description}
                  </p>
                </div>

                {/* CTAs */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2.5">
                  <Link
                    href={`/parts?q=${encodeURIComponent(activePart.name.split(' ')[0])}`}
                    className="flex-1 bg-[#54A5BE] hover:bg-[#438ea5] text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>View in Catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/enquiry"
                    className="bg-[#5A3E36] hover:bg-[#4a332c] text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center transition-all shadow-xs"
                  >
                    Add to RFQ
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Stage Indicator Floating Bar */}
          <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C8C9CE] shadow-xs text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#54A5BE]" />
            <span className="text-gray-700">Exploded State:</span>
            <span className="font-bold text-[#54A5BE]">
              {stage === 0 ? 'Fully Assembled' : stage === 1 ? 'Outer Shell Detached' : stage === 2 ? '3D Exploded Engine & Drive' : 'Deep Component X-Ray'}
            </span>
          </div>

          {/* Expand Fullscreen / Reset View Button */}
          <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setStage(0);
                setActivePart(null);
              }}
              className="bg-white/90 hover:bg-white text-[#232323] border border-[#C8C9CE] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#54A5BE]" />
              <span>Reset</span>
            </button>
          </div>

        </div>

        {/* 4 Feature Highlights directly underneath */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-3.5 rounded-2xl border border-[#C8C9CE]/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#54A5BE]/10 text-[#54A5BE] flex items-center justify-center text-lg font-bold shrink-0">
              ⚙️
            </div>
            <div>
              <div className="text-xs font-bold text-[#232323]">10,000+ SKU Catalog</div>
              <div className="text-[11px] text-gray-500">Every two &amp; three wheeler part</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#C8C9CE]/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#BFB59E]/20 text-[#5A3E36] flex items-center justify-center text-lg font-bold shrink-0">
              📑
            </div>
            <div>
              <div className="text-xs font-bold text-[#232323]">Exact OEM Part Codes</div>
              <div className="text-[11px] text-gray-500">Guaranteed fitment &amp; specs</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#C8C9CE]/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A3E36]/10 text-[#5A3E36] flex items-center justify-center text-lg font-bold shrink-0">
              🛡️
            </div>
            <div>
              <div className="text-xs font-bold text-[#232323]">3-Tier Quality Grades</div>
              <div className="text-[11px] text-gray-500">OEM Genuine, OES, Export Grade</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#C8C9CE]/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold shrink-0">
              🚢
            </div>
            <div>
              <div className="text-xs font-bold text-[#232323]">Worldwide Export</div>
              <div className="text-[11px] text-gray-500">Full shipping documentation</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
