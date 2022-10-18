import React, { useEffect, useState } from 'react';

import { AppProps } from 'next/app';
import Router from 'next/router';
import { ThemeProvider } from 'styled-components';

import '../../custom-theme.css';

import { AuthProvider } from '../contexts/AuthContext';
import { PageLoader } from '../components';
import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => url !== Router.asPath && setLoading(true);
    const handleComplete = (url: string) => url === Router.asPath && setLoading(false);

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
    };
  });

  return (
    <>
      {loading && <PageLoader />}
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
          <GlobalStyle />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
