import React from 'react';

import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

import '../../custom-theme.css';

import { AuthProvider } from '../contexts/AuthContext';
import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
        <GlobalStyle />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default MyApp;
