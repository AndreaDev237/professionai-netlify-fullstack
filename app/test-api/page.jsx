'use client'

import { useState } from 'react'
import styles from './testApi.module.css'

export default function TestApi() {
  // Stato per le citazioni
  const [randomQuote, setRandomQuote] = useState(null);
  const [userQuotes, setUserQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  
  // Stato per il form
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Ottieni una citazione random
  const fetchRandomQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/quotes');
      const data = await response.json();
      setRandomQuote(data);
      setFormError('');
    } catch (error) {
      console.error('Errore nel caricamento della citazione:', error);
      setFormError('Errore nel caricamento della citazione');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ottieni citazioni utente
  const fetchUserQuotes = async () => {
    setIsLoadingUser(true);
    try {
      const response = await fetch('/.netlify/functions/quotes?source=user');
      if (response.ok) {
        const data = await response.json();
        setUserQuotes([data]); // Mettiamo la citazione in un array
        setFormError('');
      } else {
        const error = await response.json();
        setUserQuotes([]);
        setFormError(error.message || 'Nessuna citazione utente trovata');
      }
    } catch (error) {
      console.error('Errore nel caricamento delle citazioni utente:', error);
      setFormError('Errore nel caricamento delle citazioni utente');
    } finally {
      setIsLoadingUser(false);
    }
  };
  
  // Aggiungi una citazione
  const addQuote = async (e) => {
    e.preventDefault();
    
    // Reset degli stati
    setFormError('');
    setFormSuccess('');
    
    // Validazione
    if (!quoteText.trim() || !quoteAuthor.trim()) {
      setFormError('Sia il testo che l\'autore sono obbligatori');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: quoteText,
          author: quoteAuthor
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormSuccess('Citazione aggiunta con successo!');
        // Reset del form
        setQuoteText('');
        setQuoteAuthor('');
        // Aggiorna subito la lista delle citazioni utente
        setUserQuotes(prevQuotes => [...prevQuotes, data.quote]);
      } else {
        setFormError(data.error || 'Errore durante l\'aggiunta della citazione');
      }
    } catch (error) {
      console.error('Errore durante l\'invio della citazione:', error);
      setFormError('Errore durante l\'invio della citazione');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Elimina una citazione
  const deleteQuote = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/quotes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Rimuovi la citazione dalla lista
        setUserQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== id));
        setFormSuccess('Citazione eliminata con successo!');
      } else {
        const error = await response.json();
        setFormError(error.error || 'Errore durante l\'eliminazione della citazione');
      }
    } catch (error) {
      console.error('Errore durante l\'eliminazione della citazione:', error);
      setFormError('Errore durante l\'eliminazione della citazione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Test API Citazioni</h1>
      
      <div className={styles.apiSection}>
        <h2>1. GET - Ottieni una citazione casuale</h2>
        <button 
          className={styles.button}
          onClick={fetchRandomQuote}
          disabled={isLoading}
        >
          {isLoading ? 'Caricamento...' : 'Ottieni citazione casuale'}
        </button>
        
        {randomQuote && (
          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>"{randomQuote.text}"</p>
            <p className={styles.quoteAuthor}>- {randomQuote.author}</p>
          </div>
        )}
      </div>
      
      <div className={styles.apiSection}>
        <h2>2. POST - Aggiungi una nuova citazione</h2>
        <form onSubmit={addQuote} className={styles.form}>
          <div className={styles.formField}>
            <label htmlFor="quoteText">Testo della citazione:</label>
            <textarea
              id="quoteText"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              rows="3"
              placeholder="Inserisci il testo della citazione"
              required
            />
          </div>
          
          <div className={styles.formField}>
            <label htmlFor="quoteAuthor">Autore:</label>
            <input
              id="quoteAuthor"
              type="text"
              value={quoteAuthor}
              onChange={(e) => setQuoteAuthor(e.target.value)}
              placeholder="Inserisci l'autore della citazione"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Invio in corso...' : 'Aggiungi citazione'}
          </button>
        </form>
      </div>
      
      <div className={styles.apiSection}>
        <h2>3. GET con parametri - Citazioni utente</h2>
        <button 
          className={styles.button}
          onClick={fetchUserQuotes}
          disabled={isLoadingUser}
        >
          {isLoadingUser ? 'Caricamento...' : 'Ottieni citazione utente'}
        </button>
        
        <div className={styles.userQuotesList}>
          {userQuotes.length > 0 ? (
            userQuotes.map((quote, index) => (
              <div key={quote.id || index} className={styles.userQuoteCard}>
                <p className={styles.quoteText}>"{quote.text}"</p>
                <p className={styles.quoteAuthor}>- {quote.author}</p>
                {quote.createdAt && (
                  <p className={styles.quoteDate}>
                    Aggiunta il: {new Date(quote.createdAt).toLocaleString('it-IT')}
                  </p>
                )}
                {quote.id && (
                  <button 
                    onClick={() => deleteQuote(quote.id)}
                    className={styles.deleteButton}
                    disabled={isLoading}
                  >
                    Elimina
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noQuotes}>Nessuna citazione utente disponibile</p>
          )}
        </div>
      </div>
      
      {/* Messaggi di errore e successo */}
      {formError && <p className={styles.errorMessage}>{formError}</p>}
      {formSuccess && <p className={styles.successMessage}>{formSuccess}</p>}
      
      <div className={styles.apiDocumentation}>
        <h2>Documentazione API</h2>
        <pre>{`
# Endpoint: /.netlify/functions/quotes

## GET /.netlify/functions/quotes
Restituisce una citazione casuale dall'elenco predefinito.

## GET /.netlify/functions/quotes?source=user
Restituisce una citazione casuale dall'elenco delle citazioni aggiunte dagli utenti.

## POST /.netlify/functions/quotes
Aggiunge una nuova citazione.
Body:
{
  "text": "Testo della citazione",
  "author": "Autore della citazione"
}

## DELETE /.netlify/functions/quotes?id=123
Elimina una citazione specifica in base all'ID.
        `}</pre>
      </div>
    </div>
  )
}