import http from 'node:http';

const HOST = '127.0.0.1';
const PORT = 3041;
const MAX_BYTES = 4096;

const events = [];
let nextId = 1;
let requestCount = 0; // счётчик всех запросов (задание 3)

const stations = [
  { id: 1, name: 'PC-01', role: 'server', ip: '192.168.1.10' },
  { id: 2, name: 'PC-02', role: 'client', ip: '192.168.1.20' },
  { id: 3, name: 'PC-07', role: 'client', ip: '192.168.1.70' }
];

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total <= MAX_BYTES) chunks.push(chunk);
  }
  if (total > MAX_BYTES) {
    const error = new Error('BODY_TOO_LARGE');
    error.status = 413;
    throw error;
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('INVALID_JSON');
    error.status = 400;
    throw error;
  }
}

// Проверка тела POST — общая для POST и (не используется в DELETE)
function isValidEvent(body) {
  return body &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    typeof body.station === 'string' &&
    typeof body.message === 'string' &&
    body.station.trim().length > 0 &&
    body.station.trim().length <= 40 &&
    body.message.trim().length > 0 &&
    body.message.trim().length <= 120;
}

// HTML со ссылками на все маршруты (задание 5)
const htmlPage =
  '<!doctype html><html lang="ru">' +
  '<meta charset="utf-8"><title>NetLab</title>' +
  '<h1>NetLab HTTP</h1>' +
  '<p><a href="/api/status">Статус</a></p>' +
  '<p><a href="/api/events">События</a></p>' +
  '<p><a href="/api/about">О сервисе</a></p>' +
  '<p><a href="/api/stations">Станции</a></p>' +
  '<p><a href="/api/events/1">Событие №1</a></p>' +
  '<p><a href="/api/slow?ms=2000">Задержка 2 с</a></p>' +
  '<p><a href="/api/error">Учебная ошибка 503</a></p>' +
  '<p><a href="/missing">Несуществующий путь (404)</a></p>' +
  '</html>';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;
  const method = req.method;
  requestCount++; // задание 3

  res.on('finish', () => {
    console.log(method, path, '->', res.statusCode);
  });

  // GET / — HTML-страница
  if (path === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlPage);
    return;
  }

  // GET /api/status — с счётчиком запросов
  if (path === '/api/status' && method === 'GET') {
    json(res, 200, {
      service: 'NetLab',
      status: 'online',
      eventsCount: events.length,
      requestCount,
      time: new Date().toISOString()
    });
    return;
  }

  // Задание 1: GET /api/about
  if (path === '/api/about' && method === 'GET') {
    json(res, 200, {
      service: 'NetLab',
      name: 'NetLab HTTP',
      version: '1.0.0',
      description: 'Учебный HTTP-сервер на чистом Node.js'
    });
    return;
  }

  // Задание 2: GET /api/stations
  if (path === '/api/stations' && method === 'GET') {
    json(res, 200, { stations });
    return;
  }

  // /api/events: GET, POST
  if (path === '/api/events') {
    if (method === 'GET') {
      json(res, 200, { events });
      return;
    }
    if (method === 'POST') {
      const type = req.headers['content-type'] ?? '';
      if (!type.toLowerCase().startsWith('application/json')) {
        json(res, 415, { error: 'JSON_REQUIRED' });
        return;
      }
      let body;
      try {
        body = await readJson(req);
      } catch (error) {
        json(res, error.status ?? 400, { error: error.message });
        return;
      }
      if (!isValidEvent(body)) {
        json(res, 400, { error: 'INVALID_EVENT' });
        return;
      }
      const event = {
        id: nextId++,
        station: body.station.trim(),
        message: body.message.trim(),
        createdAt: new Date().toISOString()
      };
      events.push(event);
      json(res, 201, event);
      return;
    }
    res.setHeader('Allow', 'GET, POST');
    json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  // Задание 4 (+ повышенная сложность): /api/events/:id
  const eventIdMatch = path.match(/^\/api\/events\/(\d+)$/);
  if (eventIdMatch) {
    const id = Number(eventIdMatch[1]);
    const index = events.findIndex((e) => e.id === id);

    if (method === 'GET') {
      if (index === -1) {
        json(res, 404, { error: 'EVENT_NOT_FOUND' });
        return;
      }
      json(res, 200, events[index]);
      return;
    }

    if (method === 'DELETE') {
      if (index === -1) {
        json(res, 404, { error: 'EVENT_NOT_FOUND' });
        return;
      }
      events.splice(index, 1);
      res.writeHead(204); // 204 No Content — без тела
      res.end();
      return;
    }

    res.setHeader('Allow', 'GET, DELETE');
    json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  // GET /api/slow?ms=3000
  if (path === '/api/slow' && method === 'GET') {
    const ms = Number(url.searchParams.get('ms') ?? 3000);
    const delay = Number.isFinite(ms) ? Math.max(0, Math.min(ms, 5000)) : 3000;
    setTimeout(() => json(res, 200, { delayedMs: delay }), delay);
    return;
  }

  // GET /api/error — учебный 503
  if (path === '/api/error' && method === 'GET') {
    json(res, 503, { error: 'SERVICE_UNAVAILABLE' });
    return;
  }

  // Известные пути, но не тот метод
  const known = ['/', '/api/status', '/api/about', '/api/stations', '/api/slow', '/api/error'];
  if (known.includes(path)) {
    res.setHeader('Allow', 'GET');
    json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  json(res, 404, { error: 'NOT_FOUND' });
});

server.on('error', (error) => {
  console.error('Ошибка сервера:', error.message);
});

server.listen(PORT, HOST, () => {
  console.log('NetLab HTTP: http://' + HOST + ':' + PORT);
});
