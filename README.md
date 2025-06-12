# StockSync - Gerenciador de Estoque

![StockSync Dashboard](https://i.imgur.com/CMWv5cE.png)

StockSync é uma aplicação web intuitiva para gerenciamento e controle de estoque, construída com Next.js e Supabase. Permite que os usuários cadastrem produtos, monitorem quantidades, controlem o valor total do inventário e visualizem movimentações recentes de forma simples e eficiente.

## ✨ Funcionalidades

O sistema oferece uma visão completa e detalhada do seu inventário:

* **Dashboard Interativo:** Tenha uma visão geral do seu negócio com cartões que exibem:
    * **Total de Produtos:** Contagem de todos os itens cadastrados.
    * **Estoque Baixo:** Alerta para produtos que precisam de reposição.
    * **Valor Total:** Soma do valor de todos os produtos em estoque.
    * **Movimentações:** Número de transações (entradas/saídas) nos últimos 7 dias.
* **Listagem de Produtos:** Visualize todos os seus produtos em uma tabela clara e organizada com informações essenciais como SKU, categoria, quantidade, preço e status.
* **Cadastro de Produtos:** Adicione novos produtos ao seu inventário através de um formulário simples.
* **Edição e Exclusão:** Atualize informações ou remova produtos que não fazem mais parte do seu estoque.
* **Busca Rápida:** Encontre produtos facilmente utilizando o campo de busca dinâmica.
* **Interface Limpa e Responsiva:** Desfrute de uma experiência de usuário agradável em diferentes tamanhos de tela.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando uma stack moderna, performática e escalável.

* **Frontend:**
    * [**Next.js**](https://nextjs.org/) - Framework React para renderização no servidor (SSR), geração de sites estáticos (SSG) e otimizações de performance.
    * [**React**](https://reactjs.org/) - Biblioteca para construção de interfaces de usuário.
    * [**Tailwind CSS**](https://tailwindcss.com/) (ou outra biblioteca de sua escolha) - Para estilização rápida e customizável.
* **Backend & Banco de Dados:**
    * [**Supabase**](https://supabase.io/) - Plataforma open-source que serve como backend completo, oferecendo:
        * Banco de dados PostgreSQL.
        * APIs RESTful e em tempo real geradas automaticamente.
        * Autenticação de usuários (Login, Cadastro, etc.).
        * Storage para arquivos.

## ⚙️ Como Rodar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

```bash
# 1. Clone o repositório
git clone [https://github.com/luizbarboza/stocksync.git](https://github.com/luizbarboza/stocksync.git)

# 2. Navegue até o diretório do projeto
cd stocksync

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
# Renomeie o arquivo .env.example para .env.local
# e adicione as suas chaves do Supabase.
cp .env.example .env.local

# 5. Inicie o servidor de desenvolvimento
npm run dev