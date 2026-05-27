class Timeline {
  selectors = {
    block: '[data-js-timeline-block]',
    toggle: '[data-js-timeline-toggle]',
  }
  constructor() {
    document.querySelectorAll(this.selectors.block).forEach(block => {
      block.querySelector(this.selectors.toggle)
        .addEventListener('click', () => block.classList.toggle('is-open'));
    });
  }
}

export default Timeline;