const URL_API = "https://postman-echo.com/post";

function mascara(id, formato) {
    document.querySelector("#" + id).addEventListener("input", (e) => {
        const n = e.target.value.replace(/\D/g, "");
        let i = 0;
        e.target.value = formato
            .replace(/0/g, () => n[i++] ?? "")
            .replace(/\D+$/, "");
    });
}

mascara("cpf", "000.000.000-00");
mascara("telefone", "(00) 00000-0000");
mascara("cep", "00000-000");

function mostrarErro(id, mensagem) {
    const erro = document.querySelector("#erro-" + id);
    erro.textContent = mensagem;
    erro.classList.add("erro");
    erro.classList.remove("oculto");
}

function limparForm() {
    document.querySelectorAll(".erro").forEach((item) => {
        item.classList.remove("erro");
        item.classList.add("oculto");
    });
    document.querySelector("#concluido").classList.add("oculto");
}

async function executar(event) {
    event.preventDefault();
    limparForm();

    const valor = (id) => document.querySelector("#" + id).value.trim();
    const numeros = (id) => valor(id).replace(/\D/g, "");
    const idade = (Date.now() - new Date(valor("nascimento"))) / 31557600000;

    if (valor("nome").split(" ").length < 2) mostrarErro("nome", "Digite nome e sobrenome!");
    if (numeros("cpf").length !== 11) mostrarErro("cpf", "CPF inválido!");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor("email"))) mostrarErro("email", "Email inválido!");
    if (numeros("telefone").length < 10) mostrarErro("telefone", "Telefone inválido!");
    if (valor("nascimento") === "" || idade < 18) mostrarErro("nascimento", "É necessário ter 18 anos!");
    if (numeros("cep").length !== 8) mostrarErro("cep", "CEP inválido!");
    if (valor("cidade") === "") mostrarErro("cidade", "A cidade não pode estar vazia!");
    if (valor("estado") === "") mostrarErro("estado", "Selecione um estado!");
    if (valor("senha").length < 8) mostrarErro("senha", "A senha precisa ter 8 caracteres!");
    if (valor("confirmar-senha") !== valor("senha")) mostrarErro("confirmar-senha", "As senhas não são iguais!");
    if (!document.querySelector("#termos").checked) mostrarErro("termos", "É preciso aceitar os termos!");

    if (document.querySelectorAll(".erro").length > 0) return;

    // a senha não vai pra API
    const dados = {};
    ["nome", "cpf", "email", "telefone", "nascimento", "cep", "cidade", "estado"].forEach((id) => {
        dados[id] = valor(id);
    });

    try {
    const resposta = await fetch(URL_API, {
        method: "POST",
        body: new URLSearchParams(dados)
    });
    const retorno = await resposta.json();

        const concluido = document.querySelector("#concluido");
        concluido.textContent = "Cadastro concluído com sucesso!";
        concluido.classList.add("sucesso");
        concluido.classList.remove("oculto");

        alert(JSON.stringify(retorno, null, 2));
    } catch (erro) {
        alert("Erro ao enviar o formulário: " + erro.message);
    }
}
