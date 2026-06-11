import ENDPOINT from "./serverEndpoint";
import { getToken } from "./storeFuncs";

type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

const buildUrl = (api: string, query?: Record<string, unknown>) => {
    const trimmedEndpoint = ENDPOINT.endsWith("/") ? ENDPOINT.slice(0, -1) : ENDPOINT;
    const normalizedApi = api.startsWith("/") ? api : `/${api}`;
    const url = new URL(`${trimmedEndpoint}${normalizedApi}`);

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) value.forEach(item => url.searchParams.append(key, String(item)));
            else url.searchParams.set(key, String(value));
        });
    }

    return url.toString();
};

type ApiRequestOptions = {
    method?: ApiMethod;
    body?: Record<string, unknown> | FormData;
    headers?: HeadersInit;
    auth?: boolean;
};

async function apiCall<T=unknown>(api: string, { method = "GET", body = {}, headers = {}, auth = true}: ApiRequestOptions = {}) : Promise<T>{
    const token = auth ? getToken() : null;
    const isGet = method === "GET";
    const isFormData = body instanceof FormData;
    const apiLink = buildUrl(api, isGet && !isFormData ? body : undefined);
    const finalHeaders = new Headers(headers);

    if (auth && token) {
        finalHeaders.set("Authorization", `Bearer ${token}`);
    }

    if (!isFormData && !finalHeaders.has("Content-Type")) {
        finalHeaders.set("Content-Type", "application/json");
    }

    try {
        const fetchOptions: RequestInit = {
            method,
            headers: finalHeaders,
            ...(!isGet && { body: isFormData ? body : JSON.stringify(body) }),
        };
        const result = await fetch(apiLink, fetchOptions);
        const text = await result.text();
        let data;
        try { data = text ? JSON.parse(text) : {}; } 
        catch { data = text; }

        if (result.ok) return data as T;

        throw new Error(data?.error || data?.message || text || `Request failed with status ${result.status}`);
    } catch (error) {
        console.error("Error making API call:", error);
        throw error;
    }
};

export default apiCall;
