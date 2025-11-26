import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Send } from 'lucide-react'
import Header from '@/components/Header'
import { JOBS_DATA } from './Jobs'

const ApplyFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const job = JOBS_DATA.find(j => j.id === id)

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

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      }))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, jobId: id }),
      })
      navigate(`/jobs/${id}/completed`)
    } catch {
      alert('지원 중 오류가 발생했습니다.')
    }
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 bg-gray-50">
        <p className="text-lg">존재하지 않는 공고입니다.</p>
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
