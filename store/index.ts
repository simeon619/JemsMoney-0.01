import createSQueryFrom from "../lib/SQueryClient";
import { CacheValues, Controller, Descriptions } from "./Descriptions";

export const SQuery = createSQueryFrom(
  "http://localhost:3001",
  Descriptions,
  CacheValues,
  Controller
);

export const Queries_Key = {
  user: "user",
  transaction: "transaction",
  account: "account",
  discussion: "discussion",
  entreprise: "entreprise",
  countries: "countries",
  agencies: "agencies",
  message: "message",
};
