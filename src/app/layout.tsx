import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://perpus-pengkalan.vercel.app"),
  title: {
    default: "Pustaka Pangkalan - Perpustakaan Digital Desa Pangkalan Sukabumi",
    template: "%s | Pustaka Pangkalan",
  },
  description: "Portal resmi perpustakaan digital Desa Pangkalan, Kec. Cikidang, Kabupaten Sukabumi. Akses ratusan e-book pertanian modern, wirausaha UMKM, kesehatan keluarga, sastra budaya Sunda, dan konsultasi literasi desa.",
  applicationName: "Pustaka Pangkalan",
  authors: [{ name: "Pemerintah Desa Pangkalan" }],
  generator: "Next.js",
  keywords: [
    "Pustaka Pangkalan",
    "Perpustakaan Digital Desa",
    "Desa Pangkalan",
    "Kabupaten Sukabumi",
    "Kecamatan Cikidang",
    "Literasi Desa",
    "Buku Pertanian Modern",
    "Aksara Sunda",
    "BUMDes Pangkalan",
    "E-Book Desa"
  ],
  creator: "Pemerintah Desa Pangkalan",
  publisher: "Pemerintah Kabupaten Sukabumi",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo_sukabumi.png", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://perpus-pengkalan.vercel.app",
    siteName: "Pustaka Digital Desa Pangkalan",
    title: "Pustaka Pangkalan - Perpustakaan Digital Desa Pangkalan Kabupaten Sukabumi",
    description: "Portal resmi perpustakaan digital Desa Pangkalan, Kec. Cikidang, Kabupaten Sukabumi. Akses ribuan koleksi e-book pertanian modern, UMKM, kesehatan keluarga, sastra Sunda, dan asisten Kades AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pustaka Digital Desa Pangkalan - Lambang Kabupaten Sukabumi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pustaka Pangkalan - Perpustakaan Digital Desa Pangkalan Sukabumi",
    description: "Portal resmi perpustakaan digital Desa Pangkalan, Kec. Cikidang, Kabupaten Sukabumi.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://perpus-pengkalan.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `}} />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-body-md overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
