const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImage?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Cargar token del localStorage al inicializar
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Guardar token en localStorage
    this.token = data.token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", data.token);
    }

    return data;
  }

  async verify(): Promise<{ success: boolean; user: User }> {
    if (!this.token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Token inválido, limpiar localStorage
      this.logout();
      throw new Error(data.error || "Token verification failed");
    }

    return data;
  }

  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout (opcional)
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Limpiar token local
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();