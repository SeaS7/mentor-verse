import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";
import Answer from "@/models/answer.model";
import Vote from "@/models/vote.model";

export async function getPaginatedQuestions(page = 1, limit = 25, tag?: string, search?: string) {
  await dbConnect();
  const skip = (page - 1) * limit;

  let query: any = {};
  if (tag) query.tags = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const questions = await Question.find(query)
    .populate("authorId", "username profileImg reputation")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Question.countDocuments(query);

  // Fetch additional stats for each question
  const questionStats = await Promise.all(
    questions.map(async (ques) => {
      const [totalAnswers, totalVotes] = await Promise.all([
        Answer.countDocuments({ questionId: ques._id }),
        Vote.countDocuments({ type: "question", typeId: ques._id }),
      ]);

      return {
        ...ques,
        totalAnswers,
        totalVotes,
      };
    })
  );

  return { questionStats, total };
}
