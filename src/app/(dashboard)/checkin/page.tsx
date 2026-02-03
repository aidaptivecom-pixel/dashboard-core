import { redirect } from "next/navigation";

// Checkin fue reemplazado por el nuevo flujo - redirigir a Home
export default function CheckinPage() {
    redirect("/");
}
