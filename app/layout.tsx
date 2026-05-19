import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "leaflet/dist/leaflet.css";
import "../styles.css";

export const metadata: Metadata = {
  title: "GDS Ghana Delivery Service",
  description:
    "Fast courier, parcel, dispatch, and business logistics across Ghana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
