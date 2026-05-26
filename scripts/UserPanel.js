class UserPanel {
    constructor(modalManager) {
        this.modalManager = modalManager;
        this.wrapper = document.querySelector('[data-js-user-wrapper]');
        this.btn = document.querySelector('[data-js-user-btn]');
        this.panel = document.querySelector('[data-js-user-panel]');
        this.nameEl = document.getElementById('panel-user-name');
        this.emailEl = document.getElementById('panel-user-email');
        this.editBtn = document.querySelector('[data-js-open-profile]');
        this.logoutBtn = document.querySelector('[data-js-logout]');

        if (!this.wrapper) return;
        this.init();
    }

    init() {
        this.updateUserInfo();
        this.bindEvents();
        
        document.addEventListener('click', (e) => {
        if (!this.wrapper.contains(e.target)) this.close();
        });
        document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
        });
    }

    bindEvents() {
        this.btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
        });

        this.editBtn?.addEventListener('click', () => {
        this.close();
        const user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');
        if (!user) {
            alert('Для редактирования необходимо авторизоваться');
            window.location.href = '/Authorization.html';
            return;
        }
        this.modalManager?.open('profile-modal');
        });

        this.logoutBtn?.addEventListener('click', () => this.logout());
    }

    toggle() { this.panel?.classList.toggle('is-active'); }
    close() { this.panel?.classList.remove('is-active'); }

    updateUserInfo() {
        const user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');
        if (this.nameEl) this.nameEl.textContent = user?.name || 'Гость';
        if (this.emailEl) this.emailEl.textContent = user?.email || 'Войдите в аккаунт';
    }

    logout() {
        localStorage.removeItem('artkante-current-user');
        this.updateUserInfo();
        this.close();
        window.location.href = '/Authorization.html';
    }
}
export default UserPanel;