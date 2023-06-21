import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { ID_ENTREPRISE } from "../../constants/data";
import SQuery from "../../lib/SQueryClient";
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

const createAgency = async ({ agencyId }: { agencyId: string }) => {
  const agencyInstance = await SQuery.newInstance("agence", {
    id: agencyId,
  });
  let id = await agencyInstance?._id;
  let name = await agencyInstance?.name;
  let icon = await agencyInstance?.icon;
  let charge = await agencyInstance?.charge;
  let managerName = await agencyInstance?.managerName;
  let number = await agencyInstance?.number;

  return {
    id,
    name,
    icon,
    charge,
    managerName,
    number,
  };
};

const createCountry = async ({ countryId }: { countryId: string }) => {
  const countryInstance = await SQuery.newInstance("country", {
    id: countryId,
  });

  let id = await countryInstance?._id;
  let name = await countryInstance?.name;
  let currency = await countryInstance?.currency;
  let digit = await countryInstance?.digit;
  let indicatif = await countryInstance?.indicatif;
  let icon = await countryInstance?.icon;
  let charge = await countryInstance?.charge;
  let agenciesArray = await countryInstance?.agencies;
  let promiseAgencies = (await agenciesArray.page()).items.map(
    (agency: any) => {
      return new Promise(async (res, rej) => {
        try {
          res(
            await createAgency({
              agencyId: agency._id,
            })
          );
        } catch (error) {
          rej(error);
        }
      });
    }
  );
  let agencyArray = (await Promise.allSettled(promiseAgencies))
    .filter((f: any) => !!f?.value)
    .map((p: any) => p.value);

  return {
    id,
    currency,
    digit,
    indicatif,
    name,
    icon,
    charge,
    agency: agencyArray,
  };
};

export const fetchCountryAndAgencies = createAsyncThunk<any, void>(
  "country/fetch",
  async (_, thunkAPI) => {
    // console.log(
    //   "🚀 ~ file: countrySlice.ts:102 ~ acoountMakePreferences:",
    //   telephone
    // );
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });
          let countries = await entrepriseInstance?.countries;
          let promiseCountries = (await countries.page()).items.map(
            (country: any) => {
              return new Promise(async (res, rej) => {
                try {
                  res(
                    await createCountry({
                      countryId: country._id,
                    })
                  );
                } catch (error) {
                  rej(error);
                }
              });
            }
          );
          let countryArray = (await Promise.allSettled(promiseCountries))
            .filter((f: any) => !!f?.value)
            .map((p: any) => p.value);

          resolve(countryArray);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const countrySlice = createSlice({
  name: "country",
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCountryAndAgencies.pending, (state) => {
      state.loading = true;
      state.success = false;

      console.log("pending:fetchCountryAndAgencies");
    });
    builder.addCase(fetchCountryAndAgencies.fulfilled, (state, action) => {
      let dataCountries = action.payload;
      dataCountries.forEach((dataCountry: any) => {
        state[dataCountry.id] = dataCountry;
      });
      state.success = true;
      state.loading = false;
      console.log("fulfilled:fetchCountryAndAgencies");
    });
    builder.addCase(fetchCountryAndAgencies.rejected, (state) => {
      console.log("rejected:fetchCountryAndAgencies");
      state.success = false;
      state.loading = false;
    });
    builder.addCase(PURGE, () => initialState);
  },
});

export default countrySlice.reducer;
