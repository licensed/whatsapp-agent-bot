# AtendeZap

Um jeito simples de criar um **agente de atendimento** para WhatsApp — sem precisar entender de API, código ou inteligência artificial.

O agente lê a mensagem do cliente e responde com o que você ensinou: horário, cardápio, endereço, preço. Se não souber, chama uma pessoa.

## O que este projeto faz

1. Explica, em português claro, o que é um agente e como o atendimento automático funciona.
2. Deixa você montar o agente em um assistente de 5 passos (tipo de negócio, nome, horário, perguntas, teste).
3. Tem uma caixa de entrada no estilo WhatsApp para treinar o atendimento.
4. Já traz uma pizzaria de exemplo, além de modelos para clínica, salão, loja e restaurante.
5. Inclui a rota `/api/whatsapp/webhook` para o handshake da Cloud API da Meta, quando você quiser ligar um número de verdade.

Você **não precisa** conectar o WhatsApp para usar. O simulador já responde.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:4317](http://localhost:4317).

## Publicar na Vercel (grátis)

O app é um Next.js comum. Na Vercel, importe o repositório GitHub `licensed/whatsapp-agent-bot`, deixe o framework como Next.js e publique. Não precisa de variável de ambiente.

## Como usar (mesmo se você nunca programou)

1. Clique em **Montar meu agente agora**.
2. Escolha o tipo de negócio. O app preenche um exemplo.
3. Troque os textos pelos seus (nome, horário, perguntas reais dos clientes).
4. No último passo, mande um “oi” como se fosse cliente.
5. No painel, abra **Conversas** para ver a caixa de entrada e **Meu agente** para ajustar as respostas.
6. Só depois leia **Ligar WhatsApp**. Esse passo pede conta Business na Meta e um número da empresa — não use o WhatsApp pessoal.

Tudo fica salvo neste navegador (`localStorage`). Limpar os dados do site apaga o agente.

## API

- `POST /api/agent/reply` — recebe `{ "text": "oi" }` e devolve a resposta do agente.
- `GET /api/whatsapp/webhook` — verificação da Meta (`hub.verify_token=ATENDEZAP`).
- `POST /api/whatsapp/webhook` — recebe o payload da Cloud API e responde em JSON. Enviar a mensagem de volta ao WhatsApp exige o token oficial da Meta.

## O que este recorte não faz

- Não envia mensagem para um número real sozinho.
- Não usa ChatGPT: as respostas vêm das perguntas que você cadastrou.
- Não guarda conversas num banco de dados (o painel vive no navegador).

Isso é de propósito: dá para aprender e testar o atendimento hoje, sem cadastro e sem cartão.
