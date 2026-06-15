import { redirect } from "next/navigation";

// Open straight into the app workspace — no marketing splash.
export default function Home() {
  redirect("/clients");
}
