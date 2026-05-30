class Concepts {
  selectors = {
    root: '[data-js-concepts]',
    filterGroup: '.concepts__filters-group',
    filterBtn: '[data-js-filter-btn]',
    filterValue: '[data-js-filter-value]',
    grid: '[data-js-concepts-grid]',
    expandBtn: '[data-js-concepts-expandable]',
    expandWrap: '.concepts__expandable-wrap',
    resetBtn: '.concepts__filters-reset',
  }
  stateClasses = {
    isFixed: 'is-fixed',
    isActive: 'is-active',
  }
  API_URL = 'http://localhost:3000/concepts'
  ITEMS_PER_PAGE = 8

  constructor(favoritesManager) {
    this.favoritesManager = favoritesManager;
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) return;

    this.gridElement = this.rootElement.querySelector(this.selectors.grid);
    this.filterGroups = this.rootElement.querySelectorAll(this.selectors.filterGroup);
    this.expandBtn = this.rootElement.querySelector(this.selectors.expandBtn);
    this.expandWrap = this.rootElement.querySelector(this.selectors.expandWrap);
    this.resetBtn = this.rootElement.querySelector(this.selectors.resetBtn);

    this.allCards = [];
    this.filteredCards = [];
    this.visibleCount = this.ITEMS_PER_PAGE;
    this.activeFilters = {};

    this.init();
  }

  async init() {
    await this.fetchCards();
    this.bindEvents();
  }

  async fetchCards() {
    try {
      const res = await fetch(this.API_URL);
      if (!res.ok) throw new Error('Ошибка сети');
      this.allCards = await res.json();
      this.filteredCards = [...this.allCards];
      this.renderCards();
    } catch (err) {
      this.gridElement.innerHTML = `<p style="color: var(--color-accent-05); grid-column: 1/-1;">Не удалось загрузить концепты. Запустите <code>npm run server</code></p>`;
      console.error('❌ Concepts fetch error:', err);
    }
  }

  renderCards() {
    const cardsToShow = this.filteredCards.slice(0, this.visibleCount);
    
    if (cardsToShow.length === 0) {
      this.gridElement.innerHTML = `<p style="color: var(--color-gray-alt); grid-column: 1/-1;">По фильтрам ничего не найдено</p>`;
      if (this.expandWrap) this.expandWrap.style.display = 'none';
      return;
    }

    this.gridElement.innerHTML = cardsToShow.map(card => this.createCardHTML(card)).join('');
    this._syncFavoriteUI();

    if (this.expandWrap) {
      this.expandWrap.style.display = this.visibleCount >= this.filteredCards.length ? 'none' : 'flex';
    }
  }

  createCardHTML(card) {
    const featuresHTML = card.features.map(f => 
      `<li class="card-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9.70071 15.586L6.50639 12.293L5.13477 13.707L9.70071 18.414L19.1168 8.70697L17.7452 7.29297L9.70071 15.586Z" fill="white"/>
        </svg> ${f}
      </li>`
    ).join('');

    return `
      <article class="card" data-js-concepts-card>
        <img class="card-image" src="${card.image}" alt="${card.title}">
        <button class="card-favorite" type="button" aria-label="В избранное" data-fav-id="${card.id}">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1555 0C10.1995 0 8.7424 3.08387 8.7424 3.08387C8.7424 3.08387 7.28533 0 4.32931 0C1.92697 0 -0.0004826 1.63424 9.06402e-08 4.66483C0.000482782 7.69542 4.3589 13.8129 8.7424 16.9613C8.88856 16.9613 9.03135 16.9148 9.1522 16.8278C13.5352 13.6794 16.9991 7.13097 17 4.66483C17.0009 2.19869 15.5578 0 13.1555 0Z" fill="currentColor"/>
          </svg>
        </button>
        <div class="card-overlay">
          <a href="Project.html?id=${card.id}" class="card-title-link">
            <h3 class="card-title">${card.title}</h3>
          </a>
          <ul class="card-list">${featuresHTML}</ul>
        </div>
      </article>
    `;
  }

  _syncFavoriteUI() {
    this.gridElement.querySelectorAll('[data-fav-id]').forEach(btn => {
      const id = parseInt(btn.dataset.favId);
      btn.classList.toggle(this.stateClasses.isActive, this.favoritesManager.isFavorite(id));
    });
  }

  bindEvents() {
    // 1. Открытие/закрытие дропдаунов
    this.filterGroups.forEach(group => {
      const btn = group.querySelector(this.selectors.filterBtn);
      if (!btn) return;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = group.classList.contains(this.stateClasses.isFixed);
        this.closeAllDropdowns();
        if (!isOpen) group.classList.add(this.stateClasses.isFixed);
      });
    });

    // 2. Делегирование: выбор фильтра
    this.rootElement.addEventListener('click', e => {
      const filterItem = e.target.closest(this.selectors.filterValue);
      if (filterItem) {
        e.stopPropagation();
        const key = filterItem.dataset.filterKey;
        const value = filterItem.dataset.filterValue;
        if (key && value) {
          this.activeFilters[key] = value;
          this.visibleCount = this.ITEMS_PER_PAGE;
          this.applyFilters();
          this.closeAllDropdowns();
          this.updateFilterButtonText(filterItem.closest(this.selectors.filterGroup), value);
        }
        return;
      }
    });

    // 3. Клик вне дропдауна
    document.addEventListener('click', () => this.closeAllDropdowns());

    // 4. Сброс фильтров
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.activeFilters = {};
        this.filteredCards = [...this.allCards];
        this.visibleCount = this.ITEMS_PER_PAGE;
        this.renderCards();
        this.resetFilterButtons();
      });
    }

    // 5. Показать ещё
    if (this.expandBtn) {
      this.expandBtn.addEventListener('click', () => {
        this.visibleCount += this.ITEMS_PER_PAGE;
        this.renderCards();
      });
    }

    // 6. Синхронизация при изменении избранного извне (Portfolio, Favorite и т.д.)
    window.addEventListener('favorites:updated', () => this._syncFavoriteUI());
  }

  updateFilterButtonText(group, value) {
    const btn = group.querySelector(this.selectors.filterBtn);
    if (btn) {
      const texts = btn.childNodes;
      if (texts.length > 0) texts[0].textContent = value;
    }
  }

  resetFilterButtons() {
    const defaultTexts = {
      'category': 'Назначение очага',
      'fuel': 'Вид топлива',
      'style': 'Стиль',
      'glass': 'Выбор по стеклу',
      'material': 'Материал облицовки',
    };
    this.filterGroups.forEach(group => {
      const key = group.dataset.filterKey;
      const btn = group.querySelector(this.selectors.filterBtn);
      if (btn && defaultTexts[key]) {
        const texts = btn.childNodes;
        if (texts.length > 0) texts[0].textContent = defaultTexts[key];
      }
    });
  }

  applyFilters() {
    this.filteredCards = this.allCards.filter(card => {
      return Object.entries(this.activeFilters).every(([key, value]) => {
        return !card[key] || card[key] === value;
      });
    });
    this.renderCards();
  }

  closeAllDropdowns() {
    this.filterGroups.forEach(g => g.classList.remove(this.stateClasses.isFixed));
  }
}
export default Concepts;