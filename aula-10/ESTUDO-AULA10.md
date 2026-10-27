# Guia de estudo · Aula 10 (respostas comentadas)

Material de apoio para revisar. Não faz parte do código entregue.

## Aquecimento

**Bilhete da aula 9**
1. No F5 o `AuthProvider` lê o `flynow.token` do localStorage e pergunta à API (`GET /auth/me` com `Bearer`) se ainda vale; enquanto isso `carregando = true`.
2. A `ProtectedRoute` é a portaria: logado → `<Outlet />` (mostra a página); não logado → `<Navigate to="/login" replace />`.
3. `carregando` segura a portaria enquanto o `/auth/me` responde; sem ele, o F5 expulsaria quem está logado.

**Palpites**
- **A:** `2 3`. O spread cria uma lista nova; a original não muda.
- **B:** Não. O DummyJSON só simula: o F5 refaz o GET e o servidor devolve só o que já tinha.
- **C:** Aparece "caiu no catch". O Axios joga 404 para o `catch` (diferente do `fetch`).

## Bloco 1 · Ler e criar

**Lacunas:** `get` · `userId` · `todos` · `...` · `novo`

- **Bug A:** `push` devolve um número (o novo tamanho), não a lista → `desejos.map is not a function`. Conserto: `setDesejos((lista) => [...lista, novo])`.
- **Bug B:** faltou `e.preventDefault()` (a página recarrega) e faltou validar.
- **Bug C:** guardou `data` (o objeto com paginação) em vez de `data.todos`.

## Bloco 2 · Editar e excluir

**Lacunas:** `!` · `map` · `confirm` · `filter`

- **Bug A:** `===` deixa só o excluído. O certo é `!==` (todos menos ele).
- **Bug B:** tirou da tela antes da API responder; se der 404, a tela mente. Primeiro `await excluirDesejo`, depois o `filter`.
- **Bug C:** `onClick={aoExcluir(d)}` chama a função na hora de desenhar. O certo é `onClick={() => aoExcluir(d)}`.

## Bloco 3 · Erros

**Lacunas:** `isAxiosError` · `response` · `401` · `request` · `Bearer` · `finally`

- **Bug A:** `err.message` mostra texto técnico ("Request failed with status code 404"). Use `mensagemDeErro(err)`.
- **Bug B:** `setEnviando(false)` só no `try`: se der erro, o botão fica em "Salvando…". Vai no `finally`.
- **Bug C:** o interceptor de response não devolve `Promise.reject(err)`: o erro é "engolido" e o `catch` da tela nunca roda.

## Bloco 4 · Responsivo

**Lacunas:** `flex` · `wrap` · `min` · `clamp` · `100`

- **Bug A:** `width: 600px` fixo estoura o celular. Use `max-width` com `rem`/`%`.
- **Bug B:** a regra base vem **depois** da media query e a desfaz. Base primeiro, `@media` depois.
- **Bug C:** faltou a `<meta name="viewport" …>` no `index.html`.

## Bilhete de saída

1. O desejo some no F5 porque a API de treino não grava; o app mostra o que a pessoa fez atualizando o **estado local** (`[...lista, novo]`).
2. No 401 o interceptor chama o `logout`; a `ProtectedRoute` manda para o Login.
3. `setEnviando(false)` vai no `finally` para rodar com sucesso **e** com erro.
4. Mobile-first começa pelo celular (o caso mais apertado) e usa `min-width` só para **acrescentar** colunas quando sobra espaço.
