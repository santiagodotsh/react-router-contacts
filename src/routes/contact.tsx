import {
  Form,
  useFetcher,
  useLoaderData,
  type Params
} from 'react-router-dom'
import {
  getContact,
  updateContact,
  type Contact
} from '../contacts'

export async function loader({ params }: { params: Params<string> }): Promise<{ contact: Contact | null }> {
  const contact = await getContact(params.contactId as string)

  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found'
    })
  }

  return { contact }
}

export async function action({ request, params }: { request: Request, params: Params<string> }) {
  const formData = await request.formData()

  return updateContact(params.contactId!, {
    favorite: formData.get('favorite') === 'true'
  })
}

export function Contact() {
  const { contact } = useLoaderData() as { contact: Contact }

  return (
    <div id='contact'>
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || `https://robohash.org/${contact.id}.png?size=200x200`}
        />
      </div>

      <div>
        <h1>
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

          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`} target='_blank'>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action='edit'>
            <button type='submit'>
              Edit
            </button>
          </Form>

          <Form
            method='post'
            action='destroy'
            onSubmit={(event) => {
              if (
                !confirm(
                  'Please confirm you want to delete this record.'
                )
              ) {
                event.preventDefault()
              }
            }}
          >
            <button type='submit'>
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Favorite({ contact }: { contact: Contact }) {
  const fetcher = useFetcher()
  
  const favorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : contact.favorite

  return (
    <fetcher.Form method='post'>
      <button
        name='favorite'
        value={favorite ? 'false' : 'true'}
        aria-label={
          favorite
            ? 'Remove from favorites'
            : 'Add to favorites'
        }
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
