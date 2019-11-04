module.exports = [
  {
    id: 11110,
    name: "11110-Cash on Hand",
    SubTypeId: 11100
  },
  {
    id: 11120,
    name: "11120-Checks & Other Cash Items",
    SubTypeId: 11100
  },
  {
    id: 11130,
    name: "11130-Cash in Bank",
    SubTypeId: 11100
  },
  {
    id: 11140,
    name: "11140-Cash in Cooperative Federation",
    SubTypeId: 11100
  },
  {
    id: 11150,
    name: "11150-Petty Cash Fund",
    SubTypeId: 11100
  },
  {
    id: 11160,
    name: "11160-Revolving Fund",
    SubTypeId: 11100
  },
  {
    id: 11170,
    name: "11170-Change Fund",
    SubTypeId: 11100
  },
  {
    id: 11180,
    name: "11180-ATM Fund",
    SubTypeId: 11100
  },
  {
    id: 11210,
    name: "11210-Loans Receivable-Current",
    SubTypeId: 11200,
    sub: JSON.stringify({
      subaccounts: [
        { name: "L/R Lending" }
      ]
    })
  },
  {
    id: 11220,
    name: "11220-Loans Receivable-Past Due",
    SubTypeId: 11200
  },
  {
    id: 11230,
    name: "11230-Loans Receivable-Restructured",
    SubTypeId: 11200
  },
  {
    id: 11240,
    name: "11210-Loans Receivable-Loans in Litigation",
    SubTypeId: 11200
  },
  {
    id: 11241,
    name: "11241-Unearned Interests and Discounts",
    SubTypeId: 11200
  },
  {
    id: 11242,
    name: "11242-Allowance for Probable Losses-Loans",
    SubTypeId: 11200
  },
  {
    id: 11250,
    name: "11250-Accounts Receivables Trade-Current",
    SubTypeId: 11200,
    sub: JSON.stringify({
      subaccounts: [
        {
          name: "DOLE Packaging"
        },
        {
          name: "A/R-Collectibles from Com(DL)"
        },
        {
          name: "A/R-Collectibles from Common"
        },
        {
          name: "A/R-Collectibles from Mgt. B"
        },
        {
          name: "A/R-Members",
          sub: [
            {
              name: "Buffer Area Rental"
            },
            {
              name: "Cash Advance"
            },
            {
              name: "DOLE Loan"
            },
            {
              name: "Hospital"
            },
            {
              name: "ITR & Bookkeeping Fee"
            },
            {
              name: "Light & Power"
            },
            {
              name: "Materials"
            },
            {
              name: "OHCP"
            },
            {
              name: "Paramount Insurance"
            },
            {
              name: "Spinny Bamboo"
            }
          ]
        },
        {
          name: "A/R-Mgt-B Charges(Old Acct.)",
          sub: [
            {
              name: "A/R-Cash Advance"
            },
            {
              name: "A/R-Housing"
            },
            {
              name: "A/R-P.O."
            },
            {
              name: "A/R-Savings Loan"
            }
          ]
        },
        {
          name: "A/R-Payroll/Honorarium Loan"
        }
      ]
    })
  },
  {
    id: 11270,
    name: "11270-Accounts Receivables Trade-Restructured",
    SubTypeId: 11200
  },
  {
    id: 11280,
    name: "11280-Accounts Receivables Trade-in Litigation",
    SubTypeId: 11200
  },
  {
    id: 11281,
    name: "11281-Allowance for Probable Losses-Accounts Receivable Trade",
    SubTypeId: 11200
  },
  {
    id: 11290,
    name: "11290-Installment Receivables-Current",
    SubTypeId: 11200
  },
  {
    id: 11300,
    name: "11300-Installment Receivables-Past Due",
    SubTypeId: 11200
  },
  {
    id: 11310,
    name: "11310-Installment Receivables-Restructured",
    SubTypeId: 11200
  },
  {
    id: 11320,
    name: "11320-Installment Receivables-in Litigation",
    SubTypeId: 11200
  },
  {
    id: 11321,
    name: "11321-Allowance for Probable Losses-Installment Receivables",
    SubTypeId: 11200
  },
  {
    id: 11322,
    name: "11322-Unrealized Gross Margin",
    SubTypeId: 11200
  },
  {
    id: 11330,
    name: "11330-Sales Contract Receivable",
    SubTypeId: 11200
  },
  {
    id: 11331,
    name: "11331-Allowance for Probable Losses-Sales Contract",
    SubTypeId: 11200
  },
  {
    id: 11340,
    name: "11340-Accounts Receivable-Non Trade",
    SubTypeId: 11200
  },
  {
    id: 11341,
    name: "11341-Allowance for Probable Losses-Accounts Receivable-Non Trade",
    SubTypeId: 11200
  },
  {
    id: 11350,
    name: "11350-Advances to Officers, Employees and Members",
    SubTypeId: 11200
  },
  {
    id: 11370,
    name: "11370-Financial Lease Receivable",
    SubTypeId: 11200
  },
  {
    id: 11371,
    name: "11371-Allowance for Impairment-Finance Lease Receivable",
    SubTypeId: 11200
  },
  {
    id: 11380,
    name: "11380-Other Current Receivables",
    SubTypeId: 11200,
    sub: JSON.stringify({
      subaccounts: [
        {
          name: "A/R-Miscellaneous"
        },
        {
          name: "A/R-Collective T-shirt"
        }
      ]
    })
  },
  {
    id: 11410,
    name: "11410-Financial at fair value through profit or loss",
    SubTypeId: 11400
  },
  {
    id: 11420,
    name: "11420-Financial asset at cost",
    SubTypeId: 11400
  },
  {
    id: 11510,
    name: "11510-Merchandise Inventory",
    SubTypeId: 11500
  },
  {
    id: 11520,
    name: "11520-Repossessed Inventory",
    SubTypeId: 11500
  },
  {
    id: 11530,
    name: "11530-Spare Parts/Materials & Other Goods Inventory",
    SubTypeId: 11500
  },
  {
    id: 11540,
    name: "11540-Raw Materials Inventory",
    SubTypeId: 11500
  },
  {
    id: 11550,
    name: "11550-Work in Process Inventory",
    SubTypeId: 11500
  },
  {
    id: 11560,
    name: "11560-Finished Goods Inventory",
    SubTypeId: 11500
  },
  {
    id: 11570,
    name: "11570-Inventory-Agricultural Produce",
    SubTypeId: 11500
  },
  {
    id: 11580,
    name: "11580-Equipment for Lease Inventory",
    SubTypeId: 11500
  },
  {
    id: 11590,
    name: "11590-Allowance for impairment-Inventory",
    SubTypeId: 11500
  },
  {
    id: 11600,
    name: "11600-Biological Assets-Current",
    SubTypeId: 11600
  },
  {
    id: 12110,
    name: "12110-Input Tax",
    SubTypeId: 12000
  },
  {
    id: 12120,
    name: "12120-Creditable Vat",
    SubTypeId: 12000
  },
  {
    id: 12130,
    name: "12130-Creditable Withholding Tax",
    SubTypeId: 12000
  },
  {
    id: 12140,
    name: "12140-Deposit to Suppliers",
    SubTypeId: 12000
  },
  {
    id: 12150,
    name: "12150-Unused Supplies",
    SubTypeId: 12000
  },
  {
    id: 12160,
    name: "12160-Assets Acquired in Settlements of Loans/Accounts",
    SubTypeId: 12000
  },
  {
    id: 12161,
    name: "12161-Accumulated Depreciation and Impairment-Assets Acquired in Settlement of Loans/Accounts",
    SubTypeId: 12000
  },
  {
    id: 12170,
    name: "12170-Prepaid Expenses",
    SubTypeId: 12000
  }
]