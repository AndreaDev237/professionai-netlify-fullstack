'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  // Stato per la citazione corrente e lo stato di caricamento
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Funzione per fetching di una citazione
  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      // Chiamata all'API route creata con App Router
      const response = await fetch('/api/quotes');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Errore nel caricamento della citazione:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carica una citazione al primo rendering
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Citazioni Casuali</h1>
        <p className="description">
          Demo di un'app Next.js con App Router e API Routes
        </p>
      </header>

      <main className="main">
        <div className="quote-box">
          {isLoading ? (
            <p className="loading">Caricamento...</p>
          ) : (
            <>
              <p className="quote-text">"{quote.text}"</p>
              <p className="quote-author">- {quote.author}</p>
            </>
          )}
          <button 
            className="button"
            onClick={fetchQuote} 
            disabled={isLoading}
          >
            {isLoading ? 'Caricamento...' : 'Nuova Citazione'}
          </button>
        </div>
      </main>
    </div>
  )
}