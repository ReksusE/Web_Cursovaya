class Auth {
    selectors = {
        tabs: '.auth-tab',
        forms: '.auth-form',
        loginForm: '[data-form="login"]',
        registerForm: '[data-form="register"]',
        passwordToggle: '[data-toggle-password]',
        passwordInput: '#reg-password',
        strengthBars: '[id^="str-"]',
        strengthText: '#reg-strength-text',
        phoneInput: '#reg-phone',
        toast: '#auth-toast',
        toastText: '#toast-text',
        fieldInputs: '.auth-field__input',
        fieldErrors: '.auth-field__error',
        submitBtn: '.auth-submit',
        switchTabLinks: '[data-switch-tab]',
    }
    stateClasses = {
        isActive: 'is-active',
        isError: 'is-error',
        isValid: 'is-valid',
        isVisible: 'is-visible',
        isLoading: 'is-loading',
    }
    API_URL = 'http://localhost:3000'
    strengthLevels = ['', 'Слабый', 'Средний', 'Хороший', 'Надёжный']
    strengthColors = ['', '#e05a5a', '#e09a2a', '#6ab04c', '#2ed573']

    constructor() { this.init() }

    init() {
        this.initTabs()
        this.initPasswordToggle()
        this.initPasswordStrength()
        this.initValidation()
        this.initPhoneMask()
    }

    // ─── ТАБЫ ──────────────────────────────────────────────
    initTabs() {
        const tabs = document.querySelectorAll(this.selectors.tabs)
        const forms = document.querySelectorAll(this.selectors.forms)

        const switchTab = (name) => {
        tabs.forEach(tab => {
            const active = tab.dataset.tab === name
            tab.classList.toggle(this.stateClasses.isActive, active)
            tab.setAttribute('aria-selected', active)
        })
        forms.forEach(form => {
            const active = form.id === `panel-${name}`
            form.classList.toggle(this.stateClasses.isActive, active)
            if (active) this.clearErrors(form)
        })
        }

        tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)))
        document.querySelectorAll(this.selectors.switchTabLinks).forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault()
            switchTab(link.dataset.switchTab)
        })
        })
    }

    // ─── ПАРОЛЬ ────────────────────────────────────────────
    initPasswordToggle() {
        document.querySelectorAll(this.selectors.passwordToggle).forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.togglePassword)
            if (!input) return
            const isText = input.type === 'text'
            input.type = isText ? 'password' : 'text'
            btn.setAttribute('aria-label', isText ? 'Показать пароль' : 'Скрыть пароль')
        })
        })
    }

    initPasswordStrength() {
        const passwordInput = document.querySelector(this.selectors.passwordInput)
        if (!passwordInput) return

        const bars = Array.from(document.querySelectorAll(this.selectors.strengthBars))
        const strengthText = document.querySelector(this.selectors.strengthText)

        const getStrength = (pwd) => {
        let score = 0
        if (pwd.length >= 8) score++
        if (/[A-Z]/.test(pwd)) score++
        if (/[0-9]/.test(pwd)) score++
        if (/[^A-Za-z0-9]/.test(pwd)) score++
        return score
        }

        passwordInput.addEventListener('input', () => {
        const val = passwordInput.value
        const level = val ? getStrength(val) : 0
        bars.forEach((bar, i) => {
            bar.className = 'auth-strength__bar'
            if (i < level) bar.classList.add(`level-${level}`)
        })
        if (strengthText) {
            strengthText.textContent = val ? this.strengthLevels[level] : ''
            strengthText.style.color = this.strengthColors[level]
        }
        })
    }

    // ─── ВАЛИДАЦИЯ & ОТПРАВКА ──────────────────────────────
    initValidation() {
        this.initLoginForm()
        this.initRegisterForm()
        this.initLiveValidation()
    }

    initLoginForm() {
        const form = document.querySelector(this.selectors.loginForm)
        if (!form) return

        form.addEventListener('submit', async e => {
        e.preventDefault()
        this.clearErrors(form)

        const email = form.querySelector('#login-email')
        const password = form.querySelector('#login-password')
        let valid = true

        if (!email.value.trim()) {
            this.showError('login-email-error', 'Введите email')
            this.setFieldState(email, false)
            valid = false
        } else if (!this.validateEmail(email.value)) {
            this.showError('login-email-error', 'Некорректный формат email')
            this.setFieldState(email, false)
            valid = false
        } else { this.setFieldState(email, true) }

        if (!password.value) {
            this.showError('login-password-error', 'Введите пароль')
            this.setFieldState(password, false)
            valid = false
        } else { this.setFieldState(password, true) }

        if (!valid) return

        await this.simulateLoading(form)

        try {
            // Запрашиваем пользователя по email
            const res = await fetch(`${this.API_URL}/users?email=${encodeURIComponent(email.value.trim())}`)
            const users = await res.json()
            const user = users.find(u => u.password === password.value)

            if (user) {
            localStorage.setItem('artkante-current-user', JSON.stringify(user))
            this.showToast(`Добро пожаловать, ${user.name}!`, false)
            setTimeout(() => window.location.href = '/pages/Home.html', 1500)
            } else {
            this.showError('login-email-error', 'Неверный email или пароль')
            this.setFieldState(email, false)
            this.setFieldState(password, false)
            this.showToast('Неверные данные для входа', true)
            }
        } catch (err) {
            this.showToast('Ошибка сети. Проверьте, запущен ли json-server', true)
            console.error(err)
        }
        })
    }

    initRegisterForm() {
        const form = document.querySelector(this.selectors.registerForm)
        if (!form) return

        form.addEventListener('submit', async e => {
        e.preventDefault()
        this.clearErrors(form)

        const name = form.querySelector('#reg-name')
        const email = form.querySelector('#reg-email')
        const phone = form.querySelector('#reg-phone')
        const password = form.querySelector('#reg-password')
        const password2 = form.querySelector('#reg-password2')
        const agree = form.querySelector('#reg-agree')
        const role = form.querySelector('input[name="role"]:checked')
        let valid = true

        if (name.value.trim().length < 2) {
            this.showError('reg-name-error', 'Введите имя (минимум 2 символа)')
            this.setFieldState(name, false)
            valid = false
        } else { this.setFieldState(name, true) }

        if (!this.validateEmail(email.value)) {
            this.showError('reg-email-error', 'Некорректный формат email')
            this.setFieldState(email, false)
            valid = false
        } else {
            // Проверка на дубликат через API
            const existing = await fetch(`${this.API_URL}/users?email=${encodeURIComponent(email.value.trim())}`).then(r => r.json())
            if (existing.length > 0) {
            this.showError('reg-email-error', 'Email уже зарегистрирован')
            this.setFieldState(email, false)
            valid = false
            } else { this.setFieldState(email, true) }
        }

        if (phone.value.trim() && !this.validatePhone(phone.value)) {
            this.showError('reg-phone-error', 'Некорректный номер телефона')
            this.setFieldState(phone, false)
            valid = false
        } else if (phone.value.trim()) { this.setFieldState(phone, true) }

        const pwdVal = password.value
        if (pwdVal.length < 8) {
            this.showError('reg-password-error', 'Пароль должен содержать минимум 8 символов')
            this.setFieldState(password, false)
            valid = false
        } else if (this.getPasswordStrength(pwdVal) < 2) {
            this.showError('reg-password-error', 'Пароль слишком простой')
            this.setFieldState(password, false)
            valid = false
        } else { this.setFieldState(password, true) }

        if (password2.value !== pwdVal) {
            this.showError('reg-password2-error', 'Пароли не совпадают')
            this.setFieldState(password2, false)
            valid = false
        } else if (password2.value) { this.setFieldState(password2, true) }

        if (!agree.checked) {
            this.showError('reg-agree-error', 'Необходимо принять условия использования')
            valid = false
        }

        if (!valid) return

        await this.simulateLoading(form)

        const newUser = {
            name: name.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            password: password.value,
            role: role ? role.value : 'client',
            favorites: [],
            createdAt: new Date().toISOString()
        }

        try {
            const res = await fetch(`${this.API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
            })
            if (!res.ok) throw new Error('Ошибка сервера')

            const created = await res.json()
            localStorage.setItem('artkante-current-user', JSON.stringify(created))
            this.showToast(`Аккаунт создан! Добро пожаловать, ${created.name}`, false)
            setTimeout(() => window.location.href = '/pages/Home.html', 1500)
        } catch (err) {
            this.showToast('Ошибка при регистрации. Попробуйте позже.', true)
            console.error(err)
        }
        })
    }

    initLiveValidation() {
        document.querySelectorAll(this.selectors.fieldInputs).forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) input.classList.add(this.stateClasses.isValid)
        })
        })
    }

    // ─── ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ────────────────────────────
    showError(id, message) {
        const el = document.getElementById(id)
        if (!el) return
        el.textContent = message
        el.classList.toggle(this.stateClasses.isVisible, !!message)
    }

    setFieldState(input, valid) {
        if (!input) return
        input.classList.toggle(this.stateClasses.isError, !valid)
        input.classList.toggle(this.stateClasses.isValid, valid)
    }

    clearErrors(form) {
        form.querySelectorAll(this.selectors.fieldErrors).forEach(el => {
        el.textContent = ''
        el.classList.remove(this.stateClasses.isVisible)
        })
        form.querySelectorAll(this.selectors.fieldInputs).forEach(input => {
        input.classList.remove(this.stateClasses.isError, this.stateClasses.isValid)
        })
    }

    validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) }
    validatePhone(phone) { return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim()) }
    getPasswordStrength(pwd) {
        let score = 0
        if (pwd.length >= 8) score++
        if (/[A-Z]/.test(pwd)) score++
        if (/[0-9]/.test(pwd)) score++
        if (/[^A-Za-z0-9]/.test(pwd)) score++
        return score
    }

    async simulateLoading(form) {
        const btn = form.querySelector(this.selectors.submitBtn)
        if (!btn) return
        btn.classList.add(this.stateClasses.isLoading)
        btn.disabled = true
        await new Promise(resolve => setTimeout(resolve, 1200))
        btn.classList.remove(this.stateClasses.isLoading)
        btn.disabled = false
    }

    showToast(message, isError = false) {
        const toast = document.querySelector(this.selectors.toast)
        const toastText = document.querySelector(this.selectors.toastText)
        if (!toast || !toastText) return
        toastText.textContent = message
        toast.classList.toggle(this.stateClasses.isError, isError)
        toast.classList.add(this.stateClasses.isVisible)
        setTimeout(() => toast.classList.remove(this.stateClasses.isVisible), 3500)
    }

    initPhoneMask() {
        const phoneInput = document.querySelector(this.selectors.phoneInput)
        if (!phoneInput) return
        phoneInput.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '')
        if (v.startsWith('8')) v = '7' + v.slice(1)
        if (v.startsWith('7')) {
            this.value = `+7 (${v.slice(1, 4)}) ${v.slice(4, 7)}-${v.slice(7, 9)}-${v.slice(9, 11)}`.replace(/[\s\(\)\-]+$/, '')
        }
        })
    }
}
export default Auth