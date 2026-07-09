'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Database, Play, AlertTriangle, Shield, Clock, Download,
  Trash2, Table, Eye, Lock, CheckCircle, XCircle, Loader2,
} from 'lucide-react';

interface QueryResult {
  rows: any[];
  fields: string[];
  rowCount: number;
  duration: number;
  error?: string;
}

interface QueryHistoryItem {
  query: string;
  timestamp: string;
  success: boolean;
  rowCount: number;
  duration: number;
}

export default function DatabaseConsolePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // PIN-based access (extra layer beyond SUPER_ADMIN role)
  const ADMIN_PIN = '9876'; // Change this or move to env

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      loadTables();
    } else {
      alert('Invalid PIN');
      setPin('');
    }
  };

  const loadTables = async () => {
    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename",
          action: 'query',
        }),
      });
      const data = await res.json();
      if (data.rows) {
        setTables(data.rows.map((r: any) => r.tablename));
      }
    } catch {}
  };

  const executeQuery = async () => {
    if (!query.trim()) return;

    // Block dangerous operations without confirmation
    const dangerous = /^\s*(DROP|TRUNCATE|DELETE\s+FROM\s+\w+\s*$|ALTER\s+TABLE.*DROP)/i;
    if (dangerous.test(query) && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setLoading(true);
    setShowConfirm(false);
    const startTime = Date.now();

    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), action: 'query' }),
      });

      const data = await res.json();
      const duration = Date.now() - startTime;

      if (data.error) {
        setResult({ rows: [], fields: [], rowCount: 0, duration, error: data.error });
        setHistory((prev) => [{ query, timestamp: new Date().toISOString(), success: false, rowCount: 0, duration }, ...prev.slice(0, 19)]);
      } else {
        setResult({ rows: data.rows || [], fields: data.fields || [], rowCount: data.rowCount || 0, duration, error: undefined });
        setHistory((prev) => [{ query, timestamp: new Date().toISOString(), success: true, rowCount: data.rowCount || 0, duration }, ...prev.slice(0, 19)]);
      }
    } catch (err) {
      setResult({ rows: [], fields: [], rowCount: 0, duration: Date.now() - startTime, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  const exportCSV = () => {
    if (!result || result.rows.length === 0) return;
    const headers = result.fields.join(',');
    const rows = result.rows.map((row) => result.fields.map((f) => JSON.stringify(row[f] ?? '')).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-result-${Date.now()}.csv`;
    a.click();
  };

  // Access control: must be SUPER_ADMIN
  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Access Denied</h2>
          <p className="text-sm text-gray-500 mt-1">Super Admin access required.</p>
        </div>
      </div>
    );
  }

  // PIN gate
  if (!authenticated) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs text-center">
          <Shield className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Database Console</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your admin PIN to access.</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full h-12 px-4 border border-gray-200 rounded-xl text-center text-lg tracking-widest font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="• • • •"
            maxLength={8}
            autoFocus
          />
          <button type="submit" className="w-full mt-4 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl">
            Unlock
          </button>
          <p className="text-xs text-gray-400 mt-4">This action is logged for security.</p>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Database Console</h1>
            <p className="text-xs text-gray-500">Direct PostgreSQL access • Handle with care</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span className="text-[11px] font-semibold text-red-700 uppercase">Production Database</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Tables */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5" /> Tables ({tables.length})
          </h3>
          <div className="space-y-1">
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => setQuery(`SELECT * FROM "${table}" LIMIT 50;`)}
                className="w-full text-left px-3 py-2 text-[12px] font-mono text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors truncate"
              >
                {table}
              </button>
            ))}
          </div>
        </div>

        {/* Main: Query Editor + Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Query Editor */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase">SQL Query</span>
              <span className="text-[10px] text-gray-400">Ctrl+Enter to execute</span>
            </div>
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-32 px-4 py-3 text-[13px] font-mono text-gray-800 resize-y focus:outline-none border-none"
              placeholder="SELECT * FROM users LIMIT 10;"
              spellCheck={false}
            />
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={executeQuery}
                  disabled={loading || !query.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-medium rounded-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Execute
                </button>
                <button onClick={() => setQuery('')} className="px-3 py-1.5 text-[12px] text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  Clear
                </button>
              </div>
              {result && (
                <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <Download className="w-3 h-3" /> Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Confirmation dialog */}
          {showConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Destructive operation detected</p>
                <p className="text-xs text-red-600 mt-1">This query will modify or delete data. Are you sure?</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={executeQuery} className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700">
                    Yes, Execute
                  </button>
                  <button onClick={() => setShowConfirm(false)} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {result.error ? (
                    <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium"><XCircle className="w-3.5 h-3.5" /> Error</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><CheckCircle className="w-3.5 h-3.5" /> Success</span>
                  )}
                  <span className="text-[11px] text-gray-400">{result.rowCount} rows • {result.duration}ms</span>
                </div>
              </div>

              {result.error ? (
                <div className="p-4">
                  <pre className="text-[12px] text-red-600 font-mono whitespace-pre-wrap">{result.error}</pre>
                </div>
              ) : result.rows.length > 0 ? (
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-[12px]">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500 border-b">#</th>
                        {result.fields.map((field) => (
                          <th key={field} className="px-3 py-2 text-left font-semibold text-gray-500 border-b whitespace-nowrap">{field}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {result.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2 text-gray-400 font-mono">{i + 1}</td>
                          {result.fields.map((field) => (
                            <td key={field} className="px-3 py-2 text-gray-700 font-mono max-w-[200px] truncate" title={String(row[field] ?? '')}>
                              {row[field] === null ? <span className="text-gray-300 italic">null</span> : String(row[field]).slice(0, 100)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-gray-400">Query executed successfully. No rows returned.</div>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Recent Queries
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(item.query)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {item.success ? <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" /> : <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                    <span className="text-[11px] font-mono text-gray-600 truncate flex-1">{item.query}</span>
                    <span className="text-[10px] text-gray-400">{item.duration}ms</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
