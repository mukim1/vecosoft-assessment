import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Order tracking",
  description: "Mobile order tracking screen: on-track, delayed, delivered and tracking-pending scenarios.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-muted">
        {/* Centred mobile frame: full width on phones, a 430px "device" on larger screens. */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background sm:my-8 sm:min-h-[calc(100dvh-4rem)] sm:rounded-3xl sm:border sm:shadow-xl">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
