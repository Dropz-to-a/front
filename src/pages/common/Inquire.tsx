import Header from '@/components/Header'

const Inquire = () => {
  return (
    <div>
      <Header />
      <section className="w-full py-20 bg-gradient-to-b from-blue-500 to-blue-100">
        <h1 className="mb-6 font-bold text-center text-white text-7xl">WHAT THE FAQS</h1>
        <p className="mb-12 text-lg text-center text-white">
          JOBIT은 모든 기업과 연결되어있지 않지만, 매우 많은 기업과 연결되어있습니다.
          <br />
          가장 많이 받는 질문들의 답변을 FAQ에서 찾아보세요.
        </p>
      </section>
    </div>
  )
}

export default Inquire
