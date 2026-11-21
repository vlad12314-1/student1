// ============================================================
// ФАЙЛ: tcp-server.mjs
// ============================================================
import net from 'node:net';

const HOST = '127.0.0.1';
const PORT = 3010;

function handleCommand(command) {
  if (command === 'PING') return 'PONG';
  if (command === 'TIME') return 'TIME ' + new Date().toISOString();
  return 'UNKNOWN';
}

const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  let pending = '';
  console.log('TCP клиент подключился');

  socket.on('data', (chunk) => {
    pending += chunk;
    const newline = pending.indexOf('\n');
    if (newline === -1) {
      if (pending.length > 100) socket.end('ERROR\n');
      return;
    }
    const command = pending.slice(0, newline).trim();
    console.log('TCP команда: ' + command);
    socket.end(handleCommand(command) + '\n');
  });

  socket.on('error', (error) => {
    console.error('TCP сокет:', error.message);
  });
});

server.on('error', (error) => {
  console.error('TCP сервер:', error.message);
});

server.listen(PORT, HOST, () => {
  console.log('TCP сервер: ' + HOST + ':' + PORT);
});

// ============================================================
// ФАЙЛ: tcp-client.mjs
// ============================================================
import net from 'node:net';
import { performance } from 'node:perf_hooks';

const HOST = '127.0.0.1';
const PORT = 3010;
const MESSAGE = 'PING'; // поменяйте на TIME или HELLO

const t0 = performance.now(); // старт замера: соединение + ответ

const socket = net.createConnection({ host: HOST, port: PORT });
socket.setEncoding('utf8');

socket.on('connect', () => {
  console.log('TCP: соединение установлено');
  socket.write(MESSAGE + '\n');
});

socket.on('data', (chunk) => {
  console.log('TCP ответ: ' + chunk.trim());
  console.log('TCP время (соединение + ответ): ' + (performance.now() - t0).toFixed(3) + ' мс');
});

socket.on('close', () => {
  console.log('TCP: соединение закрыто');
});

socket.on('error', (error) => {
  console.error('TCP ошибка:', error.code, error.message);
});

// ============================================================
// ФАЙЛ: udp-server.mjs
// ============================================================
import dgram from 'node:dgram';

const HOST = '127.0.0.1';
const PORT = 3011;

function handleCommand(command) {
  if (command === 'PING') return 'PONG';
  if (command === 'TIME') return 'TIME ' + new Date().toISOString();
  return 'UNKNOWN';
}

const server = dgram.createSocket('udp4');

server.on('message', (data, sender) => {
  const command = data.toString('utf8').trim();
  console.log('UDP от ' + sender.address + ':' + sender.port + ': ' + command);
  server.send(handleCommand(command), sender.port, sender.address, (error) => {
    if (error) console.error('Ошибка отправки:', error.message);
  });
});

server.on('error', (error) => {
  console.error('UDP сервер:', error.message);
  server.close();
});

server.bind(PORT, HOST, () => {
  console.log('UDP сервер: ' + HOST + ':' + PORT);
});

// ============================================================
// ФАЙЛ: udp-client.mjs
// ============================================================
import dgram from 'node:dgram';
import { performance } from 'node:perf_hooks';

const HOST = '127.0.0.1';
const PORT = 3011;
const MESSAGE = 'PING'; // поменяйте на TIME или HELLO
const TIMEOUT_MS = 2000;
const MAX_ATTEMPTS = 3;

const client = dgram.createSocket('udp4');
let completed = false;
let attempt = 0;
let timer = null;

function finish() {
  completed = true;
  if (timer) clearTimeout(timer);
  client.close();
}

function sendOnce() {
  attempt += 1;
  console.log('UDP: попытка ' + attempt + ' из ' + MAX_ATTEMPTS);
  const t0 = performance.now();

  timer = setTimeout(() => {
    if (completed) return;
    if (attempt < MAX_ATTEMPTS) {
      console.log('UDP: ответ не получен за ' + TIMEOUT_MS + ' мс, повторяю...');
      sendOnce();
    } else {
      console.log('UDP: ответ не получен за ' + MAX_ATTEMPTS + ' попыток');
      finish();
    }
  }, TIMEOUT_MS);

  client.send(MESSAGE, PORT, HOST, (error) => {
    if (error) {
      console.error('Ошибка отправки:', error.message);
      if (!completed) finish();
      return;
    }
    console.log('UDP: датаграмма передана ОС');
  });

  client.once('message', (data, sender) => {
    if (completed) {
      console.log('UDP: поздний дубликат ответа: ' + data.toString('utf8'));
      return;
    }
    finish();
    console.log('UDP ответ: ' + data.toString('utf8'));
    console.log('Отправитель: ' + sender.address + ':' + sender.port);
    console.log('UDP время (send -> ответ): ' + (performance.now() - t0).toFixed(3) + ' мс');
  });
}

client.on('error', (error) => {
  console.error('UDP ошибка:', error.message);
  if (!completed) finish();
});

sendOnce();
