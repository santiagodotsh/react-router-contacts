import { redirect, type Params } from 'react-router-dom'
import { deleteContact } from '../contacts'

export async function action({ params }: { params: Params<string> }) {
  await deleteContact(params.contactId as string)

  return redirect('/')
}
