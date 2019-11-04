module.exports = [
  {
    id: 21110,
    name: "21110-Saving Deposits",
    SubTypeId: 21100
  },
  {
    id: 21120,
    name: "21120-Time Deposits",
    SubTypeId: 21100
  },
  {
    id: 21210,
    name: "21210-Accounts Payable-Trade",
    SubTypeId: 21200,
    sub: JSON.stringify({
      subaccounts: [
        {
          name: "A/P-Materials"
        }
      ]
    })
  },
  {
    id: 21220,
    name: "21220-Accounts Payable-Non Trade",
    SubTypeId: 21200,
    sub: JSON.stringify({
      subaccounts: [
        {
          name: "A/P-DARBMUPCO Common"
        },
        {
          name: "A/P-Hospital"
        },
        {
          name: "A/P-Members:Annual Savings"
        },
        {
          name: "A/P-Members:Capital Share Lending Mgt. E"
        },
        {
          name: "A/P-Members:Fertilizers Fund"
        },
        {
          name: "A/P-Members:Expansion"
        }
      ]
    })
  },
  {
    id: 21230,
    name: "21230-Loans Payable-Current",
    SubTypeId: 21200,
    sub: JSON.stringify({
      subaccounts: [
        {
          name: "PBCC"
        }
      ]
    })
  },
  {
    id: 21240,
    name: "21240-Finance Lease Payable-current",
    SubTypeId: 21200
  },
  {
    id: 21250,
    name: "21250-Due to deployed members",
    SubTypeId: 21200
  },
  {
    id: 21260,
    name: "21260-Cash Bond Payable",
    SubTypeId: 21200
  },
  {
    id: 21290,
    name: "21290-Other Payables",
    SubTypeId: 21200,
    sub: JSON.stringify({
      subaccounts: [
        {
          name: "A/P-Aerial"
        },
        {
          name: "A/P-CMC"
        },
        {
          name: "A/P-Packaging"
        },
        {
          name: "A/P-Rice"
        }
      ]
    })
  },
  {
    id: 21310,
    name: "21310-Due to Regulatory Agencies",
    SubTypeId: 21300
  },
  {
    id: 21320,
    name: "21320-SSS/ECC/Philhealth/Pag-ibig Premium Contributions Payable",
    SubTypeId: 21300
  },
  {
    id: 21330,
    name: "21330-SSS/Pag-ibig Loans Payable",
    SubTypeId: 21300
  },
  {
    id: 21340,
    name: "21340-Withholding Tax Payable",
    SubTypeId: 21300
  },
  {
    id: 21350,
    name: "21350-Output Tax",
    SubTypeId: 21300
  },
  {
    id: 21360,
    name: "21360-VAT Payable",
    SubTypeId: 21300
  },
  {
    id: 21370,
    name: "21370-Income Tax Payable",
    SubTypeId: 21300
  },
  {
    id: 21390,
    name: "21390-Other Accrued Expenses",
    SubTypeId: 21300
  },
  {
    id: 21410,
    name: "21410-Deposit from Customers",
    SubTypeId: 21400
  },
  {
    id: 21420,
    name: "21420-Advances from Customers",
    SubTypeId: 21400
  },
  {
    id: 21430,
    name: "21430-School Program Support Fund Payable",
    SubTypeId: 21400
  },
  {
    id: 21440,
    name: "21440-Interest on Share Capital Payable",
    SubTypeId: 21400
  },
  {
    id: 21450,
    name: "21450-Patronage Refund Payable",
    SubTypeId: 21400
  },
  {
    id: 21460,
    name: "21460-Due to Union/Federation(CETF)",
    SubTypeId: 21400
  },
  {
    id: 21490,
    name: "21490-Other Current Liabilities",
    SubTypeId: 21400
  }
]