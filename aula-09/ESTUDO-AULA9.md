# Guia de estudo · Aula 9 (respostas comentadas)

Material de apoio para revisar. Não faz parte do código entregue.

## Aquecimento

**Bilhete da aula 8**
1. `push` muta o mesmo array; o React compara a referência e não redesenha. Use `setLista([...lista, x])`.
2. `fetch` num 404 cai no `.then` (`res.ok === false`); `axios` cai no `catch` (`err.response.status === 404`).
3. Com `[busca]` o efeito roda ao abrir **e** toda vez que `busca` mudar.
4. A pasta `src/services/` (com as instâncias de `http.ts`).

**Palpites**
- **A:** `b()` mostra **1**. Cada `criar()` monta uma mochila nova; `a` e `b` não se misturam.
- **B:** `<a href>` recarrega a página inteira: o estado do React (e o login em memória) volta ao zero.
- **C:** **Falso.** O payload do JWT está em Base64, que qualquer um lê. O que impede a falsificação é a assinatura.

## Bloco 1 · Closures e módulos

**Lacunas:** `nome`, `sobrenome` · `{ api }` · `default` · `Login`

**Bug A:** `http.ts` exporta com nome; o certo é `import { api } from './http'`.
**Bug B:** `Login` é `export default`; o certo é `import Login from './pages/Login'` (sem chaves).
**Bug C:** stale closure; o `n` do `setInterval` é sempre o do 1º render. Conserto: `setN((atual) => atual + 1)`.

```js
// Teste no console: cada contador tem a sua mochila
function criarContador() { let n = 0; return () => ++n }
const a = criarContador(), b = criarContador()
console.log(a(), a(), b()) // 1 2 1
```

## Bloco 2 · React Router

**Lacunas:** `BrowserRouter` · `*` · `end` · `Outlet`

**Bug A:** `<a href>` recarrega tudo; troque por `<Link to="/desejos">` ou `<NavLink>`.
**Bug B:** faltou envolver o `<App />` com `<BrowserRouter>` no `main.tsx`.
**Bug C:** faltou a rota `path="*"` (404).
**Bug D:** faltou `end` no `NavLink to="/"`.

## Bloco 3 · Context

**Lacunas:** `createContext` · `Provider` · `Provider` · `useContext`

**Bug A:** faltou o `<AuthProvider>` em volta do `<App />`.
**Bug B:** faltou `value={{ usuario, ... }}` no Provider.
**Bug C:** conferir `if (!ctx) throw new Error(...)` antes de usar (é o que o `useAuth` faz).

## Bloco 4 · Login, token e rota protegida

**Lacunas:** `carregando` · `carregando` · `Navigate` · `Outlet` · `Bearer` · `setItem` · `removeItem`

**Bug A:** faltou `e.preventDefault()`; o formulário recarrega a página.
**Bug B:** guardou o objeto inteiro (`[object Object]`); o certo é `dados.accessToken`.
**Bug C:** faltou `if (carregando) return …` antes de checar o usuário; no F5 ele ainda é `null`.
**Bug D:** `setEnviando(false)` deveria estar no `finally`.

```js
// Espiar o token no console (depois de logar)
const t = localStorage.getItem('flynow.token')
JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
```

## Bilhete de saída

1. **Closure** leva na mochila as variáveis do lugar onde nasceu. Ex.: `onClick={() => setN(n + 1)}` leva `n` e `setN`.
2. **`<Link>`** troca de tela sem pedir a página ao servidor; o estado e o login continuam na memória.
3. **`carregando`** segura a portaria enquanto o `/auth/me` responde. Sem ele, no F5 o usuário ainda é `null` e seria expulso para o login.
4. **JWT não é secreto** (Base64), mas é **assinado** pelo servidor: sem a chave dele ninguém altera sem quebrar o selo.
