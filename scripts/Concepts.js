class Concepts {
  selectors = {
    root: '[data-js-concepts]',
    filterGroup: '[data-js-concepts-filter-btn]',
  }

  stateClasses = {
    isFixed: 'is-fixed',
  }

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) return;

    this.filterGroups = this.rootElement.querySelectorAll(this.selectors.filterGroup);
    this.bindEvents();
  }

  bindEvents() {
    this.filterGroups.forEach(group => {
      group.addEventListener('click', (e) => {
        // Предотвращаем закрытие при клике внутри самого списка
        e.stopPropagation(); 
        
        // Переключаем состояние фиксации
        const isActive = group.classList.contains(this.stateClasses.isFixed);
        
        // Закрываем другие группы (если нужно поведение аккордеона)
        this.closeAll();

        if (!isActive) {
          group.classList.add(this.stateClasses.isFixed);
        }
      });
    });

    // Закрытие всех фиксированных меню при клике по любому другому месту страницы
    document.addEventListener('click', () => this.closeAll());
  }

  closeAll() {
    this.filterGroups.forEach(group => {
      group.classList.remove(this.stateClasses.isFixed);
    });
  }
}

export default Concepts;