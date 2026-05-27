class ThemeManager {
    constructor() {
        this.htmlElement = document.documentElement;
        this.themeToggleBtn = document.querySelector('[data-js-theme-toggle]');

        // Восстанавливаем тему из localStorage
        const saved = localStorage.getItem('artkante-theme') || 'dark';
        this.setTheme(saved, false);

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme, animate = true) {
        if (animate) {
            this._animateSwitch(theme);
        } else {
            this._applyTheme(theme);
        }
        localStorage.setItem('artkante-theme', theme);
    }

    _applyTheme(theme) {
        if (theme === 'light') {
            this.htmlElement.classList.add('light-theme');
        } else {
            this.htmlElement.classList.remove('light-theme');
        }
        this._updateButtonLabel(theme);
    }

    _animateSwitch(theme) {
        // Создаём overlay-вспышку
        const overlay = document.createElement('div');
        overlay.className = 'theme-switch-overlay';
        document.body.appendChild(overlay);

        // Запускаем анимацию
        requestAnimationFrame(() => {
            overlay.classList.add('is-active');
        });

        // В пике анимации меняем тему
        setTimeout(() => {
            this._applyTheme(theme);
        }, 300);

        // Убираем overlay
        setTimeout(() => {
            overlay.classList.add('is-done');
            setTimeout(() => overlay.remove(), 400);
        }, 500);
    }

    _updateButtonLabel(theme) {
        if (!this.themeToggleBtn) return;
        const label = theme === 'light' ? 'Тёмная тема' : 'Светлая тема';
        this.themeToggleBtn.setAttribute('aria-label', label);
        this.themeToggleBtn.setAttribute('title', label);
    }

    toggleTheme() {
        const isLight = this.htmlElement.classList.contains('light-theme');
        this.setTheme(isLight ? 'dark' : 'light');
    }
}

export default ThemeManager;