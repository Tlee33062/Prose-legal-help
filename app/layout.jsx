export const metadata = {
  title: "Pro Se Legal Help - Florida Contract & Pleading Intelligence",
  description: "AI-Assisted Contract Review & Florida Civil Procedure Intelligence for Pro Se Litigants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
