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
                // Если somehow кнопка редактирования доступна гостю, редиректим на вход
                window.location.href = '/pages/Authorization.html';
                return;
            }
            this.modalManager?.open('profile-modal');
        });

        this.logoutBtn?.addEventListener('click', () => this.logout());
    }

    toggle() { 
        this.panel?.classList.toggle('is-active'); 
    }
    
    close() { 
        this.panel?.classList.remove('is-active'); 
    }

    updateUserInfo() {
        const user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');
        const isAuth = !!user;

        // Обновляем имя и email
        if (this.nameEl) this.nameEl.textContent = isAuth ? user.name : 'Гость';
        if (this.emailEl) this.emailEl.textContent = isAuth ? user.email : 'Войдите в аккаунт';

        // Логика кнопки входа/выхода
        // Мы предполагаем, что в HTML есть элемент с data-js-auth-action внутри панели
        const authActionBtn = this.panel?.querySelector('[data-js-auth-action]');
        
        if (authActionBtn) {
            if (isAuth) {
                // Если вошли: показываем "Выйти", скрываем "Войти" (или меняем текст)
                // В данном случае лучше иметь две разные ссылки или менять одну
                // Давайте реализуем через замену контента или классов, но проще всего - две ссылки в HTML, которые мы тоглим
                
                // Вариант А: Одна кнопка, меняем текст и действие
                authActionBtn.textContent = 'Выйти из аккаунта';
                authActionBtn.setAttribute('href', '#'); // Чтобы не переходило по ссылке
                authActionBtn.style.color = 'var(--color-red)'; // Опционально: красный цвет для выхода
                
                // Удаляем старый слушатель, если он был (чтобы не дублировать), 
                // но так как мы используем делегирование или привязку в init, 
                // проще просто проверить наличие класса или атрибута.
                // Однако, у нас уже есть this.logoutBtn. 
                
                // Давайте упростим: сделаем так, чтобы кнопка "Войти" исчезала, а "Выйти" появлялась.
                // Для этого нужно немного изменить HTML (см. шаг 2).
            } else {
                authActionBtn.textContent = 'Войти';
                authActionBtn.setAttribute('href', '/pages/Authorization.html');
                authActionBtn.style.color = ''; // Сброс цвета
            }
        }
        
        // Управление видимостью пунктов меню
        const guestItems = this.panel?.querySelectorAll('[data-js-guest-only]');
        const userItems = this.panel?.querySelectorAll('[data-js-user-only]');

        if (isAuth) {
            guestItems?.forEach(el => el.style.display = 'none');
            userItems?.forEach(el => el.style.display = 'flex'); // или block, зависит от верстки
        } else {
            guestItems?.forEach(el => el.style.display = 'flex');
            userItems?.forEach(el => el.style.display = 'none');
        }
    }

    logout() {
        localStorage.removeItem('artkante-current-user');
        this.updateUserInfo();
        this.close();
        window.location.href = '/pages/Authorization.html';
    }
}
export default UserPanel;