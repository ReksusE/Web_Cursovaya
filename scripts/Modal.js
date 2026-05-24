class Modal {
    selectors = {
        root: '[data-js-modal]',
        openBtn: '[data-js-modal-open]',
        closeBtn: '[data-js-modal-close]',
        overlay: '.modal__overlay',
        form: '.modal__form'
    }
    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    constructor() {
        this.modals = document.querySelectorAll(this.selectors.root);
        this.openBtns = document.querySelectorAll(this.selectors.openBtn);
        this.activeModal = null;

        this.bindOpenEvents();
        this.bindCloseEvents();
    }

    open(modalId) {
        const modal = Array.from(this.modals).find(m => m.getAttribute('data-js-modal') === modalId);
        if (!modal) return;

        this.activeModal = modal;
        this.activeModal.classList.add(this.stateClasses.isActive);
        document.documentElement.classList.add(this.stateClasses.isLock);
    }

    close() {
        if (!this.activeModal) return;
        
        this.activeModal.classList.remove(this.stateClasses.isActive);
        document.documentElement.classList.remove(this.stateClasses.isLock);
        this.activeModal = null;
    }

    bindOpenEvents() {
        this.openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-js-modal-open');
                this.open(modalId);
            });
        });
    }

    bindCloseEvents() {
        this.modals.forEach(modal => {
            const overlay = modal.querySelector(this.selectors.overlay);
            const closeBtn = modal.querySelector(this.selectors.closeBtn);
            const form = modal.querySelector(this.selectors.form);

            if (overlay) overlay.addEventListener('click', () => this.close());
            if (closeBtn) closeBtn.addEventListener('click', () => this.close());
            
            if (form) form.addEventListener('click', (e) => e.stopPropagation());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) this.close();
        });
    }
}
export default Modal;