const spec = {
    data: { url: "caffeine.csv" },
    width: 500,
    height: 350,
    mark: "circle",

    selection: {
        genderSel: {
            type: "single",
            fields: ["Gender"],
            bind: {
                input: "select",
                options: [null, "Male", "Female"],
                name: "Gender (All/Male/Female): ",
                element: "genderFilter"
            }
        }
    },

    encoding: {
        x: {
            field: "Caffeine_mg",
            type: "quantitative",
            title: "Caffeine Intake (mg)"
        },
        y: {
            field: "Sleep_Hours",
            type: "quantitative",
            title: "Sleep Duration (hours)"
        },
        color: {
            field: "Gender",
            type: "nominal",
            scale: {
                domain: ["Male", "Female"],
                range: ["#304463", "#E195AB"]
            },
            legend: { title: "Gender" }
        },
        opacity: {
            condition: { selection: "genderSel", value: 1 },
            value: 0.2
        },
        tooltip: [
            { field: "Gender", type: "nominal" },
            { field: "Country", type: "nominal" },
            { field: "Caffeine_mg", type: "quantitative" },
            { field: "Sleep_Hours", type: "quantitative" }
        ]
    }
};

vegaEmbed("#sleepHours", spec);

const sleepQualityStackedSpec = {
    data: { url: "caffeine.csv" },

    mark: "bar",
    width: 500,
    height: 350,

    encoding: {
        x: {
            field: "Caffeine_mg",
            type: "quantitative",
            bin: { step: 100 },
            title: "Caffeine intake (mg, binned)"
        },


        y: {
            aggregate: "count",
            stack: "normalize",
            axis: {
                format: "0%",
                title: "Proportion"
            }
        },

        color: {
            field: "Sleep_Quality",
            type: "nominal",
            title: "Sleep quality",
            sort: ["Poor", "Fair", "Good", "Excellent"]
        },

        tooltip: [
            {
                field: "Caffeine_mg",
                type: "quantitative",
                bin: { step: 100 },
                title: "Caffeine intake (mg, bin)"
            },
            { field: "Sleep_Quality", type: "nominal", title: "Sleep quality" },
            {
                aggregate: "count",
                field: "Sleep_Quality",
                title: "Number of people"
            }
        ]
    }
};

vegaEmbed("#sleepQuality", sleepQualityStackedSpec);

const coffeeByAgeSpec = {
    data: { url: "caffeine.csv" },

    mark: {
        type: "line",
        point: true
    },

    width: 500,
    height: 350,

    encoding: {
        x: {
            field: "Age",
            type: "quantitative",
            bin: { maxbins: 8 },
            title: "Age",
            axis: {
                labelAngle: 0
            }
        },

        y: {
            aggregate: "mean",
            field: "Coffee_Intake",
            type: "quantitative",
            title: "Average coffee intake (cups/day)",
            scale: { domain: [1, 3.5] },
            axis: {
                tickCount: 6,
                format: ".1f"
            }
        },

        color: {
            field: "Gender",
            type: "nominal",
            title: "Gender"
        },

        tooltip: [
            {
                field: "Age",
                type: "quantitative",
                bin: { maxbins: 5 },
                title: "Age group"
            },
            { field: "Gender", type: "nominal" },
            {
                aggregate: "mean",
                field: "Coffee_Intake",
                title: "Avg cups per day",
                format: ".2f"
            },
            {
                aggregate: "count",
                field: "Coffee_Intake",
                title: "Sample size"
            }
        ]
    }
};

vegaEmbed("#coffeeByAge", coffeeByAgeSpec);

const top10CaffeineSpec = {
    data: { url: "caffeine.csv" },

    transform: [
        {
            aggregate: [
                { op: "mean", field: "Caffeine_mg", as: "Avg_Caffeine" }
            ],
            groupby: ["Country"]
        },
        {
            sort: [{ field: "Avg_Caffeine", order: "descending" }],
            window: [{ op: "rank", as: "Rank" }]
        },
        { filter: "datum.Rank <= 10" }
    ],

    mark: {
        type: "point",
        filled: true,
        size: 100
    },

    width: 500,
    height: 350,

    encoding: {
        x: {
            field: "Avg_Caffeine",
            type: "quantitative",
            title: "Average caffeine intake (mg)",
            scale: { domain: [235, 250] },
            axis: { format: "d", tickCount: 7 }
        },

        y: {
            field: "Country",
            type: "nominal",
            sort: "-x",
            title: "Country"
        },

        color: { value: "#4C78A8" },

        tooltip: [
            { field: "Country", type: "nominal" },
            {
                field: "Avg_Caffeine",
                type: "quantitative",
                title: "Avg caffeine (mg)",
                format: ".1f"
            }
        ]
    }
};

vegaEmbed("#top10Caffeine", top10CaffeineSpec);

const bottom10CaffeineSpec = {
    data: { url: "caffeine.csv" },

    transform: [
        {
            aggregate: [
                { op: "mean", field: "Caffeine_mg", as: "Avg_Caffeine" }
            ],
            groupby: ["Country"]
        },
        {
            window: [{ op: "rank", as: "Rank" }],
            sort: [{ field: "Avg_Caffeine", order: "ascending" }]
        },
        { filter: "datum.Rank <= 10" }
    ],

    mark: {
        type: "point",
        filled: true,
        size: 100
    },

    width: 500,
    height: 350,

    encoding: {
        x: {
            field: "Avg_Caffeine",
            type: "quantitative",
            title: "Average caffeine intake (mg)",
            scale: { domain: [225, 240] },
            axis: { format: "d", tickCount: 7 },
            axis: {
                format: "d"
            }
        },

        y: {
            field: "Country",
            type: "nominal",
            sort: "x",
            title: "Country"
        },

        color: { value: "#4C78A8" },

        tooltip: [
            { field: "Country", type: "nominal" },
            {
                field: "Avg_Caffeine",
                type: "quantitative",
                title: "Avg caffeine (mg)",
                format: ".1f"
            }
        ]
    }
};

vegaEmbed("#bottom10Caffeine", bottom10CaffeineSpec);

const stressCoffeeSpec = {
    data: { url: "caffeine.csv" },

    width: 500,
    height: 350,

    layer: [
        {
            mark: "boxplot",
            encoding: {
                x: {
                    field: "Stress_Level",
                    type: "nominal",
                    title: "Stress level",
                    sort: ["Low", "Medium", "High"],
                    axis: {
                        labelAngle: 0
                    }
                },
                y: {
                    field: "Coffee_Intake",
                    type: "quantitative",
                    title: "Coffee intake (cups/day)"
                },
                color: { field: "Stress_Level", type: "nominal" }
            }
        },

        {
            mark: {
                type: "point",
                filled: true,
                opacity: 0.4
            },
            encoding: {
                x: {
                    field: "Stress_Level",
                    type: "nominal",
                    sort: ["Low", "Medium", "High"],
                    offset: { value: 0, band: 0.6 }
                },
                y: {
                    field: "Coffee_Intake",
                    type: "quantitative"
                },
                color: { field: "Stress_Level", type: "nominal" },
                tooltip: [
                    { field: "Stress_Level", type: "nominal" },
                    { field: "Coffee_Intake", type: "quantitative", format: ".1f" },
                    { field: "Age", type: "quantitative" },
                    { field: "Gender", type: "nominal" }
                ]
            }
        }
    ]
};

vegaEmbed("#stressCoffee", stressCoffeeSpec);

const coffeeActivityByAgeSummarySpec = {
    data: { url: "caffeine.csv" },

    transform: [
        {

            calculate:
                "datum.Age < 25 ? '18–24' : datum.Age < 35 ? '25–34' : datum.Age < 45 ? '35–44' : '45+'",
            as: "Age_Group"
        }
    ],


    facet: {
        field: "Age_Group",
        type: "nominal",
        title: "Age group",
        columns: 2
    },


    spec: {
        width: 220,
        height: 180,

        mark: {
            type: "line",
            point: true
        },

        encoding: {

            x: {
                field: "Coffee_Intake",
                type: "quantitative",
                bin: { maxbins: 5 },
                title: "Coffee intake (cups/day, binned)"
            },

            y: {
                aggregate: "mean",
                field: "Physical_Activity_Hours",
                type: "quantitative",
                title: "Avg activity hours",
                format: ".1f"
            },

            color: {
                field: "Gender",
                type: "nominal",
                title: "Gender"
            },

            tooltip: [
                { field: "Age_Group", type: "nominal", title: "Age group" },
                {
                    field: "Coffee_Intake",
                    type: "quantitative",
                    bin: { maxbins: 5 },
                    title: "Coffee intake (binned)"
                },
                { field: "Gender", type: "nominal" },
                {
                    aggregate: "mean",
                    field: "Physical_Activity_Hours",
                    title: "Avg activity hours",
                    format: ".2f"
                },
                {
                    aggregate: "count",
                    field: "Physical_Activity_Hours",
                    title: "Sample size"
                }
            ]
        }
    }
};

vegaEmbed("#coffeeActivityByAgeSummary", coffeeActivityByAgeSummarySpec);

const caffeineOccupationSpec = {
    data: { url: "caffeine.csv" },

    transform: [
        {
            aggregate: [
                { op: "mean", field: "Caffeine_mg", as: "Avg_Caffeine" }
            ],
            groupby: ["Occupation"]
        }
    ],

    mark: {
        type: "point",
        filled: true,
        size: 100
    },

    width: 500,
    height: 350,

    encoding: {
        x: {
            field: "Avg_Caffeine",
            type: "quantitative",
            title: "Average caffeine intake (mg)",
            scale: { domain: [235, 245] },
            axis: {
                format: "d",
                tickCount: 6
            }
        },

        y: {
            field: "Occupation",
            type: "nominal",
            sort: "-x",
            title: "Occupation"
        },

        color: { value: "#4C78A8" },

        tooltip: [
            { field: "Occupation", type: "nominal" },
            {
                field: "Avg_Caffeine",
                type: "quantitative",
                title: "Avg caffeine (mg)",
                format: ".1f"
            }
        ]
    }
};

vegaEmbed("#caffeineOccupation", caffeineOccupationSpec);






