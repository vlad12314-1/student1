import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Калькулятор',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const Calculator(),
    );
  }
}

class Calculator extends StatefulWidget {
  const Calculator({super.key});

  @override
  State<Calculator> createState() => _CalculatorState();
}

class _CalculatorState extends State<Calculator> {
  String _display = '0';
  double _firstNumber = 0;
  String _operator = '';
  bool _waitingForSecondNumber = false;

  void _buttonPressed(String value) {
    setState(() {
      if (value == 'C') {
        _display = '0';
        _firstNumber = 0;
        _operator = '';
        _waitingForSecondNumber = false;
      } else if (value == '+' || value == '-' || value == '×' || value == '÷') {
        _firstNumber = double.parse(_display);
        _operator = value;
        _waitingForSecondNumber = true;
      } else if (value == '=') {
        if (_operator.isNotEmpty) {
          double secondNumber = double.parse(_display);
          double result = 0;
          
          switch (_operator) {
            case '+':
              result = _firstNumber + secondNumber;
              break;
            case '-':
              result = _firstNumber - secondNumber;
              break;
            case '×':
              result = _firstNumber * secondNumber;
              break;
            case '÷':
              if (secondNumber != 0) {
                result = _firstNumber / secondNumber;
              } else {
                _display = 'Ошибка';
                return;
              }
              break;
          }
          
          _display = result.toString();
          if (_display.endsWith('.0')) {
            _display = _display.substring(0, _display.length - 2);
          }
          _operator = '';
          _waitingForSecondNumber = false;
        }
      } else {
        if (_waitingForSecondNumber) {
          _display = value;
          _waitingForSecondNumber = false;
        } else {
          if (_display == '0') {
            _display = value;
          } else {
            _display += value;
          }
        }
      }
    });
  }

  Widget buildButton(String text, {Color? color}) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(4.0),
        child: InkWell(
          onTap: () => _buttonPressed(text),
          child: Container(
            decoration: BoxDecoration(
              color: color ?? Colors.grey[300],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                text,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Калькулятор'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            alignment: Alignment.centerRight,
            child: Text(
              _display,
              style: const TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        buildButton('7'),
                        buildButton('8'),
                        buildButton('9'),
                        buildButton('÷', color: Colors.orange),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Row(
                      children: [
                        buildButton('4'),
                        buildButton('5'),
                        buildButton('6'),
                        buildButton('×', color: Colors.orange),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Row(
                      children: [
                        buildButton('1'),
                        buildButton('2'),
                        buildButton('3'),
                        buildButton('-', color: Colors.orange),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Row(
                      children: [
                        buildButton('0'),
                        buildButton('C', color: Colors.red),
                        buildButton('=', color: Colors.green),
                        buildButton('+', color: Colors.orange),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}