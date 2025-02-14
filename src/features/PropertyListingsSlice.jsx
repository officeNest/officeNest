import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    offices: [] 
};

const PropertyListingsSlice = createSlice({
    name: 'offices',
    initialState,
    reducers: {
        setOffices: (state, action) => {
            state.offices = action.payload;
        }
    }
});

export const { setOffices } = PropertyListingsSlice.actions;
export default PropertyListingsSlice.reducer;
