export class PermissionSlugAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`permission with slug ${slug} already exists`);
    this.name = 'PermissionSlugAlreadyExistsError';
  }
}
