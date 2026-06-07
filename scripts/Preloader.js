class Preloader {
    constructor() {
        // Ищем элемент, который мы уже создали в <head>
        this.element = document.querySelector('.preloader');
        if (!this.element) return;
        
        this.init();
    }

    init() {
        // 1. Синхронизируем цвет фона с сохраненной темой пользователя, 
        // чтобы не было белой вспышки при переходе со светлой темы
        const savedTheme = localStorage.getItem('artkante-theme') || 'dark';
        if (savedTheme === 'light') {
            this.element.style.backgroundColor = '#F5F3EF'; // var(--color-surface-1)
            this.element.querySelector('.preloader__spinner').style.borderColor = 'rgba(0, 0, 0, 0.1)';
            this.element.querySelector('.preloader__spinner').style.borderTopColor = '#0074f0'; // Светлый акцент
            this.element.querySelector('.preloader__text').style.color = '#949494';
        }

        // 2. Ждем ПОЛНОЙ загрузки страницы (ВСЕХ картинок, шрифтов, стилей)
        window.addEventListener('load', () => {
            this.hide();
        });
    }

    hide() {
        // Минимальное время показа (600мс), чтобы избежать мерцания на быстрых интернетах
        const minDisplayTime = 600; 
        const startTime = Date.now();

        const checkTime = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= minDisplayTime) {
                // Запускаем CSS-анимацию исчезновения
                this.element.classList.add('is-hidden');
                
                // Полностью удаляем из DOM после завершения transition (0.5s в CSS)
                setTimeout(() => {
                    if (this.element && this.element.parentNode) {
                        this.element.remove();
                    }
                }, 500);
            } else {
                // Если загрузилось слишком быстро, ждем остаток времени
                setTimeout(checkTime, minDisplayTime - elapsed);
            }
        };

        checkTime();
    }
}

export default Preloader;