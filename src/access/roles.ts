import type { Access, FieldAccess, PayloadRequest } from 'payload'

type Role = 'admin' | 'editor'

const hasRole = (req: PayloadRequest, role: Role) => req.user?.role === role

export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req, 'admin')

export const isStaff: Access = ({ req }) => Boolean(req.user)

export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req, 'admin')) return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}
