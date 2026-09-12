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
  Radar,
  Loader2,
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
  // Geotagging suspended for now so people anywhere can access normally
  const isSuspended = true;

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

  // 1. Allowed or Disabled or Suspended
  if (isSuspended || status === 'allowed' || status === 'disabled') {
    return (
      <>
        {isBypassed && (
          <div className="bg-amber-500 text-white text-xs py-1 px-3 text-center font-medium sticky top-0 z-50">
            Geofencing Bypassed (Admin / Preview Mode)
          </div>
        )}
        {children}
      </>
    );
  }

  // 2. Checking / Loading State
  if (status === 'checking' || status === 'idle') {
    return (
      <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E8E2D9] rounded-2xl p-8 text-center shadow-xl relative overflow-hidden">
          {/* Pulsing Radar Glow */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#FF6B35]/15 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-[#FF6B35]/25 animate-pulse" />
            <div className="relative w-12 h-12 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]">
              <Radar className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <h2
            className="text-2xl font-bold text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-copperplate-bold), serif' }}
          >
            Verifying Venue Location
          </h2>
          <p className="text-[#5E5D5D] text-sm mb-6 leading-relaxed">
            Please wait a moment while we verify you are present at an authorized service location.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-[#8B7355] bg-[#FAF7F0] border border-[#E8E2D9] rounded-xl py-3 px-4">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF6B35]" />
            <span>Connecting to satellite GPS / cellular tower...</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Out of Bounds State (Outside all authorized venues)
  const evalData = evaluation;
  if (status === 'out_of_bounds' && evalData) {
    const nearest = evalData.nearestZone;
    const distanceFormatted = formatDistance(evalData.nearestDistanceKm);

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
            {evalData.allDistances.map(({ zone, distanceKm }) => (
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
                  <span className="font-medium text-stone-700">
                    {formatDistance(distanceKm)}
                  </span>
                  <div className="text-[10px] text-stone-400">
                    radius: {zone.radiusKm}km
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => retryCheck()}
              disabled={isRetrying}
              className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Updating GPS coordinates...' : 'Retry Location Check'}
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

  // 4. Permission Denied or Error State (Helpful device guide)
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E8E2D9] rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto mb-5 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2
          className="text-2xl font-bold text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-copperplate-bold), serif' }}
        >
          Location Access Required
        </h2>

        <p className="text-[#5E5D5D] text-sm mb-6 leading-relaxed">
          {errorMessage ||
            'Location access was blocked in your browser. Please allow location to verify you are present at the venue:'}
        </p>

        {/* Tab Selector */}
        <div className="bg-[#FAF7F0] border border-[#E8E2D9] rounded-xl p-4 text-left mb-6">
          <div className="text-[11px] font-semibold text-[#8B7355] uppercase tracking-wider mb-3">
            Quick 2-Step Enable Guide:
          </div>

          <div className="flex rounded-lg bg-[#E8E2D9]/50 p-1 mb-4">
            <button
              type="button"
              onClick={() => setDeviceTab('brave_chrome')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                deviceTab === 'brave_chrome'
                  ? 'bg-white text-[#1A1A1A] shadow-sm font-semibold'
                  : 'text-[#8B7355] hover:text-[#1A1A1A]'
              }`}
            >
              Chrome / Brave
            </button>
            <button
              type="button"
              onClick={() => setDeviceTab('ios')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                deviceTab === 'ios'
                  ? 'bg-white text-[#1A1A1A] shadow-sm font-semibold'
                  : 'text-[#8B7355] hover:text-[#1A1A1A]'
              }`}
            >
              iPhone (Safari)
            </button>
            <button
              type="button"
              onClick={() => setDeviceTab('android')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                deviceTab === 'android'
                  ? 'bg-white text-[#1A1A1A] shadow-sm font-semibold'
                  : 'text-[#8B7355] hover:text-[#1A1A1A]'
              }`}
            >
              Android
            </button>
          </div>

          {/* Guide Content */}
          <div className="text-xs text-[#4A4A4A] space-y-2.5 leading-relaxed">
            {deviceTab === 'brave_chrome' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-bold text-[#FF6B35]">1.</span>
                  <span>Tap the <strong>tune/lock icon</strong> or the <strong>shield icon</strong> at the left of your browser address bar.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#FF6B35]">2.</span>
                  <span>Tap <strong>Site Settings / Permissions</strong> &rarr; change <strong>Location</strong> to <strong>Allow</strong>.</span>
                </div>
              </div>
            )}

            {deviceTab === 'ios' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-bold text-[#FF6B35]">1.</span>
                  <span>Tap the <strong>'aA'</strong> icon in Safari's address bar &rarr; select <strong>Website Settings</strong>.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#FF6B35]">2.</span>
                  <span>Set <strong>Location</strong> to <strong>Allow</strong> or <strong>Ask</strong>, then reload.</span>
                </div>
                <div className="flex gap-2 text-[#717171] text-[11px] pt-1">
                  <span>(Also verify iOS Settings &rarr; Privacy &amp; Security &rarr; Location Services is ON)</span>
                </div>
              </div>
            )}

            {deviceTab === 'android' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-bold text-[#FF6B35]">1.</span>
                  <span>Tap the <strong>Lock / Settings icon</strong> next to the address bar.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#FF6B35]">2.</span>
                  <span>Select <strong>Permissions</strong> &rarr; toggle <strong>Location</strong> to <strong>Allowed</strong>.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Retry Button */}
        <div className="space-y-3">
          <button
            onClick={() => retryCheck()}
            disabled={isRetrying}
            className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Re-checking permissions...' : "I've Allowed Location - Retry"}
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
