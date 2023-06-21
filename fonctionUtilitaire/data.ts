export const data = [
  {
    title: "Total Received",
    montant: 588,
    color: "#28b",
  },
  {
    title: "Total Send",
    montant: 18930,
    color: "#a14",
  },
];
export type transactionShema = {
  picUser: string;
  name: string;
  status: string;
  date: string;
  montant: number;
};
export const dataTransactions = [
  {
    picUser: "",
    name: "Dagobert",
    status: "in Wait",
    date: "Aujourd'hui,14h58",
    montant: 220000,
  },
  {
    picUser: "",
    name: "Dagobert",
    status: "in Wait",
    date: "Aujourd'hui , 14h58",
    montant: 220000,
  },
  {
    picUser: "",
    name: "Dagobert",
    status: "in Progress",
    date: "Aujourd'hui , 14h58",
    montant: 220000,
  },
  {
    picUser: "",
    name: "Dagobert",
    status: "Success",
    date: "Aujourd'hui , 14h58",
    montant: 220000,
  },
  {
    picUser: "",
    name: "Dagobert",
    status: "in Wait",
    date: "Aujourd'hui , 14h58",
    montant: 220000,
  },
  {
    picUser: "",
    name: "Jean",
    date: "15 april 2021",
    status: "in Progress",
    montant: 1582000,
  },
  {
    picUser: "",
    name: "Pedri",
    status: "Success",
    date: "05 septembre 2023",
    montant: 14000,
  },
  {
    picUser: "",
    name: "Zadi francois",
    date: "15 may 2022",
    status: "Fail",
    montant: 22874000,
  },
];

export const normeFormat = {
  RU: {
    name: "Russia",
    digit: "10",
    indicatif: "7",
    flag: require("../assets/images/russia.png"),
    currency: "RUB",
  },
  CI: {
    name: "Ivory Coast",
    digit: "10",
    indicatif: "225",
    flag: require("../assets/images/ivory-coast.png"),
    currency: "XOF",
  },
  BE: {
    name: "Mali",
    digit: "8",
    indicatif: "229",
    flag: require("../assets/images/mali.png"),
    currency: "XOF",
  },
  TG: {
    name: "Togo",
    digit: "8",
    indicatif: "228",
    flag: require("../assets/images/togo.png"),
    currency: "XOF",
  },
  CM: {
    name: "Cameroon",
    digit: "9",
    indicatif: "237",
    flag: require("../assets/images/cameroon.png"),
    currency: "XOF",
  },
  RDC: {
    name: "Republic of the Congo",
    digit: "9",
    indicatif: "242",
    flag: require("../assets/images/republic-of-the-congo.png"),
    currency: "XOF",
  },
  "": {
    name: "N/A",
    digit: "99",
    indicatif: "O",
    flag: require("../assets/images/delete.png"),
    currency: "XOF",
  },
  // ZZ: {
  //   name: "N/A",
  //   digit: "",
  //   indicatif: "0",
  //   flag: require("../assets/images/delete.png"),
  // },
};

export const AGENCE = {
  S1: ["MTN MONEY"],
  S2: ["ORANGE MONEY", "MTN MONEY", "WAVE"],
  S3: ["ORANGE MONEY"],
};

export const CURRENCY_CHANGE = {
  RUBtoXOF: 7.8,
  XOFtoRUB: 0.13,
  x: 1,
};
