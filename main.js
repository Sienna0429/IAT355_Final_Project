const spec = {
    data: { url: "caffeine.csv" },
    width: 800,
    height: 650,
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
    width: 800,
    height: 650,

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
            sort: ["Poor", "Fair", "Good", "Excellent"],
            scale: {
                range: ["#614033", "#F0DEBB", "#BE9757", "#D26946"]
            }
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

    width: 800,
    height: 650,

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

    width: 800,
    height: 650,

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

    width: 800,
    height: 650,

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

    width: 800,
    height: 650,

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
                color: {
                    field: "Stress_Level",
                    type: "nominal",
                    scale: {
                        range: ["#4C3932", "#183348", "#7A2E21"]
                    }
                },
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
        width: 320,
        height: 280,

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

    width: 800,
    height: 650,

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

const coffeeReasonsSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",

    // background: "#FDE9D8",

    data: {
        values: [
            { Reason: "Enjoys the Taste", Percent: 83.1 },
            { Reason: "Increases Energy", Percent: 67.1 },
            { Reason: "Increases Productivity", Percent: 42.7 },
            { Reason: "Healthy", Percent: 28.5 },
            { Reason: "Suppresses Appetite", Percent: 20.2 },
            { Reason: "Others", Percent: 10.0 },
            { Reason: "None of the Above", Percent: 1.6 }
        ]
    },

    transform: [
        {
            calculate: "datum.Percent + '%'",
            as: "Percent_Label"
        }
    ],

    width: 600,
    height: 260,

    // title: {
    //     text: "Top Reasons for Drinking Coffee",
    //     anchor: "start",
    //     fontSize: 24,
    //     color: "#4A2B18",
    //     fontWeight: "bold",
    //     dy: -10
    // },

    layer: [
        {
            mark: {
                type: "bar",
                cornerRadius: 3
            },
            encoding: {
                y: {
                    field: "Reason",
                    type: "nominal",
                    sort: "-x",
                    title: null,
                    axis: {
                        labelFontSize: 13,
                        labelColor: "#4A2B18"
                    }
                },
                x: {
                    field: "Percent",
                    type: "quantitative",
                    title: null,
                    axis: {
                        grid: false,
                        ticks: false,
                        labels: false
                    }
                },
                color: {
                    value: "#362822"
                },
                tooltip: [
                    { field: "Reason", title: "Reason" },
                    { field: "Percent", title: "Percent", format: ".1f" }
                ]
            }
        },

        {
            mark: {
                type: "text",
                align: "left",
                baseline: "middle",
                dx: 5,
                fontSize: 12,
                color: "#362822"
            },
            encoding: {
                y: {
                    field: "Reason",
                    type: "nominal",
                    sort: "-x",
                    axis: {
                        labelFontSize: 13,
                        labelColor: "#4A2B18",
                        labelPadding: 15
                    }
                },
                x: {
                    field: "Percent",
                    type: "quantitative"
                },
                text: {
                    field: "Percent_Label",
                    type: "nominal"
                }
            }
        }
    ],

    config: {
        view: { stroke: null },
        axis: {
            domain: false,
            grid: false,
            ticks: false
        }
    }

};

vegaEmbed("#chart_coffee_reasons", coffeeReasonsSpec);








