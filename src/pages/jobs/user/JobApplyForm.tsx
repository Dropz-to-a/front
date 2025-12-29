import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Send } from 'lucide-react'
import Header from '@/components/Header'
import { jobPostingApi, type PublicJobPosting } from '@/api/jobPostingApi'
import { profileApi } from '@/api/ProfileApi'
import { applicationApi } from '@/api/applicationApi'
import { getUsernameFromToken } from '@/utils/jwt'
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
  const [profileLoaded, setProfileLoaded] = useState(false) // 프로필 로드 성공 여부

  const [form, setForm] = useState({
    // 기본 정보 (profileApi에서 가져옴)
    name: '',
    email: '',
    phone: '',
    birth: '',
    address: '',
    profileImageUrl: '',
    // 신체 사항
    height: '',
    weight: '',
    blood: '',
    // 학력 - 중학교
    middleSchoolName: '',
    middleSchoolStartDate: '',
    middleSchoolEndDate: '',
    middleSchoolGraduated: false,
    // 학력 - 고등학교
    highSchoolName: '',
    highSchoolMajor: '',
    highSchoolStartDate: '',
    highSchoolEndDate: '',
    highSchoolGraduated: false,
    // 학력 - 대학교
    universityName: '',
    universityMajor: '',
    universityStartDate: '',
    universityEndDate: '',
    universityGraduated: false,
    // 병역
    militaryStatus: '',
    militaryBranch: '',
    militaryType: '',
    militaryRank: '',
    militaryStartDate: '',
    militaryEndDate: '',
    militaryExemptReason: '',
    // 자격증
    licenseType1: '',
    licenseLevel1: '',
    licenseDate1: '',
    licenseIssuer1: '',
    licenseType2: '',
    licenseLevel2: '',
    licenseDate2: '',
    licenseIssuer2: '',
    licenseType3: '',
    licenseLevel3: '',
    licenseDate3: '',
    licenseIssuer3: '',
    // 외국어
    foreignLangAbility1: '',
    foreignLangTest1: '',
    foreignLangScore1: '',
    foreignLangAbility2: '',
    foreignLangTest2: '',
    foreignLangScore2: '',
    // 가족 관계
    familyRelation1: '',
    familyName1: '',
    familyAge1: '',
    familyJob1: '',
    familyRelation2: '',
    familyName2: '',
    familyAge2: '',
    familyJob2: '',
    familyRelation3: '',
    familyName3: '',
    familyAge3: '',
    familyJob3: '',
    familyRelation4: '',
    familyName4: '',
    familyAge4: '',
    familyJob4: '',
    // 수상
    awardName1: '',
    awardDate1: '',
    awardIssuer1: '',
    awardName2: '',
    awardDate2: '',
    awardIssuer2: '',
    awardName3: '',
    awardDate3: '',
    awardIssuer3: '',
    // 기타
    activities: '',
    introduction: '',
    motivation: '',
    personality: '',
    futureGoal: '',
    hobby: '',
    specialty: '',
    portfolioUrl: '',
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
        setProfileLoaded(true) // 프로필 로드 성공
        return // 성공하면 종료
      }
    } catch (e) {
      console.error('[JobApplyForm] 프로필 로드 실패:', e)
      setProfileLoaded(false) // 프로필 로드 실패
    }

    // 프로필 로드 실패 시 fallback: 여러 소스에서 정보 가져오기
    let name = ''
    let email = ''
    let phone = ''
    let birth = ''
    let address = ''

    // 1. localStorage의 currentUser에서 가져오기
    try {
      const currentUserStr = localStorage.getItem('currentUser')
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr)
        name = currentUser.name || name
        email = currentUser.email || email
        phone = currentUser.phone || phone
      }
    } catch (e) {
      console.error('[JobApplyForm] currentUser 파싱 실패:', e)
    }

    // 2. localStorage의 username에서 가져오기
    if (!name) {
      const username = localStorage.getItem('username')
      if (username) {
        name = username
      }
    }

    // 3. JWT 토큰에서 직접 가져오기
    try {
      const token = localStorage.getItem('jwtToken')
      if (token && !name) {
        const username = getUsernameFromToken(token)
        if (username) {
          name = username
        }
      }
    } catch (e) {
      console.error('[JobApplyForm] JWT 디코딩 실패:', e)
    }

    // 가져온 정보로 폼 업데이트
    if (name || email || phone || birth || address) {
      setForm(prev => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
        phone: phone || prev.phone,
        birth: birth || prev.birth,
        address: address || prev.address,
      }))
    }
  }, [])

  useEffect(() => {
    loadJob()
    loadProfile()
  }, [loadJob, loadProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // 빈 문자열을 undefined로 변환하는 헬퍼 함수
  const toUndefinedIfEmpty = (value: string | undefined): string | undefined => {
    if (!value || typeof value !== 'string') return undefined
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }

  // 숫자 문자열을 숫자로 변환하는 헬퍼 함수
  const toNumberIfNotEmpty = (value: string | undefined): number | undefined => {
    if (!value || typeof value !== 'string') return undefined
    const trimmed = value.trim()
    if (trimmed === '') return undefined
    const num = Number(trimmed)
    return isNaN(num) ? undefined : num
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!id) return

    // 필수 필드 검증
    if (!form.name || !form.birth || !form.email || !form.phone || !form.address) {
      alert('기본 정보를 모두 입력해주세요.')
      return
    }

    // 요청 데이터 준비
    const requestData = {
      postingId: Number(id),
      name: form.name.trim(),
      birth: form.birth.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      profileImageUrl: toUndefinedIfEmpty(form.profileImageUrl),
      activities: toUndefinedIfEmpty(form.activities),
      introduction: toUndefinedIfEmpty(form.introduction),
      motivation: toUndefinedIfEmpty(form.motivation),
      personality: toUndefinedIfEmpty(form.personality),
      futureGoal: toUndefinedIfEmpty(form.futureGoal),
      height: toNumberIfNotEmpty(form.height),
      weight: toNumberIfNotEmpty(form.weight),
      blood: toUndefinedIfEmpty(form.blood),
      militaryStatus: toUndefinedIfEmpty(form.militaryStatus),
      militaryBranch: toUndefinedIfEmpty(form.militaryBranch),
      militaryType: toUndefinedIfEmpty(form.militaryType),
      militaryRank: toUndefinedIfEmpty(form.militaryRank),
      militaryStartDate: toUndefinedIfEmpty(form.militaryStartDate),
      militaryEndDate: toUndefinedIfEmpty(form.militaryEndDate),
      militaryExemptReason: toUndefinedIfEmpty(form.militaryExemptReason),
      middleSchoolName: toUndefinedIfEmpty(form.middleSchoolName),
      middleSchoolStartDate: toUndefinedIfEmpty(form.middleSchoolStartDate),
      middleSchoolEndDate: toUndefinedIfEmpty(form.middleSchoolEndDate),
      middleSchoolGraduated: form.middleSchoolName ? form.middleSchoolGraduated : undefined,
      highSchoolName: toUndefinedIfEmpty(form.highSchoolName),
      highSchoolMajor: toUndefinedIfEmpty(form.highSchoolMajor),
      highSchoolStartDate: toUndefinedIfEmpty(form.highSchoolStartDate),
      highSchoolEndDate: toUndefinedIfEmpty(form.highSchoolEndDate),
      highSchoolGraduated: form.highSchoolName ? form.highSchoolGraduated : undefined,
      universityName: toUndefinedIfEmpty(form.universityName),
      universityMajor: toUndefinedIfEmpty(form.universityMajor),
      universityStartDate: toUndefinedIfEmpty(form.universityStartDate),
      universityEndDate: toUndefinedIfEmpty(form.universityEndDate),
      universityGraduated: form.universityName ? form.universityGraduated : undefined,
      awardName1: toUndefinedIfEmpty(form.awardName1),
      awardDate1: toUndefinedIfEmpty(form.awardDate1),
      awardIssuer1: toUndefinedIfEmpty(form.awardIssuer1),
      awardName2: toUndefinedIfEmpty(form.awardName2),
      awardDate2: toUndefinedIfEmpty(form.awardDate2),
      awardIssuer2: toUndefinedIfEmpty(form.awardIssuer2),
      awardName3: toUndefinedIfEmpty(form.awardName3),
      awardDate3: toUndefinedIfEmpty(form.awardDate3),
      awardIssuer3: toUndefinedIfEmpty(form.awardIssuer3),
      foreignLangAbility1: toUndefinedIfEmpty(form.foreignLangAbility1),
      foreignLangTest1: toUndefinedIfEmpty(form.foreignLangTest1),
      foreignLangScore1: toUndefinedIfEmpty(form.foreignLangScore1),
      foreignLangAbility2: toUndefinedIfEmpty(form.foreignLangAbility2),
      foreignLangTest2: toUndefinedIfEmpty(form.foreignLangTest2),
      foreignLangScore2: toUndefinedIfEmpty(form.foreignLangScore2),
      familyRelation1: toUndefinedIfEmpty(form.familyRelation1),
      familyName1: toUndefinedIfEmpty(form.familyName1),
      familyAge1: toUndefinedIfEmpty(form.familyAge1),
      familyJob1: toUndefinedIfEmpty(form.familyJob1),
      familyRelation2: toUndefinedIfEmpty(form.familyRelation2),
      familyName2: toUndefinedIfEmpty(form.familyName2),
      familyAge2: toUndefinedIfEmpty(form.familyAge2),
      familyJob2: toUndefinedIfEmpty(form.familyJob2),
      familyRelation3: toUndefinedIfEmpty(form.familyRelation3),
      familyName3: toUndefinedIfEmpty(form.familyName3),
      familyAge3: toUndefinedIfEmpty(form.familyAge3),
      familyJob3: toUndefinedIfEmpty(form.familyJob3),
      familyRelation4: toUndefinedIfEmpty(form.familyRelation4),
      familyName4: toUndefinedIfEmpty(form.familyName4),
      familyAge4: toUndefinedIfEmpty(form.familyAge4),
      familyJob4: toUndefinedIfEmpty(form.familyJob4),
      licenseType1: toUndefinedIfEmpty(form.licenseType1),
      licenseLevel1: toUndefinedIfEmpty(form.licenseLevel1),
      licenseDate1: toUndefinedIfEmpty(form.licenseDate1),
      licenseIssuer1: toUndefinedIfEmpty(form.licenseIssuer1),
      licenseType2: toUndefinedIfEmpty(form.licenseType2),
      licenseLevel2: toUndefinedIfEmpty(form.licenseLevel2),
      licenseDate2: toUndefinedIfEmpty(form.licenseDate2),
      licenseIssuer2: toUndefinedIfEmpty(form.licenseIssuer2),
      licenseType3: toUndefinedIfEmpty(form.licenseType3),
      licenseLevel3: toUndefinedIfEmpty(form.licenseLevel3),
      licenseDate3: toUndefinedIfEmpty(form.licenseDate3),
      licenseIssuer3: toUndefinedIfEmpty(form.licenseIssuer3),
      hobby: toUndefinedIfEmpty(form.hobby),
      specialty: toUndefinedIfEmpty(form.specialty),
      portfolioUrl: toUndefinedIfEmpty(form.portfolioUrl),
    }

    // undefined 값 제거 (서버가 null을 기대할 수도 있지만, 일반적으로 undefined는 제외됨)
    const cleanedData = Object.fromEntries(
      Object.entries(requestData).filter(([_, value]) => value !== undefined)
    ) as typeof requestData

    console.log('[JobApplyForm] 제출 데이터:', cleanedData)

    try {
      await applicationApi.create(cleanedData)
      navigate(`/jobs/${id}/completed`)
    } catch (e: unknown) {
      const error = e as { message?: string; status?: number }
      console.error('[JobApplyForm] 제출 실패:', error)
      alert(error?.message ?? `지원 중 오류가 발생했습니다. (${error?.status ?? '알 수 없음'})`)
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
              {!profileLoaded && (
                <p className="mb-2 text-sm text-amber-600">
                  프로필 정보를 불러올 수 없습니다. 직접 입력해주세요.
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={profileLoaded}
                  className="input"
                  placeholder="성명"
                  required
                />
                <input
                  name="birth"
                  value={form.birth}
                  onChange={handleChange}
                  disabled={profileLoaded}
                  type="date"
                  className="input"
                  placeholder="생년월일"
                  required
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={profileLoaded}
                  className="input"
                  placeholder="연락처"
                  required
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={profileLoaded}
                  type="email"
                  className="input"
                  placeholder="이메일"
                  required
                />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={profileLoaded}
                  className="col-span-2 input"
                  placeholder="주소"
                  required
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
                  placeholder="혈액형 (예: O)"
                  className="input"
                />
              </div>
            </section>

            {/* 학력 - 중학교 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">중학교</h4>
              <div className="space-y-4">
                <input
                  name="middleSchoolName"
                  value={form.middleSchoolName}
                  onChange={handleChange}
                  placeholder="학교명"
                  className="input"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="middleSchoolStartDate"
                    value={form.middleSchoolStartDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="입학일"
                    className="input"
                  />
                  <input
                    name="middleSchoolEndDate"
                    value={form.middleSchoolEndDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="졸업일"
                    className="input"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    name="middleSchoolGraduated"
                    type="checkbox"
                    checked={form.middleSchoolGraduated}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">졸업</span>
                </label>
              </div>
            </section>

            {/* 학력 - 고등학교 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">고등학교</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="highSchoolName"
                    value={form.highSchoolName}
                    onChange={handleChange}
                    placeholder="학교명"
                    className="input"
                  />
                  <input
                    name="highSchoolMajor"
                    value={form.highSchoolMajor}
                    onChange={handleChange}
                    placeholder="전공 (해당 시)"
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="highSchoolStartDate"
                    value={form.highSchoolStartDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="입학일"
                    className="input"
                  />
                  <input
                    name="highSchoolEndDate"
                    value={form.highSchoolEndDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="졸업일"
                    className="input"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    name="highSchoolGraduated"
                    type="checkbox"
                    checked={form.highSchoolGraduated}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">졸업</span>
                </label>
              </div>
            </section>

            {/* 학력 - 대학교 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">대학교</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="universityName"
                    value={form.universityName}
                    onChange={handleChange}
                    placeholder="학교명"
                    className="input"
                  />
                  <input
                    name="universityMajor"
                    value={form.universityMajor}
                    onChange={handleChange}
                    placeholder="전공"
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="universityStartDate"
                    value={form.universityStartDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="입학일"
                    className="input"
                  />
                  <input
                    name="universityEndDate"
                    value={form.universityEndDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="졸업일"
                    className="input"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    name="universityGraduated"
                    type="checkbox"
                    checked={form.universityGraduated}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">졸업</span>
                </label>
              </div>
            </section>

            {/* 병역 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">병역</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="militaryStatus"
                    value={form.militaryStatus}
                    onChange={handleChange}
                    placeholder="병역 상태 (예: 군필, 미필, 면제)"
                    className="input"
                  />
                  <input
                    name="militaryBranch"
                    value={form.militaryBranch}
                    onChange={handleChange}
                    placeholder="군종 (예: 육군, 해군, 공군)"
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="militaryType"
                    value={form.militaryType}
                    onChange={handleChange}
                    placeholder="복무 형태 (예: 현역, 예비역)"
                    className="input"
                  />
                  <input
                    name="militaryRank"
                    value={form.militaryRank}
                    onChange={handleChange}
                    placeholder="계급 (예: 병장)"
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="militaryStartDate"
                    value={form.militaryStartDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="복무 시작일"
                    className="input"
                  />
                  <input
                    name="militaryEndDate"
                    value={form.militaryEndDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="복무 종료일"
                    className="input"
                  />
                </div>
                <input
                  name="militaryExemptReason"
                  value={form.militaryExemptReason}
                  onChange={handleChange}
                  placeholder="면제 사유 (해당 없음)"
                  className="input"
                />
              </div>
            </section>

            {/* 자격증 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">자격증</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="grid grid-cols-4 gap-4">
                    <input
                      name={`licenseType${num}`}
                      value={form[`licenseType${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`자격증명 ${num}`}
                      className="input"
                    />
                    <input
                      name={`licenseLevel${num}`}
                      value={form[`licenseLevel${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`등급 ${num}`}
                      className="input"
                    />
                    <input
                      name={`licenseDate${num}`}
                      value={form[`licenseDate${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      type="date"
                      placeholder={`취득일 ${num}`}
                      className="input"
                    />
                    <input
                      name={`licenseIssuer${num}`}
                      value={form[`licenseIssuer${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`발급기관 ${num}`}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 외국어 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">외국어</h4>
              <div className="space-y-4">
                {[1, 2].map((num) => (
                  <div key={num} className="grid grid-cols-3 gap-4">
                    <input
                      name={`foreignLangAbility${num}`}
                      value={form[`foreignLangAbility${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`외국어 능력 ${num} (예: 비즈니스 회화)`}
                      className="input"
                    />
                    <input
                      name={`foreignLangTest${num}`}
                      value={form[`foreignLangTest${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`시험명 ${num} (예: TOEIC)`}
                      className="input"
                    />
                    <input
                      name={`foreignLangScore${num}`}
                      value={form[`foreignLangScore${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`점수 ${num} (예: 850)`}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 가족 관계 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">가족 관계</h4>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="grid grid-cols-4 gap-4">
                    <input
                      name={`familyRelation${num}`}
                      value={form[`familyRelation${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`관계 ${num} (예: 부)`}
                      className="input"
                    />
                    <input
                      name={`familyName${num}`}
                      value={form[`familyName${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`성명 ${num}`}
                      className="input"
                    />
                    <input
                      name={`familyAge${num}`}
                      value={form[`familyAge${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`나이 ${num}`}
                      className="input"
                    />
                    <input
                      name={`familyJob${num}`}
                      value={form[`familyJob${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`직업 ${num}`}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 수상 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">수상</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="grid grid-cols-3 gap-4">
                    <input
                      name={`awardName${num}`}
                      value={form[`awardName${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`수상명 ${num}`}
                      className="input"
                    />
                    <input
                      name={`awardDate${num}`}
                      value={form[`awardDate${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      type="date"
                      placeholder={`수상일 ${num}`}
                      className="input"
                    />
                    <input
                      name={`awardIssuer${num}`}
                      value={form[`awardIssuer${num}` as keyof typeof form] as string}
                      onChange={handleChange}
                      placeholder={`수여기관 ${num}`}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 자기소개 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">자기소개</h4>
              <textarea
                name="introduction"
                value={form.introduction}
                onChange={handleChange}
                placeholder="자기소개를 작성하세요"
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
                placeholder="지원 동기를 작성하세요"
                className="textarea"
              />
            </section>

            {/* 성격의 장단점 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">성격의 장단점</h4>
              <textarea
                name="personality"
                value={form.personality}
                onChange={handleChange}
                placeholder="성격의 장단점을 작성하세요"
                className="textarea"
              />
            </section>

            {/* 포부 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">포부</h4>
              <textarea
                name="futureGoal"
                value={form.futureGoal}
                onChange={handleChange}
                placeholder="포부를 작성하세요"
                className="textarea"
              />
            </section>

            {/* 기타 */}
            <section>
              <h4 className="pb-1 mb-2 font-semibold border-b">기타</h4>
              <div className="space-y-4">
                <textarea
                  name="activities"
                  value={form.activities}
                  onChange={handleChange}
                  placeholder="연수, 봉사활동, 프로젝트 등을 입력하세요"
                  className="textarea"
                />
                <input
                  name="hobby"
                  value={form.hobby}
                  onChange={handleChange}
                  placeholder="취미"
                  className="input"
                />
                <input
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  placeholder="특기"
                  className="input"
                />
                <input
                  name="portfolioUrl"
                  value={form.portfolioUrl}
                  onChange={handleChange}
                  type="url"
                  placeholder="포트폴리오 URL (예: https://github.com/example)"
                  className="input"
                />
              </div>
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
