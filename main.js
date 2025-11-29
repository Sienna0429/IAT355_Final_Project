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
                range: ["#362822", "#F0C376"]
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

// const sleepQualityStackedSpec = {
//     data: { url: "caffeine.csv" },

//     mark: "bar",
//     width: 800,
//     height: 650,

//     encoding: {
//         x: {
//             field: "Caffeine_mg",
//             type: "quantitative",
//             bin: { step: 100 },
//             title: "Caffeine intake (mg, binned)"
//         },


//         y: {
//             aggregate: "count",
//             stack: "normalize",
//             axis: {
//                 format: "0%",
//                 title: "Proportion"
//             }
//         },

//         color: {
//             field: "Sleep_Quality",
//             type: "nominal",
//             title: "Sleep quality",
//             sort: ["Poor", "Fair", "Good", "Excellent"],
//             scale: {
//                 range: ["#614033", "#F0DEBB", "#BE9757", "#D26946"]
//             }
//         },

//         tooltip: [
//             {
//                 field: "Caffeine_mg",
//                 type: "quantitative",
//                 bin: { step: 100 },
//                 title: "Caffeine intake (mg, bin)"
//             },
//             { field: "Sleep_Quality", type: "nominal", title: "Sleep quality" },
//             {
//                 aggregate: "count",
//                 field: "Sleep_Quality",
//                 title: "Number of people"
//             }
//         ]
//     }
// };

// vegaEmbed("#sleepQuality", sleepQualityStackedSpec);

const sleepQualityHeatmapSpec = {
    data: { url: "caffeine.csv" },

    width: 800,
    height: { step: 100 },

    transform: [

        {
            bin: { step: 100 },
            field: "Caffeine_mg",
            as: ["Caffeine_bin", "Caffeine_bin_end"]
        },


        {
            aggregate: [
                { op: "count", as: "count" }
            ],
            groupby: ["Caffeine_bin", "Caffeine_bin_end", "Sleep_Quality"]
        },


        {
            joinaggregate: [
                { op: "sum", field: "count", as: "bin_total" }
            ],
            groupby: ["Caffeine_bin", "Caffeine_bin_end"]
        },


        {
            calculate: "datum.count / datum.bin_total",
            as: "Proportion"
        }
    ],

    mark: "rect",

    encoding: {

        x: {
            field: "Caffeine_bin",
            type: "quantitative",
            bin: { binned: true, step: 100 },
            title: "Caffeine intake (mg, binned)"
        },
        x2: { field: "Caffeine_bin_end" },


        y: {
            field: "Sleep_Quality",
            type: "nominal",
            sort: ["Poor", "Fair", "Good", "Excellent"],
            title: "Sleep quality"
        },


        color: {
            field: "Proportion",
            type: "quantitative",
            title: "Proportion",
            axis: { format: "0%" },
            scale: {
                range: ["#F8EBD8", "#BF9B77", "#362822"]
            }
        },

        tooltip: [
            { field: "Caffeine_bin", title: "Caffeine mg (bin start)" },
            { field: "Caffeine_bin_end", title: "Caffeine mg (bin end)" },
            { field: "Sleep_Quality", title: "Sleep quality" },
            {
                field: "Proportion",
                title: "Proportion",
                format: "0.0%"
            },
            { field: "count", title: "Number of people" }
        ]
    },

    config: {
        view: { stroke: null },
        axis: {
            labelFont: "Helvetica",
            titleFont: "Helvetica"
        }
    }
};

vegaEmbed("#sleepQuality", sleepQualityHeatmapSpec);

const sleepQualityJitterSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",

    data: { url: "caffeine.csv" },

    width: 900,
    height: 700,

    transform: [
        {
            calculate: "(random() - 0.5) * 14",
            as: "jitter"
        }
    ],

    mark: {
        type: "circle",
        opacity: 0.4,
        size: 35
    },

    encoding: {
        x: {
            field: "Caffeine_mg",
            type: "quantitative",
            title: "Caffeine intake (mg)"
        },

        y: {
            field: "Sleep_Quality",
            type: "nominal",
            sort: ["Poor", "Fair", "Good", "Excellent"],
            title: "Sleep quality"
        },

        yOffset: {
            field: "jitter",
            type: "quantitative"
        },

        color: {
            field: "Sleep_Quality",
            type: "nominal",
            sort: ["Poor", "Fair", "Good", "Excellent"],
            scale: {
                range: ["#614033", "#F0DEBB", "#BE9757", "#D26946"]
            },
            title: "Sleep quality"
        },

        tooltip: [
            { field: "Caffeine_mg", type: "quantitative", title: "Caffeine (mg)" },
            { field: "Sleep_Quality", type: "nominal", title: "Sleep quality" }
        ]
    },

    config: {
        view: { stroke: null },
        axis: {
            labelFont: "Helvetica",
            titleFont: "Helvetica"
        }
    }
};

vegaEmbed("#sleepQualityScatter", sleepQualityJitterSpec);



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
            mark: {
                type: "boxplot",
                size: 60
            },
            encoding: {
                x: {
                    field: "Stress_Level",
                    type: "nominal",
                    sort: ["Low", "Medium", "High"],
                    title: "Stress level",
                    axis: { labelAngle: 0 }

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
                opacity: 0.4,
                size: 20
            },
            encoding: {
                x: {
                    field: "Stress_Level",
                    type: "nominal",
                    sort: ["Low", "Medium", "High"],
                    title: "Stress level",
                    axis: { labelAngle: 0 },
                    scale: {
                        bandPaddingInner: 0.1
                    }
                },

                y: {
                    field: "Coffee_Intake",
                    type: "quantitative"
                },
                color: {
                    field: "Stress_Level",
                    type: "nominal",
                    scale: {
                        range: ["#F0C376", "#183348", "#7A2E21"]
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

    width: 800,
    height: { step: 48 },

    // title: {
    //     text: "Top Reasons for Drinking Coffee",
    //     anchor: "start",
    //     fontSize: 24,
    //     color: "#362822",
    //     fontWeight: "normal",
    //     dy: -20
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
                        labelFontSize: 14,
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
                    value: "#F0C376"
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


const coffeeSideEffectsSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",

    description: "Coffee Side Effects",

    data: {
        values: [
            { Effect: "None", Percent: 60.8 },
            { Effect: "Jittery or Shaking", Percent: 17.0 },
            { Effect: "Difficulty Sleeping", Percent: 16.5 },
            { Effect: "Headache", Percent: 11.5 },
            { Effect: "Fast Heartbeat", Percent: 10.5 },
            { Effect: "\"Jolt and Crash\" Episodes", Percent: 9.7 },
            { Effect: "Nausea, Vomiting, or Diarrhea", Percent: 5.1 },
            { Effect: "Chest Pain", Percent: 1.7 },
            { Effect: "Other", Percent: 1.5 },
            { Effect: "Dental Pain", Percent: 0.8 },
            { Effect: "Decreased Sexual Performance", Percent: 0.3 },
            { Effect: "Seizures", Percent: 0.2 },
            { Effect: "Don't Know, Refuse to Answer", Percent: 2.9 }
        ]
    },

    transform: [
        { calculate: "datum.Percent + '%'", as: "Percent_Label" }
    ],

    width: 650,
    height: { step: 28 },

    title: {
        text: "Coffee Side Effects",
        anchor: "start",
        fontSize: 24,
        color: "#362822",
        fontWeight: "normal",
        dy: -20
    },

    layer: [

        {
            mark: {
                type: "bar",
                cornerRadius: 3,
            },
            encoding: {
                y: {
                    field: "Effect",
                    type: "nominal",
                    sort: "-x",
                    axis: {
                        title: null,
                        labelFontSize: 12,
                        labelColor: "#362822",
                        labelPadding: 8
                    }
                },
                x: {
                    field: "Percent",
                    type: "quantitative",
                    axis: null
                    // {
                    //     title: "Percentage of People",
                    //     titleColor: "#362822",
                    //     titleFontSize: 12,
                    //     labels: false,
                    //     ticks: false,
                    //     grid: false,
                    //     domain: false
                    // }
                },
                color: { value: "#362822" },
                tooltip: [
                    { field: "Effect", title: "Side Effect" },
                    { field: "Percent", title: "Percentage", format: ".1f" }
                ]
            }
        },


        {
            mark: {
                type: "text",
                align: "left",
                baseline: "middle",
                dx: 5,
                fontSize: 11,
                color: "#362822"
            },
            encoding: {
                y: { field: "Effect", type: "nominal", sort: "-x" },
                x: { field: "Percent", type: "quantitative" },
                text: { field: "Percent_Label" }
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


vegaEmbed("#coffeeSideEffects", coffeeSideEffectsSpec);






