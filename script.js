// script.js - ОБЩАЯ ЛОГИКА КЛИЕНТА
const WORKER_BASE_URL = 'https://silence.notabob4.workers.dev'; 
const API_ENDPOINT_CHECK = `${WORKER_BASE_URL}/check`;
const API_ENDPOINT_GET = `${WORKER_BASE_URL}/get_content`;

// Функция для обработки ввода ключа
async function checkKey(level) {
    const key = document.getElementById('key-input').value.trim();

    if (!key) { alert('Please enter a key.'); return; }
    
    try {
        const response = await fetch(API_ENDPOINT_CHECK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: key, currentLevel: level }),
        });

        const result = await response.json();

        if (result.success && result.token && result.next_level) {
            localStorage.setItem('arg_access_token', result.token);
            alert(`Key accepted! Redirecting to ${result.next_level}...`);

            // Перенаправляем на новый роут (например, /level2/, /level3/, /win/)
            window.location.href = `/${result.next_level}/`;
            
        } else if (result.success && !result.next_level) {
            // Уровень WIN
             alert(`Key accepted! The sequence is complete.`);
             window.location.reload(); 
        } else {
            alert('Incorrect key. Try again.');
        }
    } catch (error) {
        console.error('API Error:', error);
        alert('An error occurred while connecting to the server.');
    }
}

// Функция для загрузки контента по токену
async function loadContent() {
    // Определяем текущий уровень (level1, level2, level3, win)
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const requestedLevel = pathSegments[pathSegments.length - 1] || 'level1';
    
    const token = localStorage.getItem('arg_access_token');
    const container = document.getElementById('content-container');

    // Уровень 1 загружает контент из своего HTML
    if (requestedLevel === 'level1') {
        return; 
    }
    
    // Если это не level1 и нет токена, то доступ запрещен
    if (!token) {
        container.innerHTML = "<h1>Access Denied</h1><p>Please start from Level 1.</p>";
        return;
    }
    
    // Все остальные уровни загружают контент через API
    try {
        const response = await fetch(API_ENDPOINT_GET, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, requestedLevel: requestedLevel }),
        });

        const result = await response.json();

        if (result.success) {
            container.innerHTML = result.next_html;
        } else {
            container.innerHTML = `<h1>Error</h1><p>Content loading failed: ${result.message}</p>`;
        }
    } catch (error) {
        container.innerHTML = '<h1>Error</h1><p>An error occurred while loading content from the backend.</p>';
        console.error('Content Load Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadContent);