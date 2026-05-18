class Portfolio {
    selectors = {
        card: '[data-js-portfolio-card]',
        mainImg: '[data-js-portfolio-main-img]',
        thumb: '[data-js-portfolio-thumb]',
        favBtn: '[data-js-portfolio-fav]',
        prevBtn: '[data-js-portfolio-prev]',
        nextBtn: '[data-js-portfolio-next]',
    }

    stateClasses = {
        isActive: 'is-active',
    }

    constructor() {
        document.querySelectorAll(this.selectors.card).forEach(card => {
            this.initThumbs(card)
            this.initNav(card)
            this.initFav(card)
        })
    }

    initThumbs(card) {
        const mainImg = card.querySelector(this.selectors.mainImg)
        const thumbs = card.querySelectorAll(this.selectors.thumb)

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.setActive(mainImg, thumbs, thumb)
            })
        })
    }

    initNav(card) {
        const mainImg = card.querySelector(this.selectors.mainImg)
        const thumbs = Array.from(card.querySelectorAll(this.selectors.thumb))
        const prevBtn = card.querySelector(this.selectors.prevBtn)
        const nextBtn = card.querySelector(this.selectors.nextBtn)

        if (!prevBtn || !nextBtn) return

        prevBtn.addEventListener('click', () => {
            const currentIndex = thumbs.findIndex(t => 
                t.classList.contains(this.stateClasses.isActive)
            )
            const prevIndex = (currentIndex - 1 + thumbs.length) % thumbs.length
            this.setActive(mainImg, thumbs, thumbs[prevIndex])
        })

        nextBtn.addEventListener('click', () => {
            const currentIndex = thumbs.findIndex(t => 
                t.classList.contains(this.stateClasses.isActive)
            )
            const nextIndex = (currentIndex + 1) % thumbs.length
            this.setActive(mainImg, thumbs, thumbs[nextIndex])
        })
    }

    setActive(mainImg, thumbs, activeThumb) {
        mainImg.src = activeThumb.src
        mainImg.alt = activeThumb.alt
        thumbs.forEach(t => t.classList.remove(this.stateClasses.isActive))
        activeThumb.classList.add(this.stateClasses.isActive)
    }

    initFav(card) {
        const favBtn = card.querySelector(this.selectors.favBtn)
        if (!favBtn) return

        favBtn.addEventListener('click', () => {
            favBtn.classList.toggle(this.stateClasses.isActive)
        })
    }
}

export default Portfolio