import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Search } from 'lucide-react'

import { FormInput } from '@/components/FormInput'

type SearchValue = {
  keyword: string
}

const Inquire = () => {
  const { handleSubmit, register: keyword /* getValues */ } = useForm<SearchValue>({
    mode: 'onChange',
  })

  return (
    <div>
      <Header />
      <section className="w-full py-20 bg-gradient-to-b from-blue-500 to-blue-100">
        <h1 className="mb-12 font-bold text-center text-white text-7xl">WHAT THE FAQS</h1>
        <p className="mb-12 text-lg text-center text-white">
          JOBIT은 모든 기업과 연결되어있지 않지만, 매우 많은 기업과 연결되어있습니다.
          <br />
          가장 많이 받는 질문들의 답변을 FAQ에서 찾아보세요.
        </p>

        {/* 검색바 */}
        <form onSubmit={handleSubmit(() => {})} className="relative w-2/5 mx-auto">
          <Search className="absolute text-gray-300 top-[1.2rem] left-[0.7rem]" />
          <FormInput
            className="pl-10"
            label=""
            name="keyword"
            placeholder="궁금한 내용을 검색해보세요."
            type="text"
            value={keyword}
            error={undefined}
          />
        </form>
      </section>
    </div>
  )
}

export default Inquire
