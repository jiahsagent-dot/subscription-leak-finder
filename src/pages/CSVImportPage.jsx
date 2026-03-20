import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, Check, Plus, ChevronLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { addSubscription } from '@/lib/firebase';
import { parseStatementCSV, downloadCSVTemplate } from '@/utils/csvParser';
import { format, addMonths } from 'date-fns';
import PremiumGate from '@/components/Layout/PremiumGate';

const CSVImportPage = () => {
  const nav = useNavigate();
  const { user, isPremium } = useAuth();
  const fileRef = useRef(null);

  const [stage,       setStage]       = useState('upload'); // upload | results | done
  const [parsing,     setParsing]     = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selected,    setSelected]    = useState({});
  const [totalRows,   setTotalRows]   = useState(0);
  const [errors,      setErrors]      = useState([]);
  const [saving,      setSaving]      = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    try {
      const { suggestions: sug, totalRows: rows, errors: errs } = await parseStatementCSV(file);
      setSuggestions(sug);
      setTotalRows(rows);
      setErrors(errs);
      // Pre-select all suggestions
      const sel = {};
      sug.forEach((s) => { sel[s.name] = true; });
      setSelected(sel);
      setStage('results');
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    setSaving(true);
    try {
      const toAdd = suggestions.filter((s) => selected[s.name]);
      await Promise.all(
        toAdd.map((sub) =>
          addSubscription(user.uid, {
            ...sub,
            amount:      sub.detectedAmt || sub.amount,
            renewalDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
          })
        )
      );
      setStage('done');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-brand-900 text-white px-4 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="p-1.5 rounded-full hover:bg-white/10">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg">CSV / Bank Import</h1>
          <p className="text-brand-300 text-xs">Upload a bank statement to detect subscriptions</p>
        </div>
      </div>

      <PremiumGate isPremium={isPremium} feature="CSV Bank Import">
        <div className="px-4 py-5">
          {stage === 'upload' && (
            <>
              <div className="bg-white rounded-2xl shadow-card p-5 mb-4 text-center">
                <Upload size={40} className="text-brand-400 mx-auto mb-3" />
                <h3 className="font-bold text-brand-900 mb-1">Upload Bank Statement</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Export a CSV from your bank (ANZ, CommBank, NAB, Westpac) and upload it. We'll scan for subscription charges.
                </p>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                <button onClick={() => fileRef.current?.click()} disabled={parsing}
                  className="w-full bg-brand-900 text-white py-3.5 rounded-xl font-semibold text-sm mb-3 disabled:opacity-60">
                  {parsing ? 'Scanning…' : 'Choose CSV File'}
                </button>
                <button onClick={downloadCSVTemplate}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm text-gray-600 font-medium">
                  <Download size={15} /> Download CSV Template
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <p className="text-sm text-blue-800 font-semibold mb-1">🔒 Your data is private</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  CSV files are processed locally in your browser. Your bank data is never uploaded to our servers.
                </p>
              </div>
            </>
          )}

          {stage === 'results' && (
            <>
              <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
                <p className="text-sm text-gray-600">
                  Scanned <strong>{totalRows}</strong> transactions · Found <strong>{suggestions.length}</strong> possible subscriptions
                </p>
              </div>

              {errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-amber-700">{errors[0]}</p>
                </div>
              )}

              {suggestions.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle size={36} className="text-gray-300 mx-auto mb-3" />
                  <p className="font-medium text-gray-600">No subscriptions detected</p>
                  <p className="text-sm text-gray-400 mt-1">Try adding them manually instead.</p>
                  <button onClick={() => nav('/subs/add')} className="mt-4 bg-brand-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    Add Manually
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Select subscriptions to add:</p>
                  <div className="space-y-2 mb-5">
                    {suggestions.map((sub) => (
                      <button key={sub.name} onClick={() => setSelected((s) => ({ ...s, [sub.name]: !s[sub.name] }))}
                        className={`w-full flex items-center justify-between bg-white rounded-xl shadow-card px-4 py-3 border-2 transition-all ${
                          selected[sub.name] ? 'border-brand-900' : 'border-transparent'
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{sub.logo}</span>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-brand-900">{sub.name}</p>
                            {sub.rawDesc && <p className="text-xs text-gray-400 truncate max-w-[160px]">{sub.rawDesc}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {sub.detectedAmt > 0 && <p className="text-sm font-bold text-brand-900">A${sub.detectedAmt.toFixed(2)}</p>}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selected[sub.name] ? 'bg-brand-900 border-brand-900' : 'border-gray-300'
                          }`}>
                            {selected[sub.name] && <Check size={12} className="text-white" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button onClick={handleImport} disabled={saving || !Object.values(selected).some(Boolean)}
                    className="w-full bg-brand-900 text-white py-4 rounded-2xl font-bold text-sm disabled:opacity-60">
                    {saving ? 'Importing…' : `Import ${Object.values(selected).filter(Boolean).length} Subscriptions`}
                  </button>
                </>
              )}
            </>
          )}

          {stage === 'done' && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Check size={30} className="text-green-600" />
              </div>
              <h3 className="font-bold text-brand-900 text-xl mb-2">Import complete!</h3>
              <p className="text-gray-500 text-sm mb-6">Your subscriptions have been added.</p>
              <button onClick={() => nav('/')} className="bg-brand-900 text-white px-8 py-3.5 rounded-xl font-semibold text-sm">
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

export default CSVImportPage;
