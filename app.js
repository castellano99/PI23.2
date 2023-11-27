const express = require('express');
const usuariosRouter = require('./routes/usuarios');
const alimentosRouter = require('./routes/alimentos');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: true
    })
);

app.use(bodyParser.urlencoded({ extended: true })); // Middleware para fazer o parsing do corpo das requisições
app.use('/usuarios', usuariosRouter); // Rotas para usuários
app.use('/alimentos', alimentosRouter); // Rotas para alimentos
app.use(express.static('public')); // Pasta onde seus arquivos estáticos estão, como CSS, imagens, etc.

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'))
});

app.get('/area-de-calculo', (req, res) => {
    const userId = req.session.userId; // Obtém o ID do usuário da sessão
  
    // Se o usuário estiver autenticado, redirecione para a página de contador de calorias
    if (userId) {
      res.sendFile(path.join(__dirname, 'public', 'contador.html'));
    } else {
      // Caso contrário, redirecione para a página de login ou para outra página de autenticação
      alert("Login incorreto")
      res.redirect('/login');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
