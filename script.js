// Snapshot dos arquivos

// database.collection("dadosDoUsuário").get()
//     .then((snapshot) => {

//         snapshot.forEach((doc) => {
//             console.log(doc.data())
//         })
//     })
console.log("Tela de Login carregada")

let auth = firebase.auth()

//Inicializando variáveis e Coletando dados de Cadastro

let idadeNovaConta = ""
let nomeNovaConta = ""

$(".box2").hide();
$(".box3").hide();

let btnCadastro = document.getElementById("botaoCadastro")
$("#botaoCadastro").click(() => {

    // Variáveis com values dos inputs

    let inputNome = document.getElementById("nomeCadastro").value
    let inputEmail = document.getElementById("emailCadastro").value
    let inputIdade = document.getElementById("idadeCadastro").value
    let inputSenha = document.getElementById("senhaCadastro").value

    let boxCadastro = document.getElementById("bcadastro")

    //Pegando dados de cadastro para criar usuário.

    let emailNovaConta = inputEmail;
    let senhaNovaConta = inputSenha;

    idadeNovaConta = inputIdade;
    nomeNovaConta = inputNome;

    if (inputNome != ""
        && inputEmail != ""
        && inputIdade != ""
        && inputSenha != "") {
        auth.createUserWithEmailAndPassword(emailNovaConta, senhaNovaConta)
            .then(newUser => {
                $(".box1").fadeOut(2000)
                setTimeout(() => {
                    boxCadastro.style.display = "none"
                    $(".box2").fadeIn(1000)
                }, 1000)
                console.log(`Cadastro Completo`)
            }).catch(error => {
                console.log(error)
            })

        // Criando novo documento com informações do usuário
        // com base nos dados de login.
        database.collection("dadosDoUsuário").add({
            Nome: nomeNovaConta,
            idade: idadeNovaConta,
            email: emailNovaConta,
        }).then(doc => {
            console.log("Documento inserido com sucesso!")
            coletarId(doc.id)
        }).catch(err => {
            console.log(err)
        })

        idadeNome()
    } else {
        console.log("Houve algum erro!")
        $("#cadastroErro").text("Preencha todos os campos, por favor!")
            .css({
                "color": "red"
            })
    }

})

// Pegando o Id do usuário criado e mostrando no console.

let id = ""
function coletarId(userId) {
    id = userId
}

// Pegando o Idade e Nome do usuário criado e mostrando no console.
function idadeNome() {
    console.log(nomeNovaConta)
    console.log(idadeNovaConta)
}


// Criando botão de Login e função para executar o Login
let btnLogin = document.getElementById("botaoLogin")

btnLogin.addEventListener("click", () => {
    //Pegando values dos inputs de login

    let inputEmail = document.getElementById("emailCadastro").value
    let inputSenha = document.getElementById("senhaCadastro").value

    let emailToLogin = document.getElementById("emailLogin").value
    let senhaToLogin = document.getElementById("senhaLogin").value

    if (emailToLogin != "" && senhaToLogin != "") {
        //Fazendo Login
        if (inputEmail === emailToLogin && inputSenha === senhaToLogin) {
            auth.setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
                auth.signInWithEmailAndPassword(emailToLogin, senhaToLogin)
                    .then(loggedUser => {
                        console.log(auth.currentUser)
                    }).catch(error => {
                        console.log(error)
                    })
            })
            let userDoc = database.collection("dadosDoUsuário").doc(id);

            userDoc.get().then((doc) => {
                let boxLogin = document.getElementById("blogin")

                // Inserindo dados de Login no container de informações.
                let infoP = document.getElementsByTagName("p")
                // infoP de index [0] e [1] são a mensagem de erro da tela de cadastro e login.
                infoP[2].textContent = doc.data().Nome;
                infoP[3].textContent = doc.data().email;
                infoP[4].textContent = doc.data().idade;

                $(".box2").fadeOut(2000)
                boxLogin.style.display = "none"
                $(".box3").fadeIn(1000)
            })
        } else {
            $("#loginErro").css({
                "color": "red"
            })
            $("#loginErro").text("E-mail ou senha incorretos!")

        }
    } else {
        $("#loginErro").css({
            "color": "red"
        })
        $("#loginErro").text("Você deve preencher todos os campos!")
    }
})
