class Hero {
    selectors = {
        slides: '[data-js-hero-slide]',
        dots: '[data-js-hero-dot]',
    }

    stateClasses = {
        isActive: 'is-active',
    }

    constructor() {
        this.slides = document.querySelectorAll(this.selectors.slides)
        this.dots = document.querySelectorAll(this.selectors.dots)
        this.currentIndex = 0
    
        if (this.slides.length > 0) {
        this.startAutoplay()
        }
    }

    update(nextIndex) {
        this.slides[this.currentIndex].classList.remove(this.stateClasses.isActive)
        this.dots[this.currentIndex].classList.remove(this.stateClasses.isActive)
        
        this.currentIndex = nextIndex
        
        this.slides[this.currentIndex].classList.add(this.stateClasses.isActive)
        this.dots[this.currentIndex].classList.add(this.stateClasses.isActive)
    }

    startAutoplay() {
        setInterval(() => {
        const index = (this.currentIndex + 1) % this.slides.length
        this.update(index)
        }, 5000)
    }
}

export default Hero