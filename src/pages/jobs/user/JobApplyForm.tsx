import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Send } from 'lucide-react'
import Header from '@/components/Header'
import { jobPostingApi, type PublicJobPosting } from '@/api/jobPostingApi'
import { profileApi } from '@/api/ProfileApi'
import { applicationApi } from '@/api/applicationApi'
import type { Job } from './Jobs'

// API 응답을 Job 타입으로 변환
const convertToJob = (posting: PublicJobPosting): Job => {
  return {
    id: String(posting.postingId),
    company: posting.companyName,
    title: posting.title,
    description: '',
    location: posting.locationText,
    salaryNote:
      posting.salaryMin > 0 || posting.salaryMax > 0
        ? `${posting.salaryMin > 0 ? posting.salaryMin.toLocaleString() : '협의'} ~ ${
            posting.salaryMax > 0 ? posting.salaryMax.toLocaleString() : '협의'
          }만원`
        : undefined,
    status: '모집 중',
    category: '기타',
    applyUrl: `/jobs/${posting.postingId}`,
  }
}

const ApplyFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    birth: '',
    address: '',
    height: '',
    weight: '',
    blood: '',
    education: '',
    military: '',
    license: '',
    foreignLang: '',
    activity: '',
    family: '',
    hobby: '',
    motivation: '',
  })

  const loadJob = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await jobPostingApi.getPublicList()
      const foundPosting = data.find(p => String(p.postingId) === id)

      if (foundPosting) {
        const convertedJob = convertToJob(foundPosting)
        setJob(convertedJob)
      }
    } catch (e: unknown) {
      console.error('[JobApplyForm] 공고 조회 실패:', e)
    } finally {
      setLoading(false)
    }
  }, [id])

  // 프로필 정보 로드 (온보딩 데이터)
  const loadProfile = useCallback(async () => {
    try {
      const profile = await profileApi.getMyProfile()
      if (profile) {
        // 주소와 상세주소를 합쳐서 표시
        const fullAddress = [profile.address, profile.detailAddress]
          .filter(Boolean)
          .join(' ')
          .trim()

        setForm(prev => ({
          ...prev,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          birth: profile.birth || '',
          address: fullAddress || '',
        }))
      }
    } catch (e) {
      console.error('[JobApplyForm] 프로필 로드 실패:', e)
      // 프로필 로드 실패 시 localStorage에서 기본 정보 가져오기 (fallback)
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
      if (currentUser) {
        setForm(prev => ({
          ...prev,
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
        }))
      }
    }
  }, [])

  useEffect(() => {
    loadJob()
    loadProfile()
  }, [loadJob, loadProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!id) return

    try {
      await applicationApi.create({
        postingId: Number(id),
        name: form.name,
        email: form.email,
        phone: form.phone,
        birth: form.birth,
        address: form.address,
        height: form.height || undefined,
        weight: form.weight || undefined,
        blood: form.blood || undefined,
        education: form.education || undefined,
        military: form.military || undefined,
        license: form.license || undefined,
        foreignLang: form.foreignLang || undefined,
        activity: form.activity || undefined,
        family: form.family || undefined,
        hobby: form.hobby || undefined,
        motivation: form.motivation,
      })

      navigate(`/jobs/${id}/completed`)
    } catch (e: unknown) {
      const error = e as { message?: string }
      alert(error?.message ?? '지원 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 bg-gray-50">
        <p className="text-lg">공고 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 bg-gray-50">
        <p className="text-lg">존재하지 않는 공고입니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
          이전 페이지로
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50">
      <Header />

      <div className="w-full max-w-4xl px-6 mx-auto mt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-600 transition hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">이전 페이지로</span>
        </button>
      </div>

      <main className="flex flex-col items-center flex-1 px-6 py-6">
        <div className="w-full max-w-4xl p-8 bg-white border border-gray-300 shadow-lg rounded-2xl">
          <div className="flex items-center gap-4 mb-8">
            {job.logoUrl && (
              <img
                src={job.logoUrl}
                alt={job.company}
                className="object-contain border rounded-lg w-14 h-14"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{job.company}</h2>
              <p className="text-sm text-gray-500">{job.title}</p>
            </div>
          </div>

          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
            <FileText className="w-5 h-5 text-blue-600" />
            이력서 작성
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">기본 정보</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  disabled
                  className="input"
                  placeholder="성명"
                />
                <input
                  name="birth"
                  value={form.birth}
                  onChange={handleChange}
                  placeholder="생년월일 (예: 2005-03-12)"
                  className="input"
                />
                <input
                  name="phone"
                  value={form.phone}
                  disabled
                  className="input"
                  placeholder="연락처"
                />
                <input
                  name="email"
                  value={form.email}
                  disabled
                  className="input"
                  placeholder="이메일"
                />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="주소"
                  className="col-span-2 input"
                />
              </div>
            </section>

            {/* 신체 사항 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">신체사항</h4>
              <div className="grid grid-cols-3 gap-4">
                <input
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  placeholder="신장 (cm)"
                  className="input"
                />
                <input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="체중 (kg)"
                  className="input"
                />
                <input
                  name="blood"
                  value={form.blood}
                  onChange={handleChange}
                  placeholder="혈액형"
                  className="input"
                />
              </div>
            </section>

            {/* 학력 및 병역 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">학력 및 병역</h4>
              <textarea
                name="education"
                value={form.education}
                onChange={handleChange}
                placeholder="학력 및 병역 사항을 입력하세요"
                className="textarea"
              />
            </section>

            {/* 자격증 및 외국어 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">자격증 및 외국어</h4>
              <textarea
                name="license"
                value={form.license}
                onChange={handleChange}
                placeholder="보유 자격증, 공인 점수, 어학능력 등"
                className="textarea"
              />
            </section>

            {/* 연수 및 활동 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">연수 및 봉사활동</h4>
              <textarea
                name="activity"
                value={form.activity}
                onChange={handleChange}
                placeholder="연수, 봉사활동, 프로젝트, 수상내역 등을 입력하세요"
                className="textarea"
              />
            </section>

            {/* 지원 동기 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">지원 동기</h4>
              <textarea
                name="motivation"
                value={form.motivation}
                onChange={handleChange}
                placeholder="지원 동기 및 포부를 작성하세요"
                required
                className="textarea"
              />
            </section>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                <Send className="w-5 h-5" />
                제출하기
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-sm text-center text-gray-400">
        © 2025 JOBIT — All rights reserved.
      </footer>
    </div>
  )
}

export default ApplyFormPage
