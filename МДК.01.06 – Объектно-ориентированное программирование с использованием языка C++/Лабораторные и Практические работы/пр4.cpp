#include <iostream>
#include <vector>

// Базовый класс
class Ability {
public:
    virtual void use() = 0; // чисто виртуальная функция
    virtual ~Ability() {} // виртуальный деструктор
};

// Производный класс Fireball
class Fireball : public Ability {
public:
    void use() override {
        std::cout << "Нанесён урон огнём" << std::endl;
    }
};

// Производный класс Heal
class Heal : public Ability {
public:
    void use() override {
        std::cout << "Восстановлено здоровье" << std::endl;
    }
};

// Производный класс Shield
class Shield : public Ability {
public:
    void use() override {
        std::cout << "Активирован щит" << std::endl;
    }
};

int main() {
    // 1. Создать контейнер (vector)
    std::vector<Ability*> abilities;
    
    // 2. Добавить разные способности
    abilities.push_back(new Fireball());
    abilities.push_back(new Heal());
    abilities.push_back(new Shield());
    
    // 3. Пройтись циклом и вызвать use()
    std::cout << "=== Применение способностей ===" << std::endl;
    for (int i = 0; i < abilities.size(); i++) {
        abilities[i]->use();
    }
    
    // Очистка памяти
    for (int i = 0; i < abilities.size(); i++) {
        delete abilities[i];
    }
    
    return 0;
}