'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  FEATURE_REGISTRY,
  CATEGORY_LABELS,
  getFeaturesByCategory,
  isFeatureAvailableOnPlan,
  FeatureTier,
} from '@/lib/feature-registry';
import {
  Layout, Info, Briefcase, Mail, Clock, Image, Video, Users, IdCard,
  FileText, TrendingUp, Calendar, Tag, CreditCard, Zap, Star, Quote,
  MessageCircle, Shield, Award, Folder, User, BarChart, HelpCircle,
  MapPin, ShoppingBag, Mic, Lock, Check, Loader2,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  layout: Layout, info: Info, briefcase: Briefcase, mail: Mail,
  clock: Clock, image: Image, video: Video, users: Users,
  'id-card': IdCard, 'file-text': FileText, 'trending-up': TrendingUp,
  calendar: Calendar, tag: Tag, 'credit-card': CreditCard, zap: Zap,
  star: Star, quote: Quote, 'message-circle': MessageCircle,
  shield: Shield, award: Award, folder: Folder, user: User,
  'bar-chart': BarChart, 'help-circle': HelpCircle, 'map-pin': MapPin,
  'shopping-bag': ShoppingBag, mic: Mic,
};

export default function FeaturesPage() {
  const { user } = useAuth();
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [branchId, setBranchId] = useState('');
  const [currentTier] = useState<FeatureTier>('starter'); // TODO: fetch from subscription
  const featuresByCategory = getFeaturesByCategory();

  useEffect(() => {
    // Load current section config from the user's branch
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/branches?brandId=' + (user?.brandId || ''), { credentials: 'include' });
      if (res.ok) {
        const branches = await res.json();
        if (branches.length > 0) {
          const branch = branches[0];
          setBranchId(branch.id);
          const config = branch.micrositeConfig as any;
          const sections = config?.sections || {};
          const enabled: Record<string, boolean> = {};
          // Extract enabled state from config
          for (const key of Object.keys(sections)) {
            enabled[key] = sections[key]?.enabled ?? false;
          }
          // Also check sectionOrder if it exists
          if (config?.sectionOrder) {
            for (const item of config.sectionOrder) {
              enabled[item.id] = item.enabled;
            }
          }
          setEnabledFeatures(enabled);
        }
      }
    } catch {}
  };

  const toggleFeature = (featureId: string) => {
    if (!isFeatureAvailableOnPlan(featureId, currentTier)) return;
    setEnabledFeatures((prev) => ({ ...prev, [featureId]: !prev[featureId] }));
  };

  const saveConfig = async () => {
    if (!branchId) return;
    setSaving(true);
    try {
      // Build sectionOrder from toggle states
      const sectionOrder = FEATURE_REGISTRY.map((f) => ({
        id: f.id,
        enabled: enabledFeatures[f.id] ?? f.defaultEnabled,
      }));

      await fetch(`/api/branches/${branchId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionOrder }),
      });
    } catch {}
    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Toggles</h1>
          <p className="text-gray-500 mt-1 text-sm">Enable or disable sections on your microsite. Changes apply instantly.</p>
        </div>
        <button
          onClick={saveConfig}
          disabled={saving}
          className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Tier badge */}
      <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl inline-flex items-center gap-2">
        <span className="text-xs font-semibold text-indigo-700 uppercase">Your Plan: {currentTier}</span>
      </div>

      {/* Feature Categories */}
      {Object.entries(featuresByCategory).map(([category, features]) => {
        const catInfo = CATEGORY_LABELS[category];
        return (
          <div key={category} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{catInfo?.label || category}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{catInfo?.description}</p>
            </div>
            <div className="divide-y divide-gray-50">
              {features.map((feature) => {
                const isLocked = !isFeatureAvailableOnPlan(feature.id, currentTier);
                const isEnabled = enabledFeatures[feature.id] ?? feature.defaultEnabled;
                const IconComponent = ICON_MAP[feature.icon] || Layout;

                return (
                  <div
                    key={feature.id}
                    className={`flex items-center justify-between px-6 py-4 ${isLocked ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                          {feature.tier !== 'free' && (
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{feature.tier}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                      </div>
                    </div>

                    {isLocked ? (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Lock className="w-3 h-3" /> Upgrade
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${isEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                        aria-label={`Toggle ${feature.name}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
