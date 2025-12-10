type LoginIntroProps = {
  img: string
  title: string
  description: string
}

const LoginIntro = ({ img, title, description }: LoginIntroProps) => {
  return (
    <div className="overflow-hidden text-white w-5/7">
      <div className="flex flex-col items-center justify-center w-full h-full p-12 bg-blue-500 rounded-l-3xl">
        <div className="bg-white shadow-sm rounded-2xl mb-14">
          <img src={img} alt="Logo" className="w-30 h-30" />
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
