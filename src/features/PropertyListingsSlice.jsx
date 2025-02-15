import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offices: [], // Array of properties
  selectedProperty: null, // Currently selected property
};

const PropertyListingsSlice = createSlice({
  name: "offices",
  initialState,
  reducers: {
    // Set the list of offices (properties) in the state
    setOffices: (state, action) => {
      // Ensure each property has an `id` field
      state.offices = action.payload.map((property) => ({
        ...property,
        id: property.id || property.key, // Use `id` or `key` if available
      }));
      console.log("Offices stored in Redux:", state.offices); // Debug
    },

    // Set the currently selected property
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
      console.log("Selected property:", state.selectedProperty); // Debug
    },
  },
});

// Export actions
export const { setOffices, setSelectedProperty } =
  PropertyListingsSlice.actions;

// Export reducer
export default PropertyListingsSlice.reducer;
