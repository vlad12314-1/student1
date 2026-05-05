import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: CounterPage(),
    );
  }
}

class CounterPage extends StatefulWidget {
  @override
  _CounterPageState createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _counter = 0;
  List<String> _logs = [];

  void _increment() {
    setState(() {
      _counter++;
      _logs.add('Нажатие: счётчик стал $_counter');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Счётчик с логами')),
      body: Column(
        children: [
          Text('Счётчик: $_counter', style: TextStyle(fontSize: 24)),
          Expanded(
            child: ListView.builder(
              itemCount: _logs.length,
              itemBuilder: (context, index) {
                return ListTile(title: Text(_logs[index]));
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _increment,
        child: Icon(Icons.add),
      ),
    );
  }
}

// 4.1 В чем заключалась ошибка
// Ошибка была в том, что метод _increment() изменял переменные _counter и _logs,
// но не уведомлял фреймворк Flutter о необходимости перестроить UI.

// 4.2 Почему возникла эта ошибка
// В Flutter виджеты с состоянием (StatefulWidget) требуют явного вызова setState(),
// чтобы пометить состояние изменённым и вызвать метод build() заново.
// Без setState() изменения остаются во внутренних переменных, но экран не обновляется.

// 4.3 В чем заключается ваше исправление и почему оно работает
// Исправление: добавлен вызов setState(), внутри которого выполняются изменения _counter и _logs.
// Это работает, потому что setState() гарантирует перерисовку виджета после изменения данных,
// благодаря чему новый счётчик и новый лог сразу отображаются на экране.