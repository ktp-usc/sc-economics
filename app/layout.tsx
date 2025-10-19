import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SC ECONOMICS - Professional Development",
    description: "Transform your teaching with expert-led workshops and events designed specifically for educators to integrate economics education.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}