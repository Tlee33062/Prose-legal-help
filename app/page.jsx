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
// 1. ALL FLORIDA PRIVITY & STANDING STANDARDS (GROUPED + "OTHER / COMPLEX")
// ============================================================================
const ALL_PRIVITY_STANDARDS = [
  {
    group: "1. Contractual & Rule 1.130 Privity",
    options: [
      {
        id: "direct_written",
        label: "Direct Written Contract / Retainer / Engagement Agreement (Fla. R. Civ. P. 1.130(a))"
      },
      {
        id: "exclusive_possession_contract",
        label: "Written Instrument in Defendant's Exclusive Possession (Sachse v. Tampa Music Exception)"
      },
      {
        id: "oral_contract",
        label: "Oral / Verbal Agreement & Course of Dealing (Fla. Stat. § 95.11(3)(k))"
      },
      {
        id: "implied_quasi_contract",
        label: "Implied-in-Fact / Quasi-Contract / Unjust Enrichment"
      }
    ]
  },
  {
    group: "2. Third-Party Beneficiary & Reliance Privity",
    options: [
      {
        id: "intended_tpb",
        label: "Intended Third-Party Beneficiary — Express Intent (Espinosa v. Sparber Standard)"
      },
      {
        id: "restatement_552_cpa",
        label: "Known Third-Party / Equity Holder Financial Reliance (Max Mitchell / Restatement § 552)"
      }
    ]
  },
  {
    group: "3. Statutory & Privilege-Waiver Privity (CPAs & Attorneys)",
    options: [
      {
        id: "joint_client_cpa",
        label: "Joint Client / Common Entity Member Privity — CPA Privilege Waived (Fla. Stat. § 473.316(4)(c))"
      },
      {
        id: "client_records_473",
        label: "Direct Statutory Client Records & Workpaper Ownership (Fla. Stat. § 473.318 & F.A.C. 61H1-23.002)"
      },
      {
        id: "crime_fraud_exception",
        label: "Crime-Fraud Exception to Professional Privilege (Fla. Stat. § 473.316(4)(a) / § 90.502(4)(a))"
      },
      {
        id: "joint_client_atty",
        label: "Joint Representation / Common Interest Exception — Attorney (Fla. Stat. § 90.502(4)(c))"
      }
    ]
  },
  {
    group: "4. Corporate, LLC & Fiduciary Privity",
    options: [
      {
        id: "dinuro_direct",
        label: "Direct Harm + Special Statutory/Contractual Duty (Dinuro Investments Two-Prong Test)"
      },
      {
        id: "llc_corp_fiduciary",
        label: "Statutory Fiduciary Duty of Loyalty & Care to Member/Shareholder (§ 605.04091 / § 607.0830)"
      },
      {
        id: "safe_harbor_pierce",
        label: "Undisclosed Conflict / Self-Dealing Stripping Director Safe Harbor (Fla. Stat. § 607.0832)"
      },
      {
        id: "statutory_inspection",
        label: "Statutory Right to Inspect Corporate Books, Ledgers & Tax Records (§ 607.1602 / § 605.0410)"
      }
    ]
  },
  {
    group: "5. Vicarious, Tortious & Multi-Defendant Privity Substitutes",
    options: [
      {
        id: "aiding_abetting",
        label: "Aiding & Abetting Breach of Fiduciary Duty — Actual Knowledge + Substantial Assistance (SFM Holdings)"
      },
      {
        id: "civil_conspiracy",
        label: "Civil Conspiracy — Agreement + Overt Tortious Act in Furtherance"
      },
      {
        id: "alter_ego_veil",
        label: "Alter Ego / Piercing the Corporate Veil / Interlocking DBA Liability (Dania Jai-Alai Standard)"
      },
      {
        id: "implied_fiduciary",
        label: "Implied Fiduciary Relationship — Reposed Trust & Confidence Accepted by Defendant"
      }
    ]
  },
  {
    group: "6. Other / Complex Multi-Layered Privity",
    options: [
      {
        id: "other_complex",
        label: "Other / Complex Multi-Layered Privity (Specify Custom Legal & Factual Basis Below)"
      }
    ]
  }
];

const getPrivityLabelById = (id) => {
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
    sol: "2 Years (Fla. Stat. § 95.11(4)(a))",
    breachExamples: "Undisclosed conflict of interest (Rule 4-1.7), collusion with adverse managers, or active concealment of corporate transactions."
  },
  cpa: {
    label: "CPA / Accounting Firm",
    governingRules: "Fla. Stat. Ch. 473 & F.A.C. R. 61H1-23.002",
    sol: "2 Years from Discovery (Fla. Stat. § 95.11(4)(a))",
    breachExamples: "Refusal to furnish client general ledgers and tax workpapers upon demand (F.A.C. 61H1-23.002; § 473.318) and unverified disclosures to lenders."
  },
  director: {
    label: "Managing Member / Corporate Director",
    governingRules: "Fla. Stat. § 605.04091 (LLC) / § 607.0830 & § 607.0832 (FBCA)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(o))",
    breachExamples: "Self-dealing transfers, commingling funds, withholding statutory inspection records (§ 607.1602), and bad-faith nondisclosure stripping § 607.0832 safe harbor."
  },
  vendor: {
    label: "Commercial Vendor / Counterparty",
    governingRules: "Fla. Stat. § 95.11(2)(b) & Fla. Stat. § 57.105(7)",
    sol: "5 Years Written / 4 Years Oral",
    breachExamples: "Material breach of express performance covenants, wrongful retention of funds, or failure to indemnify."
  },
  lender: {
    label: "Lender / Financial Institution",
    governingRules: "Fla. Stat. § 687.0304 (Banking Statute of Frauds) & UCC Art. 9",
    sol: "5 Years (Fla. Stat. § 95.11(2)(b))",
    breachExamples: "Unauthorized release of collateral, improper reliance on unverified CPA statements, or wrongful default acceleration."
  }
};

// Updated Default Defendants with April I. Halle, Esq.
const INITIAL_DEFENDANTS = [
  {
    id: "def-1",
    name: "Engleberg, CPA",
    entityName: "Engleberg Accounting P.A.",
    profession: "cpa",
    privityType: "joint_client_cpa",
    customPrivityDetails: "Joint client & equity holder standing under Fla. Stat. § 473.316(4)(c) combined with mandatory client record return duties under § 473.318 and F.A.C. 61H1-23.002, plus third-party lender reliance triangle.",
    suedCapacity: "both",
    specificBreach: "Withheld corporate tax filings, general ledgers, and accounting workpapers in violation of Fla. Stat. § 473.318 and F.A.C. R. 61H1-23.002 while transmitting unauthorized financial disclosures to outside lenders.",
    dateLastAction: "2026-01-15",
    discoveryDate: "2026-02-01",
    evidence: "EXHIBIT A: Written Records Demand & Lender Disclosure Emails",
    witnesses: "Corporate Bookkeeper, Third-Party Loan Officer",
    otherDefendants: "April I. Halle, Esq., Managing Directors"
  },
  {
    id: "def-2",
    name: "April I. Halle, Esq.",
    entityName: "The Halle Law Firm, P.A. (hallelaw.com)",
    profession: "attorney",
    privityType: "joint_client_atty",
    customPrivityDetails: "Joint representation / common interest exception under Fla. Stat. § 90.502(4)(c) and aiding/abetting fiduciary breach with actual knowledge of Delray Beach DBA & Broward corporate record concealment.",
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
    summary: "Dismissed Count IV citing lack of strict privity, accountant-client privilege (§ 473.316), and director safe harbor (§ 607.0832), adopting unsworn defense factual assertions outside the four corners.",
    extractedAttack: "Four Corners Violation / Safe Harbor § 607.0832 / CPA Privity Bar"
  },
  {
    id: "filed-2",
    title: "Defendants' Motion to Dismiss Third Amended Complaint",
    filer: "Defense Counsel (April I. Halle, Esq. / Engleberg)",
    dateFiled: "2026-09-18",
    type: "Defense Motion",
    summary: "Argues claims are derivative under Dinuro rather than direct, asserts intra-corporate conspiracy bar, and claims failure to attach complete contract instruments under Rule 1.130(a).",
    extractedAttack: "Dinuro Derivative Bar / Rule 1.130 Exhibit Trap / Intra-Corporate Conspiracy"
  },
  {
    id: "filed-3",
    title: "Verified Fourth Amended Complaint (Filed Oct 16, 2026)",
    filer: "Plaintiff Pro Se (Tina Diane Lee)",
    dateFiled: "2026-10-16",
    type: "Plaintiff Pleading",
    summary: "Sets forth ultimate facts establishing direct individual harm, attaches Rule 1.130 exhibits, and pleads statutory exceptions under § 473.316(4)(a)/(c) and bad-faith self-dealing defeating § 607.0832.",
    extractedAttack: "Affirmative Cure Pleading"
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
    defenseGrounds: "CPA argues he was retained solely by the entity, owes no duty to Plaintiff individually, and communications/ledgers are privileged under Fla. Stat. § 473.316.",
    howToOvercome: "Invoke three statutory hooks: (1) F.A.C. R. 61H1-23.002 & Fla. Stat. § 473.318 mandate return of client records upon request; (2) Fla. Stat. § 473.316(4)(c) abolishes accountant privilege in disputes between parties claiming through the same joint client/entity; (3) § 473.316(4)(a) abolishes privilege when services were sought to aid a fraud or tort.",
    controllingLaw: "Fla. Stat. §§ 473.316(4)(a), (4)(c), 473.318; F.A.C. R. 61H1-23.002; Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016)."
  }
];

const INITIAL_MEMORANDA_OF_LAW = [
  {
    id: "memo-1",
    title: "Memorandum of Law in Support of Rule 1.530 Rehearing & Vacation of Oct 5 Dismissal (Count IV)",
    targetCount: "Count IV: CPA Malpractice, Statutory Record Violations & Aiding/Abetting",
    targetFiling: "Order Dismissing Count IV With Prejudice (Oct 5, 2026)",
    motionType: "Rule 1.530 Motion for Rehearing & To Vacate",
    updatedAt: "2026-10-17",
    content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT
IN AND FOR BROWARD COUNTY, FLORIDA

CASE NO.: CACE-26-XXXXXX
DIVISION: 25 (Hon. Shari Africk Olefson)

TINA DIANE LEE,
    Plaintiff,
v.
APRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., ENGLEBERG, CPA, et al.,
    Defendants.
__________________________________________/

PLAINTIFF'S MEMORANDUM OF LAW IN SUPPORT OF MOTION FOR REHEARING AND TO VACATE OCTOBER 5, 2026 ORDER DISMISSING COUNT IV WITH PREJUDICE
(Assigned Scope: Count IV • Responding to: Oct 5, 2026 Order)

I. QUESTION PRESENTED
Whether the trial court committed reversible error on a Rule 1.140(b)(6) Motion to Dismiss by: (1) looking outside the four corners of the verified pleading to adopt unsworn defense factual assertions regarding lender communications; (2) resolving an unpled, fact-intensive corporate safe harbor defense (Fla. Stat. § 607.0832) at the pleading stage; and (3) overlooking express statutory exceptions to accountant-client privilege and privity under Fla. Stat. §§ 473.316(4)(a), (4)(c), 473.318, and F.A.C. R. 61H1-23.002.

II. STANDARD OF REVIEW UNDER FLA. R. CIV. P. 1.530 & THE FOUR CORNERS RULE
1. Under Fla. R. Civ. P. 1.530(a)–(b), a timely motion for rehearing served within 15 days of a final order of dismissal with prejudice empowers the trial court to correct manifest errors of law or fact and tolls rendition under Fla. R. App. P. 9.020(h).
2. In ruling on a motion to dismiss, the trial court is strictly confined to the four corners of the complaint, must accept all well-pled ultimate facts as true, and must draw all reasonable inferences in favor of the pleader. Barbado v. Green & Murphy, P.A., 758 So. 2d 1173, 1174 (Fla. 4th DCA 2000). Unsworn representations of counsel at a hearing do not constitute evidence and cannot support dismissal.

III. POINT-BY-POINT FLORIDA LEGAL ARGUMENT

A. FLA. STAT. § 607.0832 (DIRECTOR SAFE HARBOR) IS AN AFFIRMATIVE DEFENSE INAPPLICABLE ON A MOTION TO DISMISS AND INAPPLICABLE TO OUTSIDE CPAs
3. First, Fla. Stat. § 607.0832 governs director conflict-of-interest transactions—it does not immunize an outside Certified Public Accountant from professional malpractice under Chapter 473 or aiding and abetting tortious conduct alongside co-defendants (including April I. Halle, Esq.).
4. Second, even as to corporate directors, § 607.0832 requires affirmative proof that all material facts were fully disclosed to disinterested decision-makers OR that the transaction was fair to the entity. Where, as here, Plaintiff pleads ultimate facts of active concealment, secret self-dealing, and bad faith, an affirmative defense cannot be adjudicated on a motion to dismiss. Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056 (Fla. 3d DCA 2018).

B. PLAINTIFF PLEADS DIRECT STATUTORY STANDING, PRIVITY & PRIVILEGE EXCEPTIONS UNDER FLA. STAT. §§ 473.316(4)(a), (4)(c), 473.318 & F.A.C. R. 61H1-23.002
5. Defendant Engleberg, CPA cannot hide behind accountant-client privilege or lack of privity for three independent reasons under Florida law:
   • Joint-Client / Common Entity Exception (§ 473.316(4)(c)): Florida Statute § 473.316(4)(c) expressly provides that there is NO accountant-client privilege as to a communication relevant to an issue of breach of duty or a matter of common interest between two or more clients/equity members.
   • Crime-Fraud Exception (§ 473.316(4)(a)): Privilege is abolished when the services of the accountant were sought or obtained to enable or aid anyone to commit or plan what the client knew or should have known was a crime or fraud.
   • Mandatory Duty to Return Client Records (§ 473.318 & F.A.C. R. 61H1-23.002): Under Florida Administrative Code Rule 61H1-23.002 and § 473.318, a CPA must furnish client records, general ledgers, and tax filings within a reasonable time upon request.
   • Third-Party Reliance & Aiding/Abetting Liability: Under First Fla. Bank, N.A. v. Max Mitchell & Co., 558 So. 2d 9 (Fla. 1990) (adopting Restatement (Second) of Torts § 552) and Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016), an accountant is liable to known relying stakeholders. Furthermore, a professional who has actual knowledge of a fiduciary breach and provides substantial assistance is liable for aiding and abetting under SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327 (11th Cir. 2014).

C. DISMISSAL WITH PREJUDICE WITHOUT LEAVE TO AMEND VIOLATES FLA. R. CIV. P. 1.190(a)
6. In the 4th DCA, refusal to allow amendment of a pleading constitutes an abuse of discretion unless it clearly appears that allowing the amendment would prejudice the opposing party, the privilege to amend has been abused, or amendment would be futile. Dimick v. Ray, 774 So. 2d 830 (Fla. 4th DCA 2000). Plaintiff's Verified Fourth Amended Complaint cures every purported defect with surgical ultimate facts and Rule 1.130 exhibits.

IV. CONCLUSION
WHEREFORE, Plaintiff respectfully submits that the October 5, 2026 Order Dismissing Count IV With Prejudice should be vacated on rehearing, and the action permitted to proceed on the Verified Fourth Amended Complaint.

Respectfully submitted on October 17, 2026,

By: /s/ Tina Diane Lee
Tina Diane Lee, Pro Se
Email: service@allegedlylegal.com`
  },
  {
    id: "memo-2",
    title: "Memorandum of Law on Direct Member Standing Under Dinuro & Multi-Tiered Privity (Counts I–III)",
    targetCount: "Counts I, II & III: Fiduciary Breach, Accounting & Conspiracy",
    targetFiling: "Defendants' Motion to Dismiss Third Amended Complaint",
    motionType: "Memorandum in Opposition to Motion to Dismiss",
    updatedAt: "2026-10-17",
    content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT
IN AND FOR BROWARD COUNTY, FLORIDA

CASE NO.: CACE-26-XXXXXX
DIVISION: 25

TINA DIANE LEE,
    Plaintiff,
v.
APRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., ENGLEBERG, CPA, et al.,
    Defendants.
__________________________________________/

PLAINTIFF'S MEMORANDUM OF LAW ON DIRECT ACTION STANDING UNDER DINURO AND RULE 1.130 EXCLUSIVE POSSESSION EXCEPTION
(Assigned Scope: Counts I, II & III • Responding to: Defense Motion to Dismiss)

I. DIRECT ACTION STANDING UNDER DINURO INVESTMENTS, LLC V. CAMACHO
1. Defendants (including April I. Halle, Esq. and Engleberg, CPA) erroneously contend that Plaintiff's claims are derivative. Under Dinuro Investments, LLC v. Camacho, 141 So. 3d 731, 739–40 (Fla. 3d DCA 2014) and Strazzulla v. Riverside Banking Co., 175 So. 3d 879 (Fla. 4th DCA 2015), a member or shareholder has standing to bring a DIRECT action where:
   (a) There is a direct harm to the shareholder or member such that the alleged injury does not flow subsequently from an initial harm to the company; AND
   (b) There is a special injury that is separate and distinct from those sustained by other shareholders/members, OR a separate duty owed by the defendant directly to the plaintiff under contract or statute.
2. Here, Plaintiff alleges distinct, individualized pecuniary injuries—including deprivation of statutory inspection rights under Fla. Stat. § 607.1602 / § 605.0410, personal tax exposure, targeted freeze-out from distributions, and loss of fair-value buyout rights. These injuries are personal to Plaintiff and satisfy both prongs of Dinuro.

II. RULE 1.130(a) EXCLUSIVE POSSESSION EXCEPTION
3. While Fla. R. Civ. P. 1.130(a) requires attachment of instruments sued upon, Florida courts uniformly hold that where the instrument or accounting record is in the exclusive possession of the defendants, a complaint may not be dismissed for failure to attach it so long as the complaint alleges that the document is in the adverse party's possession and will be obtained via discovery. Sachse v. Tampa Music Co., 262 So. 2d 17 (Fla. 2d DCA 1972); Parkway Gen. Hosp., Inc. v. Allstate Ins. Co., 393 So. 2d 1171 (Fla. 3d DCA 1981).

Respectfully submitted,
By: /s/ Tina Diane Lee`
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
  }
];

// Helper to sanitize any cached "Richard Halle" strings into "April I. Halle, Esq."
const sanitizeRichardToApril = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/RICHARD HALLE,\s*ESQ\./gi, "APRIL I. HALLE, ESQ.")
    .replace(/Richard Halle,\s*Esq\./gi, "April I. Halle, Esq.")
    .replace(/Richard Halle/gi, "April I. Halle, Esq.")
    .replace(/Halle & Associates PA/gi, "The Halle Law Firm, P.A.");
};

export default function FloridaProSeLitigationApp() {
  const [activeNav, setActiveNav] = useState("intake");
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [intakeSubTab, setIntakeSubTab] = useState("defendants");
  const [plaintiff, setPlaintiff] = useState("Tina Diane Lee");

  const [syncNotification, setSyncNotification] = useState(null);

  const triggerSyncBanner = (msg) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setSyncNotification(`${msg} (Synced at ${timeStr})`);
    setTimeout(() => {
      setSyncNotification(null);
    }, 3500);
  };

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

  // 2. Saved Drafts (Updated to April I. Halle, Esq.)
  const [savedDrafts, setSavedDrafts] = useState([
    {
      id: "draft-1",
      title: "Verified Fourth Amended Complaint",
      updatedAt: "2026-10-16",
      caseNo: "CACE-26-XXXXXX",
      type: "Complaint",
      status: "Filed / Active",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25 (Hon. Shari Africk Olefson)\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nAPRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nVERIFIED FOURTH AMENDED COMPLAINT FOR DAMAGES AND DEMAND FOR JURY TRIAL\n\nPlaintiff, TINA DIANE LEE, pro se, sues Defendants (including APRIL I. HALLE, ESQ. and ENGLEBERG, CPA) and alleges ultimate facts pursuant to Fla. R. Civ. P. 1.110(b):\n\nJURISDICTION, VENUE, AND PRIVITY\n1. This is an action for damages exceeding $50,000.00, exclusive of interest, costs, and attorney's fees, within the jurisdiction of this Court under Fla. Stat. § 26.012.\n2. Venue is proper in Broward County under Fla. Stat. § 47.011 as the causes of action accrued herein.\n3. Pursuant to Dinuro Investments, LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014), Plaintiff brings direct claims for individualized pecuniary harm and deprivation of statutory inspection rights owed directly to Plaintiff.\n\nCOUNT I: BREACH OF FIDUCIARY DUTY, LEGAL MALPRACTICE & CONFLICT OF INTEREST (AGAINST APRIL I. HALLE, ESQ.)\n4. Plaintiff realleges Paragraphs 1–3. Defendant April I. Halle, Esq. (The Halle Law Firm, P.A.) owed direct fiduciary duties of loyalty, candor, and non-conflicted representation.\n5. Defendant engaged in undisclosed adverse representation (Rule 4-1.7) and bad-faith concealment of Delray Beach DBA and Broward corporate records, stripping any safe harbor protection under Fla. Stat. § 607.0832.\n\nCOUNT II: PROFESSIONAL NEGLIGENCE & STATUTORY RECORD VIOLATIONS (AGAINST ENGLEBERG, CPA)\n6. Plaintiff realleges Paragraphs 1–3. Pursuant to Fla. Stat. §§ 473.316(4)(a), (4)(c), and 473.318, and F.A.C. R. 61H1-23.002, Defendant Engleberg, CPA owed a mandatory duty to furnish client general ledgers and workpapers.\n7. Defendant withheld records while transmitting unverified financial data to third-party lenders.\n\nVERIFICATION\nUnder penalties of perjury pursuant to Fla. Stat. § 92.525, I declare that I have read the foregoing Complaint and that the facts stated in it are true.\n\nDated: October 17, 2026.\nBy: /s/ Tina Diane Lee\nTina Diane Lee, Pro Se\nEmail: service@allegedlylegal.com`
    },
    {
      id: "draft-2",
      title: "Rule 1.530 Motion for Rehearing on Oct 5 Order Dismissing Count IV",
      updatedAt: "2026-10-17",
      caseNo: "CACE-26-XXXXXX",
      type: "Motion for Rehearing",
      status: "Urgent (Due Oct 20)",
      content: `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT\nIN AND FOR BROWARD COUNTY, FLORIDA\n\nCASE NO.: CACE-26-XXXXXX\nDIVISION: 25\n\nTINA DIANE LEE,\n    Plaintiff,\nv.\nAPRIL I. HALLE, ESQ., THE HALLE LAW FIRM, P.A., ENGLEBERG, CPA, et al.,\n    Defendants.\n__________________________________________/\n\nPLAINTIFF'S TIMELY MOTION FOR REHEARING AND TO VACATE OCTOBER 5, 2026 ORDER DISMISSING COUNT IV WITH PREJUDICE PURSUANT TO FLA. R. CIV. P. 1.530\n\nPlaintiff, TINA DIANE LEE, pro se, timely moves for rehearing of the Court's October 5, 2026 Order Dismissing Count IV With Prejudice, and states:\n\n1. TIMELINESS: Pursuant to Fla. R. Civ. P. 1.530(b), this Motion is served within 15 days of the October 5, 2026 Order.\n2. FOUR CORNERS VIOLATION: On a motion to dismiss, the Court is strictly confined to the four corners of the complaint (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)). The October 5 Order improperly adopted unsworn factual assertions of defense counsel regarding lender communications and corporate safe harbors (§ 607.0832) that do not appear on the face of the pleading.\n3. STATUTORY PRIVILEGE WAIVER & PRIVITY: Under Fla. Stat. § 473.316(4)(a) & (c) and F.A.C. R. 61H1-23.002, accountant-client privilege does not apply to joint clients or fraud, and CPAs are statutorily required to return client records.\n\nWHEREFORE, Plaintiff respectfully requests that this Court grant rehearing, vacate the dismissal with prejudice of Count IV, and permit the action to proceed on the Fourth Amended Complaint.\n\nBy: /s/ Tina Diane Lee`
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
    }
  ]);
  const [newCalTitle, setNewCalTitle] = useState("");
  const [newCalDate, setNewCalDate] = useState("2026-10-22");

  // 4. Defendants Intake
  const [defendantsList, setDefendantsList] = useState(INITIAL_DEFENDANTS);
  const [activeDefId, setActiveDefId] = useState("def-2"); // Default highlight on April I. Halle, Esq.

  // 5. Matters & Counts (Updated to April I. Halle, Esq.)
  const [matterCounts, setMatterCounts] = useState([
    {
      id: "cnt-1",
      countNum: "Count I",
      title: "Breach of Fiduciary Duty, Conflict of Interest & Direct Harm",
      defendantName: "April I. Halle, Esq.",
      authority: "Rules Regulating Fla. Bar 4-1.7; Fla. Stat. § 90.502(4)(c); Dinuro Invs. v. Camacho",
      privityHook: "Joint Representation Exception (§ 90.502(4)(c)) & Direct Special Injury",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-2",
      countNum: "Count II",
      title: "Equitable Accounting & Corporate Record Inspection",
      defendantName: "Engleberg, CPA & April I. Halle, Esq.",
      authority: "Fla. Stat. § 607.1602; F.A.C. R. 61H1-23.002",
      privityHook: "Statutory Inspection Right & Direct Member Ownership",
      status: "Pled in 4th Amended Complaint"
    },
    {
      id: "cnt-3",
      countNum: "Count III",
      title: "Civil Conspiracy & Aiding/Abetting Breach of Fiduciary Duty",
      defendantName: "Engleberg, CPA & April I. Halle, Esq.",
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

  // 6. Signatures
  const [signatureText, setSignatureText] = useState("/s/ Tina Diane Lee");
  const [signatureImage, setSignatureImage] = useState(null);

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
      text: "Defense Playbook AI ready. Live Intake Roster loaded (April I. Halle, Esq. & Engleberg, CPA). Ask me how to dismantle any defense objection."
    }
  ]);
  const [defenseChatInput, setDefenseChatInput] = useState("");

  // 9. Plaintiff's Playbook Modules
  const [plaintiffPlaybookCards, setPlaintiffPlaybookCards] = useState([
    {
      id: "pp-1",
      title: "1. Immediate Next Step: Rule 1.530 Rehearing (Due Oct 20, 2026)",
      body: "Serve Plaintiff's Motion for Rehearing and to Vacate the Oct 5 Order dismissing Count IV with prejudice. Emphasize that the trial court erred by adopting unsworn defense factual assertions regarding lender disclosures and resolving § 607.0832 safe harbor outside the four corners of the complaint (Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000))."
    },
    {
      id: "pp-2",
      title: "2. Overcoming CPA & Attorney Privity / Privilege (§ 473.316 & § 90.502)",
      body: "As to Engleberg, CPA and April I. Halle, Esq.: Under Fla. Stat. § 473.316(4)(c) and § 90.502(4)(c), privilege does not apply in disputes between parties claiming through a joint client/common interest, nor under the crime-fraud exceptions (§ 473.316(4)(a) / § 90.502(4)(a)). Under F.A.C. R. 61H1-23.002 and § 473.318, withholding client general ledgers and workpapers is a direct statutory violation."
    },
    {
      id: "pp-3",
      title: "3. Curing Standing Under Dinuro (Direct vs. Derivative)",
      body: "Anchor every count in individualized harm: personal tax exposure, freeze-out from distributions, and deprivation of statutory inspection rights under Fla. Stat. § 607.1602 / § 605.0410 (Dinuro Invs., LLC v. Camacho, 141 So. 3d 731)."
    }
  ]);
  const [customPlaintiffNote, setCustomPlaintiffNote] = useState("");

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
      defendantId: "def-2",
      exhibitLabel: "EXHIBIT B",
      title: "April I. Halle, Esq. Retainer & Delray Beach DBA Corporate Records",
      fileType: "Certified State Record (PDF)",
      batesRange: "LEE-EXB-0009 to LEE-EXB-0024",
      capturedMetadata: "FL-DOS-Sunbiz Doc • Linked to April I. Halle, Esq. (hallelaw.com)",
      downloadedTimestamp: "2026-10-17 08:12:30 EDT"
    }
  ]);
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvExhibit, setNewEvExhibit] = useState("EXHIBIT C");

  // 11. Templates
  const [selectedTemplateId, setSelectedTemplateId] = useState("tpl-rehearing");
  const [respondingToFilingId, setRespondingToFilingId] = useState("filed-1");

  // 12. Memorandum of Law State
  const [memorandaList, setMemorandaList] = useState(INITIAL_MEMORANDA_OF_LAW);
  const [activeMemoId, setActiveMemoId] = useState("memo-1");
  const [memoSelectedCountId, setMemoSelectedCountId] = useState("cnt-4");
  const [memoSelectedFilingId, setMemoSelectedFilingId] = useState("filed-1");
  const [memoSelectedMotionType, setMemoSelectedMotionType] = useState(
    "Rule 1.530 Motion for Rehearing & To Vacate Dismissal"
  );

  // Floating AI
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");

  // ============================================================================
  // AUTO-MIGRATE & SANITIZE LOCALSTORAGE ON STARTUP (Fixes "Richard Halle" bug)
  // ============================================================================
  useEffect(() => {
    try {
      const savedDefsRaw = localStorage.getItem("fl_prose_defendants");
      if (savedDefsRaw) {
        const cleanedDefs = JSON.parse(sanitizeRichardToApril(savedDefsRaw));
        setDefendantsList(cleanedDefs);
        localStorage.setItem("fl_prose_defendants", JSON.stringify(cleanedDefs));
      }

      const savedDrRaw = localStorage.getItem("fl_prose_drafts");
      if (savedDrRaw) {
        const cleanedDr = JSON.parse(sanitizeRichardToApril(savedDrRaw));
        setSavedDrafts(cleanedDr);
        localStorage.setItem("fl_prose_drafts", JSON.stringify(cleanedDr));
      }

      const savedCountsRaw = localStorage.getItem("fl_prose_matter_counts");
      if (savedCountsRaw) {
        const cleanedCounts = JSON.parse(sanitizeRichardToApril(savedCountsRaw));
        setMatterCounts(cleanedCounts);
        localStorage.setItem("fl_prose_matter_counts", JSON.stringify(cleanedCounts));
      }

      const savedMemosRaw = localStorage.getItem("fl_prose_memoranda");
      if (savedMemosRaw) {
        const cleanedMemos = JSON.parse(sanitizeRichardToApril(savedMemosRaw));
        setMemorandaList(cleanedMemos);
        localStorage.setItem("fl_prose_memoranda", JSON.stringify(cleanedMemos));
      }

      const savedSig = localStorage.getItem("fl_prose_sig_text");
      if (savedSig) setSignatureText(savedSig);
      const savedSigImg = localStorage.getItem("fl_prose_sig_img");
      if (savedSigImg) setSignatureImage(savedSigImg);
      const savedEvRaw = localStorage.getItem("fl_prose_evidence");
      if (savedEvRaw) {
        const cleanedEv = JSON.parse(sanitizeRichardToApril(savedEvRaw));
        setEvidenceItems(cleanedEv);
      }
      const savedCal = localStorage.getItem("fl_prose_calendar");
      if (savedCal) setCalendarEvents(JSON.parse(savedCal));
      const savedFiledRaw = localStorage.getItem("fl_prose_filed_docs");
      if (savedFiledRaw) {
        setFiledPleadings(JSON.parse(sanitizeRichardToApril(savedFiledRaw)));
      }
      const savedDefPbRaw = localStorage.getItem("fl_prose_defense_pb");
      if (savedDefPbRaw) {
        setDefensePlaybook(JSON.parse(sanitizeRichardToApril(savedDefPbRaw)));
      }
      const savedPlPbRaw = localStorage.getItem("fl_prose_plaintiff_pb");
      if (savedPlPbRaw) {
        setPlaintiffPlaybookCards(JSON.parse(sanitizeRichardToApril(savedPlPbRaw)));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  // Live Case Caption String Built Directly from Current Intake Defendants
  const liveDefendantsCaptionString = useMemo(() => {
    return defendantsList
      .map((d) => `${d.name.toUpperCase()}${d.entityName ? `, ${d.entityName.toUpperCase()}` : ""}`)
      .join(", ");
  }, [defendantsList]);

  // ============================================================================
  // AI MEMORANDUM OF LAW GENERATOR (100% DRIVEN BY LIVE INTAKE)
  // ============================================================================

  const handleAiGenerateMemorandum = () => {
    const targetFiling =
      filedPleadings.find((f) => f.id === memoSelectedFilingId) || filedPleadings[0];
    const targetCountObj =
      memoSelectedCountId === "all"
        ? {
            countNum: "All Counts (Omnibus)",
            title: "All Pled Causes of Action",
            defendantName: defendantsList.map((d) => d.name).join(", "),
            authority:
              "Fla. R. Civ. P. 1.110(b), 1.130(a), 1.530; Fla. Stat. §§ 473.316(4), 473.318, 90.502(4), 607.0830, 607.0832; Dinuro Invs. v. Camacho",
            privityHook: "Multi-Tiered Contractual, Statutory & Fiduciary Privity"
          }
        : matterCounts.find((c) => c.id === memoSelectedCountId) || matterCounts[0];

    // Build Defendant-by-Defendant Fact & Privity Section Directly from Live Intake State
    const defendantAnalysisBlock = defendantsList
      .map(
        (d, idx) =>
          `${idx + 1}. LIVE INTAKE RECORD — DEFENDANT ${d.name.toUpperCase()} (${
            d.entityName || "Individual/Firm"
          } • ${PROFESSION_CONFIGS[d.profession]?.label}):
   • Sued Capacity: ${d.suedCapacity?.toUpperCase() || "INDIVIDUAL & CORPORATE"}
   • Governing Statutory Standard: ${PROFESSION_CONFIGS[d.profession]?.governingRules}
   • Pled Privity Standard: ${getPrivityLabelById(d.privityType)}
   • Complex Privity & Standing Particulars: ${
     d.customPrivityDetails || "Direct statutory and contractual privity established."
   }
   • Ultimate Facts of Breach (Last Action: ${d.dateLastAction} | Discovered: ${
            d.discoveryDate
          }): ${d.specificBreach}
   • Rule 1.130 Evidence & Witnesses: ${d.evidence} | Witnesses: ${
            d.witnesses
          } | Co-Defendants: ${d.otherDefendants}`
      )
      .join("\n\n");

    const exhibitTableBlock = evidenceItems
      .map(
        (ev) =>
          `   • ${ev.exhibitLabel}: ${ev.title} [Bates Stamp: ${ev.batesRange}] — Verified: ${ev.downloadedTimestamp}`
      )
      .join("\n");

    const defenseRebuttalBlock = defensePlaybook
      .map(
        (dp, idx) =>
          `   ${idx + 1}. Overcoming "${dp.defenseAttack}" (${dp.count}):\n      ${
            dp.howToOvercome
          }\n      Controlling Authority: ${dp.controllingLaw}`
      )
      .join("\n\n");

    const generatedText = `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT
IN AND FOR BROWARD COUNTY, FLORIDA

CASE NO.: CACE-26-XXXXXX
DIVISION: 25 (Hon. Shari Africk Olefson)

${plaintiff.toUpperCase()},
    Plaintiff,
v.
${liveDefendantsCaptionString}, et al.,
    Defendants.
__________________________________________/

PLAINTIFF'S MEMORANDUM OF LAW IN SUPPORT OF ${memoSelectedMotionType.toUpperCase()}
• ASSIGNED COUNT SCOPE: ${targetCountObj.countNum} — ${targetCountObj.title}
• TARGET DEFENDANTS: ${defendantsList.map((d) => d.name).join(" | ")}
• TARGET FILING ADDRESSED: ${targetFiling.title} (${targetFiling.dateFiled})

I. PRELIMINARY STATEMENT & QUESTION PRESENTED
Plaintiff, ${plaintiff.toUpperCase()}, pro se, respectfully submits this Memorandum of Law addressing ${
      targetCountObj.countNum
    } (${targetCountObj.title}) as to Defendants (${defendantsList
      .map((d) => d.name)
      .join(", ")}) in connection with "${
      targetFiling.title
    }" and in support of Plaintiff's ${memoSelectedMotionType}.

Question Presented: Whether under Florida's strict Four Corners Rule (Fla. R. Civ. P. 1.140(b) and Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000)), Plaintiff's verified ultimate facts, statutory privilege waivers (§ 473.316(4) & § 90.502(4)), and Rule 1.130(a) exhibits establish actionable standing and privity against ${defendantsList
      .map((d) => d.name)
      .join(" and ")}, precluding dismissal as a matter of Florida law.

II. CONTROLLING FLORIDA STANDARD OF REVIEW
1. Four Corners Rule: On a motion testing the legal sufficiency of a pleading, the trial court may not look beyond the four corners of the complaint and its attached exhibits, must accept all well-pled ultimate facts as true, and may not rely upon unsworn factual assertions of defense counsel. Barbado v. Green & Murphy, P.A., 758 So. 2d 1173, 1174 (Fla. 4th DCA 2000).
2. Affirmative Defenses Barred on Motion to Dismiss: Fact-intensive affirmative defenses—including corporate director safe harbors under Fla. Stat. § 607.0832 or contested privilege claims—cannot support dismissal unless the defense appears conclusively on the face of the complaint itself. Chakra 5, Inc. v. City of Miami Beach, 254 So. 3d 1056 (Fla. 3d DCA 2018).
3. Rule 1.530 Rehearing & Leave to Amend: Under Fla. R. Civ. P. 1.530(b) and 1.190(a), rehearing and leave to amend must be granted where a count states—or can state—a viable cause of action under Florida law. Dimick v. Ray, 774 So. 2d 830 (Fla. 4th DCA 2000).

III. APPLICATION OF FLORIDA LAW TO LIVE INTAKE DEFENDANTS & PRIVITY STANDARDS
• Target Count Authority: ${targetCountObj.authority}
• Pled Privity & Standing Hook: ${targetCountObj.privityHook}

${defendantAnalysisBlock}

IV. POINT-BY-POINT REBUTTAL OF DEFENSE OBJECTIONS
${defenseRebuttalBlock}

V. RULE 1.130(a) AUTHENTICATED EXHIBIT & BATES INDEX
Pursuant to Fla. R. Civ. P. 1.130(a) and the exclusive-possession doctrine of Sachse v. Tampa Music Co., 262 So. 2d 17 (Fla. 2d DCA 1972), Plaintiff incorporates the following Bates-numbered exhibits:
${exhibitTableBlock}

VI. CONCLUSION & RELIEF REQUESTED
WHEREFORE, based upon the foregoing binding authorities of the Florida Supreme Court, the Fourth District Court of Appeal, and the Florida Statutes, Plaintiff respectfully requests that this Honorable Court grant relief on ${
      targetCountObj.countNum
    } pursuant to Plaintiff's ${memoSelectedMotionType}, together with taxable costs under Fla. Stat. § 57.041, reciprocal fees under § 57.105(7), and such further relief as is just and proper.

LOCAL RULE 10A & RULE 2.516 CERTIFICATE OF SERVICE
I HEREBY CERTIFY that a true and correct copy of the foregoing Memorandum of Law was furnished via the Florida Courts E-Filing Portal on October 17, 2026 to all counsel of record.

Respectfully submitted,

By: ${signatureText}
${plaintiff}, Pro Se
Pompano Beach / Broward County, Florida
Email: service@allegedlylegal.com`;

    const newMemoId = `memo-${Date.now()}`;
    const newMemoObj = {
      id: newMemoId,
      title: `Memorandum: ${targetCountObj.countNum} (${defendantsList.map((d) => d.name).join(", ")})`,
      targetCount: `${targetCountObj.countNum}: ${targetCountObj.title}`,
      targetFiling: targetFiling.title,
      motionType: memoSelectedMotionType,
      updatedAt: "2026-10-17",
      content: generatedText
    };

    const updatedMemos = [newMemoObj, ...memorandaList];
    setMemorandaList(updatedMemos);
    setActiveMemoId(newMemoId);
    try {
      localStorage.setItem("fl_prose_memoranda", JSON.stringify(updatedMemos));
    } catch (e) {}
    triggerSyncBanner(
      `✓ AI Built Memorandum Using Live Intake (${defendantsList.map((d) => d.name).join(", ")})`
    );
  };

  // Dedicated Court Print Function
  const handlePrintActiveMemorandum = () => {
    const printWin = window.open("", "_blank", "width=900,height=1000");
    if (!printWin) {
      window.print();
      return;
    }
    const escapedContent = activeMemo.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeMemo.title}</title>
          <style>
            @page { size: letter; margin: 1in; }
            body {
              font-family: "Times New Roman", Times, serif;
              font-size: 12pt;
              line-height: 2.0;
              color: #000000;
              background: #ffffff;
              margin: 0;
              padding: 0;
            }
            pre {
              font-family: "Times New Roman", Times, serif;
              font-size: 12pt;
              line-height: 1.85;
              white-space: pre-wrap;
              word-wrap: break-word;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <pre>${escapedContent}</pre>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleSaveMemoAndSyncToDrafts = () => {
    try {
      localStorage.setItem("fl_prose_memoranda", JSON.stringify(memorandaList));
      const newDraftObj = {
        id: `draft-memo-${Date.now()}`,
        title: activeMemo.title,
        updatedAt: "2026-10-17",
        caseNo: "CACE-26-XXXXXX",
        type: "Memorandum of Law",
        status: "Print & E-File Ready",
        content: activeMemo.content
      };
      const updatedDrafts = [newDraftObj, ...savedDrafts];
      setSavedDrafts(updatedDrafts);
      localStorage.setItem("fl_prose_drafts", JSON.stringify(updatedDrafts));
      triggerSyncBanner("✓ Memorandum of Law Saved & Synced to Recent Drafts");
    } catch (e) {}
  };

  const handleDownloadActiveMemo = () => {
    const blob = new Blob([activeMemo.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeMemo.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // CROSS-TAB SAVE & SYNC HANDLERS (LIVE INTAKE PROPAGATION)
  // ============================================================================

  const handleUpdateDefField = (field, val) => {
    setDefendantsList((prev) =>
      prev.map((d) => (d.id === selectedDef.id ? { ...d, [field]: val } : d))
    );
  };

  const handleDeleteCurrentDefendant = () => {
    if (defendantsList.length <= 1) return;
    const filtered = defendantsList.filter((d) => d.id !== selectedDef.id);
    setDefendantsList(filtered);
    setActiveDefId(filtered[0].id);
    try {
      localStorage.setItem("fl_prose_defendants", JSON.stringify(filtered));
    } catch (e) {}
    triggerSyncBanner(`✓ Removed Defendant & Updated Intake Roster`);
  };

  // Save Intake Defendant & Dynamically Rewrite Captions/Counts Across All Tabs
  const handleSaveIntakeDefendantAndSyncAll = () => {
    try {
      localStorage.setItem("fl_prose_defendants", JSON.stringify(defendantsList));

      const profCfg = PROFESSION_CONFIGS[selectedDef.profession] || PROFESSION_CONFIGS.cpa;
      const fullPrivityDescription = `${getPrivityLabelById(selectedDef.privityType)}${
        selectedDef.customPrivityDetails ? ` — ${selectedDef.customPrivityDetails}` : ""
      }`;

      // 1. Rebuild Matter Counts to reflect current Intake Defendants accurately
      const syncedCounts = defendantsList.map((d, idx) => {
        const pCfg = PROFESSION_CONFIGS[d.profession] || PROFESSION_CONFIGS.cpa;
        const pDesc = `${getPrivityLabelById(d.privityType)}${
          d.customPrivityDetails ? ` — ${d.customPrivityDetails}` : ""
        }`;
        return {
          id: `cnt-sync-${d.id}`,
          countNum: `Count ${idx + 1}`,
          title: `${pCfg.label} Malpractice, Breach of Duty & Record Concealment`,
          defendantName: `${d.name}${d.entityName ? ` (${d.entityName})` : ""}`,
          authority: pCfg.governingRules,
          privityHook: `${pDesc} • Last Action: ${d.dateLastAction}`,
          status: `Synced from Intake (${d.evidence})`
        };
      });
      setMatterCounts(syncedCounts);
      localStorage.setItem("fl_prose_matter_counts", JSON.stringify(syncedCounts));

      // 2. Sync to Plaintiff's Playbook
      const newPlaybookEntry = {
        id: `pp-def-${selectedDef.id}`,
        title: `Live Intake Strategy: ${selectedDef.name} (${selectedDef.entityName || profCfg.label})`,
        body: `Governing Law: ${profCfg.governingRules}.\nPrivity Standard: ${fullPrivityDescription}.\nUltimate Facts of Breach (${selectedDef.dateLastAction}): ${selectedDef.specificBreach}.\nRule 1.130 Exhibit: ${selectedDef.evidence} | Witnesses: ${selectedDef.witnesses} | Co-Defendants: ${selectedDef.otherDefendants}.`
      };
      const filteredPb = plaintiffPlaybookCards.filter((p) => p.id !== newPlaybookEntry.id);
      const updatedPb = [newPlaybookEntry, ...filteredPb];
      setPlaintiffPlaybookCards(updatedPb);
      localStorage.setItem("fl_prose_plaintiff_pb", JSON.stringify(updatedPb));

      // 3. Sanitize & Update Saved Drafts Captions with Live Intake Names
      const updatedDrafts = savedDrafts.map((dr) => ({
        ...dr,
        content: sanitizeRichardToApril(dr.content)
      }));
      setSavedDrafts(updatedDrafts);
      localStorage.setItem("fl_prose_drafts", JSON.stringify(updatedDrafts));

      triggerSyncBanner(
        `✓ Intake Saved! AI, Matters, Playbooks & Drafts Now Synced to ${defendantsList
          .map((d) => d.name)
          .join(" & ")}`
      );
    } catch (e) {}
  };

  const handleSaveHistoryAndSync = () => {
    try {
      localStorage.setItem("fl_prose_chats", JSON.stringify(chatThreads));
      const lastMsg = activeChatThread.messages[activeChatThread.messages.length - 1];
      if (lastMsg) {
        const newCard = {
          id: `pp-${Date.now()}`,
          title: `Synced from AI Research: ${activeChatThread.title}`,
          body: lastMsg.text
        };
        const updatedPb = [newCard, ...plaintiffPlaybookCards];
        setPlaintiffPlaybookCards(updatedPb);
        localStorage.setItem("fl_prose_plaintiff_pb", JSON.stringify(updatedPb));
      }
      triggerSyncBanner("✓ AI Thread Saved & Synced to Plaintiff's Playbook");
    } catch (e) {}
  };

  const handleSaveDraftAndSync = () => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const updatedDrafts = savedDrafts.map((d) =>
      d.id === activeDraft.id ? { ...d, updatedAt: todayIso, status: "Saved & Synced" } : d
    );
    setSavedDrafts(updatedDrafts);
    try {
      localStorage.setItem("fl_prose_drafts", JSON.stringify(updatedDrafts));
    } catch (e) {}
    triggerSyncBanner(`✓ "${activeDraft.title}" Saved & Synced to Recent Drafts & Matters`);
  };

  const handleSaveCalendarAndSync = () => {
    let updatedCal = [...calendarEvents];
    if (newCalTitle.trim()) {
      updatedCal.push({
        id: `cal-${Date.now()}`,
        date: newCalDate,
        day: Number(newCalDate.split("-")[2]),
        title: newCalTitle,
        type: "Synced Court Deadline"
      });
      setNewCalTitle("");
    }
    setCalendarEvents(updatedCal);
    try {
      localStorage.setItem("fl_prose_calendar", JSON.stringify(updatedCal));
    } catch (e) {}
    triggerSyncBanner("✓ Deadlines Saved & Synced to Google Calendar & Matters");
  };

  const handleSaveMattersAndSyncToDrafts = () => {
    try {
      localStorage.setItem("fl_prose_matter_counts", JSON.stringify(matterCounts));
      triggerSyncBanner("✓ Matter Counts Saved & Synced into Drafts & Memoranda");
    } catch (e) {}
  };

  const handleSaveSignatureAndSyncAllDrafts = () => {
    try {
      localStorage.setItem("fl_prose_sig_text", signatureText);
      const updatedDrafts = savedDrafts.map((dr) => ({
        ...dr,
        content: dr.content.replace(/By:\s*\/s\/.*$/gm, `By: ${signatureText}`)
      }));
      setSavedDrafts(updatedDrafts);
      localStorage.setItem("fl_prose_drafts", JSON.stringify(updatedDrafts));
      triggerSyncBanner("✓ Signature Saved & Applied Across All Pleadings & Memoranda");
    } catch (e) {}
  };

  const handleSaveFiledPleadingAndSyncToDefensePlaybook = () => {
    if (!newFiledTitle.trim()) return;
    const newDoc = {
      id: `filed-${Date.now()}`,
      title: newFiledTitle,
      filer: newFiledFiler,
      dateFiled: new Date().toISOString().slice(0, 10),
      type: "Filed Pleading",
      summary: newFiledSummary || "Uploaded pleading analyzed for defense objections and procedural traps.",
      extractedAttack: "Rule 1.140(b)(6) Fact-Pleading / Privity Challenge"
    };
    const updatedFiled = [newDoc, ...filedPleadings];
    setFiledPleadings(updatedFiled);

    const newDefenseCard = {
      id: `dp-${Date.now()}`,
      count: `Synced from Filed Doc: ${newFiledTitle}`,
      defenseAttack: `Objection raised by ${newFiledFiler}`,
      defenseGrounds: newFiledSummary || "Defense challenges standing, privity, or sufficiency of ultimate facts.",
      howToOvercome: "Counter with specific ultimate facts under Fla. R. Civ. P. 1.110(b), invoke the Four Corners Rule (Barbado v. Green & Murphy, P.A.), and attach supporting exhibits under Rule 1.130(a).",
      controllingLaw: "Fla. R. Civ. P. 1.110(b), 1.130(a), 1.140(b); 4th DCA Precedent."
    };
    const updatedDefPb = [newDefenseCard, ...defensePlaybook];
    setDefensePlaybook(updatedDefPb);

    try {
      localStorage.setItem("fl_prose_filed_docs", JSON.stringify(updatedFiled));
      localStorage.setItem("fl_prose_defense_pb", JSON.stringify(updatedDefPb));
    } catch (e) {}

    setNewFiledTitle("");
    setNewFiledSummary("");
    triggerSyncBanner("✓ Filed Pleading Saved & Synced to Defense Playbook & Memorandum Builder");
  };

  const handleSaveDefensePlaybookAndSyncToPlaintiff = () => {
    try {
      localStorage.setItem("fl_prose_defense_pb", JSON.stringify(defensePlaybook));
      const synthesizedCard = {
        id: `pp-rebuttal-${Date.now()}`,
        title: `Synced Defense Rebuttal (${defensePlaybook.length} Objections Countered)`,
        body: defensePlaybook
          .map((d) => `• ${d.count}: Overcome "${d.defenseAttack}" via ${d.controllingLaw}`)
          .join("\n")
      };
      const updatedPlPb = [synthesizedCard, ...plaintiffPlaybookCards];
      setPlaintiffPlaybookCards(updatedPlPb);
      localStorage.setItem("fl_prose_plaintiff_pb", JSON.stringify(updatedPlPb));
      triggerSyncBanner("✓ Defense Playbook Saved & Rebuttals Synced to Plaintiff's Playbook");
    } catch (e) {}
  };

  const handleSavePlaintiffPlaybookAndSyncToDraft = () => {
    let updatedPlPb = [...plaintiffPlaybookCards];
    if (customPlaintiffNote.trim()) {
      updatedPlPb = [
        {
          id: `pp-note-${Date.now()}`,
          title: "Plaintiff's Custom Florida Authority & Standing Note",
          body: customPlaintiffNote
        },
        ...updatedPlPb
      ];
      setPlaintiffPlaybookCards(updatedPlPb);
      setCustomPlaintiffNote("");
    }
    try {
      localStorage.setItem("fl_prose_plaintiff_pb", JSON.stringify(updatedPlPb));
      triggerSyncBanner("✓ Plaintiff's Playbook Saved & Synced to Memorandum Generator");
    } catch (e) {}
  };

  const handleSaveEvidenceAndSync = () => {
    let updatedEv = [...evidenceItems];
    if (newEvTitle.trim()) {
      const nextNum = evidenceItems.length * 15 + 1;
      const endNum = nextNum + 14;
      const pad = (n) => String(n).padStart(4, "0");
      const bates = `LEE-${newEvExhibit.replace(/\s+/g, "")}-${pad(nextNum)} to ${pad(endNum)}`;
      const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19) + " EDT";

      const createdEv = {
        id: `ev-${Date.now()}`,
        defendantId: selectedDef.id,
        exhibitLabel: newEvExhibit,
        title: newEvTitle,
        fileType: "PDF / Exhibit Package",
        batesRange: bates,
        capturedMetadata: `Authenticated Metadata • Custodian: ${plaintiff} • Linked to ${selectedDef.name}`,
        downloadedTimestamp: nowStr
      };
      updatedEv = [...updatedEv, createdEv];
      setEvidenceItems(updatedEv);

      const updatedDefs = defendantsList.map((d) =>
        d.id === selectedDef.id
          ? { ...d, evidence: `${newEvExhibit}: ${newEvTitle} (Bates: ${bates})` }
          : d
      );
      setDefendantsList(updatedDefs);
      localStorage.setItem("fl_prose_defendants", JSON.stringify(updatedDefs));
      setNewEvTitle("");
    }
    try {
      localStorage.setItem("fl_prose_evidence", JSON.stringify(updatedEv));
    } catch (e) {}
    triggerSyncBanner(
      `✓ Evidence Vault Saved, Bates Numbered & Synced to ${selectedDef.name}'s Profile`
    );
  };

  const handleGenerateTemplateIntoDraft = (templateIdToUse) => {
    const tpl = JUDGE_TEMPLATES.find((t) => t.id === (templateIdToUse || selectedTemplateId)) || JUDGE_TEMPLATES[0];
    const refDoc = filedPleadings.find((f) => f.id === respondingToFilingId) || filedPleadings[0];

    const generatedContent = `IN THE CIRCUIT COURT OF THE 17TH JUDICIAL CIRCUIT
IN AND FOR BROWARD COUNTY, FLORIDA

CASE NO.: CACE-26-XXXXXX
DIVISION: 25 (Hon. Shari Africk Olefson)

${plaintiff.toUpperCase()},
    Plaintiff,
v.
${liveDefendantsCaptionString}, et al.,
    Defendants.
__________________________________________/

${tpl.name.toUpperCase()}
(Responding to: ${refDoc.title})

Plaintiff, ${plaintiff.toUpperCase()}, pro se, files this ${tpl.name} in accordance with 17th Judicial Circuit Division 25 Procedures and Florida Rules of Civil Procedure, and states:

I. PROCEDURAL POSTURE & REFERENCED FILING
1. This pleading directly addresses and responds to "${refDoc.title}" filed on ${refDoc.dateFiled} by ${refDoc.filer}.
2. Divisional Compliance: Formatted in 12-point Times New Roman, double-spaced, with mandatory Local Rule 10A conferral certification.

II. SYNCED INTAKE DEFENDANTS, PRIVITY STANDARDS & ULTIMATE FACTS (FLA. R. CIV. P. 1.110(b))
${defendantsList
  .map(
    (d, i) =>
      `${i + 3}. Defendant ${d.name} (${d.entityName || PROFESSION_CONFIGS[d.profession]?.label}):\n   • Privity Standard: ${getPrivityLabelById(d.privityType)}${
        d.customPrivityDetails ? `\n   • Complex Privity / Standing Particulars: ${d.customPrivityDetails}` : ""
      }\n   • Ultimate Facts of Breach (${d.dateLastAction}, discovered ${d.discoveryDate}): ${d.specificBreach}\n   • Rule 1.130 Attachment: ${d.evidence} | Witnesses: ${d.witnesses} | Co-Defendants: ${d.otherDefendants}.`
  )
  .join("\n\n")}

III. SYNCED EVIDENCE VAULT & BATES INDEX (FLA. R. CIV. P. 1.130(a))
${evidenceItems
  .map((ev) => `• ${ev.exhibitLabel}: ${ev.title} [Bates: ${ev.batesRange}] (${ev.downloadedTimestamp})`)
  .join("\n")}

IV. MEMORANDUM OF LAW OVERCOMING DEFENSE PLAYBOOK OBJECTIONS
${plaintiffPlaybookCards
  .slice(0, 3)
  .map((pp) => `• ${pp.title}: ${pp.body}`)
  .join("\n")}

WHEREFORE, Plaintiff respectfully requests that this Honorable Court enter an Order granting the relief requested herein, together with taxable costs under Fla. Stat. § 57.041, reciprocal fees under § 57.105(7), and such further relief as is just and proper.

Respectfully submitted,

By: ${signatureText}
${plaintiff}, Pro Se
Email: service@allegedlylegal.com`;

    const newDraftId = `draft-${Date.now()}`;
    const newDraftObj = {
      id: newDraftId,
      title: `${tpl.name} (${defendantsList.map((d) => d.name).join(", ")})`,
      updatedAt: "2026-10-17",
      caseNo: "CACE-26-XXXXXX",
      type: tpl.category,
      status: "Synced & Ready",
      content: generatedContent
    };

    const updatedDrafts = [newDraftObj, ...savedDrafts];
    setSavedDrafts(updatedDrafts);
    try {
      localStorage.setItem("fl_prose_drafts", JSON.stringify(updatedDrafts));
    } catch (e) {}
    setActiveDraftId(newDraftId);
    setActiveNav("editor");
    triggerSyncBanner(
      `✓ Template Built Using Live Intake (${defendantsList.map((d) => d.name).join(", ")})`
    );
  };

  // ============================================================================
  // LIVE INTAKE-AWARE FLORIDA LEGAL AI RESPONDER
  // ============================================================================
  const generateFloridaLegalAiResponse = (queryText) => {
    const lower = queryText.toLowerCase();
    const intakeSummary = defendantsList
      .map(
        (d) =>
          `• ${d.name} (${d.entityName || PROFESSION_CONFIGS[d.profession]?.label}) — Privity: ${getPrivityLabelById(
            d.privityType
          )} | Breach (${d.dateLastAction}): ${d.specificBreach} | Exhibit: ${d.evidence}`
      )
      .join("\n");

    if (lower.includes("halle") || lower.includes("april") || lower.includes("attorney")) {
      const halleDef =
        defendantsList.find((d) => d.name.toLowerCase().includes("halle")) || defendantsList[0];
      return `LIVE INTAKE ANALYSIS FOR ${halleDef.name.toUpperCase()} (${halleDef.entityName}):\n1. Pled Privity & Privilege Waiver: ${getPrivityLabelById(
        halleDef.privityType
      )} (${halleDef.customPrivityDetails || "Joint representation / common interest under Fla. Stat. § 90.502(4)(c)"}).\n2. Ultimate Facts of Breach (${halleDef.dateLastAction}): ${
        halleDef.specificBreach
      }\n3. Co-Conspirator / Aiding & Abetting Hook: Under SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327, ${
        halleDef.name
      } is liable for aiding and abetting fiduciary breaches alongside ${
        halleDef.otherDefendants || "Engleberg, CPA"
      } based on actual knowledge and substantial assistance.\n4. Rule 1.130 Evidence: ${halleDef.evidence}.`;
    }
    if (lower.includes("privity") || lower.includes("ultramares") || lower.includes("max mitchell") || lower.includes("dattoma") || lower.includes("engleberg") || lower.includes("cpa")) {
      return `FLORIDA PRIVITY & STANDING ANALYSIS (LIVE INTAKE ROSTER):\n${intakeSummary}\n\n1. CPA Privity Exceptions (Engleberg, CPA): Under First Fla. Bank v. Max Mitchell & Co., 558 So. 2d 9 (Fla. 1990) and Dattoma v. Laughlin, 183 So. 3d 465 (Fla. 4th DCA 2016), strict privity is overcome by known reliance, joint-client status under Fla. Stat. § 473.316(4)(c), crime-fraud waiver under § 473.316(4)(a), and mandatory client record duties under F.A.C. R. 61H1-23.002 & § 473.318.\n2. Attorney Privity Exceptions (April I. Halle, Esq.): Under Espinosa v. Sparber and Fla. Stat. § 90.502(4)(a)/(c), joint representation and crime/fraud waive privilege and establish direct liability.`;
    }
    if (lower.includes("count iv") || lower.includes("olefson") || lower.includes("oct 5") || lower.includes("rehearing") || lower.includes("1.530")) {
      return `CRITICAL FLORIDA PROCEDURAL ANALYSIS (Count IV Dismissal & Rule 1.530):\n1. Jurisdictional Deadline: Under Fla. R. Civ. P. 1.530(b), a Motion for Rehearing must be served within 15 days of the Oct 5, 2026 Order (Deadline: Tuesday, October 20, 2026).\n2. Reversible Error on the Four Corners: Under Barbado v. Green & Murphy, P.A., 758 So. 2d 1173 (Fla. 4th DCA 2000), a trial court may not consider unsworn factual assertions of defense counsel or resolve unpled affirmative defenses like Fla. Stat. § 607.0832 on a Motion to Dismiss.\n3. Live Intake Parties Synced: ${defendantsList.map((d) => d.name).join(", ")}.`;
    }
    return `FLORIDA CIRCUIT CIVIL AI (READING LIVE INTAKE ROSTER):\nCurrently Loaded Defendants from Tab 4 (Intake):\n${intakeSummary}\n\nAll generated Memoranda of Law (Library Tab 6), Templates (Library Tab 5), and Matters (Tab 5) are actively pulling these exact names, privity hooks, and ultimate facts.`;
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

  const createGoogleCalendarUrl = (ev) => {
    const dateClean = ev.date.replace(/-/g, "");
    const titleEnc = encodeURIComponent(`[FL 17th Cir] ${ev.title}`);
    const detailsEnc = encodeURIComponent(
      `Case: CACE Lee vs April I. Halle, Esq., Engleberg, CPA (Broward Div 25)\nCategory: ${ev.type}`
    );
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
                        text: `Florida Legal AI session started. Reading Live Intake Roster: ${defendantsList
                          .map((d) => d.name)
                          .join(", ")}.`
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
                  <span>Tab 3: Today (Calendar)</span>
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
                  {matterCounts.length}
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

              <button
                onClick={() => {
                  setActiveNav("memo_of_law");
                  setSidebarOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                  activeNav === "memo_of_law"
                    ? "bg-indigo-50 text-indigo-950 font-semibold border-l-2 border-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Gavel className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  <span>6. Memorandum of Law</span>
                </span>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 rounded font-bold">
                  {memorandaList.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Intake Status Card */}
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
                Live Defendants: {defendantsList.map((d) => d.name).join(" | ")}
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

        {syncNotification && (
          <div className="bg-emerald-800 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between shadow-sm z-20">
            <span>{syncNotification}</span>
            <button onClick={() => setSyncNotification(null)} className="text-emerald-200 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* ================================================================== */}
        {/* LIBRARY TAB 6: MEMORANDUM OF LAW (AI Auto-Fill + Print Per Count)  */}
        {/* ================================================================== */}
        {activeNav === "memo_of_law" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            <div className="bg-white border-b border-slate-200 p-4 sm:px-6 space-y-3 shrink-0 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200">
                    Library Tab 6 • Synced with Intake ({defendantsList.map((d) => d.name).join(", ")})
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                    AI Memorandum of Law Builder (Per Filing, Motion & Count)
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAiGenerateMemorandum}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Fill Memorandum Using Live Intake
                  </button>
                  <button
                    onClick={handleSaveMemoAndSyncToDrafts}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save & Sync to Drafts
                  </button>
                  <button
                    onClick={handlePrintActiveMemorandum}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Memorandum (12pt Court Format)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    1. Select Target Count (or All Counts):
                  </label>
                  <select
                    value={memoSelectedCountId}
                    onChange={(e) => setMemoSelectedCountId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white font-medium text-slate-900"
                  >
                    <option value="all">All Counts Combined (Omnibus Memorandum)</option>
                    {matterCounts.map((mc) => (
                      <option key={mc.id} value={mc.id}>
                        {mc.countNum}: {mc.title} ({mc.defendantName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    2. Select Referenced Filing / Court Order:
                  </label>
                  <select
                    value={memoSelectedFilingId}
                    onChange={(e) => setMemoSelectedFilingId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white font-medium text-slate-900"
                  >
                    {filedPleadings.map((fp) => (
                      <option key={fp.id} value={fp.id}>
                        {fp.title} ({fp.dateFiled})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    3. Select Motion / Pleading Purpose:
                  </label>
                  <select
                    value={memoSelectedMotionType}
                    onChange={(e) => setMemoSelectedMotionType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white font-medium text-slate-900"
                  >
                    <option value="Rule 1.530 Motion for Rehearing & To Vacate Dismissal">
                      Rule 1.530 Motion for Rehearing & To Vacate Dismissal
                    </option>
                    <option value="Opposition to Defendants' Motion to Dismiss">
                      Opposition to Defendants&apos; Motion to Dismiss (Four Corners & Privity)
                    </option>
                    <option value="Motion to Compel CPA Workpapers & Corporate Ledgers (Rule 1.380)">
                      Motion to Compel CPA Workpapers & Corporate Ledgers (§ 473.318 & F.A.C. 61H1-23.002)
                    </option>
                    <option value="Verified Fourth Amended Complaint Standing & Privity Proffer">
                      Verified Fourth Amended Complaint Standing & Privity Proffer (Dinuro)
                    </option>
                    <option value="Motion to Strike Affirmative Defenses & Safe Harbor (§ 607.0832)">
                      Motion to Strike Affirmative Defenses & Safe Harbor (§ 607.0832)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-4 overflow-y-auto space-y-2.5 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Generated Memoranda ({memorandaList.length})
                  </span>
                  <button
                    onClick={handleDownloadActiveMemo}
                    className="text-[11px] text-indigo-700 font-semibold hover:underline"
                  >
                    Download .txt
                  </button>
                </div>

                {memorandaList.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setActiveMemoId(m.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition space-y-1 ${
                      activeMemoId === m.id
                        ? "bg-indigo-50/70 border-indigo-600 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[10px] font-mono bg-white text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200 inline-block">
                      {m.targetCount}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{m.title}</h3>
                    <p className="text-[10px] text-slate-500 truncate">Re: {m.targetFiling}</p>
                  </div>
                ))}
              </aside>

              <main className="flex-1 bg-[#F1F3F5] p-4 sm:p-8 overflow-y-auto flex justify-center">
                <div className="w-full max-w-3xl flex flex-col space-y-3">
                  <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs shadow-sm">
                    <div>
                      <span className="font-bold text-slate-900">{activeMemo.title}</span>
                    </div>
                    <button
                      onClick={handlePrintActiveMemorandum}
                      className="flex items-center gap-1 text-indigo-700 font-bold hover:underline shrink-0"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print This Memorandum
                    </button>
                  </div>

                  <textarea
                    value={activeMemo.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = memorandaList.map((item) =>
                        item.id === activeMemo.id ? { ...item, content: val } : item
                      );
                      setMemorandaList(updated);
                      try {
                        localStorage.setItem("fl_prose_memoranda", JSON.stringify(updated));
                      } catch (err) {}
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg shadow-md p-6 sm:p-12 min-h-[920px] font-serif text-xs leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </main>
            </div>
          </div>
        )}

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
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{activeChatThread.title}</h2>
                  <p className="text-[11px] text-slate-400">
                    Reading Live Intake: {defendantsList.map((d) => d.name).join(", ")}
                  </p>
                </div>
                <button
                  onClick={handleSaveHistoryAndSync}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Thread & Sync to Playbook
                </button>
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
                  placeholder="Ask about April I. Halle, Esq., Engleberg, CPA, Privity, or Count IV..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                />
                <button
                  onClick={() => {
                    handleSendChatThreadMessage(aiInput);
                    setAiInput("");
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDraftAndSync}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save All Drafts to Memory
                  </button>
                  <button
                    onClick={() => setActiveNav("memo_of_law")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    Build Memorandum of Law
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {dr.content.slice(0, 180)}...
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-semibold text-slate-500">{dr.status}</span>
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        Open Editor Screen <ArrowRight className="w-3 h-3" />
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraftAndSync}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save & Sync Draft
                </button>
                <button
                  onClick={handleExportActiveDraft}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Download (.txt)
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex justify-center">
              <textarea
                value={activeDraft.content}
                onChange={(e) => {
                  const val = e.target.value;
                  setSavedDrafts((prev) =>
                    prev.map((d) => (d.id === activeDraft.id ? { ...d, content: val } : d))
                  );
                }}
                className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-12 min-h-[900px] font-serif text-xs leading-relaxed text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: WORK / TODAY */}
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
                  onClick={handleSaveCalendarAndSync}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save & Sync Deadline
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-medium text-slate-900">Good afternoon, Tina.</h2>
                  <p className="text-xs text-slate-500">
                    Saturday, October 17, 2026 • Connected to Gmail (service@allegedlylegal.com)
                  </p>
                </div>
                <button
                  onClick={handleSaveCalendarAndSync}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5" /> Save & Sync Today
                </button>
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
            </div>
          </div>
        )}

        {/* TAB 4: INTAKE (Multi-Defendant Profession Matrix + ALL PRIVITY STANDARDS + OTHER) */}
        {activeNav === "intake" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="border-b border-slate-200 px-6 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6 text-xs font-semibold">
                <button
                  onClick={() => setIntakeSubTab("defendants")}
                  className={`py-2 border-b-2 ${
                    intakeSubTab === "defendants"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Defendant Profession & Privity Intake ({defendantsList.length})
                </button>
                <button
                  onClick={() => setIntakeSubTab("cases")}
                  className={`py-2 border-b-2 ${
                    intakeSubTab === "cases"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Cases Queue (0)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveIntakeDefendantAndSyncAll}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Defendant & Sync All Tabs
                </button>
              </div>
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
                    Named Defendants (Live AI Source)
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
                    onClick={() => {
                      const newId = `def-${Date.now()}`;
                      const newEntry = {
                        id: newId,
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
                      };
                      setDefendantsList((prev) => [...prev, newEntry]);
                      setActiveDefId(newId);
                    }}
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
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {currentProfConfig.governingRules}
                          </span>
                          {defendantsList.length > 1 && (
                            <button
                              onClick={handleDeleteCurrentDefendant}
                              className="text-rose-600 hover:text-rose-800 p-1"
                              title="Delete Defendant"
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
                          Defendant Name (Read Directly by AI)
                        </label>
                        <input
                          type="text"
                          value={selectedDef.name}
                          onChange={(e) => handleUpdateDefField("name", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Firm / Entity / DBA Name
                        </label>
                        <input
                          type="text"
                          value={selectedDef.entityName}
                          onChange={(e) => handleUpdateDefField("entityName", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Capacity Sued In
                        </label>
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
                        <label className="text-slate-600 font-semibold block mb-1">
                          Date of Last Wrongful Action
                        </label>
                        <input
                          type="date"
                          value={selectedDef.dateLastAction}
                          onChange={(e) => handleUpdateDefField("dateLastAction", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                          Step 2: Privity & Standing Standard (All Florida Doctrines + Other/Complex)
                        </label>
                        <span className="text-[10px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          Synced to Memorandum of Law
                        </span>
                      </div>

                      <select
                        value={selectedDef.privityType}
                        onChange={(e) => handleUpdateDefField("privityType", e.target.value)}
                        className="w-full border border-emerald-300 rounded-lg p-2.5 text-xs bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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

                      <div className="space-y-1 pt-1">
                        <label className="text-xs font-semibold text-slate-800 block">
                          {selectedDef.privityType === "other_complex"
                            ? "★ Specify Other / Complex Multi-Layered Privity Facts & Legal Hooks (Required):"
                            : "Complex Privity / Multi-Tiered Standing Particulars (Optional Supplement):"}
                        </label>
                        <textarea
                          rows={3}
                          value={selectedDef.customPrivityDetails || ""}
                          onChange={(e) => handleUpdateDefField("customPrivityDetails", e.target.value)}
                          placeholder="Detail complex privity chains here (e.g., interlocking Delray Beach DBA & corporate entities, joint-client representation, third-party lender reliance triangle, exclusive possession of contracts under Sachse, or aiding & abetting overt acts)..."
                          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                        <label className="text-slate-600 font-semibold block mb-1">
                          Evidence (Rule 1.130)
                        </label>
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
                        <label className="text-slate-600 font-semibold block mb-1">
                          Other Co-Defendants
                        </label>
                        <input
                          type="text"
                          value={selectedDef.otherDefendants}
                          onChange={(e) => handleUpdateDefField("otherDefendants", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveIntakeDefendantAndSyncAll}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm"
                      >
                        <Save className="w-4 h-4" />
                        Save Defendant & Update AI, Matters, Playbooks & Memoranda
                      </button>
                    </div>
                  </div>
                </main>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MATTERS */}
        {activeNav === "matters" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      CACE Lee vs {defendantsList.map((d) => d.name).join(", ")}
                    </h2>
                    <p className="text-xs text-slate-500">
                      17th Judicial Circuit • Broward County Division 25 • Synced with Live Intake
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveIntakeDefendantAndSyncAll}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-Sync Counts from Intake
                    </button>
                    <button
                      onClick={handleSaveMattersAndSyncToDrafts}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Matter Counts
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matterCounts.map((c, idx) => (
                    <div key={c.id || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800">{c.countNum}</span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          Target: {c.defendantName}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMatterCounts((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, title: val } : item))
                          );
                        }}
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-semibold"
                      />
                      <p className="text-[11px] text-slate-600">
                        <strong>Authority:</strong> {c.authority}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        <strong>Privity Hook:</strong> {c.privityHook}
                      </p>
                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => {
                            setMemoSelectedCountId(c.id);
                            setActiveNav("memo_of_law");
                          }}
                          className="text-indigo-700 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          Generate Printable Memorandum for {c.countNum} →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                  Save your signature once and sync it automatically to all verified complaints, motions, and Memoranda of Law.
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
                onClick={handleSaveSignatureAndSyncAllDrafts}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Signature & Apply to All Pleadings
              </button>
            </div>
          </div>
        )}

        {/* LIBRARY 1: FILED DRAFTS, MOTIONS, PLEADINGS & ORDERS */}
        {activeNav === "filed_drafts" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    Log Filed Motion, Pleading, or Court Order for Defense Playbook Sync
                  </h2>
                  <button
                    onClick={handleSaveFiledPleadingAndSyncToDefensePlaybook}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save & Send to Defense Playbook
                  </button>
                </div>
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
                    placeholder="Filed By (e.g., April I. Halle, Esq. / Court)"
                    className="border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <textarea
                  rows={2}
                  value={newFiledSummary}
                  onChange={(e) => setNewFiledSummary(e.target.value)}
                  placeholder="Paste key defense arguments or order findings to sync into the Defense Playbook..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
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
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            setMemoSelectedFilingId(doc.id);
                            setActiveNav("memo_of_law");
                          }}
                          className="text-indigo-700 font-semibold hover:underline"
                        >
                          Generate Memorandum of Law →
                        </button>
                        <button
                          onClick={() => {
                            setRespondingToFilingId(doc.id);
                            setActiveNav("templates");
                          }}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          Build Template →
                        </button>
                      </div>
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
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Defense Playbook: Count-by-Count Objections & How to Overcome
                </h2>
                <button
                  onClick={handleSaveDefensePlaybookAndSyncToPlaintiff}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save & Sync to Plaintiff Playbook
                </button>
              </div>
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
                  Synced with Intake: {defendantsList.map((d) => d.name).join(", ")}
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
                  placeholder="Ask about April I. Halle, Esq., Engleberg, CPA..."
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
              <div className="p-5 bg-emerald-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase bg-emerald-800 px-2 py-0.5 rounded">
                    AI-Synthesized Offensive Strategy • Live Intake: {defendantsList.map((d) => d.name).join(", ")}
                  </span>
                  <h2 className="text-base font-bold">
                    Plaintiff&apos;s Master Playbook & Standing Vulnerability Cure
                  </h2>
                </div>
                <button
                  onClick={handleSavePlaintiffPlaybookAndSyncToDraft}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-950 rounded-lg text-xs font-bold shrink-0 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Playbook & Sync
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Add Custom Florida Case Law or Pleading Strategy Note:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPlaintiffNote}
                    onChange={(e) => setCustomPlaintiffNote(e.target.value)}
                    placeholder="Enter statutory citation, 4th DCA holding, or factual standing cure..."
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                  <button
                    onClick={handleSavePlaintiffPlaybookAndSyncToDraft}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    + Save & Sync Note
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plaintiffPlaybookCards.map((card) => (
                  <div key={card.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                    <span className="text-xs font-bold text-emerald-800 uppercase block">
                      {card.title}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY 4: EVIDENCE VAULT & BATES NUMBERING PER DEFENDANT */}
        {activeNav === "vault" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Evidence Vault, Metadata & Automated Bates Numbering
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select a defendant tab below to manage Rule 1.130 exhibits and sync them to Intake & Memoranda.
                  </p>
                </div>
                <button
                  onClick={handleSaveEvidenceAndSync}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold self-start"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Evidence & Sync Rule 1.130 Exhibits
                </button>
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
                  onClick={handleSaveEvidenceAndSync}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold shrink-0"
                >
                  + Stamp Bates & Sync to Defendant
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
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    17th Judicial Circuit Division 25 • Synced with Intake ({defendantsList.map((d) => d.name).join(", ")})
                  </span>
                  <button
                    onClick={() => handleGenerateTemplateIntoDraft(selectedTemplateId)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save & Compile Selected Template
                  </button>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Judge Procedures & Responsive Pleading Builder
                </h2>
                <p className="text-xs text-slate-600">
                  Automatically pulls your synced Defendants ({defendantsList.map((d) => d.name).join(", ")}) & Privity Standards from Intake, Bates Exhibits from the Evidence Vault, Arguments from Plaintiff&apos;s Playbook, and your Saved Signature.
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
                        handleGenerateTemplateIntoDraft(tpl.id);
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save & Build Pleading Into Recent Drafts →
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
                <span className="text-xs font-bold text-white uppercase">
                  Florida Legal AI (Live Intake Synced)
                </span>
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
                placeholder="Ask about April I. Halle, Esq., Engleberg, CPA..."
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
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  triggerSyncBanner("✓ Workspace Settings Saved");
                }}
                className="w-full py-2 bg-emerald-700 text-white rounded-lg font-semibold"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
