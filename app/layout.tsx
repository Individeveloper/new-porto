import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jayden Dwi Naufal — Portfolio",
  description:
    "Portfolio of Jayden Dwi Naufal — Full-Stack Developer & Data Scientist.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Serif+Caption:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
