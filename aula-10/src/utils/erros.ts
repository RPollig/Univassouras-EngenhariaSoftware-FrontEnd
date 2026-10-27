// Bloco 1: versão provisória. No Bloco 3 vira a mensagem por status.
export function mensagemDeErro(err: unknown): string {
  console.error(err)
  return 'Não deu certo. Tenta de novo.'
}
