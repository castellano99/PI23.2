// usuario.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sqlQuery = 'SELECT codUsuario FROM usuario WHERE email = ? AND senha = ?';
    connection.query(sqlQuery, [email, senha], (error, results) => {
        if (error) {
            console.error('Erro ao executar a consulta SQL:', error);
            res.status(500).json({ message: 'Erro ao verificar as credenciais.' });
            return;
        }

        if (results.length > 0) {
            req.session.userId = results[0].codUsuario;
            res.redirect('/area-de-calculo');
        } else {
            res.status(401).json({ message: 'Credenciais inválidas!' });
        }
  });
});

router.get('/usuario-info', (req, res) => {
    const userId = req.session.userId;
  
    const sqlQuery = 'SELECT nome FROM usuario WHERE codUsuario = ?';
    connection.query(sqlQuery, [userId], (error, results) => {
        if (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            res.status(500).json({ message: 'Erro ao buscar informações do usuário.' });
            return;
        }
  
        if (results.length > 0) {
            const nomeUsuario = results[0].nome;
            res.json({ userId, nomeUsuario });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    });
});

module.exports = router;
