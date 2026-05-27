class Product {
    selectors = {
        root: '[data-js-product]',
        mainPhoto: '[data-js-product-main-photo]',
        thumb: '[data-js-product-thumb]',
    }

    stateClasses = {
        isActive: 'is-active',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root);
        if (!this.rootElement) return;

        this.mainPhoto = this.rootElement.querySelector(this.selectors.mainPhoto);
        this.thumb = this.rootElement.querySelectorAll(this.selectors.thumb);
        
        this.bindEvents();
    }

    bindEvents() {
        this.thumb.forEach((thumb) => {
            thumb.addEventListener('click', (e) => {
                const newSrc = e.currentTarget.getAttribute('src');
                const newAlt = e.currentTarget.getAttribute('alt');

                this.updateMainPhoto(newSrc, newAlt);
                this.updateActiveState(e.currentTarget);
            });
        });
    }

    updateMainPhoto(src, alt) {
        if(!this.mainPhoto || !src) return;

        this.mainPhoto.src = src;
        this.mainPhoto.alt = alt || '';
    }

    updateActiveState(activeThumb) {
        this.thumb.forEach((thumb) => {
            thumb.classList.remove(this.stateClasses.isActive);
        });

        activeThumb.classList.add(this.stateClasses.isActive);
    }
}

export default Product;