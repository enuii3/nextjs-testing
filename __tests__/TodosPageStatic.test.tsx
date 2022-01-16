import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

initTestHelpers()

const handlers = rest.get(
  // 'https://jsonplaceholder.typicode.com/todos/?_limit=10',
  'https://jsonplaceholder.typicode.com/todos/',
  (req, res, ctx) => {
    const query = req.url.searchParams
    const _limit = query.get('_limit')
    if (_limit === '10') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 3,
            id: 3,
            title: 'Static Task C',
            completed: true,
          },
          {
            userId: 4,
            id: 4,
            title: 'Static Task D',
            completed: false,
          },
        ])
      )
    }
  }
)

const server = setupServer(handlers)
beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => {
  server.close()
})

describe('Todo Page / getStaticProps', () => {
  it('Should render the list of tasks pre-fetched by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/task-page',
    })
    render(page)
    expect(screen.getByText('todos page')).toBeInTheDocument()
    expect(screen.getByText('Static Task C')).toBeInTheDocument()
    expect(screen.getByText('Static Task D')).toBeInTheDocument()
  })
})
