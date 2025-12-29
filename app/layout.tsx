import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata = {
  title: "TimeCapsule",
  description: "Lock your goals. Open them later.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
