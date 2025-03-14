export function formatUsers(users: any[]) {
  return users.map((user) => formatUser(user));
}

export function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    approved: user.approved,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    permissions: user.permissions.map((p) => ({
      id: p.id,
      name: p.permission.name,
      expiresAt: p.expiresAt,
      isRevoked: p.isRevoked,
    })),
  };
}
