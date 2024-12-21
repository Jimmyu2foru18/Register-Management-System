/// <reference types="react" />
/// <reference types="react-dom" />

import 'react';

declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }
  
  export type FC<P = {}> = FunctionComponent<P>;
}

declare module 'react-dom' {
  export * from 'react-dom';
  export default ReactDOM;
} 