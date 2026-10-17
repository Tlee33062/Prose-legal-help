"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Scale,
  FileText,
  Download,
  BookOpen,
  Gavel,
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
  Sparkles,
  Send,
  X,
  Menu,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Upload,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Mail,
  MapPin
} from "lucide-react";

// ============================================================================
// 1. STATEWIDE FLORIDA CIRCUITS, DCAs & DEFAULT DIVISION PROCEDURES
// ============================================================================

const FLORIDA_CIRCUITS = [
  {
    id: "17th",
    circuit: "17th Judicial Circuit",
    counties: ["Broward"],
    dca: "4th DCA",
    portal: "17th Cir. CMS (Case Management System)",
    defaultConferral: "17th Cir. Local Rule 10A Mandatory Good-Faith Conferral Certificate required prior to hearing.",
    defaultFormatting: "12pt Times New Roman, Double-Spaced, 1-inch margins, Page Numbers bottom center, E-Filing Portal watermark top right."
  },
  {
    id: "15th",
    circuit: "15th Judicial Circuit",
    counties: ["Palm Beach"],
    dca: "4th DCA",
    portal: "15th Cir. OLS (Online Scheduling System)",
    defaultConferral: "15th Cir. Local Rule 4 Mandatory Conferral Certification (must speak in person or by phone before noticing hearing).",
    defaultFormatting: "12pt Times New Roman or Arial, Double-Spaced, strict 10-page limit on UMC/special set memoranda unless leave granted."
  },
  {
    id: "11th",
    circuit: "11th Judicial Circuit",
    counties: ["Miami-Dade"],
    dca: "3rd DCA",
    portal: "11th Cir. courtMAP",
    defaultConferral: "11th Cir. Administrative Order Mandatory Meet-and-Confer Certificate required on all non-dispositive motions.",
    defaultFormatting: "12pt searchable PDF/A via Florida Courts E-Filing Portal, double-spaced, hyperlinked authority bookmarks."
  },
  {
    id: "9th",
    circuit: "9th Judicial Circuit",
    counties: ["Orange", "Osceola"],
    dca: "6th DCA",
    portal: "9th Cir. JACS",
    defaultConferral: "9th Cir. Admin Order 2012-03 Mandatory Meet-and-Confer Conference in person or by telephone.",
    defaultFormatting: "12pt font, double-spaced, proposed orders submitted in Word format via E-Portal."
  },
  {
    id: "13th",
    circuit: "13th Judicial Circuit",
    counties: ["Hillsborough"],
    dca: "2nd DCA",
    portal: "13th Cir. JAWS",
    defaultConferral: "13th Cir. Admin Order S-2021-014 Good Faith Conferral Certification required.",
    defaultFormatting: "12pt Times New Roman, double-spaced, searchable PDF via E-Filing Portal."
  },
  {
    id: "6th",
    circuit: "6th Judicial Circuit",
    counties: ["Pinellas", "Pasco"],
    dca: "2nd DCA",
    portal: "6th Cir. JAWS",
    defaultConferral: "6th Cir. Admin Order Good Faith Conferral required prior to scheduling.",
    defaultFormatting: "12pt font, double-spaced, 1-inch margins."
  },
  {
    id: "4th",
    circuit: "4th Judicial Circuit",
    counties: ["Duval", "Clay", "Nassau"],
    dca: "1st / 5th DCA",
    portal: "4th Cir. Ex Parte / Judicial Portal",
    defaultConferral: "4th Cir. Admin Order Conferral Certificate required on all motions.",
    defaultFormatting: "12pt font, double-spaced, numbered paragraphs."
  },
  {
    id: "20th",
    circuit: "20th Judicial Circuit",
    counties: ["Lee", "Collier", "Charlotte", "Hendry", "Glades"],
    dca: "2nd / 6th DCA",
    portal: "20th Cir. JACS",
    defaultConferral: "20th Cir. Standards of Professionalism Good-Faith Conferral required.",
    defaultFormatting: "12pt font, double-spaced, compliant with Fla. R. Gen. Prac. & Jud. Admin. 2.520."
  },
  {
    id: "custom",
    circuit: "Custom Florida Circuit (1st–20th Cir.)",
    counties: ["Any Florida County"],
    dca: "Applicable Florida DCA (1st–6th DCA)",
    portal: "Florida Courts E-Filing Portal",
    defaultConferral: "Certificate of Good-Faith Conferral with opposing counsel/party prior to hearing.",
    defaultFormatting: "Fla. R. Gen. Prac. & Jud. Admin. 2.520 (12pt font, double-spaced, 1-inch margins)."
  }
];

const PROFESSION_CONFIGS = {
  attorney: {
    label: "Attorney / Law Firm",
    governingRules: "Rules Regulating Fla. Bar (Ch. 4) & Fla. Stat. § 95.11(4)(a)",
    sol: "2 Years (Fla. Stat. § 95.11(4)(a))",
    privityTypes: [
      { id: "direct_retention", label: "Direct Written Retention Agreement" },
      { id: "joint_representation", label: "Joint Client Exception (Fla. Stat. § 90.502(4)(c))" },
      { id: "intended_beneficiary", label: "Intended Third-Party Beneficiary (Espinosa Standard)" },
      { id: "conspiracy_aid", label: "Extrajudicial Conspiracy / Aiding & Abetting Tort" }
    ],
    breachExamples: "Undisclosed conflict of interest (Rule 4-1.7), collusion with adverse managers, unauthorized record disclosures, or active concealment."
  },
  cpa: {
    label: "CPA / Accounting Firm",
    governingRules: "Fla. Stat. Ch. 473 & F.A.C. R. 61H1-23.002",
    sol: "2 Years from Discovery (Fla. Stat. § 95.11(4)(a))",
    privityTypes: [
      { id: "engagement_letter", label: "Written Engagement Letter / Client Contract" },
      { id: "joint_tax_privity", label: "Joint Client / Equity Member Privity (§ 473.316(4)(c))" },
      { id: "crime_fraud_waiver", label: "Crime/Fraud Privilege Exception (§ 473.316(4)(a))" },
      { id: "audit_reliance", label: "Known Third-Party Reliance (Restatement § 552)" }
    ],
    breachExamples: "Refusal to furnish client general ledgers and tax workpapers upon demand (F.A.C. 61H1-23.002; § 473.318) and unauthorized lender disclosures."
  },
  director: {
    label: "Managing Member / Corporate Director",
    governingRules: "Fla. Stat. § 605.04091 (LLC) / § 607.0830 & § 607.0832 (FBCA)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(o))",
    privityTypes: [
      { id: "operating_agreement", label: "Written Operating / Shareholder Agreement" },
      { id: "fiduciary_relationship", label: "Statutory Fiduciary Duty Owed to Equity Member" },
      { id: "dinuro_direct", label: "Direct Harm & Special Duty (Dinuro Two-Prong Test)" }
    ],
    breachExamples: "Self-dealing transfers, commingling funds, withholding statutory inspection records (§ 607.1602), stripping § 607.0832 safe harbor immunity."
  },
  vendor: {
    label: "Commercial Vendor / Counterparty",
    governingRules: "Fla. Stat. § 95.11(2)(b) & Fla. Stat. § 57.105(7)",
    sol: "5 Years Written / 4 Years Oral",
    privityTypes: [
      { id: "written_contract", label: "Executed Written Contract (Rule 1.130 Attached)" },
      { id: "oral_agreement", label: "Oral Contract / Implied-in-Fact Course of Dealing" }
    ],
    breachExamples: "Material breach of express performance covenants, wrongful retention of funds, or failure to indemnify."
  },
  lender: {
    label: "Lender / Financial Institution",
    governingRules: "Fla. Stat. § 687.0304 (Banking Statute of Frauds) & UCC Art. 9",
    sol: "5 Years (Fla. Stat. § 95.11(2)(b))",
    privityTypes: [
      { id: "loan_agreement", label: "Executed Loan / Security Agreement" },
      { id: "escrow_duty", label: "Special Fiduciary / Escrow Relationship" }
    ],
    breachExamples: "Unauthorized release of collateral, improper reliance on unverified third-party CPA statements, or wrongful default acceleration."
  }
};

const INITIAL_DEFENDANTS = [
  {
    id: "def-1",
    name: "Engleberg, CPA",
    entityName: "Engleberg Accounting P.A.",
    profession: "cpa",
    privityType: "joint_tax_privity",
    suedCapacity: "both",
    specificBreach: "Withheld corporate tax filings, general ledgers, and accounting workpapers in violation of Fla. Stat. § 473.318 and F.A.C. R. 61H1-23.002 while transmitting unauthorized financial disclosures to outside lenders.",
    dateLastAction: "2026-01-15",
    discoveryDate: "2026-02-01",
    evidence: "EXHIBIT A: Written Records Demand & Lender Disclosure Emails",
    witnesses: "Corporate Bookkeeper, Third-Party Loan Officer",
    otherDefendants: "Halle, Managing Directors"
  },
  {
    id: "def-2",
    name: "Richard Halle, Esq.",
    entityName: "The Halle Law Firm P.A.",
    profession: "attorney",
    privityType: "joint_representation",
    suedCapacity: "both",
    specificBreach: "Represented conflicting corporate and individual interests simultaneously under Rule 4-1.7, facilitated unauthorized record transfers, and actively concealed material corporate transactions from Plaintiff.",
    dateLastAction: "2026-02-10",
    discoveryDate: "2026-03-01",
    evidence: "EXHIBIT B: Retainer Communications & Corporate Filings",
    witnesses: "Records Custodian, Sunbiz Filing Agent",
    otherDefendants: "Engleberg, CPA"
  }
];

const INITIAL_FILED_PLEADINGS = [
  {
    id: "filed-1",
    title: "Order Dismissing Count IV With Prejudice (Oct 5, 2026)",
    filer: "Presiding Judge / Division 25",
    dateFiled: "2026-10-05",
    type: "Court Order",
    targetCounts: ["Count IV: CPA Malpractice / Aiding & Abetting"],
    summary: "Dismissed Count IV citing lack of strict privity, accountant-client privilege (§ 473.316), and director safe harbor (§ 607.0832), adopting unsworn defense factual assertions outside the four corners.",
    extractedAttack: "Four Corners Violation / Safe Harbor § 607.0832 / CPA Privity Bar"
  },
  {
    id: "filed-2",
    title: "Defendants' Motion to Dismiss Third Amended Complaint",
    filer: "Defense Counsel (Halle / Engleberg)",
    dateFiled: "2026-09-18",
    type: "Defense Motion",
    targetCounts: ["Count I", "Count II", "Count III", "Count IV"],
    summary: "Argues claims are derivative under Dinuro rather than direct, asserts intra-corporate conspiracy bar, and claims failure to attach complete contract instruments under Rule 1.130(a).",
    extractedAttack: "Dinuro Derivative Bar / Rule 1.130 Exhibit Trap / Intra-Corporate Conspiracy"
  },
  {
    id: "filed-3",
    title: "Verified Fourth Amended Complaint (Filed Oct 16, 2026)",
    filer: "Plaintiff Pro Se (Tina Diane Lee)",
    dateFiled: "2026-10-16",
    type: "Plaintiff Pleading",
    targetCounts: ["Count I", "Count II", "Count III", "Count IV"],
    summary: "Sets forth ultimate facts establishing direct individual harm, attaches Rule 1.130 exhibits, and pleads statutory exceptions under § 473.316(4)(a)/(c) and bad-faith self-dealing defeating § 607.0832.",
    extractedAttack: "Affirmative Cure Pleading"
  }
];

const INITIAL_DEFENSE_PLAYBOOK = [
  {
    id: "dp-1",
    count: "Count I & II: Breach of Fiduciary Duty & Corporate Mismanagement",
    defenseAttack: "Dinuro Derivative Standing Bar & Business Judgment Rule",
    defenseGrounds: "Defense argues injury flowed to the entity first and Plaintiff only suffered indirect shareholder/member diminution in value under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731.",
    howToOvercome: "Plead BOTH prongs of Dinuro with surgical ultimate facts: (1) Direct harm unique to Plaintiff individually (freezing out of distributions, personal tax liability, deprivation of statutory inspection rights under § 607.1602 / § 605.0410), and (2) Separate statutory or contractual duty owed directly to Plaintiff under the Operating/Shareholder Agreement.",
    controllingLaw: "Dinuro Invs., LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014); Strazzulla v. Riverside Banking Co., 175 So. 3d 879 (Fla. 4th DCA 2015)."
  },
  {
    id: "dp-2",
    count: "Count III: Director / Manager Conflict Transactions",
    defenseAttack: "Statutory Director Safe Harbor Immunity (Fla. Stat. § 607.0832)",
    defenseGrounds: "Defense asserts that corporate conflict transactions are immunized under § 607.0832 and cannot be challenged by an individual litigant.",
    howToOvercome: "Section 607.0832 is an affirmative defense requiring proof that material facts were fully disclosed OR that the transaction was fair to the corporation. On a Motion to Dismiss, the court is confined to the Four Corners of the Complaint (Rule 1.140). Plead ultimate facts of secret self-dealing, active concealment, and lack of disinterested approval.",
    controllingLaw: "Fla. Stat. § 607.0832; Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056 (Fla. 3d DCA 2018)."
  },
  {
    id: "dp-3",
    count: "Count IV: CPA Malpractice, Aiding & Abetting & Record Withholding",
    defenseAttack: "Ultramares Privity Bar & Accountant-Client Privilege (§ 473.316)",
    defenseGrounds: "CPA argues he was retained solely by the corporate entity, owes no duty to Plaintiff individually, and communications/ledgers are privileged under Fla. Stat. § 473.316.",
    howToOvercome: "Invoke three statutory hooks: (1) F.A.C. R. 61H1-23.002 & Fla. Stat. § 473.318 mandate return of client records upon request; (2) Fla. Stat. § 473.316(4)(c) abolishes accountant privilege in disputes between parties claiming through the same joint client/entity; (3) § 473.316(4)(a) abolishes privilege when accounting services were sought to aid or enable a fraud or tort.",
    controllingLaw: "Fla. Stat. §§ 473.316(4)(a), (4)(c), 473.318; F.A.C. R. 61H1-23.002; Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016)."
  },
  {
    id: "dp-4",
    count: "All Counts: Procedural & Four Corners Attacks",
    defenseAttack: "Rule 1.130 Missing Exhibits & Unsworn Factual Proffers at MTD Hearing",
    defenseGrounds: "Defense counsel introduces outside factual assertions at the hearing not found in the complaint, or claims a referenced instrument was not attached under Rule 1.130(a).",
    howToOvercome: "Enforce the strict Four Corners Rule: a trial court commits reversible error when it relies on unsworn statements of defense counsel or extrinsic facts outside the complaint on a Motion to Dismiss. Where records are withheld, plead the Sachse exclusive possession exception.",
    controllingLaw: "Fla. R. Civ. P. 1.130(a), 1.140(b); Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000); Sachse v. Tampa Music Co., 262 So. 2d 17 (Fla. 2d DCA 1972)."
  }
];

const JUDGE_TEMPLATES = [
  {
    id: "tpl-rehearing",
    name: "Rule 1.530 Motion for Rehearing & To Vacate Dismissal",
    category: "Post-Order Relief (15-Day Jurisdictional Deadline)",
    description: "Challenges an order of dismissal with prejudice where the court relied on defense factual assertions outside the four corners of the complaint or denied leave to amend under Rule 1.190(a)."
  },
  {
    id: "tpl-4th-amended",
    name: "Verified Amended Complaint (Fact-Pleading & Rule 1.130 Compliant)",
    category: "Initial / Amended Pleading",
    description: "Full multi-count Circuit Civil complaint separating each defendant by count, pleading Dinuro direct harm, § 473.316(4) privilege waivers, and § 607.0832 bad-faith facts."
  },
  {
    id: "tpl-mtd-opposition",
    name: "Memorandum of Law in Opposition to Motion to Dismiss",
    category: "Defensive Response",
    description: "Point-by-point response refuting defense privity, safe harbor, and derivative standing arguments with binding Florida DCA precedent."
  },
  {
    id: "tpl-rfp",
    name: "Plaintiff's First Request for Production of Documents (Rule 1.350)",
    category: "Formal Discovery",
    description: "Demands native QuickBooks/general ledger files, CPA workpapers (§ 473.318), lender communications, and corporate records."
  },
  {
    id: "tpl-proposed-order",
    name: "Divisional Proposed Order (Portal Format)",
    category: "Judicial Order",
    description: "Formatted proposed order compliant with circuit portal rules, judicial signature blocks, and complete e-service lists."
  }
];

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function FloridaProSeLitigationApp() {
  // Navigation State: 11 distinct screens + full-screen editor
  const [activeNav, setActiveNav] = useState("today");
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Statewide Florida Court & Division Procedures Configuration
  const [selectedCircuitId, setSelectedCircuitId] = useState("17th");
  const [customCircuitName, setCustomCircuitName] = useState("17th Judicial Circuit");
  const [countyName, setCountyName] = useState("Broward");
  const [dcaName, setDcaName] = useState("4th DCA");
  const [divisionNumber, setDivisionNumber] = useState("25");
  const [judgeName, setJudgeName] = useState("Hon. Shari Africk Olefson");
  const [caseNumber, setCaseNumber] = useState("CACE-26-XXXXXX");
  const [plaintiffName, setPlaintiffName] = useState("Tina Diane Lee");
  const [portalName, setPortalName] = useState("17th Cir. CMS (Case Management System)");
  const [judgeConferralRule, setJudgeConferralRule] = useState(
    "17th Cir. Local Rule 10A Mandatory Good-Faith Conferral Certificate required prior to hearing."
  );
  const [judgeFormattingRule, setJudgeFormattingRule] = useState(
    "12pt Times New Roman, Double-Spaced, 1-inch margins, Page Numbers bottom center, E-Filing Portal watermark top right, AI Review & Verification Certificate included."
  );
  const [judgeUrlSource, setJudgeUrlSource] = useState("https://www.17th.flcourts.org/division-25/");

  // Sub-navigation states
  const [intakeSubTab, setIntakeSubTab] = useState("defendants"); // 'defendants' | 'cases' | 'mail'
  const [intakeQueueFilter, setIntakeQueueFilter] = useState("all");

  // 1. Tab One: AI Conversation History
  const [chatThreads, setChatThreads] = useState([
    {
      id: "chat-1",
      title: "Overcoming Oct 5 Dismissal of Count IV (CPA Privity & Safe Harbor)",
      date: "2026-10-17 11:30 AM",
      messages: [
        {
          sender: "user",
          text: "Judge Olefson dismissed Count IV with prejudice citing CPA privilege and § 607.0832 safe harbor based on defense counsel's unsworn statements. How do we attack this?"
        },
        {
          sender: "assistant",
          text: "Under binding Florida DCA precedent (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)), a trial court is strictly confined to the four corners of the complaint on a Motion to Dismiss. Relying on unsworn defense factual proffers or resolving an unpled affirmative defense like Fla. Stat. § 607.0832 outside the complaint is reversible error. Under Fla. R. Civ. P. 1.530(b), you have a strict 15-day jurisdictional window from October 5 (until October 20, 2026) to serve a Motion for Rehearing and to Vacate."
        }
      ]
    },
    {
      id: "chat-2",
      title: "Drafting Fourth Amended Complaint Ultimate Facts & Rule 1.130",
      date: "2026-10-16 04:15 PM",
      messages: [
        {
          sender: "user",
          text: "How do I plead around the Rule 1.130 exhibit requirement if the CPA and Managing Member are withholding the executed ledger agreements?"
        },
        {
          sender: "assistant",
          text: "Under Sachse v. Tampa Music Co., 262 So. 2d 17 (Fla. 2d DCA 1972) and Parkway General Hospital, Inc. v. Allstate Ins. Co., 393 So. 2d 1171 (Fla. 3d DCA 1981), if an instrument sued upon is in the exclusive possession of the defendant, a complaint is not subject to dismissal under Rule 1.130(a) where the plaintiff alleges that the document is in the defendant's possession and will be produced through discovery."
        }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState("chat-1");

  // 2. Tab Two: Recent Drafts
  const [savedDrafts, setSavedDrafts] = useState([
    {
      id: "draft-1",
      title: "Verified Fourth Amended Complaint",
      updatedAt: "2026-10-16",
      caseNo: "CACE-26-XXXXXX",
      type: "Complaint",
      status: "Filed / Active",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25 (Hon. Shari Africk Olefson)\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nRICHARD HALLE, ESQ., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nVERIFIED FOURTH AMENDED COMPLAINT FOR DAMAGES AND DEMAND FOR JURY TRIAL\n\nPlaintiff, TINA DIANE LEE, pro se, sues Defendants and alleges ultimate facts pursuant to Fla. R. Civ. P. 1.110(b):\n\nJURISDICTION, VENUE, AND PRIVITY\n1. This is an action for damages exceeding $50,000.00, exclusive of interest, costs, and attorney's fees, within the jurisdiction of this Court under Fla. Stat. § 26.012.\n2. Venue is proper in Broward County under Fla. Stat. § 47.011 as the causes of action accrued herein.\n3. Pursuant to Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014), Plaintiff brings direct claims for individualized pecuniary harm and deprivation of statutory inspection rights owed directly to Plaintiff.\n\nCOUNT I: BREACH OF FIDUCIARY DUTY & SELF-DEALING\n4. Plaintiff realleges Paragraphs 1–3. Defendants owed direct fiduciary duties of loyalty and candor.\n5. Defendants engaged in undisclosed self-dealing and bad-faith transfers without disinterested approval, stripping any safe harbor protection under Fla. Stat. § 607.0832.\n\nCOUNT II: PROFESSIONAL NEGLIGENCE & STATUTORY RECORD VIOLATIONS (AGAINST CPA)\n6. Plaintiff realleges Paragraphs 1–3. Pursuant to Fla. Stat. §§ 473.316(4)(a), (4)(c), and 473.318, and F.A.C. R. 61H1-23.002, Defendant CPA owed a mandatory duty to furnish client general ledgers and workpapers.\n7. Defendant withheld records while transmitting unverified financial data to third-party lenders.\n\nCOUNT III: AIDING AND ABETTING BREACH OF FIDUCIARY DUTY & CIVIL CONSPIRACY\n8. Plaintiff realleges Paragraphs 1–7. Defendants had actual knowledge of the underlying fiduciary breaches and rendered substantial assistance by falsifying and withholding corporate records.\n\nVERIFICATION\nUnder penalties of perjury pursuant to Fla. Stat. § 92.525, I declare that I have read the foregoing Complaint and that the facts stated in it are true.\n\nDated: October 17, 2026.\nBy: /s/ Tina Diane Lee\nTina Diane Lee, Pro Se\nEmail: service@allegedlylegal.com`
    },
    {
      id: "draft-2",
      title: "Rule 1.530 Motion for Rehearing on Oct 5 Order Dismissing Count IV",
      updatedAt: "2026-10-17",
      caseNo: "CACE-26-XXXXXX",
      type: "Motion for Rehearing",
      status: "Urgent (Due Oct 20)",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nRICHARD HALLE, ESQ., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nPLAINTIFF'S TIMELY MOTION FOR REHEARING AND TO VACATE OCTOBER 5, 2026 ORDER DISMISSING COUNT IV WITH PREJUDICE PURSUANT TO FLA. R. CIV. P. 1.530\n\nPlaintiff, TINA DIANE LEE, pro se, timely moves for rehearing of the Court's October 5, 2026 Order Dismissing Count IV With Prejudice, and states:\n\n1. TIMELINESS: Pursuant to Fla. R. Civ. P. 1.530(b), this Motion is served within 15 days of the October 5, 2026 Order.\n2. FOUR CORNERS VIOLATION: On a motion to dismiss, the Court is strictly confined to the four corners of the complaint (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)). The October 5 Order improperly adopted unsworn factual assertions of defense counsel regarding lender communications and corporate safe harbors (§ 607.0832) that do not appear on the face of the pleading.\n3. STATUTORY PRIVILEGE WAIVER & PRIVITY: Under Fla. Stat. § 473.316(4)(a) & (c) and F.A.C. R. 61H1-23.002, accountant-client privilege does not apply to joint clients or fraud, and CPAs are statutorily required to return client records.\n\nWHEREFORE, Plaintiff respectfully requests that this Court grant rehearing, vacate the dismissal with prejudice of Count IV, and permit the action to proceed on the Fourth Amended Complaint.\n\nCERTIFICATE OF CONFERRAL & SERVICE\nI HEREBY CERTIFY that a true copy was served via the Florida Courts E-Filing Portal on October 17, 2026.\n\nBy: /s/ Tina Diane Lee`
    },
    {
      id: "draft-3",
      title: "Introduction to Rule 1.350 First Request for Production",
      updatedAt: "2026-10-15",
      caseNo: "CACE-26-XXXXXX",
      type: "Discovery",
      status: "Draft",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nPLAINTIFF'S FIRST REQUEST FOR PRODUCTION OF DOCUMENTS UNDER FLA. R. CIV. P. 1.350\n\nPlaintiff requests that Defendants produce within 30 days:\n1. All native QuickBooks files, general ledgers, and tax workpapers pursuant to Fla. Stat. § 473.318.\n2. All communications between Defendant CPA and any third-party lender regarding Plaintiff or corporate entities.\n3. All corporate resolutions, minutes, and Delray Beach DBA operating records.`
    }
  ]);
  const [activeDraftId, setActiveDraftId] = useState("draft-1");

  // 3. Tab Three: Calendar & Google Integration State
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: "cal-1",
      date: "2026-10-20",
      day: 20,
      title: "JURISDICTIONAL DEADLINE: Rule 1.530 Motion for Rehearing (Oct 5 Order)",
      type: "Statutory 15-Day Deadline"
    },
    {
      id: "cal-2",
      date: "2026-10-26",
      day: 26,
      title: "Defendants' Response Due to 4th Amended Complaint (Rule 1.190(a) - 10 Days)",
      type: "Rule 1.190 Deadline"
    },
    {
      id: "cal-3",
      date: "2026-11-16",
      day: 16,
      title: "Rule 1.350 Formal Discovery Production Deadline (30 Days)",
      type: "Discovery"
    }
  ]);
  const [newCalTitle, setNewCalTitle] = useState("");
  const [newCalDate, setNewCalDate] = useState("2026-10-22");

  // 4. Tab Four: Defendants Intake State
  const [defendantsList, setDefendantsList] = useState(INITIAL_DEFENDANTS);
  const [activeDefId, setActiveDefId] = useState("def-1");
  const [intakeSaveBanner, setIntakeSaveBanner] = useState(false);

  // 5. Tab Five: Matters & Count Mapping State
  const [mattersList] = useState([
    {
      id: "matter-1",
      title: "CACE Lee vs Halle, Engleberg",
      caseNumber: "CACE-26-XXXXXX",
      updated: "Today",
      counts: [
        {
          countNum: "Count I",
          title: "Breach of Fiduciary Duty & Direct Member Harm",
          targetDefendantIds: ["def-2"],
          authority: "Fla. Stat. § 605.04091 / § 607.0830; Dinuro Invs. v. Camacho, 141 So. 3d 731",
          privityHook: "Direct Operating/Shareholder Agreement & Special Individual Injury",
          status: "Pled in 4th Amended Complaint"
        },
        {
          countNum: "Count II",
          title: "Equitable Accounting & Statutory Inspection Enforcement",
          targetDefendantIds: ["def-1", "def-2"],
          authority: "Fla. Stat. § 607.1602; F.A.C. R. 61H1-23.002",
          privityHook: "Statutory Equity Holder Right to Books, Ledgers & Workpapers",
          status: "Pled in 4th Amended Complaint"
        },
        {
          countNum: "Count III",
          title: "Civil Conspiracy & Aiding/Abetting Fiduciary Breach",
          targetDefendantIds: ["def-1", "def-2"],
          authority: "SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327",
          privityHook: "Actual Knowledge + Substantial Assistance in Withholding & Altering Records",
          status: "Pled in 4th Amended Complaint"
        },
        {
          countNum: "Count IV",
          title: "CPA Professional Malpractice & Unauthorized Lender Disclosures",
          targetDefendantIds: ["def-1"],
          authority: "Fla. Stat. §§ 473.316(4)(a)/(c), 473.318; Dattoma v. Laughlin, 183 So. 3d 465",
          privityHook: "Joint Client Privity Exception & Mandatory Client Record Ownership",
          status: "Oct 5 Order Dismissed w/ Prejudice — Rule 1.530 Rehearing Pending (Due Oct 20)"
        }
      ]
    }
  ]);
  const [matterDetailOpen, setMatterDetailOpen] = useState(false);

  // 6. Tab Six: Saved Signatures State
  const [signatureText, setSignatureText] = useState("/s/ Tina Diane Lee");
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureSavedMsg, setSignatureSavedMsg] = useState(false);

  // 7. Library 1: Filed Pleadings State
  const [filedPleadings, setFiledPleadings] = useState(INITIAL_FILED_PLEADINGS);
  const [newFiledTitle, setNewFiledTitle] = useState("");
  const [newFiledFiler, setNewFiledFiler] = useState("Defense Counsel");
  const [newFiledSummary, setNewFiledSummary] = useState("");

  // 8. Library 2: Defense Playbook & Defense AI Chat
  const [defensePlaybook, setDefensePlaybook] = useState(INITIAL_DEFENSE_PLAYBOOK);
  const [defenseChatMsgs, setDefenseChatMsgs] = useState([
    {
      sender: "assistant",
      text: "Defense Playbook AI ready. I have analyzed the October 5, 2026 Order dismissing Count IV and Defendants' Motions to Dismiss. Ask me how to dismantle any defense objection (§ 607.0832 Safe Harbor, Ultramares Privity, Dinuro, or the Four Corners Rule)."
    }
  ]);
  const [defenseChatInput, setDefenseChatInput] = useState("");

  // 10. Library 4: Evidence Vault State (Per Defendant with Bates & Metadata)
  const [evidenceItems, setEvidenceItems] = useState([
    {
      id: "ev-1",
      defendantId: "def-1",
      exhibitLabel: "EXHIBIT A",
      title: "Formal Written Demand for CPA Workpapers & General Ledgers",
      fileType: "PDF Document",
      batesRange: "LEE-EXA-0001 to LEE-EXA-0008",
      capturedMetadata: "SHA256-9F8A2B • Author: Tina Diane Lee • Created: 2026-01-15 09:42:11 EST",
      downloadedTimestamp: "2026-10-16 14:22:05 EDT"
    },
    {
      id: "ev-2",
      defendantId: "def-1",
      exhibitLabel: "EXHIBIT B",
      title: "Unauthorized CPA Financial Transmittal to Outside Lender",
      fileType: "Email / PDF Attachment",
      batesRange: "LEE-EXB-0009 to LEE-EXB-0024",
      capturedMetadata: "MIME-Message-ID • Sender: Engleberg CPA • Timestamp: 2026-01-19 16:05:44 EST",
      downloadedTimestamp: "2026-10-16 14:25:19 EDT"
    },
    {
      id: "ev-3",
      defendantId: "def-2",
      exhibitLabel: "EXHIBIT C",
      title: "Delray Beach DBA Corporate Records & Sunbiz Amendments",
      fileType: "Certified State Record (PDF)",
      batesRange: "LEE-EXC-0025 to LEE-EXC-0041",
      capturedMetadata: "FL-DOS-Sunbiz Doc #L24000XXXXXX • Certified Timestamp",
      downloadedTimestamp: "2026-10-17 08:12:30 EDT"
    }
  ]);
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvExhibit, setNewEvExhibit] = useState("EXHIBIT D");

  // 11. Library 5: Templates & Procedures Builder State
  const [selectedTemplateId, setSelectedTemplateId] = useState("tpl-rehearing");
  const [respondingToFilingId, setRespondingToFilingId] = useState("filed-1");

  // Global Floating AI Drawer
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");

  // ============================================================================
  // PERSISTENT MEMORY SYNC (localStorage)
  // ============================================================================
  useEffect(() => {
    try {
      const savedDefs = localStorage.getItem("fl_prose_defendants");
      if (savedDefs) setDefendantsList(JSON.parse(savedDefs));

      const savedDr = localStorage.getItem("fl_prose_drafts");
      if (savedDr) setSavedDrafts(JSON.parse(savedDr));

      const savedSig = localStorage.getItem("fl_prose_sig_text");
      if (savedSig) setSignatureText(savedSig);

      const savedSigImg = localStorage.getItem("fl_prose_sig_img");
      if (savedSigImg) setSignatureImage(savedSigImg);

      const savedEv = localStorage.getItem("fl_prose_evidence");
      if (savedEv) setEvidenceItems(JSON.parse(savedEv));

      const savedCourt = localStorage.getItem("fl_prose_court_config");
      if (savedCourt) {
        const parsed = JSON.parse(savedCourt);
        if (parsed.selectedCircuitId) setSelectedCircuitId(parsed.selectedCircuitId);
        if (parsed.customCircuitName) setCustomCircuitName(parsed.customCircuitName);
        if (parsed.countyName) setCountyName(parsed.countyName);
        if (parsed.dcaName) setDcaName(parsed.dcaName);
        if (parsed.divisionNumber) setDivisionNumber(parsed.divisionNumber);
        if (parsed.judgeName) setJudgeName(parsed.judgeName);
        if (parsed.caseNumber) setCaseNumber(parsed.caseNumber);
        if (parsed.portalName) setPortalName(parsed.portalName);
        if (parsed.judgeConferralRule) setJudgeConferralRule(parsed.judgeConferralRule);
        if (parsed.judgeFormattingRule) setJudgeFormattingRule(parsed.judgeFormattingRule);
      }
    } catch (e) {
      console.error("Memory load error:", e);
    }
  }, []);

  const saveCourtConfigToMemory = (overrides = {}) => {
    const configToSave = {
      selectedCircuitId,
      customCircuitName,
      countyName,
      dcaName,
      divisionNumber,
      judgeName,
      caseNumber,
      portalName,
      judgeConferralRule,
      judgeFormattingRule,
      ...overrides
    };
    try {
      localStorage.setItem("fl_prose_court_config", JSON.stringify(configToSave));
    } catch (e) {}
  };

  const handleSelectFloridaCircuit = (circuitId) => {
    const found = FLORIDA_CIRCUITS.find((c) => c.id === circuitId) || FLORIDA_CIRCUITS[0];
    setSelectedCircuitId(found.id);
    setCustomCircuitName(found.circuit);
    setCountyName(found.counties[0]);
    setDcaName(found.dca);
    setPortalName(found.portal);
    setJudgeConferralRule(found.defaultConferral);
    setJudgeFormattingRule(found.defaultFormatting);
    saveCourtConfigToMemory({
      selectedCircuitId: found.id,
      customCircuitName: found.circuit,
      countyName: found.counties[0],
      dcaName: found.dca,
      portalName: found.portal,
      judgeConferralRule: found.defaultConferral,
      judgeFormattingRule: found.defaultFormatting
    });
  };

  const saveDefendantsToMemory = (updatedList) => {
    setDefendantsList(updatedList);
    try {
      localStorage.setItem("fl_prose_defendants", JSON.stringify(updatedList));
      setIntakeSaveBanner(true);
      setTimeout(() => setIntakeSaveBanner(false), 2500);
    } catch (e) {}
  };

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

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  const handleUpdateDef = (field, val) => {
    const updated = defendantsList.map((d) =>
      d.id === selectedDef.id ? { ...d, [field]: val } : d
    );
    saveDefendantsToMemory(updated);
  };

  const handleAddNewDefendant = () => {
    const newId = `def-${Date.now()}`;
    const newEntry = {
      id: newId,
      name: "New Defendant",
      entityName: "",
      profession: "director",
      privityType: "operating_agreement",
      suedCapacity: "both",
      specificBreach: "",
      dateLastAction: "2026-01-15",
      discoveryDate: "2026-02-01",
      evidence: "EXHIBIT D: Corporate Records",
      witnesses: "",
      otherDefendants: ""
    };
    const updated = [...defendantsList, newEntry];
    saveDefendantsToMemory(updated);
    setActiveDefId(newId);
  };

  const generateFloridaLegalAiResponse = (queryText) => {
    const lower = queryText.toLowerCase();
    if (lower.includes("count iv") || lower.includes("olefson") || lower.includes("oct 5") || lower.includes("rehearing") || lower.includes("1.530")) {
      return `CRITICAL FLORIDA PROCEDURAL ANALYSIS (${customCircuitName} • ${dcaName}):\n1. Jurisdictional 15-Day Deadline: Under Fla. R. Civ. P. 1.530(b), a Motion for Rehearing must be served within 15 days of the Oct 5, 2026 Order (Deadline: Tuesday, October 20, 2026).\n2. Reversible Error on the Four Corners: Under Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000), a trial court may not consider unsworn factual assertions of defense counsel or resolve unpled affirmative defenses like Fla. Stat. § 607.0832 on a Motion to Dismiss.\n3. Statutory CPA Hooks: Cite Fla. Stat. § 473.316(4)(a) (crime/fraud exception), § 473.316(4)(c) (joint-client exception), and F.A.C. R. 61H1-23.002 (mandatory return of client records).`;
    }
    if (lower.includes("dinuro") || lower.includes("direct") || lower.includes("derivative")) {
      return `FLORIDA DIRECT VS. DERIVATIVE STANDING (${dcaName} Standard):\nUnder Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014) and Strazzulla v. Riverside Banking Co., 175 So. 3d 879 (Fla. 4th DCA 2015), a member/shareholder may bring a DIRECT action if:\n(1) There is direct harm to the plaintiff that does not flow subsequently from initial harm to the company; AND\n(2) There is a special injury distinct from other members OR a separate statutory/contractual duty owed directly to the plaintiff (e.g., § 607.1602 inspection rights or disproportionate distributions).`;
    }
    if (lower.includes("607.0832") || lower.includes("safe harbor")) {
      return `DEFEATING FLA. STAT. § 607.0832 DIRECTOR SAFE HARBOR:\nSection 607.0832 is a fact-intensive affirmative defense, NOT an absolute bar on a Motion to Dismiss. By pleading ultimate facts of secret self-dealing, active concealment, and lack of disinterested approval, § 607.0832 cannot be resolved on a Rule 1.140(b)(6) motion (Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056).`;
    }
    return `FLORIDA CIRCUIT CIVIL ANALYSIS (${customCircuitName} • ${countyName} County Div. ${divisionNumber}):\nUnder Fla. R. Civ. P. 1.110(b), ensure every count separates each defendant's specific acts (who, what, when, and statutory duty breached) and complies with ${judgeConferralRule}`;
  };

  const handleSendChatThreadMessage = (textToSend) => {
    if (!textToSend.trim()) return;
    const reply = generateFloridaLegalAiResponse(textToSend);
    setChatThreads((prev) =>
      prev.map((t) =>
        t.id === activeChatThread.id
          ? {
              ...t,
              messages: [
                ...t.messages,
                { sender: "user", text: textToSend },
                { sender: "assistant", text: reply }
              ]
            }
          : t
      )
    );
  };

  const handleSendDefensePlaybookChat = () => {
    if (!defenseChatInput.trim()) return;
    const userQ = defenseChatInput.trim();
    const aiAns = generateFloridaLegalAiResponse(userQ);
    setDefenseChatMsgs((prev) => [
      ...prev,
      { sender: "user", text: userQ },
      { sender: "assistant", text: aiAns }
    ]);
    setDefenseChatInput("");
  };

  const handleAddAndAnalyzeFiledPleading = () => {
    if (!newFiledTitle.trim()) return;
    const newId = `filed-${Date.now()}`;
    const newDoc = {
      id: newId,
      title: newFiledTitle,
      filer: newFiledFiler,
      dateFiled: "2026-10-17",
      type: "Filed Pleading",
      targetCounts: ["Count I", "Count IV"],
      summary: newFiledSummary || "Uploaded pleading analyzed for defense objections and procedural traps.",
      extractedAttack: "Rule 1.140(b)(6) Fact-Pleading / Privity Challenge"
    };
    setFiledPleadings((prev) => [newDoc, ...prev]);

    setDefensePlaybook((prev) => [
      {
        id: `dp-${Date.now()}`,
        count: `Analyzed from: ${newFiledTitle}`,
        defenseAttack: `Objection raised by ${newFiledFiler}`,
        defenseGrounds: newFiledSummary || "Defense challenges standing, privity, or sufficiency of ultimate facts.",
        howToOvercome: `Counter with specific ultimate facts under Fla. R. Civ. P. 1.110(b), invoke the Four Corners Rule, and cite binding ${dcaName} authority.`,
        controllingLaw: `Fla. R. Civ. P. 1.110(b), 1.130(a), 1.140(b); ${dcaName} Precedent.`
      },
      ...prev
    ]);

    setNewFiledTitle("");
    setNewFiledSummary("");
  };

  // Build Template using Active Florida Court, Division Procedures & Referenced Pleading
  const handleGenerateTemplateIntoDraft = () => {
    const tpl = JUDGE_TEMPLATES.find((t) => t.id === selectedTemplateId) || JUDGE_TEMPLATES[0];
    const refDoc = filedPleadings.find((f) => f.id === respondingToFilingId) || filedPleadings[0];
    const defNames = defendantsList.map((d) => d.name.toUpperCase()).join(", ");

    const generatedContent = `IN THE CIRCUIT COURT OF THE ${customCircuitName.toUpperCase()}
IN AND FOR ${countyName.toUpperCase()} COUNTY, FLORIDA

CASE NO.: ${caseNumber}
DIVISION: ${divisionNumber} (${judgeName})
APPELLATE DISTRICT: ${dcaName}

${plaintiffName.toUpperCase()},
    Plaintiff,
v.
${defNames},
    Defendants.
__________________________________________/

${tpl.name.toUpperCase()}
(Responding to: ${refDoc.title})

Plaintiff, ${plaintiffName.toUpperCase()}, pro se, files this ${tpl.name} in accordance with ${customCircuitName} Division ${divisionNumber} Procedures (${judgeName}) and the Florida Rules of Civil Procedure, and states:

I. PROCEDURAL POSTURE & DIVISIONAL COMPLIANCE
1. Referenced Filing: This pleading responds directly to "${refDoc.title}" (${refDoc.dateFiled}) by ${refDoc.filer}.
2. Divisional & Formatting Compliance: Prepared in strict compliance with ${judgeName}'s divisional rules (${judgeFormattingRule}) and scheduled via ${portalName}.

II. STATEMENT OF ULTIMATE FACTS & FLORIDA LEGAL AUTHORITY (${dcaName})
3. Under Florida's strict fact-pleading standard (Fla. R. Civ. P. 1.110(b)) and the Four Corners Rule (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)), the Court's review is strictly confined to the verified allegations and Rule 1.130(a) exhibits.
${defendantsList
  .map(
    (d, i) =>
      `${i + 4}. As to Defendant ${d.name} (${PROFESSION_CONFIGS[d.profession]?.label}): Privity is established via ${d.privityType}. On ${d.dateLastAction} (discovered ${d.discoveryDate}), Defendant committed the following breach:${d.specificBreach} (Supported by ${d.evidence}; Witnesses:${d.witnesses || "Custodians of Record"}).`
  )
  .join("\n")}

III. MEMORANDUM OF LAW OVERCOMING DEFENSE OBJECTIONS
• Rehearing & Vacation of Dismissal (Fla. R. Civ. P. 1.530): Resolving unpled affirmative defenses such as Fla. Stat. § 607.0832 or adopting unsworn defense factual assertions outside the four corners constitutes reversible error in the ${dcaName}.
• Statutory CPA Duties & Privilege Exceptions: Under Fla. Stat. §§ 473.316(4)(a), (4)(c), and 473.318, and F.A.C. R. 61H1-23.002, accountant-client privilege is waived in joint-client disputes and crime/fraud contexts, and client records/workpapers must be furnished upon demand.
• Direct Action Standing (Dinuro Two-Prong Test): Plaintiff alleges individualized pecuniary injury and violation of statutory inspection rights distinct from general corporate harm under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731.

WHEREFORE, Plaintiff respectfully requests that this Honorable Court enter an Order granting the relief requested herein, together with taxable costs under Fla. Stat. § 57.041, reciprocal fees under § 57.105(7), and such further relief as is just and proper.

MANDATORY DIVISIONAL CERTIFICATE OF GOOD-FAITH CONFERRAL
Pursuant to ${judgeConferralRule}, I HEREBY CERTIFY that Plaintiff has conferred or attempted to confer in good faith with opposing counsel prior to noticing any hearing on this matter.

PRO SE VERIFICATION & AI RULE 2.515 DISCLOSURE
Under penalties of perjury pursuant to Fla. Stat. § 92.525, I declare that I have read the foregoing document, verified all Florida statutory and ${dcaName} citations, and that the facts stated herein are true.

CERTIFICATE OF SERVICE (FLA. R. GEN. PRAC. & JUD. ADMIN. 2.516)
I HEREBY CERTIFY that a true and correct copy of the foregoing was furnished via the Florida Courts E-Filing Portal and ${portalName} on October 17, 2026 to all counsel of record.

Respectfully submitted,

By: ${signatureText}
${plaintiffName}, Pro Se
${countyName} County, Florida
Email: service@allegedlylegal.com`;

    const newDraftId = `draft-${Date.now()}`;
    const newDraftObj = {
      id: newDraftId,
      title: `${tpl.name} (${countyName} Div ${divisionNumber})`,
      updatedAt: "2026-10-17",
      caseNo: caseNumber,
      type: tpl.category,
      status: `${customCircuitName} Ready`,
      content: generatedContent
    };

    const updatedDrafts = [newDraftObj, ...savedDrafts];
    setSavedDrafts(updatedDrafts);
    try {
      localStorage.setItem("fl_prose_drafts", JSON.stringify(updatedDrafts));
    } catch (e) {}

    setActiveDraftId(newDraftId);
    setActiveNav("editor");
  };

  const handleExportActiveDraft = () => {
    const blob = new Blob([activeDraft.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeDraft.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSignatureImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSignatureImage(reader.result);
      try {
        localStorage.setItem("fl_prose_sig_img", reader.result);
      } catch (err) {}
    };
    reader.readAsDataURL(file);
  };

  const handleAddEvidenceItem = () => {
    if (!newEvTitle.trim()) return;
    const nextNum = evidenceItems.length * 15 + 1;
    const endNum = nextNum + 14;
    const pad = (n) => String(n).padStart(4, "0");
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19) + " EDT";

    const newEv = {
      id: `ev-${Date.now()}`,
      defendantId: selectedDef.id,
      exhibitLabel: newEvExhibit,
      title: newEvTitle,
      fileType: "PDF / Exhibit Package",
      batesRange: `LEE-${newEvExhibit.replace(/\s+/g, "")}-${pad(nextNum)} to ${pad(endNum)}`,
      capturedMetadata: `Authenticated Pro Se Metadata • Custodian: ${plaintiffName} • Linked to ${selectedDef.name}`,
      downloadedTimestamp: nowStr
    };

    const updated = [...evidenceItems, newEv];
    setEvidenceItems(updated);
    try {
      localStorage.setItem("fl_prose_evidence", JSON.stringify(updated));
    } catch (e) {}
    setNewEvTitle("");
  };

  const createGoogleCalendarUrl = (ev) => {
    const dateClean = ev.date.replace(/-/g, "");
    const titleEnc = encodeURIComponent(`[${customCircuitName}] ${ev.title}`);
    const detailsEnc = encodeURIComponent(
      `Case: ${caseNumber} (${countyName} County Div ${divisionNumber} - ${judgeName})\nPortal: ${portalName}\nCategory: ${ev.type}`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEnc}&dates=${dateClean}/${dateClean}&details=${detailsEnc}`;
  };

  return (
    <div className="flex h-screen w-full bg-[#FDFDFD] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* ==================================================================== */}
      {/* LEFT SIDEBAR NAVIGATION (All 11 Modules + Recent Drafts Tree)        */}
      {/* ==================================================================== */}
      <aside
        className={`${
          sidebarOpenMobile
            ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl flex"
            : "hidden lg:flex lg:w-64"
        } bg-[#FAFAFA] border-r border-slate-200 flex-col justify-between shrink-0 select-none overflow-y-auto`}
      >
        <div className="p-3 space-y-4">
          {/* Workspace Header */}
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/50 cursor-pointer border border-transparent hover:border-slate-200 transition">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                TB
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate">
                Tina Bulger&apos;s Workspace
              </span>
            </div>
            <button
              onClick={() => setSidebarOpenMobile(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block shrink-0" />
          </div>

          {/* + New Chat / New Pleading Split Button */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => {
                const newThreadId = `chat-${Date.now()}`;
                setChatThreads((prev) => [
                  {
                    id: newThreadId,
                    title: `Legal Research (${countyName} Div ${divisionNumber})`,
                    date: "Just now",
                    messages: [
                      {
                        sender: "assistant",
                        text: `New Florida Legal AI session started for ${customCircuitName} (${countyName} County, ${dcaName}). Ask about division rules, rehearing grounds, or Rule 1.110(b) fact-pleading.`
                      }
                    ]
                  },
                  ...prev
                ]);
                setActiveChatId(newThreadId);
                setActiveNav("history");
                setSidebarOpenMobile(false);
              }}
              className="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              New chat
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <button
              onClick={() => {
                setActiveNav("templates");
                setSidebarOpenMobile(false);
              }}
              title="Build Pleading from Judge Template"
              className="px-2 py-1.5 hover:bg-slate-50 text-slate-500 transition"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SECTION I: CHATS (Tab 1: History & Tab 2: Recent Drafts) */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
              Chats & Drafts
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("history");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "history"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>History (AI Chats)</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 rounded">
                  {chatThreads.length}
                </span>
              </button>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-100 transition">
                  <button
                    onClick={() => {
                      setActiveNav("recent");
                      setSidebarOpenMobile(false);
                    }}
                    className={`flex items-center gap-2 flex-1 text-left ${
                      activeNav === "recent" || activeNav === "editor"
                        ? "font-semibold text-slate-900"
                        : ""
                    }`}
                  >
                    <ChevronDown
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentExpanded(!recentExpanded);
                      }}
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        !recentExpanded ? "-rotate-90" : ""
                      }`}
                    />
                    <span>Recent Drafts</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveNav("recent");
                      setSidebarOpenMobile(false);
                    }}
                    className="text-slate-400 hover:text-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
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
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs truncate transition ${
                          activeNav === "editor" && activeDraftId === dr.id
                            ? "bg-emerald-50 text-emerald-900 font-semibold"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`}
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

          {/* SECTION: WORK (Tab 3: Today, Tab 4: Intake, Tab 5: Matters, Tab 6: Signatures) */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
              Work
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("today");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "today"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Today (Calendar & Mail)</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>

              <button
                onClick={() => {
                  setActiveNav("intake");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "intake"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Intake (Defendants)</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  {defendantsList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("matters");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "matters"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Matters (Case Counts)</span>
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 rounded font-mono">
                  {mattersList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("signatures");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "signatures"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Saved Signatures</span>
              </button>
            </div>
          </div>

          {/* SECTION II: LIBRARY (5 Specialized Legal Modules) */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
              Library
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("filed_drafts");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "filed_drafts"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>1. Drafts (Filed Docs)</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 rounded">
                  {filedPleadings.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("defense_playbook");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "defense_playbook"
                    ? "bg-rose-50 text-rose-900 font-semibold border-l-2 border-rose-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>2. Defense Playbook</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("plaintiff_playbook");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "plaintiff_playbook"
                    ? "bg-emerald-50 text-emerald-900 font-semibold border-l-2 border-emerald-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>3. Plaintiffs Playbook</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("vault");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "vault"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderLock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>4. Evidence & Bates</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 rounded">
                  {evidenceItems.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("templates");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                  activeNav === "templates"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>5. Templates / Rules</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Profile & Court Switcher Card */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-[#FAFAFA]">
          <div
            onClick={() => setActiveNav("templates")}
            className="p-2.5 bg-white border border-slate-200 hover:border-emerald-600 rounded-lg text-xs cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-emerald-700 text-[10px] font-bold uppercase">
              <span>Active Florida Court</span>
              <span>Change →</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 mt-1 truncate">
              {customCircuitName} ({countyName})
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              Div. {divisionNumber} • {dcaName}
            </p>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md transition"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">{plaintiffName}</span>
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
              Pro Se
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpenMobile && (
        <div
          onClick={() => setSidebarOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
        />
      )}

      {/* ==================================================================== */}
      {/* MAIN CONTENT STAGE                                                   */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Global Top Header with Statewide Court Selector Pill */}
        <header className="h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
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
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-xs sm:text-sm text-slate-900 leading-tight">
                  Florida Pro Se Litigation Studio
                </h1>
                <button
                  onClick={() => setActiveNav("templates")}
                  className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2 py-0.5 rounded border border-slate-200 transition"
                >
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  {customCircuitName} • {countyName} Div {divisionNumber} ({dcaName}) ✎
                </button>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {judgeName} • {portalName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Florida Legal AI</span>
            </button>
            <button
              onClick={handleExportActiveDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Pleading</span>
            </button>
          </div>
        </header>

        {/* ================================================================== */}
        {/* TAB 1: HISTORY (All AI Conversations)                              */}
        {/* ================================================================== */}
        {activeNav === "history" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
            <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-4 overflow-y-auto space-y-2 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Saved AI Conversations ({chatThreads.length})
              </span>
              {chatThreads.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setActiveChatId(th.id)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    activeChatId === th.id
                      ? "bg-emerald-50/70 border-emerald-600 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-900 leading-snug">{th.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">{th.date}</span>
                </button>
              ))}
            </aside>

            <main className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">{activeChatThread.title}</h2>
                <p className="text-[11px] text-slate-400">
                  Configured for {customCircuitName} ({countyName} County) • {dcaName} Precedent
                </p>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {activeChatThread.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap max-w-3xl ${
                      m.sender === "user"
                        ? "bg-slate-900 text-white ml-auto"
                        : "bg-slate-100 border border-slate-200 text-slate-800"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 opacity-70">
                      {m.sender === "user" ? plaintiffName : `Florida Legal AI (${dcaName})`}
                    </span>
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
                      handleSendChatThreadMessage(aiInput);
                      setAiInput("");
                    }
                  }}
                  placeholder={`Ask about ${customCircuitName} procedures, Count IV rehearing, Dinuro, or Rule 1.130...`}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  onClick={() => {
                    handleSendChatThreadMessage(aiInput);
                    setAiInput("");
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition"
                >
                  Send
                </button>
              </div>
            </main>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: RECENT DRAFTS DIRECTORY & FULL-SCREEN PLEADING EDITOR       */}
        {/* ================================================================== */}
        {activeNav === "recent" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">All Recent Pleading Drafts</h2>
                  <p className="text-xs text-slate-500">
                    Click any draft below to open it in the full-screen Pleading Editor.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav("templates")}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Build New Draft from Judge Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedDrafts.map((dr) => (
                  <div
                    key={dr.id}
                    onClick={() => {
                      setActiveDraftId(dr.id);
                      setActiveNav("editor");
                    }}
                    className="p-5 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          {dr.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{dr.updatedAt}</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">{dr.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-3 font-serif">
                        {dr.content.slice(0, 160)}...
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-semibold text-slate-500">{dr.status}</span>
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        Open Pleading <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "editor" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F1F3F5]">
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveNav("recent")}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Drafts
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-900">{activeDraft.title}</span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  {customCircuitName} • Div {divisionNumber}
                </span>
              </div>
              <button
                onClick={handleExportActiveDraft}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Word / Text Pleading
              </button>
            </div>

            <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex justify-center">
              <textarea
                value={activeDraft.content}
                onChange={(e) => {
                  const val = e.target.value;
                  const updated = savedDrafts.map((d) =>
                    d.id === activeDraft.id ? { ...d, content: val } : d
                  );
                  setSavedDrafts(updated);
                  try {
                    localStorage.setItem("fl_prose_drafts", JSON.stringify(updated));
                  } catch (err) {}
                }}
                className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-md p-6 sm:p-12 min-h-[900px] font-serif text-xs leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: WORK / TODAY (Google Calendar & Gmail E-Service Integration)*/}
        {/* ================================================================== */}
        {activeNav === "today" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col lg:flex-row gap-6">
            {/* Left Calendar Widget */}
            <div className="w-full lg:w-80 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">October 2026</span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Google Calendar Synced
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="text-slate-400 text-[10px] font-bold">
                    {d}
                  </span>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const hasDeadline = calendarEvents.some((ev) => ev.day === day);
                  return (
                    <div
                      key={day}
                      className={`p-1.5 rounded text-xs relative ${
                        day === 17
                          ? "bg-slate-900 text-white font-bold"
                          : hasDeadline
                          ? "bg-rose-100 text-rose-900 font-bold border border-rose-300"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Add Deadline to Google Calendar */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Add Statutory Deadline to Google Calendar
                </span>
                <input
                  type="text"
                  value={newCalTitle}
                  onChange={(e) => setNewCalTitle(e.target.value)}
                  placeholder="e.g. Rule 1.530 Rehearing Service"
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
                <input
                  type="date"
                  value={newCalDate}
                  onChange={(e) => setNewCalDate(e.target.value)}
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
                <button
                  onClick={() => {
                    if (!newCalTitle.trim()) return;
                    const dayNum = parseInt(newCalDate.split("-")[2] || "20", 10);
                    setCalendarEvents((prev) => [
                      ...prev,
                      {
                        id: `cal-${Date.now()}`,
                        date: newCalDate,
                        day: dayNum,
                        title: newCalTitle,
                        type: "Court Deadline"
                      }
                    ]);
                    setNewCalTitle("");
                  }}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
                >
                  + Save & Sync to Google Calendar
                </button>
              </div>
            </div>

            {/* Right Dashboard (Matches Screenshot 14) */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-serif font-medium text-slate-900">
                    Good afternoon, Tina.
                  </h2>
                  <p className="text-xs text-slate-500">
                    Saturday, October 17, 2026 • {customCircuitName} ({countyName} County Division {divisionNumber})
                  </p>
                </div>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  Gmail E-Service Connected (service@allegedlylegal.com) ↗
                </a>
              </div>

              {/* Upcoming Court & Statutory Deadlines */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Waiting on You • Active Statutory & Divisional Deadlines
                </span>
                {calendarEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{ev.title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Date: {ev.date} • {ev.type}
                      </span>
                    </div>
                    <a
                      href={createGoogleCalendarUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-semibold inline-flex items-center gap-1 shrink-0"
                    >
                      Push to Google Calendar <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Around You • E-Filing Portal & Gmail Alerts
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    • Fourth Amended Complaint E-Served (Oct 16, 2026)
                  </p>
                  <p className="text-xs text-rose
