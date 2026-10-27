/// <reference types="vite/client" />

// Diz ao TypeScript quais variáveis existem no .env
interface ImportMetaEnv {
  readonly VITE_WIKI_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
