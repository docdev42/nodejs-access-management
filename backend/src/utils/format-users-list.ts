export function formatUserList(users: any[]) {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    isApproved: user.isApproved,
    permissions: user.permissions.map((p) => ({
      id: p.id,
      name: p.permission.name,
      expiresAt: p.expiresAt,
      isRevoked: p.isRevoked,
    })),
  }));
}
