export function hasPermission(permissionCodes: string[], code: string): boolean {
  return permissionCodes.includes(code)
}

export function hasAnyPermission(permissionCodes: string[], codes: string[]): boolean {
  return codes.some((code) => permissionCodes.includes(code))
}
