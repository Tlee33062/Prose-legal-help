"use client";

import React, { useState, useMemo } from "react";
import {
  Gavel,
  Scale,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Download,
  RotateCcw,
  PlusCircle,
  FileCheck,
  Calendar,
  AlertTriangle,
  FolderOpen,
  Sparkles,
  BookOpen
} from "lucide-react";

export default function FloridaProSeLegalWorkspace() {
  const [activeTab, setActiveTab] = useState("complaint"); // 'complaint' | 'motion' | 'order'

  // Case Metadata State
  const [circuit, setCircuit] = useState("17th Judicial Circuit");
  const [county, setCounty] = useState("Broward");
  const [division, setDivision] = useState("25"); // Division 25 (Circuit Civil)
  const [caseNumber, setCaseNumber] = useState("CACE-26-XXXXXX");
  const [judgeName, setJudgeName] = useState("");
  const [plaintiff, setPlaintiff] = useState("Jane Doe");
  const [defendant, setDefendant] = useState("Apex Commercial Holdings LLC");

  // Complaint Builder State
  const [selectedCause, setSelectedCause] = useState("breach_contract");
  const [damagesClaimed, setDamagesClaimed] = useState("50000");
  const [hasWrittenInstrument, setHasWrittenInstrument] = useState(true);
  const [exhibitDescription, setExhibitDescription] = useState("Vendor Agreement executed on Oct 10, 2025");
  const [factsList, setFactsList] = useState([
    "On or about October 10, 2025, Plaintiff and Defendant entered into a valid, written commercial agreement.",
    "Plaintiff fully performed all initial obligations, conditions precedent, and deliverables required under the agreement.",
    "On January 15, 2026, Defendant materially breached the agreement by failing to provide complete ledger accounting and withheld contractually mandated funds.",
    "As a direct and proximate result of Defendant's material breach, Plaintiff suffered specific pecuniary damages."
  ]);
  const [newFact, setNewFact] = useState("");

  // Motion Builder State
  const [motionType, setMotionType] = useState("rehearing");
  const [motionGrounds, setMotionGrounds] = useState(
    "The Court overlooked controlling precedent and material record facts regarding the safe harbor provisions of Fla. Stat. § 607.0832 and Rule 1.130 integration."
  );

  // Proposed Order State
  const [reliefType, setReliefType] = useState("GRANTED");
  const [orderTitle, setOrderTitle] = useState("ORDER ON MOTION FOR REHEARING");
  const [orderDirectives, setOrderDirectives] = useState(
    "1. Plaintiff's Motion for Rehearing is hereby GRANTED.\n2. The prior Order dated October 5, 2026, is VACATED.\n3. Defendant shall file its Answer within twenty (20) days of this Order."
  );

  // Add Fact Handler
  const handleAddFact = () => {
    if (!newFact.trim()) return;
    setFactsList([...factsList, newFact.trim()]);
    setNewFact("");
  };

  // Rule 1.110(b) & Rule 1.130 Fact-Pleading Audit
  const pleadingAudit = useMemo(() => {
    const checks = [
      {
        id: "jurisdiction",
        label: "Circuit Civil Threshold ($50,000+)",
        status: Number(damagesClaimed) > 50000 ? "PASS" : "WARN",
        note: Number(damagesClaimed) > 50000 
          ? "Satisfies Circuit Court threshold pursuant to Fla. Stat. § 26.012." 
          : "Claims of $50,000 or less belong in County Court jurisdiction."
      },
      {
        id: "four_corners",
        label: "Rule 1.130(a) Exhibit Attachment (Four Corners Rule)",
        status: hasWrittenInstrument ? "PASS" : "CRITICAL",
        note: hasWrittenInstrument 
          ? "Contract/instrument identified as attached exhibit to prevent MTD." 
          : "FATAL DEFECT: Failing to attach written contract causes immediate Rule 1.140 dismissal."
      },
      {
        id: "fact_pleading",
        label: "Ultimate Facts Pled (Rule 1.110(b))",
        status: factsList.length >= 4 ? "PASS" : "WARN",
        note: factsList.length >= 4 
          ? "Sufficient chronological ultimate facts pled to survive Florida notice-pleading challenge." 
          : "Florida requires distinct ultimate facts for every legal element. Add more detailed paragraphs."
      },
      {
        id: "conditions_precedent",
        label: "Rule 1.120(c) Conditions Precedent",
        status: factsList.some(f => f.toLowerCase().includes("condition") || f.toLowerCase().includes("performed")) ? "PASS" : "WARN",
        note: "Must explicitly aver that all conditions precedent have occurred or been performed."
      }
    ];

    const passCount = checks.filter(c => c.status === "PASS").length;
    const score = Math.round((passCount / checks.length) * 100);

    return { checks, score };
  }, [damagesClaimed, hasWrittenInstrument, factsList]);

  // Document Text Compiler
  const compiledDocument = useMemo(() => {
    const header = `IN THE CIRCUIT COURT OF THE ${circuit.toUpperCase()}\nIN AND FOR ${county.toUpperCase()} COUNTY, FLORIDA\n\nCASE NO.: ${caseNumber}\nCIVIL DIVISION: ${division}\n${judgeName ? `JUDGE: ${judgeName}\n` : ""}\n${plaintiff.toUpperCase()},\n    Plaintiff,\nv.\n${defendant.toUpperCase()},\n    Defendant.\n__________________________________________/\n\n`;

    if (activeTab === "complaint") {
      let causeHeading = "COUNT I: BREACH OF CONTRACT";
      if (selectedCause === "conspiracy") causeHeading = "COUNT I: CIVIL CONSPIRACY";
      if (selectedCause === "fiduciary") causeHeading = "COUNT I: BREACH OF FIDUCIARY DUTY";

      return `${header}VERIFIED COMPLAINT AND DEMAND FOR JURY TRIAL\n\nPlaintiff, ${plaintiff}, sues Defendant, ${defendant}, and alleges:\n\nJURISDICTION AND VENUE\n1. This is an action for damages exceeding $50,000.00, exclusive of interest, taxable costs, and attorney's fees, within the subject-matter jurisdiction of this Circuit Court.\n2. Plaintiff is an individual residing in ${county} County, Florida.\n3. Defendant is a commercial entity operating and doing business within ${county} County, Florida, subjecting itself to personal jurisdiction under Fla. Stat. § 48.193.\n4. Venue is proper in ${county} County, Florida pursuant to Fla. Stat. § 47.011 because the causes of action accrued herein and the subject agreements were negotiated and breached in this County.\n\nGENERAL ALLEGATIONS OF ULTIMATE FACT\n${factsList.map((f, i) => `${i + 5}.${f}`).join("\n")}\n${hasWrittenInstrument ? `${factsList.length + 5}. Pursuant to Fla. R. Civ. P. 1.130, a true and correct copy of the ${exhibitDescription} is attached hereto as EXHIBIT A and incorporated herein by reference.\n${factsList.length + 6}. All conditions precedent to the institution and maintenance of this action have occurred, have been performed, or have been waived.` : ""}\n\n${causeHeading}\n${factsList.length + 7}. Plaintiff realleges and reincorporates Paragraphs 1 through ${factsList.length + 6} as if fully set forth herein.\n${factsList.length + 8}. Defendant owed legal and contractual duties directly to Plaintiff.\n${factsList.length + 9}. Defendant breached those duties as set forth above, causing actual damages.\n\nWHEREFORE, Plaintiff respectfully demands judgment against Defendant for compensatory damages, pre-judgment interest, post-judgment interest, taxable costs pursuant to Fla. Stat. § 57.041, reciprocal attorney's fees pursuant to Fla. Stat. § 57.105(7), and such other relief as this Honorable Court deems just and proper.\n\nDEMAND FOR JURY TRIAL\nPlaintiff hereby demands a trial by jury on all issues so triable as a matter of right.\n\nDated: October 17, 2026.\n\nRespectfully submitted,\n\nBy: ______________________________\n${plaintiff}, Pro Se\nAddress: Pompano Beach, FL\nEmail: service@allegedlylegal.com`;
    }

    if (activeTab === "motion") {
      return `${header}PLAINTIFF'S MOTION FOR REHEARING\nPURSUANT TO FLA. R. CIV. P. 1.530\n\nPlaintiff, ${plaintiff}, pro se, moves this Honorable Court pursuant to Florida Rule of Civil Procedure 1.530 for a rehearing and reconsideration of the Court's prior order, and in support states:\n\n1. TIMELINESS: This Motion is served within the strict 15-day deadline established by Fla. R. Civ. P. 1.530(b).\n2. GROUNDS: ${motionGrounds}\n3. THE FOUR CORNERS RULE: Under Florida law, a motion to dismiss is strictly limited to the four corners of the complaint and its attached exhibits under Rule 1.130. Defendant introduced extraneous matters and factual defenses not appearing on the face of the complaint.\n4. SAFE HARBOR DEFENSES: To the extent statutory safe harbors under Fla. Stat. § 607.0832 are raised, such matters constitute affirmative defenses and cannot support dismissal at the initial pleading stage without evidentiary hearing.\n\nWHEREFORE, Plaintiff respectfully requests that this Court grant this Motion for Rehearing, vacate the prior order, and provide leave to conduct formal discovery.\n\nCERTIFICATE OF SERVICE\nI HEREBY CERTIFY that a true and correct copy of the foregoing has been furnished electronically via the Florida Courts E-Filing Portal to all counsel of record on this 17th day of October, 2026.\n\nBy: ______________________________\n${plaintiff}, Pro Se`;
    }

    // Proposed Order
    return `${header}${orderTitle}\n\nTHIS CAUSE came before the Court upon Plaintiff's Motion, and the Court having reviewed the court file, having heard argument of the parties, and being otherwise fully advised in the premises, it is hereby:\n\nORDERED AND ADJUDGED that:\n\n${orderDirectives}\n\nDONE AND ORDERED in Chambers at Fort Lauderdale, Broward County, Florida on this _____ day of _______________, 2026.\n\n\n________________________________________\nCIRCUIT COURT JUDGE\n\nCopies furnished to:\n${plaintiff}, Pro Se\nCounsel for Defendant`;
  }, [circuit, county, division, caseNumber, judgeName, plaintiff, defendant, activeTab, selectedCause, damagesClaimed, hasWrittenInstrument, exhibitDescription, factsList, motionGrounds, orderTitle, orderDirectives]);

  const handleExportText = () => {
    const blob = new Blob([compiledDocument], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab.toUpperCase()}_${caseNumber}_Florida_ProSe.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-slate-100 font-sans antialiased">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wide text-white">Florida Pro Se Legal</h1>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                17th Cir. Civil Rules
              </span>
            </div>
            <p className="text-xs text-slate-400">Fact-Pleading, Four Corners Rule & Motion Builder</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab("complaint")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "complaint" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Complaint (Fact-Pleading)
          </button>
          <button
            onClick={() => setActiveTab("motion")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "motion" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Motion for Rehearing / Compel
          </button>
          <button
            onClick={() => setActiveTab("order")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "order" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Proposed Order
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportText}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Export Court Document
        </button>
      </header>

      {/* 3-Panel Litigation Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Division & Case Parameter Builder */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900/40 p-5 overflow-y-auto space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Florida Court & Division</span>
            <div className="mt-2 space-y-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Circuit / County</label>
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Civil Division</label>
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
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Parties</span>
            <div className="mt-2 space-y-2 text-xs">
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

          {activeTab === "complaint" && (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rule 1.110 Pleading Settings</span>
              <div className="text-xs space-y-2">
                <div>
                  <label className="text-slate-400 block mb-1">Cause of Action</label>
                  <select
                    value={selectedCause}
                    onChange={(e) => setSelectedCause(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="breach_contract">Breach of Written Contract</option>
                    <option value="conspiracy">Civil Conspiracy & Aiding/Abetting</option>
                    <option value="fiduciary">Breach of Fiduciary Duty</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Damages Claimed ($)</label>
                  <input
                    type="number"
                    value={damagesClaimed}
                    onChange={(e) => setDamagesClaimed(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasWrittenInstrument}
                      onChange={(e) => setHasWrittenInstrument(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-emerald-600"
                    />
                    <span className="text-xs text-slate-300">Has Contract Exhibit (Rule 1.130)</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Center: Live Court Pleading Canvas */}
        <main className="flex-1 bg-slate-950 p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl p-12 min-h-[1050px] font-serif text-xs leading-relaxed">
            <div className="whitespace-pre-wrap">{compiledDocument}</div>
          </div>
        </main>

        {/* Right: Florida Fact-Pleading & Defect Auditor */}
        <aside className="w-96 border-l border-slate-800 bg-slate-900/60 p-5 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Four Corners & Rule Audit
                </h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                pleadingAudit.score >= 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              }`}>
                {pleadingAudit.score}% Compliant
              </span>
            </div>

            {/* Audit Checkpoints */}
            <div className="space-y-2.5">
              {pleadingAudit.checks.map((chk) => (
                <div
                  key={chk.id}
                  className={`p-3 rounded-lg border text-xs ${
                    chk.status === "PASS"
                      ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
                      : chk.status === "WARN"
                      ? "border-amber-500/30 bg-amber-950/20 text-amber-200"
                      : "border-rose-500/30 bg-rose-950/20 text-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{chk.label}</span>
                    <span>{chk.status}</span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-normal">{chk.note}</p>
                </div>
              ))}
            </div>

            {/* Ultimate Facts Editor */}
            {activeTab === "complaint" && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Add Ultimate Fact Paragraph
                </span>
                <textarea
                  rows={3}
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  placeholder="State specific dates, unperformed covenants, or ledger discrepancies..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={handleAddFact}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Insert Numbered Fact
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Compliant with Fla. R. Civ. P. 1.110 & Rule 1.130 (Four Corners Rule)
          </div>
        </aside>
      </div>
    </div>
  );
}
