import { type Product, type Property, type Operator } from "../types";
import cometData from "./nearEarthComets.json";

declare global {
  interface Window {
    datastore: {
      getProducts: () => Product[];
      getProperties: () => Property[];
      getOperators: () => Operator[];
      products: Product[];
      properties: Property[];
      operators: Operator[];
    };
  }
}

// Transform comet orbital data into our Product structure
function transformCometData(): Product[] {
  return cometData.map((comet, index) => {
    const name = comet.object;
    const period = parseFloat(comet.p_yr);
    const eccentricity = parseFloat(comet.e);
    const perihelionDistance = parseFloat(comet.q_au_1);
    const aphelionDistance = parseFloat(comet.q_au_2);
    const inclination = parseFloat(comet.i_deg);
    const earthApproachDistance = parseFloat(comet.moid_au);

    // Categorize by period
    const periodType = period < 20 ? "Short Period" : "Long Period";

    // Categorize by eccentricity (orbit shape)
    let orbitShape: string;
    if (eccentricity < 0.3) orbitShape = "Nearly Circular";
    else if (eccentricity < 0.7) orbitShape = "Elliptical";
    else if (eccentricity < 0.9) orbitShape = "Highly Elliptical";
    else orbitShape = "Nearly Parabolic";

    // Categorize by Earth approach distance (safety classification)
    let approachCategory: string;
    if (earthApproachDistance < 0.05) approachCategory = "Very Close";
    else if (earthApproachDistance < 0.2) approachCategory = "Close";
    else if (earthApproachDistance < 0.5) approachCategory = "Moderate";
    else approachCategory = "Distant";

    // Determine if it's a famous/well-known comet
    const famousComets = [
      "1P/Halley",
      "2P/Encke",
      "55P/Tempel-Tuttle",
      "67P/Churyumov-Gerasimenko",
    ];
    const isFamous = famousComets.some((famous) =>
      name.includes(famous.split("/")[1]?.split(" ")[0] || famous),
    );

    return {
      id: index,
      property_values: [
        {
          property_id: 0,
          value: name,
        },
        {
          property_id: 1,
          value: periodType,
        },
        {
          property_id: 2,
          value: Math.round(period * 100) / 100, // Round to 2 decimal places
        },
        {
          property_id: 3,
          value: Math.round(eccentricity * 1000) / 1000, // Round to 3 decimal places
        },
        {
          property_id: 4,
          value: orbitShape,
        },
        {
          property_id: 5,
          value: Math.round(perihelionDistance * 100) / 100,
        },
        {
          property_id: 6,
          value: Math.round(aphelionDistance * 100) / 100,
        },
        {
          property_id: 7,
          value: Math.round(inclination * 10) / 10,
        },
        {
          property_id: 8,
          value: Math.round(earthApproachDistance * 1000) / 1000,
        },
        {
          property_id: 9,
          value: approachCategory,
        },
        {
          property_id: 10,
          value: isFamous ? "Famous" : "Other",
        },
      ],
    };
  });
}

const cometProducts = transformCometData();

window.datastore = {
  getProducts: function () {
    return this.products;
  },

  getProperties: function () {
    return this.properties;
  },

  getOperators: function () {
    return this.operators;
  },

  products: cometProducts,

  properties: [
    {
      id: 0,
      name: "Comet Name",
      type: "string",
    },
    {
      id: 1,
      name: "Period Type",
      type: "enumerated",
      values: ["Short Period", "Long Period"],
    },
    {
      id: 2,
      name: "Orbital Period (years)",
      type: "number",
    },
    {
      id: 3,
      name: "Eccentricity",
      type: "number",
    },
    {
      id: 4,
      name: "Orbit Shape",
      type: "enumerated",
      values: [
        "Nearly Circular",
        "Elliptical",
        "Highly Elliptical",
        "Nearly Parabolic",
      ],
    },
    {
      id: 5,
      name: "Perihelion Distance (AU)",
      type: "number",
    },
    {
      id: 6,
      name: "Aphelion Distance (AU)",
      type: "number",
    },
    {
      id: 7,
      name: "Orbital Inclination (degrees)",
      type: "number",
    },
    {
      id: 8,
      name: "Earth Approach Distance (AU)",
      type: "number",
    },
    {
      id: 9,
      name: "Approach Category",
      type: "enumerated",
      values: ["Very Close", "Close", "Moderate", "Distant"],
    },
    {
      id: 10,
      name: "Fame Status",
      type: "enumerated",
      values: ["Famous", "Other"],
    },
  ],

  operators: [
    {
      text: "Equals",
      id: "equals",
    },
    {
      text: "Is greater than",
      id: "greater_than",
    },
    {
      text: "Is less than",
      id: "less_than",
    },
    {
      text: "Has any value",
      id: "any",
    },
    {
      text: "Has no value",
      id: "none",
    },
    {
      text: "Is any of",
      id: "in",
    },
    {
      text: "Contains",
      id: "contains",
    },
  ],
};
