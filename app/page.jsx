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
  ArrowRight,
  ArrowLeft,
  Save,
  Printer,
  Gavel,
  Trash2,
  RefreshCw
} from "lucide-react";

// ============================================================================
// 1. FLORIDA PRIVITY & STANDING STANDARDS (GROUPED + OTHER / COMPLEX)
// ============================================================================
const ALL_PRIVITY_STANDARDS = [
  {
    group: "1. Contractual & Rule 1.130 Privity",
    options: [
      { id: "direct_written", label: "Direct Written Contract / Retainer / Engagement (Fla. R. Civ. P. 1.130(a))" },
      { id: "exclusive_possession", label: "Written Instrument in Defendant's Exclusive Possession (Sachse Exception)" },
      { id: "oral_contract", label: "Oral / Verbal Agreement & Course of Dealing (Fla. Stat. § 95.11(3)(k))" },
      { id: "implied_quasi", label: "Implied-in-Fact / Quasi-Contract / Unjust Enrichment" }
    ]
  },
  {
    group: "2. Third-Party Beneficiary & Financial Reliance",
    options: [
      { id: "intended_tpb", label: "Intended Third-Party Beneficiary — Express Intent (Espinosa v. Sparber)" },
      { id: "restatement_552", label: "Known Third-Party / Member Financial Reliance (Max Mitchell / Restatement § 552)" }
    ]
  },
  {
    group: "3. Statutory & Privilege-Waiver Privity (CPAs & Attorneys)",
    options: [
      { id: "joint_client_cpa", label: "Joint Client / Common Entity Member Privity — CPA (§ 473.316(4)(c))" },
      { id: "client_records_473", label: "Direct Statutory Client Records Ownership (§ 473.318 & F.A.C. 61H1-23.002)" },
      { id: "crime_fraud", label: "Crime-Fraud Privilege Exception (Fla. Stat. § 473.316(4)(a) / § 90.502(4)(a))" },
      { id: "joint_client_atty", label: "Joint Representation / Common Interest Exception — Attorney (§ 90.502(4)(c))" }
    ]
  },
  {
    group: "4. Corporate, LLC & Fiduciary Privity",
    options: [
      { id: "dinuro_direct", label: "Direct Harm + Special Statutory/Contractual Duty (Dinuro Two-Prong Test)" },
      { id: "llc_corp_fiduciary", label: "Statutory Fiduciary Duty of Loyalty & Care (§ 605.04091 / § 607.0830)" },
      { id: "safe_harbor_pierce", label: "Undisclosed Self-Dealing Stripping Safe Harbor Immunity (§ 607.0832)" },
      { id: "statutory_inspection", label: "Statutory Right to Inspect Corporate Books & Tax Records (§ 607.1602)" }
    ]
  },
  {
    group: "5. Vicarious, Tortious & Multi-Defendant Substitutes",
    options: [
      { id: "aiding_abetting", label: "Aiding & Abetting Fiduciary Breach — Actual Knowledge + Assistance (SFM Holdings)" },
      { id: "civil_conspiracy", label: "Civil Conspiracy — Agreement + Overt Tortious Act in Furtherance" },
      { id: "alter_ego_veil", label: "Alter Ego / Piercing Corporate Veil / Interlocking DBA (Dania Jai-Alai)" },
      { id: "implied_fiduciary", label: "Implied Fiduciary Relationship — Reposed Trust Accepted by Defendant" }
    ]
  },
  {
    group: "6. Other / Complex Multi-Layered Privity",
    options: [
      { id: "other_complex", label: "Other / Complex Multi-Layered Privity (Specify Custom Legal & Factual Basis Below)" }
    ]
  }
];

const getPrivityLabel = (id) => {
  for (const grp of ALL_PRIVITY_STANDARDS) {
    const found = grp.options.find((o) => o.id === id);
    if (found) return found.label;
  }
  return id;
};

const PROFESSION_CONFIGS = {
  attorney: {
    label: "Attorney / Law Firm",
    governingRules: "Rules Regulating Fla. Bar (Ch. 4) & Fla. Stat. § 95.11(4)(a)",
    sol: "2 Years (Fla. Stat. § 95.11(4)(a))"
  },
  cpa: {
    label: "CPA / Accounting Firm",
    governingRules: "Fla. Stat. Ch. 473 & F.A.C. R. 61H1-23.002",
    sol: "2 Years from Discovery (Fla. Stat. § 95.11(4)(a))"
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
    governingRules: "Fla. Stat. § 687.0304 (Banking Statute of Frauds) & UCC Art. 9",
    sol: "5 Years (Fla. Stat. § 95.11(2)(b))"
  }
};

// ============================================================================
// 2. INITIAL STATE DATA (APRIL I. HALLE, ESQ. & ENGLEBERG, CPA)
// ============================================================================
const INITIAL_DEFENDANTS = [
  {
    id: "def-1",
    name: "April I. Halle, Esq.",
    entityName: "The Halle Law Firm, P.A. (hallelaw.com)",
    profession: "attorney",
    privityType: "joint_client_atty",
    customPrivityDetails: "Joint representation / common interest exception under Fla. Stat. § 90.502(4)(c) and aiding/abetting fiduciary breach with actual knowledge of Delray Beach DBA & Broward corporate record concealment.",
    suedCapacity: "both",
    specificBreach: "Represented conflicting corporate and individual interests simultaneously under Rule 4-1.7, facilitated unauthorized record transfers, and actively concealed material corporate transactions from Plaintiff.",
    dateLastAction: "2026-02-10",
    discoveryDate: "2026-03-01",
    evidence: "EXHIBIT A: Retainer Communications & Corporate Filings",
    witnesses: "Records Custodian, Sunbiz Filing Agent",
    otherDefendants: "Engleberg, CPA"
  },
  {
    id: "def-2",
    name: "Engleberg, CPA",
    entityName: "Engleberg Accounting P.A.",
    profession: "cpa",
    privityType: "joint_client_cpa",
    customPrivityDetails: "Joint client & equity holder standing under Fla. Stat. § 473.316(4)(c) combined with mandatory client record return duties under § 473.318 and F.A.C. 61H1-23.002, plus third-party lender reliance triangle.",
    suedCapacity: "both",
    specificBreach: "Withheld corporate tax filings, general ledgers, and accounting workpapers in violation of Fla. Stat. § 473.318 and F.A.C. R. 61H1-23.002 while transmitting unauthorized financial disclosures to outside lenders.",
    dateLastAction: "2026-01-15",
    discoveryDate: "2026-02-01",
    evidence: "EXHIBIT B: Written Records Demand & Lender Disclosure Emails",
    witnesses: "Corporate Bookkeeper, Third-Party Loan Officer",
    otherDefendants: "April I. Halle, Esq., Managing Directors"
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
    filer: "Defense Counsel (April I. Halle, Esq. / Engleberg, CPA)",
    dateFiled: "2026-09-18",
    extractedAttack: "Dinuro Derivative Bar / Rule 1.130 Exhibit Trap / Intra-Corporate Conspiracy",
    summary: "Argues claims are derivative under Dinuro rather than direct, asserts intra-corporate conspiracy bar, and claims failure to attach complete contract instruments under Rule 1.130(a)."
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
    count: "Count I & II: Breach of Fiduciary Duty & Corporate Mismanagement",
    defenseAttack: "Dinuro Derivative Standing Bar & Business Judgment Rule",
    defenseGrounds: "Defense (April I. Halle, Esq. & co-defendants) argues injury flowed to the entity first and Plaintiff only suffered indirect member diminution in value under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014).",
    howToOvercome: "Plead BOTH prongs of Dinuro with surgical ultimate facts: (1) Direct harm unique to Plaintiff individually (freeze-out of distributions, personal tax liability, deprivation of statutory inspection rights under § 607.1602 / § 605.0410), and (2) Separate statutory or contractual duty owed directly to Plaintiff.",
    controllingLaw: "Dinuro Invs., LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014); Strazzulla v. Riverside Banking Co., 175 So. 3d 879 (Fla. 4th DCA 2015)."
  },
  {
    id: "dp-2",
    count: "Count III: Director / Manager Conflict Transactions",
    defenseAttack: "Statutory Director Safe Harbor Immunity (Fla. Stat. § 607.0832)",
    defenseGrounds: "Defense asserts that corporate conflict transactions are immunized under § 607.0832 and cannot be challenged individually.",
    howToOvercome: "Section 607.0832 is an affirmative defense requiring proof that material facts were fully disclosed OR that the transaction was fair at the time authorized. On a Motion to Dismiss, the court is confined to the Four Corners of the Complaint (Rule 1.140). Plead ultimate facts of secret self-dealing, active concealment, and lack of disinterested approval.",
    controllingLaw: "Fla. Stat. § 607.0832; Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056 (Fla. 3d DCA 2018)."
  },
  {
    id: "dp-3",
    count: "Count IV: CPA Malpractice, Aiding & Abetting & Record Withholding",
    defenseAttack: "Ultramares Privity Bar & Accountant-Client Privilege (§ 473.316)",
    defenseGrounds: "Engleberg, CPA argues he was retained solely by the entity, owes no duty to Plaintiff individually, and communications/ledgers are privileged under Fla. Stat. § 473.316.",
    howToOvercome: "Invoke three statutory hooks: (1) F.A.C. R. 61H1-23.002 & Fla. Stat. § 473.318 mandate return of client records upon request; (2) Fla. Stat. § 473.316(4)(c) abolishes accountant privilege in disputes between parties claiming through the same joint client/entity; (3) § 473.316(4)(a) abolishes privilege when services were sought to aid a fraud or tort.",
    controllingLaw: "Fla. Stat. §§ 473.316(4)(a), (4)(c), 473.318; F.A.C. R. 61H1-23.002; Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016)."
  }
];

const JUDGE_TEMPLATES = [
  {
    id: "tpl-rehearing",
    name: "Rule 1.530 Motion for Rehearing & To Vacate Dismissal",
    category: "Post-Order Relief (15-Day Jurisdictional Deadline)",
    divisionRules: "17th Cir. Div. 25 (Judge Olefson) • 12pt Times New Roman • Double-Spaced • Mandatory CMS Upload",
    description: "Challenges an order of dismissal with prejudice where the court relied on defense factual assertions outside the four corners of the complaint or denied leave to amend under Rule 1.190(a)."
  },
  {
    id: "tpl-4th-amended",
    name: "Verified Amended Complaint (Fact-Pleading & Rule 1.130 Compliant)",
    category: "Initial / Amended Pleading",
    divisionRules: "Fla. R. Civ. P. 1.110(b) Ultimate Facts • Rule 1.130 Exhibit Designation • Fla. Stat. § 92.525 Verification",
    description: "Full multi-count Circuit Civil complaint separating each defendant by count, pleading Dinuro direct harm, § 473.316(4) privilege waivers, and § 607.0832 bad-faith facts."
  },
  {
    id: "tpl-mtd-opposition",
    name: "Memorandum of Law in Opposition to Motion to Dismiss",
    category: "Defensive Response",
    divisionRules: "17th Cir. Local Rule 10A • 10-Page Limit • Case Law Citator • Four Corners Standard",
    description: "Point-by-point response refuting defense privity, safe harbor, and derivative standing arguments with binding 4th DCA precedent."
  },
  {
    id: "tpl-rfp",
    name: "Plaintiff's First Request for Production of Documents (Rule 1.350)",
    category: "Formal Discovery",
    divisionRules: "Fla. R. Civ. P. 1.280 & 1.350 • 30-Day Response Deadline • ESI & Native Ledger Metadata",
    description: "Demands native QuickBooks/general ledger files, CPA workpapers (§ 473.318), lender communications, and Delray Beach / Broward corporate records."
  }
];

const sanitizeLegacyNames = (raw) => {
  if (typeof raw !== "string") return raw;
  return raw
    .replace(/RICHARD HALLE,\s*ESQ\./gi, "APRIL I. HALLE, ESQ.")
    .replace(/Richard Halle,\s*Esq\./gi, "April I. Halle, Esq.")
    .replace(/Richard Halle/gi, "April I. Halle, Esq.")
    .replace(/Halle & Associates PA/gi, "The Halle Law Firm, P.A.");
};

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================
export default function FloridaProSeLitigationApp() {
  const [activeNav, setActiveNav] = useState("intake");
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [intakeSubTab, setIntakeSubTab] = useState("defendants");
  const [plaintiff, setPlaintiff] = useState("Tina Diane Lee");
  const [syncNotification, setSyncNotification] = useState(null);

  const notifySync = (msg) => {
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setSyncNotification(`${msg} (${t})`);
    setTimeout(() => setSyncNotification(null), 3500);
  };

  // State across all tabs
  const [defendantsList, setDefendantsList] = useState(INITIAL_DEFENDANTS);
  const [activeDefId, setActiveDefId] = useState("def-1");
  const [filedPleadings, setFiledPleadings] = useState(INITIAL_FILED_PLEADINGS);
  const [newFiledTitle, setNewFiledTitle] = useState("");
  const [newFiledFiler, setNewFiledFiler] = useState("Defense Counsel");
  const [newFiledSummary, setNewFiledSummary] = useState("");
  const [defensePlaybook, setDefensePlaybook] = useState(INITIAL_DEFENSE_PLAYBOOK);
  const [defenseChatMsgs, setDefenseChatMsgs] = useState([
    {
      sender: "assistant",
      text: "Defense Playbook AI ready. Live Intake Roster loaded (April I. Halle, Esq. & Engleberg, CPA). Ask how to defeat any defense motion or objection."
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
      title: "2. Overcoming CPA & Attorney Privity / Privilege (§ 473.316 & § 90.502)",
      body: "As to Engleberg, CPA and April I. Halle, Esq.: Under Fla. Stat. § 473.316(4)(c) and § 90.502(4)(c), privilege does not apply in joint-client/common-interest disputes or crime/fraud contexts (§ 473.316(4)(a)). Under F.A.C. R. 61H1-23.002 and § 473.318, withholding client general ledgers and workpapers is a statutory breach."
    },
    {
      id: "pp-3",
      title: "3. Direct Member Standing Under Dinuro (Direct vs. Derivative)",
      body: "Plead individualized harm: personal tax liability, targeted freeze-out from distributions, and deprivation of statutory inspection rights under Fla. Stat. § 607.1602 / § 605.0410 (Dinuro Invs., LLC v. Camacho, 141 So. 3d 731)."
    }
  ]);
  const [customPlaintiffNote, setCustomPlaintiffNote] = useState("");

  const [matterCounts, setMatterCounts] = useState([
    {
      id: "cnt-1",
      countNum: "Count I",
      title: "Breach of Fiduciary Duty, Conflict of Interest & Direct Harm",
      defendantName: "April I. Halle, Esq. (The Halle Law Firm, P.A.)",
      authority: "Rules Regulating Fla. Bar 4-1.7; Fla. Stat. § 90.502(4)(c); Dinuro Invs. v. Camacho",
      privityHook: "Joint Representation Exception (§ 90.502(4)(c)) & Direct Special Injury",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-2",
      countNum: "Count II",
      title: "Equitable Accounting & Statutory Record Inspection",
      defendantName: "April I. Halle, Esq. & Engleberg, CPA",
      authority: "Fla. Stat. § 607.1602; F.A.C. R. 61H1-23.002",
      privityHook: "Statutory Inspection Right & Direct Member Ownership",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-3",
      countNum: "Count III",
      title: "Civil Conspiracy & Aiding/Abetting Breach of Fiduciary Duty",
      defendantName: "April I. Halle, Esq. & Engleberg, CPA",
      authority: "SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327",
      privityHook: "Actual Knowledge + Substantial Assistance in Withholding Records",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-4",
      countNum: "Count IV",
      title: "CPA Professional Malpractice & Statutory Record Withholding",
      defendantName: "Engleberg, CPA",
      authority: "Fla. Stat. §§ 473.316(4)(a)/(c), 473.318; F.A.C. R. 61H1-23.002; Dattoma v. Laughlin",
      privityHook: "Joint Client Privity Exception & Mandatory Client Record Ownership",
      status: "Rule 1.530 Rehearing Pending (Due Oct 20)"
    }
  ]);

  const [evidenceItems, setEvidenceItems] = useState([
    {
      id: "ev-1",
      defendantId: "def-1",
      exhibitLabel: "EXHIBIT A",
      title: "April I. Halle, Esq. Retainer & Delray Beach DBA Corporate Records",
      batesRange: "LEE-EXA-0001 to LEE-EXA-0016",
      capturedMetadata: "FL-DOS-Sunbiz Certified Record • Linked to April I. Halle, Esq. (hallelaw.com)",
      downloadedTimestamp: "2026-10-17 08:12:30 EDT"
    },
    {
      id: "ev-2",
      defendantId: "def-2",
      exhibitLabel: "EXHIBIT B",
      title: "Formal Written Demand for CPA Workpapers & Lender Emails",
      batesRange: "LEE-EXB-0017 to LEE-EXB-0032",
      capturedMetadata: "SHA256 Verified • Linked to Engleberg, CPA",
      downloadedTimestamp: "2026-10-16 14:22:05 EDT"
    }
  ]);
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvExhibit, setNewEvExhibit] = useState("EXHIBIT C");

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
      title: "Overcoming Oct 5 Dismissal of Count IV & April I. Halle / Engleberg Privity",
      date: "2026-10-17",
      messages: [
        {
          sender: "user",
          text: "How do we overcome the Oct 5 dismissal of Count IV and establish privity against April I. Halle, Esq. and Engleberg, CPA?"
        },
        {
          sender: "assistant",
          text: "1. Four Corners Rule (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173): The trial court cannot rely on unsworn defense statements or resolve unpled affirmative defenses like § 607.0832 on a Motion to Dismiss.\n2. Engleberg, CPA Privity & Privilege Waiver: Invoke Fla. Stat. § 473.316(4)(c) (joint client), § 473.316(4)(a) (crime/fraud), and mandatory record return duties under § 473.318 & F.A.C. 61H1-23.002.\n3. April I. Halle, Esq. Privity & Aiding/Abetting: Invoke joint representation (§ 90.502(4)(c)), Rule 4-1.7 conflict of interest, and aiding/abetting breach of fiduciary duty under SFM Holdings."
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
      status: "Filed / Active",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25 (Hon. Shari Africk Olefson)\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nAPRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nVERIFIED FOURTH AMENDED COMPLAINT FOR DAMAGES AND DEMAND FOR JURY TRIAL\n\nPlaintiff, TINA DIANE LEE, pro se, sues Defendants APRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., and ENGLEBERG, CPA, and alleges ultimate facts pursuant to Fla. R. Civ. P. 1.110(b):\n\n1. This is an action for damages exceeding $50,000.00 within the jurisdiction of this Court under Fla. Stat. § 26.012.\n2. Pursuant to Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014), Plaintiff brings direct claims for individualized pecuniary harm and deprivation of statutory inspection rights.\n3. Defendant April I. Halle, Esq. breached fiduciary duties of loyalty and non-conflicted representation (Rule 4-1.7) and aided/abetted corporate record concealment.\n4. Defendant Engleberg, CPA violated Fla. Stat. § 473.318 and F.A.C. R. 61H1-23.002 by withholding client general ledgers and workpapers while releasing unverified financials to third-party lenders.\n\nUnder penalties of perjury pursuant to Fla. Stat. § 92.525, I declare that I have read the foregoing and the facts stated are true.\n\nBy: /s/ Tina Diane Lee`
    },
    {
      id: "draft-2",
      title: "Rule 1.530 Motion for Rehearing (Oct 5 Order Dismissing Count IV)",
      updatedAt: "2026-10-17",
      type: "Motion for Rehearing",
      status: "Urgent (Due Oct 20)",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nAPRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nPLAINTIFF'S TIMELY MOTION FOR REHEARING AND TO VACATE OCTOBER 5, 2026 ORDER DISMISSING COUNT IV WITH PREJUDICE PURSUANT TO FLA. R. CIV. P. 1.530\n\n1. Served within the strict 15-day jurisdictional window under Fla. R. Civ. P. 1.530(b).\n2. The October 5 Order erred by looking outside the four corners of the complaint (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173) and applying corporate director safe harbor (§ 607.0832) to an outside CPA despite statutory duties under § 473.318, § 473.316(4)(a)/(c), and F.A.C. R. 61H1-23.002.\n\nBy: /s/ Tina Diane Lee`
    }
  ]);
  const [activeDraftId, setActiveDraftId] = useState("draft-1");

  const [selectedTemplateId, setSelectedTemplateId] = useState("tpl-rehearing");
  const [respondingToFilingId, setRespondingToFilingId] = useState("filed-1");

  const [memorandaList, setMemorandaList] = useState([
    {
      id: "memo-1",
      title: "Memorandum of Law: Rule 1.530 Rehearing & Vacation of Count IV Dismissal",
      targetCount: "Count IV (Engleberg, CPA & April I. Halle, Esq.)",
      targetFiling: "Order Dismissing Count IV With Prejudice (Oct 5, 2026)",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25 (Hon. Shari Africk Olefson)\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nAPRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nPLAINTIFF'S MEMORANDUM OF LAW IN SUPPORT OF RULE 1.530 MOTION FOR REHEARING AND TO VACATE DISMISSAL OF COUNT IV WITH PREJUDICE\n\nI. FOUR CORNERS STANDARD OF REVIEW\nOn a Rule 1.140(b)(6) motion to dismiss, the trial court is strictly confined to the four corners of the complaint and may not rely on unsworn factual assertions of defense counsel (April I. Halle, Esq. or counsel for Engleberg, CPA). Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000).\n\nII. FLA. STAT. § 607.0832 DOES NOT IMMUNIZE CPAs OR UNDISCLOSED SELF-DEALING\nSection 607.0832 is an affirmative defense governing corporate directors, not outside CPAs regulated under Chapter 473. Moreover, pleading active concealment and bad faith precludes adjudication of § 607.0832 on a motion to dismiss. Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056 (Fla. 3d DCA 2018).\n\nIII. STATUTORY CPA PRIVITY & PRIVILEGE WAIVERS (§§ 473.316(4)(a), (4)(c), 473.318 & F.A.C. 61H1-23.002)\nAccountant-client privilege is waived as to joint clients/common entity members (§ 473.316(4)(c)) and crime/fraud (§ 473.316(4)(a)), and CPAs are mandated to furnish client ledgers and workpapers upon demand (§ 473.318; F.A.C. 61H1-23.002; Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016)).\n\nRespectfully submitted,\nBy: /s/ Tina Diane Lee`
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

  // Load & Sanitize Browser Memory on Mount
  useEffect(() => {
    try {
      const loadClean = (key, setter) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          const cleaned = sanitizeLegacyNames(raw);
          setter(JSON.parse(cleaned));
          localStorage.setItem(key, cleaned);
        }
      };
      loadClean("fl_prose_defendants", setDefendantsList);
      loadClean("fl_prose_drafts", setSavedDrafts);
      loadClean("fl_prose_matter_counts", setMatterCounts);
      loadClean("fl_prose_memoranda", setMemorandaList);
      loadClean("fl_prose_evidence", setEvidenceItems);
      loadClean("fl_prose_filed_docs", setFiledPleadings);
      loadClean("fl_prose_defense_pb", setDefensePlaybook);
      loadClean("fl_prose_plaintiff_pb", setPlaintiffPlaybookCards);

      const sig = localStorage.getItem("fl_prose_sig_text");
      if (sig) setSignatureText(sig);
      const sigImg = localStorage.getItem("fl_prose_sig_img");
      if (sigImg) setSignatureImage(sigImg);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const selectedDef = useMemo(
    () => defendantsList.find((d) => d.id === activeDefId) || defendantsList[0],
    [defendantsList, activeDefId]
  );
  const currentProfConfig = PROFESSION_CONFIGS[selectedDef?.profession] || PROFESSION_CONFIGS.attorney;
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
  // HANDLERS: SAVE & SYNC ACROSS ALL TABS
  // ============================================================================
  const handleUpdateDefField = (field, val) => {
    setDefendantsList((prev) =>
      prev.map((d) => (d.id === selectedDef.id ? { ...d, [field]: val } : d))
    );
  };

  const handleSaveIntakeAndSyncAll = () => {
    try {
      localStorage.setItem("fl_prose_defendants", JSON.stringify(defendantsList));

      const syncedCounts = defendantsList.map((d, idx) => {
        const pCfg = PROFESSION_CONFIGS[d.profession] || PROFESSION_CONFIGS.attorney;
        const pDesc = `${getPrivityLabel(d.privityType)}${
          d.customPrivityDetails ? ` — ${d.customPrivityDetails}` : ""
        }`;
        return {
          id: `cnt-sync-${d.id}`,
          countNum: `Count ${idx + 1}`,
          title: `${pCfg.label} Malpractice, Breach of Duty & Record Concealment`,
          defendantName: `${d.name} (${d.entityName || pCfg.label})`,
          authority: pCfg.governingRules,
          privityHook: `${pDesc} • Last Action: ${d.dateLastAction}`,
          status: `Synced from Intake (${d.evidence})`
        };
      });
      setMatterCounts(syncedCounts);
      localStorage.setItem("fl_prose_matter_counts", JSON.stringify(syncedCounts));

      const profCfg = PROFESSION_CONFIGS[selectedDef.profession] || PROFESSION_CONFIGS.attorney;
      const newCard = {
        id: `pp-def-${selectedDef.id}`,
        title: `Live Intake Strategy: ${selectedDef.name} (${selectedDef.entityName || profCfg.label})`,
        body: `Governing Law: ${profCfg.governingRules}.\nPrivity Hook: ${getPrivityLabel(selectedDef.privityType)} (${selectedDef.customPrivityDetails || "Direct"}). Breach (${selectedDef.dateLastAction}): ${selectedDef.specificBreach}. Exhibit: ${selectedDef.evidence}.`
      };
      const updatedPb = [newCard, ...plaintiffPlaybookCards.filter((p) => p.id !== newCard.id)];
      setPlaintiffPlaybookCards(updatedPb);
      localStorage.setItem("fl_prose_plaintiff_pb", JSON.stringify(updatedPb));

      notifySync(`✓ Intake Saved! Synced ${defendantsList.map((d) => d.name).join(" & ")} Across All Tabs`);
    } catch (e) {}
  };

  const handleAiGenerateMemorandum = () => {
    const targetFiling = filedPleadings.find((f) => f.id === memoSelectedFilingId) || filedPleadings[0];
    const targetCountObj =
      memoSelectedCountId === "all"
        ? {
            countNum: "All Counts (Omnibus)",
            title: "All Pled Causes of Action",
            defendantName: defendantsList.map((d) => d.name).join(", "),
            authority: "Fla. R. Civ. P. 1.110(b), 1.130(a), 1.530; Fla. Stat. §§ 473.316(4), 473.318, 90.502(4), 607.0832; Dinuro Invs. v. Camacho",
            privityHook: "Multi-Tiered Contractual, Statutory & Fiduciary Privity"
          }
        : matterCounts.find((c) => c.id === memoSelectedCountId) || matterCounts[0];

    const defDetails = defendantsList
      .map(
        (d, i) =>
          `${i + 1}. DEFENDANT ${d.name.toUpperCase()} (${d.entityName || PROFESSION_CONFIGS[d.profession]?.label}):
   • Governing Authority: ${PROFESSION_CONFIGS[d.profession]?.governingRules}
   • Privity & Standing Hook: ${getPrivityLabel(d.privityType)}${d.customPrivityDetails ? ` — ${d.customPrivityDetails}` : ""}
   • Ultimate Facts of Breach (${d.dateLastAction}, discovered ${d.discoveryDate}): ${d.specificBreach}
   • Rule 1.130 Evidence & Witnesses: ${d.evidence} | Witnesses: ${d.witnesses} | Co-Defendants: ${d.otherDefendants}`
      )
      .join("\n\n");

    const batesBlock = evidenceItems
      .map((ev) => `   • ${ev.exhibitLabel}: ${ev.title} [Bates: ${ev.batesRange}] (${ev.downloadedTimestamp})`)
      .join("\n");

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
• TARGET DEFENDANTS: ${defendantsList.map((d) => d.name).join(" | ")}
• REFERENCED FILING: ${targetFiling.title} (${targetFiling.dateFiled})

I. QUESTION PRESENTED & FOUR CORNERS STANDARD
Whether under Florida's strict Four Corners Rule (Fla. R. Civ. P. 1.140(b) and Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)), Plaintiff's verified ultimate facts, statutory privilege exceptions (§ 473.316(4) & § 90.502(4)), and Rule 1.130(a) exhibits establish actionable standing and privity against ${defendantsList.map((d) => d.name).join(" and ")}, precluding dismissal as a matter of Florida law.

II. LIVE INTAKE DEFENDANTS, PRIVITY HOOKS & ULTIMATE FACTS
${defDetails}

III. CONTROLLING FLORIDA STATUTES & 4TH DCA AUTHORITIES OVERCOMING DEFENSE OBJECTIONS
${defensePlaybook.map((dp, i) => `${i + 1}. Overcoming "${dp.defenseAttack}" (${dp.count}): ${dp.howToOvercome} (${dp.controllingLaw})`).join("\n\n")}

IV. RULE 1.130(a) EXHIBIT & BATES INDEX
${batesBlock}

WHEREFORE, Plaintiff respectfully requests that this Honorable Court grant Plaintiff's ${memoSelectedMotionType}, together with taxable costs under Fla. Stat. § 57.041 and reciprocal fees under § 57.105(7).

Respectfully submitted on October 17, 2026,

By: ${signatureText}
${plaintiff}, Pro Se
Email: service@allegedlylegal.com`;

    const newMemo = {
      id: `memo-${Date.now()}`,
      title: `Memorandum: ${targetCountObj.countNum} (${defendantsList.map((d) => d.name).join(", ")})`,
      targetCount: `${targetCountObj.countNum}: ${targetCountObj.title}`,
      targetFiling: targetFiling.title,
      content: text
    };
    const updated = [newMemo, ...memorandaList];
    setMemorandaList(updated);
    setActiveMemoId(newMemo.id);
    try {
      localStorage.setItem("fl_prose_memoranda", JSON.stringify(updated));
    } catch (e) {}
    notifySync(`✓ AI Generated Memorandum for ${targetCountObj.countNum} Using Live Intake`);
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

  const handleBuildTemplateToDraft = (tplId) => {
    const tpl = JUDGE_TEMPLATES.find((t) => t.id === (tplId || selectedTemplateId)) || JUDGE_TEMPLATES[0];
    const refDoc = filedPleadings.find((f) => f.id === respondingToFilingId) || filedPleadings[0];

    const content = `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT
IN AND FOR BROWARD COUNTY, FLORIDA

CASE NO.: CACE-26-XXXXXX
DIVISION: 25 (Hon. Shari Africk Olefson)

${plaintiff.toUpperCase()},
    Plaintiff,
v.
${liveCaptionDefendants}, et al.,
    Defendants.
__________________________________________/

${tpl.name.toUpperCase()}
(Responding to: ${refDoc.title})

Plaintiff, ${plaintiff.toUpperCase()}, pro se, files this ${tpl.name} in accordance with 17th Judicial Circuit Division 25 Procedures:

I. SYNCED INTAKE DEFENDANTS & PRIVITY HOOKS (FLA. R. CIV. P. 1.110(b))
${defendantsList
  .map(
    (d, i) =>
      `${i + 1}. ${d.name} (${d.entityName}): Privity via ${getPrivityLabel(d.privityType)}${
        d.customPrivityDetails ? ` (${d.customPrivityDetails})` : ""
      }. Breach (${d.dateLastAction}): ${d.specificBreach}. Exhibit: ${d.evidence}.`
  )
  .join("\n\n")}

II. CONTROLLING FLORIDA AUTHORITIES
${plaintiffPlaybookCards.map((c) => `• ${c.title}: ${c.body}`).join("\n\n")}

LOCAL RULE 10A & RULE 2.516 CERTIFICATE
I HEREBY CERTIFY good-faith conferral and e-portal service on October 17, 2026.

By: ${signatureText}
${plaintiff}, Pro Se`;

    const newDraft = {
      id: `draft-${Date.now()}`,
      title: `${tpl.name} (${defendantsList.map((d) => d.name).join(", ")})`,
      updatedAt: "2026-10-17",
      type: tpl.category,
      status: "Division 25 Ready",
      content
    };
    const updated = [newDraft, ...savedDrafts];
    setSavedDrafts(updated);
    setActiveDraftId(newDraft.id);
    setActiveNav("editor");
    try {
      localStorage.setItem("fl_prose_drafts", JSON.stringify(updated));
    } catch (e) {}
    notifySync("✓ Template Built with Live Intake Defendants & Opened in Editor");
  };

  const generateAiReply = (q) => {
    const summary = defendantsList
      .map((d) => `• ${d.name} (${d.entityName}): ${getPrivityLabel(d.privityType)} | Breach: ${d.specificBreach}`)
      .join("\n");
    return `FLORIDA LEGAL AI (LIVE INTAKE ROSTER SYNCED):\n${summary}\n\nControlling Authorities Applied:\n1. Four Corners Rule (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173): Extrinsic defense assertions and unpled § 607.0832 safe harbors are barred on a Motion to Dismiss.\n2. Statutory Privity & Privilege Waivers: Fla. Stat. § 473.316(4)(a)/(c), § 473.318, F.A.C. R. 61H1-23.002 (Engleberg, CPA) and § 90.502(4)(a)/(c), Rule 4-1.7, SFM Holdings (April I. Halle, Esq.).`;
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
                { id: "defense_playbook", label: "2. Defense Playbook", icon: ShieldCheck },
                { id: "plaintiff_playbook", label: "3. Plaintiffs Playbook", icon: BookOpen },
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
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
              <span>Live Intake Roster</span>
              <span className="text-emerald-700">{defendantsList.length} Active</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {defendantsList.map((d) => (
                <div key={d.id} className="text-[10px] font-semibold text-slate-800 truncate">
                  • {d.name}
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
              <h1 className="font-semibold text-xs sm:text-sm text-slate-900">
                Florida Circuit Civil Pro Se Litigation Studio
              </h1>
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

        {/* TAB 4: INTAKE */}
        {activeNav === "intake" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="border-b border-slate-200 px-6 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6 text-xs font-semibold">
                <button
                  onClick={() => setIntakeSubTab("defendants")}
                  className={`py-2 border-b-2 ${intakeSubTab === "defendants" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
                >
                  Defendant Profession & Privity Intake ({defendantsList.length})
                </button>
                <button
                  onClick={() => setIntakeSubTab("cases")}
                  className={`py-2 border-b-2 ${intakeSubTab === "cases" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
                >
                  Cases & Mail Queue (0)
                </button>
              </div>
              <button
                onClick={handleSaveIntakeAndSyncAll}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" /> Save Defendant & Sync All Tabs
              </button>
            </div>

            {intakeSubTab !== "defendants" ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="font-serif text-base font-medium text-slate-800">Nothing at the door</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Email sent to service@allegedlylegal.com lands here before becoming a matter.
                </p>
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
                          evidence: "EXHIBIT C: Corporate Records",
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
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {currentProfConfig.governingRules}
                          </span>
                          {defendantsList.length > 1 && (
                            <button
                              onClick={() => {
                                const filtered = defendantsList.filter((d) => d.id !== selectedDef.id);
                                setDefendantsList(filtered);
                                setActiveDefId(filtered[0].id);
                              }}
                              className="text-rose-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Capacity Sued In</label>
                        <select
                          value={selectedDef.suedCapacity || "both"}
                          onChange={(e) => handleUpdateDefField("suedCapacity", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                        >
                          <option value="both">Both Individual & Corporate/Professional Capacity</option>
                          <option value="individual">Individual Capacity Only</option>
                          <option value="corporate">Corporate / Firm Capacity Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Date of Last Action</label>
                        <input
                          type="date"
                          value={selectedDef.dateLastAction}
                          onChange={(e) => handleUpdateDefField("dateLastAction", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                    </div>

                    {/* All Privity Standards + Other / Complex */}
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                      <label className="text-xs font-bold uppercase text-emerald-950 block">
                        Step 2: Privity & Standing Standard (All Florida Doctrines + Other/Complex)
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
                          {selectedDef.privityType === "other_complex"
                            ? "★ Specify Other / Complex Multi-Layered Privity Facts & Legal Hooks:"
                            : "Complex Privity / Multi-Tiered Standing Particulars (Synced to AI & Memoranda):"}
                        </label>
                        <textarea
                          rows={2}
                          value={selectedDef.customPrivityDetails || ""}
                          onChange={(e) => handleUpdateDefField("customPrivityDetails", e.target.value)}
                          placeholder="Detail complex privity chains (e.g., Delray Beach DBA records, joint-client representation, third-party lender reliance triangle, or Sachse exclusive possession)..."
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Specific Breach & Ultimate Facts (Fla. R. Civ. P. 1.110(b))
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
                    Library Tab 6 • Printable 12pt Court Memorandum Builder
                  </span>
                  <h2 className="text-sm font-bold text-slate-900 mt-1">
                    AI Memorandum of Law (Synced with {defendantsList.map((d) => d.name).join(" & ")})
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAiGenerateMemorandum}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Fill Memorandum Using Live Intake
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
                    Rule 1.530 Motion for Rehearing & To Vacate Dismissal
                  </option>
                  <option value="Opposition to Defendants' Motion to Dismiss">
                    Opposition to Defendants&apos; Motion to Dismiss (Four Corners & Privity)
                  </option>
                  <option value="Motion to Compel CPA Workpapers & Corporate Ledgers (Rule 1.380)">
                    Motion to Compel CPA Workpapers & Corporate Ledgers (§ 473.318)
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
              <button
                onClick={() => notifySync("✓ AI History Synced to Playbook")}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save & Sync Thread
              </button>
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
                placeholder="Ask about April I. Halle, Esq., Engleberg, CPA, Privity, or Count IV..."
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
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Recent Pleading Drafts</h2>
                <button
                  onClick={() => notifySync("✓ All Drafts Saved to Memory")}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save All Drafts
                </button>
              </div>
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
                  localStorage.setItem("fl_prose_drafts", JSON.stringify(savedDrafts));
                  notifySync("✓ Draft Saved & Synced");
                }}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save & Sync
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-semibold text-slate-900">Good afternoon, Tina.</h2>
                  <p className="text-xs text-slate-500">Saturday, October 17, 2026 • Google Calendar & Gmail Synced</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCalTitle}
                    onChange={(e) => setNewCalTitle(e.target.value)}
                    placeholder="New deadline..."
                    className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                  />
                  <input
                    type="date"
                    value={newCalDate}
                    onChange={(e) => setNewCalDate(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                  />
                  <button
                    onClick={() => {
                      if (!newCalTitle.trim()) return;
                      setCalendarEvents((prev) => [...prev, { id: `c-${Date.now()}`, date: newCalDate, title: newCalTitle, type: "Deadline" }]);
                      setNewCalTitle("");
                      notifySync("✓ Deadline Saved & Synced");
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    + Save Deadline
                  </button>
                </div>
              </div>
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
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    CACE Lee vs {defendantsList.map((d) => d.name).join(", ")}
                  </h2>
                  <p className="text-xs text-slate-500">17th Judicial Circuit • Broward County Division 25</p>
                </div>
                <button
                  onClick={handleSaveIntakeAndSyncAll}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Sync Counts from Intake
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matterCounts.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-800">{c.countNum}: {c.title}</span>
                    <p className="text-slate-700 font-semibold">Target: {c.defendantName}</p>
                    <p className="text-[11px] text-slate-600">Authority: {c.authority}</p>
                    <p className="text-[11px] text-slate-600">Privity: {c.privityHook}</p>
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
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center block cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600">Upload Signature Image (PNG/JPG/WebP)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => {
                      setSignatureImage(r.result);
                      localStorage.setItem("fl_prose_sig_img", r.result);
                    };
                    r.readAsDataURL(f);
                  }}
                  className="hidden"
                />
              </label>
              {signatureImage && <img src={signatureImage} alt="Signature" className="max-h-16 mx-auto" />}
              <input
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-serif"
              />
              <button
                onClick={() => {
                  localStorage.setItem("fl_prose_sig_text", signatureText);
                  notifySync("✓ Signature Saved & Synced Across All Pleadings");
                }}
                className="w-full py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Save Signature & Apply to All Docs
              </button>
            </div>
          </div>
        )}

        {/* LIBRARY 1: FILED DRAFTS / ORDERS */}
        {activeNav === "filed_drafts" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">Log Filed Pleading / Order for Defense Playbook</h2>
                  <button
                    onClick={() => {
                      if (!newFiledTitle.trim()) return;
                      const doc = {
                        id: `f-${Date.now()}`,
                        title: newFiledTitle,
                        filer: newFiledFiler,
                        dateFiled: "2026-10-17",
                        extractedAttack: "Synced Defense Objection",
                        summary: newFiledSummary
                      };
                      setFiledPleadings((prev) => [doc, ...prev]);
                      setNewFiledTitle("");
                      setNewFiledSummary("");
                      notifySync("✓ Filed Pleading Saved & Sent to Defense Playbook");
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save & Send to Playbook
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    value={newFiledTitle}
                    onChange={(e) => setNewFiledTitle(e.target.value)}
                    placeholder="Filing or Order Title..."
                    className="border border-slate-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    value={newFiledFiler}
                    onChange={(e) => setNewFiledFiler(e.target.value)}
                    placeholder="Filed by (e.g., April I. Halle, Esq. / Engleberg, CPA)"
                    className="border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <textarea
                  rows={2}
                  value={newFiledSummary}
                  onChange={(e) => setNewFiledSummary(e.target.value)}
                  placeholder="Summary of defense arguments or ruling..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
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
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Defense Playbook & Rebuttals</h2>
                <button
                  onClick={() => notifySync("✓ Defense Rebuttals Synced to Plaintiff's Playbook")}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save & Sync to Plaintiff Playbook
                </button>
              </div>
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
            <aside className="w-full lg:w-96 border-l border-slate-200 bg-white flex flex-col shrink-0">
              <div className="p-3 bg-slate-900 text-white text-xs font-bold">Defense Playbook AI Chat</div>
              <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs">
                {defenseChatMsgs.map((m, i) => (
                  <div key={i} className={`p-2.5 rounded-lg whitespace-pre-wrap ${m.sender === "user" ? "bg-slate-900 text-white ml-4" : "bg-slate-100 text-slate-800 mr-4"}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={defenseChatInput}
                  onChange={(e) => setDefenseChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && defenseChatInput.trim()) {
                      const q = defenseChatInput;
                      setDefenseChatMsgs((prev) => [...prev, { sender: "user", text: q }, { sender: "assistant", text: generateAiReply(q) }]);
                      setDefenseChatInput("");
                    }
                  }}
                  placeholder="Ask how to counter defense..."
                  className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs"
                />
              </div>
            </aside>
          </div>
        )}

        {/* LIBRARY 3: PLAINTIFFS PLAYBOOK */}
        {activeNav === "plaintiff_playbook" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="p-5 bg-emerald-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">Plaintiff&apos;s Master Playbook (Florida Law & 4th DCA)</h2>
                  <p className="text-xs text-emerald-100">Synced with {defendantsList.map((d) => d.name).join(" & ")}</p>
                </div>
                <button
                  onClick={() => notifySync("✓ Plaintiff's Playbook Synced to Drafts & Memoranda")}
                  className="px-3 py-1.5 bg-white text-emerald-950 rounded-lg text-xs font-bold"
                >
                  Save & Sync Playbook
                </button>
              </div>
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

        {/* LIBRARY 4: EVIDENCE VAULT & BATES */}
        {activeNav === "vault" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Evidence Vault & Automated Bates Numbering</h2>
                <div className="flex gap-2">
                  {defendantsList.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setActiveDefId(d.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeDefId === d.id ? "bg-slate-900 text-white" : "bg-white border border-slate-200"}`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={newEvExhibit}
                  onChange={(e) => setNewEvExhibit(e.target.value)}
                  className="w-32 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
                <input
                  type="text"
                  value={newEvTitle}
                  onChange={(e) => setNewEvTitle(e.target.value)}
                  placeholder={`Exhibit description for ${selectedDef.name}...`}
                  className="flex-1 border border-slate-300 rounded-lg p-2 text-xs"
                />
                <button
                  onClick={() => {
                    if (!newEvTitle.trim()) return;
                    const bates = `LEE-${newEvExhibit.replace(/\s+/g, "")}-00${evidenceItems.length + 1}0`;
                    setEvidenceItems((prev) => [
                      ...prev,
                      {
                        id: `ev-${Date.now()}`,
                        defendantId: selectedDef.id,
                        exhibitLabel: newEvExhibit,
                        title: newEvTitle,
                        batesRange: bates,
                        capturedMetadata: `Linked to ${selectedDef.name}`,
                        downloadedTimestamp: "2026-10-17 EDT"
                      }
                    ]);
                    setNewEvTitle("");
                    notifySync("✓ Exhibit Stamped with Bates & Synced to Intake");
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  + Save & Stamp Bates
                </button>
              </div>
              {evidenceItems
                .filter((e) => e.defendantId === selectedDef.id)
                .map((ev) => (
                  <div key={ev.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-800">{ev.exhibitLabel}: {ev.title}</span>
                      <p className="text-[11px] text-slate-500 font-mono">{ev.capturedMetadata} • {ev.downloadedTimestamp}</p>
                    </div>
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1 rounded text-[11px]">Bates: {ev.batesRange}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* LIBRARY 5: TEMPLATES / PROCEDURES */}
        {activeNav === "templates" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                <h2 className="text-base font-bold text-slate-900">Division 25 Judicial Procedures & Templates</h2>
                <p className="text-xs text-slate-500">
                  Pulls Live Intake ({defendantsList.map((d) => d.name).join(", ")}), Privity Standards, Bates Exhibits, and Saved Signatures.
                </p>
                <select
                  value={respondingToFilingId}
                  onChange={(e) => setRespondingToFilingId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                >
                  {filedPleadings.map((fp) => (
                    <option key={fp.id} value={fp.id}>
                      Responding to: {fp.title} ({fp.dateFiled})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JUDGE_TEMPLATES.map((tpl) => (
                  <div key={tpl.id} className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{tpl.category}</span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{tpl.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-1">{tpl.description}</p>
                    </div>
                    <button
                      onClick={() => handleBuildTemplateToDraft(tpl.id)}
                      className="w-full py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Save & Build Template Into Editor →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FLOATING AI DRAWER */}
        {aiOpen && (
          <div className="fixed bottom-4 right-4 w-96 h-[440px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs font-bold text-white">
              <span>Florida Legal AI (Live Intake Synced)</span>
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
                placeholder="Ask Florida Legal AI..."
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

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm">Workspace Settings</h3>
              <button onClick={() => setShowSettingsModal(false)}>✕</button>
            </div>
            <div>
              <label className="font-semibold block mb-1">Pro Se Litigant Name</label>
              <input
                type="text"
                value={plaintiff}
                onChange={(e) => setPlaintiff(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold"
            >
              Reset Cached Browser Memory to Defaults
            </button>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2 bg-emerald-700 text-white rounded-lg font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
