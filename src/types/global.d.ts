/** ==== 회사 데이터 타입 ==== */
//기업 상세세
type JobDetail = {
  id: string
  company: string
  title: string
  description?: string
  overview?: string
  responsibilities?: string[]
  requirements?: string[]
  preferred?: string[]
  benefits?: string[]
  process?: string[]
  location?: string
  employmentType?: string
  salaryNote?: string
  badges?: string[]
  dday?: number
  verified?: boolean
  hot?: boolean
  new?: boolean
  category?: string
  imageUrl?: string
  logoUrl?: string
  applyUrl?: string
  postedAt?: string
}

/** ==== Job은 JobDetail을 확장 ==== */
type Job = JobDetail & {
  salary?: string
  status?: '모집 중' | '마감됨'
  date?: string
  applicants?: number
}

/** ==== 글로벌 사용자 타입 ==== */

type User = {
  role: 'company' | 'user'
  form: {
    name: string
    email: string
    phone: string
    birth: string
    address: string
    height: string
    weight: string
    blood: string
    education: string
    military: string
    license: string
    foreignLang: string
    activity: string
    family: string
    hobby: string
    motivation: string
  }
  profile: {
    name: string
    role: string
    email: string
    phone: string
    location: string
    joinDate: string
    bio: string
    trustScore: number
    experience: {
      company: string
      role: string
      years: string
      summary: string
    }[]
    skills: string[]
    preferences: {
      jobType: string
      salary: string
      workStyle: string
      startDate: string
    }
  }
}
