import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ref, get, set } from "firebase/database";
import { db, auth, storage } from "../firebase"; // Import storage
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage"; // Firebase Storage methods
import { FaCamera } from "react-icons/fa"; // Camera icon for image upload

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [editableProfile, setEditableProfile] = useState({
    name: user.name || "",
    phone: user.phone || "",
    city: user.city || "",
    profileImage: user.profileImage || "", // Profile image URL
  });

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Fetch user data from Firebase
  useEffect(() => {
    if (!userId) {
      console.error("User not authenticated!");
      return;
    }

    const fetchUserData = async () => {
      dispatch(setLoading(true));
      try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log("Fetched user data:", userData);

          // Dispatch the setUserProfile action to update Redux state
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
              profileImage: userData.profileImage || "", // Profile image URL
            })
          );

          // Update local editable state
          setEditableProfile({
            name: userData.name || "",
            phone: userData.phone || "",
            city: userData.city || "",
            profileImage: userData.profileImage || "", // Profile image URL
          });
        } else {
          console.log("No user data found for ID:", userId);
        }
      } catch (error) {
        dispatch(setError("Error fetching user data"));
        console.error("Error fetching user data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserData();
  }, [dispatch, userId]);

  // Handle profile update
  const handleUpdate = async () => {
    if (!userId) {
      alert("User not authenticated!");
      return;
    }

    try {
      const userRef = ref(db, `users/${userId}`);

      // Update the user's profile in Firebase
      await set(userRef, {
        ...user, // Keep existing fields (email, role, status, etc.)
        name: editableProfile.name,
        phone: editableProfile.phone,
        city: editableProfile.city,
        profileImage: editableProfile.profileImage, // Profile image URL
      });

      console.log("Profile updated successfully:", editableProfile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        dispatch(setLoading(true));

        // Upload the image to Firebase Storage
        const imageRef = storageRef(storage, `profileImages/${userId}`);
        await uploadBytes(imageRef, file);

        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(imageRef);

        // Update the local state with the new image URL
        setEditableProfile({ ...editableProfile, profileImage: imageUrl });

        // Update Firebase Realtime Database with the new image URL
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#0C2BA1] text-center">
          User Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-12 relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#0C2BA1]/20 hover:border-[#0C2BA1]/40 transition-colors duration-300">
            <img
              src={
                editableProfile.profileImage ||
                "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="profileImageUpload"
            className="mt-2 flex items-center gap-2 text-[#0C2BA1] hover:text-[#0A2472] cursor-pointer transition-colors duration-300"
          >
            <FaCamera className="text-lg" />
            <span className="text-sm font-medium">Change Photo</span>
          </label>
          <input
            id="profileImageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Account Details */}
        <div className="mb-8 space-y-6">
          <h2 className="text-2xl font-semibold mb-6 text-[#0C2BA1] border-b pb-2">
            Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full p-3 border rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1]/20 outline-none transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full p-3 border rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1]/20 outline-none transition-all"
              />
            </div>

            {/* City Field */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full p-3 border rounded-lg focus:border-[#0C2BA1] focus:ring-2 focus:ring-[#0C2BA1]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleUpdate}
          className="w-full md:w-auto md:px-12 bg-[#0C2BA1] text-white py-3 rounded-lg hover:bg-[#0A2472] transition duration-300 font-medium text-sm flex items-center justify-center mx-auto"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
