import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const description =
    "Javin's colorful portfolio — systems engineering, full-stack products, applied AI, selected projects, experience, and creative work.";

  return {
    metadataBase: baseUrl,
    title: {
      default: "Javin — Engineer, Builder & Systems Explorer",
      template: "%s · Javin",
    },
    description,
    keywords: [
      "Javin",
      "software engineer",
      "backend engineer",
      "full-stack developer",
      "Go developer",
      "React developer",
      "portfolio",
    ],
    authors: [{ name: "Javin", url: "https://github.com/javin1106" }],
    creator: "Javin",
    icons: {
      icon: "https://avatars.githubusercontent.com/u/108410532?v=4",
      shortcut: "https://avatars.githubusercontent.com/u/108410532?v=4",
    },
    openGraph: {
      type: "website",
      title: "Javin — Engineer, Builder & Systems Explorer",
      description,
      url: baseUrl,
      siteName: "Javin's Portfolio",
      images: [
        {
          url: new URL("/og.png", baseUrl),
          width: 1536,
          height: 1024,
          alt: "Javin — Engineer, Builder and Systems Explorer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Javin — Engineer, Builder & Systems Explorer",
      description,
      images: [new URL("/og.png", baseUrl)],
      creator: "@JavinChutani",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
