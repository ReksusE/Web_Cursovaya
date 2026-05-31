class AdminConcepts {
    selectors = {
        table: '.admin-concepts__table',
        addBtn: '[data-js-admin-add]',
        editBtn: '[data-js-admin-edit]',
        deleteBtn: '[data-js-admin-delete]',
        form: '#admin-concept-form',
        modalTitle: '#concept-modal-title',
    }
    API_URL = 'http://localhost:3000'

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
        const res = await fetch(`${this.API_URL}/concepts`)
        if (!res.ok) throw new Error('Сеть')
        this.data = await res.json()
        } catch {
        this.toastManager.show('Ошибка загрузки концептов', 'error')
        }
    }

    render() {
        if (!this.data.length) {
        this.container.innerHTML = `<p class="admin__empty">Концептов не найдено. <button class="admin__btn" data-js-admin-add>+ Добавить</button></p>`
        return this.bindEvents()
        }

        this.container.innerHTML = `
        <table class="admin__table admin-concepts__table">
            <thead><tr><th>ID</th><th>Название</th><th>Категория</th><th>Топливо</th><th>Действия</th></tr></thead>
            <tbody>${this.data.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.title}</td>
                <td>${c.category || '—'}</td>
                <td>${c.fuel || '—'}</td>
                <td class="admin__actions">
                <button class="admin__btn-sm admin__btn-sm--edit" data-js-admin-edit data-id="${c.id}">✎</button>
                <button class="admin__btn-sm admin__btn-sm--delete" data-js-admin-delete data-id="${c.id}">✕</button>
                </td>
            </tr>
            `).join('')}</tbody>
        </table>
        <button class="admin__btn" data-js-admin-add>+ Добавить концепт</button>
        `
        this.bindEvents()
    }

    openModal(mode, concept = null) {
        this.editId = concept ? concept.id : null
        const form = document.querySelector(this.selectors.form)
        if (!form) return

        const titleEl = document.querySelector(this.selectors.modalTitle)
        if (titleEl) titleEl.textContent = mode === 'edit' ? `Редактировать: ${concept.title}` : 'Добавить концепт'

        form.innerHTML = `
        <div class="admin__form-group"><label>Название</label><input type="text" class="admin__input" name="title" value="${concept?.title || ''}" required></div>
        <div class="admin__form-group"><label>Категория</label>
            <select class="admin__select" name="category">
            <option value="Загородный дом" ${concept?.category === 'Загородный дом' ? 'selected' : ''}>Загородный дом</option>
            <option value="Городская квартира" ${concept?.category === 'Городская квартира' ? 'selected' : ''}>Городская квартира</option>
            <option value="Общественные пространства" ${concept?.category === 'Общественные пространства' ? 'selected' : ''}>Общественные пространства</option>
            </select>
        </div>
        <div class="admin__form-group"><label>Топливо</label><input type="text" class="admin__input" name="fuel" value="${concept?.fuel || ''}"></div>
        <div class="admin__form-group"><label>URL изображения</label><input type="text" class="admin__input" name="image" value="${concept?.image || '/images/product/maxon-1.jpg'}" required></div>
        <div class="admin__form-group admin__form-full"><label>Описание</label><input type="text" class="admin__input" name="description" value="${concept?.description || ''}"></div>
        <div class="admin__form-actions">
            <button type="submit" class="admin__btn-sm admin__btn-sm--save">${this.editId ? 'Сохранить' : 'Создать'}</button>
        </div>
        `

        this.modalManager.open('admin-concept-modal')
    }

    bindEvents() {
        this.container.querySelector(this.selectors.addBtn)?.addEventListener('click', () => this.openModal('add'))
        this.container.querySelectorAll(this.selectors.editBtn).forEach(btn => btn.addEventListener('click', () => this.openModal('edit', this.data.find(c => c.id == btn.dataset.id))))
        this.container.querySelectorAll(this.selectors.deleteBtn).forEach(btn => btn.addEventListener('click', () => this.deleteItem(btn.dataset.id)))
    }

    bindModalEvents() {
        const form = document.querySelector(this.selectors.form)
        if (!form) return

        form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
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
        const res = await fetch(`${this.API_URL}/concepts`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...data, features: [], specs: {}}) })
        if (!res.ok) throw new Error()
        this.toastManager.show('Концепт успешно добавлен', 'success')
        await this.init()
    }

    async updateItem(id, data) {
        const res = await fetch(`${this.API_URL}/concepts/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
        if (!res.ok) throw new Error()
        this.toastManager.show('Концепт обновлен', 'success')
        await this.init()
    }

    async deleteItem(id) {
        if (!confirm('Удалить концепт? Это действие нельзя отменить.')) return
        const res = await fetch(`${this.API_URL}/concepts/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        this.toastManager.show('Концепт удален', 'info')
        await this.init()
    }
}
export default AdminConcepts