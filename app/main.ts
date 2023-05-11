import { $router } from '~/lib/router'
import { $render } from '~/lib/render'

const handler = {
  error: (err: Error): Response => {
    const msg = err.message || 'Internal Server Error'
    return new Response(msg, { status: 500 })
  },
  fetch: async (req: Request): Promise<Response> => {
    const route = await $router().match(req)
    
    if (!route) {
      return new Response('Not Found.', { status: 404 })
    }

    return new Response('Ok.', { status: 200 })
  },
}

export default handler