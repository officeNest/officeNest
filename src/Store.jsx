
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import bookingReducer from "./features/bookingSlice";
import officeReducer from "./features/PropertyListingsSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    booking: bookingReducer,
    offices: officeReducer,
  
  },
});

export default store;
