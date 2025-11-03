import type { FC } from 'react'
import { Link } from 'react-router-dom'

const CompanyRegister: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-6xl p-12 bg-[linear-gradient(30deg,#0000ff,#c3c3e7)] shadow-lg rounded-3xl">
        {/* 헤더 */}
        <div className="flex items-center mb-10">
          <div className="flex items-center mr-14">
            {/* 로고 영역 (필요시 이미지로 교체) */}
            <img src="../../public/logo(white).svg" alt="" className="bg-white rounded-lg" />
            <span className="ml-2 text-xl italic font-bold text-white">JOBIT</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            기업-회원가입{' '}
            <span className="text-lg font-normal text-white">
              지원자 모집부터 재직자 관리까지 한 번에!
            </span>
          </h1>
        </div>

        <div className="p-10 bg-white rounded-2xl">
          {/* 입력폼 */}
          <form className="grid grid-cols-2 gap-x-10 gap-y-6">
            {/* 왼쪽 열 */}
            <div className="flex flex-col">
              <label htmlFor="companyName" className="mb-2 font-medium text-gray-700">
                회사명
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="회사명을 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="managerName" className="mb-2 font-medium text-gray-700">
                담당자 이름
              </label>
              <input
                id="managerName"
                type="text"
                placeholder="담당자 이름을 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="businessNumber" className="mb-2 font-medium text-gray-700">
                사업자등록번호
              </label>
              <input
                id="businessNumber"
                type="text"
                placeholder="사업자등록번호를 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="managerEmail" className="mb-2 font-medium text-gray-700">
                담당자 이메일
              </label>
              <input
                id="managerEmail"
                type="email"
                placeholder="담당자 이메일을 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="industry" className="mb-2 font-medium text-gray-700">
                업종
              </label>
              <input
                id="industry"
                type="text"
                placeholder="업종을 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="address" className="mb-2 font-medium text-gray-700">
                회사 주소
              </label>
              <input
                id="address"
                type="text"
                placeholder="회사 주소를 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="mb-2 font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>
          </form>

          {/* 버튼 영역 */}
          <div className="flex flex-col items-center mt-10">
            <button
              type="submit"
              className="w-1/3 py-3 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
              회원가입
            </button>
            <p className="mt-4 text-gray-600">
              계정이 있으신가요?{' '}
              <Link to="/login?type=company" className="text-blue-500 hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyRegister
