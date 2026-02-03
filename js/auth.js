import { api } from './api.js';

export const auth = {
    async login(username, password) {
        const result = await api.post('/login', { nome: username, senha: password });
        if (result.ok) {
            // Fix: After successful login, fetch user info.
            const userRes = await api.get('/status'); // /api/status returns user info in data
            if (userRes.ok) {
                localStorage.setItem('user', JSON.stringify(userRes.data));
                window.location.href = '/dashboard';
            } else {
                throw new Error('Falha ao obter dados do usuário.');
            }
        } else {
            // Handle login failure
            if (result.error === 'user_not_found') throw new Error('Usuário não encontrado.');
            if (result.error === 'wrong_password') throw new Error('Senha incorreta.');
            if (result.error === 'db_error') throw new Error('Erro no banco de dados.');
            throw new Error('Login falhou.');
        }
        return result;
    },

    logout() {
        api.post('/logout', {}).then(() => {
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    async checkAuth() {
        const isLoginPage = window.location.pathname.includes('login');
        const user = this.getUser();

        if (user) {
            // Verify if session is still valid on server
            try {
                const res = await api.get('/status');
                if (!res.ok) throw new Error('Session expired');
                // Update local user data with fresh data from server
                if (res.data) {
                    localStorage.setItem('user', JSON.stringify(res.data));
                }
            } catch (e) {
                // Session invalid, clear local storage
                console.warn('Sessão expirada ou inválida, deslogando...');
                localStorage.removeItem('user');
                if (!isLoginPage) window.location.href = '/login';
                return;
            }
        }

        if (!user && !isLoginPage) {
            window.location.href = '/login';
        } else if (user && isLoginPage) {
            window.location.href = '/dashboard';
        }
    }
};
