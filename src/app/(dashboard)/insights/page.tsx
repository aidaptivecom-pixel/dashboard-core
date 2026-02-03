import { redirect } from "next/navigation";

// Insights no se usa actualmente - redirigir a Home
export default function InsightsPage() {
    redirect("/");
}
