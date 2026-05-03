class TrustSlider {
  // Селекторы для поиска элементов
  selectors = {
    root: '[data-js-trust]',
    slider: '[data-js-trust-slider]',
    btnPrev: '[data-js-trust-prev]',
    btnNext: '[data-js-trust-next]',
    item: '[data-js-trust-item]',
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