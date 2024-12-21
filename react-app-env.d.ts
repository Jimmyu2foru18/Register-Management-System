import * as React from 'react';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      REACT_APP_API_URL: string;
    }
  }

  namespace JSX {
    interface Element extends React.ReactElement<any> {}
  }
}

export {};
