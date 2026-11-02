import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/site-data";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stillair.example"), // placeholder domain: swap on launch
  title: { default: `${site.brand}: ${site.tagline} Air conditioning in South Florida`, template: `%s | ${site.brand}` },
  description: "Air-conditioning repair, replacement and installation across South Florida. A demo concept site: placeholder brand, no real bookings.",
  openGraph: { type: "website", siteName: site.brand, images: [{ url: "/media/og.png", width: 1200, height: 630, alt: `${site.brand}: ${site.tagline}` }] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0A0F14", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        {/* Without script, scroll-driven scenes rest at their finished state */}
        <noscript><style>{`.scene{--p:1 !important}`}</style></noscript>
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
