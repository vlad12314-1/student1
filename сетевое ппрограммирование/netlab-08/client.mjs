
const BASE_URL = 'http://127.0.0.1:3041';

// ---------- Базовая функция запроса ----------

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    timeout = 1500,
    headers = {}
  } = options;

  const started = performance.now();

  // JSON-тело → Content-Type: application/json
  const requestHeaders = body === undefined
    ? { ...headers }
    : { 'Content-Type': 'application/json', ...headers };

  try {
    const response = await fetch(BASE_URL + path, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeout)
    });

    const elapsed = Math.round(performance.now() - started);
    const contentType = response.headers.get('content-type');

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    console.log('\n' + method + ' ' + path);
    console.log('HTTP status:', response.status);
    console.log('response.ok:', response.ok);
    console.log('Content-Type:', contentType);
    console.log('Cache-Control:', response.headers.get('cache-control'));
    console.log('Time:', elapsed + ' ms');
    console.log('Body:', data);

    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    const elapsed = Math.round(performance.now() - started);

    console.log('\n' + method + ' ' + path);
    console.log('Нет полного HTTP-ответа');
    console.log('Error:', error.name);
    console.log('Message:', error.message);

    // Причина ошибки (сетевая или тайм-аут) — в error.cause
    if (error.cause) {
      console.log('Cause:', error.cause.code ?? error.cause.message);
    }

    // Понятное сообщение, если сервер не запущен
    const code = error.cause?.code;
    if (code === 'ECONNREFUSED') {
      console.log(
        'Подсказка: сервер не запущен. Перейдите в папку netlab-http ' +
        'и выполните: node server.mjs'
      );
    } else if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.log('Подсказка: клиентский тайм-аут — сервер не успел ответить за ' + timeout + ' мс.');
    }

    console.log('Time:', elapsed + ' ms');
    return null;
  }
}

// ---------- Самостоятельная часть: функции и команды ----------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// status — с одной повторной попыткой при временной сетевой ошибке
async function getStatus() {
  const first = await request('/api/status');
  if (first) return first;

  console.log('\nПовторная попытка GET /api/status через 2 секунды...');
  await sleep(2000);
  return request('/api/status');
}

async function getEvents() {
  return request('/api/events');
}

// send — POST не повторяем автоматически: повтор создаст дубликат события
async function createEvent(station, message) {
  return request('/api/events', {
    method: 'POST',
    body: { station, message }
  });
}

// ---------- Полная демонстрация (как в задании) ----------

async function demo() {
  await request('/api/status');              // 200
  await request('/api/events');              // 200
  await request('/api/events', {             // 201
    method: 'POST',
    body: { station: 'PC-07', message: 'REQUEST_HELP' }
  });
  await request('/api/events');              // 200, массив с новым событием

  await request('/missing');                 // 404, ok: false
  await request('/api/error');               // 503, ok: false
  await request('/api/slow?ms=3000', {       // клиентский тайм-аут
    timeout: 4000                            // было 1000 — теперь сервер успевает ответить
  });

  // Неправильные запросы
  await request('/api/events', {             // 400 Bad Request
    method: 'POST',
    body: { station: 'PC-07', message: '' }
  });
  await request('/api/events', { method: 'PUT' }); // 405 Method Not Allowed

  // Сервер не запущен → ECONNREFUSED внутри TypeError (проверка задания 4)
}

// ---------- Точка входа ----------

const command = process.argv[2];

if (command === 'status') {
  await getStatus();
} else if (command === 'events') {
  await getEvents();
} else if (command === 'send') {
  await createEvent('PC-07', 'REQUEST_HELP');
} else {
  await demo();
}
