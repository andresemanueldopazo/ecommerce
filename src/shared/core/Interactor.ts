export interface Interactor<Request, Response> {
  execute(request?: Request): Promise<Response> | Response;
}
