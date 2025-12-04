// Основные скрипты для адаптивности и доступности

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.initSmoothScrolling();
        this.initFocusManagement();
        this.initReducedMotion();
        this.initImageLoading();
    }

    // Плавная прокрутка для якорных ссылок
    initSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    // Управление фокусом для доступности
    initFocusManagement() {
        // Сохраняем последний сфокусированный элемент
        let lastFocusedElement;

        document.addEventListener('focusin', (e) => {
            lastFocusedElement = e.target;
        });

        // Восстанавливаем фокус после закрытия модальных окон
        window.restoreFocus = () => {
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };
    }

    // Уважение к настройкам уменьшения движения
    initReducedMotion() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (reducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-normal', '0s');
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    }

    // Оптимизация загрузки изображений
    initImageLoading() {
        // Lazy loading с Intersection Observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Утилиты для работы с изображениями
class ImageUtils {
    static generateSrcset(basePath, widths, format = 'jpg') {
        return widths.map(width => `${basePath}-${width}.${format} ${width}w`).join(', ');
    }

    static getOptimalImageSize(containerWidth, dpr = 1) {
        const sizes = [320, 640, 768, 1024, 1280, 1536, 1920];
        const targetSize = containerWidth * dpr;

        return sizes.find(size => size >= targetSize) || sizes[sizes.length - 1];
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, ImageUtils };
}