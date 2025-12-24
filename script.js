// script.js на GitHub Pages

// !!! ВАША ИСПРАВЛЕННАЯ СТРОКА: !!!
const WORKER_BASE_URL = 'https://silence.notabob4.workers.dev'; 
const API_ENDPOINT = `${WORKER_BASE_URL}/check`;

const contentContainer = document.getElementById('content-container');

/**
 * Функция для проверки ключа через Cloudflare Worker
 * @param {string} level - Текущий уровень (level_1, level_2, и т.д.)
 */
async function checkKey(level) {
    // Находим активное поле ввода ключа по его ID
    const keyInput = document.getElementById('key-input');
    const key = keyInput.value.trim();

    if (!key) {
        alert('Пожалуйста, введите ключ.');
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: key,
                currentLevel: level 
            }),
        });

        const result = await response.json();

        if (result.success) {
            // Ключ ВЕРЕН!
            
            // Динамически вычисляем ID следующего уровня
            const nextLevelNumber = parseInt(level.split('_')[1]) + 1;
            const nextLevelId = `level_${nextLevelNumber}`;
            
            // !!! БЕЗОПАСНО ЗАМЕНЯЕМ КОНТЕНТ ПОЛНОСТЬЮ !!!
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
        console.error('Ошибка API. Проверьте консоль Cloudflare:', error);
        alert('Произошла ошибка при обращении к серверу.');
    }
}