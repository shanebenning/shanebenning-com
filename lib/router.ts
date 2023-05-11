import type { Route } from "~/types"

const resolve = async (path: string) => {
  const pathParts = path.split('/')
  const filename = pathParts[pathParts.length - 1]

  try {
    const mod = (await import(`../app/routes/${filename}`)).default
    return mod
  } catch (err) {
    // console.error('file not found', err)
    return null
  }
}

const parseSearchParams = (input: string | URLSearchParams) => {
  const searchParams = new URLSearchParams(input)
  const params: Record<string, string> = {}
  for (const [key, value] of searchParams.entries()) {
    params[key] = value
  }
  return params
}

export const $router = (options = {}) => {
  return {
    redirect: () => {},
    match: async (req: Request): Promise<Route | null> => {
      const { pathname, searchParams } = new URL(req.url)
      const path = pathname === '/' ? 'index' : pathname

      let route: Route | null = null
      let routeParams = null;

      // check if route url is valid
      // then see if it has a handlers
      // if both method and handler are valid
      // return the route
      
      try {
         routeParams = parseSearchParams(searchParams)

        // TODO: validate other HTTP Methods
        // ! For now, only return "GET" method
        if (req.method !== 'GET') {
          throw new Error('method not allowed.')
        }
        
        /**
         * ? Shouldn't this always return a function? 
         * ? Might be a redundant check...
         * */ 
        const file = await resolve(path) // get file matching path
        if (!file) return null
        if (file && typeof file === 'function') {
          // should be able to assign to route as 'handler' if called
          let component = file(routeParams)
        }

        route = {} as Route
      } catch (err) {
        // TODO: handle error
        console.error('[router] err |', err)
      }

      return route
    },
  }
}
