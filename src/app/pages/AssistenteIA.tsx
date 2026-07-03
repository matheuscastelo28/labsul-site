import React, { useState } from 'react';

// Pagina "Assistente IA" do painel administrativo do LabSul.
// O administrador digita um comando em linguagem natural (ex: "Adicione
// o cordel X, autor Y..."), a IA interpreta, mostra um resumo para
// confirmacao e so grava no banco depois que o administrador confirmar.
//
// Observacao: esta pagina usa React.createElement em vez de JSX de
// proposito, para evitar problemas de edicao automatica de tags.
//
// Esta pagina nao faz parte do fluxo publico do site: acesse manualmente
// pela rota configurada (ver instrucoes no README) e proteja o link.

const e = React.createElement;

type Mensagem = {
    autor: 'admin' | 'ia';
    texto: string;
};

type AcaoPendente = {
    acao: string;
    tipo: string;
    titulo_atual?: string;
    dados?: Record<string, unknown>;
};

export default function AssistenteIA() {
    const [token, setToken] = useState<string>(function () {
          return localStorage.getItem('labsul_admin_token') || '';
    });
    const [tokenInput, setTokenInput] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [historico, setHistorico] = useState<Mensagem[]>([]);
    const [pendente, setPendente] = useState<AcaoPendente | null>(null);
    const [resumo, setResumo] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [ultimaImagemUrl, setUltimaImagemUrl] = useState('');

  function salvarToken() {
        localStorage.setItem('labsul_admin_token', tokenInput);
        setToken(tokenInput);
  }

  function sair() {
        localStorage.removeItem('labsul_admin_token');
        setToken('');
  }

  async function enviarMensagem() {
        if (!mensagem.trim()) return;
        const textoEnviado = mensagem;
        setHistorico(function (atual) {
                return atual.concat([{ autor: 'admin', texto: textoEnviado }]);
        });
        setMensagem('');
        setCarregando(true);

      try {
              const resposta = await fetch('/api/assistant', {
                        method: 'POST',
                        headers: {
                                    'Content-Type': 'application/json',
                                    'x-admin-token': token
                        },
                        body: JSON.stringify({ message: textoEnviado })
              });
              const json = await resposta.json();

          if (json.status === 'confirmar') {
                    setPendente(json.acao);
                    setResumo(json.resumo);
                    setHistorico(function (atual) {
                                return atual.concat([{ autor: 'ia', texto: json.resumo }]);
                    });
          } else if (json.status === 'duvida') {
                    setHistorico(function (atual) {
                                return atual.concat([{ autor: 'ia', texto: json.resposta }]);
                    });
          } else {
                    setHistorico(function (atual) {
                                return atual.concat([{ autor: 'ia', texto: 'Nao foi possivel entender o comando.' }]);
                    });
          }
      } catch (erro) {
              setHistorico(function (atual) {
                        return atual.concat([{ autor: 'ia', texto: 'Erro ao falar com o assistente. Tente novamente.' }]);
              });
      } finally {
              setCarregando(false);
      }
  }

  async function confirmarAcao() {
        if (!pendente) return;
        setCarregando(true);
        try {
                const resposta = await fetch('/api/assistant', {
                          method: 'POST',
                          headers: {
                                      'Content-Type': 'application/json',
                                      'x-admin-token': token
                          },
                          body: JSON.stringify({ confirm: true, pendingAction: pendente })
                });
                const json = await resposta.json();

          if (json.status === 'ok') {
                    setHistorico(function (atual) {
                                return atual.concat([{ autor: 'ia', texto: 'Pronto! Alteracao salva com sucesso.' }]);
                    });
          } else {
                    setHistorico(function (atual) {
                                return atual.concat([{ autor: 'ia', texto: 'Nao consegui salvar. Tente novamente.' }]);
                    });
          }
        } catch (erro) {
                setHistorico(function (atual) {
                          return atual.concat([{ autor: 'ia', texto: 'Erro ao salvar a alteracao.' }]);
                });
        } finally {
                setPendente(null);
                setResumo('');
                setCarregando(false);
        }
  }

  function cancelarAcao() {
        setPendente(null);
        setResumo('');
        setHistorico(function (atual) {
                return atual.concat([{ autor: 'ia', texto: 'Acao cancelada.' }]);
        });
  }

  function lerArquivoComoBase64(arquivo: File): Promise<string> {
        return new Promise(function (resolve, reject) {
                const leitor = new FileReader();
                leitor.onload = function () {
                          const resultado = String(leitor.result || '');
                          resolve(resultado.split(',')[1] || '');
                };
                leitor.onerror = reject;
                leitor.readAsDataURL(arquivo);
        });
  }

  async function enviarImagem(evento: any) {
        const arquivo = evento.target.files && evento.target.files[0];
        if (!arquivo) return;
        setCarregando(true);
        try {
                const base64 = await lerArquivoComoBase64(arquivo);
                const resposta = await fetch('/api/upload', {
                          method: 'POST',
                          headers: {
                                      'Content-Type': 'application/json',
                                      'x-admin-token': token
                          },
                          body: JSON.stringify({
                                      fileBase64: base64,
                                      fileName: arquivo.name,
                                      contentType: arquivo.type
                          })
                });
                const json = await resposta.json();
                if (json.url) {
                          setUltimaImagemUrl(json.url);
                          setMensagem(function (atual) {
                                      return (atual ? atual + ' ' : '') + 'Imagem: ' + json.url;
                          });
                }
        } catch (erro) {
                setHistorico(function (atual) {
                          return atual.concat([{ autor: 'ia', texto: 'Erro ao enviar a imagem.' }]);
                });
        } finally {
                setCarregando(false);
        }
  }

  if (!token) {
        return e(
                'div',
          { className: 'min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 p-4' },
                e(
                          'div',
                  { className: 'w-full max-w-sm space-y-4' },
                          e('h1', { className: 'text-xl font-semibold' }, 'Assistente IA - LabSul'),
                          e('p', { className: 'text-sm text-neutral-400' }, 'Informe o token de acesso do administrador para continuar.'),
                          e('input', {
                                      type: 'password',
                                      value: tokenInput,
                                      onChange: function (ev: any) { setTokenInput(ev.target.value); },
                                      placeholder: 'Token de administrador',
                                      className: 'w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm'
                          }),
                          e(
                                      'button',
                            {
                                          onClick: salvarToken,
                                          className: 'w-full rounded bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500'
                            },
                                      'Entrar'
                                    )
                        )
              );
  }

  const listaMensagens = historico.map(function (item, indice) {
        return e(
                'div',
          {
                    key: indice,
                    className: item.autor === 'admin'
                      ? 'ml-auto max-w-md rounded-lg bg-emerald-700 px-3 py-2 text-sm'
                                : 'mr-auto max-w-md rounded-lg bg-neutral-800 px-3 py-2 text-sm'
          },
                item.texto
              );
  });

  const blocoConfirmacao = pendente
      ? e(
                'div',
        { className: 'mr-auto max-w-md rounded-lg border border-amber-600 bg-neutral-900 px-3 py-2 text-sm space-y-2' },
                e('p', null, resumo),
                e(
                            'div',
                  { className: 'flex gap-2' },
                            e(
                                          'button',
                              {
                                              onClick: confirmarAcao,
                                              disabled: carregando,
                                              className: 'rounded bg-emerald-600 px-3 py-1 text-xs font-medium hover:bg-emerald-500'
                              },
                                          'Confirmar'
                                        ),
                            e(
                                          'button',
                              {
                                              onClick: cancelarAcao,
                                              disabled: carregando,
                                              className: 'rounded bg-neutral-700 px-3 py-1 text-xs font-medium hover:bg-neutral-600'
                              },
                                          'Cancelar'
                                        )
                          )
              )
        : null;

  return e(
        'div',
    { className: 'min-h-screen flex flex-col bg-neutral-950 text-neutral-100' },
        e(
                'header',
          { className: 'flex items-center justify-between border-b border-neutral-800 px-4 py-3' },
                e('h1', { className: 'text-lg font-semibold' }, 'Assistente IA - LabSul'),
                e('button', { onClick: sair, className: 'text-sm text-neutral-400 hover:text-neutral-200' }, 'Sair')
              ),
        e(
                'main',
          { className: 'flex-1 overflow-y-auto p-4 space-y-3' },
                historico.length === 0
                  ? e(
                                'p',
                    { className: 'text-sm text-neutral-500' },
                                'Descreva o que deseja fazer, por exemplo: Adicione um cordel chamado A Vida no Sertao, autor Joao Silva, publicado em 2026, descricao...'
                              )
                  : null,
                listaMensagens,
                blocoConfirmacao
              ),
        e(
                'footer',
          { className: 'border-t border-neutral-800 p-3 space-y-2' },
                ultimaImagemUrl
                  ? e('p', { className: 'text-xs text-neutral-500' }, 'Ultima imagem enviada: ' + ultimaImagemUrl)
                  : null,
                e(
                          'div',
                  { className: 'flex items-center gap-2' },
                          e(
                                      'label',
                            { className: 'cursor-pointer rounded bg-neutral-800 px-3 py-2 text-xs hover:bg-neutral-700' },
                                      'Imagem',
                                      e('input', {
                                                    type: 'file',
                                                    accept: 'image/*',
                                                    onChange: enviarImagem,
                                                    className: 'hidden'
                                      })
                                    ),
                          e('input', {
                                      type: 'text',
                                      value: mensagem,
                                      onChange: function (ev: any) { setMensagem(ev.target.value); },
                                      onKeyDown: function (ev: any) { if (ev.key === 'Enter') enviarMensagem(); },
                                      placeholder: 'Digite um comando...',
                                      className: 'flex-1 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm'
                          }),
                          e(
                                      'button',
                            {
                                          onClick: enviarMensagem,
                                          disabled: carregando,
                                          className: 'rounded bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50'
                            },
                                      carregando ? '...' : 'Enviar'
                                    )
                        )
              )
      );
}
