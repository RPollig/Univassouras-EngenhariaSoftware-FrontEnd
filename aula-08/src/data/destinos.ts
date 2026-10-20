import type { DestinoPreco } from '../types'
import { imagens } from './imagens'

// Mesmo formato do destinos.json da P1 (id, nome, preco) + dados visuais
export const destinos: DestinoPreco[] = [
  { id: 'rio', nome: 'Rio', preco: 800, local: 'Rio de Janeiro · Brasil', imagem: imagens.rio },
  { id: 'ssa', nome: 'Salvador', preco: 600, local: 'Bahia · Brasil', imagem: imagens.salvador },
  { id: 'lis', nome: 'Lisboa', preco: 2400, local: 'Portugal', imagem: imagens.lisboa },
]
