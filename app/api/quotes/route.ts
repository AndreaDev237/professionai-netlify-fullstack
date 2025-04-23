import { NextRequest, NextResponse } from 'next/server';

export interface quotes{
    text: string,
    author: string
}

export interface databaseQuotes extends quotes{
    id: string,
    createdAt: string
}
// Un array di citazioni che verrà utilizzato dalla nostra API
const quotes : Array<quotes> = [
    { text: "La vita è ciò che ti accade mentre fai altri progetti.", author: "John Lennon" },
    { text: "L'unica cosa di cui dobbiamo avere paura è la paura stessa.", author: "Franklin D. Roosevelt" },
    { text: "Non importa quanto vai piano, l'importante è non fermarsi.", author: "Confucio" },
    { text: "La creatività è l'intelligenza che si diverte.", author: "Albert Einstein" },
    { text: "Diventa il cambiamento che vuoi vedere nel mondo.", author: "Mahatma Gandhi" },
    { text: "Chi non osa nulla, non speri in nulla.", author: "Friedrich Schiller" },
    { text: "Non si è mai troppo vecchi per fissare un nuovo obiettivo o per sognare un nuovo sogno.", author: "C.S. Lewis" },
    { text: "La semplicità è la massima sofisticazione.", author: "Leonardo da Vinci" }
  ];
  
  // Array per memorizzare le citazioni aggiunte dagli utenti durante l'esecuzione
  // Nota: in una vera applicazione utilizzeresti un database
  let userQuotes : Array<databaseQuotes> = [];
  
  // GET - Ottieni una citazione casuale
  export async function GET(request : NextRequest) {
    // Otteniamo i parametri dalla URL (es: /api/quotes?source=user)
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    
    // Seleziona l'array di citazioni da cui attingere
    const sourceArray = source === 'user' ? userQuotes : quotes;
    
    // Se non ci sono citazioni nell'array selezionato, restituisci un errore
    if (sourceArray.length === 0 && source === 'user') {
      return Response.json(
        { message: "Nessuna citazione utente disponibile" },
        { status: 404 }
      );
    }
    
    // Seleziona una citazione casuale dall'array
    const randomIndex = Math.floor(Math.random() * sourceArray.length);
    const randomQuote = sourceArray[randomIndex];
    
    // Simulazione di un ritardo di rete
    //await new Promise(resolve => setTimeout(resolve, 500));
    
    // Restituisci la citazione come JSON
    return Response.json(randomQuote, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  // POST - Aggiungi una nuova citazione
  export async function POST(request : NextRequest) {
    try {
      // Estrai il corpo della richiesta in formato JSON
      const quoteData = await request.json();
      
      // Validazione dei dati
      if (!quoteData.text || !quoteData.author) {
        return Response.json(
          { error: "La citazione deve contenere i campi 'text' e 'author'" },
          { status: 400 }
        );
      }
      
      // Controlla la lunghezza dei campi
      if (quoteData.text.length > 300 || quoteData.author.length > 100) {
        return Response.json(
          { error: "La citazione o l'autore sono troppo lunghi" },
          { status: 400 }
        );
      }
      
      // Aggiungi un timestamp alla citazione
      const newQuote = {
        ...quoteData,
        id: Date.now().toString(), // ID semplice basato sul timestamp
        createdAt: new Date().toISOString()
      };
      
      // Aggiungi la citazione all'array userQuotes
      userQuotes.push(newQuote);
      
      // Restituisci la citazione appena creata
      return Response.json(
        { 
          message: "Citazione aggiunta con successo", 
          quote: newQuote 
        }, 
        { 
          status: 201,  // 201 Created
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } catch (error) {
      console.error('Errore durante l\'elaborazione della richiesta:', error);
      
      // Restituisci un errore
      return Response.json(
        { error: "Errore nell'elaborazione della richiesta" },
        { status: 500 }
      );
    }
  }
  
  // DELETE - Rimuovi una citazione
  export async function DELETE(request : NextRequest) {
    try {
      // Ottieni l'ID dalla URL
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      
      if (!id) {
        return Response.json(
          { error: "È necessario specificare l'ID della citazione da eliminare" },
          { status: 400 }
        );
      }
      
      // Trova l'indice della citazione con l'ID specificato
      const quoteIndex = userQuotes.findIndex(quote => quote.id === id);
      
      if (quoteIndex === -1) {
        return Response.json(
          { error: "Citazione non trovata" },
          { status: 404 }
        );
      }
      
      // Rimuovi la citazione dall'array
      userQuotes.splice(quoteIndex, 1);
      
      // Restituisci un messaggio di successo
      return Response.json(
        { message: "Citazione eliminata con successo" },
        { status: 200 }
      );
    } catch (error) {
      console.error('Errore durante l\'elaborazione della richiesta DELETE:', error);
      
      return Response.json(
        { error: "Errore nell'elaborazione della richiesta" },
        { status: 500 }
      );
    }
  }
  
  // OPTIONS - Gestisci le richieste CORS preflight
  export async function OPTIONS() {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }