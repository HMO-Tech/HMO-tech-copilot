import React, { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // روتین‌های پایه فرانت‌اَند
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
