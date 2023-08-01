import { SQuery } from "..";
import { ID_ENTREPRISE } from "../../constants/data";

type SchemaStateEntreprise = {
  success: boolean;
  loading: boolean;
  rates: { [str: string]: number };
  serviceCharge: number;
};

const fetchDataEntreprise = async () => {
  const entrepriseInstance = await SQuery.newInstance("entreprise", {
    id: ID_ENTREPRISE,
  });

  if (!entrepriseInstance) throw new Error("Entreprise not found");

  return {
    ...entrepriseInstance.$cache,
  };
};

export { fetchDataEntreprise };
