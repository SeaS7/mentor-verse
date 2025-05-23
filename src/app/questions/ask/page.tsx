import React from "react";

import QuestionForm from "@/components/QuestionForm";
import {IconCloud} from "@/components/magicui/icon-cloud";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

const Page = async () => {
  return (
    <div className="block pb-20 pt-32">
            <div className="container mx-auto px-4">
                <h1 className="mb-10 mt-4 text-2xl">Ask a question</h1>

                <div className="flex flex-wrap md:flex-row-reverse">
                <div className="w-full md:w-2/5">
                    <IconCloud iconSlugs={slugs} /></div>
                    <div className="w-full md:w-3/5">
                        <QuestionForm />
                    </div>
                </div>
            </div>
        </div>
  );
};

export default Page;
