import { useState, type FormEvent } from 'react'
import { submitContactMessage } from '@/services/supabase/contacts'

interface ContactFormState {
  name: string
  email: string
  subject: string
  whatsapp: string
  message: string
  company: string
}

const initialState: ContactFormState = {
  name: '',
  email: '',
  subject: '',
  whatsapp: '',
  message: '',
  company: '',
}

export function useContactForm() {
  const [values, setValues] = useState<ContactFormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  function update<K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K],
  ): void {
    setValues((current) => ({ ...current, [key]: value }))
    setFeedback(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      const status = await submitContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        whatsapp: values.whatsapp.trim(),
        message: values.message.trim(),
        honeypot: values.company,
      })

      if (status === 'ok') {
        setValues(initialState)
        setFeedback({
          type: 'success',
          text: 'Recado enviado com sucesso!',
        })
        return
      }

      if (status === 'unconfigured') {
        setFeedback({
          type: 'error',
          text: 'O envio ainda não está ligado. Confira as variáveis do Supabase e recarregue a página.',
        })
        return
      }

      setFeedback({
        type: 'error',
        text: 'Não foi possível enviar o recado. Tente novamente em instantes.',
      })
    } catch {
      setFeedback({
        type: 'error',
        text: 'Não foi possível enviar o recado. Tente novamente em instantes.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return { values, update, submitting, feedback, onSubmit }
}
