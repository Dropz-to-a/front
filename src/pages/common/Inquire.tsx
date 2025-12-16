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
      {/* 배너 */}
      <section className="w-full pb-10 pt-18 bg-gradient-to-b from-blue-500 to-blue-100">
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
      <section className="w-full">
        <h2 className="my-10 text-3xl font-bold text-center">자주 묻는 질문</h2>
        <div>
          {/* 질문 리스트 */}
          <div>
            {QAList.map((qa, index) => (
              <div key={index} className="w-3/5 mx-auto mb-6">
                <h3 className="mb-2 text-xl font-semibold">{qa.question}</h3>
                <p className="text-gray-600">{qa.answer}</p>
              </div>
            ))}
          </div>
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

export default Inquire
