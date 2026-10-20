# FlyNow · Aulas 8 e 9

Aula 8: DOM · HOF · Axios · useEffect  
Aula 9: Closures · Módulos · React Router · Context · Login com token (JWT)

Laboratório de Programação Front End, Engenharia de Software, Universidade de Vassouras (2026.2)
Professora: Laís Cristine Bordallo Pinheiro · Aluno: Renan Pollig

## Como rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # confere se compila sem erro
```

> Se mudar o `.env`, **pare e rode `npm run dev` de novo**. O Vite só lê o arquivo na inicialização.

## Onde está cada bloco

| Bloco | O que foi pedido | Arquivo |
|---|---|---|
| 1 · DOM | `querySelector`, `textContent`, `classList`, `addEventListener` no console | teste no console (abaixo) · classe `.destaque` em `src/index.css` |
| 2 · HOF | botão "Só até R$ 650" com `filter`, total com `reduce`, lista com `map` e `key={d.id}`, estado derivado | `src/components/ListaPrecos.tsx` · `src/data/destinos.ts` |
| 2 · Desafios | A: ordenar por preço sem mutar · B: busca por nome com `includes` | `src/components/ListaPrecos.tsx` |
| 3 · Axios | `.env` com `VITE_`, instâncias `wiki` e `api` | `.env` · `src/services/http.ts` |
| 3 · GET | `listarDestinos()` com `Promise.all` na Wikipedia | `src/services/destinos.ts` |
| 3 · POST | `criarTarefa()` em `/todos/add` + estado novo `[...lista, nova]` | `src/services/tarefas.ts` · `src/components/Tarefas.tsx` |
| 3 · Erro | `/404/nao-achei` lido com `axios.isAxiosError` e `err.response?.status` | `src/services/tarefas.ts` (botão "Testar erro 404") |
| 4 · useEffect | `useEffect([])` com carregando, erro, vazio e lista | `src/components/DestinosWiki.tsx` |
| 4 · Ponte DOM | `document.title` atualizado pelo efeito com `[visiveis.length]` | `src/components/ListaPrecos.tsx` |

## Bloco 1: comandos para o console (F12 → Console)

```js
const titulo = document.querySelector('h1')
titulo.textContent = 'FlyNow — bastidor'
titulo.classList.add('destaque')
titulo.addEventListener('click', () => {
  console.log('clicou!')
})
document.querySelectorAll('li').length
```

Aperte F5 depois: tudo volta ao normal, porque a fonte da verdade é o código e o estado.

## Checklist de saída

- [ ] Console sem vermelho (o 404 do botão "Testar erro 404" é **proposital**)
- [ ] `npm run dev` e `npm run build` passam
- [ ] `querySelector`, `textContent` e `classList` testados no console
- [ ] Botão "Só até R$ 650" com `filter`, total com `reduce` e `key={d.id}`
- [ ] `src/services/http.ts` com URLs do `.env` e um GET com Axios
- [ ] Um POST feito e um erro lido com `err.response?.status`
- [ ] `useEffect([])` com carregando, erro e lista (ou vazia)
- [ ] Commit: `feat: aula8 dom hof axios useeffect`

## Observações

- O DummyJSON **só simula** o POST: devolve a tarefa criada, mas não grava. Por isso a tarefa entra na tela com `[...tarefas, nova]`.
- Ele devolve o mesmo `id` para toda tarefa nova, então cada item recebe uma `chave` local única para o `key` do React não se repetir.
- No `npm run dev` aparecem 2 GETs no Network por causa do Strict Mode. É normal; no build final é 1.

---

## Aula 9: login e rotas

**Login de treino (DummyJSON):** usuário `emilys` · senha `emilyspass`

| Bloco | O que foi pedido | Arquivo |
|---|---|---|
| 1 · Closures + módulos | código separado por pasta, `export` nomeado × `default` | `services/`, `contexts/`, `routes/`, `pages/`, `components/` |
| 2 · React Router | `BrowserRouter`, tabela de rotas (`/login`, `/`, `/desejos`, 404), `Layout` com `Outlet`, `NavLink` com `end` | `main.tsx` · `App.tsx` · `components/Layout.tsx` · `components/Header.tsx` · `pages/` |
| 3 · Context | `createContext` + `AuthProvider` + hook `useAuth()` (sem prop drilling) | `contexts/AuthContext.tsx` |
| 4 · Login + token | `POST /auth/login`, token em `flynow.token` (localStorage), restauração com `GET /auth/me` + `Bearer`, `ProtectedRoute`, mensagem por status | `services/auth.ts` · `pages/Login.tsx` · `routes/ProtectedRoute.tsx` |

### Rotas

| Rota | Tela | Acesso |
|---|---|---|
| `/login` | Login | pública |
| `/` | Destinos (conteúdo da aula 8) | protegida |
| `/desejos` | Meus desejos (aula 10) | protegida |
| `*` | 404 | qualquer um |

### Lista de conferência (testada)

- [x] Sem login: `/` redireciona para `/login`
- [x] Senha errada: "Usuário ou senha incorretos." e o botão volta a funcionar
- [x] Login certo: vai para `/` e o menu mostra "Olá, Emily"
- [x] F5 logado: continua logado ("Verificando sessão…" por um instante)
- [x] Sair: volta ao login e `flynow.token` some do Local Storage
- [x] Voltar do navegador depois de sair não mostra a tela protegida
- [x] `/qualquer-coisa` mostra a página 404 com link de volta
- [x] Token adulterado + F5: cai no login

> Avisos do lint em `AuthContext.tsx` (`only-export-components` e `set-state-in-effect`) são esperados: a própria aula diz que podem ser ignorados.
