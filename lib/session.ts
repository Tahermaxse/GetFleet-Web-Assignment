import { TOKEN_STORAGE_KEY } from "@/lib/constants"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 

const buildCookie = (value: string) =>
  `${TOKEN_STORAGE_KEY}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict${typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : ""}`

export const setSessionToken = (token: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  document.cookie = buildCookie(token)
}

export const clearSessionToken = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; max-age=0; SameSite=Strict`
}

export const getSessionToken = () => {
  if (typeof window === "undefined") return null
  const cookie = document.cookie
  const match = cookie.match(new RegExp(`(?:^|; )${TOKEN_STORAGE_KEY}=([^;]*)`))
  if (match?.[1]) {
    return decodeURIComponent(match[1])
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

