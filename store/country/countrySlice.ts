import { SQuery } from "..";
import { ID_ENTREPRISE } from "../../constants/data";

export type Agency = {
  id: string;
  name: string;
  icon: string;
  number: string;
  managerName: string;
  charge: number;
};

type SchemaStateCountry = {
  [countryId: string]: {
    agency: Agency[];
    id: string;
    name: string;
    icon: string;
    charge: number;
    currency: string;
    indicatif: string;
    digit: string;
  };
} & {
  success: boolean;
  loading: boolean;
};
//@ts-ignore
let initialState: SchemaStateCountry = {};

const getAgencies = async ({ countryId }: { countryId: string }) => {
  if (!countryId) throw new Error("Id countryId not provided");
  const country = await SQuery.newInstance("country", {
    id: countryId,
  });
  if (!country) throw new Error("Country not found");

  const agencies = await country?.agencies;
  // agencies.
  if (!agencies) throw new Error("Agencies not found");
  let ArrayData = await agencies?.update({});

  return ArrayData?.items || [];
};

const getCountries = async () => {
  const entrepriseInstance = await SQuery.newInstance("entreprise", {
    id: ID_ENTREPRISE,
  });

  if (!entrepriseInstance) throw new Error("Entreprise not found");

  let countriesArray = await entrepriseInstance?.countries;

  let ArrayData = await countriesArray?.update({});
  return ArrayData?.items;
};

export { getAgencies, getCountries };
