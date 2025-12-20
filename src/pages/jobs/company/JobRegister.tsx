// src/pages/JobRegister.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { jobPostingApi, type CreateJobPostingRequest } from '@/api/jobPostingApi'

export default function JobRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateJobPostingRequest & { description: string }>({
    title: '',
    description: '',
    employmentType: 'FULL_TIME',
    locationText: '',
    salaryMin: 0,
    salaryMax: 0,
  })

  // ✅ 입력 변경
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    if (name === 'salaryMin' || name === 'salaryMax') {
      setForm(prev => ({ ...prev, [name]: Number(value) || 0 }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // ✅ 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title || !form.description) {
      alert('제목과 설명은 필수 입력 항목입니다.')
      return
    }

    try {
      setLoading(true)
      await jobPostingApi.create({
        title: form.title,
        description: form.description,
        employmentType: form.employmentType,
        locationText: form.locationText,
        salaryMin: form.salaryMin,
        salaryMax: form.salaryMax,
      })
      alert('채용공고가 등록되었습니다 ✅')
      navigate('/jobmanage')
    } catch (e: any) {
      alert(e?.message ?? '공고 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="flex-1 w-full max-w-3xl px-4 py-10 mx-auto">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">채용공고 등록</h1>
        <p className="mb-8 text-gray-500">기업 전용 공고 등록 페이지입니다.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 공고 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">공고 제목 *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
              placeholder="예: 프론트엔드 개발자 채용"
              required
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">공고 설명 *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
              placeholder="담당 업무, 자격 요건 등을 자세히 작성해주세요."
              required
            />
          </div>

          {/* 고용형태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">고용형태 *</label>
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500">
              <option value="FULL_TIME">정규직</option>
              <option value="PART_TIME">파트타임</option>
              <option value="CONTRACT">계약직</option>
              <option value="INTERN">인턴</option>
            </select>
          </div>

          {/* 지역 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">근무 지역</label>
            <input
              type="text"
              name="locationText"
              value={form.locationText}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
              placeholder="예: 서울특별시 강남구"
            />
          </div>

          {/* 급여 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">최소 급여 (만원)</label>
              <input
                type="number"
                name="salaryMin"
                value={form.salaryMin || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
                placeholder="예: 3000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">최대 급여 (만원)</label>
              <input
                type="number"
                name="salaryMax"
                value={form.salaryMax || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
                placeholder="예: 5000"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </main>

      <footer className="py-6 text-sm text-center text-gray-400">
        © 2025 JOBIT — 기업용 채용공고 등록
      </footer>
    </div>
  )
}
