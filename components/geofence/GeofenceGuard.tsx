'use client';

import React, { useState } from 'react';
import {
  MapPin,
  ShieldAlert,
  RotateCw,
  Compass,
  Smartphone,
  Laptop,
  AlertTriangle,
  Info,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import { useGeofence } from '@/hooks/use-geofence';
import { formatDistance } from '@/lib/geofence/geo-utils';
import { GeofenceZone } from '@/lib/geofence/geofence.config';

interface GeofenceGuardProps {
  children: React.ReactNode;
  pageTitle?: string;
  zonesOverride?: GeofenceZone[];
}

export function GeofenceGuard({
  children,
  pageTitle = 'This Page',
  zonesOverride,
}: GeofenceGuardProps) {
  const {
    status,
    evaluation,
    errorMessage,
    isBypassed,
    zones,
    retryCheck,
    isRetrying,
  } = useGeofence(zonesOverride);

  const [deviceTab, setDeviceTab] = useState<'brave_chrome' | 'ios' | 'android'>('brave_chrome');

  // 1. Allowed or Disabled
  if (status === 'allowed' || status === 'disabled') {
    return (
      <>
        {isBypassed && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 text-center flex items-center justify-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Developer Mode: Venue Geofencing Bypassed (?bypass_geo=true)</span>
          </div>
        )}
        {children}
      </>
    );
  }

  // 2. Checking / Radar State
  if (status === 'checking' || status === 'idle') {
    return (
      <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E8E2D9] rounded-2xl p-8 text-center shadow-xl relative overflow-hidden">
          {/* Pulsing Radar Glow */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#FF6B35]/15 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-[#FF6B35]/25 animate-pulse" />
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF8C42] flex items-center justify-center shadow-md">
              <Compass className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          <h2
            className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-copperplate-bold), serif' }}
          >
            Verifying Location
          </h2>
          <p className="text-[#5E5D5D] text-sm mb-6 leading-relaxed">
            Acquiring high-accuracy GPS coordinates to confirm you are present at an authorized venue...
          </p>

          <div className="bg-[#FAF7F0] border border-[#E8E2D9] rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="text-[11px] font-semibold text-[#8B7355] uppercase tracking-wider">
              Authorized Venues:
            </div>
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B35] mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-[#1A1A1A]">{zone.name}</span>
                  <span className="text-[#717171] block text-[11px]">{zone.address}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#8B7355] bg-[#FAF7F0] border border-[#E8E2D9] py-2.5 px-3 rounded-lg">
            <Info className="w-4 h-4 text-[#FF6B35] shrink-0" />
            <span>Please tap &quot;Allow&quot; when prompted by your browser</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Out of Bounds State (Outside all authorized venues)
  if (status === 'out_of_bounds' && evaluation) {
    const nearest = evaluation.nearestZone;
    const distanceFormatted = formatDistance(evaluation.nearestDistanceKm);

    return (
      <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E8E2D9] rounded-2xl p-8 text-center shadow-xl relative">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-500 mx-auto mb-5 flex items-center justify-center shadow-inner">
            <MapPin className="w-8 h-8" />
          </div>

          <h2
            className="text-2xl font-bold text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-copperplate-bold), serif' }}
          >
            Venue Access Restricted
          </h2>
          <p className="text-[#5E5D5D] text-sm mb-6 leading-relaxed">
            {pageTitle} is restricted to attendees physically present at our authorized church locations.
          </p>

          {/* Distance Readout Card */}
          <div className="bg-[#FAF7F0] border border-red-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] uppercase font-semibold text-[#8B7355] tracking-wider">
                Nearest Authorized Venue
              </span>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full">
                {distanceFormatted} away
              </span>
            </div>
            <div className="font-bold text-[#1A1A1A] text-base">{nearest.name}</div>
            <div className="text-xs text-[#717171] mt-0.5">{nearest.address}</div>
            <div className="text-[11px] text-[#8B7355] mt-2">
              Allowed radius: <strong className="text-[#1A1A1A]">{nearest.radiusKm} km</strong>
            </div>
          </div>

          {/* List of all allowed venues */}
          <div className="bg-[#FAF7F0] border border-[#E8E2D9] rounded-xl p-4 text-left mb-6 space-y-2.5">
            <div className="text-[11px] font-semibold text-[#8B7355] uppercase tracking-wider">
              Authorized Locations:
            </div>
            {evaluation.allDistances.map(({ zone, distanceKm }) => (
              <div
                key={zone.id}
                className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8E2D9] last:border-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B35] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">{zone.name}</div>
                    <div className="text-[11px] text-[#717171]">{zone.address}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-mono font-medium text-[#1A1A1A]">
                    {formatDistance(distanceKm)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={retryCheck}
            disabled={isRetrying}
            className="w-full py-3.5 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
          >
            <RotateCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Checking Location...' : 'Retry Location Check'}
          </button>
        </div>
      </div>
    );
  }

  // 4. Permission Denied / Blocked
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A] flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 text-center shadow-xl relative">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto mb-4 flex items-center justify-center shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2
          className="text-2xl font-bold text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-copperplate-bold), serif' }}
        >
          Location Permission Needed
        </h2>
        <p className="text-[#5E5D5D] text-sm mb-5 leading-relaxed">
          {errorMessage ||
            'Location access was blocked in your browser. Please allow location to verify you are present at the venue:'}
        </p>

        {/* Tab Selector */}
        <div className="bg-[#FAF7F0] border border-[#E8E2D9] rounded-xl p-4 text-left mb-6">
          <div className="text-[11px] font-semibold text-[#8B7355] uppercase tracking-wider mb-3">
            Quick 2-Step Enable Guide:
          </div>

          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-[#E8E2D9] mb-4 text-xs">
            <button
              onClick={() => setDeviceTab('brave_chrome')}
              className={`py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                deviceTab === 'brave_chrome'
                  ? 'bg-[#FF6B35] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Brave / Chrome
            </button>
            <button
              onClick={() => setDeviceTab('ios')}
              className={`py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                deviceTab === 'ios'
                  ? 'bg-[#FF6B35] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> iPhone / iPad
            </button>
            <button
              onClick={() => setDeviceTab('android')}
              className={`py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                deviceTab === 'android'
                  ? 'bg-[#FF6B35] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Android
            </button>
          </div>

          {/* Guide Content */}
          <div className="text-xs text-[#4A4A4A] space-y-2.5 leading-relaxed">
            {deviceTab === 'brave_chrome' && (
              <div className="space-y-2">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-900">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B35]" />
                  <div>
                    <strong className="text-[#1A1A1A] block font-semibold mb-0.5">
                      Look at your Address Bar:
                    </strong>
                    Click the <strong>Tune / Sliders 🎚️</strong> or <strong>Lock 🔒</strong> icon next to the URL.
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>Click the <strong className="text-[#1A1A1A]">tune 🎚️ / lock 🔒 icon</strong> next to the URL.</li>
                  <li>Switch <strong className="text-[#1A1A1A]">Location</strong> to <strong className="text-[#FF6B35]">&quot;Allow&quot;</strong> or <strong className="text-[#FF6B35]">&quot;Reset permission&quot;</strong>.</li>
                  <li>Click <strong className="text-[#FF6B35]">Re-Check Location</strong> below.</li>
                </ol>
              </div>
            )}

            {deviceTab === 'ios' && (
              <ol className="list-decimal list-inside space-y-1.5">
                <li>In Safari, tap the <strong className="text-[#1A1A1A]">&quot;aA&quot;</strong> or page settings icon on the address bar.</li>
                <li>Tap <strong className="text-[#1A1A1A]">Website Settings</strong> &rarr; set <strong className="text-[#FF6B35]">Location</strong> to <strong className="text-[#FF6B35]">Allow</strong>.</li>
                <li>Ensure <strong className="text-[#1A1A1A]">Settings &rarr; Privacy &rarr; Location Services</strong> is ON.</li>
                <li>Tap <strong className="text-[#FF6B35]">Re-Check Location</strong> below.</li>
              </ol>
            )}

            {deviceTab === 'android' && (
              <ol className="list-decimal list-inside space-y-1.5">
                <li>Make sure <strong className="text-[#1A1A1A]">Device Location (GPS)</strong> is turned ON in your top quick settings.</li>
                <li>In Chrome / Brave, tap the <strong className="text-[#1A1A1A]">tune 🎚️ / lock 🔒 icon</strong> on the address bar &rarr; enable <strong className="text-[#FF6B35]">Location</strong>.</li>
                <li>Tap <strong className="text-[#FF6B35]">Re-Check Location</strong> below.</li>
              </ol>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={retryCheck}
            disabled={isRetrying}
            className="w-full py-3.5 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
          >
            <RotateCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Checking Location...' : 'Re-Check Location'}
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F0] border border-[#E8E2D9] hover:bg-stone-200 text-[#1A1A1A] font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
