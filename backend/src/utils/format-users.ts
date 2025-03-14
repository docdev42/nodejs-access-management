export function formatUsers(users: any[]) {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    approved: user.approved,
    permissions: user.permissions.map((p) => ({
      id: p.id,
      name: p.permission.name,
      expiresAt: p.expiresAt,
      isRevoked: p.isRevoked,
    })),
  }));
}
