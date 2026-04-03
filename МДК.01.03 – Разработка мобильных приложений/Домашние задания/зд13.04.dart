// main.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:math';

void main() {
  runApp(const VictorinaApp());
}

class VictorinaApp extends StatelessWidget {
  const VictorinaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const VictorinaHome(),
    );
  }
}

// ==================== ГЛАВНЫЙ ЭКРАН ====================
class VictorinaHome extends StatefulWidget {
  const VictorinaHome({super.key});

  @override
  State<VictorinaHome> createState() => _VictorinaHomeState();
}

class _VictorinaHomeState extends State<VictorinaHome> {
  int _bestScore = 0;

  @override
  void initState() {
    super.initState();
    _loadBestScore();
  }

  Future<void> _loadBestScore() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _bestScore = prefs.getInt('best_score') ?? 0;
    });
  }

  Future<void> _saveBestScore(int score) async {
    final prefs = await SharedPreferences.getInstance();
    final bestScore = prefs.getInt('best_score') ?? 0;
    if (score > bestScore) {
      await prefs.setInt('best_score', score);
      setState(() => _bestScore = score);
    }
  }

  Future<void> _resetBestScore() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('best_score');
    setState(() => _bestScore = 0);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Викторина')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.quiz, size: 100, color: Colors.blue),
            const SizedBox(height: 32),
            const Text(
              'Викторина',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
              'Рекорд: $_bestScore',
              style: const TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => QuizScreen(onFinish: _saveBestScore),
                  ),
                );
              },
              child: const Padding(
                padding: EdgeInsets.all(12.0),
                child: Text('Начать', style: TextStyle(fontSize: 16)),
              ),
            ),
            TextButton(
              onPressed: _resetBestScore,
              child: const Text('Сбросить рекорд'),
            ),
          ],
        ),
      ),
    );
  }
}

// ==================== ЭКРАН ВИКТОРИНЫ ====================
class QuizScreen extends StatefulWidget {
  final Function(int) onFinish;

  const QuizScreen({super.key, required this.onFinish});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final List<Map<String, dynamic>> _questions = [
    {
      'question': 'Столица Франции?',
      'options': ['Лондон', 'Берлин', 'Париж', 'Мадрид'],
      'correct': 2,
    },
    {
      'question': 'Сколько дней в неделе?',
      'options': ['5', '6', '7', '8'],
      'correct': 2,
    },
    {
      'question': 'Какого цвета трава?',
      'options': ['Красная', 'Зеленая', 'Синяя', 'Желтая'],
      'correct': 1,
    },
    {
      'question': 'Сколько пальцев на руке?',
      'options': ['4', '5', '6', '3'],
      'correct': 1,
    },
    {
      'question': 'Кто написал "Евгений Онегин"?',
      'options': ['Лермонтов', 'Толстой', 'Пушкин', 'Достоевский'],
      'correct': 2,
    },
  ];

  int _currentQuestion = 0;
  int _score = 0;
  bool _answered = false;
  bool _showResult = false;

  @override
  void initState() {
    super.initState();
    _questions.shuffle(Random());
  }

  void _selectAnswer(int index) {
    if (_answered) return;

    if (index == _questions[_currentQuestion]['correct']) {
      _score++;
    }

    setState(() => _answered = true);

    Future.delayed(const Duration(milliseconds: 500), () {
      if (_currentQuestion < _questions.length - 1) {
        setState(() {
          _currentQuestion++;
          _answered = false;
        });
      } else {
        setState(() => _showResult = true);
      }
    });
  }

  void _restart() {
    setState(() {
      _questions.shuffle(Random());
      _currentQuestion = 0;
      _score = 0;
      _answered = false;
      _showResult = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_showResult) {
      widget.onFinish(_score);
      return Scaffold(
        appBar: AppBar(title: const Text('Результат')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.emoji_events, size: 100, color: Colors.amber),
              const SizedBox(height: 32),
              Text(
                '$_score из ${_questions.length}',
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Text(
                _score == _questions.length
                    ? 'Идеально!'
                    : _score > _questions.length / 2
                        ? 'Неплохо'
                        : 'Попробуй ещё раз',
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _restart,
                child: const Text('Играть снова'),
              ),
            ],
          ),
        ),
      );
    }

    final question = _questions[_currentQuestion];
    final options = question['options'] as List;

    return Scaffold(
      appBar: AppBar(
        title: Text('Вопрос ${_currentQuestion + 1}/${_questions.length}'),
      ),
      body: IgnorePointer(
        ignoring: _answered,
        child: AnimatedOpacity(
          opacity: _answered ? 0.5 : 1.0,
          duration: const Duration(milliseconds: 200),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 32),
                Text(
                  question['question'],
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                ...options.map((option) => Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: ElevatedButton(
                    onPressed: () => _selectAnswer(options.indexOf(option)),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16.0),
                    ),
                    child: Text(option, style: const TextStyle(fontSize: 16)),
                  ),
                )).toList(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}