using System;
using System.Linq;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Задание 1: Удаление фрукта ===");
        string[] fruits = { "Яблоко", "Банан", "Апельсин", "Виноград", "Киви" };
        Console.WriteLine("Исходный массив фруктов: " + string.Join(", ", fruits));
        
        string fruitToRemove = "Апельсин";
        fruits = fruits.Where(f => f != fruitToRemove).ToArray();
        Console.WriteLine($"После удаления '{fruitToRemove}': " + string.Join(", ", fruits));
        Console.WriteLine();

        Console.WriteLine("=== Задание 2: Поиск имени ===");
        string[] names = { "Анна", "Алекс", "Мария", "Дмитрий", "Ольга" };
        Console.WriteLine("Массив имен: " + string.Join(", ", names));
        
        string searchName = "Алекс";
        bool contains = false;
        foreach (string name in names)
        {
            if (name == searchName)
            {
                contains = true;
                break;
            }
        }
        Console.WriteLine($"Имя '{searchName}' {(contains ? "присутствует" : "отсутствует")} в массиве");
        Console.WriteLine();

        Console.WriteLine("=== Задание 3: Сумма чисел ===");
        int[] numbers = { 10, 20, 30, 40, 50 };
        Console.WriteLine("Массив чисел: " + string.Join(", ", numbers));
        
        int sum = 0;
        for (int i = 0; i < numbers.Length; i++)
        {
            sum += numbers[i];
        }
        Console.WriteLine($"Сумма элементов: {sum}");
        Console.WriteLine();

        Console.WriteLine("=== Задание 4: Числа, квадраты и кубы ===");
        int size = 10;
        int[] original = new int[size];
        int[] squares = new int[size];
        int[] cubes = new int[size];
        
        for (int i = 0; i < size; i++)
        {
            original[i] = i + 1;
            squares[i] = original[i] * original[i];
            cubes[i] = original[i] * original[i] * original[i];
        }
        
        Console.WriteLine("Числа:    " + string.Join(" ", original));
        Console.WriteLine("Квадраты: " + string.Join(" ", squares));
        Console.WriteLine("Кубы:     " + string.Join(" ", cubes));
    }
}