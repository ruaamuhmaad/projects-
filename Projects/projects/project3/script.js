
const weatherApp = {
    API_KEY: 'demo_key', 
    BASE_URL: 'https://api.openweathermap.org/data/2.5',

    elements: {
        cityInput: document.getElementById('cityInput'),
        searchBtn: document.getElementById('searchBtn'),
        loading: document.getElementById('loading'),
        error: document.getElementById('error'),
        errorMessage: document.getElementById('errorMessage'),
        weatherInfo: document.getElementById('weatherInfo'),
        cityName: document.getElementById('cityName'),
        dateTime: document.getElementById('dateTime'),
        weatherIcon: document.getElementById('weatherIcon'),
        temperature: document.getElementById('temperature'),
        weatherDescription: document.getElementById('weatherDescription'),
        humidity: document.getElementById('humidity'),
        feelsLike: document.getElementById('feelsLike'),
        windSpeed: document.getElementById('windSpeed'),
        pressure: document.getElementById('pressure'),
        suggestions: document.getElementById('suggestions')
    },

    init() {
        this.setupEventListeners();
        this.loadDefaultCity();
    },

    setupEventListeners() {
        this.elements.searchBtn.addEventListener('click', () => {
            this.searchWeather();
        });

        this.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        this.elements.cityInput.addEventListener('input', (e) => {
            this.handleInputChange(e.target.value);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    },

    handleInputChange(value) {
        if (value.length > 2) {
            this.showSuggestions(value);
        } else {
            this.hideSuggestions();
        }
    },

    showSuggestions(query) {
        const popularCities = [
            'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 
            'Dubai', 'Istanbul', 'Cairo', 'Amman', 'Nablus',
            'Jerusalem', 'Ramallah', 'Gaza', 'Bethlehem'
        ];
        
        const filtered = popularCities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filtered.length > 0) {
            this.elements.suggestions.innerHTML = filtered
                .map(city => `<div class="suggestion-item" onclick="weatherApp.selectCity('${city}')">${city}</div>`)
                .join('');
            this.elements.suggestions.style.display = 'block';
        } else {
            this.hideSuggestions();
        }
    },

    selectCity(city) {
        this.elements.cityInput.value = city;
        this.hideSuggestions();
        this.searchWeather();
    },

    hideSuggestions() {
        this.elements.suggestions.style.display = 'none';
    },

    async searchWeather() {
        const city = this.elements.cityInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        await this.getWeatherData(city);
    },

    async getWeatherData(city) {
        try {
            this.showLoading();
            this.hideError();
            this.hideWeatherInfo();

            await this.simulateAPICall();
            const data = this.getMockWeatherData(city);
            
            this.displayWeatherData(data);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.hideLoading();
            this.showError(`Unable to fetch weather data for "${city}".`);
        }
    },

    simulateAPICall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    },

    getMockWeatherData(city) {
        const weatherConditions = [
            { main: 'Clear', description: 'clear sky', icon: '☀️', temp: 25 },
            { main: 'Clouds', description: 'few clouds', icon: '⛅', temp: 22 },
            { main: 'Rain', description: 'light rain', icon: '🌧️', temp: 18 },
            { main: 'Snow', description: 'light snow', icon: '❄️', temp: -2 }
        ];

        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        return {
            name: city,
            sys: { country: 'Demo' },
            main: {
                temp: randomWeather.temp + (Math.random() * 10 - 5),
                feels_like: randomWeather.temp + (Math.random() * 6 - 3),
                humidity: Math.floor(Math.random() * 40 + 40),
                pressure: Math.floor(Math.random() * 50 + 1000)
            },
            weather: [{
                main: randomWeather.main,
                description: randomWeather.description,
                icon: randomWeather.icon
            }],
            wind: {
                speed: Math.random() * 15 + 2
            }
        };
    },

    displayWeatherData(data) {
        this.elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
        this.elements.dateTime.textContent = this.getCurrentDateTime();
        this.elements.weatherIcon.textContent = data.weather[0].icon;
        this.elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
        this.elements.weatherDescription.textContent = data.weather[0].description;
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        this.elements.windSpeed.textContent = `${Math.round(data.wind.speed)} m/s`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;

        this.showWeatherInfo();
    },

    getCurrentDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return now.toLocaleDateString('en-US', options);
    },

    async loadDefaultCity() {
        const defaultCity = 'London';
        this.elements.cityInput.value = defaultCity;
        await this.getWeatherData(defaultCity);
    },

    showLoading() {
        this.elements.loading.classList.add('show');
    },

    hideLoading() {
        this.elements.loading.classList.remove('show');
    },

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.error.classList.add('show');
        setTimeout(() => this.hideError(), 5000);
    },

    hideError() {
        this.elements.error.classList.remove('show');
    },

    showWeatherInfo() {
        this.elements.weatherInfo.classList.add('show');
    },

    hideWeatherInfo() {
        this.elements.weatherInfo.classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    weatherApp.init();
});
