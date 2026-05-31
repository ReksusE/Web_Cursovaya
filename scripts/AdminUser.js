class AdminUsers {
    selectors = {
        addBtn: '[data-js-admin-add]',
        editBtn: '[data-js-admin-edit]',
        deleteBtn: '[data-js-admin-delete]',
        cancelBtn: '[data-js-admin-cancel]',
        form: '[data-js-admin-form]',
    }
    API_URL = 'http://localhost:3000'
    currentUser = JSON.parse(localStorage.getItem('artkante-current-user') || 'null')

    constructor(container, toastManager) {
        this.container = container
        this.toastManager = toastManager
        this.data = []
        this.isEditing = false
        this.editId = null
        this.init()
    }

    async init() {
        await this.fetch()
        this.render()
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
        if (this.isEditing) return this.renderForm()
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

    renderForm(user = {}) {
        this.container.innerHTML = `
        <form class="admin__form" data-js-admin-form>
            <div class="admin__form-group"><label>Имя</label><input type="text" class="admin__input" name="name" value="${user.name || ''}" required></div>
            <div class="admin__form-group"><label>Email</label><input type="email" class="admin__input" name="email" value="${user.email || ''}" required></div>
            <div class="admin__form-group"><label>Пароль (при создании)</label><input type="password" class="admin__input" name="password" ${this.editId ? '' : 'required'}></div>
            <div class="admin__form-group"><label>Роль</label>
            <select class="admin__select" name="role">
                <option value="client" ${user.role === 'client' ? 'selected' : ''}>Клиент</option>
                <option value="designer" ${user.role === 'designer' ? 'selected' : ''}>Дизайнер</option>
                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Админ</option>
            </select>
            </div>
            <div class="admin__form-actions">
            <button type="button" class="admin__btn-sm admin__btn-sm--cancel" data-js-admin-cancel>Отмена</button>
            <button type="submit" class="admin__btn-sm admin__btn-sm--save">${this.editId ? 'Сохранить' : 'Создать'}</button>
            </div>
        </form>
        `
        this.bindFormEvents()
    }

    bindEvents() {
        this.container.querySelector(this.selectors.addBtn)?.addEventListener('click', () => { this.isEditing = true; this.editId = null; this.renderForm() })
        this.container.querySelectorAll(this.selectors.editBtn).forEach(btn => btn.addEventListener('click', () => { this.isEditing = true; this.editId = btn.dataset.id; this.renderForm(this.data.find(u => u.id == this.editId)) }))
        this.container.querySelectorAll(this.selectors.deleteBtn).forEach(btn => btn.addEventListener('click', () => this.deleteItem(btn.dataset.id)))
    }

    bindFormEvents() {
        this.container.querySelector(this.selectors.form)?.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
        if (!this.editId) delete formData.passwordConfirm
        await (this.editId ? this.updateItem(this.editId, formData) : this.createItem(formData))
        })
        this.container.querySelector(this.selectors.cancelBtn)?.addEventListener('click', () => { this.isEditing = false; this.editId = null; this.render() })
    }

    async createItem(data) {
        try {
        const res = await fetch(`${this.API_URL}/users`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...data, favorites: [], createdAt: new Date().toISOString()}) })
        if (!res.ok) throw new Error()
        this.toastManager.show('Пользователь создан', 'success')
        this.isEditing = false; this.editId = null; await this.init()
        } catch { this.toastManager.show('Ошибка создания пользователя', 'error') }
    }

    async updateItem(id, data) {
        try {
        if (data.password === '') delete data.password
        const res = await fetch(`${this.API_URL}/users/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
        if (!res.ok) throw new Error()
        this.toastManager.show('Пользователь обновлен', 'success')
        this.isEditing = false; this.editId = null; await this.init()
        } catch { this.toastManager.show('Ошибка обновления', 'error') }
    }

    async deleteItem(id) {
        if (id == this.currentUser.id) return this.toastManager.show('Нельзя удалить самого себя', 'error')
        const adminsCount = this.data.filter(u => u.role === 'admin').length
        const targetUser = this.data.find(u => u.id == id)
        if (targetUser?.role === 'admin' && adminsCount <= 1) return this.toastManager.show('Нельзя удалить последнего админа', 'error')
        if (!confirm('Удалить пользователя?')) return
        
        try {
        const res = await fetch(`${this.API_URL}/users/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        this.toastManager.show('Пользователь удален', 'info')
        await this.init()
        } catch { this.toastManager.show('Ошибка удаления', 'error') }
    }
}
export default AdminUsers