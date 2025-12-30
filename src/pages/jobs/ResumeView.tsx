import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import Header from '@/components/Header'
import { jobPostingApi, type PublicJobPosting } from '@/api/jobPostingApi'
import { applicationApi, type CompanyApplicationDetail } from '@/api/applicationApi'
import type { Job } from '@/pages/jobs/user/Jobs'

// API 응답을 Job 타입으로 변환
const convertToJob = (posting: PublicJobPosting): Job => {
  return {
    id: String(posting.postingId),
    company: posting.companyName,
    title: posting.title,
    description: '',
    location: posting.locationText,
    salaryNote: posting.salaryMin > 0 || posting.salaryMax > 0
      ? `${posting.salaryMin > 0 ? posting.salaryMin.toLocaleString() : '협의'} ~ ${posting.salaryMax > 0 ? posting.salaryMax.toLocaleString() : '협의'}만원`
      : undefined,
    status: '모집 중',
    category: '기타',
    applyUrl: `/jobs/${posting.postingId}`,
  }
}

// 학력 정보 포맷팅
const formatEducation = (app: CompanyApplicationDetail): string => {
  const parts: string[] = []
  
  if (app.middleSchoolName) {
    const grad = app.middleSchoolGraduated ? '졸업' : '재학'
    parts.push(`${app.middleSchoolName} ${grad}`)
  }
  
  if (app.highSchoolName) {
    const major = app.highSchoolMajor ? ` (${app.highSchoolMajor})` : ''
    const grad = app.highSchoolGraduated ? '졸업' : '재학'
    parts.push(`${app.highSchoolName}${major} ${grad}`)
  }
  
  if (app.universityName) {
    const major = app.universityMajor ? ` (${app.universityMajor})` : ''
    const grad = app.universityGraduated ? '졸업' : '재학'
    parts.push(`${app.universityName}${major} ${grad}`)
  }
  
  return parts.length > 0 ? parts.join(', ') : '학력 정보 없음'
}

// 병역 정보 포맷팅
const formatMilitary = (app: CompanyApplicationDetail): string => {
  if (!app.militaryStatus || app.militaryStatus === '면제' || app.militaryStatus === '해당 없음') {
    return app.militaryExemptReason || '해당 없음'
  }
  
  if (app.militaryStatus === '군필') {
    const parts: string[] = []
    if (app.militaryBranch) parts.push(app.militaryBranch)
    if (app.militaryType) parts.push(app.militaryType)
    if (app.militaryRank) parts.push(app.militaryRank)
    return parts.length > 0 ? parts.join(' ') : '군필'
  }
  
  return app.militaryStatus
}

// 자격증 정보 포맷팅
const formatLicenses = (app: CompanyApplicationDetail): string => {
  const licenses: string[] = []
  
  if (app.licenseType1) {
    const level = app.licenseLevel1 ? ` ${app.licenseLevel1}` : ''
    licenses.push(`${app.licenseType1}${level}`)
  }
  if (app.licenseType2) {
    const level = app.licenseLevel2 ? ` ${app.licenseLevel2}` : ''
    licenses.push(`${app.licenseType2}${level}`)
  }
  if (app.licenseType3) {
    const level = app.licenseLevel3 ? ` ${app.licenseLevel3}` : ''
    licenses.push(`${app.licenseType3}${level}`)
  }
  
  return licenses.length > 0 ? licenses.join(', ') : '자격증 정보 없음'
}

// 외국어 정보 포맷팅
const formatForeignLang = (app: CompanyApplicationDetail): string => {
  const langs: string[] = []
  
  if (app.foreignLangAbility1) {
    const test = app.foreignLangTest1 ? ` (${app.foreignLangTest1}` : ''
    const score = app.foreignLangScore1 ? ` ${app.foreignLangScore1}` : ''
    const closing = test ? ')' : ''
    langs.push(`${app.foreignLangAbility1}${test}${score}${closing}`)
  }
  if (app.foreignLangAbility2) {
    const test = app.foreignLangTest2 ? ` (${app.foreignLangTest2}` : ''
    const score = app.foreignLangScore2 ? ` ${app.foreignLangScore2}` : ''
    const closing = test ? ')' : ''
    langs.push(`${app.foreignLangAbility2}${test}${score}${closing}`)
  }
  
  return langs.length > 0 ? langs.join(', ') : '외국어 정보 없음'
}

// 가족 정보 포맷팅
const formatFamily = (app: CompanyApplicationDetail): string => {
  const family: string[] = []
  
  if (app.familyRelation1 && app.familyName1) {
    family.push(`${app.familyRelation1} ${app.familyName1}`)
  }
  if (app.familyRelation2 && app.familyName2) {
    family.push(`${app.familyRelation2} ${app.familyName2}`)
  }
  if (app.familyRelation3 && app.familyName3) {
    family.push(`${app.familyRelation3} ${app.familyName3}`)
  }
  if (app.familyRelation4 && app.familyName4) {
    family.push(`${app.familyRelation4} ${app.familyName4}`)
  }
  
  return family.length > 0 ? family.join(', ') : '가족 정보 없음'
}

const ResumeViewPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [application, setApplication] = useState<CompanyApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const resumeRef = useRef<HTMLDivElement>(null)

  const loadData = useCallback(async () => {
    if (!id) {
      setLoading(false)
      setError('지원서 ID가 없습니다.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // applicationId로 지원서 상세 조회
      const applicationId = Number(id)
      const appDetail = await applicationApi.getCompanyApplicationDetail(applicationId)
      setApplication(appDetail)
      
      // postingId로 공고 정보 조회
      const postingData = await jobPostingApi.getPublicList()
      const foundPosting = postingData.find(p => p.postingId === appDetail.postingId)
      
      if (foundPosting) {
        const convertedJob = convertToJob(foundPosting)
        setJob(convertedJob)
      }
    } catch (e: unknown) {
      console.error('[ResumeView] 데이터 조회 실패:', e)
      const error = e as { message?: string }
      setError(error?.message ?? '지원서 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

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
    if (!element || !application) return

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

    pdf.save(`${application.name}_이력서.pdf`)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500">지원서 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-lg text-gray-600">{error || '지원서를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            이전 페이지로
          </button>
        </div>
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
                  <b>이름:</b> {application.name}
                </p>
                <p>
                  <b>연락처:</b> {application.phone || '-'}
                </p>
                <p>
                  <b>이메일:</b> {application.email || '-'}
                </p>
                <p className="col-span-2">
                  <b>주소:</b> {application.address || '-'}
                </p>
              </div>
            </section>

            {(application.height || application.weight || application.blood) && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">신체사항</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {application.height && (
                    <p>
                      <b>신장:</b> {application.height} cm
                    </p>
                  )}
                  {application.weight && (
                    <p>
                      <b>체중:</b> {application.weight} kg
                    </p>
                  )}
                  {application.blood && (
                    <p>
                      <b>혈액형:</b> {application.blood}형
                    </p>
                  )}
                </div>
              </section>
            )}

            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">학력 및 병역</h4>
              <p className="mb-2">{formatEducation(application)}</p>
              <p>{formatMilitary(application)}</p>
            </section>

            <section>
              <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">자격증 및 외국어</h4>
              <p>
                {formatLicenses(application)}
                <br />
                {formatForeignLang(application)}
              </p>
            </section>

            {application.activities && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">연수 및 봉사활동</h4>
                <p>{application.activities}</p>
              </section>
            )}

            {application.introduction && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">자기소개</h4>
                <p>{application.introduction}</p>
              </section>
            )}

            {application.motivation && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">지원 동기</h4>
                <p>{application.motivation}</p>
              </section>
            )}

            {application.personality && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">성격의 장단점</h4>
                <p>{application.personality}</p>
              </section>
            )}

            {application.futureGoal && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">포부</h4>
                <p>{application.futureGoal}</p>
              </section>
            )}

            {application.hobby && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">취미</h4>
                <p>{application.hobby}</p>
              </section>
            )}

            {application.specialty && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">특기</h4>
                <p>{application.specialty}</p>
              </section>
            )}

            {formatFamily(application) !== '가족 정보 없음' && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">가족사항</h4>
                <p>{formatFamily(application)}</p>
              </section>
            )}

            {application.portfolioUrl && (
              <section>
                <h4 className="pb-1 mb-2 font-semibold text-gray-800 border-b">포트폴리오</h4>
                <p>
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    {application.portfolioUrl}
                  </a>
                </p>
              </section>
            )}
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
