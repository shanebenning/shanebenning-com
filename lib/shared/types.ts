export type RouteHandler<H = unknown> = {}

export type Route = {
  path: string
  method: string
  (params?: Record<string, string>[]): RouteHandler
}