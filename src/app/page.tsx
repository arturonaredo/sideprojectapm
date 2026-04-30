import { redirect } from "next/navigation";

export default function Home() {
  // For now, redirect to dashboard
  // In production, check if projects exist
  redirect("/dashboard");
}