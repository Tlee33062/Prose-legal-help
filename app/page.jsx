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
  Compass,
  ArrowRight
} from "lucide-react";

// Florida Litigation Guide: Causes of Action & Playbooks
const FLORIDA_CAUSES_OF_ACTION = [
  {
    id: "breach_contract",
    title: "Breach of Written Contract",
    dcaCitation: "Friedman v. N.Y. Life Ins. Co., 985 So. 2d 56 (Fla. 4th DCA 2008)",
    sol: "5 Years (Fla. Stat. § 95.11(2)(b))",
    elements: [
      { id: "e1", label: "Valid Contract", prompt: "A valid agreement existed between the parties." },
      { id: "e2", label: "Material Breach", prompt: "Defendant breached a specific, material provision." },
      { id: "e3", label: "Resulting Damages", prompt: "Plaintiff sustained direct, proximate pecuniary harm." }
    ],
    commonDefenses: ["Failure to Attach Instrument (Fla. R. Civ. P. 1.130)", "Statute of Frauds", "Conditions Precedent"]
  },
  {
    id: "breach_fiduciary",
    title: "Breach of Fiduciary Duty",
    dcaCitation: "Minotty v. Baudo, 42 So. 3d 824 (Fla. 4th DCA 2010); Dinuro Invs. v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(o))",
    elements: [
      { id: "e1", label: "Fiduciary Duty", prompt: "Defendant owed Plaintiff a duty of loyalty, care, or disclosure." },
      { id: "e2", label: "Breach of Duty", prompt: "Defendant engaged in self-dealing, concealment, or wrongful transfer." },
      { id: "e3", label: "Direct Injury (Dinuro Rule)", prompt: "Direct individual injury distinct from shareholder/derivative claims." }
    ],
    commonDefenses: ["Safe Harbor (§ 607.0832)", "Derivative Bar", "Business Judgment Rule"]
  },
  {
    id: "cpa_negligence",
    title: "CPA Malpractice & Record Non-Disclosure",
    dcaCitation: "Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016); F.A.C. R. 61H1-23.002",
    sol: "2 Years from Discovery (Fla. Stat. § 95.11(4)(a))",
    elements: [
      { id: "e1", label: "Standard of Care (Ch. 473)", prompt: "CPA duty under Fla. Stat. § 473 and F.A.C. 61H1 to maintain independence and deliver workpapers." },
      { id: "e2", label: "Withholding / Breach", prompt: "Withheld general ledgers or provided false records to lenders without authorization." },
      { id: "e3", label: "Commercial Injury", prompt: "Direct financial losses, lost corporate opportunities, or tax liability." }
    ],
    commonDefenses: ["Accountant-Client Privilege (§ 473.316)", "Ultramares Privity", "Safe Harbor (§ 607.0832)"]
  },
  {
    id: "civil_conspiracy",
    title: "Civil Conspiracy & Aiding/Abetting",
    dcaCitation: "SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327 (11th Cir. 2014)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(p))",
    elements: [
      { id: "e1", label: "Unlawful Agreement", prompt: "An agreement between two or more parties to commit an unlawful act." },
      { id: "e2", label: "Overt Tortious Act", prompt: "The commission of an overt act in furtherance of the conspiracy." },
      { id: "e3", label: "Proximate Injury", prompt: "Direct damages suffered as a result of acts performed under the conspiracy." }
    ],
    commonDefenses: ["Intra-Corporate Conspiracy Doctrine", "Absence of Actionable Underlying Tort"]
  }
];

export default function FloridaProSeLitigationApp() {
  // Navigation State
  const [activeNav, setActiveNav] = useState("drafts"); // 'drafts' | 'playbooks' | 'vault' | 'intake' | 'matters' | 'signatures'
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [sidebarCollapsedDesktop, setSidebarCollapsedDesktop] = useState(false);

  // Florida Legal AI State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "assistant",
      text: "Florida Legal AI active. Ask about Rule 1.110(b) ultimate facts, Rule 1.130 exhibit attachment traps, or 17th Circuit deadlines."
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Case Metadata
  const [circuit, setCircuit] = useState("17th Judicial Circuit");
  const [county, setCounty] = useState("Broward");
  const [division, setDivision] = useState("25");
  const [caseNumber, setCaseNumber] = useState("CACE-26-XXXXXX");
  const [plaintiff, setPlaintiff] = useState("Jane Doe");
  const [defendant, setDefendant] = useState("Apex Commercial Holdings LLC");

  // Pleading State
  const [selectedCauseId, setSelectedCauseId] = useState("breach_contract");
  const currentCause = useMemo(() => {
    return FLORIDA_CAUSES_OF_ACTION.find((c) => c.id === selectedCauseId) || FLORIDA_CAUSES_OF_ACTION[0];
  }, [selectedCauseId]);

  const [elementFacts, setElementFacts] = useState({
    e1: "On October 10, 2025, Plaintiff and Defendant entered into a valid, binding commercial agreement in Broward County, Florida.",
    e2: "Defendant materially breached its duties on January 15, 2026, by intentionally withholding contractually mandated ledger disbursements and required accounting records.",
    e3: "As a direct and proximate result of Defendant's material breach, Plaintiff suffered specific pecuniary damages exceeding $50,000."
  });

  const [hasExhibitAttached, setHasExhibitAttached] = useState(true);
  const [exhibitName, setExhibitName] = useState("Executed Agreement / Records Demand (Oct 10, 2025)");

  const handleFactChange = (elementId, text) => {
    setElementFacts((prev) => ({ ...prev, [elementId]: text }));
  };

  const handleSendAi = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setAiInput("");
    setAiLoading(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = "";

      if (lower.includes("four corners") || lower.includes("1.130") || lower.includes("attach") || lower.includes("exhibit")) {
        response = "Under Fla. R. Civ. P. 1.130(a), contracts or instruments sued upon MUST be attached to the complaint. Failure to attach the document allows dismissal under the Four Corners Rule.";
      } else if (lower.includes("dinuro") || lower.includes("direct") || lower.includes("fiduciary")) {
        response = "Under Dinuro Investments v. Camacho, 141 So. 3d 731, you must plead: (1) direct individual harm separate from harm to the entity, and (2) special injury or a direct duty owed to you.";
      } else if (lower.includes("rehearing") || lower.includes("1.530") || lower.includes("deadline")) {
        response = "Under Fla. R. Civ. P. 1.530(b), a Motion for Rehearing must be served within 15 days of filing. This is jurisdictional and cannot be extended.";
      } else {
        response = `Under Fla. R. Civ. P. 1.110(b), allege specific ultimate facts (who, what, when, where) rather than legal conclusions for ${currentCause.title}.`;
      }

      setAiMessages((prev) => [...prev, { sender: "assistant", text: response }]);
      setAiLoading(false);
    }, 400);
  };

  const compiledComplaint = useMemo(() => {
    return `IN THE CIRCUIT COURT OF THE ${circuit.toUpperCase()}\nIN AND FOR ${county.toUpperCase()} COUNTY, FLORIDA\n\nCASE NO.: ${caseNumber}\nCIVIL DIVISION: ${division}\n\n${plaintiff.toUpperCase()},\n    Plaintiff,\nv.\n${defendant.toUpperCase()},\n    Defendant.\n__________________________________________/\n\nVERIFIED COMPLAINT FOR DAMAGES AND DEMAND FOR JURY TRIAL\n\nPlaintiff, ${plaintiff}, pro se, sues Defendant, ${defendant}, and states:\n\nJURISDICTION AND VENUE\n1. This is an action for damages exceeding Fifty Thousand Dollars ($50,000.00), exclusive of interest, taxable costs, and attorney's fees, within the subject matter jurisdiction of this Circuit Court pursuant to Fla. Stat. § 26.012.\n2. Plaintiff is an individual residing in ${county} County, Florida.\n3. Defendant is a commercial entity operating within ${county} County, Florida, subjecting itself to personal jurisdiction under Fla. Stat. § 48.193.\n4. Venue is proper in ${county} County, Florida pursuant to Fla. Stat. § 47.011 because the cause of action accrued in this County.\n\nCOUNT I: ${currentCause.title.toUpperCase()}\n(Governing Authority: ${currentCause.dcaCitation})\n\n5. Plaintiff realleges and reincorporates Paragraphs 1 through 4 as if fully set forth herein.\n6. ULTIMATE FACT (ELEMENT 1): ${elementFacts.e1 || "[State ultimate facts establishing element 1]"}\n7. ULTIMATE FACT (ELEMENT 2): ${elementFacts.e2 || "[State ultimate facts establishing element 2]"}\n8. ULTIMATE FACT (ELEMENT 3): ${elementFacts.e3 || "[State ultimate facts establishing element 3]"}\n${hasExhibitAttached ? `9. Pursuant to Fla. R. Civ. P. 1.130(a), a true and correct copy of the ${exhibitName} is attached hereto as EXHIBIT A and incorporated herein by reference.\n10. All conditions precedent to the maintenance of this action have occurred, have been performed, or have been excused.` : "9. All conditions precedent have occurred or been waived."}\n\nWHEREFORE, Plaintiff respectfully demands judgment against Defendant for compensatory damages, prejudgment interest, post-judgment interest, taxable costs pursuant to Fla. Stat. § 57.041, reciprocal attorney's fees pursuant to Fla. Stat. § 57.105(7), and further relief as this Court deems just and proper.\n\nDEMAND FOR JURY TRIAL\nPlaintiff demands trial by jury on all issues so triable.\n\nDated: October 17, 2026.\n\nBy: ______________________________\n${plaintiff}, Pro Se\nEmail: service@allegedlylegal.com`;
  }, [circuit, county, division, caseNumber, plaintiff, defendant, currentCause, elementFacts, hasExhibitAttached, exhibitName]);

  const handleExport = () => {
    const blob = new Blob([compiledComplaint], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `COMPLAINT_${caseNumber}_Florida_ProSe.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-[#FDFDFD] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* 1. Full Enterprise Left Navigation Sidebar */}
      <aside
        className={`${
          sidebarCollapsedDesktop ? "lg:w-16" : "lg:w-64"
        } ${
          sidebarOpenMobile ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl flex" : "hidden lg:flex"
        } bg-[#FAFAFA] border-r border-slate-200 flex flex-col justify-between shrink-0 select-none transition-all duration-200`}
      >
        <div className="p-3 space-y-4 overflow-y-auto">
          {/* Workspace Switcher */}
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/50 cursor-pointer border border-transparent hover:border-slate-200 transition">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                FL
              </div>
              {!sidebarCollapsedDesktop && (
                <span className="text-xs font-semibold text-slate-800 truncate">Florida Pro Se Legal</span>
              )}
            </div>
            {!sidebarCollapsedDesktop && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </div>

          {/* New Filing Split Action */}
          {!sidebarCollapsedDesktop ? (
            <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => {
                  setActiveNav("drafts");
                  setSidebarOpenMobile(false);
                }}
                className="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                New Filing
              </button>
              <div className="w-px h-5 bg-slate-200" />
              <button className="px-2 py-1.5 hover:bg-slate-50 text-slate-400 transition">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveNav("drafts")}
              className="w-full h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {/* Section: Chats */}
          <div>
            {!sidebarCollapsedDesktop && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Chats</span>
            )}
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("drafts");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "drafts" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>History</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("drafts");
                  setSidebarOpenMobile(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-slate-600 hover:bg-slate-100 transition"
              >
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Recent</span>}
              </button>
            </div>
          </div>

          {/* Section: Work */}
          <div>
            {!sidebarCollapsedDesktop && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Work</span>
            )}
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("today");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "today" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Today</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("intake");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "intake" ? "bg-slate-200/70 text-slate-900 font-semibold border-l-2 border-slate-900" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {!sidebarCollapsedDesktop && <span>Intake</span>}
                </span>
                {!sidebarCollapsedDesktop && (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">0</span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveNav("matters");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "matters" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Matters</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("requests");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "requests" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Requests</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("signatures");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "signatures" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Signatures</span>}
              </button>
            </div>
          </div>

          {/* Section: Library */}
          <div>
            {!sidebarCollapsedDesktop && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Library</span>
            )}
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("drafts");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "drafts" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Drafts</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("vault");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "vault" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FolderLock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Vault</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("playbooks");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "playbooks" ? "bg-slate-200/70 text-slate-900 font-semibold border-l-2 border-emerald-600" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Playbooks</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("templates");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "templates" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Templates</span>}
              </button>
              <button
                onClick={() => {
                  setActiveNav("contacts");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "contacts" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsedDesktop && <span>Contacts</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Litigant Footer */}
        <div className="p-3 border-t border-slate-200 space-y-2">
          {!sidebarCollapsedDesktop && (
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
                <span>Getting Started</span>
                <span>2/6</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full w-1/3" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">Next — Verify Rule 1.130 Exhibits →</p>
            </div>
          )}

          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition">
            <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {!sidebarCollapsedDesktop && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpenMobile && (
        <div
          onClick={() => setSidebarOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
        />
      )}

      {/* 2. Main Workspace Body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-xs sm:text-sm text-slate-900 block leading-tight">
                Florida Pro Se Legal
              </span>
              <span className="text-[10px] text-slate-500 font-mono">17th Cir. (Broward)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Florida AI</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        {/* View Switcher based on activeNav */}
        {activeNav === "playbooks" ? (
          /* Playbooks Center (Florida Litigation Guide Causes of Action) */
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Florida Litigation Guide Playbooks</h2>
                <p className="text-xs text-slate-500">
                  Select a cause of action to load elements, 4th DCA case citations, and pleading standards into your active draft.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FLORIDA_CAUSES_OF_ACTION.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCauseId(c.id);
                      setActiveNav("drafts");
                    }}
                    className={`p-4 bg-white rounded-lg border cursor-pointer hover:border-emerald-600 transition shadow-sm ${
                      selectedCauseId === c.id ? "border-emerald-600 ring-2 ring-emerald-500/10" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-xs text-slate-900">{c.title}</h3>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {c.sol}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{c.dcaCitation}</p>
                    <div className="text-[11px] text-slate-600 space-y-1 mb-3">
                      {c.elements.map((e, idx) => (
                        <div key={e.id} className="flex items-start gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{e.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                        Load into Draft <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeNav === "intake" ? (
          /* Intake Hub Component */
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Case Intake & E-Portal Notices</h2>
                <p className="text-xs text-slate-400">Review incoming filings before adding them to docket matters</p>
              </div>
              <span className="text-xs font-mono text-slate-400">service@allegedlylegal.com</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Inbox className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-slate-800 mb-1">Nothing at the door</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Service filings delivered through the Florida Courts E-Filing Portal appear here as active items.
              </p>
            </div>
          </div>
        ) : (
          /* Default Drafting & Circuit Civil Pleading Studio */
          <div className="flex flex-1 overflow-hidden relative">
            {/* Middle: Document Canvas */}
            <main className="flex-1 bg-[#F1F3F5] overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
              <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-8 lg:p-12 min-h-full font-serif text-xs leading-relaxed text-slate-900">
                <div className="whitespace-pre-wrap break-words">{compiledComplaint}</div>
              </div>
            </main>

            {/* Right: Florida Fact-Pleading Auditor */}
            <aside className="w-80 border-l border-slate-200 bg-white p-4 overflow-y-auto space-y-4 shrink-0 hidden md:block">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {currentCause.title}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                  {currentCause.sol}
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Required Elements (Fla. R. Civ. P. 1.110(b))
                </span>

                {currentCause.elements.map((elem, idx) => (
                  <div key={elem.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <span className="font-semibold text-slate-800">
                      Element {idx + 1}: {elem.label}
                    </span>
                    <p className="text-[10px] text-slate-500">{elem.prompt}</p>
                    <textarea
                      rows={2}
                      value={elementFacts[elem.id] || ""}
                      onChange={(e) => handleFactChange(elem.id, e.target.value)}
                      placeholder="State ultimate facts..."
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                ))}

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={hasExhibitAttached}
                      onChange={(e) => setHasExhibitAttached(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    Rule 1.130 Exhibit Attached
                  </label>
                  {hasExhibitAttached && (
                    <input
                      type="text"
                      value={exhibitName}
                      onChange={(e) => setExhibitName(e.target.value)}
                      placeholder="Exhibit Description"
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                    />
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Slide-out Florida Legal AI Assistant Panel */}
        {aiOpen && (
          <div className="fixed sm:absolute bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-96 h-[480px] sm:h-[500px] bg-slate-900 border border-slate-700 rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Florida Legal AI</span>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {aiMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-950 border border-emerald-600/40 text-emerald-100 ml-6"
                      : "bg-slate-800 border border-slate-700 text-slate-200 mr-6"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {aiLoading && <div className="text-[11px] text-slate-400 italic">Reviewing Florida legal authorities...</div>}
            </div>

            <div className="p-2 border-t border-slate-800 bg-slate-900 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAi()}
                placeholder="Ask about Rule 1.130, Dinuro, deadlines..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendAi}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center justify-center transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
