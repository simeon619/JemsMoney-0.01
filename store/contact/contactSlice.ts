import { create } from "zustand";
import { ContactShema } from "../../app/modal";

interface ContactState {
  contacts: ContactShema[];
  addContact: (contacts: ContactShema[]) => void;
}

const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  addContact: (newContacts) => {
    set((state) => ({ contacts: [...state.contacts, ...newContacts] }));
  },
}));

export default useContactStore;
