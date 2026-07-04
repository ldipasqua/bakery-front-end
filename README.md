# BAKERY - Front-end de Venda de Bolos

Este repositório contém o **front-end** da **API Bakery**, uma aplicação web desenvolvida para realizar encomendas de bolos de forma simples e intuitiva. 

Por meio desta interface, o usuário pode navegar pelo catálogo, simular valores e concluir seus pedidos de ponta a ponta.

---

## Funcionalidades Principais

Com esta interface, o usuário é capaz de:
* **Cadastrar-se** na plataforma;
* **Explorar o catálogo** de bolos disponíveis na base de dados;
* **Calcular automaticamente** o preço total do pedido antes de finalizar;
* **Realizar pedidos** de forma rápida;
* **Consultar o histórico**, a data agendada e o endereço de entrega das suas encomendas.

---

## Como Executar 

Para o funcionamento correto da interface, é necessário executar primeiramente a **API Bakery** (back-end). O passo a passo completo da API também está descrito no repositório [`bakery-api`](https://github.com/ldipasqua/bakery-api/blob/main/README.md).


Após iniciar o servidor da API, abra o arquivo `index.html` (localizado no diretório `front-end-bakery`) diretamente em seu navegador preferido.

---

## Fluxo de Navegação e Uso da Interface

Na página inicial, o usuário tem a opção de se cadastrar ou acessar a seção **"Meus Pedidos"** (disponível apenas para usuários já cadastrados). Ao clicar em **"Cadastre-se"**, o usuário é direcionado para a tela de cadastro.

![Tela Inicial do Front-end](/img/image.png)

![alt text](/img/image-2.png)

Após preencher os dados solicitados e clicar em **"Cadastrar"**, havendo sucesso no registro, o usuário é redirecionado para a tela do catálogo de produtos.

![Catálogo de Produtos](/img/image-3.png)

Na interface de produtos, o usuário pode visualizar o catálogo disponível, adicionar itens ao carrinho e calcular o valor total da compra. Em seguida, basta clicar em **"Fazer pedido"** para enviar a solicitação à API.

![Confirmação de Pedido](/img/image-4.png)

Se o pedido for processado com sucesso, uma mensagem de confirmação será exibida e a página de **"Pedido feito com sucesso"** será apresentada. Caso ocorra alguma falha, uma mensagem de erro indicará o problema.

![Histórico de Pedidos](/img/image-5.png)

A partir da tela de confirmação, o usuário pode retornar à página inicial (**Home**). Na área **"Meus Pedidos"**, é possível pesquisar pelo CPF para consultar o histórico completo de encomendas, visualizando detalhes como data agendada, endereço de entrega e o valor total de cada pedido.
