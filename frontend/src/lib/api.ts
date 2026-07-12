function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")

  if (configuredUrl) {
    return configuredUrl
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`
  }

  return "http://localhost:5000/api"
}

type QueryValue = string | number | boolean | null | undefined

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  query?: Record<string, QueryValue>
}

export type ApiResponse<T> = {
  success?: boolean
  message?: string
  data?: T
  token?: string
}

function getStoredToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("assetflow_token")
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${getApiBaseUrl()}${normalizedPath}`)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const payload = await apiRawRequest<T>(path, options)
  return (payload.data ?? payload) as T
}

export async function apiRawRequest<T>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { body, query, headers, ...init } = options
  const token = getStoredToken()

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body instanceof FormData
        ? body
        : body === undefined
          ? undefined
          : JSON.stringify(body),
  })

  const contentType = response.headers.get("content-type")
  const payload = contentType?.includes("application/json")
    ? ((await response.json()) as ApiResponse<T>)
    : ({ message: await response.text() } as ApiResponse<T>)

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed")
  }

  return payload
}

export function saveAuthSession(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("assetflow_token", token)
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("assetflow_token")
  }
}

export const API_BASE_URL = getApiBaseUrl()
