

# Add State Tax Logic and Interactive Tax Savings Calculator (2025 Brackets)

## Overview
Enhance the assessment wizard to collect state of residence and filing status, then transform the Recommendations page into an interactive tax savings calculator. Users will enter dollar amounts for each recommended strategy and see real-time calculations of federal and state tax savings, including progressive bracket recalculation as income decreases.

---

## 1. Add State of Residence and Filing Status to Assessment

**File: `src/pages/Assessment.tsx`**
- Add `state` field (dropdown with all 50 states + DC) to step 1
- Add `filingStatus` field ("Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household") to step 1
- Update `AssessmentData` interface with these new fields

---

## 2. Create Tax Rate Data Module

**New file: `src/data/taxRates.ts`**

### 2025 Federal Tax Brackets (per IRS Revenue Procedure 2024-40)

**Single:**
| Rate | Income Range |
|------|-------------|
| 10% | $0 - $11,925 |
| 12% | $11,926 - $48,475 |
| 22% | $48,476 - $103,350 |
| 24% | $103,351 - $197,300 |
| 32% | $197,301 - $250,525 |
| 35% | $250,526 - $626,350 |
| 37% | Over $626,350 |

**Married Filing Jointly:**
| Rate | Income Range |
|------|-------------|
| 10% | $0 - $23,850 |
| 12% | $23,851 - $96,950 |
| 22% | $96,951 - $206,700 |
| 24% | $206,701 - $394,600 |
| 32% | $394,601 - $501,050 |
| 35% | $501,051 - $751,600 |
| 37% | Over $751,600 |

**Head of Household:**
| Rate | Income Range |
|------|-------------|
| 10% | $0 - $17,000 |
| 12% | $17,001 - $64,850 |
| 22% | $64,851 - $103,350 |
| 24% | $103,351 - $197,300 |
| 32% | $197,301 - $250,500 |
| 35% | $250,501 - $626,350 |
| 37% | Over $626,350 |

**2025 Standard Deductions:**
- Single: $15,000
- Married Filing Jointly: $30,000
- Married Filing Separately: $15,000
- Head of Household: $22,500

### State Tax Data
- States with no income tax (FL, TX, NV, WA, WY, SD, AK, TN, NH)
- Flat-rate states (e.g., IL 4.95%, CO 4.4%, IN 3.05%)
- Progressive-rate states with bracket data (e.g., CA up to 13.3%, NY up to 10.9%, NJ up to 10.75%)
- State estate/inheritance tax thresholds for the 12 states + DC that have them

### Helper Functions
- `calculateFederalTax(taxableIncome, filingStatus)` -- walks brackets progressively
- `calculateStateTax(taxableIncome, state, filingStatus)` -- uses state-specific brackets/rates
- `calculateTotalTax(taxableIncome, state, filingStatus)` -- combined federal + state

---

## 3. Add Deduction Type Metadata to Each Strategy

**File: `src/data/estatePlanningElements.ts`**

Add new fields to `EstatePlanningElement`:
- `deductionType`: `"income_deduction" | "estate_reduction" | "tax_credit" | "tax_deferred" | "none"` -- determines how dollar input reduces taxes
- `deductionPercentage`: optional (e.g., charitable gift annuity gives ~40% deduction)
- `maxContribution`: optional (e.g., 401k max $23,500 for 2025)

How each type works:
- **income_deduction**: Directly reduces taxable income (e.g., DAF, SEP IRA, 401k)
- **estate_reduction**: Reduces taxable estate, not income (e.g., GRAT, FLP)
- **tax_credit**: Dollar-for-dollar tax reduction
- **tax_deferred**: Defers taxes, shown differently in UI
- **none**: No direct tax impact (e.g., asset protection strategies)

---

## 4. Redesign Recommendations Page with Tax Calculator

**File: `src/pages/Recommendations.tsx`** (major rewrite)

### Top Summary Section
- Show user's state, filing status, and income
- "Current Tax Situation" card showing federal tax, state tax, and total tax before any strategies

### Strategy Cards with Dollar Input
Each recommendation card includes:
- Dollar input field for allocation amount
- Max contribution hint (if applicable)
- Real-time display of tax savings for that individual strategy
- Deduction type badge

### Real-Time Tax Recalculation Logic
When dollar amounts are entered:
1. Start with user's gross income (midpoint of range from assessment)
2. Apply standard deduction (or switch to itemized if charitable strategies are used)
3. Calculate baseline federal + state tax
4. Subtract all income-deduction strategy amounts from taxable income
5. Recalculate federal + state tax on reduced income using progressive brackets
6. As income drops into lower brackets, marginal rate changes are properly reflected
7. Show the difference as savings

### Bottom Summary Dashboard
Prominent comparison section:
- **Before Strategies**: Total federal + state tax
- **After Strategies**: Recalculated federal + state tax
- **Total Tax Savings**: The difference
- **Effective Tax Rate**: Before and after percentages
- Visual bar chart comparing before/after (using existing recharts dependency)

### Deduction Limits and Considerations
- Standard deduction vs. itemized (charitable strategies trigger itemization)
- Charitable deductions capped at 60% of AGI for cash, 30% for appreciated assets
- Retirement contribution limits shown as max on inputs
- SALT deduction cap ($10,000) noted where relevant

---

## 5. Optional Exact Income Input

On the Recommendations page, provide an optional exact income input so users can refine their numbers beyond the assessment range. The range midpoint is the default.

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/pages/Assessment.tsx` | Add state dropdown, filing status selector |
| `src/data/estatePlanningElements.ts` | Add deductionType, deductionPercentage, maxContribution fields to each element |
| `src/data/taxRates.ts` | New file -- 2025 federal brackets, state tax data, calculation functions |
| `src/pages/Recommendations.tsx` | Major rewrite -- dollar inputs, real-time tax calc, before/after dashboard |

No new dependencies needed. All calculation logic is pure TypeScript, and recharts (already installed) will be used for the before/after visualization.

