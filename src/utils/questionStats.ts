import axios from "axios";

export const getUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data.data; // Extracting user data
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const getQuestionStats = async (questionId: string) => {
  try {
    const response = await axios.get(`/api/questions/stats/${questionId}`);
    return response.data.data; // Extracting question stats
  } catch (error) {
    console.error("Error fetching question stats:", error);
    throw error;
  }
};

export const getUserAndQuestionStats = async (
  userId: string,
  questionId: string
) => {
  try {
    const [userData, questionStats] = await Promise.all([
      getUserDetails(userId),
      getQuestionStats(questionId),
    ]);
    console.log("User data:", userData);
    console.log("Question stats:", questionStats);

    return { user: userData, questionStats };
  } catch (error) {
    console.error("Error fetching user and question stats:", error);
    throw error;
  }
};
