// Cole sua URL e Chave Anon do Supabase aqui
const SUPABASE_URL = 'SUA_URL_DO_PROJETO';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_PUBLICA';

// Inicializa o cliente do Supabase
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Seleciona os elementos do placar na tela
const scoreEkballoElement = document.getElementById('score-ekballo');
const scoreShalomElement = document.getElementById('score-shalom');

// --- 1. Carrega os placares iniciais ao abrir a página ---
async function fetchInitialScores() {
    const { data, error } = await supabase.from('placares').select();
    if (error) {
        console.error("Erro ao buscar placares:", error);
        return;
    }
    data.forEach(placar => {
        if (placar.time === 'ekballo') {
            scoreEkballoElement.textContent = placar.pontos;
        } else if (placar.time === 'shalom') {
            scoreShalomElement.textContent = placar.pontos;
        }
    });
}

// --- 2. Escuta por mudanças em tempo real ---
function subscribeToChanges() {
    supabase.channel('placares_changes')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'placares' },
            (payload) => {
                const placarAtualizado = payload.new;
                if (placarAtualizado.time === 'ekballo') {
                    scoreEkballoElement.textContent = placarAtualizado.pontos;
                } else if (placarAtualizado.time === 'shalom') {
                    scoreShalomElement.textContent = placarAtualizado.pontos;
                }
            }
        )
        .subscribe();
}

// --- Executa as funções ao carregar a página ---
fetchInitialScores();
subscribeToChanges();