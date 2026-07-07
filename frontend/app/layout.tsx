import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "RAG Chat",
  description: "A RAG-powered AI chatbot with an iridescent glass interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark bg-black`}
    >
      <body className="min-h-full flex flex-col relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0 pointer-events-none p-1 animate-siri-glow opacity-30" aria-hidden="true">
          <div className="w-full h-full bg-black rounded-xl" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col min-h-full bg-black/80 backdrop-blur-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
