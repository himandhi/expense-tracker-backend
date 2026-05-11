// An Enum is a set of named constants.
// Instead of using strings like 'user' or 'admin' everywhere
// (which can have typos), we use an enum.
// Role.USER is always 'user', Role.ADMIN is always 'admin'.

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
