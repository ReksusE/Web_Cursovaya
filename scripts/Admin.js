class AdminPanel {
    selectors = {
        root: '[data-js-admin]',
        tabs: '[data-js-admin-tab]',
        title: '[data-js-admin-title]',
        content: '[data-js-admin-content]',
        logoutBtn: '[data-js-admin-logout]',
    }
    stateClasses = { isActive: 'is-active' }
    tabTitles = { dashboard: 'Дашборд', concepts: 'Управление концептами', users: 'Управление пользователями' }

    constructor(toastManager) {
        this.toastManager = toastManager
        this.rootElement = document.querySelector(this.selectors.root)
        if (!this.rootElement) return

        this.user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null')
        this.activeModule = null
        this.currentTab = 'dashboard'

        this.init()
    }

    init() {
        if (!this.user || this.user.role !== 'admin') {
        this.toastManager.show('Доступ запрещен. Требуются права администратора.', 'error')
        setTimeout(() => window.location.href = '/Home.html', 1500)
        return
        }

        this.renderTab(this.currentTab)
        this.bindEvents()
    }

    bindEvents() {
        this.rootElement.querySelectorAll(this.selectors.tabs).forEach(btn => {
        btn.addEventListener('click', this.onTabClick)
        })
        this.rootElement.querySelector(this.selectors.logoutBtn)?.addEventListener('click', this.logout)
    }

    onTabClick = (e) => {
        const tab = e.currentTarget.dataset.jsAdminTab
        if (tab === this.currentTab) return

        this.rootElement.querySelectorAll(this.selectors.tabs).forEach(b => b.classList.remove(this.stateClasses.isActive))
        e.currentTarget.classList.add(this.stateClasses.isActive)
        this.currentTab = tab
        this.renderTab(tab)
    }

    renderTab(tab) {
        const contentEl = this.rootElement.querySelector(this.selectors.content)
        const titleEl = this.rootElement.querySelector(this.selectors.title)
        if (!contentEl) return

        contentEl.innerHTML = '<p class="admin__loading">Загрузка модуля...</p>'
        if (titleEl) titleEl.textContent = this.tabTitles[tab] || tab

        // Уничтожаем предыдущий модуль
        this.activeModule = null

        // Динамическая подгрузка (в реальном проекте можно через import())
        switch (tab) {
        case 'concepts':
            import('/AdminConcepts.js').then(m => {
            this.activeModule = new m.default(contentEl, this.toastManager)
            })
            break
        case 'dashboard':
            contentEl.innerHTML = '<p class="admin__empty">Статистика и графики будут добавлены позже.</p>'
            break
        case 'users':
            contentEl.innerHTML = '<p class="admin__empty">Управление пользователями в разработке.</p>'
            break
        }
    }

    logout = () => {
        localStorage.removeItem('artkante-current-user')
        window.location.href = '/pages/Authorization.html'
    }
}
export default AdminPanel