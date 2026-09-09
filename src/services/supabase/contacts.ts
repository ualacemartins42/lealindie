import type { ContactPayload } from '@/types'
import { supabase } from '@/services/supabase/supabaseClient'

export type ContactSubmitStatus = 'ok' | 'rate_limited' | 'error' | 'unconfigured'

export async function submitContactMessage(
  payload: ContactPayload,
  visitorHash: string,
): Promise<ContactSubmitStatus> {
  if (!supabase) return 'unconfigured'

  const { data, error } = await supabase.rpc('submit_contact', {
    p_name: payload.name,
    p_email: payload.email,
    p_subject: payload.subject,
    p_message: payload.message,
    p_visitor_hash: visitorHash,
    p_honeypot: payload.honeypot,
    p_whatsapp: payload.whatsapp || undefined,
  })

  if (error) {
    if (error.message.toLowerCase().includes('rate limited')) {
      return 'rate_limited'
    }
    console.error('submit_contact', error.message)
    return 'error'
  }

  if (data && typeof data === 'object' && 'ok' in data) {
    return 'ok'
  }

  return 'error'
}
