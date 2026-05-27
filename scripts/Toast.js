class Toast {
    constructor() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            console.warn('Toast container not found. Create <div id="toast-container"></div>');
            return;
        }
    }

    /**
     * Показать уведомление
     * @param {string} message - Текст сообщения
     * @param {string} type - Тип: 'success', 'error', 'info'
     * @param {number} duration - Время показа в мс (0 - не закрывать автоматически)
     */
    show(message, type = 'success', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast is-${type}`;
        
        // Иконка в зависимости от типа
        let iconSvg = '';
        let titleText = '';

        switch (type) {
            case 'success':
                titleText = 'Успешно';
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
                break;
            case 'error':
                titleText = 'Ошибка';
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
                break;
            case 'info':
                titleText = 'Информация';
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
                break;
        }

        toast.innerHTML = `
            <div class="toast__icon">${iconSvg}</div>
            <div class="toast__content">
                <span class="toast__title">${titleText}</span>
                <span class="toast__message">${message}</span>
            </div>
            <button class="toast__close" aria-label="Закрыть">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;

        // Добавляем в DOM
        this.container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        // Закрытие по крестику
        const closeBtn = toast.querySelector('.toast__close');
        closeBtn.addEventListener('click', () => this.hide(toast));

        // Автоматическое закрытие
        if (duration > 0) {
            setTimeout(() => this.hide(toast), duration);
        }
    }

    hide(toast) {
        toast.classList.remove('is-visible');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }
}

export default Toast;