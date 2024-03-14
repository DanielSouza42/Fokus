//encontrar o botão "adicionar nova tarefa"
const btnAdicionarTarefa =  document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefaAndamento = document.querySelector('.app__section-active-task-description');
const btnApagarConcluidas = document.querySelector('#btn-remover-concluidas');
const btnApagarTodas = document.querySelector('#btn-remover-todas');



//lista contendo as tarefas: recupera se já tiver uma lista ou cria uma lista vazia.
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

//função responsável por alterar os valores no localStorage
function alterarStorage() {
    localStorage.setItem('tarefas' , JSON.stringify(tarefas))}


//função para criar o elemento visual da tarefa no HTML
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');


    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;


    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () =>{
        const novaDescricao = prompt('Nova descrição da tarefa:');
        if(novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            alterarStorage();
        }
    }



    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', './imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);
    if(tarefa.completa == true) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', true);
    }

    

    //Mostrar borda branca quando a tarefa é selecionada
    li.onclick = () => {
    //remove as bordas das tarefas ativas
    document.querySelectorAll('.app__section-task-list-item-active')
    .forEach(elemento => {
        elemento.classList.remove('app__section-task-list-item-active');
    })

    if(tarefaSelecionada == tarefa) {
        paragrafoDescricaoTarefaAndamento.textContent = '';
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return
    }


        tarefaSelecionada = tarefa;
        liTarefaSelecionada = li;
        
        //adiciona classe que define a borda da tarefa clicada
        paragrafoDescricaoTarefaAndamento.textContent = tarefa.descricao;
        li.classList.add('app__section-task-list-item-active')
    }
    
    
    return li;
} 

//função para esconder o formulário
function esconderFormulario() {
    textarea.value = '';
    formAdicionarTarefa.classList.toggle('hidden');
}

//botão adicionar tarefa fazendo aparecer e desaparecer o formulario
btnAdicionarTarefa.addEventListener('click' , () => {
    esconderFormulario()
})

//botão cancelar apaga o formulário e tira ele da tela
btnCancelar.addEventListener('click', () =>{
    
    esconderFormulario();
})


//apertar o botão de salvar tarefa
formAdicionarTarefa.addEventListener('submit' , (evento) =>{
    evento.preventDefault();
    const tarefa = {
        descricao: textarea.value
    };
    tarefas.push(tarefa);
    
    //adicionar a nova tarefa e exibir na tela imediatamente
    const elementoTarefa =  criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);

    //salvar a lista de tarefas no localStorage
    alterarStorage()


    //limpar o formulário e escondê-lo
    esconderFormulario()

    
})


//exibir todas as tarefas já salvas ao abrir ou atualizar a página
tarefas.forEach(tarefa => {
    const elementoTarefa =  criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
 })


 document.addEventListener('FocoFinalizado', () => {
    // debugger;
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        tarefaSelecionada.completa = true;
        alterarStorage();
}
 })


// //  Click do botão para apagar tarefas concluidas
//     btnApagarConcluidas.addEventListener('click', () => {
//         const seletor = 'app__section-task-list-item-complete';
//         document.querySelectorAll(`.${seletor}`).forEach(elemento =>{
//             elemento.remove();
//         })
//         tarefas = tarefas.filter(tarefa => !tarefa.completa);
//         alterarStorage();
//     })

// // Click do botão para apagar todas as tarefas
//     btnApagarTodas.addEventListener('click', () => {
//         const seletor2 = '.app__section-task-list-item';
//         document.querySelectorAll(seletor2).forEach(elemento =>{
//             elemento.remove();
//         })
//         tarefas = [];
//         alterarStorage();
//     })
            



//método alternativo para apagar concluídas/todas

const removerTarefas = (somenteCompletas) =>{
    const seletor = somenteCompletas ? 'app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento =>{
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
        alterarStorage();
}

btnApagarConcluidas.onclick = () => removerTarefas(true);
btnApagarTodas.onclick = () => removerTarefas(false);
