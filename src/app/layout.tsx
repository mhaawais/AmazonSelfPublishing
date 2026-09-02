import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Amazon Self Publishing Hub",
    template: "%s | Amazon Self Publishing Hub",
  },
  description:
    "Professional book writing, editing, publishing, and marketing services.",
  icons: {
    icon: "/assets/favicon.jpg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <script src="/assets/js/jquery.min.js" defer />
        <script src="/assets/js/bootstrap.bundle.min.js" defer />
        <script src="/assets/js/slick.min.js" defer />
        <script src="/assets/js/app.js" defer />
      </head>
      <body>{children}</body>
    </html>
  );
}
