// lib/florida-litigation-data.js

export const FLORIDA_CAUSES_OF_ACTION = [
  {
    id: "breach_contract",
    title: "Breach of Written Contract",
    dcaCitation: "Marchisio v. Carrington Mortg. Servs., LLC, 919 F.3d 1288 (11th Cir. 2019); Friedman v. N.Y. Life Ins. Co., 985 So. 2d 56 (Fla. 4th DCA 2008)",
    sol: "5 Years (Fla. Stat. § 95.11(2)(b))",
    elements: [
      { id: "e1", label: "Valid Contract", prompt: "A valid contract existed between the parties." },
      { id: "e2", label: "Material Breach", prompt: "Defendant committed a material breach of a specific provision of the contract." },
      { id: "e3", label: "Resulting Damages", prompt: "Plaintiff suffered distinct damages as a proximate result of the breach." }
    ],
    commonDefenses: ["Failure to Attach Instrument (Fla. R. Civ. P. 1.130)", "Statute of Frauds", "Failure to Satisfy Condition Precedent"]
  },
  {
    id: "breach_fiduciary",
    title: "Breach of Fiduciary Duty",
    dcaCitation: "Minotty v. Baudo, 42 So. 3d 824 (Fla. 4th DCA 2010); Dinuro Invs., LLC v. Camacho, 141 So. 3d 731 (Fla. 3d DCA 2014)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(o))",
    elements: [
      { id: "e1", label: "Existence of Fiduciary Duty", prompt: "Defendant owed Plaintiff a fiduciary duty of loyalty, disclosure, or care." },
      { id: "e2", label: "Breach of the Duty", prompt: "Defendant breached that fiduciary duty through self-dealing, nondisclosure, or conflict of interest." },
      { id: "e3", label: "Proximate Causation & Direct Injury", prompt: "Defendant's breach proximately caused direct, individual harm to Plaintiff (Dinuro direct injury standard)." }
    ],
    commonDefenses: ["Business Judgment Rule (§ 607.0831)", "Safe Harbor (§ 607.0832)", "Derivative vs. Direct Action Bar"]
  },
  {
    id: "civil_conspiracy",
    title: "Civil Conspiracy",
    dcaCitation: "SFM Holdings, Ltd. v. Banc of Am. Sec., LLC, 764 F.3d 1327 (11th Cir. 2014); Raimi v. Furlong, 702 So. 2d 1273 (Fla. 3d DCA 1997)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(p))",
    elements: [
      { id: "e1", label: "Conspiracy Agreement", prompt: "An agreement between two or more parties to achieve an unlawful purpose or a lawful purpose by unlawful means." },
      { id: "e2", label: "Overt Act", prompt: "The commission of an overt act in furtherance of the conspiracy." },
      { id: "e3", label: "Resulting Damage", prompt: "Plaintiff suffered actual damage as a direct result of the acts done under the conspiracy." }
    ],
    commonDefenses: ["Intra-Corporate Conspiracy Doctrine", "Absence of Underlying Actionable Tort"]
  },
  {
    id: "fraud_inducement",
    title: "Fraudulent Inducement / Misrepresentation",
    dcaCitation: "Butler v. Yusem, 44 So. 3d 102 (Fla. 2010); Wadlington v. Cont'l Med. Servs., Inc., 907 So. 2d 631 (Fla. 4th DCA 2005)",
    sol: "4 Years from Discovery (Fla. Stat. § 95.031(2)(a))",
    elements: [
      { id: "e1", label: "False Statement of Material Fact", prompt: "Defendant made a false statement of material fact knowing it was false." },
      { id: "e2", label: "Intent to Induce Reliance", prompt: "Defendant intended Plaintiff to act and rely upon the false representation." },
      { id: "e3", label: "Justifiable Reliance & Injury", prompt: "Plaintiff acted in justifiable reliance on the representation and suffered damages as a consequence." }
    ],
    commonDefenses: ["Economic Loss Rule (limited)", "Merger / Integration Clause", "Lack of Justifiable Reliance"]
  },
  {
    id: "accounting",
    title: "Equitable Accounting",
    dcaCitation: "Zaki Kulaibee Stores v. Han Hook LLC, 344 So. 3d 446 (Fla. 4th DCA 2022); Dahlawi v. Ramlawi, 644 So. 2d 523 (Fla. 3d DCA 1994)",
    sol: "4 Years (Fla. Stat. § 95.11(3)(p))",
    elements: [
      { id: "e1", label: "Fiduciary / Complex Relationship", prompt: "A fiduciary relationship exists between the parties OR the commercial accounts are sufficiently complicated." },
      { id: "e2", label: "Inadequate Remedy at Law", prompt: "A remedy at law (pure monetary damages) is inadequate without judicial inspection of books and records." }
    ],
    commonDefenses: ["Adequate Legal Remedy Available", "Lack of Fiduciary Privity"]
  }
];

export const FLORIDA_AFFIRMATIVE_DEFENSES = [
  {
    id: "rule_1_130",
    name: "Failure to Attach Cause of Action Instrument (Fla. R. Civ. P. 1.130)",
    statuteRule: "Fla. R. Civ. P. 1.130(a)",
    counterStrategy: "Attach the underlying contract, note, or demand letter as EXHIBIT A. If unavailable, plead under ultimate facts why the instrument is exclusively in Defendant's possession."
  },
  {
    id: "statute_limitations",
    name: "Statute of Limitations (Fla. Stat. § 95.11)",
    statuteRule: "Fla. Stat. § 95.11 / § 95.031",
    counterStrategy: "Plead the delayed discovery doctrine or fraudulent concealment, stating the exact date Plaintiff discovered the wrongful act."
  },
  {
    id: "safe_harbor",
    name: "Safe Harbor / Business Judgment Rule (Fla. Stat. § 607.0832)",
    statuteRule: "Fla. Stat. § 607.0832",
    counterStrategy: "Plead specific facts showing self-dealing, intentional nondisclosure, or personal benefit, which strips away statutory safe harbor protections."
  }
];
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
