import net from 'node:net';

const HOST = '127.0.0.1';
const PORT = 3020;
const MAX_CLIENTS = 5;          // лимит увеличен в самостоятельной части
const IDLE_MS = 20_000;         // полное бездействие → отключение
const WARN_MS = 15_000;         // предупреждение до отключения
const MAX_LINE_BYTES = 1024;

const clients = new Map();
let nextId = 1;

// время для журнала [CONNECT] и [CLOSE]
function stamp() {
  return new Date().toLocaleTimeString('ru-RU', { hour12: false });
}

function send(socket, line) {
  if (!socket.destroyed && !socket.writableEnded) {
    socket.write(line + '\n');
  }
}

function broadcast(line, except = null) {
  for (const socket of clients.keys()) {
    if (socket !== except) send(socket, line);
  }
}

// сброс таймеров бездействия (вызывается при каждой команде)
function resetIdle(state) {
  clearTimeout(state.warnTimer);
  clearTimeout(state.endTimer);
  state.lastActivity = Date.now();

  state.warnTimer = setTimeout(() => {
    if (!state.socket.destroyed) {
      send(state.socket, 'WARNING IDLE closing soon');
    }
  }, WARN_MS);

  state.endTimer = setTimeout(() => {
    console.log('[TIMEOUT]', stamp(), state.id);
    state.socket.end('ERROR IDLE_TIMEOUT\n');
  }, IDLE_MS);
}

const server = net.createServer((socket) => {
  socket.setEncoding('utf8');

  socket.on('error', (error) => {
    console.error('[SOCKET ERROR]', error.code, error.message);
  });

  if (clients.size >= MAX_CLIENTS) {
    socket.end('ERROR SERVER_FULL\n');
    return;
  }

  const id = 'user-' + nextId++;
  const state = {
    id,
    socket,
    pending: '',
    commands: 0,
    lastActivity: Date.now(),
    warnTimer: null,
    endTimer: null
  };
  clients.set(socket, state);
  resetIdle(state);

  console.log('[CONNECT]', stamp(), id,
    socket.remoteAddress + ':' + socket.remotePort);

  send(socket, 'WELCOME ' + id);
  broadcast('[SYSTEM] ' + id + ' joined', socket);

  socket.on('data', (chunk) => {
    resetIdle(state);
    state.pending += chunk;

    let index;
    while ((index = state.pending.indexOf('\n')) !== -1) {
      const line = state.pending.slice(0, index).trim();
      state.pending = state.pending.slice(index + 1);

      if (Buffer.byteLength(line, 'utf8') > MAX_LINE_BYTES) {
        socket.end('ERROR LINE_TOO_LONG\n');
        return;
      }
      if (!line) continue;
      state.commands++;

      if (line === 'PING') {
        send(socket, 'PONG');
      } else if (line === 'STATS') {
        send(socket,
          'STATS clients=' + clients.size +
          ' commands=' + state.commands);
      } else if (line === 'WHO') {
        const list = [...clients.values()]
          .map((s) => s.id + '@' + s.socket.remotePort)
          .join(' ');
        send(socket, 'WHO users=' + clients.size + ' ' + list);
      } else if (line === 'HELP') {
        send(socket,
          'HELP commands: PING, STATS, WHO, IDLE, SAY <text>, QUIT');
      } else if (line === 'IDLE') {
        const idleSec = Math.floor((Date.now() - state.lastActivity) / 1000);
        send(socket, 'IDLE ' + idleSec + 's');
      } else if (line.startsWith('SAY ')) {
        const text = line.slice(4).trim();
        if (!text) {
          send(socket, 'ERROR EMPTY_MESSAGE');
        } else {
          broadcast('[' + id + '] ' + text, socket);
          send(socket, 'SENT');
        }
      } else if (line === 'QUIT') {
        socket.end('BYE\n');
        return;
      } else {
        send(socket, 'ERROR UNKNOWN_COMMAND');
      }
    }

    if (Buffer.byteLength(state.pending, 'utf8') > MAX_LINE_BYTES) {
      socket.end('ERROR LINE_TOO_LONG\n');
    }
  });

  socket.on('close', () => {
    if (!clients.delete(socket)) return; // уже удалён — выходим
    clearTimeout(state.warnTimer);
    clearTimeout(state.endTimer);
    console.log('[CLOSE]', stamp(), id, 'active=' + clients.size);
    broadcast('[SYSTEM] ' + id + ' left');
  });
});

server.on('error', (error) => {
  console.error('[SERVER ERROR]', error.code, error.message);
});

server.listen(PORT, HOST, () => {
  console.log('NetLab 05: ' + HOST + ':' + PORT);
});
