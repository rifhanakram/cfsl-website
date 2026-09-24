'use client'

import { CheckCircle2Icon } from 'lucide-react'
import { useActionState, useState, type ReactNode } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FieldMode } from '@/lib/events'
import { needsGuardian, type FieldModes } from '@/lib/registration/rules'
import { submitRegistration, type RegistrationState } from '@/lib/registration/submit'
import { cn } from '@/lib/utils'

import { Turnstile } from './turnstile'

export type SectionOption = { id: string; name: string; description: string; spotsLeft: number }

type Props = {
  eventId: number
  sections: SectionOption[]
  modes: FieldModes
  startDate: string
  siteKey: string
}

const initialState: RegistrationState = { status: 'idle', attempt: 0 }

export function RegistrationForm(props: Props) {
  const [formKey, setFormKey] = useState(0)
  return <Form key={formKey} {...props} onReset={() => setFormKey((k) => k + 1)} />
}

function Form({ eventId, sections, modes, startDate, siteKey, onReset }: Props & { onReset: () => void }) {
  const [state, action, pending] = useActionState(submitRegistration.bind(null, eventId), initialState)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const values = state.values ?? {}
  const errors = state.fieldErrors ?? {}
  const guardian = modes.dateOfBirth !== 'hidden' && needsGuardian(dateOfBirth || values.dateOfBirth, startDate)

  if (state.status === 'success') {
    return (
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Registration received</AlertTitle>
        <AlertDescription>
          <p>{state.message} Please complete payment using the instructions above.</p>
          <Button variant="outline" className="mt-3" onClick={onReset}>
            Register another player
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const field = (
    name: string,
    label: string,
    mode: FieldMode | 'required',
    input: (props: { id: string; name: string; required: boolean; 'aria-invalid'?: boolean; 'aria-describedby'?: string; defaultValue?: string }) => ReactNode,
    hint?: string,
  ) => {
    if (mode === 'hidden') return null
    const error = errors[name]?.[0]
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name}>
          {label}
          {mode === 'optional' && <span className="font-normal text-muted-foreground">(optional)</span>}
        </Label>
        {input({
          id: name,
          name,
          required: mode === 'required',
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? `${name}-error` : hint ? `${name}-hint` : undefined,
          defaultValue: values[name],
        })}
        {hint && !error && (
          <p id={`${name}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${name}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <form action={action} className="space-y-8" noValidate={false}>
      {state.status === 'error' && state.message && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Registration not submitted</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <fieldset className="space-y-3">
        <legend className="mb-2 font-semibold">Section</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {sections.map((section) => {
            const full = section.spotsLeft <= 0
            return (
              <label
                key={section.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5',
                  full && 'cursor-not-allowed opacity-60',
                )}
              >
                <input
                  type="radio"
                  name="sectionId"
                  value={section.id}
                  required
                  disabled={full}
                  defaultChecked={values.sectionId === section.id}
                  className="mt-1 accent-primary"
                />
                <span className="space-y-0.5">
                  <span className="block font-medium">{section.name}</span>
                  {section.description && <span className="block text-sm text-muted-foreground">{section.description}</span>}
                  <span className={cn('block text-xs', full ? 'font-medium text-destructive' : 'text-muted-foreground')}>
                    {full ? 'Full' : `${section.spotsLeft} ${section.spotsLeft === 1 ? 'place' : 'places'} left`}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
        {errors.sectionId?.[0] && <p className="text-sm text-destructive">{errors.sectionId[0]}</p>}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-semibold">Player</legend>
        {field('lastName', 'Last name', 'required', (p) => <Input {...p} autoComplete="family-name" maxLength={100} />)}
        {field('otherNames', 'Other names', 'required', (p) => <Input {...p} autoComplete="given-name" maxLength={150} />)}
        {field(
          'fideId',
          'FIDE ID',
          'optional',
          (p) => <Input {...p} inputMode="numeric" pattern="\d{1,10}" maxLength={10} />,
          "Leave blank if you don't have one yet.",
        )}
        {field('rating', 'Rating', modes.rating, (p) => <Input {...p} type="number" min={0} max={3500} inputMode="numeric" />, 'Your current FIDE rating, if any.')}
        {field('dateOfBirth', 'Date of birth', modes.dateOfBirth, (p) => (
          <Input {...p} type="date" max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDateOfBirth(e.target.value)} />
        ))}
        {modes.sex !== 'hidden' && (
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-medium">
              Sex {modes.sex === 'optional' && <span className="font-normal text-muted-foreground">(optional)</span>}
            </legend>
            <div className="flex gap-4 pt-1.5">
              {[
                { value: 'm', label: 'Male' },
                { value: 'w', label: 'Female' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sex"
                    value={option.value}
                    required={modes.sex === 'required'}
                    defaultChecked={values.sex === option.value}
                    className="accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.sex?.[0] && <p className="text-sm text-destructive">{errors.sex[0]}</p>}
          </fieldset>
        )}
        {field('schoolOrClub', 'School or club', modes.schoolOrClub, (p) => <Input {...p} maxLength={150} />)}
        {field('coach', 'Coach', modes.coach, (p) => <Input {...p} maxLength={150} />)}
      </fieldset>

      {(modes.email !== 'hidden' || modes.phone !== 'hidden') && (
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-semibold">Contact</legend>
          {field('phone', 'Phone / WhatsApp', modes.phone, (p) => <Input {...p} type="tel" autoComplete="tel" maxLength={20} />)}
          {field('email', 'Email', modes.email, (p) => <Input {...p} type="email" autoComplete="email" maxLength={254} />)}
        </fieldset>
      )}

      {guardian && (
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-semibold">Parent or guardian</legend>
          <p className="text-sm text-muted-foreground sm:col-span-2">
            Required because the player is under 18 on the first day of the event.
          </p>
          {field('guardianName', 'Guardian name', 'required', (p) => <Input {...p} maxLength={150} />)}
          {field('guardianContact', 'Guardian phone or email', 'required', (p) => <Input {...p} maxLength={150} />)}
        </fieldset>
      )}

      <div className="space-y-4">
        <Turnstile key={state.attempt} siteKey={siteKey} />
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? 'Submitting…' : 'Submit registration'}
        </Button>
      </div>
    </form>
  )
}
