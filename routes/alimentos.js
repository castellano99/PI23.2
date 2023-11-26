const express = require('express');
const router = express.Router();
const connection = require('../db');


router.get('/pesquisar', (req, res) => {
  let nomeAlimento = req.query.naame;
  nomeAlimento = nomeAlimento.toLowerCase(); // Converter para minúsculas
    
  const sqlQuery = `SELECT caloriaAlimento FROM alimentos WHERE LOWER(nomeAlimento) = '${nomeAlimento}'`;
  
  connection.query(sqlQuery, (err, results) => {
  if (err) {
    console.error('Erro ao executar a consulta SQL:', err);
    res.status(500).send('Erro ao buscar as calorias.');
  return;
  }
  
  console.log('Resultado da consulta:', results); // Verifique o resultado da consulta
  
  if (results.length > 0) {
    console.log('Calorias encontradas:', results[0].caloriaAlimento); // Acesse caloriaAlimento
    res.json({ calorias: results[0].caloriaAlimento }); // Retorna as calorias encontradas
  } else {
    res.json({ calorias: 0 }); // Retorna 0 se o alimento não foi encontrado
  }
  });
});

router.get('/pesquisareConfirmar', (req, res) => {
  let nomeAlimento = req.query.nome;
  nomeAlimento = nomeAlimento.toLowerCase(); // Converter para minúsculas

  const usuarioId = req.session.userId; // Substitua pelo ID do usuário logado
  const dataAtual = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD

  const sqlQuery = `SELECT caloriaAlimento FROM alimentos WHERE LOWER(nomeAlimento) = ?`;

  connection.query(sqlQuery, [nomeAlimento], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      res.status(500).send('Erro ao buscar as calorias.');
      return;
    }

    if (results.length > 0) {
      const caloriasConsumidas = results[0].caloriaAlimento;

      const sqlSelect = `SELECT * FROM consumo_diario WHERE usuario_id = ? AND data = ?`;
      connection.query(sqlSelect, [usuarioId, dataAtual], (err, results) => {
      if (err) {
      console.error('Erro ao buscar calorias consumidas:', err);
      res.status(500).send('Erro ao buscar calorias consumidas.');
      return;
    }

    if (results.length > 0) {
      const sqlUpdate = `UPDATE consumo_diario SET calorias_consumidas = ? WHERE usuario_id = ? AND data = ?`;
      connection.query(sqlUpdate, [results[0].calorias_consumidas + caloriasConsumidas, usuarioId, dataAtual], (err, updateResult) => {
      if (err) {
        console.error('Erro ao atualizar calorias consumidas:', err);
        res.status(500).send('Erro ao atualizar calorias consumidas.');
        return;
      } 
      res.status(200).send('Calorias consumidas atualizadas com sucesso.');
      });
    } else {
      const sqlInsert = `INSERT INTO consumo_diario (usuario_id, data, calorias_consumidas) VALUES (?, ?, ?)`;
      connection.query(sqlInsert, [usuarioId, dataAtual, caloriasConsumidas], (err, insertResult) => {
      if (err) {
      console.error('Erro ao inserir calorias consumidas:', err);
      res.status(500).send('Erro ao inserir calorias consumidas.');
      return;
      }
      res.status(200).send('Calorias consumidas inseridas com sucesso.');
      });
    }
  });
  } else {
      res.json({ calorias: 0 }); // Retorna 0 se o alimento não foi encontrado
    }
  });
});

router.get('/calorias/:usuarioId/:data', (req, res) => {
  const usuarioId = req.session.userId; // Substitua pelo ID do usuário logado
  const data = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD

  const sqlQuery = `SELECT calorias_consumidas FROM consumo_diario WHERE usuario_id = ? AND data = ?`;
  connection.query(sqlQuery, [usuarioId, data], (err, results) => {
      if (err) {
          console.error('Erro ao buscar calorias consumidas:', err);
          res.status(500).send('Erro ao buscar calorias consumidas.');
          return;
      }

      if (results.length > 0) {
          res.status(200).json({ caloriasConsumidas: results[0].calorias_consumidas });
      } else {
          res.status(404).json({ error: 'Calorias não encontradas para este dia.' });
      }
  });
});


module.exports = router;