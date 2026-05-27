// js/LangManager.js
import translations from './translations.js';

class LangManager {
    constructor() {
        this.langToggleBtn = document.querySelector('[data-js-lang-toggle]');
        this.currentLang = localStorage.getItem('artkante-lang') || 'ru';
        
        this.applyLanguage(this.currentLang);

        if (this.langToggleBtn) {
            this.langToggleBtn.addEventListener('click', () => this.toggleLanguage());
        }
    }

    applyLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('artkante-lang', lang);
        
        // Обновляем текст кнопки переключения (RU / EN)
        if (this.langToggleBtn) {
            this.langToggleBtn.textContent = lang.toUpperCase();
        }

        // Находим все элементы с атрибутом data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Если элемент имеет дочерние HTML теги (например, <br>), используем innerHTML
                if (translations[lang][key].includes('<')) {
                    el.innerHTML = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'ru' ? 'en' : 'ru';
        this.applyLanguage(newLang);
    }
}

export default LangManager;