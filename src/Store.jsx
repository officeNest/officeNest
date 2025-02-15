
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import officeReducer from "./features/PropertyListingsSlice";
import bookingReducer from "./features/bookingSlice";
import requestsReducer from "./features/requestsSlice";
import usersReducer from "./features/usersslice";
import officesReducer from "./features/officesSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    booking: bookingReducer,
    offices: officeReducer,
    user: userReducer,
    booking: bookingReducer,
    requests: requestsReducer,
    users: usersReducer,
    offices: officesReducer,
  },
});

export default store;
