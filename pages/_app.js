import React from 'react';
import { useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Ensure proper styling
    document.documentElement.lang = 'en';
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
