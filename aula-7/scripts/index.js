function executar(event) {
    event.preventDefault();

    alert("Formulário enviado com sucesso!");

    const nome = document.querySelector("#nome").value;
    alert(nome);
}