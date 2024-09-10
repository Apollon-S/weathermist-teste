const { Client } = require('pg');


console.log(process.env.DATABASE_URL);
// Cria um novo cliente usando a variável de ambiente DATABASE_URL
const client = new Client({

  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Pode ser necessário dependendo da configuração do seu CockroachDB
  }
});

// Função assíncrona para conectar ao banco de dados e executar uma consulta
(async () => {
  try {
    await client.connect();
    console.log('Conectado ao CockroachDB com sucesso!');
    
    // Executa uma consulta simples para obter a data e hora atual
    const result = await client.query('SELECT NOW()');
    console.log('Data e Hora:', result.rows[0]);
  } catch (err) {
    console.error('Erro na conexão ou execução da consulta:', err);
  } finally {
    await client.end(); // Fecha a conexão
  }
})();
