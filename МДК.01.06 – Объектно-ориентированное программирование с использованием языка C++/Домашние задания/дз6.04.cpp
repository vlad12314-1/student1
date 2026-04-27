/*
Приложение: Библиотека фильмов
Основные функции:
- Просмотр каталога;
- Добавления фильма в каталог;
- Удаление фильма из каталога;
- Поиск фильма по названию;
- Редактирование фильма;
- Фильтрация фильмов по жанру.
*/

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cctype>
using namespace std;

/// @brief Фильм
class Movie{
    public:
        // Конструктор
        Movie(string title, string genre, double rating, int duration){
            this->title = title;
            this->genre = genre;
            this->rating = rating;
            this->duration = duration;
        }

        // Геттеры
        string getTitle(){ return title; };
        string getGenre(){ return genre; };
        double getRating(){ return rating; };
        int getDuration(){ return duration; };
        
        // Сеттеры для редактирования
        void setTitle(string newTitle){ title = newTitle; };
        void setGenre(string newGenre){ genre = newGenre; };
        void setRating(double newRating){ rating = newRating; };
        void setDuration(int newDuration){ duration = newDuration; };

        /// @brief Вывод информации о фильме
        void display(){
            cout << "Фильм – " << title << "\nЖанр – " << genre << "\nРейтинг – " << rating << "\nДлительность – " << duration << " мин\n" << endl;
        }

    private:
        string title; // Название фильма
        string genre; // Жанр фильма
        double rating; // Рейтинг фильма
        int duration; // Длительность в минутах
};

/// @brief Каталог фильмов
class Catalog{
    public:
        /// @brief Добавление фильма
        /// @param title Название фильма
        /// @param genre Жанр фильма
        /// @param rating Рейтинг фильма
        /// @param duration Длительность фильма
        void addMovie(string title, string genre, double rating, int duration){
            movies.push_back(Movie(title, genre, rating, duration));
            cout << "Фильм добавлен\n";
        }
        
        /// @brief Удаление фильма
        /// @param title Название фильма
        void removeMovie(string title){
            bool found = false;
            for(int i = 0; i < movies.size(); i++){
                if(movies[i].getTitle() == title){
                    movies.erase(movies.begin() + i);
                    cout << "Фильм удален\n";
                    found = true;
                    break;
                }
            }
            if(!found){
                cout << "Фильм не найден\n";
            }
        }

        /// @brief Поиск по заголовку
        /// @param title 
        void findByTitle(string title){
            bool found = false;
            for(Movie movie : movies){
                if(movie.getTitle() == title){
                    movie.display();
                    found = true;
                }
            }
            if(!found){
                cout << "Фильм не найден\n";
            }
        }
        
        /// @brief Просмотр всех фильмов
        void showMovies(){
            if(movies.empty()){
                cout << "Каталог пуст\n";
                return;
            }
            for(Movie movie : movies){
                movie.display();
            }
        }
        
        /// @brief Редактирование фильма
        /// @param title Название фильма для поиска
        void editMovie(string title){
            for(int i = 0; i < movies.size(); i++){
                if(movies[i].getTitle() == title){
                    cout << "\nРедактирование фильма: " << title << endl;
                    
                    string newTitle, newGenre;
                    double newRating;
                    int newDuration;
                    
                    cout << "Новое название (оставьте пустым, чтобы не менять): ";
                    getline(cin, newTitle);
                    if(!newTitle.empty()){
                        movies[i].setTitle(newTitle);
                    }
                    
                    cout << "Новый жанр (оставьте пустым, чтобы не менять): ";
                    getline(cin, newGenre);
                    if(!newGenre.empty()){
                        movies[i].setGenre(newGenre);
                    }
                    
                    cout << "Новый рейтинг (0-10, введите -1 чтобы не менять): ";
                    cin >> newRating;
                    if(newRating >= 0 && newRating <= 10){
                        movies[i].setRating(newRating);
                    }
                    cin.ignore();
                    
                    cout << "Новая длительность в минутах (введите -1 чтобы не менять): ";
                    cin >> newDuration;
                    if(newDuration > 0){
                        movies[i].setDuration(newDuration);
                    }
                    cin.ignore();
                    
                    cout << "Фильм успешно отредактирован!\n";
                    return;
                }
            }
            cout << "Фильм не найден\n";
        }
        
        /// @brief Фильтрация по жанру
        /// @param genre Жанр для фильтрации
        void filterByGenre(string genre){
            bool found = false;
            // Приводим жанр к нижнему регистру для поиска
            string genreLower = toLower(genre);
            
            cout << "\nФильмы в жанре \"" << genre << "\":\n";
            for(Movie movie : movies){
                string movieGenreLower = toLower(movie.getGenre());
                if(movieGenreLower.find(genreLower) != string::npos){
                    movie.display();
                    found = true;
                }
            }
            if(!found){
                cout << "Фильмы в жанре \"" << genre << "\" не найдены\n";
            }
        }
        
        /// @brief Получить список всех жанров
        void showAllGenres(){
            vector<string> genres;
            for(Movie movie : movies){
                string genre = movie.getGenre();
                if(find(genres.begin(), genres.end(), genre) == genres.end()){
                    genres.push_back(genre);
                }
            }
            
            if(genres.empty()){
                cout << "Нет фильмов в каталоге\n";
                return;
            }
            
            cout << "\nДоступные жанры:\n";
            for(string genre : genres){
                cout << "- " << genre << endl;
            }
            cout << endl;
        }

    private:
        vector<Movie> movies; // Список(вектор) фильмов
        
        /// @brief Вспомогательная функция для приведения строки к нижнему регистру
        string toLower(string str){
            for(char &c : str){
                c = tolower(c);
            }
            return str;
        }
};

int main(){
    Catalog movies; // Каталог фильмов
    int choice; // Действие пользователя
    
    // Добавим несколько тестовых фильмов
    movies.addMovie("Побег из Шоушенка", "Драма", 9.3, 142);
    movies.addMovie("Крестный отец", "Криминал", 9.2, 175);
    movies.addMovie("Темный рыцарь", "Боевик", 9.0, 152);
    
    do{
        cout << "\n========== Movies Library ==========" << endl;
        cout << "1. Показать все фильмы" << endl;
        cout << "2. Добавить фильм" << endl;
        cout << "3. Найти фильм по названию" << endl;
        cout << "4. Удалить фильм" << endl;
        cout << "5. Редактировать фильм" << endl;
        cout << "6. Фильтровать по жанру" << endl;
        cout << "7. Показать все жанры" << endl;
        cout << "0. Выход" << endl;
        cout << "Выбор: ";
        cin >> choice;

        cin.ignore(); // Очистка

        switch(choice){

            case 1:
                movies.showMovies();
                break;

            case 2:{
                string title, genre;
                double rating;
                int duration;

                cout << "Название: ";
                getline(cin, title);

                cout << "Жанр: ";
                getline(cin, genre);

                cout << "Рейтинг (0-10): ";
                cin >> rating;
                
                cout << "Длительность (минуты): ";
                cin >> duration;
                
                movies.addMovie(title, genre, rating, duration);
                cin.ignore();
                break;
            }

            case 3:{
                string title;
                cout << "Введите название: ";
                getline(cin, title);
                movies.findByTitle(title);
                break;
            }

            case 4:{
                string title;
                cout << "Введите название для удаления: ";
                getline(cin, title);
                movies.removeMovie(title);
                break;
            }
            
            case 5:{
                string title;
                cout << "Введите название фильма для редактирования: ";
                getline(cin, title);
                movies.editMovie(title);
                break;
            }
            
            case 6:{
                string genre;
                cout << "Введите жанр для поиска: ";
                getline(cin, genre);
                movies.filterByGenre(genre);
                break;
            }
            
            case 7:
                movies.showAllGenres();
                break;

            case 0:
                cout << "До свидания!" << endl;
                break;

            default:
                cout << "Неверный выбор! Попробуйте снова." << endl;
        }
    } while(choice != 0);
    
    return 0;
}