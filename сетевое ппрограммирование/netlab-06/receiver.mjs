import dgram from 'node:dgram';
import readline from 'node:readline';

const PORT = 3030;
// Две группы для опыта из задания 8 (п. 4):
// подписку можно ограничить через MULTICAST_GROUPS="239.255.10.10"
const ALL_GROUPS = ['239.255.10.10', '239.255.10.20'];
const GROUPS = process.env.MULTICAST_GROUPS
  ? process.env.MULTICAST_GROUPS.split(',').map(s => s.trim())
  : ALL_GROUPS;
const IFACE = process.env.MULTICAST_IFACE;

const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

socket.on('message', (buffer, sender) => {
  const time = new Date().toLocaleString('ru-RU'); // дата и время — доработка № 2
  console.log(
    `[${time}] [RECEIVED] ${buffer.toString('utf8')}` +
    ` FROM ${sender.address}:${sender.port}`
  );
});

socket.on('error', (error) => {
  console.error('[RECEIVER ERROR]', error.message);
  socket.close();
});

socket.on('close', () => console.log('Приёмник остановлен'));

socket.bind(PORT, '0.0.0.0', () => {
  console.log('UDP приёмник: порт ' + PORT);
  for (const group of GROUPS) {
    try {
      socket.addMembership(group, IFACE);
      console.log('Подписка на группу: ' + group);
    } catch (error) {
      console.log(`Multicast недоступен (${group}):`, error.message);
      console.log('Unicast по-прежнему можно проверить');
    }
  }
  console.log("Введите STOP для корректной остановки приёмника");

  // Команда STOP — доработка № 3: читаем только локальный ввод
  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', (line) => {
    if (line.trim().toUpperCase() === 'STOP') {
      for (const group of GROUPS) {
        try { socket.dropMembership(group, IFACE); } catch {}
      }
      rl.close();
      socket.close();
    }
  });
});
