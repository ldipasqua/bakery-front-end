/*
  ----------------------------------------------------------------------------------------
                                          CLIENTES
 -----------------------------------------------------------------------------------------
/*
  --------------------------------------------------------------------------------------
  Função para cadastrar um novo cliente no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/

const postClient = async (inputNome, inputCpf, inputCelular, inputEndereco, inputEmail) => {
    const formData = new FormData();
    formData.append('nome', inputNome);
    formData.append('cpf', inputCpf);
    formData.append('celular', inputCelular);
    formData.append('endereco', inputEndereco);
    formData.append('email', inputEmail);

    let url = 'http://127.0.0.1:5000/cliente';
    return await fetch(url, {
        method: 'post',
        body: formData
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo cliente com nome, cpf, celular, endereço e e-mail 
  --------------------------------------------------------------------------------------
*/

const newClient = async () => {
    let inputNome = document.getElementById("newNome").value;
    let inputCpf = document.getElementById("newCpf").value;
    let inputCelular = document.getElementById("newCelular").value;
    let inputEndereco = document.getElementById("newEndereco").value;
    let inputEmail = document.getElementById("newEmail").value;

    if (inputNome === '' || inputCpf === '' || inputCelular === '' || inputEndereco === '' || inputEmail === '') {
        alert("Nome, CPF, celular, endereço e e-mail precisam ser preenchidos!");
        return;
    }
    try {
        // usando 'await' para esperar a resposta do servidor
        const resposta = await postClient(inputNome, inputCpf, inputCelular, inputEndereco, inputEmail);

        if (resposta.ok) {
            localStorage.setItem('clienteCpf', inputCpf);
            alert("Cliente cadastrado com sucesso!");
            window.location.href = "produtos.html";
        } else {
            const dadosErro = await resposta.json();
            alert("Erro ao cadastrar: " + dadosErro.message);
        }
    } catch (error) {
        alert("Não foi possível conectar ao servidor.");
    }
}

/*
  --------------------------------------------------------------------------------------
                                            PRODUTOS
 --------------------------------------------------------------------------------------
/*
  --------------------------------------------------------------------------------------
  Função para carregar os produtos disponíveis no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async () => {
    let url = 'http://127.0.0.1:5000/produtos';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            data.produtos.forEach(item => insertList(item.nome, item.sabor, item.tamanho, item.fatias, item.valor))
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// /*
//   --------------------------------------------------------------------------------------
//   Chamada da função para carregamento inicial dos produtos cadastrados na base de dados.
//   --------------------------------------------------------------------------------------
// */

getList()

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (nome, sabor, tamanho, fatias, valor, unidades) => {
    var item = [unidades, nome, sabor, tamanho, fatias, valor]
    var table = document.getElementById('lista-produtos');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = item[i];

        if (i === 0) {
            var input = document.createElement('input');
            input.type = 'number';
            input.value = item[i];
            input.min = 0;
            input.classList.add('input-unidades');

            let precoProduto = parseFloat(valor.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
            input.dataset.preco = precoProduto;

            cel.appendChild(input);
        } else {
            cel.textContent = item[i];
        }
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para calcular preço total do pedido
  --------------------------------------------------------------------------------------
*/

const calcularPrecoPedido = () => {
    const inputs = document.querySelectorAll('.input-unidades');
    let precoTotal = 0;

    inputs.forEach(input => {
        const quantidade = parseInt(input.value) || 0; // Igual a zero se o valor estiver vazio
        const preco = parseFloat(input.dataset.preco) || 0; // Resgata o preço salvo na base

        precoTotal += quantidade * preco;
    });

    // O preço final vai ser formatado na moeda local (Reais)
    document.getElementById('preco-total').textContent =
        precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/*
  --------------------------------------------------------------------------------------
                                            PEDIDOS
 --------------------------------------------------------------------------------------
*/
/*
  --------------------------------------------------------------------------------------
  Função para cadastrar um novo pedido no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postPedido = async (clienteCpf, precoTotal) => {
    const formData = new FormData();
    formData.append('cpf_cliente', clienteCpf);
    formData.append('preco_final', precoTotal);

    let url = 'http://127.0.0.1:5000/pedido';

    try {
        let response = await fetch(url, {
            method: 'post',
            body: formData
        });

        if (response.ok) {
            return true; // Retorna verdadeiro se o backend aceitou o pedido
        } else {
            let errorData = await response.json();
            alert("Erro ao salvar pedido: " + (errorData.mesage || "Erro desconhecido"));
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Erro de conexão com o servidor.");
        return false;
    }
}

const newPedido = async () => {
    // Recuperamos o CPF que já salvamos ao cadastrar o cliente
    let clienteCpf = localStorage.getItem('clienteCpf');

    if (!clienteCpf) {
        alert("Erro: Cliente não identificado. Por favor, faça o cadastro novamente.");
        window.location.href = "clientes.html"; // Altera para o nome real da página de cadastro
        return;
    }

    let precoTexto = document.getElementById('preco-total').textContent;
    let precoTotal = parseFloat(precoTexto.replace(/[^\d.,]/g, '').replace(',', '.'));

    if (isNaN(precoTotal) || precoTotal <= 0) {
        alert("Por favor, adicione produtos ao carrinho antes de finalizar.");
        return;
    }

    let pedidoSucesso = await postPedido(clienteCpf, precoTotal);

    if (pedidoSucesso) {
        alert("Pedido realizado com sucesso!");
        window.location.href = "index.html";
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar os pedidos do cliente
  --------------------------------------------------------------------------------------
*/

const getListPedidos = async (cpf = '') => {
    // Valida se o CPF foi preenchido
    if (!cpf) {
        alert("Por favor, digite um CPF para buscar os pedidos.");
        limparTabelaPedidos();
        return;
    }

    let url = `http://127.0.0.1:5000/pedidos?cpf_cliente=${encodeURIComponent(cpf)}`;

    // Antes de fazer a busca, limpamos as linhas antigas da tabela (para não acumular)
    limparTabelaPedidos();

    fetch(url, {
        method: 'get',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Nenhum pedido encontrado ou erro na requisição');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            data.pedidos.forEach(item => insertListPedidos(item.cpf_cliente, item.preco_final, item.data_insercao, item.endereco_entrega));
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Não foram encontrados pedidos para o CPF informado.');
        });
}

// /*
//   --------------------------------------------------------------------------------------
//   Chamada da função para carregamento inicial dos dados
//   --------------------------------------------------------------------------------------
// */

const buscarPedidosCliente = () => {
    const inputCpf = document.getElementById('busca-cpf').value.trim();

    // Chama a busca passando o CPF digitado pelo usuário
    getListPedidos(inputCpf);
}

/* --------------------------------------------------------------------------------------
  Função auxiliar para limpar as linhas da tabela antes de uma nova busca
  --------------------------------------------------------------------------------------
*/
const limparTabelaPedidos = () => {
    var table = document.getElementById('lista-pedidos');
    // Mantém a primeira linha (índice 0) se ela for o cabeçalho (Th)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
// */

const insertListPedidos = (cpf_cliente, preco_final, data_insercao, endereco_entrega) => {

    let dataPedidoObj;
    if (data_insercao) {
        // Divide o formato YYYY-MM-DD para evitar ajuste de fuso horário (UTC) que reduz 1 dia
        const partes = data_insercao.split('T')[0].split('-');
        if (partes.length === 3) {
            dataPedidoObj = new Date(partes[0], partes[1] - 1, partes[2]);
        } else {
            dataPedidoObj = new Date(data_insercao);
        }
    } else {
        dataPedidoObj = new Date();
    }

    const dataPedidoFormatada = dataPedidoObj.toLocaleDateString('pt-BR');

    const dataEntregaObj = new Date(dataPedidoObj);
    dataEntregaObj.setDate(dataEntregaObj.getDate() + 7);
    const dataEntregaFormatada = dataEntregaObj.toLocaleDateString('pt-BR');

    var item = [cpf_cliente, preco_final, dataPedidoFormatada, dataEntregaFormatada, endereco_entrega || "Não informado"];

    var table = document.getElementById('lista-pedidos');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);

        if (i === 1) {
            // Coluna 1: Preço Final formatado como moeda (R$)
            cel.textContent = `R$ ${parseFloat(item[i]).toFixed(2)}`;
        } else {
            // Demais colunas (CPF, Datas e Endereço): Texto fixo
            cel.textContent = item[i];
        }
    }
}