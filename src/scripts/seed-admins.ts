import config from '@payload-config'
import { getPayload } from 'payload'

// SEED_ADMINS="email:password,email:password"; existing users are left untouched.
const admins = (process.env.SEED_ADMINS ?? '')
  .split(',')
  .filter(Boolean)
  .map((entry) => {
    const [email, password] = entry.split(':')
    return { email, password }
  })

const payload = await getPayload({ config })

for (const { email, password } of admins) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    payload.logger.info(`Admin ${email} already exists`)
    continue
  }
  await payload.create({ collection: 'users', data: { email, password, role: 'admin' } })
  payload.logger.info(`Created admin ${email}`)
}

process.exit(0)
