// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { PURGE } from "redux-persist";
// import { ID_ENTREPRISE } from "../../constants/data";
// import SQuery from "../../lib/SQueryClient";

// let initialState = {
//   loading: true,
//   success: true,
// };
// export const fetchTransacMessagerie = createAsyncThunk<any, void>(
//   "transacMessagerie/fetch",
//   async (_, thunkAPI) => {
//     try {
//       return new Promise(async (resolve, reject) => {
//         try {
//           const entrepriseInstance = await SQuery.newInstance("user", {
//             id: ID_ENTREPRISE,
//           });
//           let countries = await entrepriseInstance?.countries;
//           let promiseCountries = (await countries.page()).items.map(
//             (country: any) => {
//               return new Promise(async (res, rej) => {
//                 try {
//                   // res(
//                   //   await createCountry({
//                   //     countryId: country._id,
//                   //   })
//                   // );
//                 } catch (error) {
//                   rej(error);
//                 }
//               });
//             }
//           );
//           let countryArray = (await Promise.allSettled(promiseCountries))
//             .filter((f: any) => !!f?.value)
//             .map((p: any) => p.value);

//           resolve(countryArray);
//         } catch (error) {
//           reject(error);
//         }
//       });
//     } catch (error: any) {
//       thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const transacMessagerieSlice = createSlice({
//   name: "country",
//   initialState: { ...initialState },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchTransacMessagerie.pending, (state) => {
//       state.loading = true;
//       state.success = false;

//       console.log("pending:fetchCountryAndAgencies");
//     });
//     builder.addCase(fetchTransacMessagerie.fulfilled, (state, action) => {
//       let dataCountries = action.payload;
//       dataCountries.forEach((dataCountry: any) => {
//         // state[dataCountry.id] = dataCountry;
//       });
//       state.success = true;
//       state.loading = false;
//       console.log("fulfilled:fetchCountryAndAgencies");
//     });
//     builder.addCase(fetchTransacMessagerie.rejected, (state) => {
//       console.log("rejected:fetchCountryAndAgencies");
//       state.success = false;
//       state.loading = false;
//     });
//     builder.addCase(PURGE, () => initialState);
//   },
// });
// export default transacMessagerieSlice.reducer;
