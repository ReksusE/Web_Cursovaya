class AdminConcepts {
    selectors = {
        table: '.admin-concepts__table',
        addBtn: '[data-js-admin-add]',
        editBtn: '[data-js-admin-edit]',
        deleteBtn: '[data-js-admin-delete]',
    }
    stateClasses = { isActive: 'is-active' }
    API_URL = 'http://localhost:3000'

    constructor(container, toastManager) {
        this.container = container
        this.toastManager = toastManager
        this.data = []

        this.init()
    }

    async init() {
        await this.fetch()
        this.render()
        this.bindEvents()
    }

    async fetch() {
        try {
        const res = await fetch(`${this.API_URL}/concepts`)
        if (!res.ok) throw new Error('Сеть')
        this.data = await res.json()
        } catch (err) {
        this.toastManager.show('Ошибка загрузки данных', 'error')
        console.error(err)
        }
    }

    render() {
        if (!this.data.length) {
        this.container.innerHTML = '<p class="admin__empty">Концептов не найдено</p>'
        return
        }

        this.container.innerHTML = `
        <table class="admin__table">
            <thead><tr><th>ID</th><th>Название</th><th>Категория</th><th>Топливо</th><th>Действия</th></tr></thead>
            <tbody>${this.data.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.title}</td>
                <td>${c.category || '—'}</td>
                <td>${c.fuel || '—'}</td>
                <td>
                <button class="admin__btn-sm" data-js-admin-edit data-id="${c.id}">Изменить</button>
                <button class="admin__btn-sm admin__btn-sm--danger" data-js-admin-delete data-id="${c.id}">Удалить</button>
                </td>
            </tr>
            `).join('')}</tbody>
        </table>
        <button class="admin__btn" data-js-admin-add>+ Добавить концепт</button>
        `

        this.bindTableActions()
    }

    bindEvents() {
        this.container.addEventListener('click', (e) => {
        if (e.target.closest(this.selectors.addBtn)) this.toastManager.show('Модальное окно добавления (в разработке)', 'info')
        })
    }

    bindTableActions() {
        this.container.querySelectorAll(this.selectors.editBtn).forEach(btn => {
        btn.addEventListener('click', () => this.toastManager.show(`Редактирование ID: ${btn.dataset.id}`, 'info'))
        })
        this.container.querySelectorAll(this.selectors.deleteBtn).forEach(btn => {
        btn.addEventListener('click', () => this.deleteItem(btn.dataset.id))
        })
    }

    deleteItem = async (id) => {
        if (!confirm('Удалить концепт? Это действие нельзя отменить.')) return
        try {
        const res = await fetch(`${this.API_URL}/concepts/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        this.toastManager.show('Концепт удален', 'success')
        await this.init()
        } catch {
        this.toastManager.show('Ошибка удаления', 'error')
        }
    }
}
export default AdminConcepts