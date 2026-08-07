import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
    count: number;
}

const initialState: CartState = {
    count: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
        incrementCartCount: (state) => {
            state.count += 1;
        },
        decrementCartCount: (state) => {
            if (state.count > 0) state.count -= 1;
        },
    },
});

export const {
    setCartCount,
    incrementCartCount,
    decrementCartCount,
} = cartSlice.actions;

export default cartSlice.reducer;