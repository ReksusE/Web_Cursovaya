class ThemeManager {
    constructor() {
        this.htmlElement = document.documentElement;
        this.themeToggleBtn = document.querySelector('[data-js-theme-toggle]');
        
        // Загрузка темы из localStorage или системных настроек
        const savedTheme = localStorage.getItem('artkante-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light') {
            this.setTheme('light');
        } else if (savedTheme === 'dark') {
            this.setTheme('dark');
        } else {
            // По умолчанию темная, если не указано иное
            this.setTheme('dark');
        }

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        if (theme === 'light') {
            this.htmlElement.classList.add('light-theme');
        } else {
            this.htmlElement.classList.remove('light-theme');
        }
        localStorage.setItem('artkante-theme', theme);
    }

    toggleTheme() {
        const isLight = this.htmlElement.classList.contains('light-theme');
        this.setTheme(isLight ? 'dark' : 'light');
    }
}

export default ThemeManager;