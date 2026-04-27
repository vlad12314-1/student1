using System;

namespace BMICalculator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("--- Калькулятор Индекса Массы Тела (ИМТ) ---");
            
            Console.WriteLine("Введите ваш вес в килограммах:");
            double weight = Convert.ToDouble(Console.ReadLine());
            
            Console.WriteLine("Введите ваш рост в метрах (например, 1.75):");
            double height = Convert.ToDouble(Console.ReadLine());
            
            double bmi = weight / (height * height);
            
            Console.WriteLine("\n--- Ваш результат ---");
            Console.WriteLine($"При весе {weight} кг и росте {height} м, ваш ИМТ составляет: {bmi}");
            
            if (bmi < 18.5)
                Console.WriteLine("У вас недостаточная масса тела.");
            else if (bmi < 25)
                Console.WriteLine("У вас нормальная масса тела.");
            else if (bmi < 30)
                Console.WriteLine("У вас избыточная масса тела.");
            else
                Console.WriteLine("У вас ожирение.");
            
            Console.WriteLine("\nНажмите любую клавишу для выхода...");
            Console.ReadKey();
        }
    }
}