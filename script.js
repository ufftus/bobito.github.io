const WORKER_BASE_URL = 'https://silence.notabob4.workers.dev'; 
const API_ENDPOINT = `${WORKER_BASE_URL}/check`;

const contentContainer = document.getElementById('content-container');

async function checkKey(level) {
    const keyInput = document.getElementById('key-input');
    const key = keyInput.value.trim();

    if (!key) {
        alert('Please enter a key.');
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
            const nextLevelNumber = parseInt(level.split('_')[1]) + 1;
            const nextLevelId = `level_${nextLevelNumber}`;
            
            contentContainer.innerHTML = result.next_html;
            
            contentContainer.dataset.level = nextLevelId;
            
            alert(`Key accepted! Proceeding to Level ${nextLevelNumber}.`);
            
        } else {
            alert('Incorrect key. Try again.');
            keyInput.value = ''; 
        }
    } catch (error) {
        console.error('API Error:', error);
        alert('An error occurred while connecting to the server.');
    }
}