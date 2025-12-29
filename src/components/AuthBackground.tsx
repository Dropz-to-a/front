type AuthBackgroundProps = {
  children: React.ReactNode
}

const AuthBackground = ({ children }: AuthBackgroundProps) => {
  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gray-200">
      <div className="z-10 flex shadow-2xl/40 w-6/9 rounded-3xl h-6/7">{children}</div>

      {/* 배경 오브젝트 */}
      <div className="absolute z-0 rotate-45 bg-purple-600 -bottom-80 -left-100 w-200 aspect-square" />
      <div className="absolute z-0 rotate-45 rounded-full bg-turquoise -top-80 -right-100 w-200 aspect-square" />
    </div>
  )
}

export default AuthBackground
