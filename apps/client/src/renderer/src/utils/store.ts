/** 
 * Safe localStorage wrapper — replaces the electron-store reference 
 * that the client-builder subagent incorrectly generated.
 * The token is stored under 'sg_token' and managed by AuthContext.
 */
const store = {
  get: (key: string): string | null => localStorage.getItem(key),
  set: (key: string, value: string): void => { localStorage.setItem(key, value) },
  delete: (key: string): void => { localStorage.removeItem(key) },
}

export default store
