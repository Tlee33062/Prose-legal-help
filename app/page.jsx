"use client";

import React, { useState, useMemo } from "react";
import {
  Scale,
  FileText,
  AlertOctagon,
  Download,
  BookOpen,
  Gavel,
  Eye,
  Plus,
  MessageSquare,
  Clock,
  Inbox,
  Briefcase,
  FileCheck,
  FolderLock,
  Layers,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Send,
  X,
  Menu,
  CheckCircle2,
  FileCode,
  Users,
  ShieldCheck,
  ArrowRight,
  UserCheck
} from "lucide-react";

// Profession Configuration Rules
const PROFESSION_CONFIGS = {
  attorney: {
    label: "Attorney / Law Firm",
    governingRules: "Rules Regulating Fla. Bar (Ch. 4) & Fla. Stat. § 95.11(4)(a)",
    sol: "2 Years (From conclusion of underlying proceeding)",
    privityTypes: [
      { id: "direct_retention", label: "Direct Written Retention Agreement" },
      { id: "joint_representation", label: "Joint Client Representation (Fla. Stat. § 90.502(4)(c))" },
      { id: "intended_beneficiary", label: "Intended Third-Party Beneficiary (Espinosa Standard)" }
    ],
    breachExamples: "Conflict of interest (Rule 4-1.7), unauthorized disclosures, or failure to communicate settlement offers."
  },
  cpa: {
    label: "CPA / Accounting Firm",
    governingRules: "Fla. Stat. Ch. 473 & F.A.C. R. 61H1-23.002",
    sol: "2 Years (Fla. Stat. § 95.11(4)(a) Discovery Rule)",
    privityTypes: [
      { id: "engagement_letter", label: "Engagement Letter / Client Agreement" },
      { id: "joint_tax_privity", label: "Joint Client / Equity Holder Privity (§ 473.316(4)(c))" },
      { id: "audit_reliance", label: "Direct Written Audit Reliance" }
    ],
    breachExamples: "Withholding general ledgers/tax workpapers (Rule 61H1-23.002), unauthorized lender releases, or impaired independence."
  },
  director: {
    label: "Managing Member / Corporate Director",
    governingRules: "Fla. Stat. § 605.04091 (LLC) / § 607.0830 (FBCA)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(o))",
    privityTypes: [
      { id: "operating_agreement", label: "Operating / Shareholder Agreement" },
      { id: "fiduciary_relationship", label: "Statutory Fiduciary Privity to Equity Holder" }
    ],
    breachExamples: "Self-dealing, commingling funds, diversion of opportunities, or nondisclosure to defeat § 607.0832 Safe Harbor."
  },
  vendor: {
    label: "Commercial Vendor / Contractor",
    governingRules: "Fla. Stat. § 95.11(2)(b) & Fla. Stat. § 57.105(7)",
    sol: "5 Years (Written Contract)",
    privityTypes: [
      { id: "written_contract", label: "Direct Written Commercial Contract" },
      { id: "oral_agreement", label: "Oral Agreement / Course of Dealing" }
    ],
    breachExamples: "Failure to deliver services, refusal to defend/indemnify, or non-payment."
  },
  lender: {
    label: "Lender / Financial Institution",
    governingRules: "Fla. Stat. § 687.0304 (Credit Agreements Act)",
    sol: "4-5 Years depending on instrument",
    privityTypes: [
      { id: "loan_agreement", label: "Executed Promissory Note / Security Agreement" }
    ],
    breachExamples: "Improper default acceleration, unauthorized disbursement, or breach of written loan covenants."
  }
};

export default function FloridaProSeLitigationApp() {
  const [activeNav, setActiveNav] = useState("intake"); // 'intake' | 'drafts' | 'playbooks'
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Multi-Defendant Intake State
  const [defendantsList, setDefendantsList] = useState([
    {
      id: "def-1",
      name: "Marcus Vance, CPA",
      entityName: "Vance Accounting Group P.A.",
      profession: "cpa",
      privityType: "joint_tax_privity",
      suedCapacity: "both",
      specificBreach: "Defendant intentionally withheld general ledger workpapers and delivered unauthorized financial summaries to third-party lenders.",
      dateLastAction: "2026-01-15",
      discoveryDate: "2026-02-01",
      evidence: "Formal Records Demand letter dated Jan 15, 2026; Transmitted emails",
      witnesses: "Senior Bookkeeper, Bank Lending Officer",
      otherDefendants: "Apex Commercial Holdings LLC"
    }
  ]);

  const [activeDefId, setActiveDefId] = useState("def-1");
  const selectedDef = useMemo(() => {
    return defendantsList.find(d => d.id === activeDefId) || defendantsList[0];
  }, [defendantsList, activeDefId]);

  const currentProfConfig = PROFESSION_CONFIGS[selectedDef.profession] || PROFESSION_CONFIGS.cpa;

  const handleUpdateDef = (field, val) => {
    setDefendantsList(prev => prev.map(d => d.id === selectedDef.id ? { ...d, [field]: val } : d));
  };

  const handleAddNewDefendant = () => {
    const newId = `def-${Date.now()}`;
    const newEntry = {
      id: newId,
      name: "New Defendant",
      entityName: "",
      profession: "director",
      privityType: "operating_agreement",
      suedCapacity: "both",
      specificBreach: "",
      dateLastAction: "2026-01-01",
      discoveryDate: "2026-01-01",
      evidence: "EXHIBIT A: Contract / Demand",
      witnesses: "",
      otherDefendants: ""
    };
    setDefendantsList(prev => [...prev, newEntry]);
    setActiveDefId(newId);
  };

  return (
    <div className="flex h-screen w-full bg-[#FDFDFD] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* 1. Left Navigation Sidebar */}
      <aside className="w-64 bg-[#FAFAFA] border-r border-slate-200 flex flex-col justify-between shrink-0 select-none hidden lg:flex">
        <div className="p-3 space-y-4 overflow-y-auto">
          {/* Workspace Switcher */}
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/50 cursor-pointer border border-transparent hover:border-slate-200 transition">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold">
                FL
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate">Florida Pro Se Legal</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* New Filing Split Action */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveNav("drafts")}
              className="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              New Filing
            </button>
          </div>

          {/* Section: Work */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Work</span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setActiveNav("intake")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "intake" ? "bg-slate-200/70 text-slate-900 font-semibold border-l-2 border-emerald-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-slate-500" />
                  Defendant Intake
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  {defendantsList.length}
                </span>
              </button>
              <button
                onClick={() => setActiveNav("drafts")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "drafts" ? "bg-slate-200/70 text-slate-900 font-semibold border-l-2 border-emerald-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Drafts & Pleadings
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200">
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Pleading Check</span>
            <p className="text-[11px] text-slate-700 leading-snug">
              Every defendant must have an identified privity hook and distinct breach allegations to survive Fla. R. Civ. P. 1.110(b) challenges.
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Main Stage */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-xs sm:text-sm text-slate-900">Multi-Defendant Pleading Intake</h1>
              <p className="text-[10px] text-slate-400 font-mono">Fla. R. Civ. P. Fact-Pleading & Four Corners Compliance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNewDefendant}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Defendant
            </button>
            <button
              onClick={() => setActiveNav("drafts")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg shadow-sm transition"
            >
              <FileCheck className="w-3.5 h-3.5" />
              View Complaint Draft
            </button>
          </div>
        </header>

        {/* Multi-Defendant Intake Workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Defendant Roster Panel */}
          <aside className="w-64 border-r border-slate-200 bg-[#FAFAFA] p-3 overflow-y-auto space-y-2 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block mb-2">
              Named Defendants ({defendantsList.length})
            </span>
            {defendantsList.map((def) => (
              <button
                key={def.id}
                onClick={() => setActiveDefId(def.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  activeDefId === def.id
                    ? "bg-white border-emerald-600 shadow-sm"
                    : "bg-white/60 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-900 truncate">{def.name || "Unnamed"}</span>
                  <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1 py-0.2 rounded">
                    {def.profession}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{def.entityName || "Individual Capacity"}</p>
              </button>
            ))}
          </aside>

          {/* Detailed Intake Form */}
          <main className="flex-1 bg-white p-6 sm:p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Profession Selector */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Step 1: Select Defendant Category / Profession
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentProfConfig.governingRules}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(PROFESSION_CONFIGS).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleUpdateDef("profession", key)}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        selectedDef.profession === key
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <p className="text-xs font-semibold leading-tight">{config.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Step 2: Pleading Facts & Privity Check
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Individual Full Name</label>
                    <input
                      type="text"
                      value={selectedDef.name}
                      onChange={(e) => handleUpdateDef("name", e.target.value)}
                      placeholder="e.g. John Doe, Esq. / Jane Smith, CPA"
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Professional Firm / Entity Name</label>
                    <input
                      type="text"
                      value={selectedDef.entityName}
                      onChange={(e) => handleUpdateDef("entityName", e.target.value)}
                      placeholder="e.g. Vance Legal PA / Apex Holdings LLC"
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Privity Anchor</label>
                    <select
                      value={selectedDef.privityType}
                      onChange={(e) => handleUpdateDef("privityType", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    >
                      {currentProfConfig.privityTypes.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Capacity Sued In</label>
                    <select
                      value={selectedDef.suedCapacity}
                      onChange={(e) => handleUpdateDef("suedCapacity", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    >
                      <option value="both">Both Individual & Corporate Capacity</option>
                      <option value="individual">Individual Capacity Only</option>
                      <option value="corporate">Corporate / Firm Capacity Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Date of Last Wrongful Action</label>
                    <input
                      type="date"
                      value={selectedDef.dateLastAction}
                      onChange={(e) => handleUpdateDef("dateLastAction", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Date of Discovery (Delayed Discovery Rule)
                    </label>
                    <input
                      type="date"
                      value={selectedDef.discoveryDate}
                      onChange={(e) => handleUpdateDef("discoveryDate", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Specific Breach / Tortious Ultimate Facts
                    </label>
                    <span className="text-[10px] text-slate-400 italic">No legal conclusions</span>
                  </div>
                  <textarea
                    rows={3}
                    value={selectedDef.specificBreach}
                    onChange={(e) => handleUpdateDef("specificBreach", e.target.value)}
                    placeholder={`e.g. ${currentProfConfig.breachExamples}`}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Evidence / Exhibit Attachment (Rule 1.130)
                    </label>
                    <input
                      type="text"
                      value={selectedDef.evidence}
                      onChange={(e) => handleUpdateDef("evidence", e.target.value)}
                      placeholder="EXHIBIT A: Retainer Agreement, Ledgers, Demand"
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Witnesses / Record Custodians</label>
                    <input
                      type="text"
                      value={selectedDef.witnesses}
                      onChange={(e) => handleUpdateDef("witnesses", e.target.value)}
                      placeholder="Names, firms, outside lending officers"
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Other Co-Defendants Involved (Conspiracy / Aiding & Abetting Overt Act)
                  </label>
                  <input
                    type="text"
                    value={selectedDef.otherDefendants}
                    onChange={(e) => handleUpdateDef("otherDefendants", e.target.value)}
                    placeholder="Name co-defendants who conspired or directed this action"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
