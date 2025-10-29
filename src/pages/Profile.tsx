// import React, { useState } from 'react';
import {
  User, Briefcase,  Calendar, MapPin, Phone, Mail,
  Edit, Shield, TrendingUp,  Clock, 
  BookOpen,Wallet, 
} from 'lucide-react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Profile = () => {
  // const [activeTab, setActiveTab] = useState('overview');

  // 사용자 데이터
  const userProfile = {
    name: '이지은',
    role: '구직자',
    avatar: null,
    email: 'jieun.lee@example.com',
    phone: '010-5678-1234',
    location: '서울시 마포구',
    joinDate: '2024-03-15',
    trustScore: 95,
    bio: '5년 경력의 마케팅 전문가입니다. 브랜드 전략, 디지털 캠페인 기획, 콘텐츠 마케팅을 중심으로 다양한 산업의 프로젝트를 성공적으로 수행했습니다.',
    skills: [
      '브랜드 기획',
      '디지털 마케팅',
      '콘텐츠 전략',
      'SNS 광고 운영',
      '데이터 분석',
      '카피라이팅'
    ],
    preferences: {
      jobType: '정규직',
      minSalary: 3500000,
      maxSalary: 5000000,
      workStyle: '오피스 근무',
      startDate: '즉시 가능'
    }
  };


  const experiences = [
    {
      company: 'ABC 마케팅 에이전시',
      position: '브랜드 전략 매니저',
      period: '2022.03 - 현재',
      achievements: [
        '브랜드 캠페인 기획 및 실행 (ROAS 320%)',
        '5개 주요 파트너사 콘텐츠 마케팅 총괄',
        '신규 클라이언트 온보딩 프로세스 개선',
      ],
    },
    {
      company: 'XYZ 미디어랩',
      position: '디지털 마케팅 담당',
      period: '2019.01 - 2022.02',
      achievements: [
        'SNS 광고 퍼포먼스 최적화 및 KPI 달성',
        '구글 애널리틱스 기반 데이터 분석 리포트 제작',
        '협력업체와 공동 캠페인 진행 (월간 예산 3천만원 규모)',
      ],
    },
    {
      company: '스타트업 HUB',
      position: '마케팅 인턴',
      period: '2018.06 - 2018.12',
      achievements: [
        'SNS 콘텐츠 제작 및 게시물 기획 지원',
        '브랜드 인지도 향상 캠페인 참여',
      ],
    },
  ];



  const stats = [
    { label: '진행 캠페인 수', value: '15건', icon: Briefcase, color: 'blue' },
    { label: '평균 성과 지표', value: 'ROAS 320%', icon: TrendingUp, color: 'green' },
    { label: '총 경력', value: '5년 3개월', icon: Clock, color: 'purple' },
    { label: '신뢰도', value: `${userProfile.trustScore}점`, icon: Shield, color: 'orange' }
  ];


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Profile Avatar Overlapping Header */}
      <div className="max-w-7xl mx-auto px-4 mt-3 relative">
        <div className="bg-white rounded-3xl shadow-md  p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-42 h-42 rounded-full bg-amber-50 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                {userProfile.name[0]}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">{userProfile.name}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                      <User className="w-3.5 h-3.5" />
                      {userProfile.role}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-100 to-yellow-100 px-3 py-1.5 rounded-full text-xs font-bold text-orange-800">
                      <Shield className="w-3.5 h-3.5" />
                      신뢰도 {userProfile.trustScore}점
                    </span>
                  </div>
                </div>
                <Link to="/Profilleedit" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md text-sm">
                  <Edit className="w-3.5 h-3.5" />
                  프로필 수정
                </Link>
              </div>

              <p className="text-gray-600 mt-3 leading-relaxed text-base">{userProfile.bio}</p>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {[
                  { icon: Mail, value: userProfile.email },
                  { icon: Phone, value: userProfile.phone },
                  { icon: MapPin, value: userProfile.location },
                  { icon: Calendar, value: `가입일: ${userProfile.joinDate}` }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2.5 rounded-xl text-sm">
                    <item.icon className="w-4 h-4 text-blue-600" />
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  보유 기술
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {userProfile.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <TrendingUp className={`w-3.5 h-3.5 text-${stat.color}-500`} />
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-0.5">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-1.5">
            <Briefcase className="w-6 h-6 text-blue-600" />
            주요 경력
          </h3>

          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-gray-800 text-base">{exp.position}</h4>
                  <span className="text-xs text-gray-500">{exp.period}</span>
                </div>
                <p className="text-sm font-medium text-blue-700">{exp.company}</p>
                <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                  {exp.achievements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>


        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-1.5">
            <Wallet className="w-6 h-6 text-green-600" />
            희망 근무 조건
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 반복문으로도 바꿀 수 있음 */}
            ...
          </div>
        </div>
      </div>
    </div>

  );
};

export default Profile;