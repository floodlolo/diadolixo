// Dados dos avatares
const avatares = {
    1: { emoji: 'ea', nome: 'Edu G', sigla:"e" },
    2: { emoji: 'ka', nome: 'Karla Presley', sigla:"k" },
    3: { emoji: 'aa', nome: 'Tonhana Ana', sigla:"a" }
};

// Emojis para as cartas
const emojisCartas = ['1', '2', '3', '4', '5'];
const textosCarts = [
[
    "De uma chance pro amor, você merece ser amado independente de todas as armaduras que você veste tentando se convencer do contrario. Essas armaduras não te fazem forte só te fazem mais fraco. Sair pra dar uns beijinhos em um feio não vai te matar.",
    "CHEGA DE LOL!",
    "Você ja praticamente acabou de pagar sua mota, não acha que esta na hora de uma proxima conquista financeiramente grande?",
    "Você precisa se mexer, fazem 4 anos que a gente se conhece e 4 anos você esta na mesma vida de sempre. Plantar os mesmos frutos sempre vai resultar na mesma colheita, se arrisque mesmo que você quebre a cara pelo menos se arriscou",
    "Terapia ! Hobbies ! Terapia ! Autocuidado ! Terapia !"
],
[
    "Emagrecer não vai mudar a sua vida! Você vai ficar magra e com os mesmos problemas de sempre. A mudança que vc espera esta muito longe de estar no seu peso", 
    "Você é linda por dentro e por fora e já passou da hora de você notar pelo menos um pouquinho isso", 
    "Higiene na hora de cozinhar é o basico", 
    "De uma chance pro amor. Você é muito fechada e merece se levar menos a serio, quebrar a cara no amor forma carater e nos deixa pronto para as proximas.", 
    "Sua mãe é doente e você precisa aceitar isso de uma forma definitivamente não adianta aceitar hoje e amanha continuar nos mesmos ciclos da vida"],
[   
    "Hora de viajar né meu bem! Essa cidade é muito pequena pra você. Você já notou isso 932893844 vezes mas ainda não fez nada",
    "Mate a Beatriz e seu pai",
    "Saia da cama ! Acorde pra vida ! Eu te conheci você era um espirito vivo agora esta presa em trabalho, familia e afins. Você não deve nada a ninguem e se continuar assim vai continuar no mesmo caminho que o Eduardo....passa os anos e nada muda",
    "Um pedaço do cabelo da Karlinha pra você fazer aquela macumba",
    "Você cuida de todo mundo e de todos e não deixa ninguem cuidar de você, não acha que esta na hora de se deixar ser bobinha em um romancezinho do interior de piraju? Não vai te fazer menos machuda troncuda ombruda da voz de trovão"
]]

// Estado do jogo
let avatarSelecionado = null;
let cartas = [];
let cartaVirada = null;
let paresEncontrados = 0;
let tentativasFalhas = 0;
let pontuacao = 0;
let bloqueado = false;
let ranking = [];

// Selecionar avatar
function selecionarAvatar(id) {
    avatarSelecionado = id;
    
    // Atualizar visual
    document.querySelectorAll('.avatar-card').forEach(card => {
        card.classList.remove('selecionado');
    });
    
    document.querySelector(`.avatar-card[data-avatar="${id}"]`).classList.add('selecionado');
    
    // Habilitar botão
    document.getElementById('btn-iniciar').disabled = false;
}

// Iniciar jogo
function iniciarJogo() {
    if (!avatarSelecionado) return;
    
    // Resetar estado
    cartas = [];
    cartaVirada = null;
    paresEncontrados = 0;
    tentativasFalhas = 0;
    pontuacao = 0;
    bloqueado = false;
    
    // Criar pares de cartas
    const emojisDuplicados = [...emojisCartas, ...emojisCartas];
    cartas = emojisDuplicados.map((emoji, indice) => ({
        id: indice,
        emoji: emoji,
        virada: false,
        encontrada: false
    }));
    
    // Embaralhar cartas
    cartas = embaralhar(cartas);
    
    // Atualizar interface
    document.getElementById('avatar-atual').innerHTML = `<img src="./${avatares[avatarSelecionado].emoji}.png"">`;
    document.getElementById('nome-jogador').textContent = avatares[avatarSelecionado].nome;
    document.getElementById('pontos').textContent = '0';
    document.getElementById('pares-restantes').textContent = '5';
    document.getElementById('tentativas').textContent = '0';
    
    // Renderizar tabuleiro
    renderizarTabuleiro(avatarSelecionado);
    
    // Trocar tela
    document.getElementById('tela-inicial').classList.add('hidden');
    document.getElementById('tela-jogo').classList.remove('hidden');
}

// Embaralhar array (Fisher-Yates)
function embaralhar(array) {
    const arrayCopiado = [...array];
    for (let i = arrayCopiado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopiado[i], arrayCopiado[j]] = [arrayCopiado[j], arrayCopiado[i]];
    }
    return arrayCopiado;
}

// Renderizar tabuleiro
function renderizarTabuleiro(id) {
    const tabuleiro = document.getElementById('tabuleiro');
    tabuleiro.innerHTML = '';
    
    cartas.forEach((carta, indice) => {
        const elementoCarta = document.createElement('div');
        elementoCarta.className = 'carta carta-' + id;
        elementoCarta.dataset.indice = indice;
        
        if (carta.virada || carta.encontrada) {
             elementoCarta.innerHTML = `<img src="./${avatares[id].sigla}${carta.emoji}.png" alt="${carta.emoji}"/>`;
            
            elementoCarta.classList.add('virada');
        }
        
        if (carta.encontrada) {
            elementoCarta.classList.add('encontrada');
        }
        
        elementoCarta.onclick = () => virarCarta(indice);
        tabuleiro.appendChild(elementoCarta);
    });
}

// Virar carta
function virarCarta(indice) {
    if (bloqueado) return;
    
    const carta = cartas[indice];
    
    // Não pode virar carta já virada ou encontrada
    if (carta.virada || carta.encontrada) return;
    
    // Virar carta
    carta.virada = true;
    renderizarTabuleiro(avatarSelecionado);
    
    // Se não há carta virada, armazenar
    if (!cartaVirada) {
        cartaVirada = carta;
        return;
    }
    
    // Verificar se é par
    verificarPar(cartaVirada, carta);
}

// Verificar se é par
function verificarPar(carta1, carta2) {
    bloqueado = true;
    
    if (carta1.emoji === carta2.emoji) {
        // Par encontrado
        carta1.encontrada = true;
        carta2.encontrada = true;
        paresEncontrados++;
        
        // Calcular pontuação: 100 pontos por par - 10 pontos por tentativa falha
        pontuacao = (paresEncontrados * 100) - (tentativasFalhas * 10);
        
        document.getElementById('pontos').textContent = pontuacao;
        document.getElementById('pares-restantes').textContent = 5 - paresEncontrados;
        document.getElementById('tentativas').textContent = tentativasFalhas;
        
        cartaVirada = null;
        bloqueado = false;
        document.getElementById('tela-carta').classList.remove('hidden');
        exibirCartaTirada(carta1.emoji)
        // Verificar se jogo terminou
        if (paresEncontrados === 5) {
            setTimeout(finalizarJogo, 500);
        }
    } else {
        // Não é par - tentativa falha
        tentativasFalhas++;
        
        // Calcular pontuação atual
        pontuacao = (paresEncontrados * 100) - (tentativasFalhas * 10);
        
        document.getElementById('pontos').textContent = pontuacao;
        document.getElementById('tentativas').textContent = tentativasFalhas;
        
        setTimeout(() => {
            carta1.virada = false;
            carta2.virada = false;
            cartaVirada = null;
            bloqueado = false;
            renderizarTabuleiro(avatarSelecionado);
        }, 1000);
    }
}
function exibirCartaTirada(carta){
    console.log(avatarSelecionado)
    document.getElementById('carta-tirada').src = avatares[avatarSelecionado].sigla+carta+".png"
    document.getElementById('texto-carta-tirada').textContent = textosCarts[avatarSelecionado-1][carta-1];
}
function voltar() {
    document.getElementById('tela-carta').classList.add('hidden');
}

// Finalizar jogo
function finalizarJogo() {
    // Adicionar ao ranking
    ranking.push({
        avatar: avatares[avatarSelecionado].emoji,
        nome: avatares[avatarSelecionado].nome,
        pontos: pontuacao,
        tentativas: tentativasFalhas
    });
    
    // Ordenar ranking por pontuação
    ranking.sort((a, b) => b.pontos - a.pontos);
    
    // Atualizar tela de resultados
    document.getElementById('resultado-avatar').innerHTML = `<img src="./${avatares[avatarSelecionado].emoji}.png">`;
    document.getElementById('resultado-nome').textContent = avatares[avatarSelecionado].nome;
    document.getElementById('pontos-finais').textContent = pontuacao;
    
    // Renderizar ranking
    renderizarRanking();
    
    // Trocar tela
    document.getElementById('tela-jogo').classList.add('hidden');
    document.getElementById('tela-resultados').classList.remove('hidden');
}

// Renderizar ranking
function renderizarRanking() {
    const listaRanking = document.getElementById('lista-ranking');
    listaRanking.innerHTML = '';
    
    ranking.forEach((jogador, indice) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        
        item.innerHTML = `
            <div class="ranking-posicao">${indice + 1}º</div>
            <div class="ranking-info">
                <span class="ranking-avatar"><img src="./${jogador.avatar}.png"/></span>
                <span class="ranking-nome">${jogador.nome}</span>
            </div>
            <div class="ranking-stats">
                <div class="ranking-pontos">${jogador.pontos} pts</div>
                <div class="ranking-tentativas">${jogador.tentativas} erros</div>
            </div>
        `;
        
        listaRanking.appendChild(item);
    });
}

// Jogar novamente (mesmo jogador)
function jogarNovamente() {
    document.getElementById('tela-resultados').classList.add('hidden');
    iniciarJogo();
}

// Voltar à tela inicial (trocar jogador)
function voltarTelaInicial() {
    // Resetar seleção
    avatarSelecionado = null;
    document.querySelectorAll('.avatar-card').forEach(card => {
        card.classList.remove('selecionado');
    });
    document.getElementById('btn-iniciar').disabled = true;
    
    // Trocar tela
    document.getElementById('tela-jogo').classList.add('hidden');
    document.getElementById('tela-resultados').classList.add('hidden');
    document.getElementById('tela-inicial').classList.remove('hidden');
}
