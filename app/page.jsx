"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  Share2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  Sliders,
  History,
  Check,
  X,
  FileCheck,
  FolderOpen,
  Settings,
  Scale,
  Gavel
} from "lucide-react";
import * as Diff from "diff";

const INITIAL_CONTRACT_PAGES = [
  {
    pageNumber: 1,
    title: "COMMERCIAL SERVICES & MASTER VENDOR AGREEMENT",
    subtitle: "State of Florida — 17th Judicial Circuit Jurisdiction (Broward County)",
    sections: [
      {
        id: "recitals",
        heading: "RECITALS & PARTIES",
        body: `This Master Commercial Services Agreement ("Agreement") is entered into as of October 17, 2026, by and between Palm Horizon Enterprises LLC, a Florida limited liability company with its principal place of business in Broward County, Florida ("Client"), and Southeast Digital Systems LLC ("Contractor"). WHEREAS, Client desires to retain Contractor to perform enterprise digital infrastructure, data workflow automation, and related services, and Contractor agrees to perform such services under the strict terms set forth herein.`
      },
      {
        id: "sec-indemnity",
        heading: "SECTION 4. INDEMNIFICATION & ALLOCATION OF RISK",
        body: `Contractor agrees to defend, indemnify, and hold harmless Client, its parent companies, affiliates, officers, and employees from and against any and all claims, liabilities, losses, damages, or costs (including full attorney's fees), whether or not caused by the sole negligence or willful misconduct of Client. In no event shall Client's aggregate liability exceed the total sum of $100.`
      },
      {
        id: "sec-covenants",
        heading: "SECTION 8. RESTRICTIVE COVENANTS & COMPETITION",
        body: `For a period of four (4) years following the termination of this Agreement for any reason, Contractor shall not directly or indirectly engage in, perform services for, consult with, or own any interest in any competitive digital services enterprise worldwide, without geographical limitation.`
      },
      {
        id: "sec-fees",
        heading: "SECTION 11. LEGAL FEES & EXPENSES",
        body: `In the event Client initiates judicial enforcement, arbitration, or collection actions arising under this Agreement, Client shall be entitled to recover all costs, expenses, and attorney's fees incurred. Contractor expressly agrees to bear its own legal expenses in all circumstances.`
      },
      {
        id: "sec-venue",
        heading: "SECTION 14. GOVERNING LAW & FORUM SELECTION",
        body: `This Agreement shall be interpreted and governed in accordance with the laws of the State of New York. The parties irrevocably consent to the exclusive jurisdiction and venue of the Supreme Court of New York, New York County, and waive any inconvenient forum defenses.`
      }
    ]
  }
];

const AUDIT_RULES = [
  {
    id: "sec-indemnity",
    sectionHeading: "Section 4: Indemnification",
    riskTitle: "Sole Negligence Indemnity Barred",
    statute: "Fla. Stat. § 725.06 & Florida Public Policy",
    severity: "CRITICAL",
    impact: "Unenforceable under Florida law. One party cannot indemnify another for that party's own sole negligence without statutory monetary caps.",
    originalText: `Contractor agrees to defend, indemnify, and hold harmless Client, its parent companies, affiliates, officers, and employees from and against any and all claims, liabilities, losses, damages, or costs (including full attorney's fees), whether or not caused by the sole negligence or willful misconduct of Client. In no event shall Client's aggregate liability exceed the total sum of $100.`,
    replacementText: `Each party agrees to defend and indemnify the other from third-party claims to the extent caused by the indemnifying party's gross negligence, willful misconduct, or material breach. Neither party shall be obligated to indemnify the other for damages caused by the other party's sole negligence or willful misconduct.`
  },
  {
    id: "sec-covenants",
    sectionHeading: "Section 8: Restrictive Covenants",
    riskTitle: "Overbroad Duration & Worldwide Scope",
    statute: "Fla. Stat. § 542.335(1)(d)",
    severity: "CRITICAL",
    impact: "Statutorily presumed unreasonable. Non-competes exceeding 2 years are unenforceable in Florida without proven specialized trade secrets and defined county trade markets.",
    originalText: `For a period of four (4) years following the termination of this Agreement for any reason, Contractor shall not directly or indirectly engage in, perform services for, consult with, or own any interest in any competitive digital services enterprise worldwide, without geographical limitation.`,
    replacementText: `For a period of twelve (12) months following termination, Contractor shall not directly solicit active clients of Client with whom Contractor had personal material contact within the prior twelve months, strictly limited to Broward, Miami-Dade, and Palm Beach Counties, Florida.`
  },
  {
    id: "sec-fees",
    sectionHeading: "Section 11: Legal Fees",
    riskTitle: "Unilateral Fee Clause Automatically Reciprocal",
    statute: "Fla. Stat. § 57.105(7)",
    severity: "CRITICAL",
    impact: "Florida statute automatically converts unilateral attorney fee covenants into mutual prevailing-party fee clauses across pre-trial, trial, and appeals.",
    originalText: `In the event Client initiates judicial enforcement, arbitration, or collection actions arising under this Agreement, Client shall be entitled to recover all costs, expenses, and attorney's fees incurred. Contractor expressly agrees to bear its own legal expenses in all circumstances.`,
    replacementText: `In any judicial or arbitration proceeding arising out of or related to this Agreement, the prevailing party shall be entitled to recover its reasonable attorney's fees, paralegal costs, and expenses at all trial, bankruptcy, and appellate levels pursuant to Fla. Stat. § 57.105(7).`
  },
  {
    id: "sec-venue",
    sectionHeading: "Section 14: Forum Selection",
    riskTitle: "Foreign Jurisdiction for Florida Entities",
    statute: "Fla. Stat. § 685.101 & Fla. R. Civ. P. 1.060",
    severity: "MODERATE",
    impact: "Forcing Florida LLCs into New York litigation creates jurisdictional burden and grounds for forum non conveniens transfer.",
    originalText: `This Agreement shall be interpreted and governed in accordance with the laws of the State of New York. The parties irrevocably consent to the exclusive jurisdiction and venue of the Supreme Court of New York, New York County, and waive any inconvenient forum defenses.`,
    replacementText: `This Agreement shall be governed by the laws of the State of Florida. Exclusive venue and jurisdiction for any disputes shall lie in the Circuit Court of the 17th Judicial Circuit in and for Broward County, Florida, or the U.S. District Court for the Southern District of Florida.`
  }
];

export default function FloridaProSeLegalWorkspace() {
  const [pages, setPages] = useState(INITIAL_CONTRACT_PAGES);
  const [resolvedIds, setResolvedIds] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState("sec-indemnity");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const activeRule = useMemo(() => {
    return AUDIT_RULES.find((r) => r.id === selectedRuleId) || AUDIT_RULES[0];
  }, [selectedRuleId]);

  const diffResult = useMemo(() => {
    if (!activeRule) return [];
    return Diff.diffWordsWithSpace(activeRule.originalText, activeRule.replacementText);
  }, [activeRule]);

  const complianceScore = useMemo(() => {
    const total = AUDIT_RULES.length;
    return Math.round(58 + (resolvedIds.length / total) * 42);
  }, [resolvedIds]);

  const handleApplyRedline = (rule) => {
    if (resolvedIds.includes(rule.id)) return;
    setPages((prevPages) =>
      prevPages.map((page) => ({
        ...page,
        sections: page.sections.map((sec) =>
          sec.id === rule.id ? { ...sec, body: rule.replacementText } : sec
        )
      }))
    );
    setResolvedIds((prev) => [...prev, rule.id]);
  };

  const handleExportDoc = () => {
    let fullDoc = pages[0].title + "\n" + pages[0].subtitle + "\n\n";
    pages[0].sections.forEach((sec) => {
      fullDoc += sec.heading + "\n" + sec.body + "\n\n";
    });
    const blob = new Blob([fullDoc], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Florida_Pro_Se_Legal_Reviewed_Contract.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredRules = AUDIT_RULES.filter((rule) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UNRESOLVED") return !resolvedIds.includes(rule.id);
    if (activeFilter === "RESOLVED") return resolvedIds.includes(rule.id);
    return rule.severity === activeFilter;
  });

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] text-[#1E293B] font-sans antialiased">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-200 bg-white px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900 tracking-tight">Florida Pro Se Legal</span>
                <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  17th Cir. Intelligence
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">Commercial_Services_Agreement_v2.docx</span>
            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-mono">Fla. Stat. Audit</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-500">Florida Compliance Index:</span>
            <span className={`font-bold ${complianceScore >= 90 ? "text-emerald-700" : "text-amber-600"}`}>
              {complianceScore}%
            </span>
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden ml-1">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${complianceScore}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleExportDoc}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Clean Agreement
          </button>
        </div>
      </header>

      {/* Main 3-Column Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Column 1: Document Outline & Florida Playbook */}
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-4">
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jurisdiction Digest</span>
              <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">Broward Circuit Rules</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">§ 57.105 & § 542.335</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Document Outline</span>
              <nav className="mt-2 space-y-1">
                {pages[0].sections.map((sec) => {
                  const hasViolation = AUDIT_RULES.some((r) => r.id === sec.id);
                  const isResolved = resolvedIds.includes(sec.id);
                  const isSelected = selectedRuleId === sec.id;

                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedRuleId(sec.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/60"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-2">{sec.heading}</span>
                      {hasViolation && !isResolved && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                      {hasViolation && isResolved && (
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" /> Florida Pro Se Legal
            </span>
            <span>v1.0</span>
          </div>
        </aside>

        {/* Column 2: The Document Canvas */}
        <main className="flex-1 bg-[#F1F3F5] overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-[820px] bg-white rounded-lg shadow-sm border border-slate-200/80 p-14 min-h-[1050px] relative">
            <div className="border-b border-slate-100 pb-6 mb-8 text-center">
              <h1 className="text-lg font-serif font-bold text-slate-900 tracking-wide">
                {pages[0].title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">{pages[0].subtitle}</p>
            </div>

            <div className="space-y-6 text-sm text-slate-700 font-serif leading-relaxed">
              {pages[0].sections.map((section) => {
                const rule = AUDIT_RULES.find((r) => r.id === section.id);
                const isSelected = selectedRuleId === section.id;
                const isResolved = resolvedIds.includes(section.id);

                return (
                  <div
                    key={section.id}
                    onClick={() => rule && setSelectedRuleId(rule.id)}
                    className={`relative p-3 rounded-lg transition-all ${
                      rule && !isResolved
                        ? "bg-rose-50/40 border-l-4 border-rose-500 cursor-pointer"
                        : rule && isResolved
                        ? "bg-emerald-50/30 border-l-4 border-emerald-500"
                        : "border-l-4 border-transparent"
                    } ${isSelected ? "ring-2 ring-emerald-500/20" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-sans font-bold text-xs uppercase tracking-wide text-slate-800">
                        {section.heading}
                      </h3>
                      {rule && !isResolved && (
                        <span className="text-[10px] font-sans font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                          Statutory Conflict
                        </span>
                      )}
                      {rule && isResolved && (
                        <span className="text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Florida Standard Applied
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800">{section.body}</p>
                  </div>
                );
              })}
            </div>

            {/* Signature Block */}
            <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 gap-10 font-serif text-xs">
              <div>
                <p className="font-bold text-slate-800">CLIENT:</p>
                <div className="mt-8 border-b border-slate-400 w-48" />
                <p className="mt-1 text-slate-500">Palm Horizon Enterprises LLC</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">CONTRACTOR:</p>
                <div className="mt-8 border-b border-slate-400 w-48" />
                <p className="mt-1 text-slate-500">Southeast Digital Systems LLC</p>
              </div>
            </div>
          </div>
        </main>

        {/* Column 3: AI Legal Inspector & Statutory Redline Drawer */}
        <aside className="w-96 border-l border-slate-200 bg-white flex flex-col justify-between overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Florida Statutory Audit
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {resolvedIds.length} / {AUDIT_RULES.length} Resolved
              </span>
            </div>

            {/* Severity Filter Pills */}
            <div className="flex gap-1.5">
              {["ALL", "UNRESOLVED", "RESOLVED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    activeFilter === tab
                      ? "bg-slate-800 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Violations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredRules.map((rule) => {
              const isResolved = resolvedIds.includes(rule.id);
              const isSelected = selectedRuleId === rule.id;

              return (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? "border-emerald-700 bg-emerald-50/40 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-800">{rule.riskTitle}</span>
                    {isResolved ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Resolved
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                        {rule.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-emerald-700 mb-1">{rule.statute}</p>
                  <p className="text-xs text-slate-500 leading-snug">{rule.impact}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Redline Drawer */}
          {activeRule && (
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                  Statutory Redline
                </span>
                <span className="text-[10px] font-mono text-slate-400">{activeRule.statute}</span>
              </div>

              {/* Word-level Diff */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed max-h-48 overflow-y-auto mb-3 shadow-inner">
                {diffResult.map((part, idx) => {
                  if (part.added) {
                    return (
                      <span key={idx} className="bg-emerald-100 text-emerald-800 underline font-medium px-0.5 rounded">
                        {part.value}
                      </span>
                    );
                  }
                  if (part.removed) {
                    return (
                      <span key={idx} className="bg-rose-100 text-rose-800 line-through opacity-75 px-0.5 rounded">
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={idx} className="text-slate-600">{part.value}</span>;
                })}
              </div>

              <button
                disabled={resolvedIds.includes(activeRule.id)}
                onClick={() => handleApplyRedline(activeRule)}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  resolvedIds.includes(activeRule.id)
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white shadow"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {resolvedIds.includes(activeRule.id) ? "Redline Accepted" : "Accept Florida Statutory Redline"}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
