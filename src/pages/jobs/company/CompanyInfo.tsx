/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Header from '@/components/Header'
import { FormInput } from '@/components/FormInput'
import { getCompanyInfo, updateCompanyInfo } from '@/api/auth'
import DaumPostcode from 'react-daum-postcode'
import { Building2, MapPin, Save, ArrowLeft, Sparkles, FileText } from 'lucide-react'

type CompanyInfoForm = {
  companyName: string
  businessNumber: string
  address: string
  detailAddress: string
  zonecode: string
  companyValues?: string
  mission?: string
  industry?: string
  description?: string
  website?: string
  employeeCount?: number
  foundedYear?: number
}

export default function CompanyInfo() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isPostOpen, setIsPostOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<CompanyInfoForm>({ mode: 'onChange' })

  // 기업 정보 불러오기
  useEffect(() => {
    loadCompanyInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCompanyInfo = async () => {
    try {
      setLoading(true)
      const data = await getCompanyInfo()
      reset({
        companyName: data.companyName || '',
        businessNumber: data.businessNumber || '',
        address: data.address || '',
        detailAddress: data.detailAddress || '',
        zonecode: data.zonecode || '',
        companyValues: data.companyValues || '',
        mission: data.mission || '',
        industry: data.industry || '',
        description: data.description || '',
        website: data.website || '',
        employeeCount: data.employeeCount || undefined,
        foundedYear: data.foundedYear || undefined,
      })
    } catch (e: any) {
      console.error('기업 정보 불러오기 실패:', e)
      alert(e?.response?.data?.message || '기업 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }


  // 저장 처리
  const onSubmit = async (data: CompanyInfoForm) => {
    try {
      setSaving(true)
      await updateCompanyInfo(data)
      alert('기업 정보가 수정되었습니다.')
      setIsEditing(false)
      await loadCompanyInfo()
    } catch (e: any) {
      console.error('기업 정보 수정 실패:', e)
      alert(e?.response?.data?.message || '기업 정보 수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="flex-1 w-full max-w-5xl px-4 py-10 mx-auto">
          <div className="p-10 text-center text-gray-500">기업 정보를 불러오는 중...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="flex-1 w-full max-w-5xl px-4 py-10 mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">기업 정보 관리</h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Save className="w-4 h-4" />
              수정하기
            </button>
          )}
        </div>

        {/* 정보 카드 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
            </div>

            <div className="space-y-4">
              <FormInput
                label="회사명"
                name="companyName"
                placeholder="회사명을 입력하세요"
                type="text"
                value={register}
                rules={{ required: '회사명을 입력하세요.' }}
                error={errors.companyName}
                readOnly={true}
                disabled={true}
              />

              <div>
                <FormInput
                  label="사업자등록번호"
                  name="businessNumber"
                  placeholder="888-88-88888"
                  type="text"
                  value={register}
                  format="businessNumber"
                  rules={{
                    required: '사업자등록번호를 입력하세요.',
                    validate: (v: string | number | undefined) =>
                      String(v ?? '').replace(/\D/g, '').length === 10 || '사업자등록번호는 10자리입니다.',
                  }}
                  error={errors.businessNumber}
                  readOnly={true}
                  disabled={true}
                />

                {/* 중요 정보는 수정 불가 안내 */}
                <p className="mt-2 text-xs text-gray-500">
                  ⚠️ 사업자등록번호는 수정할 수 없습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="설립연도"
                  name="foundedYear"
                  placeholder="예: 2020"
                  type="number"
                  value={register}
                  error={errors.foundedYear}
                  readOnly={!isEditing}
                />

                <FormInput
                  label="직원 수"
                  name="employeeCount"
                  placeholder="예: 50"
                  type="number"
                  value={register}
                  error={errors.employeeCount}
                  readOnly={!isEditing}
                />
              </div>

              <FormInput
                label="업종/분야"
                name="industry"
                placeholder="예: IT/소프트웨어, 제조업, 서비스업 등"
                type="text"
                value={register}
                error={errors.industry}
                readOnly={!isEditing}
              />

              <FormInput
                label="웹사이트"
                name="website"
                placeholder="https://example.com"
                type="url"
                value={register}
                error={errors.website}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* 주소 정보 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">주소 정보</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <FormInput
                    label="우편번호"
                    name="zonecode"
                    placeholder="우편번호"
                    type="text"
                    value={register}
                    rules={{ required: '우편번호를 입력하세요.' }}
                    error={errors.zonecode}
                    readOnly={!isEditing}
                  />
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsPostOpen(true)}
                    className="h-12 px-4 text-white bg-gray-700 rounded-lg mt-8 hover:bg-gray-800 transition"
                  >
                    우편번호 찾기
                  </button>
                )}
              </div>

              <FormInput
                label="주소"
                name="address"
                placeholder="주소 입력"
                type="text"
                value={register}
                rules={{ required: '주소를 입력하세요.' }}
                error={errors.address}
                readOnly={!isEditing}
              />

              <FormInput
                label="상세 주소"
                name="detailAddress"
                placeholder="상세 주소 입력"
                type="text"
                value={register}
                rules={{ required: '상세 주소를 입력하세요.' }}
                error={errors.detailAddress}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* 회사 소개 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">회사 소개</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  회사 소개 <span className="text-gray-400">(사용자에게 보여집니다)</span>
                </label>
                {isEditing ? (
                  <textarea
                    {...register('description')}
                    rows={5}
                    placeholder="회사에 대해 소개해주세요..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg whitespace-pre-wrap min-h-[120px]">
                    {watch('description') || '회사 소개를 입력해주세요.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 기업가치 및 목표 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">기업가치 및 목표</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  기업가치 <span className="text-gray-400">(사용자에게 보여집니다)</span>
                </label>
                {isEditing ? (
                  <textarea
                    {...register('companyValues')}
                    rows={3}
                    placeholder="우리 회사의 핵심 가치를 입력해주세요. 예: 혁신, 고객 중심, 투명성 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg whitespace-pre-wrap min-h-[80px]">
                    {watch('companyValues') || '기업가치를 입력해주세요.'}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  목표/미션 <span className="text-gray-400">(사용자에게 보여집니다)</span>
                </label>
                {isEditing ? (
                  <textarea
                    {...register('mission')}
                    rows={3}
                    placeholder="회사의 목표와 미션을 입력해주세요..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg whitespace-pre-wrap min-h-[80px]">
                    {watch('mission') || '목표/미션을 입력해주세요.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  loadCompanyInfo()
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    저장하기
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* 다음 주소 팝업 */}
        {isPostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-[500px] h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setIsPostOpen(false)}
                className="absolute text-gray-500 top-3 right-3 hover:text-black z-10"
              >
                ✕
              </button>
              <DaumPostcode
                style={{ width: '100%', height: '100%' }}
                onComplete={(data) => {
                  setValue('zonecode', data.zonecode)
                  setValue('address', data.address)
                  setIsPostOpen(false)
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
