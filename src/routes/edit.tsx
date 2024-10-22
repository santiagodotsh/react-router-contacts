import {
  Form,
  redirect,
  useLoaderData,
  type Params
} from 'react-router-dom'
import { updateContact, type Contact } from '../contacts'

export async function action({ request, params }: { request: Request, params: Params<string> }) {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)

  await updateContact(params.contactId as string, updates)

  return redirect(`/contacts/${params.contactId}`)
}

export function EditContact() {
  const { contact } = useLoaderData() as { contact: Contact }

  return (
    <Form method='post' id='contact-form'>
      <p>
        <span>Name</span>

        <input
          placeholder='First'
          aria-label='First name'
          type='text'
          name='first'
          defaultValue={contact?.first}
        />

        <input
          placeholder='Last'
          aria-label='Last name'
          type='text'
          name='last'
          defaultValue={contact?.last}
        />
      </p>

      <label>
        <span>Twitter</span>

        <input
          type='text'
          name='twitter'
          placeholder='@jack'
          defaultValue={contact?.twitter}
        />
      </label>

      <label>
        <span>Avatar URL</span>

        <input
          placeholder='https://example.com/avatar.jpg'
          aria-label='Avatar URL'
          type='text'
          name='avatar'
          defaultValue={contact?.avatar}
        />
      </label>

      <label>
        <span>Notes</span>

        <textarea
          name='notes'
          defaultValue={contact?.notes}
          rows={6}
        />
      </label>

      <p>
        <button type='submit'>
          Save
        </button>

        <button type='button'>
          Cancel
        </button>
      </p>
    </Form>
  )
}