import React, { useEffect, useState } from 'react';

import { AppProps } from 'next/app';
import Router from 'next/router';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ptBr from 'dayjs/locale/pt-br';
dayjs.extend(relativeTime);
dayjs.locale(ptBr);

import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import '../../custom-theme.css';

import { EmptyState, PageLoader } from '../components';
import { AuthProvider } from '../contexts/AuthContext';

import GlobalStyle from '../styles/global';
import theme from '../styles/theme';
import ErrorBoundary from '../components/ErrorBoundary';

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
    <ErrorBoundary>
      {loading && <PageLoader />}
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <ConfigProvider renderEmpty={() => <EmptyState />}>
            <Component {...pageProps} />
            <GlobalStyle />
          </ConfigProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default MyApp;
