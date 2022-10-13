import React from 'react';
import Head from 'next/head';

import { BasicPage } from '../components';

function Syndicate() {
  return (
    <>
      <Head>
        <title>Síndico</title>
      </Head>

      <BasicPage menuKey="syndicate">
        <main>Síndico</main>
      </BasicPage>
    </>
  );
}

export default Syndicate;
