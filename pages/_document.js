import React from 'react';

export default function Document({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="D&T Ai-TECH Platform" />
        <title>D&T Ai-TECH</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
