import { useEffect, useState, useCallback } from 'react'
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
  Cake,
  ShieldCheck,
  Languages,
  Plus,
  Trash2,
} from 'lucide-react'
import Header from '@/components/Header'

import { profileApi, type Activity } from '@/api/ProfileApi'

export default function ProfileUnified() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [originalProfile, setOriginalProfile] = useState<typeof profile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null)
  const [isAddingActivity, setIsAddingActivity] = useState(false)

  const [profile, setProfile] = useState<{
    name: string
    role: string
    email: string
    phone: string
    birth: string
    address: string
    detailAddress: string
    licenses: string[]
    foreignLangs: string[]
    motivation: string
    skills: string[]
    preferences: {
      jobType: string
      salary: string
      workStyle: string
      startDate: string
    }
  }>({
    // 초기값
    name: '',
    role: '',
    email: '',
    phone: '',
    birth: '',
    address: '',
    detailAddress: '',
    skills: [],
    licenses: [],
    foreignLangs: [],
    motivation: '',
    preferences: {
      jobType: '정규직',
      salary: '4,200만 원 이상',
      workStyle: '오피스 근무',
      startDate: '즉시 가능',
    },
  })

  const fetchProfile = useCallback(async () => {
    try {
      const data = await profileApi.getMyProfile()
      console.log('프로필 응답:', data)

      setProfile(prev => {
        const updatedProfile = {
          ...prev,
          name: data.name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          birth: data.birth ?? '',
          address: data.address ?? '',
          detailAddress: data.detailAddress ?? '',
          skills: data.skills ?? [],
          foreignLangs: data.foreignLangs ?? [],
          licenses: data.licenses ?? [],
          motivation: data.motivation ?? '',
        }
        setOriginalProfile(updatedProfile)
        return updatedProfile
      })
    } catch (e) {
      console.error('프로필 조회 실패', e)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const [newSkill, setNewSkill] = useState('')
  const [newlicenses, setNewlicenses] = useState('')
  const [newforeignLangs, setNewforeignLangs] = useState('')

  // 경력 추가 폼 상태
  const [newActivity, setNewActivity] = useState({
    userPosition: '',
    companyName: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  // 경력 수정 폼 상태
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const handleChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value })
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

  const addlicenses = () => {
    if (newlicenses.trim() && !profile.licenses.includes(newlicenses.trim())) {
      setProfile({ ...profile, licenses: [...profile.licenses, newlicenses.trim()] })
      setNewlicenses('')
    }
  }

  const removelicenses = (s: string) => {
    setProfile({ ...profile, licenses: profile.licenses.filter(x => x !== s) })
  }

  const addforeignLangs = () => {
    if (newforeignLangs.trim() && !profile.foreignLangs.includes(newforeignLangs.trim())) {
      setProfile({ ...profile, foreignLangs: [...profile.foreignLangs, newforeignLangs.trim()] })
      setNewforeignLangs('')
    }
  }

  const removeforeignLangs = (s: string) => {
    setProfile({ ...profile, foreignLangs: profile.foreignLangs.filter(x => x !== s) })
  }

  // 경력 추가
  const handleAddActivity = async () => {
    if (!newActivity.userPosition || !newActivity.companyName || !newActivity.startDate) {
      alert('직책, 회사명, 시작일은 필수 입력 항목입니다.')
      return
    }

    try {
      const created = await profileApi.createActivity({
        userPosition: newActivity.userPosition,
        companyName: newActivity.companyName,
        description: newActivity.description,
        startDate: newActivity.startDate,
        endDate: newActivity.endDate || newActivity.startDate,
      })
      setActivities(prev => [...prev, created])
      setNewActivity({
        userPosition: '',
        companyName: '',
        description: '',
        startDate: '',
        endDate: '',
      })
      setIsAddingActivity(false)
      alert('경력이 추가되었습니다!')
    } catch (e: unknown) {
      const error = e as { message?: string }
      alert(error?.message ?? '경력 추가에 실패했습니다.')
      console.error('경력 추가 실패:', e)
    }
  }

  // 경력 수정 시작
  const handleStartEditActivity = (activity: Activity) => {
    setEditingActivityId(activity.id)
    setEditingActivity({ ...activity })
  }

  // 경력 수정 저장
  const handleSaveActivity = async () => {
    if (!editingActivity) return

    if (!editingActivity.userPosition || !editingActivity.companyName || !editingActivity.startDate) {
      alert('직책, 회사명, 시작일은 필수 입력 항목입니다.')
      return
    }

    try {
      const updated = await profileApi.updateActivity(editingActivity.id, {
        userPosition: editingActivity.userPosition,
        companyName: editingActivity.companyName,
        description: editingActivity.description,
        startDate: editingActivity.startDate,
        endDate: editingActivity.endDate,
      })
      setActivities(prev => prev.map(a => (a.id === updated.id ? updated : a)))
      setEditingActivityId(null)
      setEditingActivity(null)
      alert('경력이 수정되었습니다!')
    } catch (e: unknown) {
      const error = e as { message?: string }
      alert(error?.message ?? '경력 수정에 실패했습니다.')
      console.error('경력 수정 실패:', e)
    }
  }

  // 경력 수정 취소
  const handleCancelEditActivity = () => {
    setEditingActivityId(null)
    setEditingActivity(null)
  }

  // 경력 삭제
  const handleDeleteActivity = async (activityId: number) => {
    if (!confirm('정말 이 경력을 삭제하시겠습니까?')) return

    try {
      await profileApi.deleteActivity(activityId)
      setActivities(prev => prev.filter(a => a.id !== activityId))
      alert('경력이 삭제되었습니다!')
    } catch (e: unknown) {
      const error = e as { message?: string }
      alert(error?.message ?? '경력 삭제에 실패했습니다.')
      console.error('경력 삭제 실패:', e)
    }
  }

  // 날짜 포맷팅 (YYYY-MM-DD -> YYYY.MM 형식)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}.${month}`
  }

  // 경력 기간 표시
  const formatActivityPeriod = (startDate: string, endDate: string) => {
    const start = formatDate(startDate)
    const end = endDate ? formatDate(endDate) : '현재'
    return `${start} - ${end}`
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      await profileApi.updateMyProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        birth: profile.birth,
        address: profile.address,
        detailAddress: profile.detailAddress,
        skills: profile.skills,
        licenses: profile.licenses,
        foreignLangs: profile.foreignLangs,
        motivation: profile.motivation,
      })

      // 저장 후 원본 프로필 업데이트 및 프로필 다시 불러오기
      setOriginalProfile(profile)
      setIsEditing(false)
      await fetchProfile()
      alert('변경사항이 저장되었습니다!')
    } catch (e: unknown) {
      const error = e as { message?: string }
      alert(error?.message ?? '프로필 저장에 실패했습니다.')
      console.error('프로필 저장 실패:', e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // 원본 프로필로 복원
    if (originalProfile) {
      setProfile(originalProfile)
    }
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Header />

      {/* ===== 프로필 상단 카드 ===== */}
      <div className="max-w-6xl px-6 py-10 mx-auto">
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-3xl">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            {/* 아바타 */}
            <div className="relative">
              <div className="flex items-center justify-center w-40 h-40 text-5xl font-bold text-white rounded-full shadow-md bg-linear-to-tr from-indigo-500 to-sky-400">
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
                <div className="flex gap-2">
                  {isEditing && (
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      <X className="w-4 h-4" />
                      취소
                    </button>
                  )}
                  <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                      isEditing
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}>
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {isSaving ? '저장 중...' : isEditing ? '저장하기' : '프로필 수정'}
                  </button>
                </div>
              </div>

              {/* 자기소개 */}
              <div className="mt-3">
                {isEditing ? (
                  <textarea
                    value={profile.motivation}
                    onChange={e => handleChange('motivation', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-[15px]">{profile.motivation}</p>
                )}
              </div>

              {/* 연락처 및 지역 */}
              <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2">
                {[
                  { icon: Mail, label: '이메일', key: 'email', value: profile.email },
                  { icon: Phone, label: '연락처', key: 'phone', value: profile.phone },

                  {
                    icon: MapPin,
                    label: '주소',
                    key: 'address',
                    value: profile.address,
                  },
                  {
                    icon: Cake,
                    label: '생년월일',
                    key: 'birth',
                    value: profile.birth,
                  },
                ].map(({ icon: Icon, label, key, value }) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-3 text-sm text-gray-700 bg-gray-50 rounded-xl">
                    <Icon className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">{label}:</span>
                    {isEditing && key !== 'birth' ? (
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <Briefcase className="w-5 h-5 text-indigo-500" /> 주요 경력
            </h2>
            {isEditing && !isAddingActivity && (
              <button
                onClick={() => setIsAddingActivity(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">
                <Plus className="w-4 h-4" />
                경력 추가
              </button>
            )}
          </div>

          {/* 경력 추가 폼 */}
          {isAddingActivity && (
            <div className="p-4 mb-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <h3 className="mb-3 font-semibold text-gray-800">새 경력 추가</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="직책 *"
                    value={newActivity.userPosition}
                    onChange={e => setNewActivity({ ...newActivity, userPosition: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="회사명 *"
                    value={newActivity.companyName}
                    onChange={e => setNewActivity({ ...newActivity, companyName: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="시작일 *"
                    value={newActivity.startDate}
                    onChange={e => setNewActivity({ ...newActivity, startDate: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="date"
                    placeholder="종료일 (미입력 시 현재)"
                    value={newActivity.endDate}
                    onChange={e => setNewActivity({ ...newActivity, endDate: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="업무 내용 및 성과"
                  value={newActivity.description}
                  onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddActivity}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    추가
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingActivity(false)
                      setNewActivity({
                        userPosition: '',
                        companyName: '',
                        description: '',
                        startDate: '',
                        endDate: '',
                      })
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 경력 목록 */}
          <div className="space-y-4">
            {activities.length === 0 && !isAddingActivity ? (
              <p className="py-8 text-center text-gray-500">등록된 경력이 없습니다.</p>
            ) : (
              activities.map(activity => (
                <div key={activity.id} className="p-4 bg-gray-50 rounded-xl">
                  {editingActivityId === activity.id && editingActivity ? (
                    // 수정 모드
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="직책 *"
                          value={editingActivity.userPosition}
                          onChange={e =>
                            setEditingActivity({ ...editingActivity, userPosition: e.target.value })
                          }
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="회사명 *"
                          value={editingActivity.companyName}
                          onChange={e =>
                            setEditingActivity({ ...editingActivity, companyName: e.target.value })
                          }
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={editingActivity.startDate}
                          onChange={e =>
                            setEditingActivity({ ...editingActivity, startDate: e.target.value })
                          }
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="date"
                          value={editingActivity.endDate}
                          onChange={e =>
                            setEditingActivity({ ...editingActivity, endDate: e.target.value })
                          }
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <textarea
                        placeholder="업무 내용 및 성과"
                        value={editingActivity.description}
                        onChange={e =>
                          setEditingActivity({ ...editingActivity, description: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveActivity}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                          저장
                        </button>
                        <button
                          onClick={handleCancelEditActivity}
                          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 보기 모드
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{activity.userPosition}</h3>
                          <p className="mt-1 text-sm text-gray-600">{activity.companyName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatActivityPeriod(activity.startDate, activity.endDate)}
                          </span>
                          {isEditing && (
                            <>
                              <button
                                onClick={() => handleStartEditActivity(activity)}
                                className="p-1.5 text-gray-500 rounded hover:bg-gray-200 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="p-1.5 text-red-500 rounded hover:bg-red-50 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {activity.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
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

        {/* 자격증 */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-3xl">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
            <ShieldCheck className="w-5 h-5 text-indigo-500" /> 보유 자격증
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.licenses.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                {s}
                {isEditing && (
                  <button
                    onClick={() => removelicenses(s)}
                    className="p-1 rounded-full hover:bg-indigo-200">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex gap-2 mt-1">
                <input
                  value={newlicenses}
                  onChange={e => setNewlicenses(e.target.value)}
                  placeholder="새로운 기술 입력"
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={addlicenses}
                  className="px-3 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  추가
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 언어 */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-3xl">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
            <Languages className="w-5 h-5 text-indigo-500" /> 외국어 능력
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.foreignLangs.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                {s}
                {isEditing && (
                  <button
                    onClick={() => removeforeignLangs(s)}
                    className="p-1 rounded-full hover:bg-indigo-200">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex gap-2 mt-1">
                <input
                  value={newforeignLangs}
                  onChange={e => setNewforeignLangs(e.target.value)}
                  placeholder="새로운 외국어 입력"
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={addforeignLangs}
                  className="px-3 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  추가
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
