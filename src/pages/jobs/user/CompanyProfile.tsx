import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import { getPublicCompanyInfo } from '@/api/auth'
import type { CompanyInfo } from '@/types/company'

// CompanyInfo 타입에 companyValues 필드 추가 확인
import {
  MapPin,
  Globe,
  Users,
  Calendar,
  Sparkles,
  Target,
  FileText,
  ArrowLeft,
  Briefcase,
} from 'lucide-react'

export default function CompanyProfile() {
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCompanyInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPublicCompanyInfo(companyId ? Number(companyId) : undefined)
      setCompany(data)
    } catch (e: unknown) {
      console.error('기업 정보 불러오기 실패:', e)
      const error = e as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || '기업 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanyInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

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

  if (error || !company) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="flex-1 w-full max-w-5xl px-4 py-10 mx-auto">
          <div className="p-10 text-center">
            <p className="mb-4 text-red-600">{error || '기업 정보를 찾을 수 없습니다.'}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              이전 페이지로
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="flex-1 w-full max-w-5xl px-4 py-10 mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-600 transition hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">이전 페이지로</span>
        </button>

        {/* 헤더 섹션 */}
        <div className="p-8 mb-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600">
                  {company.companyName?.[0] || '회'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{company.companyName}</h1>
                  {company.industry && (
                    <p className="mt-1 text-sm text-gray-500">{company.industry}</p>
                  )}
                </div>
              </div>

              {/* 기본 정보 그리드 */}
              {(company.foundedYear ||
                company.employeeCount ||
                company.address ||
                company.website) && (
                <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                  {company.foundedYear && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">설립: {company.foundedYear}년</span>
                    </div>
                  )}
                  {company.employeeCount && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">직원 수: {company.employeeCount}명</span>
                    </div>
                  )}
                  {(company.address || company.detailAddress) && (
                    <div className="flex items-start gap-2 text-gray-700 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-sm">
                        {company.address} {company.detailAddress}
                      </span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline">
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 회사 소개 */}
        {company.description && (
          <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">회사 소개</h2>
            </div>
            <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
              {company.description}
            </p>
          </div>
        )}

        {/* 기업가치 및 목표 */}
        {(company.companyValues || company.values || company.mission) && (
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            {(company.companyValues || company.values) && (
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">기업가치</h2>
                </div>
                <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {company.companyValues || company.values}
                </p>
              </div>
            )}

            {company.mission && (
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">목표/미션</h2>
                </div>
                <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {company.mission}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 채용 공고 링크 */}
        <div className="p-6 border border-indigo-200 bg-indigo-50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-indigo-900">
                이 회사의 채용 공고 보기
              </h3>
              <p className="text-sm text-indigo-700">현재 모집 중인 채용 공고를 확인해보세요</p>
            </div>
            <Link
              to="/jobs"
              className="flex items-center gap-2 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700">
              <Briefcase className="w-4 h-4" />
              채용 공고 보기
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
