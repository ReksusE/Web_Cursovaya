class AdminUsers {
    selectors = {
        table: '.admin-users__table',
        addBtn: '[data-js-admin-add]',
        editBtn: '[data-js-admin-edit]',
        deleteBtn: '[data-js-admin-delete]',
        form: '#admin-user-form',
        modalTitle: '#user-modal-title',
    }
    API_URL = 'http://localhost:3000'
    currentUser = JSON.parse(localStorage.getItem('artkante-current-user') || 'null')

    constructor(container, toastManager, modalManager) {
        this.container = container
        this.toastManager = toastManager
        this.modalManager = modalManager
        this.data = []
        this.editId = null
        this.init()
    }

    async init() {
        await this.fetch()
        this.render()
        this.bindEvents()
        this.bindModalEvents()
    }

    async fetch() {
        try {
        const res = await fetch(`${this.API_URL}/users`)
        if (!res.ok) throw new Error()
        this.data = await res.json()
        } catch {
        this.toastManager.show('Ошибка загрузки пользователей', 'error')
        }
    }

    render() {
        this.container.innerHTML = `
        <table class="admin__table admin-users__table">
            <thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th><th>Действия</th></tr></thead>
            <tbody>${this.data.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="admin__badge admin__badge--${u.role}">${u.role}</span></td>
                <td class="admin__actions">
                <button class="admin__btn-sm admin__btn-sm--edit" data-js-admin-edit data-id="${u.id}">✎</button>
                <button class="admin__btn-sm admin__btn-sm--delete" data-js-admin-delete data-id="${u.id}">✕</button>
                </td>
            </tr>
            `).join('')}</tbody>
        </table>
        <button class="admin__btn" data-js-admin-add>+ Добавить пользователя</button>
        `
        this.bindEvents()
    }

    openModal(mode, user = null) {
        this.editId = user ? user.id : null
        const form = document.querySelector(this.selectors.form)
        if (!form) return

        const titleEl = document.querySelector(this.selectors.modalTitle)
        if (titleEl) titleEl.textContent = mode === 'edit' ? `Редактировать: ${user.name}` : 'Добавить пользователя'

        form.innerHTML = `
        <div class="admin__form-group"><label>Имя</label><input type="text" class="admin__input" name="name" value="${user?.name || ''}" required></div>
        <div class="admin__form-group"><label>Email</label><input type="email" class="admin__input" name="email" value="${user?.email || ''}" required></div>
        <div class="admin__form-group"><label>Пароль ${this.editId ? '(оставьте пустым, чтобы не менять)' : ''}</label><input type="password" class="admin__input" name="password" ${this.editId ? '' : 'required'}></div>
        <div class="admin__form-group"><label>Роль</label>
            <select class="admin__select" name="role">
            <option value="client" ${user?.role === 'client' ? 'selected' : ''}>Клиент</option>
            <option value="designer" ${user?.role === 'designer' ? 'selected' : ''}>Дизайнер</option>
            <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>Админ</option>
            </select>
        </div>
        <div class="admin__form-actions">
            <button type="submit" class="admin__btn-sm admin__btn-sm--save">${this.editId ? 'Сохранить' : 'Создать'}</button>
        </div>
        `

        this.modalManager.open('admin-user-modal')
    }

    bindEvents() {
        this.container.querySelector(this.selectors.addBtn)?.addEventListener('click', () => this.openModal('add'))
        this.container.querySelectorAll(this.selectors.editBtn).forEach(btn => btn.addEventListener('click', () => this.openModal('edit', this.data.find(u => u.id == btn.dataset.id))))
        this.container.querySelectorAll(this.selectors.deleteBtn).forEach(btn => btn.addEventListener('click', () => this.deleteItem(btn.dataset.id)))
    }

    bindModalEvents() {
        const form = document.querySelector(this.selectors.form)
        if (!form) return

        form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
        if (this.editId && !formData.password) delete formData.password

        const btn = form.querySelector('button[type="submit"]')
        btn.disabled = true; btn.textContent = 'Сохранение...'

        try {
            if (this.editId) await this.updateItem(this.editId, formData)
            else await this.createItem(formData)
            this.modalManager.close()
        } catch {
            this.toastManager.show('Ошибка сохранения', 'error')
        } finally {
            btn.disabled = false; btn.textContent = this.editId ? 'Сохранить' : 'Создать'
        }
        })
    }

    async createItem(data) {
        const res = await fetch(`${this.API_URL}/users`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...data, favorites: [], createdAt: new Date().toISOString()}) })
        if (!res.ok) throw new Error()
        this.toastManager.show('Пользователь создан', 'success')
        await this.init()
    }

    async updateItem(id, data) {
        const res = await fetch(`${this.API_URL}/users/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
        if (!res.ok) throw new Error()
        this.toastManager.show('Пользователь обновлен', 'success')
        await this.init()
    }

    async deleteItem(id) {
        if (id == this.currentUser.id) return this.toastManager.show('Нельзя удалить самого себя', 'error')
        const adminsCount = this.data.filter(u => u.role === 'admin').length
        const target = this.data.find(u => u.id == id)
        if (target?.role === 'admin' && adminsCount <= 1) return this.toastManager.show('Нельзя удалить последнего админа', 'error')
        if (!confirm('Удалить пользователя?')) return

        const res = await fetch(`${this.API_URL}/users/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        this.toastManager.show('Пользователь удален', 'info')
        await this.init()
    }
}
export default AdminUsers