import { create } from "zustand";
// Define types for the state
interface PreferenceState {
  language: string;
  darkMode: boolean;
  name: string;
  currency: string;
  country: { id: string; name: string };
}

// Define types for the actions
interface PreferenceActions {
  setPreferences: (value: Partial<PreferenceState>) => void;
}

// Combine state and actions types into one
type PreferenceStore = PreferenceState & PreferenceActions;

export const usePreferenceStore = create<PreferenceStore>((set) => ({
  language: "francais",
  darkMode: false,
  currency: "RUB",
  name: "",
  country: { id: "", name: "" },
  setPreferences: (value) =>
    set((state) => ({
      ...state,
      ...value, // Use partial object spread to merge the new values
    })),
}));
