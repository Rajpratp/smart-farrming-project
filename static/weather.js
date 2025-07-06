document.addEventListener("DOMContentLoaded", function() {
  const apiKey = "b4fa83f6dc4071724828baed6a6f4da3"; // <-- Replace with your OpenWeatherMap API key
  const city = "Bhopal";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('weather-temp').textContent = Math.round(data.main.temp) + "°C";
      document.getElementById('weather-wind').textContent = data.wind.speed + " km/h";
      document.getElementById('weather-humidity').textContent = data.main.humidity + "%";
      document.getElementById('weather-pressure').textContent = data.main.pressure + " hPa";
      document.getElementById('weather-desc').textContent = data.weather[0].description;
      document.getElementById('weather-main-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon" style="vertical-align:middle;">`;
      // Sunrise/Sunset
      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);
      document.getElementById('weather-sunrise').textContent = sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      document.getElementById('weather-sunset').textContent = sunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      // --- MOVE THIS INSIDE THE .then(data => { ... }) ---
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const desc = data.weather[0].description.toLowerCase();

      document.getElementById('paddy-impact-data').textContent = getPaddyImpact(temp, humidity, desc);
      document.getElementById('wheat-impact-data').textContent = getWheatImpact(temp, humidity, desc);
      document.getElementById('soybean-impact-data').textContent = getSoybeanImpact(temp, humidity, desc);
    })
    .catch(() => {
      document.getElementById('weather-temp').textContent = "--°C";
      document.getElementById('weather-desc').textContent = "Data error";
      document.getElementById('paddy-impact-data').textContent = "Weather data unavailable.";
      document.getElementById('wheat-impact-data').textContent = "Weather data unavailable.";
      document.getElementById('soybean-impact-data').textContent = "Weather data unavailable.";
    });

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
                chatbotMessages.appendChild(botMsg);

                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                chatbotInput.value = '';
            }
        });
    }

    // Agriculture impact functions
function getPaddyImpact(temp, humidity, desc) {
  if (desc.includes("rain")) {
    return "Heavy rain may cause waterlogging. Ensure proper drainage for paddy fields.";
  } else if (temp > 35) {
    return "High temperature can cause heat stress. Maintain adequate water levels.";
  } else if (humidity < 40) {
    return "Low humidity may affect tillering. Monitor soil moisture closely.";
  } else {
    return "Weather is favorable for paddy growth.";
  }
}

function getWheatImpact(temp, humidity, desc) {
  if (temp > 30) {
    return "High temperature may reduce grain quality. Consider irrigation if dry.";
  } else if (desc.includes("rain")) {
    return "Rain may increase risk of fungal diseases. Monitor crop health.";
  } else if (humidity < 30) {
    return "Low humidity may cause drought stress. Irrigate if needed.";
  } else {
    return "Weather is suitable for wheat.";
  }
}

function getSoybeanImpact(temp, humidity, desc) {
  if (temp < 20) {
    return "Low temperature may slow growth. Monitor for pests.";
  } else if (desc.includes("rain")) {
    return "Rain can help pod filling, but too much may cause root rot.";
  } else if (humidity > 80) {
    return "High humidity may increase disease risk. Scout for leaf spots.";
  } else {
    return "Weather is good for soybean.";
  }
}
});
