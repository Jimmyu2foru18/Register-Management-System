declare module 'papaparse' {
  export interface ParseConfig {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    transformHeader?: (header: string) => string;
    dynamicTyping?: boolean;
    preview?: number;
    encoding?: string;
    worker?: boolean;
    comments?: boolean;
    step?: (results: ParseResult<any>, parser: any) => void;
    complete?: (results: ParseResult<any>) => void;
    error?: (error: Error) => void;
    download?: boolean;
    skipEmptyLines?: boolean;
    fastMode?: boolean;
    withCredentials?: boolean;
  }

  export interface ParseResult<T> {
    data: T[];
    errors: Array<{
      type: string;
      code: string;
      message: string;
      row: number;
    }>;
    meta: {
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      truncated: boolean;
      cursor: number;
    };
  }

  export function parse<T>(
    input: string | File,
    config?: ParseConfig
  ): ParseResult<T>;
} 