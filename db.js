const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // Cambia con l'host del tuo database
  user: 'root', // Cambia con il tuo username
  password: 'root', // Cambia con la tua password
  database: 'procureweb' // Cambia con il nome del tuo database
});

connection.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err.stack);
    return;
  }
  console.log('Connesso al database MySQL');
});

module.exports = connection;
