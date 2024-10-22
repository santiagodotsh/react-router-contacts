import { useEffect } from 'react'
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit
} from 'react-router-dom'
import {
  createContact,
  getContacts,
  type Contact
} from '../contacts'

export async function loader({ request }: { request: Request }): Promise<{ contacts: Contact[], q: string | null }> {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  const contacts = await getContacts(q ?? undefined)

  return { contacts, q }
}

export async function action(): Promise<Response> {
  const contact = await createContact()
  
  return redirect(`/contacts/${contact.id}/edit`)
}

export function Root() {
  const { contacts, q } = useLoaderData() as { contacts: Contact[], q: string | null }
  const navigation = useNavigation()
  const submit = useSubmit()

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    const input = document.getElementById('q')

    if (input instanceof HTMLInputElement) {
      input.value = q!
    }
  }, [q])
  
  return (
    <>
      <div id='sidebar'>
        <h1>React Router Contacts</h1>

        <div>
          <form id='search-form' role='search'>
            <input
              id='q'
              aria-label='Search contacts'
              placeholder='Search'
              type='search'
              name='q'
              defaultValue={q!}
              className={searching ? 'loading' : ''}
              onChange={(event) => {
                const isFirstSearch = q == null

                submit(event.currentTarget.form, { replace: !isFirstSearch })
              }}
            />

            <div
              id='search-spinner'
              aria-hidden
              hidden={!searching}
            />

            <div
              className='sr-only'
              aria-live='polite'
            ></div>
          </form>

          <Form method='post'>
            <button type='submit'>
              New
            </button>
          </Form>
        </div>

        <nav>
          {contacts.length
            ? (
                <ul>
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <NavLink
                        to={`contacts/${contact.id}`}
                        className={({ isActive, isPending }) =>
                          isActive
                            ? 'active'
                            : isPending
                            ? 'pending'
                            : ''
                        }
                      >
                        <Link to={`contacts/${contact.id}`}>
                          {contact.first || contact.last
                            ? (
                                <>
                                  {contact.first} {contact.last}
                                </>
                              )
                            : (
                                <i>No Name</i>
                              )
                          }{' '}

                          {contact.favorite && <span>★</span>}
                        </Link>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )
            : (
                <p>
                  <i>No contacts</i>
                </p>
              )
          }
        </nav>
      </div>

      <div id='detail' className={navigation.state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  )
}
