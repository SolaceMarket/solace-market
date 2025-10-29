import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { isDev } from "@/lib/dev/devEnv";
import { DatabaseConsole } from "@/modules/dev/DatabaseConsole";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Solace Market",
  description: "A decentralized marketplace for digital assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enableDatabaseConsole =
    process.env.DEV_ENABLE_DATABASE_CONSOLE === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <link
        rel="icon"
        href="/metadata/SolaceMarket-logo_256x256.ico"
        sizes="any"
      />
      <body className={`${ibmPlexMono.variable} antialiased font-mono`}>
        <Providers>{children}</Providers>

        {/* {isDev && enableDatabaseConsole && <DatabaseConsole />} */}
      </body>
    </html>
  );
}
