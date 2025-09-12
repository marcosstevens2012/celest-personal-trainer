// API client for the Personal Trainer backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || `HTTP ${response.status}`,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Students API
export const studentsApi = {
  list: (
    trainerId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
    }
  ) => {
    const searchParams = new URLSearchParams({ trainerId });
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.isActive !== undefined)
      searchParams.set("isActive", params.isActive.toString());

    return fetchApi(`/students?${searchParams}`);
  },

  create: (data: any) =>
    fetchApi("/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchApi(`/students?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/students?id=${id}`, {
      method: "DELETE",
    }),
};

// Plans API
export const plansApi = {
  list: (
    trainerId: string,
    params?: {
      studentId?: string;
      page?: number;
      limit?: number;
      search?: string;
      planType?: string;
      difficultyLevel?: string;
    }
  ) => {
    const searchParams = new URLSearchParams({ trainerId });
    if (params?.studentId) searchParams.set("studentId", params.studentId);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.planType) searchParams.set("planType", params.planType);
    if (params?.difficultyLevel)
      searchParams.set("difficultyLevel", params.difficultyLevel);

    return fetchApi(`/plans?${searchParams}`);
  },

  create: (data: any) =>
    fetchApi("/plans", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchApi(`/plans?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/plans?id=${id}`, {
      method: "DELETE",
    }),

  duplicate: async (id: string, newName: string) => {
    // First get the original plan
    const originalPlan = await fetchApi<{ data: Record<string, unknown> }>(
      `/plans?trainerId=${id}`
    );
    // Then create a copy with modifications
    const duplicatedPlan = {
      ...originalPlan.data,
      name: newName,
      id: undefined, // Remove ID so it creates a new one
      createdAt: undefined,
      updatedAt: undefined,
    };
    return fetchApi("/plans", {
      method: "POST",
      body: JSON.stringify(duplicatedPlan),
    });
  },
};

// Trainers API
export const trainersApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    specialization?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.specialization)
      searchParams.set("specialization", params.specialization);

    return fetchApi(`/trainers?${searchParams}`);
  },

  get: (id: string) => fetchApi(`/trainers?id=${id}`),

  create: (data: any) =>
    fetchApi("/trainers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Payments API
export const paymentsApi = {
  list: (params?: {
    trainerId?: string;
    studentId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.trainerId) searchParams.set("trainerId", params.trainerId);
    if (params?.studentId) searchParams.set("studentId", params.studentId);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    return fetchApi(`/payments?${searchParams}`);
  },

  create: (data: any) =>
    fetchApi("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchApi(`/payments?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export { ApiError };
