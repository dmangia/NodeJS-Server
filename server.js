const express = require('express');
const db = require('./db');  // Importa la connessione al DB
const app = express();
const cors = require('cors');
const port = 3000;

// Abilita CORS per tutte le richieste
app.use(cors());

// Middleware per il parsing dei parametri URL
app.use(express.json());

// Funzione per ottenere i dati dalla tabella con paginazione
 //GET http://localhost:3000/notai?page=1&limit=5
app.get('/notai', (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // Imposta default a pagina 1 e limit a 10

  const offset = (page - 1) * limit;
  
  // Query per ottenere i dati dalla tabella (modifica il nome della tabella e delle colonne come necessario)
  const query = `
    SELECT * FROM notai
    LIMIT ?, ?;
  `;
  
  db.query(query, [offset, parseInt(limit)], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Errore nel recupero dei dati');
    }
    
    // Contiamo il numero totale di righe per calcolare il numero totale di pagine
    const countQuery = 'SELECT COUNT(*) AS total FROM notai;';
    db.query(countQuery, (err, countResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Errore nel conteggio dei dati');
      }

      const totalItems = countResults[0].total;
      const totalPages = Math.ceil(totalItems / limit);

      res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems,
        totalPages,
        items: results
      });
    });
  });
});



  //GET http://localhost:3000/risorse?page=1&limit=5
app.get('/risorse', (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // Imposta default a pagina 1 e limit a 10

  const offset = (page - 1) * limit;
  
  // Query per ottenere i dati dalla tabella (modifica il nome della tabella e delle colonne come necessario)
  const query = `
    SELECT * FROM risorse
    LIMIT ?, ?;
  `;
  
  db.query(query, [offset, parseInt(limit)], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Errore nel recupero dei dati');
    }
    
    // Contiamo il numero totale di righe per calcolare il numero totale di pagine
    const countQuery = 'SELECT COUNT(*) AS total FROM risorse;';
    db.query(countQuery, (err, countResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Errore nel conteggio dei dati');
      }

      const totalItems = countResults[0].total;
      const totalPages = Math.ceil(totalItems / limit);

      res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems,
        totalPages,
        items: results
      });
    });
  });
});


/* Funzione per eseguire il filtro dinamico:  http://localhost:3000/filter-risorse?page=1&limit=5 in body
{
  "nome": "Stefania",
  "cognome": "Colombo",
  "luogoNascita": "NEGRAR",
  "matricola": "333"
}

*/
app.post('/filter-risorse', (req, res) => {
  const { nome, cognome, luogoNascita, matricola, pagina = 1, limite = 1000 } = req.body;
  const offset = (pagina - 1) * limite;

  let query = 'SELECT * FROM risorse WHERE 1=1';
  let values = [];

  if (nome) {
    query += ' AND NOME LIKE ?';
    values.push(`%${nome}%`);
  }
  if (cognome) {
    query += ' AND COGNOME LIKE ?';
    values.push(`%${cognome}%`);
  }
  if (luogoNascita) {
    query += ' AND NOME_COMUNE_NASCITA LIKE ?';
    values.push(`%${luogoNascita}%`);
  }
  if (matricola) {
    query += ' AND MATRICOLA LIKE ?';
    values.push(`%${matricola}%`);
  }

  query += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limite), parseInt(offset));

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Errore nella query di filtro:', err);
      return res.status(500).json({ error: 'Errore durante il filtro' });
    }

    // Conteggio
    let countQuery = 'SELECT COUNT(*) AS totalCount FROM risorse WHERE 1=1';
    let countValues = values.slice(0, -2); // senza LIMIT e OFFSET

    db.query(countQuery, countValues, (err, countResult) => {
      if (err) {
        console.error('Errore durante il conteggio dei record:', err);
        return res.status(500).json({ error: 'Errore durante il conteggio dei record' });
      }

      const totalCount = countResult[0].totalCount;
      const totalPages = Math.ceil(totalCount / limite);

      res.json({
        page: pagina,
        totalPages: totalPages,
        totalItems: totalCount, // ✅ campo chiave per PrimeNG
        items: results           // ✅ campo chiave per la tabella
      });
    });
  });
});


app.post('/filter-notai', (req, res) => {
  const { nome, cognome, studio, cap,nomefileVal, comuneDistNotarile,idComuneDistNotarile,pagina = 1, limite = 1000 } = req.body;
  const offset = (pagina - 1) * limite;

  let query = 'SELECT * FROM notai WHERE 1=1';
  let values = [];

  if (nome) {
    query += ' AND NOME LIKE ?';
    values.push(`%${nome}%`);
  }
  if (cognome) {
    query += ' AND COGNOME LIKE ?';
    values.push(`%${cognome}%`);
  }
  if (studio) {
    query += ' AND STUDIO LIKE ?';
    values.push(`%${luogoNascita}%`);
  }
  if (CAP) {
    query += ' AND CAP LIKE ?';
    values.push(`%${matricola}%`);
  }

  query += ' LIMIT ? OFFSET ?';
  values.push(limite, offset);

  console.log('Query finale:', query);
  console.log('Valori per la query:', values);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Errore nella query di filtro:', err);
      return res.status(500).json({ error: 'Errore durante il filtro' });
    }

    let countQuery = 'SELECT COUNT(*) AS totalCount FROM notai WHERE 1=1';
    let countValues = [...values.slice(0, -2)]; // Copia dei valori senza limite e offset

    console.log('Query di conteggio:', countQuery);
    console.log('Valori per il conteggio:', countValues);

    db.query(countQuery, countValues, (err, countResult) => {
      if (err) {
        console.error('Errore durante il conteggio dei record:', err);
        return res.status(500).json({ error: 'Errore durante il conteggio dei record' });
      }

      const totalCount = countResult[0].totalCount;
      const totalPages = Math.ceil(totalCount / limite);

      res.json({
        currentPage: pagina,
        totalPages: totalPages,
        totalCount: totalCount,
        data: results
      });
    });
  });
});


// Avvia il server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port} , con CORS abilitato`);
});
