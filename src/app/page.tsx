
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import Header from "@/app/components/Header";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Header />
      <HeroSection />
      <div className="flex flex-wrap md:flex-row-reverse">
        <div className="w-full md:w-1/2">
          <div className="px-5">
            <TopContributers />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <LatestQuestions />
        </div>
      </div>
      <div className="w-4/5">
        <NeonGradientCard className="w-full items-center justify-center text-center my-10">
          <div className="p-10">
            <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              JOIN NOW
            </span>
            <p className="m-10">
              Join now and connect with experienced mentors ready to guide you
              on your educational journey. Whether you need advice,
              skill-building tips, or answers to your toughest questions, Mentor
              Verse is here to help. Discover a community of learners and
              experts where knowledge flows freely, and every question finds an
              answer.
            </p>
            <p>Don’t miss out! join now and start your path to success!</p>
          </div>
        </NeonGradientCard>
      </div>
    </main>
  );
}
