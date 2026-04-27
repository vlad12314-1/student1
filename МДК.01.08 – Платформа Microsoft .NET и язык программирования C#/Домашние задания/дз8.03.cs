using System;

class MonsterChaseGame
{
    static int playerX, playerY;
    static int monsterX, monsterY;
    static int moves = 0;
    static Random rand = new Random();

    static void Main()
    {
        InitializeGame();

        while (moves < 20)
        {
            DrawMap();
            Console.WriteLine($"\nХод: {moves + 1}/20");

            if (IsGameOver())
            {
                Console.WriteLine("\nМонстр поймал вас! Игра окончена!");
                return;
            }

            ProcessPlayerMove();
            moves++;

            if (IsGameOver())
            {
                DrawMap();
                Console.WriteLine("\nМонстр поймал вас! Игра окончена!");
                return;
            }

            MoveMonster();
        }

        DrawMap();
        Console.WriteLine("\nПоздравляем! Вы продержались 20 ходов и победили!");
    }

    static void InitializeGame()
    {
        playerX = rand.Next(0, 10);
        playerY = rand.Next(0, 10);
        
        do
        {
            monsterX = rand.Next(0, 10);
            monsterY = rand.Next(0, 10);
        } while (monsterX == playerX && monsterY == playerY);
    }

    static void DrawMap()
    {
        Console.Clear();
        Console.WriteLine("Карта 10x10 (P - игрок, M - монстр):\n");

        for (int i = 0; i < 10; i++)
        {
            for (int j = 0; j < 10; j++)
            {
                if (i == playerY && j == playerX)
                    Console.Write("P ");
                else if (i == monsterY && j == monsterX)
                    Console.Write("M ");
                else
                    Console.Write(". ");
            }
            Console.WriteLine();
        }
    }

    static void ProcessPlayerMove()
    {
        Console.Write("\nВаш ход (W-вверх, S-вниз, A-влево, D-вправо): ");
        char key = Console.ReadKey().KeyChar;
        Console.WriteLine();

        int newX = playerX;
        int newY = playerY;

        switch (char.ToUpper(key))
        {
            case 'W': newY--; break;
            case 'S': newY++; break;
            case 'A': newX--; break;
            case 'D': newX++; break;
            default:
                Console.WriteLine("Неверная клавиша! Ход пропущен.");
                return;
        }

        if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10)
        {
            playerX = newX;
            playerY = newY;
        }
        else
        {
            Console.WriteLine("Нельзя выйти за границы карты! Ход пропущен.");
        }
    }

    static void MoveMonster()
    {
        if (Math.Abs(monsterX - playerX) > Math.Abs(monsterY - playerY))
        {
            if (monsterX < playerX && monsterX + 1 < 10)
                monsterX++;
            else if (monsterX > playerX && monsterX - 1 >= 0)
                monsterX--;
            else if (monsterY < playerY && monsterY + 1 < 10)
                monsterY++;
            else if (monsterY > playerY && monsterY - 1 >= 0)
                monsterY--;
        }
        else
        {
            if (monsterY < playerY && monsterY + 1 < 10)
                monsterY++;
            else if (monsterY > playerY && monsterY - 1 >= 0)
                monsterY--;
            else if (monsterX < playerX && monsterX + 1 < 10)
                monsterX++;
            else if (monsterX > playerX && monsterX - 1 >= 0)
                monsterX--;
        }
    }

    static bool IsGameOver()
    {
        return (playerX == monsterX && playerY == monsterY);
    }
}