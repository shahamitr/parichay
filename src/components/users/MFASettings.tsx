'use client';

import { useState, useEffect } from 'react';
import {
  Smartphone,
  Shield,
  ShieldCheck,
  ShieldOff,
  Key,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  QrCode,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useToastHelpers } from '@/components/ui/Toast';
import { SectionHeader } from '@/components/ui';

interface MFAStatus {
  mfaEnabled: boolean;
  remainingBackupCodes: number;
}

export default function MFASettings() {
  const { showSuccess, showError } = useToastHelpers();
  const [status, setStatus] = useState<MFAStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupData, setSetupData] = useState<{
    qrCodeUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Fetch MFA status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/auth/mfa/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch MFA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/mfa/setup', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to setup MFA');
      const data = await res.json();
      setSetupData({ qrCodeUrl: data.qrCodeUrl, backupCodes: data.backupCodes });
    } catch (error) {
      showError('Failed to initiate secure handshake.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) return;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode }),
      });
      if (!res.ok) throw new Error('Verification failed');
      const data = await res.json();
      showSuccess('MFA Protocol Established.');
      setSetupData(null);
      setVerificationCode('');
      if (data.backupCodes) {
        setShowBackupCodes(true);
        setSetupData((prev) => prev ? { ...prev, backupCodes: data.backupCodes } : null);
      }
      fetchStatus();
    } catch (error) {
      showError('Invalid verification token.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading && !setupData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Setup flow
  if (setupData && !status?.mfaEnabled) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
        <SectionHeader
          title="Secure Handshake"
          description="Establish multi-factor authentication protocol."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          <div className="space-y-6">
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-3xl flex flex-col items-center justify-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Sync Token</span>
              {setupData.qrCodeUrl && (
                <div className="p-4 bg-white rounded-2xl shadow-xl">
                  <img src={setupData.qrCodeUrl} alt="MFA QR Code" className="w-40 h-40" />
                </div>
              )}
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest text-center leading-relaxed">
                Scan this matrix using your authorized authenticator application.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Validation Protocol</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-white text-center text-2xl tracking-[0.5em] font-black focus:border-primary-500/50 transition-all placeholder:text-neutral-900"
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="px-8 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-800 text-white rounded-2xl transition-all shadow-xl shadow-primary-500/20"
                >
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Emergency Tokens Generated</p>
                  <p className="text-[9px] font-bold text-neutral-500 uppercase leading-relaxed">
                    Store these backup codes in a secure offline vault.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSetupData(null)}
          className="mt-10 text-[9px] font-black uppercase tracking-widest text-neutral-700 hover:text-white transition-colors"
        >
          Abort Handshake
        </button>
      </div>
    );
  }

  // MFA Enabled state
  if (status?.mfaEnabled) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">Armor Protocol Active</h4>
            <p className="text-xs font-medium text-neutral-500">Multi-factor authentication is currently shielding your account.</p>
            
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{status.remainingBackupCodes} Backup Tokens Remaining</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-10">
          <button className="px-6 py-3 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">
            Rotate Backup Tokens
          </button>
          <button className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">
            Deactivate Protocol
          </button>
        </div>
      </div>
    );
  }

  // MFA Disabled state
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
      
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center text-primary-500 shadow-xl group-hover:scale-110 transition-transform">
          <Smartphone className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">Enhance Account Armor</h4>
          <p className="text-xs font-medium text-neutral-500">Add an extra layer of cryptographic protection to your system credentials.</p>
          
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="mt-8 flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-primary-500/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            Initialize MFA
          </button>
        </div>
      </div>
    </div>
  );
}
