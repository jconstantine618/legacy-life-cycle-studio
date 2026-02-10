// 2025 Federal Tax Brackets (IRS Revenue Procedure 2024-40)

export type FilingStatus = "single" | "married_filing_jointly" | "married_filing_separately" | "head_of_household";

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export const federalBrackets: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: null, rate: 0.37 },
  ],
  married_filing_jointly: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: null, rate: 0.37 },
  ],
  married_filing_separately: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: null, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: null, rate: 0.37 },
  ],
};

export const standardDeductions: Record<FilingStatus, number> = {
  single: 15000,
  married_filing_jointly: 30000,
  married_filing_separately: 15000,
  head_of_household: 22500,
};

// State tax data
export interface StateTaxInfo {
  type: "none" | "flat" | "progressive";
  rate?: number; // for flat states
  brackets?: TaxBracket[]; // for progressive states
}

export const stateTaxData: Record<string, StateTaxInfo> = {
  AL: { type: "flat", rate: 0.05 },
  AK: { type: "none" },
  AZ: { type: "flat", rate: 0.025 },
  AR: { type: "progressive", brackets: [
    { min: 0, max: 4400, rate: 0.02 },
    { min: 4400, max: 8800, rate: 0.04 },
    { min: 8800, max: null, rate: 0.044 },
  ]},
  CA: { type: "progressive", brackets: [
    { min: 0, max: 10412, rate: 0.01 },
    { min: 10412, max: 24684, rate: 0.02 },
    { min: 24684, max: 38959, rate: 0.04 },
    { min: 38959, max: 54081, rate: 0.06 },
    { min: 54081, max: 68350, rate: 0.08 },
    { min: 68350, max: 349137, rate: 0.093 },
    { min: 349137, max: 418961, rate: 0.103 },
    { min: 418961, max: 698271, rate: 0.113 },
    { min: 698271, max: 1000000, rate: 0.123 },
    { min: 1000000, max: null, rate: 0.133 },
  ]},
  CO: { type: "flat", rate: 0.044 },
  CT: { type: "progressive", brackets: [
    { min: 0, max: 10000, rate: 0.02 },
    { min: 10000, max: 50000, rate: 0.045 },
    { min: 50000, max: 100000, rate: 0.055 },
    { min: 100000, max: 200000, rate: 0.06 },
    { min: 200000, max: 250000, rate: 0.065 },
    { min: 250000, max: 500000, rate: 0.069 },
    { min: 500000, max: null, rate: 0.0699 },
  ]},
  DE: { type: "progressive", brackets: [
    { min: 0, max: 2000, rate: 0.0 },
    { min: 2000, max: 5000, rate: 0.022 },
    { min: 5000, max: 10000, rate: 0.039 },
    { min: 10000, max: 20000, rate: 0.048 },
    { min: 20000, max: 25000, rate: 0.052 },
    { min: 25000, max: 60000, rate: 0.0555 },
    { min: 60000, max: null, rate: 0.066 },
  ]},
  FL: { type: "none" },
  GA: { type: "flat", rate: 0.0549 },
  HI: { type: "progressive", brackets: [
    { min: 0, max: 2400, rate: 0.014 },
    { min: 2400, max: 4800, rate: 0.032 },
    { min: 4800, max: 9600, rate: 0.055 },
    { min: 9600, max: 14400, rate: 0.064 },
    { min: 14400, max: 19200, rate: 0.068 },
    { min: 19200, max: 24000, rate: 0.072 },
    { min: 24000, max: 36000, rate: 0.076 },
    { min: 36000, max: 48000, rate: 0.079 },
    { min: 48000, max: 150000, rate: 0.0825 },
    { min: 150000, max: 175000, rate: 0.09 },
    { min: 175000, max: 200000, rate: 0.10 },
    { min: 200000, max: null, rate: 0.11 },
  ]},
  ID: { type: "flat", rate: 0.058 },
  IL: { type: "flat", rate: 0.0495 },
  IN: { type: "flat", rate: 0.0305 },
  IA: { type: "flat", rate: 0.038 },
  KS: { type: "progressive", brackets: [
    { min: 0, max: 15000, rate: 0.031 },
    { min: 15000, max: 30000, rate: 0.0525 },
    { min: 30000, max: null, rate: 0.057 },
  ]},
  KY: { type: "flat", rate: 0.04 },
  LA: { type: "progressive", brackets: [
    { min: 0, max: 12500, rate: 0.0185 },
    { min: 12500, max: 50000, rate: 0.035 },
    { min: 50000, max: null, rate: 0.0425 },
  ]},
  ME: { type: "progressive", brackets: [
    { min: 0, max: 24500, rate: 0.058 },
    { min: 24500, max: 58050, rate: 0.0675 },
    { min: 58050, max: null, rate: 0.0715 },
  ]},
  MD: { type: "progressive", brackets: [
    { min: 0, max: 1000, rate: 0.02 },
    { min: 1000, max: 2000, rate: 0.03 },
    { min: 2000, max: 3000, rate: 0.04 },
    { min: 3000, max: 100000, rate: 0.0475 },
    { min: 100000, max: 125000, rate: 0.05 },
    { min: 125000, max: 150000, rate: 0.0525 },
    { min: 150000, max: 250000, rate: 0.055 },
    { min: 250000, max: null, rate: 0.0575 },
  ]},
  MA: { type: "progressive", brackets: [
    { min: 0, max: 1000000, rate: 0.05 },
    { min: 1000000, max: null, rate: 0.09 },
  ]},
  MI: { type: "flat", rate: 0.0425 },
  MN: { type: "progressive", brackets: [
    { min: 0, max: 30070, rate: 0.0535 },
    { min: 30070, max: 98760, rate: 0.068 },
    { min: 98760, max: 183340, rate: 0.0785 },
    { min: 183340, max: null, rate: 0.0985 },
  ]},
  MS: { type: "flat", rate: 0.047 },
  MO: { type: "progressive", brackets: [
    { min: 0, max: 1207, rate: 0.02 },
    { min: 1207, max: 2414, rate: 0.025 },
    { min: 2414, max: 3621, rate: 0.03 },
    { min: 3621, max: 4828, rate: 0.035 },
    { min: 4828, max: 6035, rate: 0.04 },
    { min: 6035, max: 7242, rate: 0.045 },
    { min: 7242, max: 8449, rate: 0.05 },
    { min: 8449, max: null, rate: 0.048 },
  ]},
  MT: { type: "progressive", brackets: [
    { min: 0, max: 20500, rate: 0.047 },
    { min: 20500, max: null, rate: 0.059 },
  ]},
  NE: { type: "progressive", brackets: [
    { min: 0, max: 3700, rate: 0.0246 },
    { min: 3700, max: 22170, rate: 0.0351 },
    { min: 22170, max: 35730, rate: 0.0501 },
    { min: 35730, max: null, rate: 0.0584 },
  ]},
  NV: { type: "none" },
  NH: { type: "none" },
  NJ: { type: "progressive", brackets: [
    { min: 0, max: 20000, rate: 0.014 },
    { min: 20000, max: 35000, rate: 0.0175 },
    { min: 35000, max: 40000, rate: 0.035 },
    { min: 40000, max: 75000, rate: 0.05525 },
    { min: 75000, max: 500000, rate: 0.0637 },
    { min: 500000, max: 1000000, rate: 0.0897 },
    { min: 1000000, max: null, rate: 0.1075 },
  ]},
  NM: { type: "progressive", brackets: [
    { min: 0, max: 5500, rate: 0.017 },
    { min: 5500, max: 11000, rate: 0.032 },
    { min: 11000, max: 16000, rate: 0.047 },
    { min: 16000, max: 210000, rate: 0.049 },
    { min: 210000, max: null, rate: 0.059 },
  ]},
  NY: { type: "progressive", brackets: [
    { min: 0, max: 8500, rate: 0.04 },
    { min: 8500, max: 11700, rate: 0.045 },
    { min: 11700, max: 13900, rate: 0.0525 },
    { min: 13900, max: 80650, rate: 0.055 },
    { min: 80650, max: 215400, rate: 0.06 },
    { min: 215400, max: 1077550, rate: 0.0685 },
    { min: 1077550, max: 5000000, rate: 0.0965 },
    { min: 5000000, max: 25000000, rate: 0.103 },
    { min: 25000000, max: null, rate: 0.109 },
  ]},
  NC: { type: "flat", rate: 0.045 },
  ND: { type: "progressive", brackets: [
    { min: 0, max: 44725, rate: 0.0195 },
    { min: 44725, max: null, rate: 0.025 },
  ]},
  OH: { type: "progressive", brackets: [
    { min: 0, max: 26050, rate: 0.0 },
    { min: 26050, max: 100000, rate: 0.02765 },
    { min: 100000, max: null, rate: 0.0354 },
  ]},
  OK: { type: "progressive", brackets: [
    { min: 0, max: 1000, rate: 0.0025 },
    { min: 1000, max: 2500, rate: 0.0075 },
    { min: 2500, max: 3750, rate: 0.0175 },
    { min: 3750, max: 4900, rate: 0.0275 },
    { min: 4900, max: 7200, rate: 0.0375 },
    { min: 7200, max: null, rate: 0.0475 },
  ]},
  OR: { type: "progressive", brackets: [
    { min: 0, max: 4050, rate: 0.0475 },
    { min: 4050, max: 10200, rate: 0.0675 },
    { min: 10200, max: 125000, rate: 0.0875 },
    { min: 125000, max: null, rate: 0.099 },
  ]},
  PA: { type: "flat", rate: 0.0307 },
  RI: { type: "progressive", brackets: [
    { min: 0, max: 73450, rate: 0.0375 },
    { min: 73450, max: 166950, rate: 0.0475 },
    { min: 166950, max: null, rate: 0.0599 },
  ]},
  SC: { type: "progressive", brackets: [
    { min: 0, max: 3460, rate: 0.0 },
    { min: 3460, max: 17330, rate: 0.03 },
    { min: 17330, max: null, rate: 0.064 },
  ]},
  SD: { type: "none" },
  TN: { type: "none" },
  TX: { type: "none" },
  UT: { type: "flat", rate: 0.0465 },
  VT: { type: "progressive", brackets: [
    { min: 0, max: 45400, rate: 0.0335 },
    { min: 45400, max: 110050, rate: 0.066 },
    { min: 110050, max: 229550, rate: 0.076 },
    { min: 229550, max: null, rate: 0.0875 },
  ]},
  VA: { type: "progressive", brackets: [
    { min: 0, max: 3000, rate: 0.02 },
    { min: 3000, max: 5000, rate: 0.03 },
    { min: 5000, max: 17000, rate: 0.05 },
    { min: 17000, max: null, rate: 0.0575 },
  ]},
  WA: { type: "none" },
  WV: { type: "progressive", brackets: [
    { min: 0, max: 10000, rate: 0.0236 },
    { min: 10000, max: 25000, rate: 0.0315 },
    { min: 25000, max: 40000, rate: 0.0354 },
    { min: 40000, max: 60000, rate: 0.0472 },
    { min: 60000, max: null, rate: 0.0512 },
  ]},
  WI: { type: "progressive", brackets: [
    { min: 0, max: 14320, rate: 0.035 },
    { min: 14320, max: 28640, rate: 0.044 },
    { min: 28640, max: 315310, rate: 0.053 },
    { min: 315310, max: null, rate: 0.0765 },
  ]},
  WY: { type: "none" },
  DC: { type: "progressive", brackets: [
    { min: 0, max: 10000, rate: 0.04 },
    { min: 10000, max: 40000, rate: 0.06 },
    { min: 40000, max: 60000, rate: 0.065 },
    { min: 60000, max: 250000, rate: 0.085 },
    { min: 250000, max: 500000, rate: 0.0925 },
    { min: 500000, max: 1000000, rate: 0.0975 },
    { min: 1000000, max: null, rate: 0.1075 },
  ]},
};

export const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

export const filingStatusLabels: Record<FilingStatus, string> = {
  single: "Single",
  married_filing_jointly: "Married Filing Jointly",
  married_filing_separately: "Married Filing Separately",
  head_of_household: "Head of Household",
};

function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const upper = bracket.max !== null ? Math.min(income, bracket.max) : income;
    tax += (upper - bracket.min) * bracket.rate;
  }
  return tax;
}

export function calculateFederalTax(taxableIncome: number, filingStatus: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  return calculateProgressiveTax(taxableIncome, federalBrackets[filingStatus]);
}

export function calculateStateTax(taxableIncome: number, stateCode: string): number {
  if (taxableIncome <= 0) return 0;
  const info = stateTaxData[stateCode];
  if (!info || info.type === "none") return 0;
  if (info.type === "flat") return taxableIncome * (info.rate || 0);
  if (info.type === "progressive" && info.brackets) {
    return calculateProgressiveTax(taxableIncome, info.brackets);
  }
  return 0;
}

export function calculateTotalTax(taxableIncome: number, stateCode: string, filingStatus: FilingStatus) {
  const federal = calculateFederalTax(taxableIncome, filingStatus);
  const state = calculateStateTax(taxableIncome, stateCode);
  return { federal, state, total: federal + state };
}

export function getMarginalFederalRate(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = federalBrackets[filingStatus];
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome > brackets[i].min) return brackets[i].rate;
  }
  return brackets[0].rate;
}

export function getMarginalStateRate(taxableIncome: number, stateCode: string): number {
  const info = stateTaxData[stateCode];
  if (!info || info.type === "none") return 0;
  if (info.type === "flat") return info.rate || 0;
  if (info.type === "progressive" && info.brackets) {
    for (let i = info.brackets.length - 1; i >= 0; i--) {
      if (taxableIncome > info.brackets[i].min) return info.brackets[i].rate;
    }
    return info.brackets[0].rate;
  }
  return 0;
}
