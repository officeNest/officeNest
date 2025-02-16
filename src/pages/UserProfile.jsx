import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ref, get, set } from "firebase/database";
import { db, auth, storage } from "../firebase";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";
import { Camera, Mail, Phone, MapPin, Shield } from "lucide-react";

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [editableProfile, setEditableProfile] = useState({
    name: user.name || "",
    phone: user.phone || "",
    city: user.city || "",
    profileImage: user.profileImage || "",
  });

  const [rentalHistory, setRentalHistory] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (!userId) {
      console.error("User not authenticated!");
      return;
    }

    const fetchUserData = async () => {
      dispatch(setLoading(true));
      try {
        const userRef = ref(db, `users/${userId}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          console.log("Fetched user data:", userData);

          dispatch(
            setUserProfile({
              name: userData.name || "",
              email: userData.email || "",
              role: userData.role || "",
              status: userData.status || "",
              propertyCount: userData.propertyCount || 0,
              uid: userData.uid || userId,
              phone: userData.phone || "",
              city: userData.city || "",
              profileImage: userData.profileImage || "",
            })
          );

          setEditableProfile({
            name: userData.name || "",
            phone: userData.phone || "",
            city: userData.city || "",
            profileImage: userData.profileImage || "",
          });
        } else {
          console.log("No user data found for ID:", userId);
        }

        const paymentsRef = ref(db, "payments");
        const paymentsSnapshot = await get(paymentsRef);
        if (paymentsSnapshot.exists()) {
          const paymentsData = paymentsSnapshot.val();
          const userPayments = Object.values(paymentsData).filter(
            (payment) => payment.userId === userId
          );

          const rentalHistoryWithPropertyDetails = await Promise.all(
            userPayments.map(async (payment) => {
              const propertyRef = ref(db, `properties/${payment.propertyId}`);
              const propertySnapshot = await get(propertyRef);
              if (propertySnapshot.exists()) {
                const propertyData = propertySnapshot.val();
                return {
                  ...payment,
                  propertyName: propertyData.name,
                  propertyPrice: propertyData.price,
                };
              } else {
                return {
                  ...payment,
                  propertyName: "Unknown Property",
                  propertyPrice: "N/A",
                };
              }
            })
          );

          setRentalHistory(rentalHistoryWithPropertyDetails);
        } else {
          console.log("No payments found.");
        }
      } catch (error) {
        dispatch(setError("Error fetching data"));
        console.error("Error fetching data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserData();
  }, [dispatch, userId]);

  const handleUpdate = async () => {
    if (!userId) {
      alert("User not authenticated!");
      return;
    }

    try {
      const userRef = ref(db, `users/${userId}`);
      await set(userRef, {
        ...user,
        name: editableProfile.name,
        phone: editableProfile.phone,
        city: editableProfile.city,
        profileImage: editableProfile.profileImage,
      });

      console.log("Profile updated successfully:", editableProfile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        dispatch(setLoading(true));
        const imageRef = storageRef(storage, `profileImages/${userId}`);
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
        setEditableProfile({ ...editableProfile, profileImage: imageUrl });
        const userRef = ref(db, `users/${userId}`);
        await set(userRef, {
          ...user,
          profileImage: imageUrl,
        });
        console.log("Profile image updated successfully:", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image: " + error.message);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl p-8 relative">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            User Profile
          </h1>
          
          {/* Profile Image */}
          <div className="flex flex-col items-center relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={editableProfile.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="profileImageUpload"
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-5 h-5 text-blue-600" />
            </label>
            <input
              id="profileImageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-b-xl p-8">
          {/* Account Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={editableProfile.name}
                  onChange={(e) =>
                    setEditableProfile({
                      ...editableProfile,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your full name"
                  className="w-full p-3 border rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Role
                </label>
                <input
                  type="text"
                  value={user.role}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editableProfile.phone}
                  onChange={(e) =>
                    setEditableProfile({
                      ...editableProfile,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter your phone number"
                  className="w-full p-3 border rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* City Field */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  City
                </label>
                <input
                  type="text"
                  value={editableProfile.city}
                  onChange={(e) =>
                    setEditableProfile({
                      ...editableProfile,
                      city: e.target.value,
                    })
                  }
                  placeholder="Enter your city"
                  className="w-full p-3 border rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleUpdate}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Rental History */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Rental History
            </h2>
            <div className="space-y-4">
              {rentalHistory.length > 0 ? (
                rentalHistory.map((rental, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 border border-gray-100"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Property</p>
                        <p className="font-medium text-gray-800">{rental.propertyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium text-gray-800">${rental.propertyPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check-In</p>
                        <p className="font-medium text-gray-800">{rental.checkInDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check-Out</p>
                        <p className="font-medium text-gray-800">{rental.checkOutDate}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No rental history found.</p>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default UserProfile;
