
import type { Metadata } from "next"
import SubmitIdeaClientPage from "./SubmitIdeaClientPage"
import PageGuard from "@/components/guards/PageGuard"

export const metadata: Metadata = {
  title: "Got an idea for a better, tech-enabled dispute resolution system?",
  description: "Drop it on the Idea Board — every great change starts with a single seed.",
}

export default function SubmitIdeaPage() {
  return (
    <PageGuard requireAuth={true}>
      <SubmitIdeaClientPage />
    </PageGuard>
  )
}
