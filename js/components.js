import { api } from './api.js';

export function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcons(savedTheme);

    // Global toggle handler
    window.toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    };

    // Global sidebar toggle handler
    window.toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth >= 992) {
            document.body.classList.toggle('sidebar-collapsed');
        } else {
            sidebar.classList.toggle('show');
        }
    };
}

function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
        if (theme === 'dark') {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        } else {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        }
    });
}

export function renderSidebar(activePage = 'dashboard') {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {}
    
    const displayName = (user && user.apelido) ? user.apelido : ((user && user.nome) ? user.nome : 'Carregando...');
    const displayPhoto = (user && user.profile_photo) 
        ? `<img src="${user.profile_photo}" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover; border: 2px solid rgba(255,255,255,0.1);">`
        : `<div class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1);"><i class="bi bi-person-fill text-white"></i></div>`;
    
    let adminLink = '';
    const policeJobs = ['Policia Civil', 'Policia Federal', 'Policia Militar', 'Bope', 'Policia Penal'];
    
    let policeLink = '';
    if (user && (policeJobs.includes(user.emprego) || user.admin > 0)) {
         policeLink = `
         <div class="px-4 mt-4 mb-2 text-uppercase text-muted small fw-bold" style="font-size: 0.75rem; letter-spacing: 0.05em;">Polícia</div>
         <a class="nav-link ${activePage === 'mdt' ? 'active' : ''}" href="/mdt">
             <i class="bi bi-shield-shaded"></i>
             <span>MDT</span>
         </a>`;
    }

    if (user && user.admin > 0) {
        adminLink += `
        <div class="px-4 mt-4 mb-2 text-uppercase text-muted small fw-bold" style="font-size: 0.75rem; letter-spacing: 0.05em;">Administração</div>
        <a class="nav-link ${activePage === 'admin' ? 'active' : ''}" href="/admin">
            <i class="bi bi-shield-lock-fill"></i>
            <span>Dashboard</span>
        </a>
        <a class="nav-link ${activePage === 'admin_reports' ? 'active' : ''}" href="/admin_reports">
            <i class="bi bi-file-earmark-text-fill"></i>
            <span>Denúncias</span>
        </a>`;
        if (user.admin >= 4) {
            adminLink += `
        <a class="nav-link ${activePage === 'staff' ? 'active' : ''}" href="/staff">
            <i class="bi bi-people-fill"></i>
            <span>Staff</span>
        </a>
        <a class="nav-link ${activePage === 'anticheat' ? 'active' : ''}" href="/anticheat">
            <i class="bi bi-shield-fill-exclamation"></i>
            <span>Anti-Cheat</span>
        </a>`;
        }
    }

    return `
    <aside class="sidebar d-flex flex-column" id="sidebar">
        <div class="sidebar-header">
            <a href="/dashboard" class="sidebar-brand">
                <img src="/img/ncrp.jpg" alt="NCRP" class="rounded-3" style="width: 32px; height: 32px; object-fit: cover;">
                <span>NCRP</span>
            </a>
            <button class="btn btn-link text-white ms-auto d-lg-none btn-close-sidebar" onclick="window.toggleSidebar()">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>

        <div class="flex-grow-1 overflow-auto custom-scrollbar">
            <nav class="nav flex-column">
                <div class="px-4 mb-2 text-uppercase text-muted small fw-bold" style="font-size: 0.75rem; letter-spacing: 0.05em;">Menu Principal</div>
                <a class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" href="/dashboard">
                    <i class="bi bi-grid-fill"></i>
                    <span>Dashboard</span>
                </a>
                <a class="nav-link ${activePage === 'settings' ? 'active' : ''}" href="/settings">
                    <i class="bi bi-gear-fill"></i>
                    <span>Configurações</span>
                </a>
                <a class="nav-link ${activePage === 'reports' ? 'active' : ''}" href="/report">
                    <i class="bi bi-flag-fill"></i>
                    <span>Denúncias</span>
                </a>
                <a class="nav-link ${activePage === 'governo' ? 'active' : ''}" href="/governo">
                    <i class="bi bi-bank2"></i>
                    <span>Governo</span>
                </a>
                <a class="nav-link ${activePage === 'store' ? 'active' : ''}" href="/loja">
                    <i class="bi bi-bag-fill"></i>
                    <span>Loja</span>
                </a>
                ${policeLink}
                ${adminLink}
            </nav>
        </div>

        <div class="p-3 mt-auto user-profile-section">
            <div class="glass-panel p-3 border-0" style="background: rgba(255,255,255,0.03);">
                <div class="d-flex align-items-center gap-3">
                    ${displayPhoto}
                    <div class="overflow-hidden user-info-text">
                        <div class="fw-bold text-white text-truncate" id="sidebar-username">${displayName}</div>
                        <div class="small text-success d-flex align-items-center gap-1">
                            <span class="rounded-circle bg-success" style="width: 6px; height: 6px;"></span>
                            Online
                        </div>
                    </div>
                    <button id="logout-btn" class="btn btn-link text-muted p-0 ms-auto hover-white btn-logout-text" title="Sair">
                        <i class="bi bi-box-arrow-right fs-5"></i>
                    </button>
                </div>
            </div>
        </div>
    </aside>
    `;
}

export function renderNavbar(title) {
    // Inicia verificação de notificações
    setTimeout(initNotifications, 500);

    return `
    <header class="navbar-top px-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
            <button class="btn btn-link text-white p-0" onclick="window.toggleSidebar()" title="Alternar Menu">
                <i class="bi bi-list fs-4"></i>
            </button>
            <h4 class="mb-0 d-none d-md-block">${title || 'Dashboard'}</h4>
        </div>

        <div class="d-flex align-items-center gap-4">
            <!-- Notifications -->
            <div class="dropdown">
                <button class="btn btn-link text-white p-0 position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="notif-btn">
                    <i class="bi bi-bell-fill fs-5"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none" id="notif-badge">0</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 glass-panel" style="width: 320px; max-height: 400px; overflow-y: auto;" id="notif-list">
                    <li><span class="dropdown-header text-white">Notificações</span></li>
                    <li><hr class="dropdown-divider bg-secondary"></li>
                    <li class="text-center p-3 text-muted small">Carregando...</li>
                </ul>
            </div>
        </div>
    </header>
    `;
}

async function initNotifications() {
    const btn = document.getElementById('notif-btn');
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    
    if (!btn || !list) return;

    // Load function
    const load = async () => {
        try {
            const res = await api.get('/notifications');
            if (res.ok) {
                const { data, unread } = res;
                
                // Badge
                if (unread > 0) {
                    badge.textContent = unread > 99 ? '99+' : unread;
                    badge.classList.remove('d-none');
                } else {
                    badge.classList.add('d-none');
                }

                // List
                if (data.length === 0) {
                    list.innerHTML = `
                        <li><span class="dropdown-header">Notificações</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li class="text-center p-3 text-muted small">Nenhuma notificação.</li>
                    `;
                } else {
                    let html = `<li><span class="dropdown-header">Notificações</span></li><li><hr class="dropdown-divider"></li>`;
                    html += data.map(n => `
                        <li>
                            <a class="dropdown-item text-wrap ${n.is_read ? 'text-muted' : 'fw-bold'}" href="#" onclick="readNotification(${n.id}, '${n.link || '#'}')">
                                <small class="d-block text-secondary" style="font-size: 0.75rem;">${new Date(n.created_at).toLocaleString()}</small>
                                <div class="mb-1">${n.title}</div>
                                <small class="fw-normal">${n.message}</small>
                            </a>
                        </li>
                        <li><hr class="dropdown-divider m-0"></li>
                    `).join('');
                    list.innerHTML = html;
                }
            }
        } catch (e) {
            console.error('Erro notificações:', e);
        }
    };

    // Initial load
    load();
    // Poll every 30s
    setInterval(load, 30000);

    // Global read function
    window.readNotification = async (id, link) => {
        try {
            await api.put(`/notifications/${id}/read`);
            load(); // reload to update UI
            if (link && link !== '#' && link !== 'null') {
                window.location.href = link;
            }
        } catch (e) {
            console.error(e);
        }
    };
}

export function renderPublicNavbar(activePage = '') {
    return `
    <nav class="navbar navbar-expand-lg sticky-top border-bottom" style="background-color: var(--card-bg); backdrop-filter: blur(10px);">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2" href="/">
                <img src="/img/ncrp.jpg" alt="NCRP Logo" class="rounded-3" style="width: 32px; height: 32px; object-fit: cover;">
                <span class="fw-bold">NCRP</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#publicNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="publicNavbar">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'terms' ? 'active' : ''}" href="/terms">Termos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'privacy' ? 'active' : ''}" href="/privacy">Privacidade</a>
                    </li>
                    <li class="nav-item ms-lg-2">
                        <button class="btn btn-link nav-link" onclick="window.toggleTheme()" title="Alternar Tema">
                            <i class="bi bi-moon-fill theme-icon"></i>
                        </button>
                    </li>
                    <li class="nav-item ms-lg-2">
                        <a href="/login" class="btn btn-primary btn-sm px-4 rounded-pill">Entrar / Painel</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;
}