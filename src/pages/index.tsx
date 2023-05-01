import Head from 'next/head';
// import Image from 'next/image';
// import styles from '@/styles/Home.module.css';

import { ChakraProvider } from '@chakra-ui/react';
import Page from './Page';

export default function Home() {
  return (
    <>
      <Head>
        <title>VipsIt-2</title>
        <meta name="description" content="vipsit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ChakraProvider>
          <Page />
        </ChakraProvider>
      </main >
    </>
  );
}
