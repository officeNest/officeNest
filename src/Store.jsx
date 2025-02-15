
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import officeReducer from "./features/PropertyListingsSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    offices: officeReducer,
  
  },
});

export default store;
