import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "המפה הפוליטית 2026",
  description: "מפה תלת־ממדית של המפלגות, העמדות והמועמדים בבחירות לכנסת ה־26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} antialiased`}>
        <AuthProvider>
          <NavBar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
