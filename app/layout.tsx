import Head from "next/head";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <Head>
          <title>Weather app</title>
      <link rel="icon" type="image/png" href='/public/partly-cloudy' />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Check live weather updates!" />
    </Head>
        <main>
        {children}
        </main>
      </body>
    </html>
  );
}
