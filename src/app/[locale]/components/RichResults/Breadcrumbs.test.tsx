
import {screen, render} from '@testing-library/react'
import BreadCrumbs from './Breadcrumbs';

const mockUsePathname = jest.fn()
const locale = 'en'
const hostname = 'https://wwww.locahost:3000.com'
const fullDomain = hostname + '/' + locale

Object.defineProperty(window, 'location', {
  value: {
    get origin() {
      return hostname;
    },
  },
});


jest.mock('next/script', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return function ({ children, ...props }) {
    return (
      <script data-testid='breadCrumbs' {...props}>
        {children}
      </script>
    )
  }
})

jest.mock('next/navigation', () => ({
  usePathname() {
    return mockUsePathname()
  },
  useParams() {
  return {
    locale: locale
  }
  }
}))

interface setUpProps {
  pathName: string
}

const setUp = async ({ pathName }: setUpProps) => {
  mockUsePathname.mockImplementation(() => '/'+locale+ pathName)

  render(<BreadCrumbs />)
  return await screen.findByTestId('breadCrumbs')
}

const testCases = [
  {
    url: '',
    length: 1,
    name: ['Home']
  },
  {
    url: '/about',
    length: 2,
    name: ['Home', 'About']
  },
  {
    url: '/about/data',
    length: 3,
    name: ['Home', 'About', 'Data']
  }
]

describe('Should generate breadcrumb data for', ()=>{

  it.each(testCases)('$url', async({url, length, name})=>{
    const scriptElement = await setUp({ pathName: url })
    const config = JSON.parse(scriptElement.innerHTML)

    expect(config.itemListElement.length).toEqual(length)
    config.itemListElement.map((obj:any, index: number)=>{
      expect(obj.item.name).toEqual(name[index])
    })
  })
  
})
