import type { AgentConfig, BusinessType, Faq } from "./types";
import { closedDay, openDay } from "./hours";

function faq(id: string, question: string, answer: string): Faq {
  return { id, question, answer };
}

function week(open: string, close: string, closed: string[] = []) {
  return {
    seg: closed.includes("seg") ? closedDay() : openDay(open, close),
    ter: closed.includes("ter") ? closedDay() : openDay(open, close),
    qua: closed.includes("qua") ? closedDay() : openDay(open, close),
    qui: closed.includes("qui") ? closedDay() : openDay(open, close),
    sex: closed.includes("sex") ? closedDay() : openDay(open, close),
    sab: closed.includes("sab") ? closedDay() : openDay(open, close),
    dom: closed.includes("dom") ? closedDay() : openDay(open, close),
  } as AgentConfig["hours"];
}

export const BUSINESS_TYPES: {
  id: BusinessType;
  label: string;
  hint: string;
}[] = [
  {
    id: "pizzaria",
    label: "Pizzaria / delivery",
    hint: "Cardápio, pedido e tempo de entrega",
  },
  {
    id: "restaurante",
    label: "Restaurante",
    hint: "Reservas, cardápio e horário",
  },
  {
    id: "clinica",
    label: "Clínica / consultório",
    hint: "Agendamento, convênios e endereço",
  },
  {
    id: "salao",
    label: "Salão / estética",
    hint: "Horários, serviços e preços",
  },
  { id: "loja", label: "Loja", hint: "Produtos, troca e formas de pagamento" },
  { id: "outro", label: "Outro tipo de negócio", hint: "Você monta as respostas" },
];

export function createDefaultAgent(type: BusinessType = "pizzaria"): AgentConfig {
  const base = {
    timezone: "America/Sao_Paulo",
    agentName: "Luna",
    city: "São Paulo",
    handoffMessage:
      "Sem problema. Vou chamar alguém da equipe para continuar essa conversa com você, tá bem?",
  };

  if (type === "clinica") {
    return {
      ...base,
      businessType: type,
      businessName: "Clínica Vida Clara",
      greeting:
        "Sou a Luna, da Clínica Vida Clara. Posso ajudar com horários, convênios e agendamento.",
      fallback:
        "Não tenho essa informação agora. Se quiser, posso chamar a recepção para te atender.",
      extraInfo:
        "Atendemos particular e os convênios Amil, Bradesco e SulAmérica. Primeira consulta de avaliação custa R$ 280.",
      hours: week("08:00", "18:00", ["dom"]),
      faqs: [
        faq(
          "cli-1",
          "Como faço para agendar?",
          "Para agendar, me diga o melhor dia e período (manhã ou tarde). A recepção confirma o horário em seguida.",
        ),
        faq(
          "cli-2",
          "Quais convênios vocês atendem?",
          "Atendemos particular e os convênios Amil, Bradesco e SulAmérica.",
        ),
        faq(
          "cli-3",
          "Qual o endereço?",
          "Estamos na Rua das Acácias, 120, sala 3, em São Paulo. Tem estacionamento no prédio.",
        ),
        faq(
          "cli-4",
          "Vocês atendem emergência?",
          "Para urgências no horário comercial, ligue para (11) 4000-1234. Fora do horário, procure o pronto-socorro mais próximo.",
        ),
      ],
    };
  }

  if (type === "salao") {
    return {
      ...base,
      businessType: type,
      businessName: "Studio Luna",
      greeting:
        "Sou a Luna, do Studio Luna. Posso te ajudar com horários, serviços e valores.",
      fallback:
        "Essa eu não sei te responder agora. Quer que eu chame uma das meninas do salão?",
      extraInfo:
        "Fazemos corte, coloração, manicure e design de sobrancelha. Atendemos com hora marcada.",
      hours: week("09:00", "19:00", ["dom"]),
      faqs: [
        faq(
          "sal-1",
          "Quanto custa o corte?",
          "Corte feminino R$ 120, corte masculino R$ 70. Coloração a partir de R$ 180.",
        ),
        faq(
          "sal-2",
          "Precisa agendar?",
          "Sim, trabalhamos com hora marcada. Me diga o serviço e o melhor dia que eu vejo um horário.",
        ),
        faq(
          "sal-3",
          "Onde vocês ficam?",
          "Rua Harmonia, 450, Vila Madalena, São Paulo.",
        ),
        faq(
          "sal-4",
          "Aceita cartão?",
          "Aceitamos Pix, débito e crédito. Pix rende 5% de desconto no serviço.",
        ),
      ],
    };
  }

  if (type === "loja") {
    return {
      ...base,
      businessType: type,
      businessName: "Casa Aurora",
      greeting:
        "Sou a Luna, da Casa Aurora. Posso ajudar com produtos, prazos e trocas.",
      fallback:
        "Não encontrei essa informação. Posso chamar um vendedor para te atender.",
      extraInfo:
        "Vendemos presentes, decoração e papelaria. Entregamos em São Paulo capital em até 2 dias úteis.",
      hours: week("10:00", "19:00", ["dom"]),
      faqs: [
        faq(
          "loj-1",
          "Vocês fazem entrega?",
          "Sim. Em São Paulo capital o prazo é de 1 a 2 dias úteis. Frete a partir de R$ 15.",
        ),
        faq(
          "loj-2",
          "Como funciona a troca?",
          "Trocas em até 7 dias, com a etiqueta e a nota. Produtos em promoção não têm troca.",
        ),
        faq(
          "loj-3",
          "Quais formas de pagamento?",
          "Pix, cartão e boleto. No Pix o desconto é de 5%.",
        ),
        faq(
          "loj-4",
          "Onde fica a loja?",
          "Rua Augusta, 900. Dá para retirar na loja de terça a sábado.",
        ),
      ],
    };
  }

  if (type === "restaurante") {
    return {
      ...base,
      businessType: type,
      businessName: "Cantina do Bairro",
      greeting:
        "Sou a Luna, da Cantina do Bairro. Posso ajudar com reservas, cardápio e horário.",
      fallback:
        "Essa eu não tenho aqui. Se preferir, chamo alguém da casa para te atender.",
      extraInfo:
        "Cozinha italiana caseira. Não cobramos taxa de couvert. Aceitamos reservas para grupos a partir de 4 pessoas.",
      hours: {
        ...week("12:00", "15:00", ["seg"]),
        qui: openDay("12:00", "23:00"),
        sex: openDay("12:00", "23:00"),
        sab: openDay("12:00", "23:00"),
        dom: openDay("12:00", "16:00"),
      },
      faqs: [
        faq(
          "res-1",
          "Como faço uma reserva?",
          "Me diga o dia, o horário e quantas pessoas. Confirmamos na hora se tiver mesa.",
        ),
        faq(
          "res-2",
          "Vocês têm menu do dia?",
          "Sim, de terça a sexta no almoço. O executivo sai por R$ 42, com prato, suco e sobremesa.",
        ),
        faq(
          "res-3",
          "Tem opção vegetariana?",
          "Temos lasanha de berinjela, risoto de cogumelos e uma massa do dia sem carne.",
        ),
        faq(
          "res-4",
          "Aceita voucher ou ticket?",
          "Aceitamos Pix, débito, crédito e vale-refeição Alelo e VR.",
        ),
      ],
    };
  }

  if (type === "outro") {
    return {
      ...base,
      businessType: type,
      businessName: "Meu negócio",
      greeting:
        "Sou a Luna, assistente virtual. Posso ajudar com as dúvidas mais comuns.",
      fallback:
        "Ainda não sei responder isso. Se quiser, posso chamar um atendente.",
      extraInfo: "",
      hours: week("09:00", "18:00", ["dom"]),
      faqs: [
        faq(
          "out-1",
          "Qual o horário de funcionamento?",
          "Me pergunte o horário que eu consulto a agenda da casa.",
        ),
        faq(
          "out-2",
          "Como posso falar com uma pessoa?",
          "É só escrever “falar com atendente” que eu transfiro a conversa.",
        ),
      ],
    };
  }

  return {
    ...base,
    businessType: "pizzaria",
    businessName: "Pizzaria Nonna",
      greeting:
        "Sou a Luna, da Pizzaria Nonna. Posso ajudar com cardápio, pedidos e tempo de entrega.",
    fallback:
      "Hmm, essa eu não tenho cadastrada. Se quiser, posso chamar alguém da equipe para te atender.",
    extraInfo:
      "Pizza artesanal de fermentação lenta. Pedido mínimo para entrega: R$ 40. Entregamos num raio de 5 km.",
    hours: week("18:00", "23:00", ["seg"]),
    faqs: [
        faq(
          "piz-1",
          "Qual o cardápio?",
          "As mais pedidas: Margherita (R$ 49), Calabresa (R$ 54), Quatro queijos (R$ 59) e Pepperoni (R$ 62). Broto sai R$ 10 a menos.",
        ),
        faq(
          "piz-2",
          "Vocês entregam? Qual o prazo?",
          "Sim, entregamos num raio de 5 km. O prazo médio é de 40 a 55 minutos, dependendo do movimento.",
        ),
        faq(
          "piz-3",
          "Qual o pedido mínimo?",
          "O pedido mínimo para entrega é R$ 40. Na retirada na loja não tem mínimo.",
        ),
        faq(
          "piz-4",
          "Quais formas de pagamento?",
          "Aceitamos Pix, dinheiro e cartão na entrega. No Pix o desconto é de R$ 5 na pizza grande.",
        ),
        faq(
          "piz-5",
          "Onde vocês ficam?",
          "Rua Harmonia, 318, Vila Madalena, São Paulo. Dá para retirar no balcão.",
        ),
    ],
  };
}
