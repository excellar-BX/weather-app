import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather App",
  description: "A tool for checking real-time weather conditions in various cities",
  icons: {
    icon: "/partly-cloudy.png", // This should be inside `public/`
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <main>
        {children}
        </main>
      </body>
    </html>
  );
}
