class Product {
    selectors = {
        root: '[data-js-product]',
        mainPhoto: '[data-js-product-main-photo]',
        thumb: '[data-js-product-thumb]',
        title: '.product__summary-title',
        favBtn: '.product__summary-actions-link',
    }
    stateClasses = {
        isActive: 'is-active',
    }
    API_URL = 'http://localhost:3000'

    constructor(favoritesManager) {
        this.favoritesManager = favoritesManager
        this.rootElement = document.querySelector(this.selectors.root)
        if (!this.rootElement) return

        this.mainPhoto = this.rootElement.querySelector(this.selectors.mainPhoto)
        this.thumb = this.rootElement.querySelectorAll(this.selectors.thumb)
        
        // Читаем ID камина из URL (Project.html?id=1)
        this.id = new URLSearchParams(window.location.search).get('id')
        this.data = null

        this.init()
    }

    async init() {
        // Если в URL есть ?id=, грузим данные и обновляем страницу
        if (this.id) {
        await this.fetchConcept()
        this.render()
        }
        this.bindEvents()
    }

    async fetchConcept() {
        try {
        const res = await fetch(`${this.API_URL}/concepts/${this.id}`)
        if (!res.ok) throw new Error('Концепт не найден')
        this.data = await res.json()
        } catch (err) {
        console.error('❌ Product fetch error:', err)
        }
    }

    render() {
        if (!this.data) return
        const { title, image } = this.data

        // 1. Обновляем заголовок
        const titleEl = this.rootElement.querySelector(this.selectors.title)
        if (titleEl) titleEl.textContent = `Камин «${title}»`

        // 2. Обновляем главное фото
        if (this.mainPhoto) this.mainPhoto.src = image

        // 3. Синхронизируем кнопку избранного
        this.updateFavoriteUI()
    }

    updateFavoriteUI = () => {
        // Ищем именно ссылку, внутри которой лежит иконка сердца
        const favBtn = Array.from(this.rootElement.querySelectorAll(this.selectors.favBtn))
        .find(btn => btn.querySelector('.icon-favorite'))
        if (!favBtn || !this.id) return

        const isFav = this.favoritesManager?.isFavorite(this.id)
        favBtn.classList.toggle(this.stateClasses.isActive, isFav)

        // Обновляем только текстовый узел, не ломая вложенную SVG-иконку
        const textNode = Array.from(favBtn.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        if (textNode) textNode.textContent = isFav ? ' В избранном' : ' В избранное'

        // Привязываем ID для глобального делегирования в Favorites.js
        favBtn.dataset.favId = this.id
    }

    bindEvents() {
        // Твоя текущая логика миниатюр
        this.thumb.forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
            const newSrc = e.currentTarget.getAttribute('src')
            const newAlt = e.currentTarget.getAttribute('alt')

            this.updateMainPhoto(newSrc, newAlt)
            this.updateActiveState(e.currentTarget)
        })
        })

        // Глобальная синхронизация при изменении избранного на других страницах
        window.addEventListener('favorites:updated', this.updateFavoriteUI)
    }

    updateMainPhoto(src, alt) {
        if(!this.mainPhoto || !src) return
        this.mainPhoto.src = src
        this.mainPhoto.alt = alt || ''
    }

    updateActiveState(activeThumb) {
        this.thumb.forEach((thumb) => {
        thumb.classList.remove(this.stateClasses.isActive)
        })
        activeThumb.classList.add(this.stateClasses.isActive)
    }
}
export default Product;