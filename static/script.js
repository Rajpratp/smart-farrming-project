// filepath: c:\Users\rruud\OneDrive\Desktop\proZZect\static\script.js
document.addEventListener("DOMContentLoaded", function() {
    // Upaj dropdown logic
    const icon = document.getElementById('upajDropdownIcon');
    const list = document.getElementById('upajDropdownList');
    const upajInput = document.getElementById('upaj');

    if (icon && list && upajInput) {
        icon.onclick = function(e) {
            list.style.display = (list.style.display === 'block') ? 'none' : 'block';
            e.stopPropagation();
        };
        upajInput.onclick = function(e) {
            list.style.display = 'none';
            e.stopPropagation();
        };
        document.body.onclick = function() {
            list.style.display = 'none';
        };
        window.selectUpaj = function(val) {
            upajInput.value = val;
            list.style.display = 'none';
        }
    }

    // Date slider logic
    const dateInput = document.getElementById('date');
    const dateSlider = document.getElementById('dateSlider');
    const sliderLabel = document.getElementById('sliderDateLabel');
    if (dateInput && dateSlider && sliderLabel) {
        const today = new Date();
        function formatDate(d) {
            return d.toISOString().slice(0,10);
        }
        function setDateFromSlider() {
            let d = new Date(today);
            d.setDate(today.getDate() - parseInt(dateSlider.value));
            dateInput.value = formatDate(d);
            sliderLabel.textContent = formatDate(d);
        }
        function setSliderFromDate() {
            let selected = new Date(dateInput.value);
            let diff = Math.round((today - selected) / (1000*60*60*24));
            if (diff >= 0 && diff <= 29) dateSlider.value = diff;
            sliderLabel.textContent = formatDate(selected);
        }
        dateSlider.addEventListener('input', setDateFromSlider);
        dateInput.addEventListener('input', setSliderFromDate);
        setSliderFromDate();
    }
// data graph logic






    // Slider/carousel logic for after-navbar-box
    const sliderItems = document.querySelectorAll('#slider-content .slider-item');
    if (sliderItems.length > 0) {
        let current = 0;
        function showItem(idx) {
            sliderItems.forEach((el, i) => el.classList.toggle('active', i === idx));
        }
        function nextItem() {
            current = (current + 1) % sliderItems.length;
            showItem(current);
        }
        showItem(current);
        setInterval(nextItem, 5000); // Change every 5 seconds
    }

    // Chatbot logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggle && chatbotWindow && chatbotClose && chatbotInput && chatbotMessages) {
        chatbotToggle.onclick = () => chatbotWindow.style.display = 'flex';
        chatbotClose.onclick = () => chatbotWindow.style.display = 'none';

        chatbotInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && chatbotInput.value.trim()) {
                const userMsg = document.createElement('div');
                userMsg.className = 'chatbot-message user';
                userMsg.textContent = chatbotInput.value;
                chatbotMessages.appendChild(userMsg);

                // Simple bot reply (customize as needed)
                const botMsg = document.createElement('div');
                botMsg.className = 'chatbot-message bot';
                botMsg.textContent = "जल्द आ रहे हैं";
                botMsg.textContent = "चलेगा चाकू निकलेगा ख़ून, preety baby का birthday cumming soon 🥳🥳";
                chatbotMessages.appendChild(botMsg);

                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                chatbotInput.value = '';
            }
        });
    }

    // Live weather for Weather box
    const weatherBox = document.getElementById('weather-info');
    if (weatherBox) {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current_weather=true')
            .then(response => response.json())
            .then(data => {
                if (data.current_weather) {
                    const temp = data.current_weather.temperature;
                    const wind = data.current_weather.windspeed;
                    weatherBox.innerHTML = `<span class="weather-label">Weather</span><br><span class="weather-data">${temp}&deg;C, ${wind} km/h</span>`;
                } else {
                    weatherBox.innerHTML = `<span class="weather-label">Weather</span><br><span class="weather-data">Data unavailable</span>`;
                }
            })
            .catch(() => {
                weatherBox.innerHTML = `<span class="weather-label">Weather</span><br><span class="weather-data">Data error</span>`;
            });
    }
});

