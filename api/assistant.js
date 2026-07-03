// Vercel Serverless Function - Assistente de IA do painel admin do LabSul
//
// Recebe um comando em linguagem natural do administrador, usa a OpenAI
// para transformar isso em uma acao estruturada (criar/atualizar/excluir
// cordel, livro ou evento) e SO grava no banco depois que o administrador
// confirmar explicitamente (campo confirm: true). Isso evita que a IA
// exclua ou altere algo por engano.
//
// Variaveis de ambiente necessarias (configurar no painel do Vercel,
// nunca direto no codigo):
//   OPENAI_API_KEY
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   ADMIN_TOKEN  (uma senha/token simples so para liberar o uso deste admin)

const TABELAS = {
    cordel: 'cordeis',
    livro: 'livros',
    evento: 'eventos'
};

const FERRAMENTA = {
    type: 'function',
    function: {
          name: 'gerenciar_conteudo',
          description: 'Cria, atualiza ou remove um cordel, livro ou evento do site do LabSul.',
          parameters: {
                  type: 'object',
                  properties: {
                            acao: { type: 'string', enum: ['criar', 'atualizar', 'excluir'] },
                            tipo: { type: 'string', enum: ['cordel', 'livro', 'evento'] },
                            titulo_atual: {
                                        type: 'string',
                                        description: 'Titulo usado para localizar o registro em caso de atualizacao ou exclusao.'
                            },
                            dados: {
                                        type: 'object',
                                        description: 'Campos a criar ou atualizar.',
                                        properties: {
                                                      titulo: { type: 'string' },
                                                      autor: { type: 'string' },
                                                      ano: { type: 'number' },
                                                      categoria: { type: 'string' },
                                                      descricao: { type: 'string' },
                                                      capa_url: { type: 'string' },
                                                      imagem_url: { type: 'string' },
                                                      data_evento: { type: 'string', description: 'Formato AAAA-MM-DD' },
                                                      horario: { type: 'string' },
                                                      local: { type: 'string' }
                                        }
                            }
                  },
                  required: ['acao', 'tipo']
          }
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
          res.status(405).json({ error: 'Metodo nao permitido' });
          return;
    }

  const tokenRecebido = req.headers['x-admin-token'];
    if (!process.env.ADMIN_TOKEN || tokenRecebido !== process.env.ADMIN_TOKEN) {
          res.status(401).json({ error: 'Nao autorizado' });
          return;
    }

  try {
        const { message, confirm, pendingAction } = req.body || {};

      if (confirm && pendingAction) {
              const resultado = await executarAcao(pendingAction);
              res.status(200).json({ status: 'ok', resultado });
              return;
      }

      if (!message) {
              res.status(400).json({ error: 'Campo message e obrigatorio' });
              return;
      }

      const acao = await interpretarComando(message);

      if (!acao) {
              res.status(200).json({
                        status: 'duvida',
                        resposta: 'Nao entendi o comando. Diga se e um cordel, livro ou evento, e o que deseja fazer.'
              });
              return;
      }

      res.status(200).json({
              status: 'confirmar',
              acao: acao,
              resumo: montarResumo(acao)
      });
  } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao processar o comando' });
  }
}

async function interpretarComando(message) {
    const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + process.env.OPENAI_API_KEY
          },
          body: JSON.stringify({
                  model: 'gpt-4o-mini',
                  messages: [
                    {
                                role: 'system',
                                content: 'Voce ajuda o administrador do site LabSul a cadastrar, atualizar ou remover cordeis, livros e eventos. Use sempre a ferramenta gerenciar_conteudo para estruturar a acao pedida. Nunca invente dados que o administrador nao informou.'
                    },
                    { role: 'user', content: message }
                          ],
                  tools: [FERRAMENTA],
                  tool_choice: 'required'
          })
    });

  const json = await resposta.json();
    const temChamada = json.choices &&
          json.choices[0] &&
          json.choices[0].message &&
          json.choices[0].message.tool_calls &&
          json.choices[0].message.tool_calls[0];

  if (!temChamada) return null;

  return JSON.parse(temChamada.function.arguments);
}

function montarResumo(acao) {
    const tabela = TABELAS[acao.tipo] || acao.tipo;
    if (acao.acao === 'excluir') {
          return 'Confirma excluir o ' + acao.tipo + ' "' + acao.titulo_atual + '" (tabela ' + tabela + ')?';
    }
    if (acao.acao === 'atualizar') {
          return 'Confirma atualizar o ' + acao.tipo + ' "' + acao.titulo_atual + '" com os novos dados informados?';
    }
    return 'Confirma criar um novo ' + acao.tipo + ' com os dados informados?';
}

async function executarAcao(acao) {
    const tabela = TABELAS[acao.tipo];
    if (!tabela) throw new Error('Tipo de conteudo desconhecido: ' + acao.tipo);

  const baseUrl = process.env.SUPABASE_URL + '/rest/v1/' + tabela;
    const headers = {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
    };

  let resposta;

  if (acao.acao === 'criar') {
        resposta = await fetch(baseUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(acao.dados)
        });
  }

  if (acao.acao === 'atualizar') {
        const filtro = '?titulo=eq.' + encodeURIComponent(acao.titulo_atual);
        resposta = await fetch(baseUrl + filtro, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(acao.dados)
        });
  }

  if (acao.acao === 'excluir') {
        const filtro = '?titulo=eq.' + encodeURIComponent(acao.titulo_atual);
        resposta = await fetch(baseUrl + filtro, {
                method: 'DELETE',
                headers: headers
        });
  }

  if (!resposta || !resposta.ok) {
        const texto = resposta ? await resposta.text() : 'acao invalida';
        throw new Error('Falha ao gravar no banco: ' + texto);
  }

  const resultado = await resposta.json().catch(function () {
        return null;
  });

  await fetch(process.env.SUPABASE_URL + '/rest/v1/admin_audit_log', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ acao: acao.acao, tabela: tabela, detalhes: acao })
  });

  return resultado;
}
