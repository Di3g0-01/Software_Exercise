import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth System",
  description: "Accessible and modern authentication system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
