const API_BASE = '/api';

export const api = {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            if (!response.ok) {
                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.error || `Erro na requisição: ${response.statusText}`);
                } catch (e) {
                    throw new Error(`Erro (${response.status}): ${response.statusText}`);
                }
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return await response.json();
            } else {
                // Se não for JSON (ex: erro 500 do servidor web), lança erro
                const text = await response.text();
                throw new Error(`Resposta não-JSON do servidor: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return await response.json();
            } else {
                return { ok: true };
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
