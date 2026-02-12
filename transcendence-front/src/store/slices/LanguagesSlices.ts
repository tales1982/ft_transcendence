import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Language = "pt" | "en" | "fr";

interface LanguageState {
  current: Language;
}

const initialState: LanguageState = {
  current: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.current = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
