import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    offices: [], 
    selectedproperty: null 
};

const PropertyListingsSlice = createSlice({
    name: 'offices',
    initialState,
    reducers: {
        setOffices: (state, action) => {
            state.offices = action.payload;
        },
        // setSelectedProperty: (state, action) => {
        //     state.selectedproperty = action.payload; 
        // }
    }
});

export const { setOffices, setSelectedProperty } = PropertyListingsSlice.actions;
export default PropertyListingsSlice.reducer;
