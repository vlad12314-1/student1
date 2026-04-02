import 'package:flutter/material.dart';
import 'package:getwidget/getwidget.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Status Card',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const UserProfileCard(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class UserProfileCard extends StatefulWidget {
  const UserProfileCard({super.key});

  @override
  State<UserProfileCard> createState() => _UserProfileCardState();
}

class _UserProfileCardState extends State<UserProfileCard> {
  // Список статусов
  final List<String> _statuses = [
    'Отдыхаю',
    'Работаю',
    'В отпуске',
    'Не в сети',
  ];

  // Список цветов для статусов
  final List<Color> _statusColors = [
    Colors.green,
    Colors.blue,
    Colors.orange,
    Colors.grey,
  ];

  // Текущий индекс статуса
  int _currentStatusIndex = 0;

  // Текущий цвет фона карточки
  Color _cardColor = Colors.white;

  // Метод для циклического изменения статуса
  void _cycleStatus() {
    setState(() {
      _currentStatusIndex = (_currentStatusIndex + 1) % _statuses.length;
    });
  }

  // Метод для изменения цвета фона карточки
  void _changeBackgroundColor(Color color) {
    setState(() {
      _cardColor = color;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Профиль пользователя'),
        backgroundColor: Colors.teal,
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: GFCard(
            boxFit: BoxFit.cover,
            color: _cardColor,
            elevation: 8,
            border: Border.all(color: Colors.grey.shade300, width: 1),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Аватар и имя пользователя
                const Row(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.teal,
                      child: Icon(
                        Icons.person,
                        size: 50,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(width: 20),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Алексей Иванов',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'alexey@example.com',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Divider(),
                const SizedBox(height: 10),

                // Статус с цветом
                GFListTile(
                  title: const Text(
                    'Текущий статус',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  subTitle: Container(
                    margin: const EdgeInsets.only(top: 5),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: _statusColors[_currentStatusIndex].withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _statuses[_currentStatusIndex],
                      style: TextStyle(
                        fontSize: 16,
                        color: _statusColors[_currentStatusIndex],
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Кнопка для смены статуса
                Center(
                  child: GFButton(
                    onPressed: _cycleStatus,
                    color: GFColors.SUCCESS,
                    size: GFSize.LARGE,
                    shape: GFButtonShape.pills,
                    child: const Text(
                      'Сменить статус',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const Divider(),
                const SizedBox(height: 10),

                // Дополнительные кнопки для смены цвета фона
                const Text(
                  'Изменить цвет фона карточки:',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    GFButton(
                      onPressed: () => _changeBackgroundColor(Colors.red),
                      color: GFColors.DANGER,
                      child: const Text('Красный'),
                    ),
                    GFButton(
                      onPressed: () => _changeBackgroundColor(Colors.green),
                      color: GFColors.SUCCESS,
                      child: const Text('Зелёный'),
                    ),
                    GFButton(
                      onPressed: () => _changeBackgroundColor(Colors.blue),
                      color: GFColors.INFO,
                      child: const Text('Синий'),
                    ),
                    GFButton(
                      onPressed: () => _changeBackgroundColor(Colors.orange),
                      color: GFColors.WARNING,
                      child: const Text('Оранжевый'),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Center(
                  child: GFButton(
                    onPressed: () => _changeBackgroundColor(Colors.white),
                    color: GFColors.SECONDARY,
                    child: const Text('Сбросить (белый)'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}