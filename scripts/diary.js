// Валидация форм для учебного дневника
class DiaryFormValidator {
    constructor() {
        this.form = document.getElementById('diaryForm');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupLiveValidation();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Валидация при изменении полей
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });

        // Валидация при потере фокуса
        this.form.addEventListener('blur', (e) => {
            this.validateField(e.target, true);
        }, true);
    }

    setupLiveValidation() {
        // Добавляем aria-live регионы для ошибок
        const fields = this.form.querySelectorAll('[required]');
        fields.forEach(field => {
            const errorId = `${field.id}Error`;
            let errorElement = document.getElementById(errorId);

            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.id = errorId;
                errorElement.className = 'form-error';
                errorElement.setAttribute('aria-live', 'polite');
                field.parentNode.appendChild(errorElement);
            }
        });
    }

    validateField(field, showError = false) {
        const errorElement = document.getElementById(`${field.id}Error`);

        if (!errorElement) return;

        // Очищаем предыдущие ошибки
        errorElement.textContent = '';
        field.setAttribute('aria-invalid', 'false');

        if (field.validity.valid) {
            return true;
        }

        if (showError) {
            this.showFieldError(field, errorElement);
        }

        return false;
    }

    showFieldError(field, errorElement) {
        let message = '';

        if (field.validity.valueMissing) {
            message = 'Это поле обязательно для заполнения';
        } else if (field.validity.tooShort) {
            message = `Минимальная длина: ${field.minLength} символов`;
        } else if (field.validity.tooLong) {
            message = `Максимальная длина: ${field.maxLength} символов`;
        } else if (field.validity.typeMismatch) {
            message = 'Неверный формат данных';
        } else {
            message = 'Пожалуйста, исправьте ошибку в этом поле';
        }

        errorElement.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id);
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('[required]');

        fields.forEach(field => {
            if (!this.validateField(field, true)) {
                isValid = false;

                // Фокусируемся на первом невалидном поле
                if (isValid === false) {
                    field.focus();
                    isValid = null; // Чтобы фокус сработал только один раз
                }
            }
        });

        return isValid === true;
    }

    handleSubmit() {
        if (this.validateForm()) {
            this.submitForm();
        }
    }

    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Показываем индикатор загрузки
        this.setLoadingState(true);

        // Имитация отправки данных
        setTimeout(() => {
            this.setLoadingState(false);
            this.showSuccessMessage();
            this.form.reset();
        }, 1500);
    }

    setLoadingState(loading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');

        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-disabled', 'true');
            submitBtn.querySelector('.btn-text').textContent = 'Добавление...';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.setAttribute('aria-disabled', 'false');
            submitBtn.querySelector('.btn-text').textContent = 'Добавить запись';
        }
    }

    showSuccessMessage() {
        // Создаем или находим элемент для сообщений
        let messageElement = document.getElementById('form-success-message');

        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'form-success-message';
            messageElement.setAttribute('role', 'alert');
            messageElement.setAttribute('aria-live', 'polite');
            messageElement.style.cssText = `
                background: #27ae60;
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
                text-align: center;
            `;
            this.form.parentNode.insertBefore(messageElement, this.form.nextSibling);
        }

        messageElement.textContent = 'Запись успешно добавлена в дневник!';
        messageElement.style.display = 'block';

        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new DiaryFormValidator();
});