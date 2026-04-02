import 'package:flutter/material.dart';
import 'package:getwidget/getwidget.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TextField и GFToast',
      home: NameScreen(),
    );
  }
}

class NameScreen extends StatefulWidget {
  @override
  _NameScreenState createState() => _NameScreenState();
}

class _NameScreenState extends State<NameScreen> {
  late TextEditingController _nameController;
  String _displayName = '';

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _showName() {
    setState(() {
      _displayName = _nameController.text;
    });

    // GFToast — всплывающее уведомление
    GFToast.showToast(
      'Привет, $_displayName!',
      context,
      toastPosition: GFToastPosition.BOTTOM,
      duration: Duration(seconds: 2),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('TextField и GFToast'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            GFTextField(
              controller: _nameController,
              onSubmitted: (value) => _showName(),
              decoration: InputDecoration(
                labelText: 'Введите ваше имя',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 20),
            GFButton(
              onPressed: _showName,
              text: 'Показать имя',
            ),
            SizedBox(height: 30),
            Text(
              _displayName.isEmpty ? 'Имя появится здесь' : 'Имя: $_displayName',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}