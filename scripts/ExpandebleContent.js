class ExpandebleContent {
    selectors = {
        root: '[data-js-concepts]',
        loadBtn: '[data-js-concepts-expandable]',
        card: '[data-js-concepts-card]',
    }

    stateClasses = {
        isHidden: 'is-hidden',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root);
        if (!this.rootElement) return;

        this.loadBtnElement = this.rootElement.querySelector(this.selectors.loadBtn);
        this.cards = Array.from(this.rootElement.querySelectorAll(this.selectors.card));

        this.cardsPerRow = 4;
        this.rowsToShow = 2;
        this.itemsToReveal = this.cardsPerRow * this.rowsToShow;

        this.initCards();
        this.bindEvents();
    }

    initCards() {
        this.cards.forEach((card, index) => {
        if (index >= this.itemsToReveal) {
            card.classList.add(this.stateClasses.isHidden);
        }
        });

        this.checkButtonVisibility();
    }

    bindEvents() {
        if (this.loadBtnElement) {
        this.loadBtnElement.addEventListener('click', this.onLoadMoreClick);
        }
    }

    onLoadMoreClick = (e) => {
        e.preventDefault();

        const hiddenCards = this.cards.filter(card => card.classList.contains(this.stateClasses.isHidden));

        const cardsToShow = hiddenCards.slice(0, this.itemsToReveal);
        cardsToShow.forEach(card => {
        card.classList.remove(this.stateClasses.isHidden);
        });

        this.checkButtonVisibility();
    }

    checkButtonVisibility() {
        if (!this.loadBtnElement) return;

        const hiddenCards = this.cards.filter(card => card.classList.contains(this.stateClasses.isHidden));
        if (hiddenCards.length === 0) {
        this.loadBtnElement.style.display = 'none';
        }
    }
}

export default ExpandebleContent;