// app/layout.tsx
import { Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/ui/shared/providers/theme-provider"
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
})

// Inline script to prevent theme flicker - runs before React hydrates
const themeScript = `
(function() {
  try {
    var root = document.documentElement;
    var theme = localStorage.getItem('k-lab-components-theme') || 'system';
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sora.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="k-lab-components-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}