const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include'
    });

    if (!res.ok) {
      // If external port 4000 failed, try local /api fallback
      if (API_URL.includes(':4000')) {
        const localRes = await fetch(`/api${endpoint}`, options);
        if (localRes.ok) return await localRes.json();
      }
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // If network error (e.g. port 4000 refused), fallback to local /api
    if (!url.startsWith('/api')) {
      try {
        const localRes = await fetch(`/api${endpoint}`, options);
        if (localRes.ok) return await localRes.json();
      } catch (fallbackErr) {
        // continue
      }
    }
    console.error(`[API Fetch Error] ${endpoint}:`, error);
    throw error;
  }
}

// Public API endpoints
export const api = {
  // Brands
  getBrands: (vehicleType?: string) =>
    fetchApi<{ success: boolean; brands: any[] }>(`/brands${vehicleType ? `?vehicleType=${vehicleType}` : ''}`),
  getBrandModels: (brandSlug: string, vehicleType?: string) =>
    fetchApi<{ success: boolean; brand: any; models: any[] }>(`/brands/${brandSlug}/models${vehicleType ? `?vehicleType=${vehicleType}` : ''}`),

  // Categories
  getCategoryTree: () =>
    fetchApi<{ success: boolean; tree: any[] }>('/categories/tree'),
  getCategories: (level?: number) =>
    fetchApi<{ success: boolean; categories: any[] }>(`/categories${level ? `?level=${level}` : ''}`),

  // Parts
  getParts: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return fetchApi<{
      success: boolean;
      items: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/parts?${searchParams.toString()}`);
  },

  getPartBySlug: (slug: string) =>
    fetchApi<{ success: boolean; part: any; relatedParts: any[] }>(`/parts/${slug}`),

  // Search & Autocomplete
  searchSuggest: (q: string) =>
    fetchApi<{ success: boolean; suggestions: { parts: any[]; models: any[]; categories: any[] } }>(`/search/suggest?q=${encodeURIComponent(q)}`),
  search: (q: string, filters: Record<string, any> = {}) => {
    const params = new URLSearchParams({ q, ...filters });
    return fetchApi<{ success: boolean; items: any[]; total: number; query: string }>(`/parts?${params.toString()}`);
  },

  // Enquiries
  submitEnquiry: (data: any) =>
    fetchApi<{ success: boolean; refNo: string; message: string; enquiry: any }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Contact
  submitContact: (data: any) =>
    fetchApi<{ success: boolean; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Pages & Banners & Settings
  getPage: (slug: string) =>
    fetchApi<{ success: boolean; page: any }>(`/pages/${slug}`),
  getBanners: () =>
    fetchApi<{ success: boolean; banners: any[] }>('/banners'),
  getSettings: () =>
    fetchApi<{ success: boolean; settings: Record<string, string> }>('/settings/public')
};
