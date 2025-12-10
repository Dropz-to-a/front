const LoginIntro = () => {
  return (
    <div className="overflow-hidden text-white w-5/7">
      <div className="flex flex-col items-center justify-center w-full h-full p-12 bg-blue-500 rounded-l-3xl">
        <div className="bg-white shadow-sm rounded-2xl mb-14">
          <img src="/logo(white).svg" alt="Logo" className="w-30 h-30" />
        </div>
        <div className="flex flex-col items-center w-full gap-2 mb-10 text-center font-school-normal [word-spacing:5px]">
          <p className="mb-2 text-3xl">만나서 반가워요!</p>
          <p>당신이 누군지 궁금해요!</p>
        </div>
      </div>
    </div>
  )
}

export default LoginIntro
