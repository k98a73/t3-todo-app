import Head from "next/head";
import type { FC, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children, title = "T3 Stack" }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </main>
    </>
  );
};
