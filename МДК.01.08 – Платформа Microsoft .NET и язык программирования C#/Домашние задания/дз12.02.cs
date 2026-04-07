using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static List<string> words = new List<string> { "ПРОГРАММИРОВАНИЕ", "КОМПЬЮТЕР", "РАЗРАБОТЧИК", "АЛГОРИТМ", "ВИСЕЛИЦА" };
    static Random random = new Random();
    
    static void Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        Console.Title = "Игра Виселица";
        
        bool playAgain = true;
        
        while (playAgain)
        {
            PlayGame();
            playAgain = AskPlayAgain();
        }
        
        Console.WriteLine("Спасибо за игру! До свидания!");
    }
    
    static void PlayGame()
    {
        string secretWord = GetRandomWord();
        char[] guessedWord = new char[secretWord.Length];
        InitializeGuessedWord(guessedWord);
        
        List<char> usedLetters = new List<char>();
        int attempts = 6;
        bool wordGuessed = false;
        
        Console.Clear();
        Console.WriteLine("=== ДОБРО ПОЖАЛОВАТЬ В ИГРУ ВИСЕЛИЦА ===\n");
        
        while (attempts > 0 && !wordGuessed)
        {
            DisplayGameStatus(guessedWord, usedLetters, attempts);
            char guess = GetPlayerGuess(usedLetters);
            usedLetters.Add(guess);
            
            if (IsGuessCorrect(secretWord, guess))
            {
                UpdateGuessedWord(secretWord, guessedWord, guess);
                wordGuessed = IsWordGuessed(guessedWord);
                
                if (wordGuessed)
                {
                    DisplayWinMessage(secretWord);
                }
            }
            else
            {
                attempts--;
                DisplayWrongGuessMessage(guess, attempts);
                DisplayHangman(attempts);
            }
        }
        
        if (!wordGuessed)
        {
            DisplayLoseMessage(secretWord);
        }
    }
    
    static string GetRandomWord()
    {
        return words[random.Next(words.Count)];
    }
    
    static void InitializeGuessedWord(char[] guessedWord)
    {
        for (int i = 0; i < guessedWord.Length; i++)
        {
            guessedWord[i] = '_';
        }
    }
    
    static void DisplayGameStatus(char[] guessedWord, List<char> usedLetters, int attempts)
    {
        Console.WriteLine("\n" + new string('-', 50));
        Console.WriteLine($"Осталось попыток: {attempts}");
        Console.WriteLine("Загаданное слово: " + string.Join(" ", guessedWord));
        Console.WriteLine("Использованные буквы: " + (usedLetters.Count > 0 ? string.Join(", ", usedLetters) : "пока нет"));
        Console.WriteLine(new string('-', 50));
    }
    
    static char GetPlayerGuess(List<char> usedLetters)
    {
        char guess;
        bool validInput;
        
        do
        {
            Console.Write("\nВведите букву: ");
            string input = Console.ReadLine().ToUpper();
            
            validInput = input.Length == 1 && char.IsLetter(input[0]);
            
            if (!validInput)
            {
                Console.WriteLine("Ошибка: введите одну букву!");
                continue;
            }
            
            guess = input[0];
            
            if (usedLetters.Contains(guess))
            {
                Console.WriteLine("Вы уже использовали эту букву! Попробуйте другую.");
                validInput = false;
            }
            
        } while (!validInput);
        
        return guess;
    }
    
    static bool IsGuessCorrect(string secretWord, char guess)
    {
        return secretWord.Contains(guess);
    }
    
    static void UpdateGuessedWord(string secretWord, char[] guessedWord, char guess)
    {
        for (int i = 0; i < secretWord.Length; i++)
        {
            if (secretWord[i] == guess)
            {
                guessedWord[i] = guess;
            }
        }
    }
    
    static bool IsWordGuessed(char[] guessedWord)
    {
        return !guessedWord.Contains('_');
    }
    
    static void DisplayWrongGuessMessage(char guess, int attemptsLeft)
    {
        Console.WriteLine($"\nБуквы '{guess}' нет в слове! Осталось попыток: {attemptsLeft}");
    }
    
    static void DisplayHangman(int attempts)
    {
        Console.WriteLine("\n=== ВИСЕЛИЦА ===");
        switch (attempts)
        {
            case 5:
                Console.WriteLine("   +---+");
                Console.WriteLine("   |   |");
                Console.WriteLine("   O   |");
                Console.WriteLine("       |");
                Console.WriteLine("       |");
                Console.WriteLine("       |");
                Console.WriteLine("=========");
                break;
            case 4:
                Console.WriteLine("   +---+");
                Console.WriteLine("   |   |");
                Console.WriteLine("   O   |");
                Console.WriteLine("   |   |");
                Console.WriteLine("       |");
                Console.WriteLine("       |");
                Console.WriteLine("=========");
                break;
            case 3:
                Console.WriteLine("   +---+");
                Console.WriteLine("   |   |");
                Console.WriteLine("   O   |");
                Console.WriteLine("  /|   |");
                Console.WriteLine("       |");
                Console.WriteLine("       |");
                Console.WriteLine("=========");
                break;
            case 2:
                Console.WriteLine("   +---+");
                Console.WriteLine("   |   |");
                Console.WriteLine("   O   |");
                Console.WriteLine("  /|\\  |");
                Console.WriteLine("       |");
                Console.WriteLine("       |");
                Console.WriteLine("=========");
                break;
            case 1:
                Console.WriteLine("   +---+");
                Console.WriteLine("   |   |");
                Console.WriteLine("   O   |");
                Console.WriteLine("  /|\\  |");
                Console.WriteLine("  /    |");
                Console.WriteLine("       |");
                Console.WriteLine("=========");
                break;
            case 0:
                Console.WriteLine("   +---+");
                Console.WriteLine("   |   |");
                Console.WriteLine("   O   |");
                Console.WriteLine("  /|\\  |");
                Console.WriteLine("  / \\  |");
                Console.WriteLine("       |");
                Console.WriteLine("=========");
                Console.WriteLine("\nGAME OVER! Вы проиграли!");
                break;
        }
    }
    
    static void DisplayWinMessage(string word)
    {
        Console.WriteLine("\n" + new string('=', 50));
        Console.WriteLine($"ПОЗДРАВЛЯЮ! Вы угадали слово: {word}");
        Console.WriteLine("ВЫ ПОБЕДИЛИ!");
        Console.WriteLine(new string('=', 50));
    }
    
    static void DisplayLoseMessage(string word)
    {
        Console.WriteLine("\n" + new string('=', 50));
        Console.WriteLine($"К сожалению, вы проиграли!");
        Console.WriteLine($"Загаданное слово было: {word}");
        Console.WriteLine("Попробуйте снова!");
        Console.WriteLine(new string('=', 50));
    }
    
    static bool AskPlayAgain()
    {
        Console.Write("\nХотите сыграть еще раз? (да/нет): ");
        string response = Console.ReadLine().ToLower();
        return response == "да" || response == "yes" || response == "y" || response == "д";
    }
}