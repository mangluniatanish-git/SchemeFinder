'use strict';

/**
 * SEED_SCHEMES — used when MongoDB is not configured (DEMO MODE).
 * These represent a representative subset of the full scheme database.
 * Each object mirrors the Scheme Mongoose model structure.
 */
const SEED_SCHEMES = [
  {
    _id: 'seed_001',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    slug: 'pm-kisan',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Department of Agriculture & Farmers Welfare',
    type: 'central',
    categories: ['agriculture', 'financial-aid'],
    description:
      'Provides income support of ₹6,000 per year to all landholding farmer families across India in three equal instalments of ₹2,000 each.',
    benefits: '₹6,000/year direct bank transfer in 3 instalments of ₹2,000 each.',
    eligibility: {
      occupation: ['farmer'],
      notes:
        'All landholding farmer families subject to certain exclusion criteria (income taxpayers, constitutional post holders, etc.)',
    },
    documents: ['Aadhaar card', 'Bank account details', 'Land records'],
    applicationProcess:
      'Apply at local Patwari/Revenue officer or through PM-KISAN portal. Self-registration available at pmkisan.gov.in',
    tags: ['farmer', 'income support', 'direct benefit transfer', 'agriculture'],
    officialUrl: 'https://pmkisan.gov.in',
    applyUrl: 'https://pmkisan.gov.in/registrationformnew.aspx',
    status: 'open',
    sourceVerified: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    _id: 'seed_002',
    name: 'Pradhan Mantri Awas Yojana – Urban (PMAY-U)',
    slug: 'pmay-urban',
    ministry: 'Ministry of Housing and Urban Affairs',
    type: 'central',
    categories: ['housing', 'financial-aid'],
    description:
      'Mission to provide affordable housing to the urban poor with target of ensuring housing for all in urban areas by 2022. Provides credit-linked subsidy on home loans.',
    benefits:
      'Credit-linked subsidy of up to ₹2.67 lakh on home loans for EWS/LIG/MIG categories.',
    eligibility: {
      category: ['EWS', 'LIG', 'MIG'],
      maxIncomeLakh: 18,
      notes: 'Beneficiary should not own a pucca house anywhere in India.',
    },
    documents: [
      'Aadhaar card',
      'Income certificate',
      'Affidavit of not owning house',
      'Bank account details',
    ],
    applicationProcess:
      'Apply through your bank/housing finance company or at PMAY portal. Urban Local Bodies also accept applications.',
    tags: ['housing', 'home loan subsidy', 'EWS', 'LIG', 'MIG', 'urban'],
    officialUrl: 'https://pmaymis.gov.in',
    status: 'open',
    sourceVerified: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    _id: 'seed_003',
    name: 'National Scholarship Portal (NSP) – Post-Matric Scholarship (SC)',
    slug: 'nsp-post-matric-sc',
    ministry: 'Ministry of Social Justice and Empowerment',
    type: 'central',
    categories: ['education', 'scholarship'],
    description:
      'Post-matric scholarships for Scheduled Caste students to support their higher education. Covers tuition fees, maintenance allowance, and other charges.',
    benefits:
      'Maintenance allowance + tuition fee reimbursement varying by course level. Covers studies from Class 11 onwards.',
    eligibility: {
      category: ['SC'],
      maxIncomeLakh: 2.5,
      education: ['secondary', 'higher-secondary', 'graduate', 'postgraduate'],
      notes: 'Annual family income must not exceed ₹2.5 lakh.',
    },
    documents: [
      'Aadhaar card',
      'Caste certificate',
      'Income certificate',
      'Previous marksheet',
      'Bank account',
      'Institution details',
    ],
    applicationProcess: 'Apply on National Scholarship Portal (scholarships.gov.in) before deadline.',
    tags: ['scholarship', 'SC', 'education', 'student', 'post-matric'],
    officialUrl: 'https://scholarships.gov.in',
    applyUrl: 'https://scholarships.gov.in',
    status: 'open',
    sourceVerified: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    _id: 'seed_004',
    name: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    slug: 'ayushman-bharat-pmjay',
    ministry: 'Ministry of Health and Family Welfare',
    department: 'National Health Authority',
    type: 'central',
    categories: ['health', 'insurance'],
    description:
      'World\'s largest government-funded health insurance scheme. Provides health cover of ₹5 lakh per family per year for secondary and tertiary hospitalisation.',
    benefits: '₹5 lakh/year health insurance cover per family. Covers 1,929+ treatment packages.',
    eligibility: {
      category: ['SC', 'ST', 'OBC'],
      maxIncomeLakh: 2.5,
      notes:
        'Based on SECC 2011 database. Deprivation and occupational criteria. No cap on family size or age.',
    },
    documents: ['Aadhaar card or ration card', 'PMJAY e-card (generated after enrollment)'],
    applicationProcess:
      'Check eligibility on pmjay.gov.in or nearest Common Service Centre. Get e-card at empanelled hospitals.',
    tags: ['health', 'insurance', 'hospitalisation', 'BPL', 'Ayushman'],
    officialUrl: 'https://pmjay.gov.in',
    status: 'open',
    sourceVerified: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    _id: 'seed_005',
    name: 'Startup India Seed Fund Scheme',
    slug: 'startup-india-seed-fund',
    ministry: 'Ministry of Commerce and Industry',
    department: 'DPIIT',
    type: 'central',
    categories: ['business', 'startup', 'financial-aid'],
    description:
      'Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.',
    benefits:
      'Up to ₹20 lakh as grant for validation and ₹50 lakh as debt/convertible debentures for market entry.',
    eligibility: {
      occupation: ['business', 'entrepreneur'],
      notes:
        'DPIIT-recognised startup, incorporated less than 2 years ago at time of application. Not received more than ₹10 lakh from Govt schemes.',
    },
    documents: [
      'DPIIT recognition certificate',
      'Business plan',
      'Incorporation certificate',
      'PAN of startup',
    ],
    applicationProcess: 'Apply through Startup India portal after empanelled incubators open applications.',
    tags: ['startup', 'entrepreneur', 'seed fund', 'business', 'DPIIT'],
    officialUrl: 'https://startupindia.gov.in',
    applyUrl: 'https://seedfund.startupindia.gov.in',
    status: 'open',
    sourceVerified: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    _id: 'seed_006',
    name: 'Mudra Loan – Pradhan Mantri MUDRA Yojana (PMMY)',
    slug: 'pm-mudra-yojana',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services',
    type: 'central',
    categories: ['business', 'financial-aid', 'self-employment'],
    description:
      'Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. Three tiers: Shishu (up to ₹50K), Kishore (₹50K–5L), Tarun (₹5L–10L).',
    benefits: 'Collateral-free loans from ₹10,000 to ₹10 lakh through banks, MFIs, and NBFCs.',
    eligibility: {
      occupation: ['business', 'self-employed', 'artisan'],
      notes:
        'Any Indian citizen with a business plan for income-generating activities in manufacturing, trading, services sector.',
    },
    documents: [
      'Aadhaar card',
      'PAN card',
      'Business plan',
      'Address proof',
      'Bank statements (6 months)',
    ],
    applicationProcess:
      'Apply at nearest public/private/cooperative bank, NBFC, MFI. Also available through Udyami Mitra portal.',
    tags: ['loan', 'MUDRA', 'small business', 'self-employment', 'micro-enterprise'],
    officialUrl: 'https://mudra.org.in',
    applyUrl: 'https://www.udyamimitra.in',
    status: 'open',
    sourceVerified: true,
    lastUpdated: new Date('2024-01-01'),
  },
];

module.exports = { SEED_SCHEMES };
