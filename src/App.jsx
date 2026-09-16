import React, { useState, useEffect } from 'react';

const INITIAL_LEADS = [
  { id: '1', title: 'Warehouse Robotics Pilot', company: 'Apex Logistics', value: 48000, stage: 'New', color: 'border-l-blue-500' },
  { id: '2', title: 'Patient Intake Portal', company: 'Meridian Health', value: 18500, stage: 'Contacted', color: 'border-l-amber-500' },
  { id: '3', title: 'Enterprise Cloud Migration', company: 'Northwind Studios', value: 96500, stage: 'Proposal Sent', color: 'border-l-purple-500' },
  { id: '4', title: 'Automated QA Rollout', company: 'CyberPeak Corp', value: 32000, stage: 'Won', color: 'border-l-emerald-500' },
  { id: '5', title: 'Legacy Infrastructure Audit', company: 'Beacon Media', value: 7400, stage: 'Lost', color: 'border-l-rose-500' }
];

const INITIAL_QUOTES = [
  { id: 'Q-2026-001', client: 'Meridian Health', recipient: 'billing@meridianhealth.org', amount: 18500, status: 'Sent', date: 'Feb 4, 2026', type: 'Retainer' },
  { id: 'Q-2026-002', client: 'Northwind Studios', recipient: 'contact@northwind.io', amount: 96500, status: 'Draft', date: 'Feb 1, 2026', type: 'Fixed' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('quotient_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });
  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('quotient_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [newQuoteClient, setNewQuoteClient] = useState('');
  const [newQuoteEmail, setNewQuoteEmail] = useState('');
  const [newQuoteAmount, setNewQuoteAmount] = useState('');
  const [isRetainer, setIsRetainer] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [activeQuoteModal, setActiveQuoteModal] = useState(null);

  useEffect(() => {
    localStorage.setItem('quotient_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('quotient_quotes', JSON.stringify(quotes));
  }, [quotes]);

  const totalValue = leads.reduce((sum, l) => l.stage !== 'Lost' ? sum + Number(l.value) : sum, 0);

  const handleAddQuote = (e) => {
    e.preventDefault();
    if (!newQuoteClient || !newQuoteAmount) return;
    const item = {
      id: `Q-2026-00${quotes.length + 1}`,
      client: newQuoteClient,
      recipient: newQuoteEmail || 'accounts@client.com',
      amount: Number(newQuoteAmount),
      status: 'Draft',
      date: 'Today',
      type: isRetainer ? 'Retainer' : 'Fixed'
    };
    setQuotes([item, ...quotes]);
    setNewQuoteClient('');
    setNewQuoteEmail('');
    setNewQuoteAmount('');
    setActiveTab('quotes');
  };

  const triggerSendQuote = (quote) => {
    setActiveQuoteModal(quote);
    setShowEmailModal(true);
  };

  const confirmSendQuote = () => {
    if (!activeQuoteModal) return;
    setQuotes(quotes.map(q => q.id === activeQuoteModal.id ? { ...q, status: 'Sent' } : q));
    setShowEmailModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080c14] text-slate-100">
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d1322] border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">Q</div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-none">Quotient</h1>
            <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">LEAD & QUOTES</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setActiveTab('quotes'); setMobileMenuOpen(false); }} className="px-3 py-1.5 bg-emerald-500 text-white font-medium text-xs rounded-lg shadow-sm">
            + Quote
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex md:w-64 bg-[#0d1322] border-r border-slate-800/80 flex-col justify-between p-4 fixed md:sticky top-0 h-full md:h-screen z-50`}>
        <div>
          <div className="hidden md:flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-emerald-500/25">Q</div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-tight">Quotient</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">LEAD & QUOTES</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
              { id: 'pipeline', label: 'Leads Pipeline', icon: 'fa-diagram-project' },
              { id: 'quotes', label: 'Quotation Builder', icon: 'fa-file-invoice-dollar' },
              { id: 'clients', label: 'Clients', icon: 'fa-users' },
              { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <i className={`fa-solid ${tab.icon} w-4 text-center`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-emerald-500/20">E</div>
          <div className="truncate text-xs">
            <p className="font-semibold text-white truncate">Ellis</p>
            <p className="text-slate-400 text-[10px] truncate">leadpulsequote.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">OVERVIEW</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              {activeTab === 'dashboard' && 'Good day, Ellis.'}
              {activeTab === 'pipeline' && 'Leads Pipeline'}
              {activeTab === 'quotes' && 'Quotation Builder'}
              {activeTab === 'clients' && 'Clients Directory'}
              {activeTab === 'settings' && 'Workspace Settings'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'dashboard' && "Here's what's moving in your pipeline today."}
              {activeTab === 'pipeline' && 'Monitor and move opportunities through your active pipeline.'}
              {activeTab === 'quotes' && 'Generate proposals, manage retainers, and track client delivery.'}
              {activeTab === 'clients' && 'Directory of all active customer contacts.'}
              {activeTab === 'settings' && 'Workspace parameters and production deployment details.'}
            </p>
          </div>
          <button onClick={() => setActiveTab('quotes')} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition">
            <i className="fa-solid fa-plus text-xs"></i> New Quote
          </button>
        </header>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                  <span>TOTAL PIPELINE VALUE</span>
                  <i className="fa-solid fa-dollar-sign text-emerald-400"></i>
                </div>
                <p className="text-2xl font-black text-white mt-2">${totalValue.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-1">Across 4 open opportunities</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                  <span>ACTIVE QUOTES</span>
                  <i className="fa-solid fa-file-invoice text-blue-400"></i>
                </div>
                <p className="text-2xl font-black text-white mt-2">{quotes.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">{quotes.filter(q=>q.status==='Sent').length} sent · {quotes.filter(q=>q.status==='Draft').length} draft</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                  <span>CONVERSION RATE</span>
                  <i className="fa-solid fa-arrow-trend-up text-purple-400"></i>
                </div>
                <p className="text-2xl font-black text-white mt-2">50%</p>
                <p className="text-[11px] text-slate-400 mt-1">Won vs. decided leads</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                  <span>CLIENTS</span>
                  <i className="fa-solid fa-users text-amber-400"></i>
                </div>
                <p className="text-2xl font-black text-white mt-2">3</p>
                <p className="text-[11px] text-slate-400 mt-1">Active in directory</p>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Pipeline Distribution</h3>
                  <p className="text-[11px] text-slate-400">Value across stages</p>
                </div>
                <button onClick={() => setActiveTab('pipeline')} className="text-xs text-emerald-400 hover:underline">Open pipeline →</button>
              </div>
              <div className="space-y-3.5 text-xs">
                {[
                  { name: 'New', color: 'bg-blue-500', text: 'text-blue-400' },
                  { name: 'Contacted', color: 'bg-amber-500', text: 'text-amber-400' },
                  { name: 'Proposal Sent', color: 'bg-purple-500', text: 'text-purple-400' },
                  { name: 'Won', color: 'bg-emerald-500', text: 'text-emerald-400' },
                  { name: 'Lost', color: 'bg-rose-500', text: 'text-rose-400' }
                ].map(stage => {
                  const stageTotal = leads.filter(l => l.stage === stage.name).reduce((sum, item) => sum + Number(item.value), 0);
                  const count = leads.filter(l => l.stage === stage.name).length;
                  return (
                    <div key={stage.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-semibold ${stage.text} flex items-center gap-1.5`}>
                          <span className={`w-2 h-2 rounded-full ${stage.color}`}></span> {stage.name} ({count} lead{count === 1 ? '' : 's'})
                        </span>
                        <span className="font-bold text-slate-200">${stageTotal.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${stage.color}`} style={{ width: `${Math.min((stageTotal / 100000) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
              <h3 className="font-bold text-sm text-white mb-1">Activity Log</h3>
              <p className="text-[11px] text-slate-400 mb-4">Recent events</p>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0"></span>
                  <div>
                    <p className="text-slate-200 font-medium">Quote Q-2026-001 sent to Meridian Health.</p>
                    <p className="text-slate-500 text-[10px]">Feb 4, 2026</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0"></span>
                  <div>
                    <p className="text-slate-200 font-medium">New lead Warehouse Robotics Pilot added.</p>
                    <p className="text-slate-500 text-[10px]">Feb 3, 2026</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0"></span>
                  <div>
                    <p className="text-slate-200 font-medium">Automated QA Rollout moved to Won.</p>
                    <p className="text-slate-500 text-[10px]">Jan 30, 2026</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {['New', 'Contacted', 'Proposal Sent', 'Won', 'Lost'].map(stage => (
              <div key={stage} className="bg-[#0f172a] border border-slate-800 rounded-xl p-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stage}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {leads.filter(l => l.stage === stage).length}
                  </span>
                </div>
                <div className="space-y-2">
                  {leads.filter(l => l.stage === stage).map(lead => (
                    <div key={lead.id} className={`p-3 bg-slate-800/80 rounded-lg border-l-2 ${lead.color} border-y border-r border-slate-700/60 space-y-1.5`}>
                      <p className="text-xs font-bold text-white">{lead.title}</p>
                      <p className="text-[11px] text-slate-400">{lead.company}</p>
                      <p className="text-xs font-black text-emerald-400">${lead.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: QUOTES */}
        {activeTab === 'quotes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">Create Quotation</h3>
              <form onSubmit={handleAddQuote} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">Client / Company Name</label>
                  <input required type="text" value={newQuoteClient} onChange={e => setNewQuoteClient(e.target.value)} placeholder="e.g. Acme Corp" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Recipient Email</label>
                  <input type="email" value={newQuoteEmail} onChange={e => setNewQuoteEmail(e.target.value)} placeholder="billing@acme.com" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Quote Value ($ USD)</label>
                  <input required type="number" value={newQuoteAmount} onChange={e => setNewQuoteAmount(e.target.value)} placeholder="18500" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <input type="checkbox" id="ret" checked={isRetainer} onChange={e => setIsRetainer(e.target.checked)} className="w-4 h-4 text-emerald-500 rounded bg-slate-700 border-slate-600" />
                  <label htmlFor="ret" className="text-slate-300 font-medium cursor-pointer">Monthly Recurring Retainer</label>
                </div>
                <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition">Save Quotation Draft</button>
              </form>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">Issued Quotations</h3>
              <div className="space-y-3 text-xs">
                {quotes.map(q => (
                  <div key={q.id} className="p-3 bg-slate-800/70 rounded-lg border border-slate-700/60 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-white">{q.client}</p>
                        <p className="text-[10px] text-slate-400">{q.id} · {q.type}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.status === 'Sent' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'}`}>{q.status}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                      <span className="font-black text-emerald-400">${q.amount.toLocaleString()}</span>
                      <button onClick={() => triggerSendQuote(q)} className="px-2.5 py-1 bg-slate-700 hover:bg-emerald-500 hover:text-white rounded text-[11px] transition">
                        <i className="fa-solid fa-paper-plane mr-1"></i> Send
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLIENTS */}
        {activeTab === 'clients' && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
            <h3 className="font-bold text-sm text-white mb-4">Client Accounts</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-800/70 rounded-lg flex justify-between items-center border border-slate-700/50">
                <div><p className="font-bold text-white text-sm">Meridian Health</p><p className="text-slate-400 text-[11px]">billing@meridianhealth.org</p></div>
                <span className="text-emerald-400 font-bold">$18,500 Retainer</span>
              </div>
              <div className="p-3.5 bg-slate-800/70 rounded-lg flex justify-between items-center border border-slate-700/50">
                <div><p className="font-bold text-white text-sm">Northwind Studios</p><p className="text-slate-400 text-[11px]">contact@northwind.io</p></div>
                <span className="text-emerald-400 font-bold">$96,500 Deal</span>
              </div>
              <div className="p-3.5 bg-slate-800/70 rounded-lg flex justify-between items-center border border-slate-700/50">
                <div><p className="font-bold text-white text-sm">Apex Logistics</p><p className="text-slate-400 text-[11px]">ops@apexlogistics.com</p></div>
                <span className="text-slate-300 font-bold">$48,000 Pipeline</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 max-w-xl space-y-3 text-xs">
            <h3 className="font-bold text-sm text-white mb-3">Settings & Deployment</h3>
            <p><span className="text-slate-400">Custom Domain:</span> leadpulsequote.com</p>
            <p><span className="text-slate-400">Admin Account:</span> Ellis</p>
            <p><span className="text-slate-400">Storage Engine:</span> Browser LocalStorage (`quotient_leads`, `quotient_quotes`)</p>
            <button onClick={() => { localStorage.clear(); location.reload(); }} className="mt-4 px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded font-medium hover:bg-rose-500/30 transition">
              Reset Demo Data
            </button>
          </div>
        )}
      </main>

      {/* Dispatch Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Dispatch Quotation</h3>
            <p className="text-xs text-slate-300">Deliver proposal link and retainer agreement to <strong className="text-white">{activeQuoteModal?.recipient}</strong>?</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowEmailModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg">Cancel</button>
              <button onClick={confirmSendQuote} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg">Send Quote</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
