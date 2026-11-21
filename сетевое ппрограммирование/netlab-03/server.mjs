import net from 'node:net';

const HOST = '127.0.0.1';
const PORT = 3003;

const clients = new Map(); // socket -> имя
let nextId = 1;

function send(socket, text) {
  if (!socket.destroyed && !socket.writableEnded) {
    socket.write(text + '\n');
  }
}

function broadcast(text, except = null) {
  for (const socket of clients.keys()) {
    if (socket !== except) send(socket, text);
  }
}

// найти сокет по имени участника
function findByName(name) {
  for (const [socket, clientName] of clients) {
    if (clientName === name) return socket;
  }
  return null;
}

// занято ли имя среди подключённых
function nameTaken(name) {
  return [...clients.values()].includes(name);
}

const server = net.createServer((socket) => {
  let name = 'user-' + nextId++;
  clients.set(socket, name);
  socket.setEncoding('utf8');
  let pending = '';

  // Задание 6.3: IP и порт клиента в журнале сервера
  console.log(
    name + ' подключился с ' + socket.remoteAddress + ':' + socket.remotePort
  );

  send(socket, 'WELCOME ' + name);
  send(socket, 'Команды: /say текст, /list, /online, /name имя, ' +
    '/me действие, /to имя текст, /quit');
  broadcast('[SYSTEM] ' + name + ' вошёл в чат', socket);

  socket.on('data', (chunk) => {
    pending += chunk;
    let index;
    while ((index = pending.indexOf('\n')) !== -1) {
      const command = pending.slice(0, index).trim();
      pending = pending.slice(index + 1);
      if (!command) continue;

      if (command === '/list') {
        send(socket, 'Онлайн: ' + [...clients.values()].join(', '));

      } else if (command === '/online') {
        // Задание 6.2
        send(socket, 'Активных клиентов: ' + clients.size);

      } else if (command.startsWith('/name ')) {
        // Задание 6.1: смена имени
        const newName = command.slice(6).trim();
        if (!newName) {
          send(socket, 'ERROR: имя не может быть пустым');
        } else if (nameTaken(newName)) {
          send(socket, 'ERROR: имя "' + newName + '" уже занято');
        } else {
          const old = name;
          name = newName;
          clients.set(socket, newName); // обновляем значение в Map
          send(socket, 'OK: теперь вы ' + newName);
          broadcast('[SYSTEM] ' + old + ' теперь известен как ' + newName, socket);
        }

      } else if (command.startsWith('/say ')) {
        const message = command.slice(5).trim();
        if (!message) {
          send(socket, 'ERROR: пустое сообщение');
          continue;
        }
        broadcast('[' + name + '] ' + message, socket);
        send(socket, 'SENT: ' + message);

      } else if (command.startsWith('/me ')) {
        // Задание 6.4: "* user-1 действие"
        const action = command.slice(4).trim();
        if (!action) {
          send(socket, 'ERROR: пустое действие');
          continue;
        }
        broadcast('* ' + name + ' ' + action);

      } else if (command.startsWith('/to ')) {
        // Повышенная сложность: личные сообщения
        const rest = command.slice(4).trim();
        const space = rest.indexOf(' ');
        if (space === -1) {
          send(socket, 'ERROR: формат: /to Имя Сообщение');
          continue;
        }
        const target = rest.slice(0, space).trim();
        const message = rest.slice(space + 1).trim();
        if (!message) {
          send(socket, 'ERROR: пустое сообщение');
          continue;
        }
        if (target === name) {
          send(socket, 'ERROR: нельзя написать самому себе');
          continue;
        }
        const targetSocket = findByName(target);
        if (!targetSocket) {
          send(socket, 'ERROR: участник "' + target + '" не найден');
          continue;
        }
        send(targetSocket, '[ЛС от ' + name + '] ' + message);
        send(socket, 'SENT (личное для ' + target + '): ' + message);

      } else if (command === '/quit') {
        socket.end('BYE\n');
        return;

      } else {
        send(socket, 'ERROR: неизвестная команда');
      }
    }
    if (pending.length > 2048) {
      socket.end('ERROR: строка слишком длинная\n');
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
    broadcast('[SYSTEM] ' + name + ' вышел из чата');
    console.log(name + ' отключился. Онлайн: ' + clients.size);
  });

  socket.on('error', (error) => {
    console.error(name + ': ' + error.message);
  });
});

server.on('error', (error) => {
  console.error('Ошибка сервера:', error.message);
});

server.listen(PORT, HOST, () => {
  console.log('NetLab Chat: ' + HOST + ':' + PORT);
});
