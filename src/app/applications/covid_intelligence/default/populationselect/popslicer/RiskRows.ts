export const RiskRows = [
    { name: "No Specific Vulnerabilities", order: 3 },
    { name: "Social Vulnerabilities", order: 2 },
    { name: "Mental Health", order: 1 },
    { name: "MH and Social Vulnerabilities", order: 0 },
];

export const RiskCols = [
    { name: "No Specific Risk", order: 0 },
    { name: "Single High Risk", order: 1 },
    { name: "Multiple High Risk", order: 2 },
    { name: "Very High Risk", order: 3 },
];

export const CareModelExamples = [
    {
        color: "danger",
        key: ["Very High Risk", "MH and Social Vulnerabilities"],
        interventions: [
            "Health and wellbeing worker assigned",
            "Holistic care planning in partnership with patient (and carer where relevant)",
            "Social prescribing and utilisation of RVS",
            "Proactive care monitoring of LTCs",
            "Remote clinics",
        ],
    },
    {
        color: "warning",
        key: ["Very High Risk", "Social Vulnerabilities"],
        interventions: [
            "Proactive frailty team offer",
            "Care coordinator assigned",
            "Holistic care planning in partnership with patient (and carer where relevant)",
            "Remote clinics",
            "Social prescribing and utilisation of RVS",
        ],
    },
    {
        color: "warning",
        key: ["Very High Risk", "Mental Health"],
        interventions: [
            "Proactive mental health offer",
            "Proactive HCA contact",
            "Health and wellbeing worker assigned",
            "Holistic care planning in partnership with patient (and carer where relevant)",
        ],
    },
    {
        color: "warning",
        key: ["Very High Risk", "No Specific Vulnerabilities"],
        interventions: [
            "Personalised messaging on social distancing and health management" +
                " for specific groups, e.g. cancer, maternity, heart failure, diabetes, etc",
            "Home visits where remote communication is not possible",
            "Virtual peer support to address long term isolation fatigue",
        ],
    },

    {
        color: "warning",
        key: ["Multiple High Risk", "MH and Social Vulnerabilities"],
        interventions: [
            "GP for initial contact, then health and wellbeing worker assigned",
            "Holistic care planning in partnership with patient (and carer where relevant)",
            "MDT proactive approach- incl. relevant clinical specialities and social workers.",
            "Care coordinator to support access and training for remote tech from govt scheme.",
            "Digital care offer",
        ],
    },
    {
        color: "warning",
        key: ["Multiple High Risk", "Social Vulnerabilities"],
        interventions: [
            "GP for initial contact, then care coordinator",
            "Holistic care planning in partnership with patient (and carer where relevant)",
            "Social prescribing and utilisation of RVS",
            "MDT proactive approach-incl. relevant clinical specialities and social workers.",
            "Care coordinator to support access and training for remote tech from government scheme",
            "Digital care offer",
        ],
    },
    {
        color: "warning",
        key: ["Multiple High Risk", "Mental Health"],
        interventions: [
            "GP for initial contact, then health and wellbeing worker assigned.",
            "Holistic care planning in partnership with patient (and carer where relevant)",
            "MDT proactive approach- incl. relevant clinical specialities",
            "Digital care offer",
        ],
    },
    {
        color: "purple",
        key: ["Multiple High Risk", "No Specific Vulnerabilities"],
        interventions: [
            "Remote monitoring of blood pressure, blood sugars, weight, drinking etc",
            "Group consultations for linked LTCs (using Somerset LTP patterns)",
        ],
    },

    {
        color: "warning",
        key: ["Single High Risk", "MH and Social Vulnerabilities"],
        interventions: [
            "Health and wellbeing worker assigned ",
            "Holistic care planning in partnership with patient (and carer where relevant)",
            "Practice Nurse for initial contact, then health and wellbeing worker with MDT",
        ],
    },
    {
        color: "purple",
        key: ["Single High Risk", "Social Vulnerabilities"],
        interventions: [
            "Care coordinator assigned",
            "Holistic care planning in partnership with patient (and carer where relevant)",
            "Practice Nurse for initial contact, then care coordinator with MDT",
        ],
    },
    {
        color: "purple",
        key: ["Single High Risk", "Mental Health"],
        interventions: [
            "Health and wellbeing worker assigned ",
            "Holistic care planning in partnership with patient (and carer where relevant)",
        ],
    },
    {
        key: ["Single High Risk", "No Specific Vulnerabilities"],
        interventions: [
            "Practice nurse check in",
            "Holistic care planning/care plan review",
            "Sign posting to tele health options national/local for particular conditions," +
                " e.g. HelpDiabetes national self management web platform",
        ],
    },

    {
        color: "purple",
        key: ["No Specific Risk", "MH and Social Vulnerabilities"],
        interventions: [
            "Social prescriber assigned to conduct Wellness Call check in, social and practical " +
                "prescribing including food bank access, citizens advice, and broad RVS support",
            "In partnership with link social workers",
        ],
    },
    {
        key: ["No Specific Risk", "Mental Health"],
        interventions: ["National websites, apps and helplines (guided by National MH COVID-19 workstream)"],
    },
    {
        key: ["No Specific Risk", "Social Vulnerabilities"],
        interventions: [
            "Social prescriber assigned to conduct Wellness Call’: check in, social and practical" +
                " prescribing including food bank access, citizens advice, and broad RVS support",
            "In partnership with link social workers",
        ],
    },
    {
        color: "megna",
        key: ["No Specific Risk", "No Specific Vulnerabilities"],
        interventions: ["Whole population messaging on social distancing, health and well-being support and exercise"],
    },
];
