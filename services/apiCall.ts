import ENDPOINT from "./serverEndpoint";
import { Headers } from "@/types";

type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";

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

async function apiCall (api: string, body: any = {}, headers: Headers = {"Content-Type": "application/json"}, method: ApiMethod = "POST") {
    const isGet = method === "GET";
    const isFormData = body instanceof FormData;
    const apiLink = buildUrl(api, isGet ? body : undefined);

    try {
        const fetchOptions: RequestInit = {
            method,
            headers: isFormData ? headers : { ...headers, 'Content-Type': headers['Content-Type'] || 'application/json' },
            ...(!isGet && { body: isFormData ? body : JSON.stringify(body) })
        };
        const result = await fetch(apiLink, fetchOptions);
        const text = await result.text();
        const data = text ? JSON.parse(text) : {};
        
        if (result.status >= 200 && result.status < 300) return data;
        throw new Error(data?.error || text || `Request failed with status ${result.status}`);
    } catch (error) {
        console.error("Error making API call:", error);
        return error;
    }
};

export default apiCall;
