import { redirect } from "next/navigation";

// Root page - simply redirect to the welcome page which handles splash animation
// The welcome page will also handle mobile device warnings
export default function Page() {
  redirect("/welcome");
}
