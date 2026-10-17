"use client";

import React, { useState, useMemo } from "react";
import {
  Gavel,
  Scale,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Download,
  PlusCircle,
  FolderOpen,
  BookOpen,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { FLORIDA_CAUSES_OF_ACTION, FLORIDA_AFFIRMATIVE_DEFENSES } from "../lib/florida-litigation-data";

export default function FloridaProSeLitigationApp() {
  const [activeTab, setActiveTab] = useState("complaint"); // 'complaint' | 'guide' | 'motion'

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

  // Fact Elements Tracking (Florida Fact-Pleading Rule 1.110)
  const [elementFacts, setElementFacts] = useState({
    e1: "On October 10, 2025, Plaintiff and Defendant executed a valid, binding commercial contract in Broward County, Florida.",
    e2: "Defendant materially breached Section 4 of the Agreement on January 15, 2026, by intentionally withholding contractually mandated ledger disbursements.",
    e3: "As a direct and proximate result of Defendant's material breach, Plaintiff suffered specific pecuniary damages exceeding $50,000."
  });

  const [hasExhibitAttached, setHasExhibitAttached] = useState(true);
  const [exhibitName, setExhibitName] = useState("Executed Agreement (Oct 10, 2025)");

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
    <div className="flex flex-col h-screen bg-[#0F172A] text-slate-100 font-sans antialiased">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wide text-white">Florida Pro Se Legal Guide</h1>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                Fla. Lit. Guide Standard
              </span>
            </div>
            <p className="text-xs text-slate-400">110+ Causes of Action | Element Checklists | 4th DCA Authority</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("complaint")}
            className={`px-3 py-1.5 rounded transition ${activeTab === "complaint" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Complaint Pleading Builder
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3 py-1.5 rounded transition ${activeTab === "guide" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Causes of Action & Defenses
          </button>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Export Court Document
        </button>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Florida Causes of Action Selector */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900/40 p-5 overflow-y-auto space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Cause of Action</span>
          <div className="space-y-1.5">
            {FLORIDA_CAUSES_OF_ACTION.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCauseId(c.id)}
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Court Information</span>
            <div className="mt-2 space-y-2 text-xs">
              <input
                type="text"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="County"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
              />
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="Case Number"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
              />
            </div>
          </div>
        </aside>

        {/* Center: Live Court Pleading Canvas */}
        <main className="flex-1 bg-slate-950 p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl p-12 min-h-[1050px] font-serif text-xs leading-relaxed">
            <div className="whitespace-pre-wrap">{compiledComplaint}</div>
          </div>
        </main>

        {/* Right Column: Element-by-Element Pleading Checker */}
        <aside className="w-96 border-l border-slate-800 bg-slate-900/60 p-5 overflow-y-auto space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              {currentCause.title}
            </span>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              <strong className="text-slate-300">Controlling Citation:</strong> {currentCause.dcaCitation}
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
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
                  placeholder="Insert specific facts, dates, unperformed actions..."
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
                  placeholder="Exhibit Description (e.g., Contract, Demand Letter)"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                />
              )}
            </div>

            {/* Affirmative Defense Warnings */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Anticipated Affirmative Defenses
              </span>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
                {currentCause.commonDefenses.map((def, i) => (
                  <li key={i}>{def}</li>
      {
    id: "cpa_professional_negligence",
    title: "CPA Professional Negligence & Record Non-Disclosure",
    dcaCitation: "Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016); Fla. Stat. § 473.318; F.A.C. R. 61H1-23.002",
    sol: "2 Years from Discovery (Fla. Stat. § 95.11(4)(a))",
    elements: [
      { 
        id: "e1", 
        label: "Professional Duty & Standards", 
        prompt: "Defendant CPA owed Plaintiff a professional standard of care under Fla. Stat. Chapter 473 and F.A.C. 61H1-21/23 to accurately report and deliver accounting records." 
      },
      { 
        id: "e2", 
        label: "Breach of Standard / Record Withholding", 
        prompt: "Defendant breached that standard by withholding general ledger workpapers/tax filings (Rule 61H1-23.002) or disseminating unauthorized financial disclosures." 
      },
      { 
        id: "e3", 
        label: "Direct Injury & Consequential Damages", 
        prompt: "Plaintiff suffered distinct commercial injury, financial loss, tax liability, or lost business valuation directly caused by Defendant's breach." 
      }
    ],
    commonDefenses: [
      "Accountant-Client Privilege (§ 473.316)",
      "Lack of Privity / Ultramares Doctrine",
      "Safe Harbor Under Fla. Stat. § 607.0832"
    ]
  },
  {
    id: "civil_aiding_abetting",
    title: "Aiding and Abetting Breach of Fiduciary Duty",
    dcaCitation: "AmeriFirst Bank v. Bomar, 757 F. Supp. 1365 (S.D. Fla. 1991); Halberstam v. Welch, 705 F.2d 472 (D.C. Cir. 1983)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(p))",
    elements: [
      { 
        id: "e1", 
        label: "Underlying Fiduciary Breach", 
        prompt: "A primary fiduciary committed an underlying breach of fiduciary duty or self-dealing." 
      },
      { 
        id: "e2", 
        label: "Substantial Knowledge", 
        prompt: "Defendant (e.g., CPA or outside professional) had actual knowledge of the primary actor's wrongful conduct." 
      },
      { 
        id: "e3", 
        label: "Substantial Assistance", 
        prompt: "Defendant rendered substantial assistance, encouragement, or concealment that facilitated the breach." 
      }
    ],
    commonDefenses: [
      "No Underlying Actionable Breach Established",
      "Absence of Actual Knowledge (Constructive Knowledge Insufficient)",
      "Routine Professional Services Safe Harbor"
    ]
  },
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
