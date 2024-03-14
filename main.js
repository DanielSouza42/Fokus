const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt =  document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('sons/luna-rise-part-one.mp3');
musica.loop = true;
const iniciarOuPausarBT = document.querySelector('#start-pause span');
const startPauseIcon = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
const startPauseBt = document.querySelector('#start-pause');
const audioIniciar = new Audio('sons/play.wav');
const audioPausar = new Audio('sons/pause.mp3');
const audioFinalizar = new Audio('sons/beep.mp3');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
        }
})

function alterarContexto (contexto) {
    mostrarTempo();
    botoes.forEach(function(whatever) {
        whatever.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
        break;
        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada? <br> <strong class="app__title-strong"> Faça uma pausa curta!</strong>`
        break;
        case 'descanso-longo':
        titulo.innerHTML = `Hora de voltar à superfície.
        <br> <strong class="app__title-strong"> Faça uma pausa longa.</strong>`
        break;
        default:
            break;
    }
}

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
    
    
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
    
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');

})

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <=0) {
        audioFinalizar.play();
        // debugger
        alert('tempo finalizado');
        
        
        const FocoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (FocoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }


        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}


startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar(){
    if(intervaloId) {
        
        audioPausar.play();
        zerar();
        return;
    }
    audioIniciar.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBT.textContent = "Pausar";
    startPauseIcon.src = "imagens/pause.png";
}

function zerar () {
    iniciarOuPausarBT.textContent = "Começar";
    // startPauseIcon.src = "imagens/play_arrow.png";
    startPauseIcon.setAttribute('src', 'imagens/play_arrow.png');
    clearInterval(intervaloId);
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
