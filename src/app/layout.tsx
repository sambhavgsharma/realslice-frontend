import type { Metadata } from "next";
import "./globals.css";
import WagmiRainbowProvider from "@/providers/WagmiRainbowProvider";
import QueryClientProvider from "@/QueryClientProvider";
import { MediaSpot } from "@/sections/Hero";


export const metadata: Metadata = {
  title: "Real Slice",
  description: "Real Estate. Fractionalized. Simplified",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-silver)",
        }}
      >
        <MediaSpot />
        <div className="relative z-10">
          <QueryClientProvider>
            <WagmiRainbowProvider>{children}</WagmiRainbowProvider>
          </QueryClientProvider>
        </div>
      </body>
    </html>
  );
}
