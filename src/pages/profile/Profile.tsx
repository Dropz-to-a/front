import { useState } from 'react'
import {
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Camera,
  BookOpen,
  Calendar,
  Wallet,
} from 'lucide-react'
import Header from '@/components/Header'

export default function ProfileUnified() {
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    name: '이지은',
    role: '구직자',
    email: 'jieun.lee@example.com',
    phone: '010-5678-1234',
    location: '서울시 마포구',
    joinDate: '2024-03-15',
    bio: '안녕하세요! 5년 차 마케팅 전문가 이지은입니다. 브랜드 전략과 디지털 캠페인을 중심으로 소비자와 소통하며, 데이터를 기반으로 한 마케팅 성과 향상을 이끌어왔습니다.',
    trustScore: 95,
    experience: [
      {
        company: 'ABC 마케팅 에이전시',
        role: '브랜드 전략 매니저',
        years: '2022.03 - 현재',

        summary:
          '대형 클라이언트 브랜드 캠페인 15건 이상 성공적으로 수행. KPI 평균 달성률 120% 이상 유지.',
      },
      {
        company: 'XYZ 미디어랩',
        role: '디지털 마케팅 담당',
        years: '2019.01 - 2022.02',
        summary: 'SNS 퍼포먼스 캠페인 기획 및 운영, ROAS 320% 달성.',
      },
    ],
    skills: ['브랜드 기획', '디지털 마케팅', '콘텐츠 전략', 'SNS 광고 운영'],
    preferences: {
      jobType: '정규직',
      salary: '4,200만 원 이상',
      workStyle: '오피스 근무',
      startDate: '즉시 가능',
    },
  })

  const [newSkill, setNewSkill] = useState('')

  const handleChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value })
  }

  const handlePreferenceChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      preferences: { ...profile.preferences, [field]: value },
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (s: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(x => x !== s) })
  }

  // const handleSave = () => {
  //   alert('변경사항이 저장되었습니다!');
  //   setIsEditing(false);
  // };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />

      {/* ===== 프로필 상단 카드 ===== */}
      <div className="max-w-6xl px-6 py-10 mx-auto">
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-3xl">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            {/* 아바타 */}
            <div className="relative">
              <div className="flex items-center justify-center w-40 h-40 text-5xl font-bold text-white rounded-full shadow-md bg-gradient-to-tr from-indigo-500 to-sky-400">
                {profile.name[0]}
              </div>
              {isEditing && (
                <button className="absolute p-2 text-white bg-indigo-600 rounded-full shadow bottom-3 right-3 hover:bg-indigo-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between">
                <div>
                  <h1 className="mb-1 text-3xl font-bold text-gray-800">{profile.name}</h1>
                  <p className="text-sm text-gray-600">역할: {profile.role}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                    isEditing
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}>
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  {isEditing ? '저장하기' : '프로필 수정'}
                </button>
              </div>

              {/* 자기소개 */}
              <div className="mt-3">
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={e => handleChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-[15px]">{profile.bio}</p>
                )}
              </div>

              {/* 연락처 및 지역 */}
              <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2">
                {[
                  { icon: Mail, label: '이메일', key: 'email', value: profile.email },
                  { icon: Phone, label: '연락처', key: 'phone', value: profile.phone },

                  {
                    icon: MapPin,
                    label: '지역',
                    key: 'location',
                    value: profile.location,
                  },
                  {
                    icon: Calendar,
                    label: '가입일',
                    key: 'joinDate',
                    value: profile.joinDate,
                  },
                ].map(({ icon: Icon, label, key, value }) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-3 text-sm text-gray-700 bg-gray-50 rounded-xl">
                    <Icon className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">{label}:</span>
                    {isEditing && key !== 'joinDate' ? (
                      <input
                        value={value}
                        onChange={e => handleChange(key, e.target.value)}
                        className="flex-1 text-right bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <span className="flex-1 text-right">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 본문 ===== */}
      <div className="max-w-6xl px-6 pb-12 mx-auto space-y-8">
        {/* 경력 요약 */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-3xl">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
            <Briefcase className="w-5 h-5 text-indigo-500" /> 주요 경력
          </h2>
          <div className="space-y-4">
            {profile.experience.map((exp, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{exp.role}</h3>
                  <span className="text-xs text-gray-500">{exp.years}</span>
                </div>
                <p className="mb-1 text-sm text-gray-600">{exp.company}</p>
                <p className="text-sm leading-relaxed text-gray-700">{exp.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 스킬 */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-3xl">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
            <BookOpen className="w-5 h-5 text-indigo-500" /> 보유 기술
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                {s}
                {isEditing && (
                  <button
                    onClick={() => removeSkill(s)}
                    className="p-1 rounded-full hover:bg-indigo-200">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex gap-2 mt-1">
                <input
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="새로운 기술 입력"
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={addSkill}
                  className="px-3 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  추가
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 희망 근무 조건 */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-3xl">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
            <Wallet className="w-5 h-5 text-green-600" /> 희망 근무 조건
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            {Object.entries(profile.preferences).map(([key, value]) => {
              const labels: Record<string, string> = {
                jobType: '고용 형태',
                salary: '희망 연봉',
                workStyle: '근무 형태',
                startDate: '시작 가능일',
              }
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">{labels[key]}</span>
                  {isEditing ? (
                    <input
                      value={value}
                      onChange={e => handlePreferenceChange(key, e.target.value)}
                      className="text-right bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{value}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
