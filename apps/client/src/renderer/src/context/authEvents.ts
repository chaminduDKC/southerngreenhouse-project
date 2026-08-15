type LogoutHandler = () => void

let logoutHandler: LogoutHandler | null = null

export const registerLogoutHandler = (handler: LogoutHandler) => {
  logoutHandler = handler
}

export const triggerLogout = () => {
  logoutHandler?.()
}