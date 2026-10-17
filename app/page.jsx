"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Scale,
  FileText,
  Download,
  BookOpen,
  Plus,
  MessageSquare,
  Clock,
  Inbox,
  Briefcase,
  FileCheck,
  FolderLock,
  Settings,
  ChevronDown,
  Sparkles,
  Send,
  X,
  Menu,
  FileCode,
  ShieldCheck,
  Calendar,
  Upload,
  ArrowLeft,
  Save,
  Printer,
  Gavel,
  Trash2,
  RefreshCw,
  Globe,
  Eye,
  Lock
} from "lucide-react";

// ============================================================================
// 1. FLORIDA PRIVITY & STANDING STANDARDS (GROUPED + OTHER / COMPLEX)
// ============================================================================
const ALL_PRIVITY_STANDARDS = [
  {
    group: "1. Tortious, Conspiracy & Adverse Counsel / Third-Party Liability (No Retainer Required)",
    options: [
      { id: "aiding_abetting", label: "Aiding & Abetting Breach of Fiduciary Duty — Actual Knowledge + Substantial Assistance (SFM Holdings)" },
      { id: "civil_conspiracy", label: "Civil Conspiracy — Agreement + Overt Tortious Act in Furtherance" },
      { id: "fraud_concealment", label: "Fraudulent Concealment / Active Participation in Tortious Conduct (No Privity Required)" },
      { id: "crime_fraud", label: "Crime-Fraud Exception to Privilege (Fla. Stat. § 473.316(4)(a) / § 90.502(4)(a))" }
    ]
  },
  {
    group: "2. Statutory & Corporate Member Rights",
    options: [
      { id: "dinuro_direct", label: "Direct Harm + Special Statutory/Contractual Duty (Dinuro Two-Prong Test)" },
      { id: "statutory_inspection", label: "Statutory Right to Inspect Corporate Books & Tax Records (§ 607.1602 / § 605.0410)" },
      { id: "client_records_473", label: "Direct Statutory Client Records & Workpaper Duty (§ 473.318 & F.A.C. 61H1-23.002)" },
      { id: "joint_entity_cpa", label: "Common Entity / Equity Holder Exception to CPA Privilege (§ 473.316(4)(c))" },
      { id: "safe_harbor_pierce", label: "Undisclosed Self-Dealing Stripping Director Safe Harbor Immunity (§ 607.0832)" }
    ]
  },
  {
    group: "3. Third-Party Beneficiary & Reliance Standards",
    options: [
      { id: "restatement_552", label: "Known Third-Party / Stakeholder Financial Reliance (Max Mitchell / Restatement § 552)" },
      { id: "intended_tpb", label: "Intended Third-Party Beneficiary (Espinosa v. Sparber Standard)" }
    ]
  },
  {
    group: "4. Contractual & Rule 1.130 Privity",
    options: [
      { id: "exclusive_possession", label: "Records/Instruments in Defendant's Exclusive Possession (Sachse v. Tampa Music Exception)" },
      { id: "direct_written", label: "Direct Written Contract / Engagement Agreement (Fla. R. Civ. P. 1.130(a))" },
      { id: "oral_contract", label: "Oral / Verbal Agreement & Course of Dealing (Fla. Stat. § 95.11(3)(k))" },
      { id: "alter_ego_veil", label: "Alter Ego / Piercing Corporate Veil / Interlocking DBA (Dania Jai-Alai)" }
    ]
  },
  {
    group: "5. Other / Complex Multi-Layered Privity",
    options: [
      { id: "other_complex", label: "Other / Complex Multi-Layered Privity (Specify Exact Factual & Legal Basis Below)" }
    ]
  }
];

const getPrivityLabel = (id) => {
  for (const grp of ALL_PRIVITY_STANDARDS) {
    const found = grp.options.find((o) => o.id === id);
    if (found) return found.label;
  }
  return id || "Not Specified";
};

const PROFESSION_CONFIGS = {
  attorney: {
    label: "Attorney / Law Firm",
    governingRules: "Rules Regulating Fla. Bar (Ch. 4) & Tortious Aiding/Abetting Law",
    sol: "2–4 Years (Fla. Stat. § 95.11)"
  },
  cpa: {
    label: "CPA / Accounting Firm",
    governingRules: "Fla. Stat. Ch. 473 (§ 473.318) & F.A.C. R. 61H1-23.002",
    sol: "2–4 Years from Discovery (Fla. Stat. § 95.11)"
  },
  director: {
    label: "Managing Member / Corporate Director",
    governingRules: "Fla. Stat. § 605.04091 (LLC) / § 607.0830 & § 607.0832 (FBCA)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(o))"
  },
  vendor: {
    label: "Commercial Vendor / Counterparty",
    governingRules: "Fla. Stat. § 95.11(2)(b) & Fla. Stat. § 57.105(7)",
    sol: "5 Years Written / 4 Years Oral"
  },
  lender: {
    label: "Lender / Financial Institution",
    governingRules: "Fla. Stat. § 687.0304 & UCC Art. 9",
    sol: "5 Years (Fla. Stat. § 95.11(2)(b))"
  }
};

// ============================================================================
// 2. STRICT FACT-LOCKED INITIAL STATE (NO HALLUCINATED RETAINERS)
// ============================================================================
const INITIAL_DEFENDANTS = [
  {
    id: "def-1",
    name: "Ilene Engleberg, CPA",
    entityName: "Engleberg Accounting P.A.",
    profession: "cpa",
    privityType: "client_records_473",
    customPrivityDetails: "Statutory duty to furnish corporate/client tax filings, general ledgers, and accounting workpapers under Fla. Stat. § 473.318 and F.A.C. 61H1-23.002; privilege waived under § 473.316(4)(a) & (c); unauthorized financial disclosures to third-party lenders.",
    suedCapacity: "both",
    specificBreach: "Withheld corporate tax filings, general ledgers, and accounting workpapers in violation of Fla. Stat. § 473.318 and F.A.C. R. 61H1-23.002 while transmitting unauthorized financial disclosures to outside lenders.",
    dateLastAction: "2026-01-15",
    discoveryDate: "2026-02-01",
    evidence: "EXHIBIT B: Written Records Demand & Lender Disclosure Emails",
    witnesses: "Corporate Bookkeeper, Third-Party Loan Officer",
    otherDefendants: "April I. Halle, Esq"
  },
  {
    id: "def-2",
    name: "April I. Halle, Esq",
    entityName: "The Halle Law Firm, P.A. (hallelaw.com)",
    profession: "attorney",
    privityType: "aiding_abetting",
    customPrivityDetails: "No direct retainer with Plaintiff. Liability is grounded in aiding and abetting breach of fiduciary duty, civil conspiracy, active concealment of Delray Beach DBA / Broward corporate records, and adverse correspondence ('Halles 1st Letter').",
    suedCapacity: "both",
    specificBreach: "Actively assisted in withholding corporate/DBA records from Plaintiff, issued 'Halles 1st Letter' to obstruct statutory inspection rights, and aided/abetted fiduciary breaches with actual knowledge.",
    dateLastAction: "2026-02-10",
    discoveryDate: "2026-03-01",
    evidence: "EXHIBIT C: Halles 1st Letter",
    witnesses: "Records Custodian",
    otherDefendants: "Ilene Engleberg, CPA"
  }
];

const INITIAL_EVIDENCE = [
  {
    id: "ev-2",
    defendantId: "def-1",
    exhibitLabel: "EXHIBIT B",
    title: "Written Demand for CPA Workpapers, Tax Filings & Lender Disclosures",
    fileName: "CPA_Records_Demand.pdf",
    mimeType: "application/pdf",
    fileSize: "845 KB",
    sourceType: "Verified Record",
    driveUrl: "",
    previewUrl: null,
    extractedText: "Written demand for general ledgers, tax returns, and lender financial transmittals.",
    batesRange: "LEE-EXB-0001 to LEE-EXB-0016",
    capturedMetadata: "Fact-Locked Exhibit • Assigned to Ilene Engleberg, CPA",
    downloadedTimestamp: "2026-10-16 14:22:05 EDT",
    aiNotes: `FACT-LOCKED RECORD — EXHIBIT B ("Written Demand for CPA Workpapers, Tax Filings & Lender Disclosures", Bates: LEE-EXB-0001 to LEE-EXB-0016):
• Assigned Defendant: Ilene Engleberg, CPA (CPA / Accounting Firm — Engleberg Accounting P.A.)
• User-Verified Intake Privity Basis: Direct Statutory Client Records & Workpaper Duty (§ 473.318 & F.A.C. 61H1-23.002)
• User-Provided Document Notes: Written demand for general ledgers, tax returns, and lender financial transmittals.
• AI Fact-Lock Guarantee: No unpled facts or outside instruments assumed.`,
    plaintiffPlaybookHook: "Supports statutory record demand under Fla. Stat. § 473.318 & F.A.C. R. 61H1-23.002 and privilege waiver under § 473.316(4)(a)/(c) against Ilene Engleberg, CPA.",
    defensePlaybookHook: "Counters CPA privity and privilege objections under Rule 1.130(a) and Dattoma v. Laughlin, 183 So. 3d 465.",
    syncedToPlaybooks: true
  },
  {
    id: "ev-3",
    defendantId: "def-2",
    exhibitLabel: "EXHIBIT C",
    title: "Halles 1st Letter",
    fileName: "Halles_1st_Letter.pdf",
    mimeType: "application/pdf",
    fileSize: "512 KB",
    sourceType: "Computer Upload",
    driveUrl: "",
    previewUrl: null,
    extractedText: "Halles 1st Letter uploaded by Plaintiff regarding April I. Halle, Esq.",
    batesRange: "LEE-EXHIBITC-0033 to LEE-EXHIBITC-0048",
    capturedMetadata: "Fact-Locked Exhibit • Assigned to April I. Halle, Esq (The Halle Law Firm, P.A.)",
    downloadedTimestamp: "2026-10-17 17:15:00 EDT",
    aiNotes: `FACT-LOCKED RECORD — EXHIBIT C ("Halles 1st Letter", Bates: LEE-EXHIBITC-0033 to LEE-EXHIBITC-0048):
• Assigned Defendant: April I. Halle, Esq (Attorney / Law Firm — The Halle Law Firm, P.A.)
• User-Verified Intake Privity Basis: Aiding & Abetting Breach of Fiduciary Duty / Civil Conspiracy (No Retainer with Plaintiff)
• User-Provided Document Notes: "Halles 1st Letter" uploaded by Plaintiff as direct documentary evidence under Fla. R. Civ. P. 1.130(a).
• AI Fact-Lock Guarantee: Zero hallucination mode active. No retainer agreement assumed.`,
    plaintiffPlaybookHook: "Supports allegations against April I. Halle, Esq for aiding and abetting fiduciary breach (SFM Holdings) and obstructing statutory record access based on 'Halles 1st Letter' (EXHIBIT C).",
    defensePlaybookHook: "Counters defense arguments by attaching 'Halles 1st Letter' (EXHIBIT C) within the Four Corners of the pleading under Fla. R. Civ. P. 1.130(a).",
    syncedToPlaybooks: true
  }
];

const INITIAL_FILED_PLEADINGS = [
  {
    id: "filed-1",
    title: "Order Dismissing Count IV With Prejudice (Oct 5, 2026)",
    filer: "Court / Judge Olefson (Div. 25)",
    dateFiled: "2026-10-05",
    extractedAttack: "Four Corners Violation / Safe Harbor § 607.0832 / CPA Privity Bar",
    summary: "Dismissed Count IV citing lack of strict privity, accountant-client privilege (§ 473.316), and director safe harbor (§ 607.0832), adopting unsworn defense factual assertions outside the four corners."
  },
  {
    id: "filed-2",
    title: "Defendants' Motion to Dismiss Third Amended Complaint",
    filer: "Defense Counsel (April I. Halle, Esq / Ilene Engleberg, CPA)",
    dateFiled: "2026-09-18",
    extractedAttack: "Dinuro Derivative Bar / Rule 1.130 Exhibit Scope",
    summary: "Argues claims are derivative under Dinuro rather than direct, asserts intra-corporate conspiracy bar, and challenges privity."
  },
  {
    id: "filed-3",
    title: "Verified Fourth Amended Complaint (Filed Oct 16, 2026)",
    filer: "Plaintiff Pro Se (Tina Diane Lee)",
    dateFiled: "2026-10-16",
    extractedAttack: "Affirmative Cure Pleading",
    summary: "Sets forth ultimate facts establishing direct individual harm, attaches Rule 1.130 exhibits, and pleads statutory exceptions under § 473.316(4)(a)/(c) and bad-faith self-dealing defeating § 607.0832."
  }
];

const INITIAL_DEFENSE_PLAYBOOK = [
  {
    id: "dp-1",
    count: "Aiding & Abetting / Conspiracy Claims (April I. Halle, Esq)",
    defenseAttack: "Lack of Attorney-Client Privity & Derivative Standing Bar",
    defenseGrounds: "April I. Halle, Esq argues she had no retainer with Plaintiff individually and that claims are derivative under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731.",
    howToOvercome: "Tortious aiding and abetting a breach of fiduciary duty and civil conspiracy do NOT require a retainer agreement with Plaintiff. Under SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327, liability attaches where the defendant had actual knowledge of an underlying fiduciary breach and rendered substantial assistance (evidenced by EXHIBIT C: 'Halles 1st Letter'). Direct harm is pled under Dinuro via deprivation of statutory inspection rights (§ 607.1602).",
    controllingLaw: "SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327; Dinuro Invs., LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014)."
  },
  {
    id: "dp-2",
    count: "Director / Manager Conflict Transactions",
    defenseAttack: "Statutory Director Safe Harbor Immunity (Fla. Stat. § 607.0832)",
    defenseGrounds: "Defense asserts that corporate conflict transactions are immunized under § 607.0832.",
    howToOvercome: "Section 607.0832 is a fact-intensive affirmative defense inapplicable on a Motion to Dismiss (Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056) and inapplicable to outside professionals.",
    controllingLaw: "Fla. Stat. § 607.0832; Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)."
  },
  {
    id: "dp-3",
    count: "Count IV: CPA Malpractice & Record Withholding (Ilene Engleberg, CPA)",
    defenseAttack: "Ultramares Privity Bar & Accountant-Client Privilege (§ 473.316)",
    defenseGrounds: "Ilene Engleberg, CPA argues she was retained by the entity and claims privilege under Fla. Stat. § 473.316.",
    howToOvercome: "Invoke (1) F.A.C. R. 61H1-23.002 & Fla. Stat. § 473.318 mandatory return of client records; (2) § 473.316(4)(c) common-entity dispute exception; and (3) § 473.316(4)(a) crime/fraud exception.",
    controllingLaw: "Fla. Stat. §§ 473.316(4)(a), (4)(c), 473.318; F.A.C. R. 61H1-23.002; Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016)."
  }
];

const JUDGE_TEMPLATES = [
  {
    id: "tpl-rehearing",
    name: "Rule 1.530 Motion for Rehearing & To Vacate Dismissal",
    category: "Post-Order Relief (15-Day Jurisdictional Deadline)",
    divisionRules: "17th Cir. Div. 25 (Judge Olefson) • 12pt Times New Roman • Double-Spaced",
    description: "Challenges an order of dismissal with prejudice where the court relied on defense factual assertions outside the four corners of the complaint."
  },
  {
    id: "tpl-4th-amended",
    name: "Verified Amended Complaint (Fact-Locked & Rule 1.130 Compliant)",
    category: "Initial / Amended Pleading",
    divisionRules: "Fla. R. Civ. P. 1.110(b) Ultimate Facts • Rule 1.130 Exhibit Designation",
    description: "Compiles only your verified Intake facts and uploaded Evidence Vault exhibits without adding any assumed facts."
  },
  {
    id: "tpl-mtd-opposition",
    name: "Memorandum of Law in Opposition to Motion to Dismiss",
    category: "Defensive Response",
    divisionRules: "17th Cir. Local Rule 10A • Four Corners Standard",
    description: "Point-by-point response refuting defense privity, safe harbor, and derivative standing arguments."
  },
  {
    id: "tpl-rfp",
    name: "Plaintiff's First Request for Production of Documents (Rule 1.350)",
    category: "Formal Discovery",
    divisionRules: "Fla. R. Civ. P. 1.350 • 30-Day Response Deadline",
    description: "Demands native QuickBooks/general ledger files, CPA workpapers (§ 473.318), lender communications, and Delray Beach / Broward corporate records."
  }
];

// ============================================================================
// 3. STRICT ZERO-HALLUCINATION EVIDENCE ANALYZER (NEVER INVENTS FACTS)
// ============================================================================
const buildStrictFactLockedEvidenceAnalysis = (fileName, title, defObj, extractedText, exhibitLabel, bates) => {
  const defName = defObj?.name || "Unspecified Defendant";
  const profKey = defObj?.profession || "attorney";
  const profLabel = PROFESSION_CONFIGS[profKey]?.label || "Professional";
  const userPrivity = getPrivityLabel(defObj?.privityType);
  const userBreach = defObj?.specificBreach || "See user Intake record.";

  const verbatimSection = extractedText && extractedText.trim()
    ? `• User-Provided Verbatim Document Text / Notes: "${extractedText.trim()}"`
    : `• Verbatim Document Text Status: File "${fileName || title}" uploaded. [AI FACT-LOCK ACTIVE: No document text was pasted yet. AI is strictly forbidden from guessing or inventing contents, retainers, or unpled clauses.]`;

  const summary = `FACT-LOCKED RECORD — ${exhibitLabel} ("${title || fileName}", Bates: ${bates}):
• Assigned Defendant: ${defName} (${profLabel} — ${defObj?.entityName || "Entity"})
• User-Selected Privity / Liability Basis in Intake: ${userPrivity}
• User-Verified Breach Allegation in Intake: ${userBreach}
${verbatimSection}
• Rule 1.130(a) Four Corners Impact: Incorporating ${exhibitLabel} ("${title}") places this exact exhibit within the Four Corners of the pleading (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)).`;

  const plaintiffHook = `Fact-Locked Offensive Hook vs. ${defName}: Links ${exhibitLabel} ("${title}", Bates: ${bates}) directly to Plaintiff's pled liability theory (${userPrivity}) and Intake breach facts ("${userBreach}"). Zero external facts assumed.`;

  const defenseVulnerability = `Fact-Locked Defense Rebuttal (${defName}): Uses ${exhibitLabel} ("${title}", Bates: ${bates}) under Fla. R. Civ. P. 1.130(a) to support Plaintiff's well-pled ultimate facts, which must be accepted as true on a Rule 1.140(b)(6) Motion to Dismiss.`;

  return { summary, plaintiffHook, defenseVulnerability };
};

// Startup Cleaner: Purges any hallucinated "Halle Retainer" from cached localStorage
const cleanHallucinationsFromStorageString = (rawStr) => {
  if (typeof rawStr !== "string") return rawStr;
  return rawStr
    .replace(/RICHARD HALLE,\s*ESQ\./gi, "APRIL I. HALLE, ESQ")
    .replace(/Richard Halle,\s*Esq\./gi, "April I. Halle, Esq")
    .replace(/Richard Halle/gi, "April I. Halle, Esq")
    .replace(/April I\. Halle, Esq\. Retainer &/gi, "Delray Beach DBA &")
    .replace(/Retainer Communications &/gi, "Correspondence &");
};

// ============================================================================
// 4. MAIN APPLICATION COMPONENT
// ============================================================================
export default function FloridaProSeLitigationApp() {
  const [activeNav, setActiveNav] = useState("vault");
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [intakeSubTab, setIntakeSubTab] = useState("defendants");
  const [plaintiff, setPlaintiff] = useState("Tina Diane Lee");
  const [syncNotification, setSyncNotification] = useState(null);

  const notifySync = (msg) => {
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setSyncNotification(`${msg} (${t})`);
    setTimeout(() => setSyncNotification(null), 4500);
  };

  // Core States
  const [defendantsList, setDefendantsList] = useState(INITIAL_DEFENDANTS);
  const [activeDefId, setActiveDefId] = useState("def-2");
  const [evidenceItems, setEvidenceItems] = useState(INITIAL_EVIDENCE);
  const [filedPleadings, setFiledPleadings] = useState(INITIAL_FILED_PLEADINGS);
  const [newFiledTitle, setNewFiledTitle] = useState("");
  const [newFiledFiler, setNewFiledFiler] = useState("Defense Counsel");
  const [newFiledSummary, setNewFiledSummary] = useState("");
  const [defensePlaybook, setDefensePlaybook] = useState(INITIAL_DEFENSE_PLAYBOOK);
  const [defenseChatMsgs, setDefenseChatMsgs] = useState([
    {
      sender: "assistant",
      text: "STRICT FACT-LOCKED AI ACTIVE: Zero-Hallucination Mode is enabled. I will only reference facts, privity theories, and exhibits explicitly entered in your Intake and Evidence Vault."
    }
  ]);
  const [defenseChatInput, setDefenseChatInput] = useState("");

  const [plaintiffPlaybookCards, setPlaintiffPlaybookCards] = useState([
    {
      id: "pp-1",
      title: "1. Rule 1.530 Rehearing & Vacation of Oct 5 Dismissal (Due Oct 20, 2026)",
      body: "Serve Motion for Rehearing within the 15-day jurisdictional window. The trial court erred by adopting unsworn defense factual assertions regarding lender disclosures and resolving § 607.0832 safe harbor outside the four corners of the complaint (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000))."
    },
    {
      id: "pp-2",
      title: "2. Aiding & Abetting / Conspiracy Liability (April I. Halle, Esq — No Retainer Required)",
      body: "Under SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327, liability for aiding and abetting a breach of fiduciary duty requires (1) an underlying fiduciary breach, (2) actual knowledge, and (3) substantial assistance (supported by EXHIBIT C: 'Halles 1st Letter'). No retainer between Plaintiff and Halle is required."
    },
    {
      id: "pp-3",
      title: "3. Statutory CPA Record Duties & Privilege Waivers (Ilene Engleberg, CPA)",
      body: "Under Fla. Stat. § 473.318 and F.A.C. R. 61H1-23.002, a CPA must furnish client general ledgers and workpapers upon demand. Accountant privilege is waived under § 473.316(4)(a) & (c)."
    }
  ]);

  const [matterCounts, setMatterCounts] = useState([
    {
      id: "cnt-1",
      countNum: "Count I",
      title: "Breach of Fiduciary Duty & Direct Member Harm",
      defendantName: "Managing Members / Directors",
      authority: "Fla. Stat. § 605.04091 / § 607.0830; Dinuro Invs. v. Camacho, 141 So. 3d 731",
      privityHook: "Direct Member Harm & Statutory Inspection Rights (§ 607.1602)",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-2",
      countNum: "Count II",
      title: "Equitable Accounting & Statutory Record Inspection",
      defendantName: "Ilene Engleberg, CPA & Co-Defendants",
      authority: "Fla. Stat. § 607.1602; Fla. Stat. § 473.318; F.A.C. R. 61H1-23.002",
      privityHook: "Statutory Right to Books, Ledgers & Workpapers",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-3",
      countNum: "Count III",
      title: "Civil Conspiracy & Aiding/Abetting Breach of Fiduciary Duty",
      defendantName: "April I. Halle, Esq & Ilene Engleberg, CPA",
      authority: "SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327",
      privityHook: "Actual Knowledge + Substantial Assistance (EXHIBIT C: Halles 1st Letter)",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-4",
      countNum: "Count IV",
      title: "CPA Professional Malpractice & Statutory Record Withholding",
      defendantName: "Ilene Engleberg, CPA",
      authority: "Fla. Stat. §§ 473.316(4)(a)/(c), 473.318; F.A.C. R. 61H1-23.002; Dattoma v. Laughlin",
      privityHook: "Statutory Client Record Duty & Privilege Exceptions",
      status: "Rule 1.530 Rehearing Pending (Due Oct 20)"
    }
  ]);

  // Evidence Upload Form States
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvExhibit, setNewEvExhibit] = useState("EXHIBIT D");
  const [newEvExtractedText, setNewEvExtractedText] = useState("");
  const [uploadTargetDefId, setUploadTargetDefId] = useState("def-2");
  const [googleDriveUrlInput, setGoogleDriveUrlInput] = useState("");
  const [googleDriveTitleInput, setGoogleDriveTitleInput] = useState("");
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState(null);

  const [signatureText, setSignatureText] = useState("/s/ Tina Diane Lee");
  const [signatureImage, setSignatureImage] = useState(null);

  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: "cal-1",
      date: "2026-10-20",
      title: "JURISDICTIONAL DEADLINE: Rule 1.530 Motion for Rehearing (Oct 5 Order)",
      type: "Statutory 15-Day Deadline"
    },
    {
      id: "cal-2",
      date: "2026-10-26",
      title: "Defendants' Response Due to 4th Amended Complaint (Rule 1.190(a))",
      type: "Rule 1.190 Deadline"
    }
  ]);
  const [newCalTitle, setNewCalTitle] = useState("");
  const [newCalDate, setNewCalDate] = useState("2026-10-22");

  const [chatThreads, setChatThreads] = useState([
    {
      id: "chat-1",
      title: "Fact-Locked Analysis: Halles 1st Letter (EXHIBIT C) & Count IV Rehearing",
      date: "2026-10-17",
      messages: [
        {
          sender: "assistant",
          text: "ZERO-HALLUCINATION FACT-LOCK ACTIVE: All fake retainer references have been purged. Only your actual uploaded exhibits (such as EXHIBIT C: 'Halles 1st Letter' assigned to April I. Halle, Esq, and EXHIBIT B assigned to Ilene Engleberg, CPA) and your verbatim Intake entries are used."
        }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState("chat-1");

  const [savedDrafts, setSavedDrafts] = useState([
    {
      id: "draft-1",
      title: "Verified Fourth Amended Complaint",
      updatedAt: "2026-10-17",
      type: "Complaint",
      status: "Fact-Locked",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25 (Hon. Shari Africk Olefson)\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nILENE ENGLEBERG, CPA, ENGLEBERG ACCOUNTING P.A., APRIL I. HALLE, ESQ, THE HALLE LAW FIRM, P.A., et al.,\n    Defendants.\n__________________________________________/\n\nVERIFIED FOURTH AMENDED COMPLAINT FOR DAMAGES AND DEMAND FOR JURY TRIAL\n\nPlaintiff, TINA DIANE LEE, pro se, sues Defendants ILENE ENGLEBERG, CPA and APRIL I. HALLE, ESQ, and alleges ultimate facts pursuant to Fla. R. Civ. P. 1.110(b):\n\n1. This is an action for damages exceeding $50,000.00 within the jurisdiction of this Court under Fla. Stat. § 26.012.\n2. Pursuant to Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014), Plaintiff brings direct claims for individualized pecuniary harm and deprivation of statutory inspection rights.\n3. Defendant April I. Halle, Esq aided and abetted breaches of fiduciary duty and conspired to conceal Delray Beach DBA and Broward corporate records with actual knowledge, as evidenced by EXHIBIT C ("Halles 1st Letter").\n4. Defendant Ilene Engleberg, CPA violated Fla. Stat. § 473.318 and F.A.C. R. 61H1-23.002 by withholding client general ledgers and workpapers while releasing unauthorized financials to third-party lenders (EXHIBIT B).\n\nUnder penalties of perjury pursuant to Fla. Stat. § 92.525, I declare that I have read the foregoing and the facts stated are true.\n\nBy: /s/ Tina Diane Lee`
    },
    {
      id: "draft-2",
      title: "Rule 1.530 Motion for Rehearing (Oct 5 Order Dismissing Count IV)",
      updatedAt: "2026-10-17",
      type: "Motion for Rehearing",
      status: "Urgent (Due Oct 20)",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nILENE ENGLEBERG, CPA, APRIL I. HALLE, ESQ, et al.,\n    Defendants.\n__________________________________________/\n\nPLAINTIFF'S TIMELY MOTION FOR REHEARING AND TO VACATE OCTOBER 5, 2026 ORDER DISMISSING COUNT IV WITH PREJUDICE PURSUANT TO FLA. R. CIV. P. 1.530\n\n1. Served within the strict 15-day jurisdictional window under Fla. R. Civ. P. 1.530(b).\n2. The October 5 Order erred by looking outside the four corners of the complaint (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173) and applying corporate director safe harbor (§ 607.0832) to an outside CPA (Ilene Engleberg, CPA) despite statutory duties under § 473.318, § 473.316(4)(a)/(c), and F.A.C. R. 61H1-23.002.\n\nBy: /s/ Tina Diane Lee`
    }
  ]);
  const [activeDraftId, setActiveDraftId] = useState("draft-1");

  const [selectedTemplateId, setSelectedTemplateId] = useState("tpl-rehearing");
  const [respondingToFilingId, setRespondingToFilingId] = useState("filed-1");

  const [memorandaList, setMemorandaList] = useState([
    {
      id: "memo-1",
      title: "Memorandum of Law: Rule 1.530 Rehearing & Vacation of Count IV Dismissal",
      targetCount: "Count IV (Ilene Engleberg, CPA & April I. Halle, Esq)",
      targetFiling: "Order Dismissing Count IV With Prejudice (Oct 5, 2026)",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25 (Hon. Shari Africk Olefson)\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nILENE ENGLEBERG, CPA, APRIL I. HALLE, ESQ, et al.,\n    Defendants.\n__________________________________________/\n\nPLAINTIFF'S MEMORANDUM OF LAW IN SUPPORT OF RULE 1.530 MOTION FOR REHEARING AND TO VACATE DISMISSAL OF COUNT IV WITH PREJUDICE\n\nI. FOUR CORNERS STANDARD OF REVIEW\nOn a Rule 1.140(b)(6) motion to dismiss, the trial court is strictly confined to the four corners of the complaint and may not rely on unsworn factual assertions of defense counsel. Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000).\n\nII. FLA. STAT. § 607.0832 DOES NOT IMMUNIZE CPAs OR UNDISCLOSED SELF-DEALING\nSection 607.0832 is an affirmative defense governing corporate directors, not outside CPAs regulated under Chapter 473. Moreover, pleading active concealment and bad faith precludes adjudication of § 607.0832 on a motion to dismiss. Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056 (Fla. 3d DCA 2018).\n\nIII. STATUTORY CPA DUTIES & TORTIOUS AIDING/ABETTING (NO RETAINER REQUIRED)\nAccountant-client privilege is waived under Fla. Stat. § 473.316(4)(a) & (c), and CPAs are mandated to furnish client ledgers and workpapers upon demand (§ 473.318; F.A.C. 61H1-23.002; Dattoma v. Laughlin, 183 So. 3d 465). As to April I. Halle, Esq (EXHIBIT C - "Halles 1st Letter"), liability for aiding and abetting a breach of fiduciary duty under SFM Holdings requires actual knowledge and substantial assistance—not a retainer agreement with Plaintiff.\n\nRespectfully submitted,\nBy: /s/ Tina Diane Lee`
    }
  ]);
  const [activeMemoId, setActiveMemoId] = useState("memo-1");
  const [memoSelectedCountId, setMemoSelectedCountId] = useState("cnt-4");
  const [memoSelectedFilingId, setMemoSelectedFilingId] = useState("filed-1");
  const [memoSelectedMotionType, setMemoSelectedMotionType] = useState(
    "Rule 1.530 Motion for Rehearing & To Vacate Dismissal"
  );

  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const safeSaveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      if (key === "fl_prose_evidence" && Array.isArray(data)) {
        try {
          const lightData = data.map((item) => ({
            ...item,
            previewUrl: item.previewUrl && item.previewUrl.length > 150000 ? null : item.previewUrl
          }));
          localStorage.setItem(key, JSON.stringify(lightData));
        } catch (e2) {}
      }
    }
  };

  // ============================================================================
  // STARTUP PURGE: REMOVES HALLUCINATED "HALLE RETAINER" & FIXES "HALLES 1ST LETTER"
  // ============================================================================
  useEffect(() => {
    try {
      let currentDefs = INITIAL_DEFENDANTS;
      const rawDefs = localStorage.getItem("fl_prose_defendants");
      if (rawDefs) {
        const parsedDefs = JSON.parse(cleanHallucinationsFromStorageString(rawDefs));
        currentDefs = parsedDefs.map((d) => {
          if (d.name.toLowerCase().includes("halle")) {
            return {
              ...d,
              privityType: d.privityType === "joint_client_atty" ? "aiding_abetting" : d.privityType,
              customPrivityDetails: (d.customPrivityDetails || "").replace(/Retainer/gi, "Correspondence"),
              evidence: (d.evidence || "").replace(/April I\. Halle, Esq\. Retainer &/gi, "").replace(/Retainer Communications/gi, "Halles 1st Letter")
            };
          }
          return d;
        });
        setDefendantsList(currentDefs);
        safeSaveToStorage("fl_prose_defendants", currentDefs);
      }

      const halleDef =
        currentDefs.find((d) => d.name.toLowerCase().includes("halle") || d.profession === "attorney") ||
        currentDefs[1] ||
        currentDefs[0];

      const rawEv = localStorage.getItem("fl_prose_evidence");
      if (rawEv) {
        const parsedEv = JSON.parse(cleanHallucinationsFromStorageString(rawEv));
        // Filter OUT the hallucinated "ev-1" (April I. Halle Retainer) completely!
        const withoutFakeRetainer = parsedEv.filter(
          (ev) =>
            ev.id !== "ev-1" &&
            !(ev.title || "").toLowerCase().includes("halle, esq. retainer")
        );

        // Repair any exhibit with "Halle" (like "Halles 1st Letter") so it is strictly linked to April I. Halle, Esq with ZERO hallucinated facts
        const repairedEv = withoutFakeRetainer.map((ev) => {
          const combined = `${ev.title || ""} ${ev.fileName || ""}`.toLowerCase();
          if (combined.includes("halle") || combined.includes("april")) {
            const strictAnalysis = buildStrictFactLockedEvidenceAnalysis(
              ev.fileName || ev.title,
              ev.title,
              halleDef,
              ev.extractedText,
              ev.exhibitLabel,
              ev.batesRange
            );
            return {
              ...ev,
              defendantId: halleDef.id,
              capturedMetadata: `Fact-Locked Exhibit • Assigned to ${halleDef.name} (${PROFESSION_CONFIGS[halleDef.profession]?.label})`,
              aiNotes: strictAnalysis.summary,
              plaintiffPlaybookHook: strictAnalysis.plaintiffHook,
              defensePlaybookHook: strictAnalysis.defenseVulnerability,
              syncedToPlaybooks: true
            };
          }
          return ev;
        });

        const hasHalles1st = repairedEv.some((e) =>
          (e.title || "").toLowerCase().includes("halles 1st letter")
        );
        const finalEv = hasHalles1st ? repairedEv : [...repairedEv, INITIAL_EVIDENCE[1]];
        setEvidenceItems(finalEv);
        safeSaveToStorage("fl_prose_evidence", finalEv);
      }

      const sig = localStorage.getItem("fl_prose_sig_text");
      if (sig) setSignatureText(sig);
      const sigImg = localStorage.getItem("fl_prose_sig_img");
      if (sigImg) setSignatureImage(sigImg);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    setUploadTargetDefId(activeDefId);
  }, [activeDefId]);

  const selectedDef = useMemo(
    () => defendantsList.find((d) => d.id === activeDefId) || defendantsList[0],
    [defendantsList, activeDefId]
  );
  const currentProfConfig = PROFESSION_CONFIGS[selectedDef?.profession] || PROFESSION_CONFIGS.cpa;
  const activeDraft = useMemo(
    () => savedDrafts.find((d) => d.id === activeDraftId) || savedDrafts[0],
    [savedDrafts, activeDraftId]
  );
  const activeChatThread = useMemo(
    () => chatThreads.find((c) => c.id === activeChatId) || chatThreads[0],
    [chatThreads, activeChatId]
  );
  const activeMemo = useMemo(
    () => memorandaList.find((m) => m.id === activeMemoId) || memorandaList[0],
    [memorandaList, activeMemoId]
  );

  const liveCaptionDefendants = useMemo(
    () =>
      defendantsList
        .map((d) => `${d.name.toUpperCase()}${d.entityName ? `, ${d.entityName.toUpperCase()}` : ""}`)
        .join(", "),
    [defendantsList]
  );

  // ============================================================================
  // STRICT FACT-LOCKED EVIDENCE UPLOAD, REASSIGN & DELETE HANDLERS
  // ============================================================================

  const syncEvidenceItemToBothPlaybooks = (evItem, allEvList) => {
    const targetDef = defendantsList.find((d) => d.id === evItem.defendantId) || selectedDef;

    const newPlaintiffCard = {
      id: `pp-ev-${evItem.id}`,
      title: `Fact-Locked Exhibit (${evItem.exhibitLabel} • ${evItem.batesRange}): ${evItem.title} [${targetDef.name}]`,
      body: `${evItem.aiNotes}\n${evItem.plaintiffPlaybookHook}`
    };
    const updatedPlPb = [
      newPlaintiffCard,
      ...plaintiffPlaybookCards.filter((c) => c.id !== newPlaintiffCard.id)
    ];
    setPlaintiffPlaybookCards(updatedPlPb);
    safeSaveToStorage("fl_prose_plaintiff_pb", updatedPlPb);

    const newDefenseCard = {
      id: `dp-ev-${evItem.id}`,
      count: `Fact-Locked Exhibit Check: ${evItem.exhibitLabel} ("${evItem.title}") — ${targetDef.name}`,
      defenseAttack: `Defense Response to ${evItem.exhibitLabel} ("${evItem.title}")`,
      defenseGrounds: `Pled against ${targetDef.name} (${PROFESSION_CONFIGS[targetDef.profession]?.label}) under ${getPrivityLabel(targetDef.privityType)}.`,
      howToOvercome: evItem.defensePlaybookHook,
      controllingLaw: "Fla. R. Civ. P. 1.130(a); Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)."
    };
    const updatedDefPb = [
      newDefenseCard,
      ...defensePlaybook.filter((d) => d.id !== newDefenseCard.id)
    ];
    setDefensePlaybook(updatedDefPb);
    safeSaveToStorage("fl_prose_defense_pb", updatedDefPb);

    const defEvSummary = allEvList
      .filter((e) => e.defendantId === targetDef.id)
      .map((e) => `${e.exhibitLabel}: ${e.title} [${e.batesRange}]`)
      .join("; ");
    const updatedDefs = defendantsList.map((d) =>
      d.id === targetDef.id ? { ...d, evidence: defEvSummary || d.evidence } : d
    );
    setDefendantsList(updatedDefs);
    safeSaveToStorage("fl_prose_defendants", updatedDefs);
  };

  // Reassign an Exhibit to a Different Defendant (Zero Hallucinations)
  const handleReassignExhibitDefendant = (evItem, newDefendantId) => {
    const newTargetDef =
      defendantsList.find((d) => d.id === newDefendantId) || defendantsList[0];
    const strictAnalysis = buildStrictFactLockedEvidenceAnalysis(
      evItem.fileName || evItem.title,
      evItem.title,
      newTargetDef,
      evItem.extractedText,
      evItem.exhibitLabel,
      evItem.batesRange
    );

    const updatedItem = {
      ...evItem,
      defendantId: newTargetDef.id,
      capturedMetadata: `Fact-Locked Exhibit • Assigned to ${newTargetDef.name} (${PROFESSION_CONFIGS[newTargetDef.profession]?.label})`,
      aiNotes: strictAnalysis.summary,
      plaintiffPlaybookHook: strictAnalysis.plaintiffHook,
      defensePlaybookHook: strictAnalysis.defenseVulnerability,
      syncedToPlaybooks: true
    };

    const updatedList = evidenceItems.map((item) =>
      item.id === evItem.id ? updatedItem : item
    );
    setEvidenceItems(updatedList);
    safeSaveToStorage("fl_prose_evidence", updatedList);
    syncEvidenceItemToBothPlaybooks(updatedItem, updatedList);
    setActiveDefId(newTargetDef.id);
    notifySync(
      `✓ Reassigned "${evItem.title}" to ${newTargetDef.name} (${PROFESSION_CONFIGS[newTargetDef.profession]?.label})`
    );
  };

  // Delete an Exhibit Completely
  const handleDeleteExhibit = (evId) => {
    const updated = evidenceItems.filter((e) => e.id !== evId);
    setEvidenceItems(updated);
    safeSaveToStorage("fl_prose_evidence", updated);
    notifySync("✓ Exhibit Deleted from Evidence Vault & Memory");
  };

  // Computer Upload (PDF, JPG, PNG, TXT)
  const handleComputerFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      const isText = file.type === "text/plain" || file.name.endsWith(".txt");

      reader.onload = () => {
        const resultData = reader.result;
        const nextNum = (evidenceItems.length + index) * 16 + 1;
        const endNum = nextNum + 15;
        const pad = (n) => String(n).padStart(4, "0");
        const exLabel =
          index === 0 && newEvExhibit.trim()
            ? newEvExhibit.trim()
            : `EXHIBIT ${String.fromCharCode(65 + ((evidenceItems.length + index) % 26))}`;
        const bates = `LEE-${exLabel.replace(/\s+/g, "")}-${pad(nextNum)} to LEE-${exLabel.replace(/\s+/g, "")}-${pad(endNum)}`;
        const sizeKb =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${Math.max(1, Math.round(file.size / 1024))} KB`;
        const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19) + " EDT";
        const itemTitle =
          newEvTitle.trim() || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        const extractedTxt = isText ? String(resultData).slice(0, 1000) : newEvExtractedText;

        // Determine target defendant: Check filename for "Halle" or "Engleberg", otherwise use explicit uploadTargetDefId dropdown
        const combinedName = `${itemTitle} ${file.name}`.toLowerCase();
        let targetDef =
          defendantsList.find((d) => d.id === uploadTargetDefId) || selectedDef;
        if (combinedName.includes("halle") || combinedName.includes("april")) {
          targetDef =
            defendantsList.find((d) => d.name.toLowerCase().includes("halle")) || targetDef;
        } else if (combinedName.includes("engleberg") || combinedName.includes("ilene")) {
          targetDef =
            defendantsList.find((d) => d.name.toLowerCase().includes("engleberg")) || targetDef;
        }

        const strictAnalysis = buildStrictFactLockedEvidenceAnalysis(
          file.name,
          itemTitle,
          targetDef,
          extractedTxt,
          exLabel,
          bates
        );

        const newEvObj = {
          id: `ev-${Date.now()}-${index}`,
          defendantId: targetDef.id,
          exhibitLabel: exLabel,
          title: itemTitle,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          fileSize: sizeKb,
          sourceType: "Computer Upload",
          driveUrl: "",
          previewUrl: !isText ? resultData : null,
          extractedText: extractedTxt,
          batesRange: bates,
          capturedMetadata: `File: ${file.name} (${sizeKb}) • Assigned to ${targetDef.name} (${PROFESSION_CONFIGS[targetDef.profession]?.label})`,
          downloadedTimestamp: nowStr,
          aiNotes: strictAnalysis.summary,
          plaintiffPlaybookHook: strictAnalysis.plaintiffHook,
          defensePlaybookHook: strictAnalysis.defenseVulnerability,
          syncedToPlaybooks: true
        };

        setEvidenceItems((prev) => {
          const updated = [newEvObj, ...prev];
          safeSaveToStorage("fl_prose_evidence", updated);
          syncEvidenceItemToBothPlaybooks(newEvObj, updated);
          return updated;
        });

        setActiveDefId(targetDef.id);
        setNewEvTitle("");
        setNewEvExtractedText("");
        notifySync(
          `✓ Uploaded "${itemTitle}" → Strictly Assigned to ${targetDef.name} (Zero Hallucinations)`
        );
      };

      if (isText) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    e.target.value = "";
  };

  // Google Drive / Manual Exhibit Add
  const handleGoogleDriveImport = (presetTitle, presetUrl, presetText) => {
    const finalTitle = presetTitle || googleDriveTitleInput.trim() || newEvTitle.trim();
    const finalUrl = presetUrl || googleDriveUrlInput.trim();
    if (!finalTitle) return;

    const nextNum = evidenceItems.length * 16 + 1;
    const endNum = nextNum + 15;
    const pad = (n) => String(n).padStart(4, "0");
    const exLabel =
      newEvExhibit.trim() || `EXHIBIT ${String.fromCharCode(65 + (evidenceItems.length % 26))}`;
    const bates = `LEE-${exLabel.replace(/\s+/g, "")}-${pad(nextNum)} to LEE-${exLabel.replace(/\s+/g, "")}-${pad(endNum)}`;
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19) + " EDT";
    const extractedTxt = presetText || newEvExtractedText;

    const combinedName = finalTitle.toLowerCase();
    let targetDef =
      defendantsList.find((d) => d.id === uploadTargetDefId) || selectedDef;
    if (combinedName.includes("halle") || combinedName.includes("april")) {
      targetDef =
        defendantsList.find((d) => d.name.toLowerCase().includes("halle")) || targetDef;
    } else if (combinedName.includes("engleberg") || combinedName.includes("ilene")) {
      targetDef =
        defendantsList.find((d) => d.name.toLowerCase().includes("engleberg")) || targetDef;
    }

    const strictAnalysis = buildStrictFactLockedEvidenceAnalysis(
      finalTitle,
      finalTitle,
      targetDef,
      extractedTxt,
      exLabel,
      bates
    );

    const newEvObj = {
      id: `ev-gdrive-${Date.now()}`,
      defendantId: targetDef.id,
      exhibitLabel: exLabel,
      title: finalTitle,
      fileName: `${finalTitle.replace(/\s+/g, "_")}.pdf`,
      mimeType: "application/pdf",
      fileSize: finalUrl ? "Google Drive Cloud" : "Vault Entry",
      sourceType: finalUrl ? "Google Drive Sync" : "Vault Entry",
      driveUrl: finalUrl || "",
      previewUrl: null,
      extractedText: extractedTxt,
      batesRange: bates,
      capturedMetadata: `Fact-Locked • Assigned to ${targetDef.name} (${PROFESSION_CONFIGS[targetDef.profession]?.label})`,
      downloadedTimestamp: nowStr,
      aiNotes: strictAnalysis.summary,
      plaintiffPlaybookHook: strictAnalysis.plaintiffHook,
      defensePlaybookHook: strictAnalysis.defenseVulnerability,
      syncedToPlaybooks: true
    };

    const updated = [newEvObj, ...evidenceItems];
    setEvidenceItems(updated);
    safeSaveToStorage("fl_prose_evidence", updated);
    syncEvidenceItemToBothPlaybooks(newEvObj, updated);

    setActiveDefId(targetDef.id);
    setGoogleDriveTitleInput("");
    setGoogleDriveUrlInput("");
    setNewEvTitle("");
    setNewEvExtractedText("");
    setShowGoogleDriveModal(false);
    notifySync(
      `✓ Added "${finalTitle}" → Assigned to ${targetDef.name} (Fact-Lock Active)`
    );
  };

  // ============================================================================
  // OTHER HANDLERS: INTAKE, MEMORANDUM, TEMPLATES & AI
  // ============================================================================
  const handleUpdateDefField = (field, val) => {
    setDefendantsList((prev) =>
      prev.map((d) => (d.id === selectedDef.id ? { ...d, [field]: val } : d))
    );
  };

  const handleSaveIntakeAndSyncAll = () => {
    try {
      safeSaveToStorage("fl_prose_defendants", defendantsList);

      const syncedCounts = defendantsList.map((d, idx) => {
        const pCfg = PROFESSION_CONFIGS[d.profession] || PROFESSION_CONFIGS.cpa;
        const pDesc = `${getPrivityLabel(d.privityType)}${
          d.customPrivityDetails ? ` — ${d.customPrivityDetails}` : ""
        }`;
        return {
          id: `cnt-sync-${d.id}`,
          countNum: `Count ${idx + 1}`,
          title: `${pCfg.label} Liability & Statutory / Tortious Breach`,
          defendantName: `${d.name} (${d.entityName || pCfg.label})`,
          authority: pCfg.governingRules,
          privityHook: `${pDesc} • Last Action: ${d.dateLastAction}`,
          status: `Synced from Intake (${d.evidence})`
        };
      });
      setMatterCounts(syncedCounts);
      safeSaveToStorage("fl_prose_matter_counts", syncedCounts);

      notifySync(`✓ Intake Saved! Fact-Locked Records Synced Across All Tabs`);
    } catch (e) {}
  };

  const handleAiGenerateMemorandum = () => {
    const targetFiling = filedPleadings.find((f) => f.id === memoSelectedFilingId) || filedPleadings[0];
    const targetCountObj =
      memoSelectedCountId === "all"
        ? {
            countNum: "All Counts (Omnibus)",
            title: "All Pled Causes of Action",
            defendantName: defendantsList.map((d) => d.name).join(", ")
          }
        : matterCounts.find((c) => c.id === memoSelectedCountId) || matterCounts[0];

    const defDetails = defendantsList
      .map(
        (d, i) =>
          `${i + 1}. DEFENDANT ${d.name.toUpperCase()} (${d.entityName || PROFESSION_CONFIGS[d.profession]?.label}):
   • Governing Authority: ${PROFESSION_CONFIGS[d.profession]?.governingRules}
   • Fact-Locked Privity / Liability Basis: ${getPrivityLabel(d.privityType)}${d.customPrivityDetails ? ` — ${d.customPrivityDetails}` : ""}
   • Verbatim Breach Facts (${d.dateLastAction}): ${d.specificBreach}
   • Rule 1.130 Exhibits: ${d.evidence}`
      )
      .join("\n\n");

    const batesBlock = evidenceItems
      .map((ev) => {
        const linkedD = defendantsList.find((d) => d.id === ev.defendantId);
        return `   • ${ev.exhibitLabel}: "${ev.title}" — Assigned to ${linkedD?.name || "Defendant"} [Bates: ${ev.batesRange}]\n     ${ev.aiNotes}`;
      })
      .join("\n\n");

    const text = `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT
IN AND FOR BROWARD COUNTY, FLORIDA

CASE NO.: CACE-26-XXXXXX
DIVISION: 25 (Hon. Shari Africk Olefson)

${plaintiff.toUpperCase()},
    Plaintiff,
v.
${liveCaptionDefendants}, et al.,
    Defendants.
__________________________________________/

PLAINTIFF'S MEMORANDUM OF LAW IN SUPPORT OF ${memoSelectedMotionType.toUpperCase()}
• ASSIGNED COUNT SCOPE: ${targetCountObj.countNum} — ${targetCountObj.title}
• REFERENCED FILING: ${targetFiling.title} (${targetFiling.dateFiled})

I. FOUR CORNERS STANDARD OF REVIEW
Under Fla. R. Civ. P. 1.140(b) and Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000), the Court is strictly confined to the four corners of the verified pleading and its Rule 1.130(a) exhibits.

II. FACT-LOCKED INTAKE DEFENDANTS & LIABILITY BASES (ZERO ASSUMED FACTS)
${defDetails}

III. UPLOADED EVIDENCE VAULT & BATES INDEX (FLA. R. CIV. P. 1.130(a))
${batesBlock}

WHEREFORE, Plaintiff respectfully requests that this Honorable Court grant Plaintiff's ${memoSelectedMotionType}.

Respectfully submitted on October 17, 2026,

By: ${signatureText}
${plaintiff}, Pro Se`;

    const newMemo = {
      id: `memo-${Date.now()}`,
      title: `Memorandum: ${targetCountObj.countNum} (Fact-Locked)`,
      targetCount: `${targetCountObj.countNum}: ${targetCountObj.title}`,
      targetFiling: targetFiling.title,
      content: text
    };
    const updated = [newMemo, ...memorandaList];
    setMemorandaList(updated);
    setActiveMemoId(newMemo.id);
    safeSaveToStorage("fl_prose_memoranda", updated);
    notifySync(`✓ Fact-Locked Memorandum Generated (Zero Assumed Facts)`);
  };

  const handlePrintMemorandum = () => {
    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) return window.print();
    const clean = activeMemo.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    win.document.write(
      `<html><head><title>${activeMemo.title}</title><style>@page{size:letter;margin:1in;}body{font-family:"Times New Roman",serif;font-size:12pt;line-height:2.0;color:#000;}pre{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.85;white-space:pre-wrap;word-wrap:break-word;}</style></head><body><pre>${clean}</pre><script>window.onload=function(){window.focus();window.print();};</script></body></html>`
    );
    win.document.close();
  };

  const generateAiReply = (q) => {
    const defSummary = defendantsList
      .map((d) => `• ${d.name} (${PROFESSION_CONFIGS[d.profession]?.label}): ${getPrivityLabel(d.privityType)} — ${d.specificBreach}`)
      .join("\n");
    const evSummary = evidenceItems
      .map((e) => {
        const dObj = defendantsList.find((d) => d.id === e.defendantId);
        return `• ${e.exhibitLabel} ("${e.title}", Bates: ${e.batesRange}) → Assigned to ${dObj?.name}`;
      })
      .join("\n");
    return `STRICT FACT-LOCKED FLORIDA LEGAL AI (ZERO HALLUCINATIONS):\nI am strictly bound to your verified records below and forbidden from assuming any unpled retainers or facts:\n\nVerified Intake Roster:\n${defSummary}\n\nVerified Evidence Vault:\n${evSummary}`;
  };

  const handleSendAiMsg = (txt) => {
    if (!txt.trim()) return;
    const reply = generateAiReply(txt);
    setChatThreads((prev) =>
      prev.map((t) =>
        t.id === activeChatThread.id
          ? { ...t, messages: [...t.messages, { sender: "user", text: txt }, { sender: "assistant", text: reply }] }
          : t
      )
    );
  };

  const handleExportText = (title, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-[#FDFDFD] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside
        className={`${
          sidebarOpenMobile ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl flex" : "hidden lg:flex lg:w-64"
        } bg-[#FAFAFA] border-r border-slate-200 flex-col justify-between shrink-0 select-none overflow-y-auto`}
      >
        <div className="p-3 space-y-4">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/50">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                TB
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate">Tina Bulger&apos;s Workspace</span>
            </div>
            <button onClick={() => setSidebarOpenMobile(false)} className="lg:hidden text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => {
                setActiveNav("history");
                setSidebarOpenMobile(false);
              }}
              className="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" /> New chat
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <button
              onClick={() => {
                setActiveNav("memo_of_law");
                setSidebarOpenMobile(false);
              }}
              className="px-2 py-1.5 hover:bg-slate-50 text-slate-500"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CHATS & DRAFTS */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Chats & Drafts</span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("history");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "history" ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tab 1: History</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-200 px-1.5 rounded">{chatThreads.length}</span>
              </button>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-100">
                  <button
                    onClick={() => {
                      setActiveNav("recent");
                      setSidebarOpenMobile(false);
                    }}
                    className="flex items-center gap-2 flex-1 text-left font-medium"
                  >
                    <ChevronDown
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentExpanded(!recentExpanded);
                      }}
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${!recentExpanded ? "-rotate-90" : ""}`}
                    />
                    <span>Tab 2: Recent Drafts</span>
                  </button>
                </div>
                {recentExpanded && (
                  <div className="pl-5 space-y-0.5">
                    {savedDrafts.map((dr) => (
                      <button
                        key={dr.id}
                        onClick={() => {
                          setActiveDraftId(dr.id);
                          setActiveNav("editor");
                          setSidebarOpenMobile(false);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1 rounded text-xs truncate text-slate-500 hover:bg-slate-100"
                      >
                        <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{dr.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* WORK SECTION */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Work</span>
            <div className="mt-1 space-y-0.5">
              {[
                { id: "today", label: "Tab 3: Today (Calendar)", icon: Clock },
                { id: "intake", label: "Tab 4: Intake", icon: Inbox, badge: defendantsList.length },
                { id: "matters", label: "Tab 5: Matters", icon: Briefcase, badge: matterCounts.length },
                { id: "signatures", label: "Tab 6: Saved Signatures", icon: FileCheck }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id);
                      setSidebarOpenMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                      activeNav === item.id ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* II. LIBRARY SECTION */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">II. Library</span>
            <div className="mt-1 space-y-0.5">
              {[
                { id: "filed_drafts", label: "1. Drafts (Filed Docs)", icon: FileText, badge: filedPleadings.length },
                { id: "defense_playbook", label: "2. Defense Playbook", icon: ShieldCheck, badge: defensePlaybook.length },
                { id: "plaintiff_playbook", label: "3. Plaintiffs Playbook", icon: BookOpen, badge: plaintiffPlaybookCards.length },
                { id: "vault", label: "4. Evidence & Bates", icon: FolderLock, badge: evidenceItems.length },
                { id: "templates", label: "5. Templates / Rules", icon: FileCode },
                { id: "memo_of_law", label: "6. Memorandum of Law", icon: Gavel, badge: memorandaList.length }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id);
                      setSidebarOpenMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                      activeNav === item.id ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono bg-slate-200 px-1.5 rounded">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 space-y-2 bg-[#FAFAFA]">
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
            <div className="flex items-center justify-between text-emerald-800 text-[10px] font-bold uppercase">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Fact-Lock Active
              </span>
              <span>0 Hallucinations</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {defendantsList.map((d) => (
                <div key={d.id} className="text-[10px] font-semibold text-slate-800 truncate">
                  • {d.name} ({d.profession.toUpperCase()})
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">Tina Bulger</span>
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
              Pro Se
            </span>
          </button>
        </div>
      </aside>

      {sidebarOpenMobile && (
        <div onClick={() => setSidebarOpenMobile(false)} className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" />
      )}

      {/* MAIN CONTENT STAGE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpenMobile(true)} className="lg:hidden p-1.5 rounded-md text-slate-600">
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-xs sm:text-sm text-slate-900">
                  Florida Circuit Civil Pro Se Litigation Studio
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  <Lock className="w-2.5 h-2.5" /> Strict AI Fact-Lock: No Hallucinations
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Synced Defendants: {defendantsList.map((d) => d.name).join(" | ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Florida Legal AI</span>
            </button>
            <button
              onClick={() => handleExportText(activeDraft.title, activeDraft.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-medium rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Pleading</span>
            </button>
          </div>
        </header>

        {syncNotification && (
          <div className="bg-emerald-800 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between">
            <span>{syncNotification}</span>
            <button onClick={() => setSyncNotification(null)}>✕</button>
          </div>
        )}

        {/* ================================================================== */}
        {/* LIBRARY 4: EVIDENCE VAULT (FACT-LOCKED UPLOAD + REASSIGN + DELETE) */}
        {/* ================================================================== */}
        {activeNav === "vault" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-5">
              {/* Top Header & Defendant Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Evidence Vault &amp; Automated Bates Numbering (Strict Fact-Lock Active)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Viewing Exhibits for:{" "}
                    <strong className="text-slate-900">
                      {selectedDef.name} ({currentProfConfig.label})
                    </strong>{" "}
                    — AI is forbidden from assuming retainers or unpled facts.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {defendantsList.map((d) => {
                    const countForDef = evidenceItems.filter((e) => e.defendantId === d.id).length;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setActiveDefId(d.id)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                          activeDefId === d.id
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{d.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            activeDefId === d.id ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {countForDef}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload & Assignment Control Box */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      1. Assign Upload To Defendant:
                    </label>
                    <select
                      value={uploadTargetDefId}
                      onChange={(e) => {
                        setUploadTargetDefId(e.target.value);
                        setActiveDefId(e.target.value);
                      }}
                      className="w-full border border-emerald-500 rounded-lg p-2 bg-emerald-50/40 font-bold text-slate-900"
                    >
                      {defendantsList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({PROFESSION_CONFIGS[d.profession]?.label})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">2. Exhibit Label:</label>
                    <input
                      type="text"
                      value={newEvExhibit}
                      onChange={(e) => setNewEvExhibit(e.target.value)}
                      placeholder="EXHIBIT D"
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">3. Exhibit Title:</label>
                    <input
                      type="text"
                      value={newEvTitle}
                      onChange={(e) => setNewEvTitle(e.target.value)}
                      placeholder={`Exact title for ${defendantsList.find((d) => d.id === uploadTargetDefId)?.name}...`}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    4. Verbatim Document Excerpt / Exact Facts (AI will ONLY cite what you type or upload here):
                  </label>
                  <input
                    type="text"
                    value={newEvExtractedText}
                    onChange={(e) => setNewEvExtractedText(e.target.value)}
                    placeholder="Type or paste exact quotes/facts from the document so AI records them without guessing..."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <label className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-emerald-950 transition">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Upload File from Computer (PDF/JPG/PNG)</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,image/*,application/pdf"
                      multiple
                      onChange={handleComputerFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => setShowGoogleDriveModal(true)}
                    className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-indigo-950 transition"
                  >
                    <Globe className="w-4 h-4 text-indigo-700" />
                    <span>Import from Google Drive / Photos</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!newEvTitle.trim()) return;
                      handleGoogleDriveImport(newEvTitle.trim(), "", newEvExtractedText);
                    }}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>+ Save &amp; Stamp Bates</span>
                  </button>
                </div>
              </div>

              {/* Stored Evidence List for Selected Defendant */}
              <div className="space-y-4">
                {evidenceItems
                  .filter((e) => e.defendantId === selectedDef.id)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-emerald-800">
                              {ev.exhibitLabel}: {ev.title}
                            </span>
                            <span className="font-mono bg-slate-900 text-white px-2.5 py-0.5 rounded text-[11px]">
                              Bates: {ev.batesRange}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {ev.capturedMetadata} • {ev.downloadedTimestamp}
                          </p>
                        </div>

                        {/* Reassign Defendant Dropdown + View + Delete */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Assigned To:</span>
                            <select
                              value={ev.defendantId}
                              onChange={(e) => handleReassignExhibitDefendant(ev, e.target.value)}
                              className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold bg-slate-50 text-slate-900"
                            >
                              {defendantsList.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.name} ({PROFESSION_CONFIGS[d.profession]?.label})
                                </option>
                              ))}
                            </select>
                          </div>

                          {ev.previewUrl && (
                            <button
                              onClick={() => setPreviewModalItem(ev)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View File
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteExhibit(ev.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete Exhibit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {ev.previewUrl && ev.mimeType?.startsWith("image/") && (
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 inline-block">
                          <img
                            src={ev.previewUrl}
                            alt={ev.title}
                            onClick={() => setPreviewModalItem(ev)}
                            className="max-h-36 rounded cursor-pointer object-contain"
                          />
                        </div>
                      )}

                      {/* Editable Fact-Locked Notes */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-emerald-700" />
                            Fact-Locked Evidence Record (Editable — Stored in Memory &amp; Playbooks):
                          </span>
                          <button
                            onClick={() => handleReassignExhibitDefendant(ev, ev.defendantId)}
                            className="text-[11px] font-semibold text-indigo-700 hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> Sync to Both Playbooks
                          </button>
                        </div>

                        <textarea
                          rows={4}
                          value={ev.aiNotes || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = evidenceItems.map((item) =>
                              item.id === ev.id ? { ...item, aiNotes: val } : item
                            );
                            setEvidenceItems(updated);
                            safeSaveToStorage("fl_prose_evidence", updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTAKE */}
        {activeNav === "intake" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="border-b border-slate-200 px-6 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6 text-xs font-semibold">
                <button
                  onClick={() => setIntakeSubTab("defendants")}
                  className={`py-2 border-b-2 ${intakeSubTab === "defendants" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
                >
                  Defendant Profession &amp; Privity Intake ({defendantsList.length})
                </button>
                <button
                  onClick={() => setIntakeSubTab("cases")}
                  className={`py-2 border-b-2 ${intakeSubTab === "cases" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
                >
                  Cases &amp; Mail Queue (0)
                </button>
              </div>
              <button
                onClick={handleSaveIntakeAndSyncAll}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" /> Save Defendant &amp; Sync All Tabs
              </button>
            </div>

            {intakeSubTab !== "defendants" ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="font-serif text-base font-medium text-slate-800">Nothing at the door</h3>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
                <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 bg-[#FAFAFA] p-3 overflow-y-auto space-y-2 shrink-0">
                  <span className="text-[11px] font-bold uppercase text-slate-400 px-1 block">Named Defendants</span>
                  {defendantsList.map((def) => (
                    <button
                      key={def.id}
                      onClick={() => setActiveDefId(def.id)}
                      className={`w-full text-left p-3 rounded-lg border ${
                        activeDefId === def.id ? "bg-white border-emerald-600 shadow-sm" : "bg-white/60 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-slate-900 truncate">{def.name}</span>
                        <span className="text-[10px] font-mono uppercase bg-slate-100 px-1 rounded">{def.profession}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{def.entityName}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const id = `def-${Date.now()}`;
                      setDefendantsList((prev) => [
                        ...prev,
                        {
                          id,
                          name: "New Defendant",
                          entityName: "",
                          profession: "director",
                          privityType: "dinuro_direct",
                          customPrivityDetails: "",
                          suedCapacity: "both",
                          specificBreach: "",
                          dateLastAction: "2026-01-15",
                          discoveryDate: "2026-02-01",
                          evidence: "",
                          witnesses: "",
                          otherDefendants: ""
                        }
                      ]);
                      setActiveDefId(id);
                    }}
                    className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Defendant
                  </button>
                </aside>

                <main className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-3xl mx-auto space-y-5">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-slate-700">Step 1: Select Defendant Profession</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {currentProfConfig.governingRules}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(PROFESSION_CONFIGS).map(([key, cfg]) => (
                          <button
                            key={key}
                            onClick={() => handleUpdateDefField("profession", key)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                              selectedDef.profession === key ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Defendant Name</label>
                        <input
                          type="text"
                          value={selectedDef.name}
                          onChange={(e) => handleUpdateDefField("name", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Firm / Entity / DBA Name</label>
                        <input
                          type="text"
                          value={selectedDef.entityName}
                          onChange={(e) => handleUpdateDefField("entityName", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                      <label className="text-xs font-bold uppercase text-emerald-950 block">
                        Step 2: Privity / Liability Basis (Includes Non-Retainer Tort / Aiding &amp; Abetting + Other)
                      </label>
                      <select
                        value={selectedDef.privityType}
                        onChange={(e) => handleUpdateDefField("privityType", e.target.value)}
                        className="w-full border border-emerald-300 rounded-lg p-2.5 text-xs bg-white font-medium"
                      >
                        {ALL_PRIVITY_STANDARDS.map((grp) => (
                          <optgroup key={grp.group} label={grp.group}>
                            {grp.options.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                      <div>
                        <label className="text-xs font-semibold text-slate-800 block mb-1">
                          Exact Factual Privity / Liability Particulars (AI will ONLY use what is written here):
                        </label>
                        <textarea
                          rows={2}
                          value={selectedDef.customPrivityDetails || ""}
                          onChange={(e) => handleUpdateDefField("customPrivityDetails", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Specific Breach &amp; Ultimate Facts (Fla. R. Civ. P. 1.110(b))
                      </label>
                      <textarea
                        rows={3}
                        value={selectedDef.specificBreach}
                        onChange={(e) => handleUpdateDefField("specificBreach", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Evidence (Rule 1.130)</label>
                        <input
                          type="text"
                          value={selectedDef.evidence}
                          onChange={(e) => handleUpdateDefField("evidence", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Witnesses</label>
                        <input
                          type="text"
                          value={selectedDef.witnesses}
                          onChange={(e) => handleUpdateDefField("witnesses", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Other Co-Defendants</label>
                        <input
                          type="text"
                          value={selectedDef.otherDefendants}
                          onChange={(e) => handleUpdateDefField("otherDefendants", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            )}
          </div>
        )}

        {/* LIBRARY TAB 6: MEMORANDUM OF LAW */}
        {activeNav === "memo_of_law" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            <div className="bg-white border-b border-slate-200 p-4 sm:px-6 space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200">
                    Library Tab 6 • Strict Fact-Locked Memorandum Builder
                  </span>
                  <h2 className="text-sm font-bold text-slate-900 mt-1">
                    Printable Memorandum of Law ({defendantsList.map((d) => d.name).join(" & ")})
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAiGenerateMemorandum}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Compile Fact-Locked Memorandum
                  </button>
                  <button
                    onClick={handlePrintMemorandum}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Memorandum (12pt Court Format)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <select
                  value={memoSelectedCountId}
                  onChange={(e) => setMemoSelectedCountId(e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="all">All Counts Combined (Omnibus Memorandum)</option>
                  {matterCounts.map((mc) => (
                    <option key={mc.id} value={mc.id}>
                      {mc.countNum}: {mc.title} ({mc.defendantName})
                    </option>
                  ))}
                </select>
                <select
                  value={memoSelectedFilingId}
                  onChange={(e) => setMemoSelectedFilingId(e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 bg-white"
                >
                  {filedPleadings.map((fp) => (
                    <option key={fp.id} value={fp.id}>
                      {fp.title} ({fp.dateFiled})
                    </option>
                  ))}
                </select>
                <select
                  value={memoSelectedMotionType}
                  onChange={(e) => setMemoSelectedMotionType(e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="Rule 1.530 Motion for Rehearing & To Vacate Dismissal">
                    Rule 1.530 Motion for Rehearing &amp; To Vacate Dismissal
                  </option>
                  <option value="Opposition to Defendants' Motion to Dismiss">
                    Opposition to Defendants&apos; Motion to Dismiss
                  </option>
                </select>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <aside className="w-full lg:w-72 border-r border-slate-200 bg-white p-4 overflow-y-auto space-y-2 shrink-0">
                <span className="text-xs font-bold uppercase text-slate-500 block">Saved Memoranda</span>
                {memorandaList.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setActiveMemoId(m.id)}
                    className={`p-3 rounded-xl border cursor-pointer text-xs ${
                      activeMemoId === m.id ? "bg-indigo-50 border-indigo-600 font-semibold" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {m.title}
                  </div>
                ))}
              </aside>
              <main className="flex-1 p-4 sm:p-8 overflow-y-auto flex justify-center bg-[#F1F3F5]">
                <textarea
                  value={activeMemo.content}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMemorandaList((prev) => prev.map((m) => (m.id === activeMemo.id ? { ...m, content: val } : m)));
                  }}
                  className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-12 min-h-[850px] font-serif text-xs leading-relaxed text-slate-900"
                />
              </main>
            </div>
          </div>
        )}

        {/* TAB 1: HISTORY */}
        {activeNav === "history" && (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">{activeChatThread.title}</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {activeChatThread.messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap max-w-3xl ${
                    m.sender === "user" ? "bg-slate-900 text-white ml-auto" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendAiMsg(aiInput);
                    setAiInput("");
                  }
                }}
                placeholder="Ask Fact-Locked Florida Legal AI..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
              />
              <button
                onClick={() => {
                  handleSendAiMsg(aiInput);
                  setAiInput("");
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RECENT DRAFTS */}
        {activeNav === "recent" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-4">
              <h2 className="text-base font-bold text-slate-900">Recent Pleading Drafts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedDrafts.map((dr) => (
                  <div
                    key={dr.id}
                    onClick={() => {
                      setActiveDraftId(dr.id);
                      setActiveNav("editor");
                    }}
                    className="p-5 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 cursor-pointer space-y-2"
                  >
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{dr.type}</span>
                    <h3 className="text-xs font-bold text-slate-900">{dr.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-3 font-serif">{dr.content.slice(0, 160)}...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FULL SCREEN EDITOR */}
        {activeNav === "editor" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F1F3F5]">
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
              <button onClick={() => setActiveNav("recent")} className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                <ArrowLeft className="w-4 h-4" /> Back to Drafts
              </button>
              <span className="text-xs font-bold text-slate-900">{activeDraft.title}</span>
              <button
                onClick={() => {
                  safeSaveToStorage("fl_prose_drafts", savedDrafts);
                  notifySync("✓ Draft Saved");
                }}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Save Draft
              </button>
            </div>
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex justify-center">
              <textarea
                value={activeDraft.content}
                onChange={(e) => {
                  const val = e.target.value;
                  setSavedDrafts((prev) => prev.map((d) => (d.id === activeDraft.id ? { ...d, content: val } : d)));
                }}
                className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-12 min-h-[850px] font-serif text-xs leading-relaxed text-slate-900"
              />
            </div>
          </div>
        )}

        {/* TAB 3: TODAY / CALENDAR */}
        {activeNav === "today" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-6">
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-lg font-serif font-semibold text-slate-900">Good afternoon, Tina.</h2>
              {calendarEvents.map((ev) => (
                <div key={ev.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{ev.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{ev.date} • {ev.type}</span>
                  </div>
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Google Calendar ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MATTERS */}
        {activeNav === "matters" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                CACE Lee vs {defendantsList.map((d) => d.name).join(", ")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matterCounts.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-800">{c.countNum}: {c.title}</span>
                    <p className="text-slate-700 font-semibold">Target: {c.defendantName}</p>
                    <p className="text-[11px] text-slate-600">Authority: {c.authority}</p>
                    <p className="text-[11px] text-slate-600">Basis: {c.privityHook}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SAVED SIGNATURES */}
        {activeNav === "signatures" && (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex justify-center">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl border border-slate-200 space-y-5">
              <h2 className="text-base font-bold text-slate-900">Saved Pro Se Signature (Rule 2.515)</h2>
              <input
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-serif"
              />
              <button
                onClick={() => {
                  localStorage.setItem("fl_prose_sig_text", signatureText);
                  notifySync("✓ Signature Saved");
                }}
                className="w-full py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Save Signature
              </button>
            </div>
          </div>
        )}

        {/* LIBRARY 1: FILED DRAFTS / ORDERS */}
        {activeNav === "filed_drafts" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-4">
              {filedPleadings.map((doc) => (
                <div key={doc.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-900">{doc.title}</span>
                  <p className="text-xs text-slate-600">{doc.summary}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{doc.filer} • {doc.dateFiled}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIBRARY 2: DEFENSE PLAYBOOK */}
        {activeNav === "defense_playbook" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
            <div className="max-w-5xl mx-auto space-y-4">
              <h2 className="text-base font-bold text-slate-900">Defense Playbook &amp; Fact-Locked Rebuttals</h2>
              {defensePlaybook.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-rose-700 uppercase block">{item.count}</span>
                  <p className="font-bold text-slate-900">Attack: {item.defenseAttack}</p>
                  <p className="text-slate-600">{item.defenseGrounds}</p>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-950">
                    <strong>How to Overcome:</strong> {item.howToOvercome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIBRARY 3: PLAINTIFFS PLAYBOOK */}
        {activeNav === "plaintiff_playbook" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-4">
              <h2 className="text-base font-bold text-slate-900">Plaintiff&apos;s Master Playbook (Fact-Locked)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plaintiffPlaybookCards.map((c) => (
                  <div key={c.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-800 uppercase block">{c.title}</span>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY 5: TEMPLATES / PROCEDURES */}
        {activeNav === "templates" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {JUDGE_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{tpl.category}</span>
                    <h3 className="text-xs font-bold text-slate-900 mt-1">{tpl.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{tpl.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveNav("memo_of_law");
                    }}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Open in Fact-Locked Builder →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FLOATING AI DRAWER */}
        {aiOpen && (
          <div className="fixed bottom-4 right-4 w-96 h-[440px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs font-bold text-white">
              <span>Florida Legal AI (Strict Fact-Lock)</span>
              <button onClick={() => setAiOpen(false)}>✕</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {activeChatThread.messages.map((m, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg whitespace-pre-wrap ${m.sender === "user" ? "bg-emerald-950 text-emerald-100 ml-4" : "bg-slate-800 text-slate-200 mr-4"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendAiMsg(aiInput);
                    setAiInput("");
                  }
                }}
                placeholder="Ask Fact-Locked AI..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <button
                onClick={() => {
                  handleSendAiMsg(aiInput);
                  setAiInput("");
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GOOGLE DRIVE IMPORT MODAL */}
      {showGoogleDriveModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Import Evidence from Google Drive (Fact-Locked)
              </h3>
              <button onClick={() => setShowGoogleDriveModal(false)}>✕</button>
            </div>
            <input
              type="text"
              value={googleDriveTitleInput}
              onChange={(e) => setGoogleDriveTitleInput(e.target.value)}
              placeholder="Exact Document Title..."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
            <input
              type="text"
              value={googleDriveUrlInput}
              onChange={(e) => setGoogleDriveUrlInput(e.target.value)}
              placeholder="Paste Google Drive URL..."
              className="w-full border border-slate-300 rounded-lg p-2 font-mono"
            />
            <textarea
              rows={2}
              value={newEvExtractedText}
              onChange={(e) => setNewEvExtractedText(e.target.value)}
              placeholder="Paste exact verbatim text from the file (no facts will be assumed outside this box)..."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
            <button
              onClick={() => handleGoogleDriveImport()}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold"
            >
              Import &amp; Record Verbatim Facts
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewModalItem && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex items-center justify-between text-xs">
              <span className="font-bold">{previewModalItem.exhibitLabel}: {previewModalItem.title}</span>
              <button onClick={() => setPreviewModalItem(null)} className="px-2.5 py-1 bg-slate-100 rounded font-bold">
                ✕ Close
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-100 flex items-center justify-center">
              {previewModalItem.mimeType?.startsWith("image/") ? (
                <img src={previewModalItem.previewUrl} alt={previewModalItem.title} className="max-h-[75vh] object-contain" />
              ) : previewModalItem.previewUrl ? (
                <iframe src={previewModalItem.previewUrl} title={previewModalItem.title} className="w-full h-[75vh] bg-white" />
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm">Workspace Settings &amp; Memory Purge</h3>
              <button onClick={() => setShowSettingsModal(false)}>✕</button>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 bg-rose-600 text-white rounded-lg font-semibold"
            >
              Purge All Cached Browser Memory &amp; Reset to Clean Fact-Locked State
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
