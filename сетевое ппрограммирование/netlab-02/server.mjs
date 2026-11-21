import net from 'node:net';

const HOST = '127.0.0.1';
const PORT = 3001;

function handleCommand(command, socket, session) {
  const upper = command.toUpperCase();

  if (upper === 'PING') return 'PONG';

  if (upper === 'TIME') {
    return 'TIME ' + new Date().toLocaleTimeString('ru-RU');
  }

  if (upper === 'STATUS') {
    return 'STATUS: NetLab ONLINE';
  }

  if (upper === 'ID') {
    return 'ID ' + socket.remoteAddress + ':' + socket.remotePort;
  }

  if (upper === 'COUNT') {
    return 'COUNT ' + session.commands;
  }

  if (upper === 'HELP') {
    return 'Команды: PING, TIME, ECHO текст, STATUS, ID, COUNT, UPPER текст, HELP, BYE';
  }

  if (upper.startsWith('ECHO ')) {
    return 'ECHO: ' + command.slice(5);
  }

  if (upper.startsWith('UPPER ')) {
    return 'UPPER: ' + command.slice(6).toUpperCase();
  }

  return 'ERROR: неизвестная команда';
}

const server = net.createServer((socket) => {
  // счётчик команд отдельный для каждого соединения
  const session = { commands: 0 };

  console.log('Клиент: ' + socket.remoteAddress + ':' + socket.remotePort);

  socket.setEncoding('utf8');
  let pending = '';

  socket.on('data', (chunk) => {
    pending += chunk;
    let index;
    while ((index = pending.indexOf('\n')) !== -1) {
      const command = pending.slice(0, index).trim();
      pending = pending.slice(index + 1);

      if (!command) continue;

      session.commands++;
      console.log('Команда: ' + command);

      if (command.toUpperCase() === 'BYE') {
        socket.end('BYE\n');
        return;
      }

      socket.write(handleCommand(command, socket, session) + '\n');
    }
  });

  socket.on('end', () => console.log('Клиент отключается'));
  socket.on('close', () => console.log('Соединение закрыто'));
  socket.on('error', (e) => console.error('Сокет: ' + e.message));
});

server.on('error', (e) => console.error('Сервер: ' + e.message));

server.listen(PORT, HOST, () => {
  console.log('NetLab: ' + HOST + ':' + PORT);
});
