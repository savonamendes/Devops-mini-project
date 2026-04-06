"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Idea } from "./types";

interface IdeaHeaderProps {
  idea: Idea;
}

export default function IdeaHeader({ idea }: IdeaHeaderProps) {
  return (
    <section className="bg-[#0a1e42] py-8 text-white md:py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/odrlabs"
          className="mb-6 inline-flex items-center text-gray-200 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to ODR Lab
        </Link>
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            {idea.description.split(".")[0]}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
            <div>Posted by {idea.owner.name}</div>
            <div>From {idea.owner.country}</div>
            <div>{format(new Date(idea.createdAt), "MMMM d, yyyy")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
