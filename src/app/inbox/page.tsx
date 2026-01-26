import { redirect } from "next/navigation";

// Inbox fue reemplazado por Capture
export default function InboxPage() {
    redirect("/capture");
}
