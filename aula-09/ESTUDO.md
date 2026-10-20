# Guia de estudo · Aula 8 (respostas comentadas)

Material de apoio para o Renan revisar. Não faz parte do código entregue.

## Aquecimento: 3 palpites

**A.** `nums` continua `[1, 2, 3]` e `dobro` é `[2, 4, 6]`. O `map` **cria uma lista nova** e não altera a original.

**B.** Aparece `deu certo`. O `fetch` só cai no `catch` quando a **rede** falha. Um 404 é uma resposta válida do servidor, então vai para o `.then` com `res.ok === false`.

**C.** Loop infinito. Sem array de dependências, o efeito roda a cada render; ele muda o estado, o que provoca um novo render, que roda o efeito de novo…

## Bloco 1 · DOM

**Lacunas:** `'h1'` · `textContent` · `add` · `length`

**Caça ao bug:** `querySelector` devolveu `null` porque não existe elemento com a classe `.titulo-principal`. Abra a aba **Elements**, veja a tag e a classe reais e use esse seletor (aqui, `'h1'`).

**Ideia central:** o que se muda no console vive só na memória da aba. O F5 refaz a tela a partir do código e do estado.

## Bloco 2 · HOF

**Lacunas:** `filter` · `reduce` · `d.preco` · `!soBaratos` · `id`

**Bug A:** `push` muta o mesmo array. O React compara a referência (o "endereço da caixa"), vê que é igual e não redesenha. Conserto: `setLista([...lista, novo])`.

**Bug B:** `key={i}` usa o índice. Se a lista mudar de ordem ou perder itens, o React confunde quem é quem. Conserto: `key={d.id}`.

**Bug C:** `reduce` sem valor inicial usa o primeiro objeto como acumulador e o total vira texto estranho (`[object Object]...`); em lista vazia, dá erro. Conserto: `reduce((soma, d) => soma + d.preco, 0)`.

**Ideia central:** `visiveis` e `total` **não ficam no estado**. São calculados a partir de `destinos` + `soBaratos` a cada render (estado derivado).

## Bloco 3 · Axios

**Lacunas:** `data` · `post` · `status`

**Bug A:** faltou `await`. Sem ele, `wiki.get` devolve a Promise e não o resultado. Conserto: `const { data } = await wiki.get(...)`.

**Bug B:** faltou o prefixo `VITE_`. O Vite só expõe variáveis que começam com ele. Conserto: `import.meta.env.VITE_API_URL`.

**Bug C:** não reiniciou o `npm run dev` depois de criar o `.env`.

**fetch × axios no 404:** o `fetch` vai para o `.then` (tem que checar `res.ok`); o `axios` vai para o `catch` e o código fica em `err.response.status`.

## Bloco 4 · useEffect

**Lacunas:** `listarDestinos` · `finally` · `[]` (fica vazio)

**Bug A:** sem array de dependências o efeito roda a cada render e o `setLoading`/`setDestinos` provoca outro render: loop. Conserto: `}, [])`.

**Bug B:** o callback do `useEffect` não pode ser `async`. Conserto: declarar uma função `async carregar()` dentro do efeito e chamá-la.

**Bug C:** se der erro, `setLoading(false)` nunca roda e a tela fica presa em "Carregando…". Conserto: mover para o `finally`.

**Ordem de decisão da tela:** carregando → erro → lista vazia → lista.

## Bilhete de saída

1. **Por que `lista.push(x); setLista(lista)` não atualiza?** Porque o array é o mesmo (mesma referência); o React acha que nada mudou.
2. **404 com fetch × axios?** fetch: cai no `.then`, `res.ok` é `false`. axios: cai no `catch`, status em `err.response?.status`.
3. **Trocar `[]` por `[busca]`?** O efeito passa a rodar na abertura **e** toda vez que `busca` mudar.
4. **Onde ainda estou perdido?** (resposta pessoal: anote aqui)

## O que foi feito além do mínimo

- Desafio A (ordenar por preço com `[...lista].sort`) e Desafio B (busca com `includes` em minúsculas) implementados juntos.
- Formulário de tarefas mostrando "Salvando…" e o status do erro se o POST falhar.
