export default class Modal {
    constructor() {
        this.modals = document.querySelectorAll('[data-js-modal]');
        this.modalTriggers = document.querySelectorAll('[data-js-modal-trigger]');
        this.modalCloseButtons = document.querySelectorAll('[data-js-modal-close]');
        this.modalOverlays = document.querySelectorAll('[data-js-modal-overlay]');
        
        this.init();
    }

    init() {
        // Обработчики для кнопок открытия
        this.modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-js-modal-trigger');
                this.open(modalId);
            });
        });

        // Обработчики для кнопок закрытия
        this.modalCloseButtons.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.close(closeBtn.closest('[data-js-modal]').getAttribute('data-js-modal'));
            });
        });

        // Обработчики для.overlay (закрытие по клику вне контента)
        this.modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(overlay.closest('[data-js-modal]').getAttribute('data-js-modal'));
                }
            });
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('[data-js-modal].modal--active');
                if (activeModal) {
                    this.close(activeModal.getAttribute('data-js-modal'));
                }
            }
        });
    }

    open(modalId) {
        const modal = document.querySelector(`[data-js-modal="${modalId}"]`);
        if (!modal) return;

        modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    }

    close(modalId) {
        const modal = document.querySelector(`[data-js-modal="${modalId}"]`);
        if (!modal) return;

        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }

    closeAll() {
        this.modals.forEach(modal => {
            modal.classList.remove('modal--active');
        });
        document.body.style.overflow = '';
    }
}
