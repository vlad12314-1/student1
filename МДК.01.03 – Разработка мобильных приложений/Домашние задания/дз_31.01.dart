import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Визитка',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const BusinessCardPage(),
    );
  }
}

class BusinessCardPage extends StatelessWidget {
  const BusinessCardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Моя визитка'),
        centerTitle: true,
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.3),
                  spreadRadius: 2,
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: const BusinessCardContent(),
          ),
        ),
      ),
    );
  }
}

class BusinessCardContent extends StatelessWidget {
  const BusinessCardContent({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Верхняя строка с категорией и иконкой
            Padding(
          padding: EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Flutter Разработчик',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.blue,
                ),
              ),
              Icon(
                Icons.star,
                color: Colors.amber,
                size: 28,
              ),
            ],
          ),
        ),

        Divider(height: 1, thickness: 1, color: Colors.grey),

        // Аватар, имя и специальность
        Padding(
          padding: EdgeInsets.symmetric(vertical: 20.0),
          child: Column(
            children: [
              CircleAvatar(
                radius: 50,
                backgroundColor: Colors.blue,
                child: Icon(
                  Icons.person,
                  size: 60,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 12),
              Text(
                'Иван Петров', // Здесь укажите свое имя и фамилию
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 4),
              Text(
                'Flutter Developer',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
            ],
          ),
        ),

        Divider(height: 1, thickness: 1, color: Colors.grey),

        // Нижняя панель с иконками связи
        Padding(
          padding: EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Icon(
                Icons.phone,
                color: Colors.green,
                size: 30,
              ),
              Icon(
                Icons.email,
                color: Colors.blue,
                size: 30,
              ),
              Icon(
                Icons.message,
                color: Colors.purple,
                size: 30,
              ),
              Icon(
                Icons.link,
                color: Colors.orange,
                size: 30,
              ),
            ],
          ),
        ),
      ],
    );
  }
}