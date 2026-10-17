"use client";

import React, { useState, useMemo } from "react";
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Gavel
} from "lucide-react";
import * as Diff from "diff";

const INITIAL_FLORIDA_CONTRACT = `FLORIDA COMMERCIAL SERVICES & VENDOR AGREEMENT

This Agreement is made between Palm Horizon Enterprises LLC ("Company"), a Florida Limited Liability Company, and Southeast Digital Ops LLC ("Vendor"), effective as of October 17, 2026.

SECTION 4: INDEMNIFICATION & LIABILITY
Vendor agrees to fully indemnify, defend, and hold harmless Company, its officers, and directors from any and all claims, liabilities, losses, or expenses, whether or not caused by the sole negligence or willful acts of Company. In no event shall Company's liability exceed the sum of $100.

SECTION 8: RESTRICTIVE COVENANTS & NON-COMPETITION
For a period of four (4) years following separation, Vendor agrees not to engage in, consult for, or provide similar digital or commercial services to any competitive business entity worldwide, without geographic limitation.

SECTION 11: ATTORNEY'S FEES AND EXPENSES
If Company initiates legal enforcement under this Agreement, Company shall be entitled to recover all costs, expenses, and attorney's fees incurred. Vendor shall bear its own expenses in all circumstances.

SECTION 14: GOVERNING LAW AND DISPUTE VENUE
This Agreement shall be governed strictly by the laws of the State of New York. The parties agree that exclusive jurisdiction shall reside in the Supreme Court of New York, New York County.`;

const FLORIDA_AUDIT_CLAUSES = [
  {
    id: "fl-indemnity",
    clauseName: "Indemnification & Sole Negligence",
    statute: "Fla. Stat. § 725.06 & Florida Public Policy",
    riskLevel: "CRITICAL",
    summary:
      "Florida law voids unilateral indemnity requiring one party to indemnify another for that entity's own sole negligence or willful misconduct without reciprocal statutory limits.",
    originalSnippet:
      "Vendor agrees to fully indemnify, defend, and hold harmless Company, its officers, and directors from any and all claims, liabilities, losses, or expenses, whether or not caused by the sole negligence or willful acts of Company.",
    suggestedRedline:
      "Vendor agrees to indemnify, defend, and hold harmless Company from third-party claims to the extent caused by Vendor's gross negligence, willful misconduct, or material breach. Neither party shall be obligated to indemnify the other for damages caused by the other party's own negligence or misconduct."
  },
  {
    id: "fl-compete",
    clauseName: "Restrictive Covenant Duration & Scope",
    statute: "Fla. Stat. § 542.335(1)(d)",
    riskLevel: "CRITICAL",
    summary:
      "A 4-year worldwide non-compete is statutorily presumed unreasonable and unenforceable in Florida. Enforceable restraints are typically 6 months to 2 years and require specific trade markets and client goodwill protections.",
    originalSnippet:
      "For a period of four (4) years following separation, Vendor agrees not to engage in, consult for, or provide similar digital or commercial services to any competitive business entity worldwide, without geographic limitation.",
    suggestedRedline:
      "For a period of twelve (12) months following separation, Vendor agrees not to directly solicit active clients of Company with whom Vendor had direct material contact, strictly limited to Broward, Palm Beach, and Miami-Dade Counties, Florida."
  },
  {
    id: "fl-fee",
    clauseName: "Unilateral Attorney's Fee Shifting",
    statute: "Fla. Stat. § 57.105(7)",
    riskLevel: "CRITICAL",
    summary:
      "Unilateral fee clauses are non-compliant under Florida law. Fla. Stat. § 57.105(7) makes one-sided fee provisions reciprocal for whichever party prevails in trial, bankruptcy, or appellate proceedings.",
    originalSnippet:
      "If Company initiates legal enforcement under this Agreement, Company shall be entitled to recover all costs, expenses, and attorney's fees incurred. Vendor shall bear its own expenses in all circumstances.",
    suggestedRedline:
      "In any dispute or litigation arising out of or related to this Agreement, the prevailing party shall be entitled to recover its reasonable attorney's fees, paralegal fees, and taxable costs from the non-prevailing party at all pre-trial, trial, bankruptcy, and appellate levels pursuant to Fla. Stat. § 57.105(7)."
  },
  {
    id: "fl-venue",
    clauseName: "Out-of-State Venue & Jurisdiction",
    statute: "Fla. Stat. § 685.101 & Fla. R. Civ. P. 1.060",
    riskLevel: "MODERATE",
    summary:
      "The contract specifies New York jurisdiction for Florida entities. Setting exclusive venue in Broward County (17th Judicial Circuit) eliminates costly forum non conveniens disputes and jurisdictional friction.",
    originalSnippet:
      "This Agreement shall be governed strictly by the laws of the State of New York. The parties agree that exclusive jurisdiction shall reside in the Supreme Court of New York, New York County.",
    suggestedRedline:
      "This Agreement shall be governed by and construed in accordance with the laws of the State of Florida. Exclusive jurisdiction and venue for any legal proceeding shall lie in the Circuit Court of the Seventeenth Judicial Circuit in and for Broward County, Florida, or the United States District Court for the Southern District of Florida."
  }
];

export default function ProseLegalHelpWorkspace() {
  const [contractText, setContractText] = useState(INITIAL_FLORIDA_CONTRACT);
  const [findings] = useState(FLORIDA_AUDIT_CLAUSES);
  const [resolvedIds, setResolvedIds] = useState([]);
  const [selectedClauseId, setSelectedClauseId] = useState("fl-indemnity");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const complianceScore = useMemo(() => {
    const total = findings.length;
    if (total === 0) return 100;
    return Math.round(55 + (resolvedIds.length / total) * 45);
  }, [findings, resolvedIds]);

  const activeClause = useMemo(() => {
    return findings.find((f) => f.id === selectedClauseId) || findings[0];
  }, [findings, selectedClauseId]);

  const diffParts = useMemo(() => {
    if (!activeClause) return [];
    return Diff.diffWordsWithSpace(activeClause.originalSnippet, activeClause.suggestedRedline);
  }, [activeClause]);

  const handleAcceptRedline = (clause) => {
    if (resolvedIds.includes(clause.id)) return;
    setContractText((prev) => prev.replace(clause.originalSnippet, clause.suggestedRedline));
    setResolvedIds((prev) => [...prev, clause.id]);
  };

  const handleReset = () => {
    setContractText(INITIAL_FLORIDA_CONTRACT);
    setResolvedIds([]);
    setSelectedClauseId("fl-indemnity");
  };

  const exportCleanDoc = () => {
    const blob = new Blob([contractText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ProSe_Legal_Help_Reviewed_Contract.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredFindings = findings.filter((f) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UNRESOLVED") return !resolvedIds.includes(f.id);
    if (activeFilter === "RESOLVED") return resolvedIds.includes(f.id);
    return f.riskLevel === activeFilter;
  });

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm tracking-wide text-white">Pro Se Legal Help</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                Florida Jurisdiction
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Broward County 17th Judicial Circuit & Fla. Stat. Rules Digest
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400">Florida Compliance Index:</span>
            <span
              className={`text-sm font-bold ${
                complianceScore >= 90
                  ? "text-emerald-400"
                  : complianceScore >= 70
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {complianceScore}%
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={exportCleanDoc}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
          >
            <Download className="w-4 h-4" />
            Export Clean Agreement
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-[65] flex flex-col border-r border-slate-800 bg-slate-900/30 overflow-y-auto p-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Gavel className="w-4 h-4" />
                <span>STATUS: CONTRACT REVIEW ACTIVE</span>
              </div>
              <span>
                {resolvedIds.length} of {findings.length} Florida statutory conflicts resolved
              </span>
            </div>
            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-serif">
              {contractText}
            </div>
          </div>
        </div>

        <div className="flex-[35] flex flex-col bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Statutory Violations
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {resolvedIds.length}/{findings.length} Resolved
              </span>
            </div>
            <div className="flex gap-1.5">
              {["ALL", "UNRESOLVED", "RESOLVED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    activeFilter === tab
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredFindings.map((clause) => {
              const isResolved = resolvedIds.includes(clause.id);
              const isSelected = selectedClauseId === clause.id;
              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClauseId(clause.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? "border-emerald-500/50 bg-slate-800/80"
                      : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">{clause.clauseName}</span>
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                        {clause.riskLevel}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400/90 mb-1.5">{clause.statute}</div>
                  <p className="text-xs text-slate-400 line-clamp-2">{clause.summary}</p>
                </div>
              );
            })}
          </div>

          {activeClause && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                  Statutory Redline Diff
                </span>
                <span className="text-[10px] font-mono text-slate-500">{activeClause.statute}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs leading-relaxed max-h-40 overflow-y-auto mb-3">
                {diffParts.map((part, index) => {
                  if (part.added) {
                    return (
                      <span key={index} className="bg-emerald-500/20 text-emerald-300 underline font-medium px-0.5 rounded">
                        {part.value}
                      </span>
                    );
                  }
                  if (part.removed) {
                    return (
                      <span key={index} className="bg-rose-500/20 text-rose-400 line-through opacity-80 px-0.5 rounded">
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={index} className="text-slate-400">{part.value}</span>;
                })}
              </div>
              <button
                disabled={resolvedIds.includes(activeClause.id)}
                onClick={() => handleAcceptRedline(activeClause)}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  resolvedIds.includes(activeClause.id)
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {resolvedIds.includes(activeClause.id) ? "Redline Accepted" : "Accept Florida Statutory Redline"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
