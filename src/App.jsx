import React, { useState, useEffect } from 'react';

const INITIAL_CLIENTS = [
  { id: 'c1', name: 'Meridian Health', email: 'billing@meridianhealth.org', phone: '+1 555-0192', totalValue: 18500, type: 'Retainer' },
  { id: 'c2', name: 'Northwind Studios', email: 'contact@northwind.io', phone: '+1 555-0144', totalValue: 96500, type: 'Deal' },
  { id: 'c3', name: 'Apex Logistics', email: 'ops@apexlogistics.com', phone: '+1 555-0187', totalValue: 48000, type: 'Pipeline' }
];

const INITIAL_LEADS = [
  { id: '1', title: 'Warehouse Robotics Pilot', company: 'Apex Logistics', value: 48000, stage: 'New', color: 'border-l-blue-500' },
  { id: '2', title: 'Patient Intake Portal', company: 'Meridian Health', value: 18500, stage: 'Contacted', color: 'border-l-amber-500' },
  { id: '3', title: 'Enterprise Cloud Migration', company: 'Northwind Studios', value: 96500, stage: 'Proposal Sent', color: 'border-l-purple-500' },
  { id: '4', title: 'Automated QA Rollout', company: 'CyberPeak Corp', value: 32000, stage: 'Won', color: 'border-l-emerald-500' }
];

const INITIAL_QUOTES = [
  { id: 'Q-2026-001', client: 'Meridian Health', recipient: 'billing@meridianhealth.org', amount: 18500, status: 'Sent', date: 'Feb 4, 2026', type: 'Retainer' },
  { id: 'Q-2026-002', client: 'Northwind Studios', recipient: 'contact@northwind.io', amount: 96500, status: 'Draft', date: 'Feb 1, 2026', type: 'Fixed' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Corporate Brand Identity
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('lq_company_name') || 'LeadPulse Quote');
  const [companyEmail, setCompanyEmail] = useState(() => localStorage.getItem('lq_company_email') || 'support@leadpulsequote.com');
  const [savedToast, setSavedToast] = useState(false);

  // Active Legal/Info Modal ('about', 'privacy', 'terms', or null)
  const [legalModal, setLegalModal] = useState(null);

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('quotient_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('quotient_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('quotient_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  // Modal States
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientType, setNewClientType] = useState('Deal');

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadTitle, setLeadTitle] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadValue, setLeadValue] = useState('');
  const [leadStage, setLeadStage] = useState('New');

  const [newQuoteClient, setNewQuoteClient] = useState('');
  const [newQuoteEmail, setNewQuoteEmail] = useState('');
  const [newQuoteAmount, setNewQuoteAmount] = useState('');
  const [isRetainer, setIsRetainer] = useState(true);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [activeQuoteModal, setActiveQuoteModal] = useState(null);

  useEffect(() => {
    localStorage.setItem('lq_company_name', companyName);
    localStorage.setItem('lq_company_email', companyEmail);
  }, [companyName, companyEmail]);

  useEffect(() => {
    localStorage.setItem('quotient_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('quotient_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('quotient_quotes', JSON.stringify(quotes));
  }, [quotes]);

  const totalValue = leads.reduce((sum, l) => l.stage !== 'Lost' ? sum + Number(l.value) : sum, 0);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('lq_company_name', companyName);
    localStorage.setItem('lq_company_email', companyEmail);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClientName) return;
    const client = {
      id: `c_${Date.now()}`,
      name: newClientName,
      email: newClientEmail || 'contact@client.com',
      phone: newClientPhone || '—',
      totalValue: 0,
      type: newClientType
    };
    setClients([client, ...clients]);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setShowAddClientModal(false);
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!leadTitle || !leadCompany || !leadValue) return;
    const stageColors = {
      'New': 'border-l-blue-500',
      'Contacted': 'border-l-amber-500',
      'Proposal Sent': 'border-l-purple-500',
      'Won': 'border-l-emerald-500',
      'Lost': 'border-l-rose-500'
    };
    const lead = {
      id: `lead_${Date.now()}`,
      title: leadTitle,
      company: leadCompany,
      value: Number(leadValue),
      stage: leadStage,
      color: stageColors[leadStage] || 'border-l-blue-500'
    };
    setLeads([lead, ...leads]);

    if (!clients.some(c => c.name.toLowerCase() === leadCompany.toLowerCase())) {
      setClients(prev => [{
        id: `c_${Date.now()}`,
        name: leadCompany,
        email: 'ops@' + leadCompany.toLowerCase().replace(/\s+/g, '') + '.com',
        phone: '—',
        totalValue: Number(leadValue),
        type: 'Pipeline'
      }, ...prev]);
    }

    setLeadTitle('');
    setLeadCompany('');
    setLeadValue('');
    setShowAddLeadModal(false);
  };

  const handleAddQuote = (e) => {
    e.preventDefault();
    if (!newQuoteClient || !newQuoteAmount) return;
    const val = Number(newQuoteAmount);
    const item = {
      id: `Q-2026-00${quotes.length + 1}`,
      client: newQuoteClient,
      recipient: newQuoteEmail || 'billing@' + newQuoteClient.toLowerCase().replace(/\s+/g, '') + '.com',
      amount: val,
      status: 'Draft',
      date: 'Today',
      type: isRetainer ? 'Retainer' : 'Fixed'
    };
    setQuotes([item, ...quotes]);

    if (!clients.some(c => c.name.toLowerCase() === newQuoteClient.toLowerCase())) {
      setClients(prev => [{
        id: `c_${Date.now()}`,
        name: newQuoteClient,
        email: item.recipient,
        phone: '—',
        totalValue: val,
        type: isRetainer ? 'Retainer' : 'Deal'
      }, ...prev]);
    }

    setLeads(prev => [{
      id: `lead_${Date.now()}`,
      title: `${newQuoteClient} ${isRetainer ? 'Retainer' : 'Contract'}`,
      company: newQuoteClient,
      value: val,
      stage: 'Proposal Sent',
      color: 'border-l-purple-500'
    }, ...prev]);

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
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">LP</div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-none">{companyName}</h1>
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
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-emerald-500/25">LP</div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-tight">{companyName}</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">CRM SUITE</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
              { id: 'pipeline', label: 'Leads Pipeline', icon: 'fa-diagram-project' },
              { id: 'quotes', label: 'Quotation Builder', icon: 'fa-file-invoice-dollar' },
              { id: 'clients', label: 'Clients', icon: 'fa-users' },
              { id: 'settings', label: 'Settings & Legal', icon: 'fa-gear' }
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

        {/* Corporate Identity & Legal Links */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-emerald-500/20">
              <i className="fa-solid fa-building text-xs"></i>
            </div>
            <div className="truncate text-xs">
              <p className="font-semibold text-white truncate">{companyName}</p>
              <p className="text-slate-400 text-[10px] truncate">{companyEmail}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
            <button onClick={() => setLegalModal('about')} className="hover:text-emerald-400">About Us</button>
            <span>·</span>
            <button onClick={() => setLegalModal('privacy')} className="hover:text-emerald-400">Privacy</button>
            <span>·</span>
            <button onClick={() => setLegalModal('terms')} className="hover:text-emerald-400">Terms</button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">OVERVIEW</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              {activeTab === 'dashboard' && `Welcome to ${companyName}`}
              {activeTab === 'pipeline' && 'Leads Pipeline'}
              {activeTab === 'quotes' && 'Quotation Builder'}
              {activeTab === 'clients' && 'Clients Directory'}
              {activeTab === 'settings' && 'Workspace & Organization Settings'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'dashboard' && "Commercial sales funnel and pipeline distribution status."}
              {activeTab === 'pipeline' && 'Monitor and move opportunities through active deal stages.'}
              {activeTab === 'quotes' && 'Generate proposals, manage retainers, and dispatch client agreements.'}
              {activeTab === 'clients' && 'Directory of all active customer accounts.'}
              {activeTab === 'settings' && 'Platform parameters, corporate details, and compliance policies.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'pipeline' && (
              <button onClick={() => setShowAddLeadModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                <i className="fa-solid fa-plus text-xs"></i> Add Lead
              </button>
            )}
            {activeTab === 'clients' && (
              <button onClick={() => setShowAddClientModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition">
                <i className="fa-solid fa-user-plus text-xs"></i> Add Client
              </button>
            )}
            <button onClick={() => setActiveTab('quotes')} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition">
              <i className="fa-solid fa-plus text-xs"></i> New Quote
            </button>
          </div>
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
                <p className="text-[11px] text-slate-400 mt-1">Across {leads.filter(l => l.stage !== 'Lost').length} active opportunities</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                  <span>ACTIVE QUOTES</span>
                  <i className="fa-solid fa-file-invoice text-blue-400"></i>
                </div>
                <p className="text-2xl font-black text-white mt-2">{quotes.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">{quotes.filter(q => q.status === 'Sent').length} sent · {quotes.filter(q => q.status === 'Draft').length} draft</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                  <span>CONVERSION RATE</span>
                  <i className="fa-solid fa-arrow-trend-up text-purple-400"></i>
                </div>
                <p className="text-2xl font-black text-white mt-2">
                  {leads.filter(l => l.stage === 'Won').length > 0
                    ? Math.round((leads.filter(l => l.stage === 'Won').length / Math.max(1, leads.filter(l => ['Won', 'Lost'].includes(l.stage)).length)) * 100)
                    : 50}%
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Won vs. decided leads</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                  <span>CLIENTS</span>
                  <i className="fa-solid fa-users text-amber-400"></i>
                </div>
                <p className="text-2xl font-black text-white mt-2">{clients.length}</p>
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
                        <div className={`h-full rounded-full ${stage.color}`} style={{ width: `${Math.min((stageTotal / 150000) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">{leads.length} total leads tracked</p>
              <button onClick={() => setShowAddLeadModal(true)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5">
                <i className="fa-solid fa-plus text-xs"></i> New Lead
              </button>
            </div>
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
                        <p className="text-xs font-black text-emerald-400">${Number(lead.value).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                  <input required type="text" value={newQuoteClient} onChange={e => setNewQuoteClient(e.target.value)} placeholder="e.g. Apex Dynamics" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Recipient Email</label>
                  <input type="email" value={newQuoteEmail} onChange={e => setNewQuoteEmail(e.target.value)} placeholder="finance@apexdynamics.com" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Quote Value ($ USD)</label>
                  <input required type="number" value={newQuoteAmount} onChange={e => setNewQuoteAmount(e.target.value)} placeholder="25000" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
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
                      <span className="font-black text-emerald-400">${Number(q.amount).toLocaleString()}</span>
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-sm text-white">Client Accounts</h3>
                <p className="text-[11px] text-slate-400">Total {clients.length} active client profiles</p>
              </div>
              <button onClick={() => setShowAddClientModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition">
                <i className="fa-solid fa-user-plus text-xs"></i> Add Client
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {clients.map(client => (
                <div key={client.id} className="p-3.5 bg-slate-800/70 rounded-lg flex justify-between items-center border border-slate-700/50 hover:border-slate-600 transition">
                  <div>
                    <p className="font-bold text-white text-sm">{client.name}</p>
                    <p className="text-slate-400 text-[11px]">{client.email} · {client.phone}</p>
                  </div>
                  <span className="text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {client.totalValue ? `$${Number(client.totalValue).toLocaleString()} ` : ''}{client.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS & POLICIES */}
        {activeTab === 'settings' && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 max-w-xl space-y-6 text-xs">
            <div>
              <h3 className="font-bold text-sm text-white">Company Identity & Organization</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">Corporate configuration displayed on client quotes, proposal links, and platform headers.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company / Platform Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="LeadPulse Quote"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official Support / Dispatch Email</label>
                <input
                  type="email"
                  required
                  value={companyEmail}
                  onChange={e => setCompanyEmail(e.target.value)}
                  placeholder="support@leadpulsequote.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-floppy-disk"></i> Save Organization Details
                </button>
                {savedToast && (
                  <span className="text-emerald-400 font-medium text-xs flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> Organization updated!
                  </span>
                )}
              </div>
            </form>

            {/* Essential Policies & Documentation Section */}
            <div className="space-y-3 p-4 bg-slate-800/30 rounded-xl border border-slate-800">
              <h4 className="font-semibold text-white text-xs">Essential Company Pages & Policies</h4>
              <p className="text-slate-400 text-[11px]">Review full public documentation and terms applicable to all client deals.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => setLegalModal('about')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-circle-info text-blue-400"></i> About Us
                </button>
                <button
                  onClick={() => setLegalModal('privacy')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-shield-halved text-emerald-400"></i> Privacy Policy
                </button>
                <button
                  onClick={() => setLegalModal('terms')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-scale-balanced text-amber-400"></i> Terms & Conditions
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p><span className="text-slate-400">Domain:</span> leadpulsequote.com</p>
              <p><span className="text-slate-400">System Architecture:</span> Zero-Database Client Persistence (`lq_company_name`, `quotient_quotes`)</p>
            </div>

            <button onClick={() => { localStorage.clear(); location.reload(); }} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded font-medium hover:bg-rose-500/30 transition">
              Reset Demo Data
            </button>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD CLIENT MODAL */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Add New Client</h3>
              <button onClick={() => setShowAddClientModal(false)} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Company / Client Name</label>
                <input required type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)} placeholder="e.g. Apex Global" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Email Address</label>
                <input type="email" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} placeholder="contact@apexglobal.com" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Phone</label>
                <input type="text" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} placeholder="+1 555-0100" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Account Relationship</label>
                <select value={newClientType} onChange={e => setNewClientType(e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white">
                  <option value="Deal">Active Deal</option>
                  <option value="Retainer">Monthly Retainer</option>
                  <option value="Pipeline">Pipeline Prospect</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddClientModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD LEAD MODAL */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Add Pipeline Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Opportunity Title</label>
                <input required type="text" value={leadTitle} onChange={e => setLeadTitle(e.target.value)} placeholder="e.g. ERP Migration" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Company Name</label>
                <input required type="text" value={leadCompany} onChange={e => setLeadCompany(e.target.value)} placeholder="e.g. Apex Logistics" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Estimated Value ($ USD)</label>
                <input required type="number" value={leadValue} onChange={e => setLeadValue(e.target.value)} placeholder="35000" className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Pipeline Stage</label>
                <select value={leadStage} onChange={e => setLeadStage(e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg">Add to Funnel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DISPATCH MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Dispatch Quotation</h3>
            <p className="text-xs text-slate-300">
              Deliver proposal link and retainer agreement from <strong className="text-emerald-400">{companyEmail}</strong> to <strong className="text-white">{activeQuoteModal?.recipient}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowEmailModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg">Cancel</button>
              <button onClick={confirmSendQuote} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg">Send Quote</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ABOUT US, PRIVACY POLICY, TERMS OF SERVICE */}
      {legalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {legalModal === 'about' && `About ${companyName}`}
                {legalModal === 'privacy' && 'Privacy Policy'}
                {legalModal === 'terms' && 'Terms and Conditions'}
              </h3>
              <button onClick={() => setLegalModal(null)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {legalModal === 'about' && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p><strong>{companyName}</strong> is an enterprise quotation and pipeline acceleration platform built to simplify commercial deal flow, recurring retainer management, and client onboarding.</p>
                <p>Our infrastructure empowers modern sales organizations and consultancies to issue binding proposals, synchronize client directories, and track high-value conversion funnels with zero overhead.</p>
                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 mt-3">
                  <p className="font-semibold text-white">Official Contact & Inquiries</p>
                  <p className="text-slate-400 mt-0.5">Email: {companyEmail}</p>
                  <p className="text-slate-400">Platform: leadpulsequote.com</p>
                </div>
              </div>
            )}

            {legalModal === 'privacy' && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="text-slate-400">Last updated: 2026</p>
                <p>At <strong>{companyName}</strong>, accessible from <strong>leadpulsequote.com</strong>, we prioritize the privacy and confidentiality of our commercial partners.</p>
                <h4 className="font-bold text-white mt-2">1. Data Storage & Local Persistence</h4>
                <p>This application utilizes secure, client-side browser caching (LocalStorage) to store workspace pipeline leads, quotation drafts, and directory records. Your confidential commercial rates and financial metrics remain private to your browser environment.</p>
                <h4 className="font-bold text-white mt-2">2. Communication & Quotation Dispatches</h4>
                <p>When sending proposals to client recipients, data is processed strictly for the purpose of agreement fulfillment and invoice generation. We never sell, lease, or monetize customer contacts.</p>
                <h4 className="font-bold text-white mt-2">3. Contact</h4>
                <p>For inquiries regarding our compliance or data protection policies, please reach out directly to <strong>{companyEmail}</strong>.</p>
              </div>
            )}

            {legalModal === 'terms' && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="text-slate-400">Last updated: 2026</p>
                <h4 className="font-bold text-white">1. Acceptance of Terms</h4>
                <p>By accessing or utilizing services provided on <strong>leadpulsequote.com</strong>, you agree to comply with and be bound by these commercial operating terms.</p>
                <h4 className="font-bold text-white mt-2">2. Commercial Quotations & Proposals</h4>
                <p>Quotations, recurring retainer estimates, and milestone deliverables created through {companyName} represent commercial offers between the issuing entity and named clients. Final legal execution requires mutual countersignatures.</p>
                <h4 className="font-bold text-white mt-2">3. Service Availability</h4>
                <p>{companyName} is provided "as is" with high-availability cloud infrastructure designed for continuous uptime and verified SSL security.</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
