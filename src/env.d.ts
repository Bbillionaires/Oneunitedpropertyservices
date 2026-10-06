/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional endpoint that receives quote requests as multipart/form-data. */
  readonly PUBLIC_QUOTE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
