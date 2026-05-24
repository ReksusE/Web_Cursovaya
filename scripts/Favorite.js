class Favorites {
    constructor() {
        this.API_URL = 'http://localhost:3000';
        this.currentUser = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');
        
        const favArray = Array.isArray(this.currentUser?.favorites) ? this.currentUser.favorites : [];
        this.favorites = new Set(favArray.map(id => Number(id)));

        document.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-fav-id]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.favId, 10);
        await this.toggle(id, btn);
        });
    }

    async toggle(conceptId, btn) {
        if (!this.currentUser) {
        alert('Для добавления в избранное необходимо авторизоваться');
        window.location.href = '/Authorization.html';
        return;
        }

        const isFav = this.favorites.has(conceptId);
        const newFavs = isFav 
        ? Array.from(this.favorites).filter(id => id !== conceptId) 
        : [...this.favorites, conceptId];

        try {
        const res = await fetch(`${this.API_URL}/users/${this.currentUser.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorites: newFavs })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const updatedUser = await res.json();
        this.favorites = new Set((updatedUser.favorites || []).map(id => Number(id)));
        this.currentUser.favorites = Array.from(this.favorites);
        localStorage.setItem('artkante-current-user', JSON.stringify(this.currentUser));

        if (btn) btn.classList.toggle('is-active', !isFav);
        window.dispatchEvent(new CustomEvent('favorites:updated'));
        } catch (err) {
        console.error('❌ Ошибка сохранения избранного:', err);
        }
    }

    isFavorite(id) { return this.favorites.has(Number(id)); }

    async renderPage() {
        const grid = document.querySelector('[data-js-favorites-grid]');
        if (!grid) {
        console.warn('⚠️ Не найден контейнер [data-js-favorites-grid]');
        return;
        }

        if (this.favorites.size === 0) {
        grid.innerHTML = `<p style="color: var(--color-gray-alt); grid-column: 1/-1; text-align: center; padding: 50px 0;">В избранном пока пусто. Добавьте концепты из каталога.</p>`;
        return;
        }

        try {
        const res = await fetch(`${this.API_URL}/concepts`);
        if (!res.ok) throw new Error('Ошибка загрузки концептов');
        const allConcepts = await res.json();
        
        const favIds = Array.from(this.favorites);

        // Фильтруем с явным приведением типов
        const concepts = allConcepts.filter(card => favIds.includes(Number(card.id)));

        if (concepts.length === 0) {
            grid.innerHTML = `<p style="color: var(--color-gray-alt); grid-column: 1/-1;">Карточки с ID [${favIds.join(', ')}] не найдены в db.json. Проверьте, совпадают ли ID.</p>`;
            return;
        }

        grid.innerHTML = concepts.map(card => this._createCardHTML(card)).join('');
        } catch (err) {
        console.error('❌ Ошибка загрузки избранного:', err);
        grid.innerHTML = `<p style="color: var(--color-red); grid-column: 1/-1;">Ошибка загрузки. Убедитесь, что запущен <code>npm run server</code></p>`;
        }
    }

    _createCardHTML(card) {
        return `
        <article class="card" data-js-concepts-card>
            <img class="card-image" src="${card.image}" alt="${card.title}">
            <button class="card-favorite is-active" type="button" aria-label="Убрать из избранного" data-fav-id="${card.id}">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.1555 0C10.1995 0 8.7424 3.08387 8.7424 3.08387C8.7424 3.08387 7.28533 0 4.32931 0C1.92697 0 -0.0004826 1.63424 9.06402e-08 4.66483C0.000482782 7.69542 4.3589 13.8129 8.7424 16.9613C8.88856 16.9613 9.03135 16.9148 9.1522 16.8278C13.5352 13.6794 16.9991 7.13097 17 4.66483C17.0009 2.19869 15.5578 0 13.1555 0Z" fill="currentColor"/>
            </svg>
            </button>
            <div class="card-overlay">
            <h3 class="card-title">${card.title}</h3>
            </div>
        </article>
        `;
    }
}

export default Favorites;