import { useForm } from 'react-hook-form'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import Header from '@/components/Header'
import { FormInput } from '@/components/FormInput'

type SearchValue = {
  keyword: string
}

const Contact = () => {
  const { handleSubmit, register: keyword /* getValues */ } = useForm<SearchValue>({
    mode: 'onChange',
  })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQA = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <div>
      <Header />
      {/* 배너 */}
      <section className="w-full pb-10 pt-18 bg-gradient-to-b from-blue-500 to-blue-200">
        <h1 className="mb-10 font-bold text-center text-white text-8xl">WHAT THE FAQS</h1>
        <p className="mb-8 text-lg leading-8 text-center text-white">
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

        <p className="text-center text-white">
          좀 더 진지한 상담이 필요하신가요? 저희에게 연락해주세요.
        </p>
      </section>

      {/* 질문 */}
      <section className="w-full mb-10">
        <h2 className="my-10 text-3xl font-bold text-center">자주 묻는 질문</h2>
        {/* 질문 리스트 */}
        <div className="flex flex-col items-center gap-4">
          {QAList.map((qa, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                onClick={() => toggleQA(index)}
                className={`
          w-3/5 px-8 py-6 rounded-2xl cursor-pointer
          transition-all duration-300
          border border-gray-300
          ${
            isOpen
              ? 'bg-blue-50 border-blue-400 shadow-md'
              : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-400 hover:bg-gray-50'
          }
        `}>
                {/* 질문 */}
                <h3 className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span className="leading-relaxed">{qa.question}</span>

                  <span
                    className={`
              transition-transform duration-300
              ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}
            `}>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </h3>

                {/* 답변 */}
                <div
                  className={`
            overflow-hidden
            transition-all
            duration-500
            ease-in-out
            ${isOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}
          `}>
                  <div className="pt-4 border-gray-300 border-t-1">
                    <p className="leading-7 text-gray-600">{qa.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

const QAList = [
  {
    question: '채용 공고는 어떻게 올리나요?',
    answer: '기업 회원으로 가입한 후, 대시보드에서 채용 공고를 작성할 수 있습니다.',
  },
  {
    question: '지원한 공고의 상태는 어디서 확인하나요?',
    answer: '마이 페이지에서 지원한 공고의 상태를 실시간으로 확인할 수 있습니다.',
  },
  {
    question: '회사에 지원하고 싶은데 어떻게 하나요?',
    answer: '회원 가입 후, 관심 있는 채용 공고에 지원서를 제출하면 됩니다.',
  },
  {
    question: '관심 있는 공고를 저장할 수 있나요?',
    answer: '네, 북마크 기능을 사용하면 관심 있는 채용 공고를 나중에 다시 확인할 수 있습니다.',
  },
]

export default Contact
