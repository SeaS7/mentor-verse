
import React from "react";
import EditQues from "./EditQues";
import axios from "axios";

const Page = async ({ params }: { params: { quesId: string; quesName: string } }) => {
  try {
    // Fetch the question using your API
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/questions/${params.quesId}`);
    const question = response.data.data;

    return <EditQues question={question} />;
  } catch (error) {
    console.error("Error fetching question:", error);

    // Handle errors, such as showing a fallback UI or redirecting
    return (
      <div className="p-4 text-center text-red-500">
        Unable to fetch the question. Please try again later.
      </div>
    );
  }
};

export default Page;
