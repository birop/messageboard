import "./globals.css";

export const metadata = {
  title: "Uzenofal",
  description: "Egyszeru publikus uzenofal Next.js es Supabase alapon."
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
