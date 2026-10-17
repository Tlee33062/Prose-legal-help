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
  Mail,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Send,
  X
} from "lucide-react";

// Florida Litigation Guide: Causes of Action
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
  // Navigation State
  const [activeNav, setActiveNav] = useState("drafts"); // 'drafts' | 'intake' | 'matters' | 'playbooks' | 'vault'
  const [intakeTab, setIntakeTab] = useState("cases"); // 'cases' | 'mail'
  const [intakeFilter, setIntakeFilter] = useState("all"); // 'all' | 'needs_you' | 'working'

  // Florida Legal AI State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "assistant",
      text: "Florida Legal AI online. Ask me about Florida fact-pleading rules (Fla. R. Civ. P. 1.110(b)), surviving Four Corners Rule dismissals (Rule 1.130), meeting the Dinuro direct injury standard, or calculating strict 15-day rehearing deadlines."
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Court Metadata
  const [circuit, setCircuit] = useState("17th Judicial Circuit");
  const [county, setCounty] = useState("Broward");
  const [division, setDivision] = useState("25");
  const [caseNumber, setCaseNumber] = useState("CACE-26-XXXXXX");
  const [plaintiff, setPlaintiff] = useState("Jane Doe");
  const [defendant, setDefendant] = useState("Apex Commercial Holdings LLC");

  // Cause of Action & Elements
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

  // Florida Legal AI Processing Engine
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
        response = "Under Fla. R. Civ. P. 1.130(a), all contracts, notes, bills of exchange, or documents sued upon MUST be attached to the complaint. On a Motion to Dismiss under Rule 1.140, the Court is strictly confined to the 'Four Corners' of the complaint and its exhibits. If you fail to attach the instrument—or fail to plead specific ultimate facts showing it is solely in the defendant's possession—the count is vulnerable to dismissal with prejudice.";
      } else if (lower.includes("dinuro") || lower.includes("direct") || lower.includes("derivative") || lower.includes("fiduciary")) {
        response = "Under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014), to bring a direct action rather than a derivative action, you must satisfy the two-prong test: (1) direct harm to the individual member that does not flow merely from company injury, and (2) special injury or a separate duty owed directly to you (e.g., deprivation of voting/inspection rights, direct buyout loss, or personal tax liability).";
      } else if (lower.includes("rehearing") || lower.includes("1.530") || lower.includes("deadline")) {
        response = "Under Fla. R. Civ. P. 1.530(b), a Motion for Rehearing must be served no later than 15 days after the date of filing of the judgment or order. Under Florida Rule of General Practice and Judicial Administration 2.514, calculate calendar days starting the day after filing. This 15-day deadline is jurisdictional and cannot be enlarged by the court under Rule 1.090(b).";
      } else if (lower.includes("safe harbor") || lower.includes("607.0832") || lower.includes("conflict")) {
        response = "Fla. Stat. § 607.0832 provides a statutory safe harbor for director conflict-of-interest transactions only if material facts were fully disclosed and approved in good faith. To neutralize a § 607.0832 defense on a Motion to Dismiss, you must plead affirmative ultimate facts showing intentional nondisclosure, self-dealing, or bad faith.";
      } else if (lower.includes("cpa") || lower.includes("accounting") || lower.includes("privilege") || lower.includes("records")) {
        response = "Under Fla. Admin. Code R. 61H1-23.002 and Fla. Stat. § 473.318, CPAs are legally required to return client records and supporting workpapers for general ledger entries upon reasonable demand. While Fla. Stat. § 473.316 protects communications, § 473.316(4)(a) explicitly waives accountant-client privilege when services were obtained to facilitate crime or fraud, or in litigation between joint clients (§ 473.316(4)(c)).";
      } else {
        response = `Under Florida law (Fla. R. Civ. P. 1.110(b)), Florida is a strict fact-pleading jurisdiction. You must plead ultimate facts establishing every single element for ${currentCause.title} rather than legal conclusions. For the 17th Judicial Circuit (Broward County Division ${division}), ensure your caption, exhibit designations (EXHIBIT A), and Rule 2.516 e-service certificates are fully set forth.`;
      }

      setAiMessages((prev) => [...prev, { sender: "assistant", text: response }]);
      setAiLoading(false);
    }, 400);
  };

  // Compile Verified Complaint Text
  const compiledComplaint = useMemo(() => {
    return `IN THE CIRCUIT COURT OF THE ${circuit.toUpperCase()}\nIN AND FOR ${county.toUpperCase()} COUNTY, FLORIDA\n\nCASE NO.: ${caseNumber}\nCIVIL DIVISION: ${division}\n\n${plaintiff.toUpperCase()},\n    Plaintiff,\nv.\n${defendant.toUpperCase()},\n    Defendant.\n__________________________________________/\n\nVERIFIED COMPLAINT FOR DAMAGES AND DEMAND FOR JURY TRIAL\n\nPlaintiff, ${plaintiff}, pro se, sues Defendant, ${defendant}, and states:\n\nJURISDICTION AND VENUE\n1. This is an action for damages exceeding Fifty Thousand Dollars ($50,000.00), exclusive of interest, taxable costs, and attorney's fees, within the subject matter jurisdiction of this Circuit Court pursuant to Fla. Stat. § 26.012.\n2. Plaintiff is an individual residing in ${county} County, Florida.\n3. Defendant is a commercial entity operating within ${county} County, Florida, subjecting itself to personal jurisdiction under Fla. Stat. § 48.193.\n4. Venue is proper in ${county} County, Florida pursuant to Fla. Stat. § 47.011 because the cause of action accrued in this County.\n\nCOUNT I: ${currentCause.title.toUpperCase()}\n(Governing Authority: ${currentCause.dcaCitation})\n\n5. Plaintiff realleges and reincorporates Paragraphs 1 through 4 as if fully set forth herein.\n6. ULTIMATE FACT (ELEMENT 1): ${elementFacts.e1 || "[State ultimate facts establishing element 1]"}\n7. ULTIMATE FACT (ELEMENT 2): ${elementFacts.e2 || "[State ultimate facts establishing element 2]"}\n8. ULTIMATE FACT (ELEMENT 3): ${elementFacts.e3 || "[State ultimate facts establishing element 3]"}\n${hasExhibitAttached ? `9. Pursuant to Fla. R. Civ. P. 1.130(a), a true and correct copy of the ${exhibitName} is attached hereto as EXHIBIT A and incorporated herein by reference.\n10. All conditions precedent to the maintenance of this action have occurred, have been performed, or have been excused.` : "9. All conditions precedent have occurred or been waived."}\n\nWHEREFORE, Plaintiff respectfully demands judgment against Defendant for compensatory damages, prejudgment interest, post-judgment interest, taxable costs pursuant to Fla. Stat. § 57.041, reciprocal attorney's fees pursuant to Fla. Stat. § 57.105(7), and further relief as this Court deems just and proper.\n\nDEMAND FOR JURY TRIAL\nPlaintiff hereby demands a trial by jury on all issues so triable.\n\nDated: October 17, 2026.\n\nRespectfully submitted,\n\nBy: ______________________________\n${plaintiff}, Pro Se\nEmail: service@allegedlylegal.com`;
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
    <div className="flex h-screen bg-[#FDFDFD] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* 1. Left Navigation Sidebar */}
      <aside className="w-64 bg-[#FAFAFA] border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
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

          {/* New Filing Button */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveNav("drafts")}
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

          {/* Section: Chats / Recent */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Filings</span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setActiveNav("drafts")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "drafts" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                History
              </button>
              <button
                onClick={() => setActiveNav("drafts")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-slate-600 hover:bg-slate-100 transition"
              >
                <ChevronRight className="w-3 h-3 text-slate-400" />
                Recent Drafts
              </button>
            </div>
          </div>

          {/* Section: Work */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Work</span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setActiveNav("today")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "today" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Today (Deadlines)
              </button>
              <button
                onClick={() => setActiveNav("intake")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "intake" ? "bg-slate-200/70 text-slate-900 font-semibold border-l-2 border-slate-900" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-slate-500" />
                  Intake
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">0</span>
              </button>
              <button
                onClick={() => setActiveNav("matters")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "matters" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Matters
              </button>
              <button
                onClick={() => setActiveNav("drafts")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-slate-600 hover:bg-slate-100 transition"
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                Signatures & Orders
              </button>
            </div>
          </div>

          {/* Section: Library */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Library</span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setActiveNav("drafts")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "drafts" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Drafts
              </button>
              <button
                onClick={() => setActiveNav("vault")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "vault" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FolderLock className="w-3.5 h-3.5 text-slate-500" />
                Evidence Vault (Rule 1.130)
              </button>
              <button
                onClick={() => setActiveNav("playbooks")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "playbooks" ? "bg-slate-200/70 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Playbooks (FL Guide)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 space-y-2">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            Settings
          </button>
        </div>
      </aside>

      {/* 2. Main Content Stage */}
      {activeNav === "intake" ? (
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          <header className="h-14 border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Intake</h2>
              <p className="text-xs text-slate-400">Review incoming case filings and notices</p>
            </div>
            <span className="text-xs font-mono text-slate-400">service@allegedlylegal.com</span>
          </header>

          <div className="border-b border-slate-200 px-6 flex items-center gap-6 text-xs font-medium shrink-0">
            <button
              onClick={() => setIntakeTab("cases")}
              className={`py-3 flex items-center gap-2 border-b-2 transition ${
                intakeTab === "cases" ? "border-slate-900 text-slate-900 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Cases <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] font-mono">0</span>
            </button>
            <button
              onClick={() => setIntakeTab("mail")}
              className={`py-3 flex items-center gap-2 border-b-2 transition ${
                intakeTab === "mail" ? "border-slate-900 text-slate-900 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Mail / E-Portal Notices <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] font-mono">0</span>
            </button>
          </div>

          <div className="p-6 pb-2 space-y-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search cases, case numbers, or parties..."
                className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setIntakeFilter("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  intakeFilter === "all" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                All cases 0
              </button>
              <button
                onClick={() => setIntakeFilter("needs_you")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  intakeFilter === "needs_you" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Needs you 0
              </button>
              <button
                onClick={() => setIntakeFilter("working")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  intakeFilter === "working" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Working 0
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <Inbox className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-slate-800 mb-1">Nothing at the door</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Notices served through the Florida E-Filing Portal will appear here as proposals to review before they become an active docket entry.
            </p>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* Top Bar with AI Trigger Button */}
          <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Scale className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-semibold text-slate-900">Florida 17th Judicial Circuit Pleading Builder</span>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Rule 1.110(b) Compliant
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAiOpen(!aiOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Florida Legal AI
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export Document
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Center Canvas */}
            <div className="flex-1 p-8 overflow-y-auto flex justify-center bg-[#F1F3F5]">
              <div className="w-full max-w-3xl bg-white border border-slate-200/80 rounded-lg shadow-sm p-12 min-h-[1050px] font-serif text-xs leading-relaxed text-slate-900">
                <div className="whitespace-pre-wrap">{compiledComplaint}</div>
              </div>
            </div>

            {/* Right Fact-Pleading Auditor */}
            <aside className="w-80 border-l border-slate-200 bg-white p-5 overflow-y-auto space-y-5 shrink-0">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                  {currentCause.title}
                </span>
                <p className="text-[11px] text-slate-500 mb-1 leading-snug">
                  <strong>Controlling Case:</strong> {currentCause.dcaCitation}
                </p>
                <p className="text-[11px] text-slate-500">
                  <strong>Limitation:</strong> {currentCause.sol}
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Required Elements (Rule 1.110(b))
                </span>

                {currentCause.elements.map((elem, idx) => (
                  <div key={elem.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
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

            {/* Slide-out Florida Legal AI Assistant Panel */}
            {aiOpen && (
              <div className="absolute bottom-4 right-4 w-96 h-[520px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Florida Legal AI</span>
                  </div>
                  <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                  {aiMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg leading-relaxed ${
                        m.sender === "user"
                          ? "bg-emerald-950/80 border border-emerald-600/40 text-emerald-100 ml-6"
                          : "bg-slate-800/90 border border-slate-700 text-slate-200 mr-6"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                  {aiLoading && <div className="text-[11px] text-slate-400 italic">Analyzing Florida rules...</div>}
                </div>

                <div className="p-2 border-t border-slate-800 bg-slate-900 flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAi()}
                    placeholder="Ask about Rule 1.130, Dinuro, rehearing..."
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
        </main>
      )}
    </div>
  );
}
