const TOKEN_KEY = 'ai_exam_access_token'

export const tokenUtils = {
  getToken(): string {
    return localStorage.getItem(TOKEN_KEY) ?? ''
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  }
}
