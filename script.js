// script.js на GitHub Pages

// !!! ЗАМЕНИТЕ ЭТО НА ВАШ URL, полученный в Шаге 1.C !!!
const WORKER_BASE_URL = 'https://arg-backend.ВАШЕ_ИМЯ_ИЛИ_ID.workers.dev'; 
const API_ENDPOINT = `${WORKER_BASE_URL}/check`;

const contentContainer = document.getElementById('content-container');

/**
 * Функция для проверки ключа через Cloudflare Worker
 * @param {string} level - Текущий уровень (level_1, level_2, и т.д.)
 */
async function checkKey(level) {
    // 1. Получаем введенный ключ из активного поля ввода
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
                currentLevel: level // Отправляем текущий уровень для проверки соответствующего ключа
            }),
        });

        const result = await response.json();

        // 3. Обрабатываем ответ
        if (result.success) {
            // Ключ ВЕРЕН!
            
            // Динамически вычисляем следующий уровень
            const nextLevelNumber = parseInt(level.split('_')[1]) + 1;
            const nextLevelId = `level_${nextLevelNumber}`;
            
            // !!! ЗАМЕНЯЕМ ВЕСЬ КОНТЕНТ В КОНТЕЙНЕРЕ !!!
            contentContainer.innerHTML = result.next_html;
            
            // Обновляем data-level, чтобы следующий вызов checkKey() был корректным
            contentContainer.dataset.level = nextLevelId;
            
            // Всплывающее уведомление
            alert(`Ключ принят! Переход к Уровню ${nextLevelNumber}.`);
            
        } else {
            // Ключ НЕВЕРЕН
            alert('Неверный ключ. Попробуйте еще раз.');
            keyInput.value = ''; 
        }
    } catch (error) {
        console.error('Ошибка API:', error);
        alert('Произошла ошибка при обращении к серверу.');
    }
}