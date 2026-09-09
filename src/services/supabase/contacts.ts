import type { ContactPayload } from '@/types'
import { supabase } from '@/services/supabase/supabaseClient'

export type ContactSubmitStatus = 'ok' | 'error' | 'unconfigured'

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

  return 'ok'
}
