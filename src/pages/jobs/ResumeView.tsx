import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import Header from '@/components/Header'
import { JOBS_DATA } from '@/pages/jobs/user/Jobs'

const DUMMY_APPLICATION = {
  name: '박지우',
  email: 'jiwoo@example.com',
  phone: '010-1234-5678',
  birth: '2005-03-12',
  address: '경상북도 의성군 봉양면...',
  height: '172',
  weight: '60',
  blood: 'A형',
  education: '경북소프트고등학교 재학 중 (소프트웨어개발과)',
  military: '해당 없음',
  license: '정보처리기능사, GTQ 1급',
  foreignLang: '영어 회화 가능 (TOEIC 780)',
  activity: "AI 프로젝트 'Jobit' 참여, 교내 해커톤 2위",
  family: '부모님, 여동생 1명',
  hobby: 'UI 디자인, 음악 감상',
  motivation:
    '끊임없이 배우며 성장하는 개발자가 되고 싶습니다. 새로운 기술을 빠르게 습득하고, 팀 프로젝트에서 협업을 통해 문제를 해결하는 과정에서 큰 보람을 느낍니다.',
}

const ResumeViewPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const job = JOBS_DATA.find(j => j.id === id)
  const resumeRef = useRef<HTMLDivElement>(null)

  /** ✅ 색상 oklch → 안전한 rgb로 변환 */
  const sanitizeColors = () => {
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el)
      const element = el as HTMLElement

      if (style.backgroundColor.includes('oklch')) {
        element.style.backgroundColor = '#ffffff'
      }
      if (style.color.includes('oklch')) {
        element.style.color = '#000000'
      }
      if (style.borderColor.includes('oklch')) {
        element.style.borderColor = '#dddddd'
      }
    })
  }

  /** ✅ PDF 저장 함수 (개선 + 안전) */
  const handleDownloadPDF = async () => {
    const element = resumeRef.current
    if (!element) return

    // ⚡ 캡처 전에 색상 안전화
    sanitizeColors()

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${DUMMY_APPLICATION.name}_이력서.pdf`)
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
        <div
          ref={resumeRef}
          className="w-full max-w-4xl p-8 bg-white border border-gray-300 shadow-lg rounded-2xl">
          {/* 회사 정보 */}
          <div className="flex items-center gap-4 mb-8">
            {job?.logoUrl && (
              <img
                src={job.logoUrl}
                alt={job.company}
                className="object-contain border rounded-lg w-14 h-14"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{job?.company || '회사명'}</h2>

              <p className="text-sm text-gray-500">{job?.title || '지원한 공고'}</p>
            </div>
          </div>

          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold"></h3>

          <div className="space-y-6 text-[15px] leading-relaxed">
            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">기본 정보</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <b>이름:</b> {DUMMY_APPLICATION.name}
                </p>
                <p>
                  <b>생년월일:</b> {DUMMY_APPLICATION.birth}
                </p>
                <p>
                  <b>연락처:</b> {DUMMY_APPLICATION.phone}
                </p>
                <p>
                  <b>이메일:</b> {DUMMY_APPLICATION.email}
                </p>
                <p className="col-span-2">
                  <b>주소:</b> {DUMMY_APPLICATION.address}
                </p>
              </div>
            </section>

            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">신체사항</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <p>
                  <b>신장:</b> {DUMMY_APPLICATION.height} cm
                </p>
                <p>
                  <b>체중:</b> {DUMMY_APPLICATION.weight} kg
                </p>
                <p>
                  <b>혈액형:</b> {DUMMY_APPLICATION.blood}
                </p>
              </div>
            </section>

            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">학력 및 병역</h4>
              <p>{DUMMY_APPLICATION.education}</p>
            </section>

            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">자격증 및 외국어</h4>
              <p>
                {DUMMY_APPLICATION.license}
                <br />
                {DUMMY_APPLICATION.foreignLang}
              </p>
            </section>

            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">연수 및 봉사활동</h4>
              <p>{DUMMY_APPLICATION.activity}</p>
            </section>

            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">지원 동기</h4>
              <p>{DUMMY_APPLICATION.motivation}</p>
            </section>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 mt-6 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
          <Download className="w-5 h-5" />
          PDF로 저장하기
        </button>
      </main>

      <footer className="py-6 text-sm text-center text-gray-400">
        © 2025 JOBIT — All rights reserved.
      </footer>
    </div>
  )
}

export default ResumeViewPage
