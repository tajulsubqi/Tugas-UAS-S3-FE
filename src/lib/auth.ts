export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token)
}

export const getAuthToken = (): string | null => {
  const directToken = localStorage.getItem("token")
  if (directToken) return directToken

  const persistedAuth = localStorage.getItem("auth-storage")
  if (!persistedAuth) return null

  try {
    const parsed = JSON.parse(persistedAuth) as {
      state?: { token?: string | null }
    }
    return parsed.state?.token || null
  } catch {
    return null
  }
}

export const removeAuthToken = () => {
  localStorage.removeItem("token")
}
