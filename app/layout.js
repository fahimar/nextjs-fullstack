import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500","600", "700"],
});

export const metadata = {
  title: "Prept",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>

      <html lang="en" suppressHydrationWarning>
        <body className={`${lora.variable} ${dmSans.variable} min-h-screen bg-background font-sans text-foreground`}>
            <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
              >
            {/* Header */}
            <Header />
            <main className="min-h-screen bg-background text-foreground">{children}</main>
            {/* Footer */}
            <Footer />
            <Toaster />
            </ThemeProvider>
        </body>
      </html>
     </ClerkProvider>
  );  
}
