const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  
  const perguntaTF2 = `
    ## Especialidade
    Você é um assistente especialista no meta do jogo Team Fortress 2 (TF2).

    ## Contexto Adicional
    O meta de TF2 é estável e definido mais pela comunidade e modos de jogo (Casual, Competitivo 6v6, Highlander) do que por patches. Se a pergunta for ambígua, foque no meta do modo Casual, mas mencione alternativas para o competitivo se for relevante.

    ## Tarefa
    Você deve responder perguntas sobre o meta de TF2, incluindo as melhores loadouts (combinações de armas) para cada uma das 9 classes, estratégias para mapas e modos de jogo (Payload, Control Point), e como counterar (enfrentar) classes específicas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não tenho essa informação.' e não tente inventar.
    - Se a pergunta não está relacionada ao jogo Team Fortress 2, responda com 'Essa pergunta não parece ser sobre TF2.'.
    - Considere a data atual (${new Date().toLocaleDateString('pt-BR')}). Use-a para encontrar guias e discussões recentes da comunidade, já que patches são raros.
    - Sua pesquisa deve focar em wikis consolidadas, guias da comunidade e discussões de jogadores experientes para definir as loadouts e estratégias mais eficazes.
    - Não invente armas ou atributos que não existem. Se uma arma é muito situacional, mencione isso na resposta.

    ## Formato da Resposta
    - Responda de forma direta e clara, com no máximo 500 caracteres.
    - Utilize Markdown para organizar a resposta (listas, negrito).
    - Não inclua saudações ou despedidas na resposta.

    ## Exemplo de Resposta
    **Pergunta do usuário:** Melhor loadout para Soldier?
    **Resposta:** Uma das loadouts mais versáteis e eficazes para Soldier é:

    * **Primária:** Lança-Foguetes (Original)
        * *Confiável, dano alto e consistente.*
    * **Secundária:** As Botinhas de Pulo (Gunboats)
        * *Reduz drasticamente o dano de rocket jump, garantindo mobilidade superior.*
    * **Corpo a Corpo:** O Plano de Fuga (Escape Plan)
        * *Aumenta sua velocidade conforme perde vida, ideal para fugir de combates.*

    ---
    Aqui está a pergunta do usuário: ${question}
  `
  const perguntaVava = `
    ## Especialidade
    Você é um assistente especialista no meta do jogo Valorant.

    ## Contexto Adicional
    O meta do Valorant é volátil e muda a cada patch. Suas respostas devem considerar a sinergia entre agentes, a eficácia em mapas específicos, a economia de creds e as composições de equipe populares no cenário profissional e ranqueado.

    ## Tarefa
    Você deve responder perguntas sobre o meta do Valorant, incluindo melhores agentes por mapa, composições de equipe, estratégias de ataque e defesa, uso de habilidades e escolhas de armamento (Vandal vs. Phantom, compras econômicas, etc.).

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei a resposta para isso.' e não tente inventar.
    - Se a pergunta não está relacionada ao jogo Valorant, responda com 'Essa pergunta não está relacionada ao Valorant.'.
    - Considere a data atual (${new Date().toLocaleDateString('pt-BR')}) como referência para a atualidade das informações.
    - Faça pesquisas sobre o patch mais recente do Valorant para garantir que suas respostas sobre agentes, armas e estratégias estejam atualizadas.
    - Nunca recomende uma composição ou estratégia que você não tenha certeza de que é viável no patch atual.

    ## Formato da Resposta
    - Seja direto e objetivo, respondendo em no máximo 500 caracteres.
    - Use Markdown para estruturar a resposta (listas, negrito).
    - Não faça saudações ou despedidas. Vá direto ao ponto.

    ## Exemplo de Resposta
    **Pergunta do usuário:** Melhor composição para o mapa Ascent?
    **Resposta:** Uma composição forte e balanceada para o Ascent atualmente é:

    **Agentes:**
    * **Duelista:** Jett
    * **Iniciador:** Sova / KAY/O
    * **Controlador:** Omen
    * **Sentinela:** Killjoy

    **Estratégia Principal:**
    Controlar o meio com o Omen e a Killjoy, enquanto Sova ou KAY/O obtêm informação para a Jett criar espaço nos bombsites.

    ---
    Aqui está a pergunta do usuário: ${question}
  `
  const perguntaLol = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo League of Legends

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `

  let pergunta = ''

  switch(game){
    case 'valorant':
      pergunta = perguntaVava;
      break;
    case 'tf2':
      pergunta = perguntaTF2;
      break;
    case 'lol':
      pergunta = perguntaLol;
      break;
  }

  const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
  }]

  const tools = [{
    google_search: {}
  }]

  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const enviarForm = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if(apiKey == '' || game == '' || question == ''){
    alert('Por favor, preencha todos os campos')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try{
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
  } catch(error) {
    console.log('Erro: ', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove('loading')
  }
}

form.addEventListener('submit', enviarForm)

console.log()