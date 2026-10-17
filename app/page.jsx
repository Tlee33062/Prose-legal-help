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
  Calendar,
  Upload,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Mail
} from "lucide-react";

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
    breachExamples: "Undisclosed conflict of interest (Rule 4-1.7), collusion with adverse managers, or active concealment of corporate transactions."
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
    breachExamples: "Refusal to furnish client general ledgers and tax workpapers upon demand (F.A.C. 61H1-23.002; § 473.318) and unverified disclosures to lenders."
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
    breachExamples: "Self-dealing transfers, commingling funds, withholding statutory inspection records (§ 607.1602), and bad-faith nondisclosure stripping § 607.0832 safe harbor."
  },
  vendor: {
    label: "Commercial Vendor / Counterparty",
    governingRules: "Fla. Stat. § 95.11(2)(b) & Fla. Stat. § 57.105(7)",
    sol: "5 Years Written / 4 Years Oral",
    privityTypes: [
      { id: "written_contract", label: "Executed Written Contract (Rule 1.130 Attached)" },
      { id: "oral_agreement", label: "Oral Contract / Implied Course of Dealing" }
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
    breachExamples: "Unauthorized release of collateral, improper reliance on unverified CPA statements, or wrongful default acceleration."
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
    filer: "Court / Judge Olefson (Div. 25)",
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
    defenseGrounds: "Defense argues injury flowed to the entity first and Plaintiff only suffered indirect member diminution in value under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014).",
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
    defenseGrounds: "CPA argues he was retained solely by the entity, owes no duty to Plaintiff individually, and communications/ledgers are privileged under Fla. Stat. § 473.316.",
    howToOvercome: "Invoke three statutory hooks: (1) F.A.C. R. 61H1-23.002 & Fla. Stat. § 473.318 mandate return of client records upon request; (2) Fla. Stat. § 473.316(4)(c) abolishes accountant privilege in disputes between parties claiming through the same joint client/entity; (3) § 473.316(4)(a) abolishes privilege when services were sought to aid a fraud or tort. For Aiding & Abetting, plead underlying breach, actual knowledge, and substantial assistance.",
    controllingLaw: "Fla. Stat. §§ 473.316(4)(a), (4)(c), 473.318; F.A.C. R. 61H1-23.002; Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016); SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327."
  },
  {
    id: "dp-4",
    count: "All Counts: Procedural & Four Corners Attacks",
    defenseAttack: "Rule 1.130 Missing Exhibits & Unsworn Factual Proffers at MTD Hearing",
    defenseGrounds: "Defense counsel introduces outside factual assertions at the hearing not found in the complaint, or claims a referenced instrument was not attached under Rule 1.130(a).",
    howToOvercome: "Enforce the strict Four Corners Rule: a trial court commits reversible error when it relies on unsworn statements of defense counsel or extrinsic facts outside the complaint on a Motion to Dismiss. Attach core instruments as EXHIBIT A/B, or plead that withheld records are in Defendants' exclusive possession (Sachse exception).",
    controllingLaw: "Fla. R. Civ. P. 1.130(a), 1.140(b); Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000); Sachse v. Tampa Music Co., 262 So. 2d 17 (Fla. 2d DCA 1972)."
  }
];

const JUDGE_TEMPLATES = [
  {
    id: "tpl-rehearing",
    name: "Rule 1.530 Motion for Rehearing & To Vacate Dismissal",
    category: "Post-Order Relief (15-Day Jurisdictional Deadline)",
    divisionRules: "17th Cir. Div. 25 (Judge Olefson) • 12pt Times New Roman • Double-Spaced • Mandatory Submit to JA / CMS",
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
  },
  {
    id: "tpl-proposed-order",
    name: "Division 25 Proposed Order (CMS Format)",
    category: "Judicial Order",
    divisionRules: "17th Cir. CMS Standards • No Blank Signature Pages • Complete E-Service List",
    description: "Formatted proposed order ready for upload to the 17th Judicial Circuit Case Management System (CMS)."
  }
];

export default function FloridaProSeLitigationApp() {
  const [activeNav, setActiveNav] = useState("today");
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [intakeSubTab, setIntakeSubTab] = useState("defendants");
  const [plaintiff, setPlaintiff] = useState("Tina Diane Lee");

  // 1. History Threads
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
          text: "Under 4th DCA precedent (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173), a trial court is strictly confined to the four corners of the complaint on a Motion to Dismiss. Relying on unsworn defense factual proffers or resolving an unpled affirmative defense like Fla. Stat. § 607.0832 outside the complaint is reversible error. Under Fla. R. Civ. P. 1.530(b), you have a strict 15-day jurisdictional window from October 5 (until October 20, 2026) to serve a Motion for Rehearing and to Vacate."
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
          text: "Under Sachse v. Tampa Music Co., 262 So. 2d 17 (Fla. 2d DCA 1972), if an instrument sued upon is in the exclusive possession of the defendant, a complaint is not subject to dismissal under Rule 1.130(a) where the plaintiff alleges that the document is in the defendant's possession and will be produced through discovery."
        }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState("chat-1");

  // 2. Saved Drafts
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
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nRICHARD HALLE, ESQ., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nPLAINTIFF'S TIMELY MOTION FOR REHEARING AND TO VACATE OCTOBER 5, 2026 ORDER DISMISSING COUNT IV WITH PREJUDICE PURSUANT TO FLA. R. CIV. P. 1.530\n\nPlaintiff, TINA DIANE LEE, pro se, timely moves for rehearing of the Court's October 5, 2026 Order Dismissing Count IV With Prejudice, and states:\n\n1. TIMELINESS: Pursuant to Fla. R. Civ. P. 1.530(b), this Motion is served within 15 days of the October 5, 2026 Order.\n2. FOUR CORNERS VIOLATION: On a motion to dismiss, the Court is strictly confined to the four corners of the complaint (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)). The October 5 Order improperly adopted unsworn factual assertions of defense counsel regarding lender communications and corporate safe harbors (§ 607.0832) that do not appear on the face of the pleading.\n3. STATUTORY PRIVILEGE WAIVER & PRIVITY: Under Fla. Stat. § 473.316(4)(a) & (c) and F.A.C. R. 61H1-23.002, accountant-client privilege does not apply to joint clients or fraud, and CPAs are statutorily required to return client records.\n\nWHEREFORE, Plaintiff respectfully requests that this Court grant rehearing, vacate the dismissal with prejudice of Count IV, and permit the action to proceed on the Fourth Amended Complaint.\n\nBy: /s/ Tina Diane Lee`
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

  // 3. Calendar & Google Sync
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
      title: "Defendants' Response Due to 4th Amended Complaint (Rule 1.190(a))",
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

  // 4. Defendants Intake
  const [defendantsList, setDefendantsList] = useState(INITIAL_DEFENDANTS);
  const [activeDefId, setActiveDefId] = useState("def-1");
  const [intakeSaveBanner, setIntakeSaveBanner] = useState(false);

  // 5. Matters
  const [mattersList] = useState([
    {
      id: "matter-1",
      title: "CACE Lee vs Halle, Engleberg",
      caseNumber: "CACE-26-XXXXXX",
      court: "17th Judicial Circuit • Broward County Division 25",
      judge: "Hon. Shari Africk Olefson",
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

  // 6. Signatures
  const [signatureText, setSignatureText] = useState("/s/ Tina Diane Lee");
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureSavedMsg, setSignatureSavedMsg] = useState(false);

  // 7. Filed Pleadings
  const [filedPleadings, setFiledPleadings] = useState(INITIAL_FILED_PLEADINGS);
  const [newFiledTitle, setNewFiledTitle] = useState("");
  const [newFiledFiler, setNewFiledFiler] = useState("Defense Counsel");
  const [newFiledSummary, setNewFiledSummary] = useState("");

  // 8. Defense Playbook
  const [defensePlaybook, setDefensePlaybook] = useState(INITIAL_DEFENSE_PLAYBOOK);
  const [defenseChatMsgs, setDefenseChatMsgs] = useState([
    {
      sender: "assistant",
      text: "Defense Playbook AI ready. I have analyzed the October 5, 2026 Order dismissing Count IV and Defendants' Motions to Dismiss. Ask me how to dismantle any defense objection (e.g., § 607.0832 Safe Harbor, Ultramares Privity, Dinuro, or the Four Corners Rule)."
    }
  ]);
  const [defenseChatInput, setDefenseChatInput] = useState("");

  // 10. Evidence Vault
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

  // 11. Templates
  const [selectedTemplateId, setSelectedTemplateId] = useState("tpl-rehearing");
  const [respondingToFilingId, setRespondingToFilingId] = useState("filed-1");

  // Floating AI
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");

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
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveDefendantsToMemory = (updatedList) => {
    setDefendantsList(updatedList);
    try {
      localStorage.setItem("fl_prose_defendants", JSON.stringify(updatedList));
      setIntakeSaveBanner(true);
      setTimeout(() => setIntakeSaveBanner(false), 2000);
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
      return "CRITICAL FLORIDA PROCEDURAL ANALYSIS (Count IV Dismissal & Rule 1.530):\n1. Jurisdictional Deadline: Under Fla. R. Civ. P. 1.530(b), a Motion for Rehearing must be served within 15 days of the Oct 5, 2026 Order (Deadline: Tuesday, October 20, 2026). Filing a timely Rule 1.530 motion directed to an order dismissing a claim/party with prejudice tolls the 30-day appellate window under Fla. R. App. P. 9.020(h).\n2. Reversible Error on the Four Corners: Under Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000), a trial court may not consider unsworn factual assertions of defense counsel or resolve unpled affirmative defenses like Fla. Stat. § 607.0832 on a Motion to Dismiss.\n3. Statutory CPA Hooks: Cite Fla. Stat. § 473.316(4)(a) (crime/fraud exception to accountant privilege), § 473.316(4)(c) (joint-client exception), and F.A.C. R. 61H1-23.002 (mandatory return of client records).";
    }
    if (lower.includes("dinuro") || lower.includes("direct") || lower.includes("derivative")) {
      return "FLORIDA DIRECT VS. DERIVATIVE STANDING (Dinuro Test):\nUnder Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014) and Strazzulla v. Riverside Banking Co., 175 So. 3d 879 (Fla. 4th DCA 2015), a member/shareholder may bring a DIRECT action if:\n(1) There is a direct harm to the plaintiff such that the alleged injury does not flow subsequently from an initial harm to the company; AND\n(2) There is a special injury distinct from other members OR a separate duty owed directly to the plaintiff by statute or contract (such as deprivation of individual inspection rights under § 607.1602).";
    }
    if (lower.includes("607.0832") || lower.includes("safe harbor")) {
      return "DEFEATING FLA. STAT. § 607.0832 DIRECTOR SAFE HARBOR:\nSection 607.0832 is a fact-intensive affirmative defense, NOT an absolute bar on a Motion to Dismiss. It requires that material facts of the conflict relationship were disclosed to disinterested directors/shareholders who approved it in good faith, OR that the transaction was fair to the corporation. By pleading ultimate facts of secret self-dealing, active concealment, and bad faith in your Fourth Amended Complaint, § 607.0832 cannot be resolved on a Rule 1.140(b)(6) motion.";
    }
    return `FLORIDA CIRCUIT CIVIL ANALYSIS (17th Judicial Circuit Division 25):\nUnder Fla. R. Civ. P. 1.110(b), ensure every count separates each defendant's specific acts (who, what, when, and statutory duty breached). Active defendants (${defendantsList.map((d) => d.name).join(", ")}) are synced into your Playbook and Matter matrices.`;
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
        howToOvercome: "Counter with specific ultimate facts under Fla. R. Civ. P. 1.110(b), invoke the Four Corners Rule (Barbado v. Green & Murphy, P.A.), and attach supporting exhibits under Rule 1.130(a).",
        controllingLaw: "Fla. R. Civ. P. 1.110(b), 1.130(a), 1.140(b); 4th DCA Precedent."
      },
      ...prev
    ]);
    setNewFiledTitle("");
    setNewFiledSummary("");
  };

  const handleGenerateTemplateIntoDraft = () => {
    const tpl = JUDGE_TEMPLATES.find((t) => t.id === selectedTemplateId) || JUDGE_TEMPLATES[0];
    const refDoc = filedPleadings.find((f) => f.id === respondingToFilingId) || filedPleadings[0];
    const defNames = defendantsList.map((d) => d.name.toUpperCase()).join(", ");

    const generatedContent = `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT
IN AND FOR BROWARD COUNTY, FLORIDA

CASE NO.: CACE-26-XXXXXX
DIVISION: 25 (Hon. Shari Africk Olefson)

TINA DIANE LEE,
    Plaintiff,
v.
${defNames},
    Defendants.
__________________________________________/

${tpl.name.toUpperCase()}
(Responding to: ${refDoc.title})

Plaintiff, TINA DIANE LEE, pro se, files this ${tpl.name} in accordance with 17th Judicial Circuit Division 25 Procedures and Florida Rules of Civil Procedure, and states:

I. PROCEDURAL POSTURE & REFERENCED FILING
1. This pleading directly addresses and responds to "${refDoc.title}" filed on ${refDoc.dateFiled} by ${refDoc.filer}.
2. Divisional Compliance: Formatted in 12-point Times New Roman, double-spaced, with mandatory Local Rule 10A conferral certification.

II. STATEMENT OF ULTIMATE FACTS & FLORIDA LEGAL AUTHORITY
3. Under Florida's strict fact-pleading standard (Fla. R. Civ. P. 1.110(b)) and the Four Corners Rule (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)), the Court's review is strictly confined to the verified allegations and Rule 1.130(a) exhibits.
${defendantsList
  .map(
    (d, i) =>
      `${i + 4}. As to Defendant ${d.name} (${PROFESSION_CONFIGS[d.profession]?.label}): Privity is established via ${d.privityType}. Specifically, on ${d.dateLastAction} (discovered ${d.discoveryDate}), Defendant committed the following breach: ${d.specificBreach} (Supported by ${d.evidence}).`
  )
  .join("\n")}

III. MEMORANDUM OF LAW OVERCOMING DEFENSE OBJECTIONS
• Rehearing & Vacation of Dismissal With Prejudice (Fla. R. Civ. P. 1.530): Served within the strict 15-day jurisdictional window from October 5, 2026. Resolving unpled affirmative defenses such as Fla. Stat. § 607.0832 or adopting unsworn defense factual assertions outside the four corners constitutes reversible error.
• Statutory CPA Duties & Privilege Exceptions: Under Fla. Stat. §§ 473.316(4)(a), (4)(c), and 473.318, and F.A.C. R. 61H1-23.002, accountant-client privilege is waived in joint-client disputes and crime/fraud contexts, and client records/workpapers must be furnished upon demand.
• Direct Action Standing (Dinuro Test): Plaintiff alleges individualized pecuniary injury and violation of statutory inspection rights distinct from general corporate harm under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014).

WHEREFORE, Plaintiff respectfully requests that this Honorable Court enter an Order granting the relief requested herein, together with taxable costs under Fla. Stat. § 57.041, reciprocal fees under § 57.105(7), and such further relief as is just and proper.

LOCAL RULE 10A CERTIFICATE OF GOOD FAITH CONFERRAL
I HEREBY CERTIFY that Plaintiff has conferred or attempted to confer in good faith with opposing counsel to resolve the issues raised herein.

CERTIFICATE OF SERVICE (FLA. R. GEN. PRAC. & JUD. ADMIN. 2.516)
I HEREBY CERTIFY that a true and correct copy of the foregoing was furnished via the Florida Courts E-Filing Portal on October 17, 2026.

Respectfully submitted,

By: ${signatureText}
${plaintiff}, Pro Se
Email: service@allegedlylegal.com`;

    const newDraftId = `draft-${Date.now()}`;
    const newDraftObj = {
      id: newDraftId,
      title: `${tpl.name} (Re: ${refDoc.title.slice(0, 26)}...)`,
      updatedAt: "2026-10-17",
      caseNo: "CACE-26-XXXXXX",
      type: tpl.category,
      status: "Division 25 Ready",
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
      capturedMetadata: `Authenticated Metadata • Custodian: Plaintiff • Linked to ${selectedDef.name}`,
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
    const titleEnc = encodeURIComponent(`[FL 17th Cir] ${ev.title}`);
    const detailsEnc = encodeURIComponent(`Case: CACE Lee vs Halle, Engleberg (Broward Div 25)\nCategory: ${ev.type}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEnc}&dates=${dateClean}/${dateClean}&details=${detailsEnc}`;
  };

  return (
    <div className="flex h-screen w-full bg-[#FDFDFD] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside
        className={`${
          sidebarOpenMobile
            ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl flex"
            : "hidden lg:flex lg:w-64"
        } bg-[#FAFAFA] border-r border-slate-200 flex-col justify-between shrink-0 select-none overflow-y-auto`}
      >
        <div className="p-3 space-y-4">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/50 cursor-pointer">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                TB
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate">
                Tina Bulger&apos;s Workspace
              </span>
            </div>
            <button onClick={() => setSidebarOpenMobile(false)} className="lg:hidden text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block shrink-0" />
          </div>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => {
                const newThreadId = `chat-${Date.now()}`;
                setChatThreads((prev) => [
                  {
                    id: newThreadId,
                    title: `Legal Research (${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
                    date: "Just now",
                    messages: [
                      {
                        sender: "assistant",
                        text: "New Florida Legal AI session started. Ask about 17th Judicial Circuit rules, Count IV rehearing grounds, or Rule 1.110(b) fact-pleading."
                      }
                    ]
                  },
                  ...prev
                ]);
                setActiveChatId(newThreadId);
                setActiveNav("history");
                setSidebarOpenMobile(false);
              }}
              className="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
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
              className="px-2 py-1.5 hover:bg-slate-50 text-slate-500"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CHATS & DRAFTS */}
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
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "history"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tab 1: History</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 rounded">
                  {chatThreads.length}
                </span>
              </button>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-100">
                  <button
                    onClick={() => {
                      setActiveNav("recent");
                      setSidebarOpenMobile(false);
                    }}
                    className={`flex items-center gap-2 flex-1 text-left ${
                      activeNav === "recent" || activeNav === "editor" ? "font-semibold text-slate-900" : ""
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
                    <span>Tab 2: Recent Drafts</span>
                  </button>
                  <Plus
                    onClick={() => setActiveNav("recent")}
                    className="w-3.5 h-3.5 text-slate-400 cursor-pointer"
                  />
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
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs truncate ${
                          activeNav === "editor" && activeDraftId === dr.id
                            ? "bg-emerald-50 text-emerald-900 font-semibold"
                            : "text-slate-500 hover:bg-slate-100"
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

          {/* WORK SECTION */}
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
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "today"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tab 3: Today (Google Sync)</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>

              <button
                onClick={() => {
                  setActiveNav("intake");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "intake"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tab 4: Intake</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-mono font-bold">
                  {defendantsList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("matters");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "matters"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tab 5: Matters</span>
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
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "signatures"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Tab 6: Saved Signatures</span>
              </button>
            </div>
          </div>

          {/* II. LIBRARY SECTION */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
              II. Library
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveNav("filed_drafts");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "filed_drafts"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
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
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "defense_playbook"
                    ? "bg-rose-50 text-rose-900 font-semibold border-l-2 border-rose-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>2. Defense Playbook</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("plaintiff_playbook");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "plaintiff_playbook"
                    ? "bg-emerald-50 text-emerald-900 font-semibold border-l-2 border-emerald-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>3. Plaintiffs Playbook</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("vault");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "vault"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderLock className="w-3.5 h-3.5 text-slate-500" />
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
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "templates"
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>5. Templates / Rules</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 space-y-2 bg-[#FAFAFA]">
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
              <span>Getting Started</span>
              <span>6/6 Active</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-full w-full" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Memory Synced • {defendantsList.length} Defendants
            </p>
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
        <div
          onClick={() => setSidebarOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
        />
      )}

      {/* MAIN CONTENT STAGE */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
              <h1 className="font-semibold text-xs sm:text-sm text-slate-900">
                Florida Circuit Civil Pro Se Litigation Studio
              </h1>
              <span className="text-[10px] text-slate-500 font-mono">
                17th Judicial Circuit • Broward County Division 25
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Florida Legal AI</span>
            </button>
            <button
              onClick={handleExportActiveDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Pleading</span>
            </button>
          </div>
        </header>

        {/* TAB 1: HISTORY */}
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
                  className={`w-full text-left p-3 rounded-xl border ${
                    activeChatId === th.id
                      ? "bg-emerald-50/70 border-emerald-600 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-900">{th.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">{th.date}</span>
                </button>
              ))}
            </aside>

            <main className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">{activeChatThread.title}</h2>
                <p className="text-[11px] text-slate-400">
                  Grounded in Florida Rules of Civil Procedure & 4th DCA Precedent
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
                    <span className="text-[10px] font-bold uppercase block mb-1 opacity-70">
                      {m.sender === "user" ? "Plaintiff Pro Se" : "Florida Legal AI"}
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
                  placeholder="Ask follow-up question on Count IV rehearing, Dinuro, or Rule 1.130..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                />
                <button
                  onClick={() => {
                    handleSendChatThreadMessage(aiInput);
                    setAiInput("");
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                >
                  Send
                </button>
              </div>
            </main>
          </div>
        )}

        {/* TAB 2: RECENT DRAFTS */}
        {activeNav === "recent" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">All Recent Pleading Drafts</h2>
                  <p className="text-xs text-slate-500">
                    Click any draft below to open it in the full-screen Florida Pleading Editor.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav("templates")}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Build New Draft
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savedDrafts.map((dr) => (
                  <div
                    key={dr.id}
                    onClick={() => {
                      setActiveDraftId(dr.id);
                      setActiveNav("editor");
                    }}
                    className="p-5 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 shadow-sm cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          {dr.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{dr.updatedAt}</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900">{dr.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-3 font-serif">
                        {dr.content.slice(0, 150)}...
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-semibold text-slate-500">{dr.status}</span>
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        Open Screen <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DEDICATED FULL-SCREEN DRAFT EDITOR */}
        {activeNav === "editor" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F1F3F5]">
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveNav("recent")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Drafts
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-900">{activeDraft.title}</span>
              </div>
              <button
                onClick={handleExportActiveDraft}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Download Court Document (.txt)
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
                className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-12 min-h-[900px] font-serif text-xs leading-relaxed text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: WORK / TODAY (Google Calendar & Gmail Sync) */}
        {activeNav === "today" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-80 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">October 2026</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Google Calendar Synced
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="text-slate-400 text-[10px] font-bold">
                    {d}
                  </span>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`p-1.5 rounded text-xs ${
                      day === 17
                        ? "bg-slate-900 text-white font-bold"
                        : day === 20 || day === 26
                        ? "bg-rose-100 text-rose-800 font-bold"
                        : "text-slate-600"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Add Court Deadline to Google Calendar
                </span>
                <input
                  type="text"
                  value={newCalTitle}
                  onChange={(e) => setNewCalTitle(e.target.value)}
                  placeholder="Hearing or Filing Deadline..."
                  className="w-full border border-slate-200 rounded p-1.5 text-xs"
                />
                <input
                  type="date"
                  value={newCalDate}
                  onChange={(e) => setNewCalDate(e.target.value)}
                  className="w-full border border-slate-200 rounded p-1.5 text-xs"
                />
                <button
                  onClick={() => {
                    if (!newCalTitle.trim()) return;
                    setCalendarEvents((prev) => [
                      ...prev,
                      {
                        id: `cal-${Date.now()}`,
                        date: newCalDate,
                        day: Number(newCalDate.split("-")[2]),
                        title: newCalTitle,
                        type: "Court Deadline"
                      }
                    ]);
                    setNewCalTitle("");
                  }}
                  className="w-full py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
                >
                  + Save & Sync Deadline
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-serif font-medium text-slate-900">Good afternoon, Tina.</h2>
                <p className="text-xs text-slate-500">
                  Saturday, October 17, 2026 • Connected to Gmail (service@allegedlylegal.com)
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Statutory Deadlines & Google Calendar Events
                </span>
                {calendarEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{ev.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ev.date} • {ev.type}
                      </span>
                    </div>
                    <a
                      href={createGoogleCalendarUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1 self-start"
                    >
                      <Calendar className="w-3 h-3 text-emerald-700" /> Push to Google Calendar ↗
                    </a>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Gmail E-Service Inbox (eservice@myflcourtaccess.com)
                  </span>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 block">
                      Filing Confirmation: 4th Amended Complaint
                    </span>
                    <span className="text-[10px] text-slate-400">Synced from Gmail • Oct 16, 2026</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Matters</span>
                  <div
                    onClick={() => setActiveNav("matters")}
                    className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between cursor-pointer hover:border-emerald-600"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-800">
                        CACE Lee vs Halle, Engleberg
                      </span>
                      <p className="text-[10px] text-slate-400">
                        4 Counts Mapped • {defendantsList.length} Defendants
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTAKE (Multi-Defendant Profession Matrix + Cases/Mail Queue) */}
        {activeNav === "intake" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6 text-xs font-semibold">
                <button
                  onClick={() => setIntakeSubTab("defendants")}
                  className={`py-3 border-b-2 ${
                    intakeSubTab === "defendants"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Defendant Profession Intake ({defendantsList.length})
                </button>
                <button
                  onClick={() => setIntakeSubTab("cases")}
                  className={`py-3 border-b-2 ${
                    intakeSubTab === "cases"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Cases Queue (0)
                </button>
                <button
                  onClick={() => setIntakeSubTab("mail")}
                  className={`py-3 border-b-2 ${
                    intakeSubTab === "mail"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Intake Mail (0)
                </button>
              </div>
              {intakeSaveBanner && (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-semibold">
                  ✓ Saved to Defendant Memory
                </span>
              )}
            </div>

            {intakeSubTab !== "defendants" ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="font-serif text-base font-medium text-slate-800">Nothing at the door</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Email sent to your intake address lands here as a case proposal before becoming a matter.
                </p>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
                <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 bg-[#FAFAFA] p-3 overflow-y-auto space-y-2 shrink-0">
                  <span className="text-[11px] font-bold uppercase text-slate-400 px-1 block">
                    Memory-Stored Defendants
                  </span>
                  {defendantsList.map((def) => (
                    <button
                      key={def.id}
                      onClick={() => setActiveDefId(def.id)}
                      className={`w-full text-left p-3 rounded-lg border ${
                        activeDefId === def.id
                          ? "bg-white border-emerald-600 shadow-sm"
                          : "bg-white/60 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {def.name}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1 rounded">
                          {def.profession}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{def.entityName}</p>
                    </button>
                  ))}
                  <button
                    onClick={handleAddNewDefendant}
                    className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Defendant
                  </button>
                </aside>

                <main className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-slate-700">
                          Step 1: Select Defendant Profession
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {currentProfConfig.governingRules}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(PROFESSION_CONFIGS).map(([key, cfg]) => (
                          <button
                            key={key}
                            onClick={() => handleUpdateDef("profession", key)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                              selectedDef.profession === key
                                ? "bg-emerald-700 text-white border-emerald-700"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Defendant Name
                        </label>
                        <input
                          type="text"
                          value={selectedDef.name}
                          onChange={(e) => handleUpdateDef("name", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Firm / Entity Name
                        </label>
                        <input
                          type="text"
                          value={selectedDef.entityName}
                          onChange={(e) => handleUpdateDef("entityName", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Privity Anchor (Contract / Verbal / Statutory)
                        </label>
                        <select
                          value={selectedDef.privityType}
                          onChange={(e) => handleUpdateDef("privityType", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                        >
                          {currentProfConfig.privityTypes.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Date of Last Action
                        </label>
                        <input
                          type="date"
                          value={selectedDef.dateLastAction}
                          onChange={(e) => handleUpdateDef("dateLastAction", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
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
                        onChange={(e) => handleUpdateDef("specificBreach", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Evidence (Rule 1.130)
                        </label>
                        <input
                          type="text"
                          value={selectedDef.evidence}
                          onChange={(e) => handleUpdateDef("evidence", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">Witnesses</label>
                        <input
                          type="text"
                          value={selectedDef.witnesses}
                          onChange={(e) => handleUpdateDef("witnesses", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Other Co-Defendants
                        </label>
                        <input
                          type="text"
                          value={selectedDef.otherDefendants}
                          onChange={(e) => handleUpdateDef("otherDefendants", e.target.value)}
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

        {/* TAB 5: MATTERS (Case-by-Case Count & Intake Mapping) */}
        {activeNav === "matters" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              {mattersList.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{m.title}</h2>
                      <p className="text-xs text-slate-500">
                        {m.court} • {m.judge}
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                      {m.caseNumber}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Counts Related to Intake Defendants
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {m.counts.map((c, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800">{c.countNum}: {c.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            <strong>Authority:</strong> {c.authority}
                          </p>
                          <p className="text-[11px] text-slate-600">
                            <strong>Privity Hook:</strong> {c.privityHook}
                          </p>
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-700">{c.status}</span>
                            <button
                              onClick={() => setActiveNav("defense_playbook")}
                              className="text-emerald-700 font-semibold hover:underline"
                            >
                              Playbook →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SAVED SIGNATURES */}
        {activeNav === "signatures" && (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex justify-center">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-serif font-semibold text-slate-900">Saved Signature</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Save your signature once and apply it to verified complaints, motions, and certificates of service.
                </p>
              </div>

              <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-2 block cursor-pointer hover:border-emerald-600">
                <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Drop signature image or click to upload (PNG, JPG, WebP)
                </span>
                <input type="file" accept="image/*" onChange={handleSignatureImageUpload} className="hidden" />
              </label>

              {signatureImage && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <img src={signatureImage} alt="Saved Signature" className="max-h-20 mx-auto" />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Electronic /s/ Signature Block (Fla. R. Gen. Prac. & Jud. Admin. 2.515)
                </label>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-serif"
                />
              </div>

              <button
                onClick={() => {
                  try {
                    localStorage.setItem("fl_prose_sig_text", signatureText);
                    setSignatureSavedMsg(true);
                    setTimeout(() => setSignatureSavedMsg(false), 2000);
                  } catch (e) {}
                }}
                className="w-full py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                {signatureSavedMsg ? "✓ Signature Saved to Memory" : "Save Signature"}
              </button>
            </div>
          </div>
        )}

        {/* LIBRARY 1: FILED DRAFTS, MOTIONS, PLEADINGS & ORDERS */}
        {activeNav === "filed_drafts" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">
                  Log Filed Motion, Pleading, or Court Order for AI Defense Playbook Analysis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    value={newFiledTitle}
                    onChange={(e) => setNewFiledTitle(e.target.value)}
                    placeholder="Document Title (e.g., Motion to Dismiss / Order)"
                    className="border border-slate-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    value={newFiledFiler}
                    onChange={(e) => setNewFiledFiler(e.target.value)}
                    placeholder="Filed By (e.g., Defense Counsel / Court)"
                    className="border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <textarea
                  rows={2}
                  value={newFiledSummary}
                  onChange={(e) => setNewFiledSummary(e.target.value)}
                  placeholder="Paste key defense arguments or order findings for AI to extract into Defense Playbook..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
                <button
                  onClick={handleAddAndAnalyzeFiledPleading}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  AI Review & Add to Defense Playbook
                </button>
              </div>

              <div className="space-y-3">
                {filedPleadings.map((doc) => (
                  <div key={doc.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{doc.title}</span>
                      <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                        {doc.extractedAttack}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{doc.summary}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>{doc.filer} • Filed {doc.dateFiled}</span>
                      <button
                        onClick={() => {
                          setRespondingToFilingId(doc.id);
                          setActiveNav("templates");
                        }}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        Build Response Template →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY 2: DEFENSE PLAYBOOK + AI CHAT */}
        {activeNav === "defense_playbook" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Defense Playbook: Count-by-Count Objections & How to Overcome
              </h2>
              {defensePlaybook.map((item) => (
                <div key={item.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-sm">
                  <span className="text-xs font-bold uppercase text-rose-700 block">{item.count}</span>
                  <h3 className="text-xs font-bold text-slate-900">Attack: {item.defenseAttack}</h3>
                  <p className="text-xs text-slate-600">
                    <strong>Defense Grounds:</strong> {item.defenseGrounds}
                  </p>
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-950">
                    <strong>How to Overcome (Florida Law):</strong> {item.howToOvercome}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    <strong>Controlling Authority:</strong> {item.controllingLaw}
                  </p>
                </div>
              ))}
            </div>

            <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-200 bg-slate-900 text-white">
                <span className="text-xs font-bold uppercase tracking-wider block">
                  Defense Playbook AI Strategist
                </span>
                <span className="text-[10px] text-slate-400">
                  Ask how to defeat specific defense motions or objections
                </span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs max-h-96 lg:max-h-none">
                {defenseChatMsgs.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg whitespace-pre-wrap leading-relaxed ${
                      m.sender === "user"
                        ? "bg-slate-900 text-white ml-4"
                        : "bg-slate-100 text-slate-800 mr-4"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={defenseChatInput}
                  onChange={(e) => setDefenseChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendDefensePlaybookChat()}
                  placeholder="Ask about § 607.0832, CPA privity, Count IV..."
                  className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                />
                <button
                  onClick={handleSendDefensePlaybookChat}
                  className="px-3 py-1.5 bg-rose-700 text-white rounded text-xs font-semibold"
                >
                  Ask
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* LIBRARY 3: PLAINTIFFS PLAYBOOK */}
        {activeNav === "plaintiff_playbook" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-5">
              <div className="p-5 bg-emerald-900 text-white rounded-xl space-y-2 shadow-sm">
                <span className="text-[10px] font-mono uppercase bg-emerald-800 px-2 py-0.5 rounded">
                  AI-Synthesized Offensive Litigation Strategy • 4th DCA & Florida Statutory Precision
                </span>
                <h2 className="text-base font-bold">
                  Plaintiff&apos;s Master Playbook & Standing Vulnerability Cure
                </h2>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Generated from your Filed Pleadings, Defense Playbook, and {defendantsList.length} Intake Defendants.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    1. Immediate Next Step: Rule 1.530 Rehearing (Due Oct 20, 2026)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Serve Plaintiff&apos;s Motion for Rehearing and to Vacate the Oct 5 Order dismissing Count IV with prejudice. Emphasize that the trial court erred by adopting unsworn defense factual assertions regarding lender disclosures and resolving § 607.0832 safe harbor outside the four corners of the complaint (<em>Barbado v. Green &amp; Murphy, P.A.</em>, 758 So. 2d 1173 (Fla. 4th DCA 2000)).
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    2. Overcoming CPA Privity & Privilege (§ 473.316 & § 473.318)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under Fla. Stat. § 473.316(4)(c), there is no accountant-client privilege as to communications relevant to an issue of breach of duty or dispute between parties claiming through the same joint client/entity. Under F.A.C. R. 61H1-23.002 and § 473.318, withholding client general ledgers and workpapers is a direct statutory violation.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    3. Curing Standing Under Dinuro (Direct vs. Derivative)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Anchor every count in individualized harm: personal tax exposure, freeze-out from distributions, and deprivation of statutory inspection rights under Fla. Stat. § 607.1602 / § 605.0410 (<em>Dinuro Invs., LLC v. Camacho</em>, 141 So. 3d 731).
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    4. Stripping § 607.0832 Safe Harbor Immunity
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Plead affirmative ultimate facts of undisclosed self-dealing, lack of disinterested board/member authorization, and commercial unfairness so § 607.0832 cannot be invoked on a Motion to Dismiss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY 4: EVIDENCE VAULT & BATES NUMBERING PER DEFENDANT */}
        {activeNav === "vault" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Evidence Vault, Metadata & Automated Bates Numbering
                </h2>
                <p className="text-xs text-slate-500">
                  Select a defendant tab below to manage Rule 1.130 exhibits, stored metadata, and Bates stamps.
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                {defendantsList.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDefId(d.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 ${
                      activeDefId === d.id
                        ? "bg-slate-900 text-white"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {d.name} ({d.profession.toUpperCase()})
                  </button>
                ))}
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newEvExhibit}
                  onChange={(e) => setNewEvExhibit(e.target.value)}
                  className="sm:w-36 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
                <input
                  type="text"
                  value={newEvTitle}
                  onChange={(e) => setNewEvTitle(e.target.value)}
                  placeholder={`Add PDF/Image Exhibit for ${selectedDef.name}...`}
                  className="flex-1 border border-slate-300 rounded-lg p-2 text-xs"
                />
                <button
                  onClick={handleAddEvidenceItem}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0"
                >
                  + Stamp & Store Exhibit
                </button>
              </div>

              <div className="space-y-3">
                {evidenceItems
                  .filter((ev) => ev.defendantId === selectedDef.id)
                  .map((ev) => (
                    <div key={ev.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">
                          {ev.exhibitLabel}: {ev.title}
                        </span>
                        <span className="text-[11px] font-mono bg-slate-900 text-white px-2.5 py-0.5 rounded">
                          Bates: {ev.batesRange}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        <strong>Stored Metadata:</strong> {ev.capturedMetadata}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        <strong>Downloaded Package Timestamp:</strong> {ev.downloadedTimestamp}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY 5: TEMPLATES & JUDICIAL PROCEDURES */}
        {activeNav === "templates" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
                <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  17th Judicial Circuit Division 25 (Hon. Shari Africk Olefson) Rules Engine
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Judge Procedures & Responsive Pleading Builder
                </h2>
                <p className="text-xs text-slate-600">
                  Enforces 12pt Times New Roman, double-spacing, numbered paragraphs, Local Rule 10A good-faith conferral certificates, Rule 2.516 e-service blocks, and saved pro se signatures.
                </p>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Filed Motion / Order You Are Responding To:
                  </label>
                  <select
                    value={respondingToFilingId}
                    onChange={(e) => setRespondingToFilingId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white"
                  >
                    {filedPleadings.map((fp) => (
                      <option key={fp.id} value={fp.id}>
                        {fp.title} ({fp.dateFiled} - {fp.filer})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JUDGE_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    className={`p-5 bg-white rounded-xl border space-y-3 shadow-sm flex flex-col justify-between ${
                      selectedTemplateId === tpl.id ? "border-emerald-600 ring-2 ring-emerald-500/10" : "border-slate-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {tpl.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900">{tpl.name}</h3>
                      <p className="text-[11px] text-slate-500">{tpl.description}</p>
                      <p className="text-[10px] font-mono text-slate-400">{tpl.divisionRules}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTemplateId(tpl.id);
                        handleGenerateTemplateIntoDraft();
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Build & Open Pleading in Editor →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FLOATING FLORIDA LEGAL AI DRAWER */}
        {aiOpen && (
          <div className="fixed bottom-4 right-4 w-96 h-[480px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase">Florida Legal AI</span>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {activeChatThread.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-emerald-950 text-emerald-100 ml-6"
                      : "bg-slate-800 text-slate-200 mr-6"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-slate-800 bg-slate-900 flex gap-2">
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
                placeholder="Ask Florida Legal AI..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <button
                onClick={() => {
                  handleSendChatThreadMessage(aiInput);
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
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-sm text-slate-900">Workspace Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Pro Se Litigant Name</label>
                <input
                  type="text"
                  value={plaintiff}
                  onChange={(e) => setPlaintiff(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">E-Portal Service Email</label>
                <input
                  type="text"
                  defaultValue="service@allegedlylegal.com"
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
