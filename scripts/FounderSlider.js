class TrustSlider {
  // Селекторы для поиска элементов
  selectors = {
    root: '[data-js-founder-about]',
    slider: '[data-js-founder-about-slider]',
    btnPrev: '[data-js-founder-about-prev]',
    btnNext: '[data-js-founder-about-next]',
    item: '[data-js-founder-about-item]',
  }

  // Состояния (опционально, если захочешь менять стили кнопок)
  stateAttributes = {
    disabled: 'disabled',
  }

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root)
    
    // Если секции нет на странице, прерываем выполнение
    if (!this.rootElement) return

    this.sliderElement = this.rootElement.querySelector(this.selectors.slider)
    this.btnPrevElement = this.rootElement.querySelector(this.selectors.btnPrev)
    this.btnNextElement = this.rootElement.querySelector(this.selectors.btnNext)
    
    this.bindEvents()
  }

  /**
   * Вычисляет шаг прокрутки динамически
   */
  getScrollStep() {
    const firstItem = this.sliderElement.querySelector(this.selectors.item)
    if (!firstItem) return 0

    const itemWidth = firstItem.offsetWidth
    const gap = parseFloat(getComputedStyle(this.sliderElement).gap) || 0

    return itemWidth + gap
  }

  // Обработчик кнопки "Вперед"
  onNextClick = () => {
    this.sliderElement.scrollBy({
      left: this.getScrollStep(),
      behavior: 'smooth',
    })
  }

  // Обработчик кнопки "Назад"
  onPrevClick = () => {
    this.sliderElement.scrollBy({
      left: -this.getScrollStep(),
      behavior: 'smooth',
    })
  }

  /**
   * Привязка событий
   */
  bindEvents() {
    this.btnNextElement.addEventListener('click', this.onNextClick)
    this.btnPrevElement.addEventListener('click', this.onPrevClick)
  }
}

export default TrustSlider