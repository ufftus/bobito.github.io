// script.js на GitHub Pages

// !!! ИСПРАВЛЕННЫЙ И ПРАВИЛЬНЫЙ URL: !!!
const WORKER_BASE_URL = 'https://silence.notabob4.workers.dev'; 
const API_ENDPOINT = `${WORKER_BASE_URL}/check`;

const contentContainer = document.getElementById('content-container');

/**
 * Функция для проверки ключа через Cloudflare Worker
 * @param {string} level - Текущий уровень (level_1, level_2, и т.д.)
 */
async function checkKey(level) {
    // 1. Получаем ключ. ID поля ввода всегда "key-input"
    const keyInput = document.getElementById('key-input');
    const key = keyInput.value.trim();

    if (!key) {
        alert('Пожалуйста, введите ключ.');
        return;
    }
    
    // 2. Отправляем запрос на Worker
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: key,
                currentLevel: level // Текущий уровень для проверки соответствующего ключа
            }),
        });

        const result = await response.json();

        // 3. Обрабатываем ответ
        if (result.success) {
            // Ключ ВЕРЕН!
            
            // Динамически вычисляем ID следующего уровня
            const nextLevelNumber = parseInt(level.split('_')[1]) + 1;
            const nextLevelId = `level_${nextLevelNumber}`;
            
            // !!! ЗАМЕНЯЕМ ВЕСЬ КОНТЕНТ В КОНТЕЙНЕРЕ HTML, пришедшим от Worker'а !!!
            contentContainer.innerHTML = result.next_html;
            
            // Обновляем data-level для следующей проверки
            contentContainer.dataset.level = nextLevelId;
            
            alert(`Ключ принят! Переход к Уровню ${nextLevelNumber}.`);
            
        } else {
            // Ключ НЕВЕРЕН
            alert('Неверный ключ. Попробуйте еще раз.');
            keyInput.value = ''; 
        }
    } catch (error) {
        // Ловим сетевые ошибки (Failed to fetch) или ошибки парсинга
        console.error('Критическая ошибка API (смотрите Network/Console):', error);
        alert('Произошла ошибка при обращении к серверу. Проверьте сетевое соединение.');
    }
}