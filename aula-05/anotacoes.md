# Aula 05 - Teoria II

Nesta aula vimos a segunda parte da teoria de Front-End.

## HOF

HOF são funções que podem receber ou retornar outras funções.

Exemplos vistos:

- map: percorre uma lista e cria uma nova lista.
- filter: filtra os elementos de uma lista.
- reduce: reduz os elementos para chegar em um resultado.

## Axios e Fetch

Fetch e Axios podem ser usados para fazer requisições HTTP.

O Axios facilita algumas coisas, como trabalhar com JSON e tratar erros usando catch.

Também vimos o uso de GET e POST.

## useEffect

O useEffect é um hook do React usado para executar ações em determinados momentos do componente.

Pode ser usado, por exemplo, quando o componente é carregado ou quando algum estado muda.

Segundo o material, useEffect não cai na P1.

## Context API e Redux

Context permite compartilhar um estado entre componentes sem precisar passar as informações por vários níveis de props.

Redux trabalha com um estado centralizado.

Nesta aula Redux foi apresentado apenas como conceito.

## Performance

Foram apresentados alguns recursos para melhorar o desempenho:

- React.memo
- useCallback
- lazy
- Suspense

## Build e Deploy

O projeto criado com Vite pode gerar uma versão para publicação através do comando:

npm run build

O resultado fica na pasta dist.

Também foram apresentados conceitos de deploy e SPA.

## Router, JWT e CRM

React Router permite trabalhar com diferentes páginas ou rotas.

JWT pode ser utilizado no processo de autenticação através de token.

O CRM será trabalhado posteriormente e faz parte do trabalho da P2.

Esses assuntos foram apresentados nesta aula como conceitos e não fazem parte da P1.