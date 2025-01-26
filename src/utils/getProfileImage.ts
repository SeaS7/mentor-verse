import axios from "axios";


export const getProfileImage = async (userId: string): Promise<string | null> => {
  if (!userId) {
    console.error("User ID is required");
    return null;
  }

  try {
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/users/profile-image/${userId}`);

    if (response.data.success && response.data.profileImg) {
      return response.data.profileImg == '' ? '/defaultUser.png' : response.data.profileImg;
    } else {
      console.error("Profile image not found for user ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return null;
  }
};
