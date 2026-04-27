using System;

namespace RectangleApp
{
    class Rectangle
    {
        // Публичные поля
        public double width;
        public double height;

        // Метод для вычисления площади
        public double GetArea()
        {
            return width * height;
        }

        // Метод для вычисления периметра
        public double GetPerimeter()
        {
            return 2 * (width + height);
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // Создаем первый прямоугольник
            Rectangle rect1 = new Rectangle();
            rect1.width = 5.5;
            rect1.height = 3.2;

            // Создаем второй прямоугольник
            Rectangle rect2 = new Rectangle();
            rect2.width = 7.0;
            rect2.height = 4.5;

            // Вычисляем площадь и периметр для первого прямоугольника
            double area1 = rect1.GetArea();
            double perimeter1 = rect1.GetPerimeter();

            // Вычисляем площадь и периметр для второго прямоугольника
            double area2 = rect2.GetArea();
            double perimeter2 = rect2.GetPerimeter();

            // Выводим информацию о первом прямоугольнике
            Console.WriteLine("Прямоугольник №1:");
            Console.WriteLine($"Ширина: {rect1.width}");
            Console.WriteLine($"Высота: {rect1.height}");
            Console.WriteLine($"Площадь: {area1}");
            Console.WriteLine($"Периметр: {perimeter1}");
            Console.WriteLine();

            // Выводим информацию о втором прямоугольнике
            Console.WriteLine("Прямоугольник №2:");
            Console.WriteLine($"Ширина: {rect2.width}");
            Console.WriteLine($"Высота: {rect2.height}");
            Console.WriteLine($"Площадь: {area2}");
            Console.WriteLine($"Периметр: {perimeter2}");

            // Чтобы консоль не закрывалась сразу
            Console.ReadKey();
        }
    }
}