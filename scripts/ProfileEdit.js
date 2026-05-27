class ProfileEdit {
    constructor(modalManager, userPanel, toastManager) {
        this.modalManager = modalManager;
        this.userPanel = userPanel;
        this.toastManager = toastManager;
        this.form = document.getElementById('profile-edit-form');
        
        if (!this.form) return;

        this.fields = {
            name: document.getElementById('edit-name'),
            email: document.getElementById('edit-email'),
            phone: document.getElementById('edit-phone'),
            password: document.getElementById('edit-password'),
            passwordConfirm: document.getElementById('edit-password-confirm')
        };

        this.errors = {
            name: document.getElementById('edit-name-error'),
            email: document.getElementById('edit-email-error'),
            phone: document.getElementById('edit-phone-error'),
            password: document.getElementById('edit-password-error'),
            passwordConfirm: document.getElementById('edit-password-confirm-error')
        };

        this.API_URL = 'http://localhost:3000';
        
        this.init();
    }

    init() {
        // Слушаем открытие модалки, чтобы заполнить данные
        // Так как Modal.js не кидает событие, мы можем перехватить клик по кнопке открытия
        // Или просто заполнять данные при каждом открытии, если модалка активна.
        // Лучший способ: добавить слушатель на кнопку открытия в UserPanel, 
        // но так как у нас нет прямого доступа, сделаем заполнение при фокусе или показе.
        
        // Вариант: Заполняем поля каждый раз, когда пользователь начинает взаимодействовать с формой
        this.form.addEventListener('focusin', () => this.populateFields(), { once: true });
        
        // Обработчик отправки
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    populateFields() {
        const user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');
        if (!user) return;

        if (this.fields.name) this.fields.name.value = user.name || '';
        if (this.fields.email) this.fields.email.value = user.email || '';
        if (this.fields.phone) this.fields.phone.value = user.phone || '';
        
        // Очищаем поля паролей
        if (this.fields.password) this.fields.password.value = '';
        if (this.fields.passwordConfirm) this.fields.passwordConfirm.value = '';
        
        this.clearErrors();
    }

    clearErrors() {
        Object.values(this.errors).forEach(el => {
            if (el) {
                el.textContent = '';
                el.classList.remove('is-visible');
            }
        });
        Object.values(this.fields).forEach(el => {
            if (el) el.classList.remove('is-error', 'is-valid');
        });
    }

    showError(fieldKey, message) {
        if (this.errors[fieldKey]) {
            this.errors[fieldKey].textContent = message;
            this.errors[fieldKey].classList.add('is-visible');
        }
        if (this.fields[fieldKey]) {
            this.fields[fieldKey].classList.add('is-error');
        }
    }

    validate() {
        let isValid = true;
        const user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');

        // Валидация имени
        if (!this.fields.name.value.trim()) {
            this.showError('name', 'Введите имя');
            isValid = false;
        }

        // Валидация Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.fields.email.value)) {
            this.showError('email', 'Некорректный Email');
            isValid = false;
        } else if (this.fields.email.value !== user.email) {
            // Если email изменился, можно добавить проверку на уникальность, 
            // но для простоты пока пропустим или оставим на сервере
        }

        // Валидация телефона (если введен)
        if (this.fields.phone.value && this.fields.phone.value.length < 10) {
            this.showError('phone', 'Слишком короткий номер');
            isValid = false;
        }

        // Валидация пароля (если введен)
        if (this.fields.password.value) {
            if (this.fields.password.value.length < 6) {
                this.showError('password', 'Минимум 6 символов');
                isValid = false;
            }
            if (this.fields.password.value !== this.fields.passwordConfirm.value) {
                this.showError('passwordConfirm', 'Пароли не совпадают');
                isValid = false;
            }
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.clearErrors();

        if (!this.validate()) return;

        const user = JSON.parse(localStorage.getItem('artkante-current-user') || 'null');
        if (!user) return;

        const updatedData = {
            name: this.fields.name.value.trim(),
            email: this.fields.email.value.trim(),
            phone: this.fields.phone.value.trim(),
        };

        // Добавляем пароль только если он был изменен
        if (this.fields.password.value) {
            updatedData.password = this.fields.password.value;
        }

        try {
            const response = await fetch(`${this.API_URL}/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Ошибка обновления');

            const updatedUser = await response.json();
            
            // Обновляем данные в localStorage
            // Сохраняем старые favorites и role, если они не пришли с сервера (json-server возвращает только измененное)
            // Но PATCH обычно возвращает весь объект. На всякий случай объединим.
            const currentUser = JSON.parse(localStorage.getItem('artkante-current-user'));
            const mergedUser = { ...currentUser, ...updatedUser };
            
            localStorage.setItem('artkante-current-user', JSON.stringify(mergedUser));

            // Обновляем UI в хедере
            if (this.userPanel) {
                this.userPanel.updateUserInfo();
            }

            this.toastManager.show('Профиль успешно обновлен!', 'success');
            this.modalManager.close();
            this.userPanel.updateUserInfo();

        } catch (err) {
            console.error(err);
            this.toastManager.show('Ошибка при сохранении. Проверьте консоль.');
        }
    }
}

export default ProfileEdit;