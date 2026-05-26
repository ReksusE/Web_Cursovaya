class UserPanel {
    selectors = {
        langToggle: '[data-js-lang-toggle]',
        themeToggle: '[data-js-theme-toggle]',
        userWrapper: '[data-js-user-wrapper]',
        dropdown: '[data-js-user-dropdown]',
        userName: '#header-user-name',
        logoutBtn: '[data-js-logout]'
    }
    stateClasses = { isActive: 'is-active' }

    constructor() {
        this.langBtn = document.querySelector(this.selectors.langToggle);
        this.themeBtn = document.querySelector(this.selectors.themeToggle);
        this.userWrapper = document.querySelector(this.selectors.userWrapper);
        this.dropdown = document.querySelector(this.selectors.dropdown);
        this.userName = document.querySelector(this.selectors.userName);
        this.logoutBtn = document.querySelector(this.selectors.logoutBtn);

        if (!this.langBtn) return;
        this.init();
    }

    init() {
        this.loadTheme();
        this.loadLang();
        this.checkAuth();
        this.bindEvents();
    }

    bindEvents() {
        this.themeBtn.addEventListener('click', () => this.toggleTheme());
        this.langBtn.addEventListener('click', () => this.toggleLang());
        
        // Открытие/закрытие дропдауна
        this.userWrapper?.addEventListener('click', (e) => {
        if (e.target.closest('[data-js-logout]')) return;
        this.dropdown?.classList.toggle(this.stateClasses.isActive);
        });

        document.addEventListener('click', (e) => {
        if (!this.userWrapper?.contains(e.target)) {
            this.dropdown?.classList.remove(this.stateClasses.isActive);
        }
        });

        this.logoutBtn?.addEventListener('click', () => this.logout());
    }

    loadTheme() {
        const saved = localStorage.getItem('artkante-theme') || 'dark';
        document.documentElement.classList.toggle('light-theme', saved === 'light');
    }
    toggleTheme() {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('artkante-theme', isLight ? 'light' : 'dark');
    }

    loadLang() {
        const saved = localStorage.getItem('artkante-lang') || 'ru';
        this.updateLangUI(saved);
    }
    toggleLang() {
        const current = this.langBtn.textContent.toLowerCase();
        const next = current === 'ru' ? 'en' : 'ru';
        localStorage.setItem('artkante-lang', next);
        this.updateLangUI(next);
        // Базовая замена текста (для курсовой достаточно)
        document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = next === 'en' ? (el.dataset.i18nEn || el.textContent) : (el.dataset.i18nRu || el.textContent);
        });
    }
    updateLangUI(lang) {
        if (this.langBtn) this.langBtn.textContent = lang.toUpperCase();
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');
        if (this.userName) {
        this.userName.textContent = user?.email || user?.name || 'Гость';
        }
    }

    logout() {
        localStorage.removeItem('artkante-current-user');
        this.checkAuth();
        this.dropdown?.classList.remove(this.stateClasses.isActive);
        window.location.href = '/Authorization.html';
    }
}
export default UserPanel;