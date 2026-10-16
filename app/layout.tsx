import type { Metadata, Viewport } from "next";
import { PT_Serif_Caption } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const ptSerif = PT_Serif_Caption({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-pt-serif-caption",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jaydendwinaufal.dev";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jayden Dwi Naufal — Full-Stack Developer & Data Scientist | Portfolio",
    template: "%s | Jayden Dwi Naufal",
  },
  description:
    "Portfolio of Jayden Dwi Naufal — Full-Stack Developer and Data Scientist. 1st Place Provincial LKS & Medallion of Excellence National LKSN in IT Software. Specializing in Next.js, React, TypeScript, Python, ASP.NET, and Jetpack Compose.",
  keywords: [
    "Jayden Dwi Naufal",
    "Individev",
    "Full-Stack Developer",
    "Data Scientist",
    "Software Engineer Indonesia",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer Samarinda",
    "Web Developer Kalimantan Timur",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Python",
    "ASP.NET",
    "Jetpack Compose",
    "LKS IT Software Solution for Business",
    "Portfolio Web Developer",
  ],
  authors: [{ name: "Jayden Dwi Naufal", url: "https://github.com" }],
  creator: "Jayden Dwi Naufal",
  publisher: "Jayden Dwi Naufal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "Jayden Dwi Naufal — Portfolio",
    title: "Jayden Dwi Naufal — Full-Stack Developer & Data Scientist",
    description:
      "Explore web & mobile projects, achievements, and technical expertise of Jayden Dwi Naufal — Full-Stack Developer & Data Scientist.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayden Dwi Naufal — Full-Stack Developer & Data Scientist",
    description:
      "Portfolio & projects of Jayden Dwi Naufal. 1st Place Provincial LKS & National LKSN Medallion of Excellence winner in IT Software.",
    creator: "@jaydendwinaufal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Jayden Dwi Naufal",
        alternateName: ["Jayden", "Individev"],
        jobTitle: "Full-Stack Developer & Data Scientist",
        description:
          "Full-Stack Developer and Data Scientist with expertise in React, Next.js, TypeScript, Python, ASP.NET, and Jetpack Compose. Winner at Provincial and National LKS IT Software.",
        url: siteUrl,
        sameAs: ["https://github.com", "https://linkedin.com"],
        knowsAbout: [
          "Web Development",
          "Mobile App Development",
          "Data Science",
          "Next.js",
          "React",
          "TypeScript",
          "Python",
          "ASP.NET",
          "Jetpack Compose",
          "Tailwind CSS",
          "Supabase",
        ],
        award: [
          "1st Place — Provincial LKS IT Software Solution for Business 2026",
          "Medallion of Excellence — National LKS (LKSN) IT Software Solution for Business 2026",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Jayden Dwi Naufal — Portfolio",
        description:
          "Portfolio of Jayden Dwi Naufal — Full-Stack Developer & Data Scientist.",
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
        inLanguage: ["en", "id"],
      },
    ],
  };

  return (
    <html lang="en" className={`h-full ${ptSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`min-h-full flex flex-col ${ptSerif.className}`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
