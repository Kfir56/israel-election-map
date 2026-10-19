import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "התחברות · המפה הפוליטית 2026" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
