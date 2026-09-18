import type { ContactPayload } from '@/types'
import { supabase } from '@/services/supabase/supabaseClient'

export type ContactSubmitStatus = 'ok' | 'error' | 'unconfigured'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = '47fcf40b-09a3-4f72-933a-d69ce694a786'

async function sendContactEmail(payload: ContactPayload): Promise<boolean> {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Novo recado do site Leal Indie: ${payload.subject}`,
      from_name: payload.name,
      name: payload.name,
      email: payload.email,
      whatsapp: payload.whatsapp,
      message: payload.message,
    }),
  })

  const result = (await response.json()) as { success?: boolean }

  if (!response.ok || result.success !== true) {
    console.error('web3forms submit', result)
    return false
  }

  return true
}

export async function submitContactMessage(
  payload: ContactPayload,
): Promise<ContactSubmitStatus> {
  if (!supabase) return 'unconfigured'

  if (payload.honeypot.trim().length > 0) {
    return 'ok'
  }

  const { error } = await supabase.from('messages').insert({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    whatsapp: payload.whatsapp || null,
    message: payload.message,
  })

  if (error) {
    console.error('messages insert', error.message)
    return 'error'
  }

  try {
    const emailed = await sendContactEmail(payload)
    if (!emailed) return 'error'
  } catch (err) {
    console.error('web3forms submit', err)
    return 'error'
  }

  return 'ok'
}
