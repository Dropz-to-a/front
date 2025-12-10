import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Job } from '@/pages/jobs/user/Jobs'
import Header from '@/components/Header'

export default function JobEdit() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { job?: Job } }

  const [form, setForm] = useState<Partial<Job>>(location.state?.job ?? {})
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    if (location.state?.job) {
      const existingJob = location.state.job
      setForm(existingJob)

      // D-day → 날짜 복원
      const today = new Date()
      const targetDate = new Date(today.getTime() + (existingJob.dday ?? 0) * 86400000)
      setSelectedDate(targetDate.toISOString().split('T')[0])
    } else {
      alert('잘못된 접근입니다. 공고 관리 페이지로 이동합니다.')
      navigate('/jobmanage')
    }
  }, [location.state?.job, navigate])

  //  D-day 재계산
  const calculateDday = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff >= 0 ? diff : 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (!files?.length) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, [name]: reader.result as string }))
    }
    reader.readAsDataURL(files[0])
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setSelectedDate(date)
    const ddayValue = calculateDday(date)
    setForm(prev => ({ ...prev, dday: ddayValue }))
  }

  //  수정 저장
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const stored = JSON.parse(localStorage.getItem('customJobs') || '[]')
    const updatedJobs = stored.map((job: Job) => (job.id === form.id ? { ...job, ...form } : job))
    localStorage.setItem('customJobs', JSON.stringify(updatedJobs))
    alert('공고가 수정되었습니다 ✅')
    navigate('/jobmanage')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="flex-1 w-full max-w-3xl px-4 py-10 mx-auto">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">공고 수정</h1>
        <p className="mb-8 text-gray-500">기존 공고 정보를 수정할 수 있습니다.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 회사명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">회사명 *</label>
            <input
              type="text"
              name="company"
              value={form.company || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
              readOnly
            />
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">공고 제목 *</label>
            <input
              type="text"
              name="title"
              value={form.title || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">공고 설명 *</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
            />
          </div>

          {/* 분야 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">분야</label>
            <select
              name="category"
              value={form.category || '개발'}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500">
              <option value="개발">개발</option>
              <option value="디자인">디자인</option>
              <option value="마케팅">마케팅</option>
              <option value="운영">운영</option>
              <option value="영업">영업</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 지역 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">근무 지역</label>
            <input
              type="text"
              name="location"
              value={form.location || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
            />
          </div>

          {/* 급여 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">급여/조건 참고 문구</label>
            <input
              type="text"
              name="salaryNote"
              value={form.salaryNote || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500"
            />
          </div>

          {/* 마감일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">마감일 선택</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg w-60 focus:border-indigo-500"
            />
            {selectedDate && (
              <p className="mt-1 text-sm text-gray-500">
                D-{form.dday} ({selectedDate})
              </p>
            )}
          </div>

          {/* 이미지/로고 업로드 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">공고 이미지</label>
              <input
                type="file"
                accept="image/*"
                name="imageUrl"
                onChange={handleFileChange}
                className="block w-full mt-1 text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="공고 미리보기"
                  className="object-cover w-full h-40 mt-3 border border-gray-200 rounded-lg"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">회사 로고</label>
              <input
                type="file"
                accept="image/*"
                name="logoUrl"
                onChange={handleFileChange}
                className="block w-full mt-1 text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
              {form.logoUrl && (
                <img
                  src={form.logoUrl}
                  alt="로고 미리보기"
                  className="object-contain w-24 h-24 mt-3 border border-gray-200 rounded-lg"
                />
              )}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-6 py-2 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700">
              수정 완료
            </button>
          </div>
        </form>
      </main>

      <footer className="py-6 text-sm text-center text-gray-400">
        © 2025 JOBIT — 기업용 공고 수정 페이지
      </footer>
    </div>
  )
}
