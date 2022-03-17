export class InteractorError extends Error {
  constructor(public readonly message: string) {
    super();
  }
}
