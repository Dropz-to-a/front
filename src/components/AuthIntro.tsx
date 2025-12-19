import { useLocation } from 'react-router'

type LoginIntroProps = {
  img: string
  title: string
  description: string
}

const LoginIntro = ({ img, title, description }: LoginIntroProps) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') || 'personal'
  const isLogin = location.pathname === '/login'

  return (
    <div className="overflow-hidden text-white w-5/7">
      <div className="flex flex-col items-center justify-center w-full h-full p-12 bg-blue-500 rounded-l-3xl">
        <div className="rounded-2xl mb-14">
          <img src={img} alt="Logo" className="w-30 h-30" />
        </div>
      </div>
      <div
        className={`relative flex flex-col items-center justify-center w-full h-full p-12
        ${!isLogin && type === 'company' ? 'bg-gray-900' : 'bg-blue-500'} rounded-l-3xl`}>
        {!isLogin && (
          <div
            className={`absolute right-0 top-0 flex ${
              type === 'company' ? 'bg-blue-500' : 'bg-gray-900'
            } w-28 h-10 rounded-bl-2xl`}>
            <p className="m-auto text-lg font-semibold">
              {type === 'company' ? '기업 회원' : '개인 회원'}
            </p>
          </div>
        )}

        <div className="bg-white shadow-md rounded-2xl mb-14">
          <img
            src={img}
            alt="Logo"
            className={`w-30 h-30 ${!isLogin && type === 'company' ? 'grayscale' : ''}`}
          />
        </div>

        <div className="flex flex-col items-center w-full gap-2 mb-10 text-center font-school-normal [word-spacing:5px]">
          <p className="mb-2 text-3xl">{title}</p>
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default LoginIntro
