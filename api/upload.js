// Vercel Serverless Function - Upload de imagens do painel admin do LabSul
//
// Recebe uma imagem em base64 e envia para o Supabase Storage.
// Devolve a URL publica da imagem, que pode ser usada como capa do
// cordel/livro ou imagem do evento.
//
// Variaveis de ambiente necessarias:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   ADMIN_TOKEN
//
// Antes de usar, crie um bucket publico chamado "imagens" no Supabase Storage.

export const config = {
    api: {
          bodyParser: {
                  sizeLimit: '8mb'
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
        const { fileBase64, fileName, contentType } = req.body || {};
        if (!fileBase64 || !fileName) {
                res.status(400).json({ error: 'Envie fileBase64 e fileName' });
                return;
        }

      const nomeSeguro = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const caminho = Date.now() + '-' + nomeSeguro;
        const bucket = 'imagens';
        const buffer = Buffer.from(fileBase64, 'base64');

      const resposta = await fetch(
              process.env.SUPABASE_URL + '/storage/v1/object/' + bucket + '/' + caminho,
        {
                  method: 'POST',
                  headers: {
                              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                              Authorization: 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
                              'Content-Type': contentType || 'application/octet-stream'
                  },
                  body: buffer
        }
            );

      if (!resposta.ok) {
              const texto = await resposta.text();
              throw new Error('Falha no upload: ' + texto);
      }

      const urlPublica = process.env.SUPABASE_URL + '/storage/v1/object/public/' + bucket + '/' + caminho;
        res.status(200).json({ url: urlPublica });
  } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao enviar imagem' });
  }
}
