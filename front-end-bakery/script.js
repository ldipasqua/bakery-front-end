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
            // Se o Flask retornar status 200 (Sucesso)
            localStorage.setItem('clienteCpf', inputCpf);
            alert("Cliente cadastrado com sucesso!");
            window.location.href = "produtos.html";
        } else {
            // Se o Flask retornar status 409 ou 400 (Erro)
            const dadosErro = await resposta.json();
            alert("Erro ao cadastrar: " + dadosErro.message);
        }
    } catch (error) {
        // Se houver uma falha de rede ou o servidor estiver desligado
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

            input.style.width = '60px';
            input.style.textAlign = 'center';
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
            return true; // Retorna verdadero si el backend aceptó el pedido
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
    // 1. Recuperamos el CPF que ya guardamos al registrar al cliente
    let clienteCpf = localStorage.getItem('clienteCpf');

    if (!clienteCpf) {
        alert("Erro: Cliente não identificado. Por favor, faça o cadastro novamente.");
        window.location.href = "cadastro.html"; // Cambia al nombre real de tu página de registro
        return;
    }

    // 2. Capturamos el texto del precio y lo convertimos a un número flotante válido (ej: "R$ 25,50" -> 25.50)
    let precoTexto = document.getElementById('preco-total').textContent;
    let precoTotal = parseFloat(precoTexto.replace(/[^\d.,]/g, '').replace(',', '.'));

    if (isNaN(precoTotal) || precoTotal <= 0) {
        alert("Por favor, adicione produtos ao carrinho antes de finalizar.");
        return;
    }

    // 3. Llamamos a la función de envío y ESPERAMOS (await) la respuesta del servidor
    let pedidoSucesso = await postPedido(clienteCpf, precoTotal);

    // 4. Si el servidor respondió con éxito, redirigimos al usuario
    if (pedidoSucesso) {
        alert("Pedido realizado com sucesso!");
        window.location.href = "pedido_sucesso.html";
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar os pedidos do cliente
  --------------------------------------------------------------------------------------
*/

const getListPedidos = async (cpf = '') => {
    // Se um CPF foi passado, adicionamos ele como parâmetro 'cpf_cliente' na URL
    let url = 'http://127.0.0.1:5000/pedidos';
    if (cpf) {
        url += `?cpf_cliente=${encodeURIComponent(cpf)}`;
    }

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

            // Tratamento caso o backend retorne a lista direto ou dentro de um objeto
            const lista = data.pedidos ? data.pedidos : data;

            if (Array.isArray(lista)) {
                lista.forEach(item => insertListPedidos(item.cpf_cliente, item.preco_final, item.data_insercao, item.endereco_entrega));
            }
        })
        .catch((error) => {
            console.error('Error:', error);

            // SÓ exibe o alerta se o usuário realmente digitou um CPF para buscar
            if (cpf) {
                alert('Não foram encontrados pedidos para o CPF informado.');
            }
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

    const dataPedidoObj = data_insercao ? new Date(data_insercao) : new Date();
    const dataPedidoFormatada = dataPedidoObj.toLocaleDateString('pt-BR');


    const dataEntregaObj = new Date(dataPedidoObj);
    dataEntregaObj.setDate(dataEntregaObj.getDate() + 7);
    const dataEntregaFormatada = dataEntregaObj.toLocaleDateString('pt-BR');

    var item = [cpf_cliente, preco_final, dataPedidoFormatada, dataEntregaFormatada, endereco_entrega || "Não informado"];

    var table = document.getElementById('lista-pedidos');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);

        if (i === 0) {
            // Coluna 0: CPF em formato de input
            var input = document.createElement('input');
            input.type = 'text';
            input.value = item[i];
            input.classList.add('input-unidades');
            input.style.width = '120px';
            input.style.textAlign = 'center';
            cel.appendChild(input);
        } else if (i === 1) {
            // Coluna 1: Preço Final formatado como moeda (R$)
            cel.textContent = `R$ ${parseFloat(item[i]).toFixed(2)}`;
        } else {
            // Colunas 2 e 3: Exibe as datas de Pedido e Entrega formatadas
            cel.textContent = item[i];
        }
    }
}