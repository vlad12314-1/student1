import dgram from 'node:dgram';

const PORT = 3030;
const GROUP = '239.255.10.10';
const GROUP2 = '239.255.10.20'; // вторая группа — доработка № 4

const mode = (process.argv[2] || 'unicast').toLowerCase();
const customAddress = process.argv[3];
// Текст объявления из аргументов — доработка № 1
const text = process.argv.slice(4).join(' ') ||
  mode.toUpperCase() + ': NetLab announcement';

const addresses = {
  unicast: customAddress || '127.0.0.1',
  broadcast: customAddress,
  multicast: customAddress || GROUP
};

if (!Object.hasOwn(addresses, mode) || !addresses[mode]) {
  console.log('Использование:');
  console.log('node sender.mjs unicast [IP] [текст]');
  console.log('node sender.mjs broadcast <broadcast-IP> [текст]');
  console.log(`node sender.mjs multicast [адрес группы: ${GROUP} или ${GROUP2}] [текст]`);
  process.exit(1);
}

const socket = dgram.createSocket('udp4');
const target = addresses[mode];

socket.on('error', (error) => {
  console.error('[SENDER ERROR]', error.message);
  socket.close();
});

socket.bind(0, '0.0.0.0', () => {
  try {
    if (mode === 'broadcast') {
      socket.setBroadcast(true);
    }
    if (mode === 'multicast') {
      socket.setMulticastTTL(1);
      socket.setMulticastLoopback(true);
      if (process.env.MULTICAST_IFACE) {
        socket.setMulticastInterface(process.env.MULTICAST_IFACE);
      }
    }
    socket.send(text, PORT, target, (error) => {
      if (error) {
        console.error('Отправка не удалась:', error.message);
      } else {
        console.log('Датаграмма передана ОС:', text);
        console.log('Назначение:', target + ':' + PORT);
      }
      socket.close();
    });
  } catch (error) {
    console.error('Настройка сокета:', error.message);
    socket.close();
  }
});
