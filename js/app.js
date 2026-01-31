import { auth } from './auth.js';
import { initTheme } from './components.js';

// Inicialização comum
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // Check if we are on a public page to avoid redirect loop or unnecessary checks
    const publicPages = ['/', '/index', '/login', '/terms', '/privacy', '/change-password', '/index.html', '/login.html', '/terms.html', '/privacy.html', '/change-password.html'];
    if (!publicPages.includes(window.location.pathname)) {
        auth.checkAuth();
    }
    setupUI();
});

function setupUI() {
    // Setup Sidebar Toggle if exists
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }

    // Setup Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    }
}

export function preloadImage(url) {
    const img = new Image();
    img.src = url;
}

export function showToast(message, type = 'info') {
    // Implementação simples de toast usando Bootstrap
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;

    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}
