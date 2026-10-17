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
  ShieldAlert
} from "lucide-react";

// 1. Florida Litigation Guide: Causes of Action & Standards
const FLORIDA_CAUSES_OF_ACTION = [
  {
    id: "breach_contract",
    title: "Breach of Written Contract",
    dcaCitation: "Friedman v. N.Y. Life Ins. Co., 985 So. 2d 56 (Fla. 4th DCA 2008)",
    sol: "5 Years (Fla. Stat. § 95.11(2)(b))",
    elements: [
      { id: "e1", label: "Valid Contract", prompt: "A valid contract existed between the parties." },
      { id: "e2", label: "Material Breach", prompt: "Defendant committed a material breach of a specific provision." },
      { id: "e3", label: "Resulting Damages", prompt: "Plaintiff suffered distinct damages as a proximate result of the breach." }
    ],
    commonDefenses: ["Failure to Attach Instrument (Fla. R. Civ. P. 1.130)", "Statute of Frauds", "Failure of Condition Precedent"]
  },
  {
    id: "breach_fiduciary",
    title: "Breach of Fiduciary Duty",
    dcaCitation: "Minotty v. Baudo, 42 So. 3d 824 (Fla. 4th DCA 2010); Dinuro Invs. v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(o))",
    elements: [
      { id: "e1", label: "Existence of Fiduciary Duty", prompt: "Defendant owed Plaintiff a fiduciary duty of loyalty, disclosure, or care." },
      { id: "e2", label: "Breach of Duty", prompt: "Defendant breached that duty through self-dealing or nondisclosure." },
      { id: "e3", label: "Direct Injury & Causation", prompt: "Defendant's breach proximately caused direct, individual harm to Plaintiff (Dinuro rule)." }
    ],
    commonDefenses: ["Safe Harbor (§ 607.0832)", "Derivative vs. Direct Action Bar", "Business Judgment Rule"]
  },
  {
    id: "cpa_negligence",
    title: "CPA Malpractice & Record Non-Disclosure",
    dcaCitation: "Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016); F.A.C. R. 61H1-23.002",
    sol: "2 Years from Discovery (Fla. Stat. § 95.11(4)(a))",
    elements: [
      { id: "e1", label: "Professional Standard of Care", prompt: "Defendant CPA owed a duty under Fla. Stat. Ch. 473 and F.A.C. 61H1 to maintain independence and furnish client records." },
      { id: "e2", label: "Withholding Records / Breach", prompt: "Defendant withheld general ledgers, tax filings, or communicated false disclosures to lenders." },
      { id: "e3", label: "Pecuniary Loss", prompt: "Plaintiff suffered distinct commercial losses, tax penalties, or injury directly caused by the breach." }
    ],
    commonDefenses: ["Accountant-Client Privilege (§ 473.316)", "Ultramares Lack of Privity", "Safe Harbor (§ 607.0832)"]
  },
  {
    id: "civil_conspiracy",
    title: "Civil Conspiracy & Aiding/Abetting",
    dcaCitation: "SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327 (11th Cir. 2014)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(p))",
    elements: [
      { id: "e1", label: "Conspiracy Agreement", prompt: "An agreement between two or more parties to accomplish an unlawful act." },
      { id: "e2", label: "Overt Act", prompt: "The commission of an overt act in furtherance of the scheme." },
      { id: "e3", label: "Actual Damages", prompt: "Plaintiff sustained direct financial injury from the acts performed under the conspiracy." }
    ],
    commonDefenses: ["Intra-Corporate Conspiracy Doctrine", "Absence of Underlying Actionable Tort"]
  }
];

// 2. Curated Florida Statutes & DBPR Accountancy Rules
const FLORIDA_STATUTES_CORE = [
  {
    num: "§ 26.012",
    title: "Circuit Court Jurisdiction",
    desc: "Amount in controversy must exceed $50,000 for Florida Circuit Civil jurisdiction.",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0026/Sections/0026.012.html"
  },
  {
    num: "§ 47.011",
    title: "Venue & County Accrual",
    desc: "Actions must be brought in the county where the defendant resides or where the cause of action accrued.",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0047/Sections/0047.011.html"
  },
  {
    num: "§ 57.105(7)",
    title: "Reciprocal Attorney's Fees",
    desc: "Makes unilateral contract attorney's fee clauses mutual for the prevailing party.",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0057/Sections/0057.105.html"
  },
  {
    num: "§ 95.11",
    title: "Statutes of Limitations",
    desc: "5 yrs for written contracts; 4 yrs for fiduciary duty/fraud/conspiracy; 2 yrs for professional malpractice.",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0095/Sections/0095.11.html"
  },
  {
    num: "§ 473.316",
    title: "Accountant-Client Privilege Exceptions",
    desc: "Privilege is waived when services were sought to aid crime/fraud, or in disputes between joint clients.",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0400-0499/0473/Sections/0473.316.html"
  },
  {
    num: "F.A.C. 61H1-23.002",
    title: "Records Disposition (DBPR Rule)",
    desc: "CPAs must return client documents, general ledgers, and workpapers upon reasonable request.",
    url: "https://www2.myfloridalicense.com/cpa/documents/lawsandrulesbookoctober2026.pdf"
  },
  {
    num: "§ 607.0832",
    title: "Director Conflict / Safe Harbor",
    desc: "Statutory safe harbor fails if self-dealing or failure to disclose material facts is pled.",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699/0607/Sections/0607.0832.html"
  }
];

export default function FloridaProSeLitigationApp() {
  const [activeTab, setActiveTab] = useState("complaint"); // 'complaint' | 'statutes'
  const [mobilePanel, setMobilePanel] = useState("document"); // 'setup' | 'document' | 'audit'

  // Court Metadata
  const [circuit, setCircuit] = useState("17th Judicial Circuit");
  const [county, setCounty] = useState("Broward");
  const [division, setDivision] = useState("25");
  const [caseNumber, setCaseNumber] = useState("CACE-26-XXXXXX");
  const [plaintiff, setPlaintiff] = useState("Jane Doe");
  const [defendant, setDefendant] = useState("Apex Commercial Holdings LLC");

  // Cause of Action Selection
  const [selectedCauseId, setSelectedCauseId] = useState("breach_contract");
  const currentCause = useMemo(() => {
    return FLORIDA_CAUSES_OF_ACTION.find((c) => c.id === selectedCauseId) || FLORIDA_CAUSES_OF_ACTION[0];
  }, [selectedCauseId]);

  // Fact Elements Tracking (Fla. R. Civ. P. 1.110)
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
    <div className="flex flex-col min-h-screen lg:h-screen bg-[#0F172A] text-slate-100 font-sans antialiased overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xs sm:text-sm tracking-wide text-white">Florida Pro Se Legal</h1>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                17th Cir. Civil
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Fact-Pleading, Four Corners Rule & Florida Statutes Citator</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("complaint")}
              className={`px-2.5 py-1 rounded transition ${activeTab === "complaint" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Complaint Builder
            </button>
            <button
              onClick={() => setActiveTab("statutes")}
              className={`px-2.5 py-1 rounded transition ${activeTab === "statutes" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Florida Statutes & Rules
            </button>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Court Document</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {/* Tab View: Florida Statutes Quick Citator */}
      {activeTab === "statutes" && (
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-950">
          <div className="max-w-4xl mx-auto space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Florida Statutes & DBPR Board of Accountancy Rules
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Direct statutory authorities for pleading civil complaints and overcoming motions to dismiss.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FLORIDA_STATUTES_CORE.map((sec, idx) => (
                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{sec.num}</span>
                    <a
                      href={sec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      Official Law <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <h3 className="text-xs font-semibold text-white">{sec.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{sec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab View: Complaint Builder Workspace */}
      {activeTab === "complaint" && (
        <>
          {/* Mobile-Only Switcher */}
          <div className="lg:hidden flex items-center justify-around bg-slate-900 border-b border-slate-800 px-2 py-1.5 text-xs font-medium sticky top-0 z-20">
            <button
              onClick={() => setMobilePanel("setup")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                mobilePanel === "setup" ? "bg-slate-800 text-emerald-400 font-semibold" : "text-slate-400"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Setup
            </button>
            <button
              onClick={() => setMobilePanel("document")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                mobilePanel === "document" ? "bg-slate-800 text-emerald-400 font-semibold" : "text-slate-400"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Document
            </button>
            <button
              onClick={() => setMobilePanel("audit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                mobilePanel === "audit" ? "bg-slate-800 text-emerald-400 font-semibold" : "text-slate-400"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" /> Audit
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
            {/* Panel 1: Causes of Action & Case Parameters */}
            <aside
              className={`w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/40 p-4 sm:p-5 overflow-y-auto space-y-4 shrink-0 ${
                mobilePanel !== "setup" ? "hidden lg:block" : "block"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Florida Cause of Action</span>
              <div className="space-y-1.5">
                {FLORIDA_CAUSES_OF_ACTION.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCauseId(c.id);
                      setMobilePanel("document");
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition flex flex-col gap-0.5 ${
                      selectedCauseId === c.id
                        ? "bg-emerald-600 text-white font-medium"
                        : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{c.title}</span>
                    <span className={`text-[10px] ${selectedCauseId === c.id ? "text-emerald-100" : "text-slate-500 font-mono"}`}>
                      {c.sol}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Case Caption Info</span>
                <div className="mt-2 space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">County / Circuit</label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Division</label>
                      <input
                        type="text"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Case Number</label>
                      <input
                        type="text"
                        value={caseNumber}
                        onChange={(e) => setCaseNumber(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Plaintiff (Pro Se)</label>
                    <input
                      type="text"
                      value={plaintiff}
                      onChange={(e) => setPlaintiff(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Defendant</label>
                    <input
                      type="text"
                      value={defendant}
                      onChange={(e) => setDefendant(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Panel 2: Live Court Document Canvas */}
            <main
              className={`flex-1 bg-slate-950 p-3 sm:p-6 lg:p-8 overflow-y-auto flex justify-center ${
                mobilePanel !== "document" ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl p-5 sm:p-8 lg:p-12 min-h-[500px] lg:min-h-[1050px] font-serif text-[11px] sm:text-xs leading-relaxed">
                <div className="whitespace-pre-wrap break-words">{compiledComplaint}</div>
              </div>
            </main>

            {/* Panel 3: Florida Fact-Pleading Elements & Defect Auditor */}
            <aside
              className={`w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 p-4 sm:p-5 overflow-y-auto space-y-5 shrink-0 ${
                mobilePanel !== "audit" ? "hidden lg:block" : "block"
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {currentCause.title}
                </span>
                <p className="text-[11px] text-slate-400 mb-1 leading-relaxed">
                  <strong className="text-slate-300">Authority:</strong> {currentCause.dcaCitation}
                </p>
                <p className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Statute of Limitations:</strong> {currentCause.sol}
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Required Elements (Fla. R. Civ. P. 1.110(b))
                </span>

                {currentCause.elements.map((elem, idx) => (
                  <div key={elem.id} className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs space-y-1.5">
                    <span className="font-semibold text-emerald-300">
                      Element {idx + 1}: {elem.label}
                    </span>
                    <p className="text-[11px] text-slate-400">{elem.prompt}</p>
                    <textarea
                      rows={2}
                      value={elementFacts[elem.id] || ""}
                      onChange={(e) => handleFactChange(elem.id, e.target.value)}
                      placeholder="State specific facts, dates, unperformed covenants..."
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                ))}

                {/* Rule 1.130 Attachment Guard */}
                <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-200">
                    <input
                      type="checkbox"
                      checked={hasExhibitAttached}
                      onChange={(e) => setHasExhibitAttached(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-600"
                    />
                    Rule 1.130 Exhibit Attached
                  </label>
                  {hasExhibitAttached && (
                    <input
                      type="text"
                      value={exhibitName}
                      onChange={(e) => setExhibitName(e.target.value)}
                      placeholder="Exhibit Description"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                    />
                  )}
                </div>

                {/* Anticipated Affirmative Defenses */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Anticipated Affirmative Defenses
                  </span>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
                    {currentCause.commonDefenses.map((def, i) => (
                      <li key={i}>{def}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
