import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/ThemeProvider";
import TopNavBar from "./components/TopNavBar";
import { SearchProvider, initialState } from "@/context/SearchContext";
import ContextWrapper from "@/components/ContextWrapper";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DishShare",
  description:
    "DishShare is your ultimate destination for culinary inspiration and collaboration. Explore a diverse array of mouthwatering recipes shared by food enthusiasts just like you. Whether you're craving savory dishes, decadent desserts, or delightful snacks, DishShare brings together a community of passionate cooks and foodies to share their favorite recipes and culinary creations. Join us to discover new flavors, connect with fellow food lovers, and embark on a delicious journey of exploration and sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Root Layout");
  return (
    <html lang="en">
      <body
        className={cn(
          "w-svw h-full min-h-screen bg-background font-sans antialiased dark:bg-muted",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContextWrapper>
            <section className="w-full h-full">
              <Suspense>
                <TopNavBar />
              </Suspense>
              {children}
            </section>
          </ContextWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
