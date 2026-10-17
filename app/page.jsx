"use client";

import React, { useState, useMemo } from "react";
import {
  Scale,
  FileText,
  AlertOctagon,
  Download,
  BookOpen,
  Gavel,
  SlidersHorizontal,
  Eye,
  ExternalLink,
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
  Menu
} from "lucide-react";

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
  }
];

export default function FloridaProSeLitigationApp() {
  const [activeNav, setActiveNav] = useState("drafts"); // 'drafts' | 'intake' | 'matters'
  const [mobileView, setMobileView] = useState("canvas"); // 'menu' | 'canvas' | 'auditor'

  // Florida Legal AI State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "assistant",
      text: "Florida Legal AI ready. Ask about Rule 1.110(b) ultimate facts, Rule 1.130 exhibit attachment traps, or 17th Circuit deadlines."
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
    <div className="flex flex-col h-screen w-full bg-[#FDFDFD] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* 1. Global Header */}
      <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs sm:text-sm text-slate-900 block leading-tight">Florida Pro Se Legal</span>
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

      {/* 2. Mobile View Switcher (Visible strictly under 1024px) */}
      <div className="lg:hidden flex items-center justify-around bg-slate-100 border-b border-slate-200 py-1.5 px-2 shrink-0 z-10 text-xs font-medium">
        <button
          onClick={() => setMobileView("menu")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition ${
            mobileView === "menu" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500"
          }`}
        >
          <Menu className="w-3.5 h-3.5" /> Menu & Causes
        </button>
        <button
          onClick={() => setMobileView("canvas")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition ${
            mobileView === "canvas" ? "bg-white text-emerald-800 shadow-sm font-bold" : "text-slate-500"
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Document Canvas
        </button>
        <button
          onClick={() => setMobileView("auditor")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition ${
            mobileView === "auditor" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500"
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" /> Rule Auditor
        </button>
      </div>

      {/* 3. Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Column: Navigation & Case Intake */}
        <aside
          className={`w-full lg:w-64 bg-[#FAFAFA] border-r border-slate-200 flex flex-col justify-between shrink-0 overflow-y-auto ${
            mobileView === "menu" ? "flex absolute inset-0 z-10 bg-white" : "hidden lg:flex"
          }`}
        >
          <div className="p-3 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Florida Causes</span>
              {FLORIDA_CAUSES_OF_ACTION.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCauseId(c.id);
                    setMobileView("canvas");
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition ${
                    selectedCauseId === c.id
                      ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <p className="leading-tight">{c.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{c.sol}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Case Info</span>
              <div className="px-2 space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-0.5">County</label>
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Case Number</label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Legal Paper Canvas (Full width on mobile) */}
        <main
          className={`flex-1 bg-[#F1F3F5] overflow-y-auto p-3 sm:p-6 lg:p-8 flex justify-center ${
            mobileView === "canvas" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-8 lg:p-12 min-h-full font-serif text-xs leading-relaxed text-slate-900 overflow-x-auto">
            <div className="whitespace-pre-wrap break-words">{compiledComplaint}</div>
          </div>
        </main>

        {/* Right Column: Rule Auditor & Elements */}
        <aside
          className={`w-full lg:w-80 border-l border-slate-200 bg-white p-4 overflow-y-auto space-y-4 shrink-0 ${
            mobileView === "auditor" ? "block absolute inset-0 z-10 bg-white" : "hidden lg:block"
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
              {currentCause.title}
            </span>
            <p className="text-[11px] text-slate-500 leading-snug">
              <strong>Authority:</strong> {currentCause.dcaCitation}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
              Required Elements (Fla. R. Civ. P. 1.110(b))
            </span>

            {currentCause.elements.map((elem, idx) => (
              <div key={elem.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-semibold text-slate-800">
                  Element {idx + 1}: {elem.label}
                </span>
                <p className="text-[11px] text-slate-500">{elem.prompt}</p>
                <textarea
                  rows={2}
                  value={elementFacts[elem.id] || ""}
                  onChange={(e) => handleFactChange(elem.id, e.target.value)}
                  placeholder="State ultimate facts..."
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            ))}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
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
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800"
                />
              )}
            </div>
          </div>
        </aside>

        {/* Florida Legal AI Modal/Drawer */}
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
