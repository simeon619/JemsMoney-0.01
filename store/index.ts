import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AnyAction,
  ThunkDispatch,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  purgeStoredState,
} from "redux-persist";
import authSlice from "./auth/authSlice";
import contactSlice from "./contact/contactSlice";
import countrySlice from "./country/countrySlice";
import entrepriseSlice from "./entreprise/entrepriseSlice";
import messageSlice from "./message/messageSlice";
import discussionSlice from "./messagerie/messagerieSlice";
import preferenceSlice from "./preference/preferenceSlice";
import transactionSlice from "./transaction/transactionSlice";
// https://www.notjust.dev/blog/2022-12-24-react-native-redux-toolkit
// https://github.com/rt2zz/redux-persist
// const persistConfigA = {
//   key: 'reducerA',
//   storage: AsyncStorage,
// };

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  timeout: 10000,
  // blacklist : ['discussion']
};

export function purgeDiscussion() {
  // purgeStoredState({storage: AsyncStorage ,key : ''});
  purgeStoredState({ ...persistConfig, key: "discussion" });
}
export function purgeContact() {
  purgeStoredState({ ...persistConfig, key: "contact" });
}
export function purgeAuth() {
  purgeStoredState({ ...persistConfig, key: "auth" });
}
const rootReducer = combineReducers({
  contact: contactSlice,
  auth: authSlice,
  discussion: discussionSlice,
  message: messageSlice,
  transation: transactionSlice,
  country: countrySlice,
  entreprise: entrepriseSlice,
  preference: preferenceSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 550,
      },
      immutableCheck: { warnAfter: 550 },
    }),
});

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;
export type RootState = ReturnType<typeof store.getState>;
