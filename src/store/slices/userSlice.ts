import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define a type for your slice state
interface UserState {
  userInfo: any; // Replace 'any' with your User type if you have one (e.g., User | null)
  aiQuestionId: string | null;
  summary_estimate: string | null;
}

// 2. Add the missing property to your initialState
const initialState: UserState = {
  userInfo: null,
  aiQuestionId: null,
  summary_estimate: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },

    // You can add a specific action if you ever need to set just the AI question ID
    setSummaryestimate: (state, action: PayloadAction<string | null>) => {
      state.summary_estimate = action.payload;
    },

    clearUser: (state) => {
      state.userInfo = null;
      state.aiQuestionId = null; // This will now work perfectly without errors
    },
  },
});

// 3. Export your clean actions
export const { setUserInfo, setSummaryestimate, clearUser } = userSlice.actions;

// 4. Export the reducer for your store setup
export default userSlice.reducer;
