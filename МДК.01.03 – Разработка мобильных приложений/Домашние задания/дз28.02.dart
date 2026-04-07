import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Невидимый текст',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const FirstScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

// ==================== ПЕРВЫЙ ЭКРАН ====================
class FirstScreen extends StatefulWidget {
  const FirstScreen({super.key});

  @override
  State<FirstScreen> createState() => _FirstScreenState();
}

class _FirstScreenState extends State<FirstScreen> {
  final TextEditingController _controller = TextEditingController();
  final String defaultText = "Валера молодец";

  @override
  void initState() {
    super.initState();
    _controller.text = defaultText;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Первый экран')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Введите текст',
              ),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () {
                String text = _controller.text.trim();
                if (text.isEmpty) text = defaultText;
                
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SecondScreen(userText: text),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
              ),
              child: const Text('Отправить', style: TextStyle(fontSize: 18)),
            ),
          ],
        ),
      ),
    );
  }
}

// ==================== ВТОРОЙ ЭКРАН ====================
class SecondScreen extends StatefulWidget {
  final String userText;
  const SecondScreen({super.key, required this.userText});

  @override
  State<SecondScreen> createState() => _SecondScreenState();
}

class _SecondScreenState extends State<SecondScreen> {
  late Color _textColor;
  late Color _backgroundColor;
  late int _originalColorIndex;
  bool _isTextVisible = false;

  final List<Color> _colors = [Colors.red, Colors.green, Colors.blue];
  final List<String> _colorNames = ['Красный', 'Зелёный', 'Синий'];

  @override
  void initState() {
    super.initState();
    // Выбираем случайный цвет (0 - красный, 1 - зелёный, 2 - синий)
    _originalColorIndex = Random().nextInt(3);
    _textColor = _colors[_originalColorIndex];
    _backgroundColor = _colors[_originalColorIndex];
    _isTextVisible = false;
  }

  void _changeBackground(Color newColor, int newColorIndex) {
    setState(() {
      if (newColorIndex != _originalColorIndex) {
        // Если нажали кнопку другого цвета — делаем текст видимым
        _backgroundColor = newColor;
        _textColor = Colors.white;
        _isTextVisible = true;
      } else {
        // Если нажали ту же кнопку — ничего не меняем
        // (текст остаётся невидимым)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Нужно нажать на кнопку ${_colorNames[(_originalColorIndex + 1) % 3]} цвета!'),
            duration: const Duration(seconds: 1),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Второй экран')),
      body: Container(
        color: _backgroundColor,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(
              child: Center(
                child: Text(
                  widget.userText,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: _textColor,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildColorButton(Colors.red, 'Красный', 0),
                  _buildColorButton(Colors.green, 'Зелёный', 1),
                  _buildColorButton(Colors.blue, 'Синий', 2),
                ],
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildColorButton(Color color, String label, int index) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: () => _changeBackground(color, index),
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            shape: const CircleBorder(),
            padding: const EdgeInsets.all(25),
          ),
          child: Text(
            label[0],
            style: const TextStyle(fontSize: 24, color: Colors.white),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(color: Colors.white)),
      ],
    );
  }
}