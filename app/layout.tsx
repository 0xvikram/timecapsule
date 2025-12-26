import "./globals.css";

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
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
