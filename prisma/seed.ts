import bcrypt from 'bcryptjs'
import { db } from '../src/lib/db'

const STAFF_SEED = [
  {
    email: 'nishchal708@gmail.com',
    password: 'discodeewane',
    name: 'Nishchal',
    role: 'Creator',
    clanName: 'Global Farming League',
  },
  {
    email: 'admin@gfl.gg',
    password: 'GFLstaff2026!',
    name: 'GFL Admin',
    role: 'Admin',
    clanName: 'Global Farming League',
  },
]

async function main() {
  for (const s of STAFF_SEED) {
    const passwordHash = await bcrypt.hash(s.password, 10)
    await db.staffMember.upsert({
      where: { email: s.email },
      update: { passwordHash, name: s.name, role: s.role, clanName: s.clanName },
      create: {
        email: s.email,
        passwordHash,
        name: s.name,
        role: s.role,
        clanName: s.clanName,
      },
    })
    console.log(`seeded staff: ${s.email} (${s.role})`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
