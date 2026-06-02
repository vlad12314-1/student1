#include <iostream>
#include <fstream>
#include <string>
#include <vector>

// Функции для определения типа сообщения
bool isInfo(const std::string& line) {
    return line.find("INFO:") == 0;
}

bool isWarning(const std::string& line) {
    return line.find("WARNING:") == 0;
}

bool isError(const std::string& line) {
    return line.find("ERROR:") == 0;
}

// Функция для обработки лог-файла
void processLogFile(const std::string& filename, 
                    int& infoCount, 
                    int& warningCount, 
                    int& errorCount,
                    std::vector<std::string>& errorMessages) {
    
    std::ifstream file(filename);
    
    if (!file.is_open()) {
        std::cerr << "Ошибка: не удалось открыть файл " << filename << std::endl;
        return;
    }
    
    std::string line;
    
    while (std::getline(file, line)) {
        if (isInfo(line)) {
            infoCount++;
        }
        else if (isWarning(line)) {
            warningCount++;
        }
        else if (isError(line)) {
            errorCount++;
            errorMessages.push_back(line);
        }
    }
    
    file.close();
}

// Функция для вывода статистики
void printStatistics(int infoCount, int warningCount, int errorCount) {
    std::cout << "Статистика:" << std::endl;
    std::cout << "INFO: " << infoCount << std::endl;
    std::cout << "WARNING: " << warningCount << std::endl;
    std::cout << "ERROR: " << errorCount << std::endl;
}

// Функция для вывода ошибок
void printErrors(const std::vector<std::string>& errorMessages) {
    std::cout << "\nОшибки:" << std::endl;
    for (const auto& error : errorMessages) {
        std::cout << error << std::endl;
    }
}

int main() {
    // Инициализация счетчиков
    int infoCount = 0;
    int warningCount = 0;
    int errorCount = 0;
    
    // Вектор для хранения сообщений об ошибках
    std::vector<std::string> errorMessages;
    
    // Обработка лог-файла
    processLogFile("log.txt", infoCount, warningCount, errorCount, errorMessages);
    
    // Вывод результатов
    printStatistics(infoCount, warningCount, errorCount);
    printErrors(errorMessages);
    
    return 0;
}