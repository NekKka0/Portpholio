// Фильтрация проектов с поддержкой контейнерных запросов

class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.bindEvents();
        this.initContainerQueries();
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e);
            });

            // Поддержка клавиатурной навигации
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleFilterClick(e);
                }
            });
        });

        // Обработчики для кнопок "Подробнее"
        document.querySelectorAll('.project-link').forEach(button => {
            button.addEventListener('click', (e) => {
                this.showProjectDetails(e);
            });
        });
    }

    handleFilterClick(e) {
        const button = e.currentTarget;
        const filterValue = button.getAttribute('data-filter');

        // Убираем активный класс со всех кнопок
        this.filterButtons.forEach(btn => {
            btn.classList.remove('filter-btn--active');
            btn.setAttribute('aria-pressed', 'false');
        });

        // Добавляем активный класс на clicked кнопку
        button.classList.add('filter-btn--active');
        button.setAttribute('aria-pressed', 'true');

        // Применяем фильтрацию
        this.filterProjects(filterValue);
    }

    filterProjects(filterValue) {
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                card.setAttribute('aria-hidden', 'false');
            } else {
                card.style.display = 'none';
                card.setAttribute('aria-hidden', 'true');
            }
        });

        // Обновляем live region для скринридеров
        this.updateLiveRegion(filterValue);
    }

    updateLiveRegion(filterValue) {
        let message = 'Показаны все проекты';

        if (filterValue !== 'all') {
            const filterText = document.querySelector(`[data-filter="${filterValue}"]`).textContent;
            message = `Показаны проекты в категории: ${filterText}`;
        }

        // Создаем или обновляем live region
        let liveRegion = document.getElementById('filter-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'filter-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'visually-hidden';
            document.body.appendChild(liveRegion);
        }

        liveRegion.textContent = message;
    }

    showProjectDetails(e) {
        const button = e.currentTarget;
        const projectId = button.getAttribute('data-project');
        const projectCard = button.closest('.project-card');
        const projectName = projectCard.querySelector('.project-name').textContent;

        // В реальном проекте здесь будет открытие модального окна
        this.showProjectModal(projectId, projectName);
    }

    showProjectModal(projectId, projectName) {
        alert(`Детальная информация о проекте "${projectName}"\n\nВ реальном проекте здесь будет модальное окно с:\n- Полным описанием проекта\n- Скриншотами\n- Ссылками на живую версию и исходный код\n- Технологическим стеком`);
    }

    initContainerQueries() {
        // Проверяем поддержку контейнерных запросов
        if ('container' in document.documentElement.style) {
            console.log('Контейнерные запроссы поддерживаются');

            // Динамически обновляем сетку на основе контейнера
            this.observeContainerChanges();
        } else {
            console.log('Контейнерные запроссы не поддерживаются, используем медиазапросы');
        }
    }

    observeContainerChanges() {
        // Наблюдаем за изменениями контейнера проектов
        const projectsArea = document.querySelector('.projects-area');

        if (projectsArea && 'container' in projectsArea.style) {
            // В реальном проекте здесь может быть дополнительная логика
            // для реакции на изменения размера контейнера
        }
    }
}

// Анимация прогресс-баров
class ProgressAnimator {
    constructor() {
        this.animateOnScroll();
    }

    animateOnScroll() {
        const progressBars = document.querySelectorAll('.skill-progress');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';

                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);

                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => observer.observe(bar));
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsFilter();
    new ProgressAnimator();
});