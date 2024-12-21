declare module 'react/jsx-runtime' {
  export namespace JSX {
    type Element = React.ReactElement<any>
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export { JSX };
}
