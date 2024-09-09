const express = require('express');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');
const socketIo = require('socket.io');

// Criação do aplicativo Express
const app = express();
const PORT = 3000; // Altere para a porta que desejar

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Roteamento para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuração da porta serial
const port = new SerialPort({
    path: 'COM1',  // Altere para o caminho correto da sua porta serial
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

// Configuração do parser Readline
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Criação do servidor HTTP
const server = http.createServer(app);

// Configuração do Socket.io
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Recebe uma mensagem do cliente e envia para a porta serial
    socket.on('sendToSerial', (message) => {
        console.log('Menssagem recebida do cliente:', message);
        port.write(message, (err) => {
            if (err) {
                console.error('Erro ao escrever na porta serial:', err.message);
            } else {
                console.log('Mensagem enviada a porta serial:', message);
            }
        });
    });
});

// Manipulação de dados recebidos da porta serial
parser.on('data', (data) => {
    console.log('Received data from port: ' + data);
    io.emit('data', data);  // Emite os dados recebidos para o cliente via socket.io
});

// Inicialização do servidor
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});