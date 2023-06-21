import { createSlice } from "@reduxjs/toolkit";
import { ContactShema } from "../../app/modal";

let initialState: ContactShema[] = [];

export const contactSlice = createSlice({
  name: "contact",
  initialState: initialState,
  reducers: {
    addContact: (state, action) => {
      return (state = state.concat(...action.payload));
    },
  },
});

export const { addContact } = contactSlice.actions;

export default contactSlice.reducer;
