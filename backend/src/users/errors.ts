export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`email ${email} already exists`);
    this.name = 'EmailAlreadyExistsError';
  }
}
