class ScrollReveal {
    constructor(options = {}) {
        this.options = {
            root: null, // Относительно viewport
            rootMargin: '0px 0px -50px 0px', // Срабатывает, когда элемент на 50px вошел снизу
            threshold: 0.1, // Достаточно, чтобы 10% элемента было видно
            selector: '.reveal', // Класс, который мы отслеживаем
            ...options
        };

        this.observer = null;
        this.init();
    }

    init() {
        // Проверка поддержки браузером (на всякий случай)
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll(this.options.selector).forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Добавляем класс для запуска CSS-анимации
                    entry.target.classList.add('is-visible');
                    
                    // ОПЦИОНАЛЬНО: Если вы хотите, чтобы анимация проигрывалась 
                    // ТОЛЬКО ОДИН РАЗ при первом скролле вниз, раскомментируйте строку ниже:
                    // observer.unobserve(entry.target);
                } else {
                    // Если вы хотите, чтобы анимация проигрывалась КАЖДЫЙ раз 
                    // при скролле вверх-вниз, раскомментируйте строку ниже:
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, this.options);

        this.observeAll();
    }

    // Находит все элементы на странице и подключает observer
    observeAll() {
        const elements = document.querySelectorAll(this.options.selector);
        elements.forEach(el => this.observer.observe(el));
    }

    // Полезный метод: если вы динамически добавляете элементы в DOM 
    // (например, карточки через Concepts.js), вызовите этот метод для нового элемента
    observe(element) {
        if (element) this.observer.observe(element);
    }
}

export default ScrollReveal;