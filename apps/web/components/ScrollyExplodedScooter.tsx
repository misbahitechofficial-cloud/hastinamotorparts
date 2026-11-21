'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Plus,
  ArrowRight,
  ChevronDown,
  Layers,
  Sparkles,
  MousePointer
} from 'lucide-react';
import { useVehicle } from '@/lib/vehicleContext';

interface ExplodedHotspot {
  id: string;
  number: string;
  name: string;
  hindiName: string;
  category: string;
  oemNumber: string;
  grade: 'OEM Genuine' | 'Tier-1 OES' | 'Export Grade';
  colorToken: string;
  colorName: string;
  compatibility: string;
  description: string;
  pinX: number; // percentage in frame (0-100)
  pinY: number; // percentage in frame (0-100)
  side: 'left' | 'right';
  icon: string;
}

const HOTSPOTS: ExplodedHotspot[] = [
  {
    id: 'leather-seat',
    number: '01',
    name: 'Saddle Leather Seat Assembly',
    hindiName: 'प्रीमियम लेदर सीट असेंबली',
    category: 'Body & Upholstery',
    oemNumber: '77200-KWP-900',
    grade: 'OEM Genuine',
    colorToken: '#5A3E36',
    colorName: 'Leather Brown (#5A3E36)',
    compatibility: 'Suzuki Access 125, Burgman Street, TVS Jupiter',
    description: 'High-density foam cushion with dual-stitch Saddle Brown leather cover and galvanized hinge plate.',
    pinX: 30,
    pinY: 20,
    side: 'left',
    icon: '🪑'
  },
  {
    id: 'led-headlamp',
    number: '02',
    name: 'LED Projector Headlamp & Visor',
    hindiName: 'एलईडी प्रोजेक्टर हेडलैंप',
    category: 'Electrical & Lighting',
    oemNumber: '33100-K0R-V01',
    grade: 'Tier-1 OES',
    colorToken: '#54A5BE',
    colorName: 'Aqua Blue Mask (#54A5BE)',
    compatibility: 'Access 125 LED Edition, Activa 6G, Dio 125',
    description: 'High-intensity dual LED projector beam with UV-treated anti-yellowing polycarbonate lens.',
    pinX: 79,
    pinY: 17,
    side: 'right',
    icon: '💡'
  },
  {
    id: 'front-apron',
    number: '03',
    name: 'Aerodynamic Front Apron Fairing',
    hindiName: 'फ्रंट एप्रन एवं बॉडी पैनल',
    category: 'Bodywork & Panels',
    oemNumber: '48111-K0R-V00',
    grade: 'OEM Genuine',
    colorToken: '#54A5BE',
    colorName: 'Aqua Blue Metallic (#54A5BE)',
    compatibility: 'Direct OEM factory mold for Access 125 Special Edition',
    description: 'Virgin ABS impact-resistant panel with factory metallic multi-coat paint finish.',
    pinX: 86,
    pinY: 42,
    side: 'right',
    icon: '🛡️'
  },
  {
    id: 'telescopic-fork',
    number: '04',
    name: 'Telescopic Front Fork Suspension',
    hindiName: 'टेलीस्कोपिक फ्रंट सस्पेंशन',
    category: 'Suspension',
    oemNumber: '51400-KWP-D01',
    grade: 'OEM Genuine',
    colorToken: '#C8C9CE',
    colorName: 'Alloy Chrome (#C8C9CE)',
    compatibility: 'Access 125, Activa 125, Jupiter 125',
    description: 'Heavy-duty hydraulic chrome stanchion tubes with progressive coil damping springs.',
    pinX: 77,
    pinY: 67,
    side: 'right',
    icon: '🔧'
  },
  {
    id: 'front-disc',
    number: '05',
    name: 'Ventilated Disc Rotor & Caliper',
    hindiName: 'फ्रंट डिस्क रोटर एवं कैलिपर',
    category: 'Braking System',
    oemNumber: '45251-K03-N41',
    grade: 'OEM Genuine',
    colorToken: '#C8C9CE',
    colorName: 'Drilled Stainless Steel',
    compatibility: 'Access 125 Special Edition, Burgman Street 125',
    description: 'Laser-cut heat-treated stainless rotor with dual-piston Bybre hydraulic caliper.',
    pinX: 60,
    pinY: 76,
    side: 'right',
    icon: '🛑'
  },
  {
    id: 'floorboard',
    number: '06',
    name: 'Inner Floorboard & Leg Shield',
    hindiName: 'इनर फ्लोरबोर्ड एवं लेग शील्ड',
    category: 'Bodywork & Panels',
    oemNumber: '81131-KWP-900',
    grade: 'OEM Genuine',
    colorToken: '#C8C9CE',
    colorName: 'Textured Beige PP',
    compatibility: 'Suzuki Access 125 (All BS4 & BS6 Variants)',
    description: 'Anti-slip ribbed polypropylene floor with integrated battery compartment and luggage hook.',
    pinX: 53,
    pinY: 56,
    side: 'left',
    icon: '🛴'
  },
  {
    id: 'engine-muffler',
    number: '07',
    name: '125cc 4-Stroke Engine & Muffler',
    hindiName: '125cc 4-स्ट्रोक इंजन एवं मफलर',
    category: 'Engine & Exhaust',
    oemNumber: '14310-K0R-V00',
    grade: 'OEM Genuine',
    colorToken: '#5A3E36',
    colorName: 'Cast Aluminum / Chrome Guard',
    compatibility: 'Suzuki SEP Engine (Access 125 / Burgman 125 / Avenis 125)',
    description: 'Suzuki Eco Performance (SEP) single-cylinder air-cooled powerplant with catalytic exhaust assembly.',
    pinX: 40,
    pinY: 71,
    side: 'left',
    icon: '⚙️'
  }
];

export default function ScrollyExplodedScooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 (exploded) -> 1 (assembled)
  const [activeHotspot, setActiveHotspot] = useState<ExplodedHotspot | null>(null);

  // Monitor scroll within sticky track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far down the track we have scrolled
      const totalScrollableDistance = rect.height - windowHeight;
      const currentScrollY = -rect.top;
      
      if (currentScrollY <= 0) {
        setScrollProgress(0);
      } else if (currentScrollY >= totalScrollableDistance) {
        setScrollProgress(1);
      } else {
        const progress = currentScrollY / totalScrollableDistance;
        setScrollProgress(Math.min(1, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute Stage Title & Number based on scroll progress
  const stageNumber = scrollProgress < 0.25 
    ? '01' 
    : scrollProgress < 0.60 
    ? '02' 
    : scrollProgress < 0.85 
    ? '03' 
    : '04';

  const stageTitle = scrollProgress < 0.25 
    ? 'ALL 100+ OEM PARTS' 
    : scrollProgress < 0.60 
    ? 'EXPLODED SYSTEMS' 
    : scrollProgress < 0.85 
    ? 'CHASSIS & FAIRINGS' 
    : 'ASSEMBLED';

  const stageDesc = scrollProgress < 0.25 
    ? 'Hover or click individual genuine OEM components to inspect verified serial fitment codes.' 
    : scrollProgress < 0.60 
    ? 'Engine core, disc rotor, suspension fork and floorboard expanded into 3D explosion view.' 
    : scrollProgress < 0.85 
    ? 'Outer fairing panels and structural frame converging into road-ready alignment.' 
    : 'Road-ready two-wheeler with factory fairings and assembled chassis.';

  return (
    // Outer scroll track: 260vh for smooth mouse scroll control
    <div 
      ref={containerRef}
      className="relative w-full h-[260vh] bg-white bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px]"
    >
      {/* STICKY VIEWPORT CONTAINER: Locks to screen while user scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between text-[#232323] select-none">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-[#54A5BE]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#BFB59E]/6 blur-3xl pointer-events-none" />

        {/* 1. TOP MINIMAL HUD: 100% Full Width Edge-to-Edge */}
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-10 xl:px-14 pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#54A5BE]" />
              <span className="text-[11px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
                HASTINA OEM EXPLODED VIEW ENGINE // 100% CAD ACCURACY
              </span>
            </div>

            <div className="text-[11px] font-mono text-gray-500">
              ASSEMBLY: <span className="font-bold text-[#54A5BE]">{Math.round(scrollProgress * 100)}%</span>
            </div>
          </div>

          {/* Mobile stage badge (Visible only on mobile screens) */}
          <div className="md:hidden flex items-center justify-between pt-2 text-xs">
            <span className="font-mono text-[11px] font-bold text-[#54A5BE]">
              STAGE // {stageNumber} • {stageTitle}
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              {Math.round(scrollProgress * 100)}% ASSEMBLED
            </span>
          </div>
        </div>

        {/* 2. MAIN CENTER STAGE: 100% Full-Width Edge-to-Edge Canvas */}
        <div className="relative z-10 flex-1 w-full px-3 sm:px-6 md:px-8 lg:px-10 xl:px-14 flex items-center justify-between gap-2 lg:gap-6">
          
          {/* LEFT SIDE: (SCROLL TIMELINE, STAGE // 01, SPECS) */}
          <div className="w-60 lg:w-72 xl:w-80 shrink-0 z-20 pointer-events-none hidden md:block">
            <div className="space-y-4">
              
              {/* SCROLL TIMELINE with Sky Cyan line */}
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#54A5BE] uppercase font-bold">
                <span>SCROLL TIMELINE</span>
                <span className="w-10 h-[2px] bg-[#54A5BE]" />
              </div>

              {/* STAGE // 01 */}
              <div className="space-y-0">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-[#232323] tracking-tight leading-none">
                  STAGE
                </h1>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-[#54A5BE] tracking-tight leading-none mt-1">
                  // {stageNumber}
                </div>
                <div className="text-xs sm:text-sm font-heading font-bold tracking-widest text-[#232323] uppercase pt-2">
                  {stageTitle}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[250px]">
                {stageDesc}
              </p>

              {/* Specs: Two clean columns without box */}
              <div className="grid grid-cols-2 gap-4 pt-3 font-mono text-xs border-t border-[#C8C9CE]/40">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    ENGINE DISPLACEMENT
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#232323] mt-0.5">
                    124 CC SEP
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    FITMENT ACCURACY
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#54A5BE] mt-0.5">
                    100% OEM
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CENTRAL 3D DUAL-LAYER STAGE (Full-Screen 100% Prominent Showcase) */}
          <div className="relative flex-1 w-full h-[65vh] sm:h-[72vh] lg:h-[76vh] flex items-center justify-center">
            
            {/* Aspect Wrapper for both images and hotspots */}
            <div className="relative w-full max-w-[1150px] h-full flex items-center justify-center">
              
              {/* Studio Floor Pedestal Ellipse Shadow */}
              <div 
                className="absolute bottom-4 sm:bottom-8 w-[80%] h-20 rounded-[100%] bg-gradient-to-r from-transparent via-gray-300/40 to-transparent blur-md pointer-events-none transition-transform duration-300"
                style={{
                  transform: `scale(${1 + scrollProgress * 0.15})`
                }}
              />

              {/* LAYER 1: 3D EXPLODED SCOOTER (scooter_0001.png) - Shown at Stage 01 */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: Math.max(0, 1 - scrollProgress * 1.6),
                  transform: `scale(${1.02 - scrollProgress * 0.04})`,
                  transition: 'opacity 0.2s ease-out, transform 0.25s ease-out'
                }}
              >
                <img
                  src="/api/scooter-exploded"
                  alt="3D Exploded Scooter Components Disassembly View"
                  className="w-full h-full max-h-[62vh] sm:max-h-[70vh] lg:max-h-[75vh] object-contain drop-shadow-[0_25px_45px_rgba(35,35,35,0.18)]"
                />
              </div>

              {/* LAYER 2: ASSEMBLED SCOOTER (scooter_0002.png) - Assembles into view at Stage 04 */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: Math.min(1, scrollProgress * 1.6),
                  transform: `scale(${0.96 + scrollProgress * 0.04}) translateY(${(1 - scrollProgress) * 15}px)`,
                  transition: 'opacity 0.2s ease-out, transform 0.25s ease-out'
                }}
              >
                <img
                  src="/api/scooter-assembled"
                  alt="Fully Assembled Suzuki Access 125 Scooter"
                  className="w-full h-full max-h-[62vh] sm:max-h-[70vh] lg:max-h-[75vh] object-contain drop-shadow-[0_25px_45px_rgba(35,35,35,0.16)]"
                />
              </div>

              {/* INTERACTIVE HOTSPOTS ON EXPLODED SCOOTER (Shown at Stage 01, fades out as parts assemble) */}
              {scrollProgress < 0.65 && (
                <div 
                  className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: Math.max(0, 1 - scrollProgress * 1.6)
                  }}
                >
                  {HOTSPOTS.map((hotspot) => {
                    const isSelected = activeHotspot?.id === hotspot.id;

                    return (
                      <div
                        key={hotspot.id}
                        className="absolute pointer-events-auto transition-transform duration-500 ease-out"
                        style={{
                          left: `${hotspot.pinX}%`,
                          top: `${hotspot.pinY}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveHotspot(isSelected ? null : hotspot)}
                          className={`group relative flex items-center gap-1.5 p-1 rounded-full backdrop-blur-md transition-all ${
                            isSelected
                              ? 'bg-[#54A5BE] text-white ring-4 ring-[#54A5BE]/30 scale-110'
                              : 'bg-white/95 text-[#232323] hover:bg-[#54A5BE] hover:text-white border border-gray-300 hover:border-[#54A5BE] shadow-xs'
                          }`}
                          title={hotspot.name}
                        >
                          <span 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                              backgroundColor: isSelected ? '#FFFFFF' : `${hotspot.colorToken}15`,
                              color: isSelected ? hotspot.colorToken : '#232323'
                            }}
                          >
                            {hotspot.number}
                          </span>

                          <span className="text-[10px] font-bold pe-1.5 max-w-[90px] truncate hidden xl:inline">
                            {hotspot.name.split(' ')[0]}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* UNBOXED EDITORIAL DETAIL TICKER (When a hotspot is selected) */}
              {activeHotspot && (
                <div className="absolute bottom-2 left-4 right-4 sm:left-auto sm:right-4 z-40 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-4 shadow-xl max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono text-[#54A5BE] uppercase font-bold tracking-wider">
                        {activeHotspot.number} // {activeHotspot.category}
                      </div>
                      <div className="text-sm font-bold text-[#232323] mt-0.5">
                        {activeHotspot.name}
                      </div>
                      <div className="text-xs font-mono text-gray-500 mt-0.5">
                        OEM: {activeHotspot.oemNumber} • {activeHotspot.grade}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="text-gray-400 hover:text-gray-600 font-bold text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px] truncate max-w-[170px]">
                      {activeHotspot.compatibility}
                    </span>
                    <Link
                      href={`/parts?q=${encodeURIComponent(activeHotspot.name.split(' ')[0])}`}
                      className="text-[#54A5BE] hover:underline font-bold text-xs flex items-center gap-1 shrink-0"
                    >
                      <span>View Part</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT SIDE: (EXPLODED LAYERS // 07 TOTAL) */}
          <div className="w-60 lg:w-72 xl:w-80 shrink-0 z-20 pointer-events-auto hidden md:block">
            
            {/* Header: EXPLODED LAYERS // 07 TOTAL */}
            <div className="text-[11px] font-mono tracking-widest text-gray-500 uppercase pb-2">
              EXPLODED LAYERS <span className="text-[#54A5BE] font-bold">// 07 TOTAL</span>
            </div>

            {/* List of 7 layers in clean unboxed typography */}
            <div className="space-y-3 pt-1">
              {HOTSPOTS.map((h) => {
                const isRevealed = scrollProgress < 0.85;
                const isSelected = activeHotspot?.id === h.id;

                return (
                  <div
                    key={h.id}
                    onClick={() => setActiveHotspot(isSelected ? null : h)}
                    className={`group cursor-pointer transition-all duration-300 ${
                      isRevealed 
                        ? 'opacity-100' 
                        : 'opacity-40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Number in formal mono */}
                      <span className="text-[11px] font-mono font-bold text-gray-400 group-hover:text-[#54A5BE] transition-colors mt-0.5">
                        {h.number}
                      </span>

                      {/* Part Name & OEM in clean typography */}
                      <div>
                        <div className={`text-xs font-bold transition-colors leading-tight ${
                          isSelected 
                            ? 'text-[#54A5BE]' 
                            : 'text-[#232323] group-hover:text-[#54A5BE]'
                        }`}>
                          {h.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono tracking-wider mt-0.5">
                          {h.oemNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* 3. BOTTOM CINEMATIC HUD: 100% Full Width Edge-to-Edge */}
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-10 xl:px-14 pb-4 sm:pb-6">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-t border-[#C8C9CE]/30 pt-3">
            
            {/* Mouse scroll indicator */}
            <div className="flex items-center gap-2 text-[#232323] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#54A5BE] animate-ping" />
              <span>MOUSE SCROLL TO ASSEMBLE</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#54A5BE] animate-bounce" />
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] font-mono">01 EXPLODED</span>
              <div className="w-32 sm:w-48 h-[2px] bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#54A5BE] transition-all duration-75"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <span className="hidden sm:inline text-[11px] font-mono">04 ASSEMBLED</span>
            </div>

            {/* Link to catalogue */}
            <div>
              <Link 
                href="/parts" 
                className="text-[#54A5BE] hover:text-[#438ea5] font-bold text-xs flex items-center gap-1 font-sans"
              >
                <span>Full Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
