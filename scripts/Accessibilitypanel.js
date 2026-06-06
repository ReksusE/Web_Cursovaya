/**
 * AccessibilityPanel — версия для слабовидящих
 * Подключение: import AccessibilityPanel from './AccessibilityPanel.js';
 * Вызов: new AccessibilityPanel();
 */

class AccessibilityPanel {
    STORAGE_KEY = 'artkante-accessibility'

    defaults = {
        fontSize: 0,       // шаг увеличения шрифта: 0 / 1 / 2
        contrast: 'none',  // 'none' | 'high' | 'inverted'
        grayscale: false,
        kerning: false,
        dyslexia: false,
        hideImages: false,
    }

    constructor() {
        this.settings = { ...this.defaults, ...this.loadSettings() }
        this.panelOpen = false
        this.render()
        this.applyAll()
        this.bindEvents()
    }

    /* ─── Persistent storage ─────────────────────────────── */
    loadSettings() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {} }
        catch { return {} }
    }
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings))
    }

    /* ─── Render ─────────────────────────────────────────── */
    render() {
        // Кнопка-триггер (фиксированная, снизу слева)
        this.trigger = document.createElement('button')
        this.trigger.className = 'a11y-trigger'
        this.trigger.setAttribute('aria-label', 'Открыть панель специальных возможностей')
        this.trigger.setAttribute('aria-expanded', 'false')
        this.trigger.innerHTML = /* html */`
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="4.5" r="1.75" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5 8.5h14M12 8.5v11M8 12l-3 7.5M16 12l3 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Версия для слабовидящих</span>
        `

        // Панель настроек
        this.panel = document.createElement('div')
        this.panel.className = 'a11y-panel'
        this.panel.setAttribute('role', 'dialog')
        this.panel.setAttribute('aria-label', 'Специальные возможности')
        this.panel.setAttribute('aria-hidden', 'true')
        this.panel.innerHTML = /* html */`
            <div class="a11y-panel__header">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="4.5" r="1.75" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M5 8.5h14M12 8.5v11M8 12l-3 7.5M16 12l3 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Специальные возможности</span>
                <button class="a11y-panel__close" aria-label="Закрыть панель">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
            </div>

            <div class="a11y-panel__body">

                <!-- Размер шрифта -->
                <div class="a11y-section">
                    <p class="a11y-section__label">Размер текста</p>
                    <div class="a11y-font-btns">
                        <button class="a11y-font-btn" data-font="0" aria-label="Обычный размер">А</button>
                        <button class="a11y-font-btn" data-font="1" aria-label="Увеличенный размер">А</button>
                        <button class="a11y-font-btn" data-font="2" aria-label="Большой размер">А</button>
                    </div>
                </div>

                <!-- Контраст -->
                <div class="a11y-section">
                    <p class="a11y-section__label">Контрастность</p>
                    <div class="a11y-contrast-btns">
                        <button class="a11y-contrast-btn" data-contrast="none" aria-label="Обычный контраст">
                            <span class="a11y-contrast-btn__preview a11y-contrast-btn__preview--none"></span>
                            Обычный
                        </button>
                        <button class="a11y-contrast-btn" data-contrast="high" aria-label="Высокий контраст">
                            <span class="a11y-contrast-btn__preview a11y-contrast-btn__preview--high"></span>
                            Высокий
                        </button>
                        <button class="a11y-contrast-btn" data-contrast="inverted" aria-label="Инвертированный контраст">
                            <span class="a11y-contrast-btn__preview a11y-contrast-btn__preview--inverted"></span>
                            Инверсия
                        </button>
                    </div>
                </div>

                <!-- Переключатели -->
                <div class="a11y-section">
                    <p class="a11y-section__label">Дополнительно</p>
                    <div class="a11y-toggles">

                        <label class="a11y-toggle">
                            <input type="checkbox" data-toggle="grayscale" aria-label="Оттенки серого">
                            <span class="a11y-toggle__track"></span>
                            <span class="a11y-toggle__label">Оттенки серого</span>
                        </label>

                        <label class="a11y-toggle">
                            <input type="checkbox" data-toggle="kerning" aria-label="Увеличенный межбуквенный интервал">
                            <span class="a11y-toggle__track"></span>
                            <span class="a11y-toggle__label">Разреженный текст</span>
                        </label>

                        <label class="a11y-toggle">
                            <input type="checkbox" data-toggle="dyslexia" aria-label="Шрифт для дислексиков">
                            <span class="a11y-toggle__track"></span>
                            <span class="a11y-toggle__label">Шрифт читаемости</span>
                        </label>

                        <label class="a11y-toggle">
                            <input type="checkbox" data-toggle="hideImages" aria-label="Скрыть изображения">
                            <span class="a11y-toggle__track"></span>
                            <span class="a11y-toggle__label">Скрыть изображения</span>
                        </label>

                    </div>
                </div>

            </div>

            <div class="a11y-panel__footer">
                <button class="a11y-reset-btn" data-reset>Сбросить настройки</button>
            </div>
        `

        document.body.appendChild(this.trigger)
        document.body.appendChild(this.panel)
    }

    /* ─── Apply settings ─────────────────────────────────── */
    applyAll() {
        this.applyFontSize()
        this.applyContrast()
        this.applyToggle('grayscale')
        this.applyToggle('kerning')
        this.applyToggle('dyslexia')
        this.applyToggle('hideImages')
        this.syncUI()
    }

    applyFontSize() {
        const sizes = ['', 'a11y-font-md', 'a11y-font-lg']
        document.documentElement.classList.remove('a11y-font-md', 'a11y-font-lg')
        const cls = sizes[this.settings.fontSize]
        if (cls) document.documentElement.classList.add(cls)
    }

    applyContrast() {
        document.documentElement.classList.remove('a11y-contrast-high', 'a11y-contrast-inverted')
        if (this.settings.contrast === 'high') document.documentElement.classList.add('a11y-contrast-high')
        if (this.settings.contrast === 'inverted') document.documentElement.classList.add('a11y-contrast-inverted')
    }

    applyToggle(key) {
        const classMap = {
            grayscale:  'a11y-grayscale',
            kerning:    'a11y-kerning',
            dyslexia:   'a11y-dyslexia',
            hideImages: 'a11y-hide-images',
        }
        document.documentElement.classList.toggle(classMap[key], !!this.settings[key])
    }

    /* ─── Sync UI controls with current settings ─────────── */
    syncUI() {
        // Кнопки размера шрифта
        this.panel.querySelectorAll('[data-font]').forEach(btn => {
            btn.classList.toggle('is-active', Number(btn.dataset.font) === this.settings.fontSize)
        })
        // Кнопки контраста
        this.panel.querySelectorAll('[data-contrast]').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.contrast === this.settings.contrast)
        })
        // Чекбоксы
        this.panel.querySelectorAll('[data-toggle]').forEach(chk => {
            chk.checked = !!this.settings[chk.dataset.toggle]
        })
    }

    /* ─── Events ─────────────────────────────────────────── */
    bindEvents() {
        // Открыть / закрыть
        this.trigger.addEventListener('click', () => this.togglePanel())
        this.panel.querySelector('.a11y-panel__close').addEventListener('click', () => this.closePanel())

        // Клик вне панели
        document.addEventListener('click', e => {
            if (this.panelOpen && !this.panel.contains(e.target) && !this.trigger.contains(e.target)) {
                this.closePanel()
            }
        })
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.panelOpen) this.closePanel()
        })

        // Размер шрифта
        this.panel.querySelectorAll('[data-font]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.fontSize = Number(btn.dataset.font)
                this.applyFontSize()
                this.syncUI()
                this.save()
            })
        })

        // Контраст
        this.panel.querySelectorAll('[data-contrast]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.contrast = btn.dataset.contrast
                this.applyContrast()
                this.syncUI()
                this.save()
            })
        })

        // Переключатели
        this.panel.querySelectorAll('[data-toggle]').forEach(chk => {
            chk.addEventListener('change', () => {
                const key = chk.dataset.toggle
                this.settings[key] = chk.checked
                this.applyToggle(key)
                this.save()
            })
        })

        // Сброс
        this.panel.querySelector('[data-reset]').addEventListener('click', () => {
            this.settings = { ...this.defaults }
            this.applyAll()
            this.save()
        })
    }

    /* ─── Panel open / close ─────────────────────────────── */
    togglePanel() {
        this.panelOpen ? this.closePanel() : this.openPanel()
    }

    openPanel() {
        this.panelOpen = true
        this.panel.classList.add('is-open')
        this.trigger.classList.add('is-active')
        this.trigger.setAttribute('aria-expanded', 'true')
        this.panel.setAttribute('aria-hidden', 'false')
        // Фокус на первый интерактивный элемент
        setTimeout(() => this.panel.querySelector('button, input')?.focus(), 50)
    }

    closePanel() {
        this.panelOpen = false
        this.panel.classList.remove('is-open')
        this.trigger.classList.remove('is-active')
        this.trigger.setAttribute('aria-expanded', 'false')
        this.panel.setAttribute('aria-hidden', 'true')
        this.trigger.focus()
    }
}

export default AccessibilityPanel