// netlify/functions/quotes.ts
import { Handler } from '@netlify/functions';

interface Quote {
  text: string;
  author: string;
}

interface DatabaseQuote extends Quote {
  id: string;
  createdAt: string;
}

const baseQuotes: Quote[] = [
  { text: "La vita è ciò che ti accade mentre fai altri progetti.", author: "John Lennon" },
  { text: "L'unica cosa di cui dobbiamo avere paura è la paura stessa.", author: "Franklin D. Roosevelt" },
  { text: "Non importa quanto vai piano, l'importante è non fermarsi.", author: "Confucio" },
  { text: "La creatività è l'intelligenza che si diverte.", author: "Albert Einstein" },
  { text: "Diventa il cambiamento che vuoi vedere nel mondo.", author: "Mahatma Gandhi" },
  { text: "Chi non osa nulla, non speri in nulla.", author: "Friedrich Schiller" },
  { text: "Non si è mai troppo vecchi per fissare un nuovo obiettivo o per sognare un nuovo sogno.", author: "C.S. Lewis" },
  { text: "La semplicità è la massima sofisticazione.", author: "Leonardo da Vinci" }
];

let userQuotes: DatabaseQuote[] = [];

const handler: Handler = async (event, context) => {
  const method = event.httpMethod;
  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (method === 'GET') {
    const source = event.queryStringParameters?.source;
    const sourceArray = source === 'user' ? userQuotes : baseQuotes;

    if (sourceArray.length === 0 && source === 'user') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "Nessuna citazione utente disponibile" })
      };
    }

    const randomQuote = sourceArray[Math.floor(Math.random() * sourceArray.length)];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(randomQuote)
    };
  }

  if (method === 'POST') {
    try {
      const data = JSON.parse(event.body || '{}');
      if (!data.text || !data.author) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "La citazione deve contenere 'text' e 'author'" }) };
      }
      if (data.text.length > 300 || data.author.length > 100) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Citazione o autore troppo lunghi" }) };
      }

      const newQuote: DatabaseQuote = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      userQuotes.push(newQuote);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: "Citazione aggiunta con successo", quote: newQuote })
      };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Errore nell'elaborazione della richiesta" }) };
    }
  }

  if (method === 'DELETE') {
    const id = event.queryStringParameters?.id;
    if (!id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Specifica l'ID della citazione" }) };
    }

    const index = userQuotes.findIndex(q => q.id === id);
    if (index === -1) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Citazione non trovata" }) };
    }

    userQuotes.splice(index, 1);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Citazione eliminata con successo" })
    };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Metodo non supportato" }) };
};

export { handler };
