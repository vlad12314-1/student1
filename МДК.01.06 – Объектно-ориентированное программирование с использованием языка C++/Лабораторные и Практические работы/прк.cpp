#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

// ========== Базовый класс Track ==========
class Track {
protected:
    string title;
    int duration; // в секундах

public:
    Track(string title, int duration) {
        this->title = title;
        this->duration = duration;
    }

    virtual void play() {
        cout << "Играет трек: " << title << endl;
    }

    int getDuration() {
        return duration;
    }

    string getTitle() {
        return title;
    }

    virtual ~Track() {} // виртуальный деструктор
};

// ========== Производный класс Song ==========
class Song : public Track {
private:
    string artist;

public:
    Song(string title, int duration, string artist)
        : Track(title, duration) {
        this->artist = artist;
    }

    void play() override {
        cout << "Играет песня: " << title << " - " << artist << endl;
    }
};

// ========== Производный класс Instrumental ==========
class Instrumental : public Track {
private:
    string instrument;

public:
    Instrumental(string title, int duration, string instrument)
        : Track(title, duration) {
        this->instrument = instrument;
    }

    void play() override {
        cout << "Играет инструментал: " << title << " (" << instrument << ")" << endl;
    }
};

// ========== Новый класс Podcast ==========
class Podcast : public Track {
private:
    string host;

public:
    Podcast(string title, int duration, string host)
        : Track(title, duration) {
        this->host = host;
    }

    void play() override {
        cout << "Играет подкаст: " << title << " - ведущий " << host << endl;
    }
};

// ========== Функции для работы с каталогом ==========

void playAllTracks(vector<Track*>& tracks) {
    cout << "\n=== Воспроизведение всех треков ===\n";
    for (Track* track : tracks) {
        track->play();
    }
}

void sortByDuration(vector<Track*>& tracks) {
    sort(tracks.begin(), tracks.end(), [](Track* a, Track* b) {
        return a->getDuration() < b->getDuration();
    });
    cout << "\n=== Треки отсортированы по длительности ===\n";
}

void showMenu() {
    cout << "\n===== МУЗЫКАЛЬНЫЙ КАТАЛОГ =====\n";
    cout << "1. Добавить песню\n";
    cout << "2. Добавить инструментал\n";
    cout << "3. Добавить подкаст\n";
    cout << "4. Показать все треки\n";
    cout << "5. Отсортировать по длительности\n";
    cout << "6. Выйти\n";
    cout << "Выберите действие: ";
}

// ========== Главная функция ==========
int main() {
    vector<Track*> catalog;
    int choice;

    do {
        showMenu();
        cin >> choice;
        cin.ignore(); // очищаем буфер после ввода числа

        switch (choice) {
            case 1: {
                string title, artist;
                int duration;
                cout << "Название песни: ";
                getline(cin, title);
                cout << "Исполнитель: ";
                getline(cin, artist);
                cout << "Длительность (сек): ";
                cin >> duration;
                catalog.push_back(new Song(title, duration, artist));
                cout << "Песня добавлена!\n";
                break;
            }
            case 2: {
                string title, instrument;
                int duration;
                cout << "Название инструментала: ";
                getline(cin, title);
                cout << "Инструмент: ";
                getline(cin, instrument);
                cout << "Длительность (сек): ";
                cin >> duration;
                catalog.push_back(new Instrumental(title, duration, instrument));
                cout << "Инструментал добавлен!\n";
                break;
            }
            case 3: {
                string title, host;
                int duration;
                cout << "Название подкаста: ";
                getline(cin, title);
                cout << "Ведущий: ";
                getline(cin, host);
                cout << "Длительность (сек): ";
                cin >> duration;
                catalog.push_back(new Podcast(title, duration, host));
                cout << "Подкаст добавлен!\n";
                break;
            }
            case 4:
                if (catalog.empty()) {
                    cout << "Каталог пуст. Добавьте треки.\n";
                } else {
                    playAllTracks(catalog);
                }
                break;
            case 5:
                if (catalog.empty()) {
                    cout << "Нет треков для сортировки.\n";
                } else {
                    sortByDuration(catalog);
                    playAllTracks(catalog);
                }
                break;
            case 6:
                cout << "До свидания!\n";
                break;
            default:
                cout << "Неверный выбор. Попробуйте снова.\n";
        }
    } while (choice != 6);

    // Очистка памяти
    for (Track* track : catalog) {
        delete track;
    }
    catalog.clear();

    return 0;
}