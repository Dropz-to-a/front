import { useState, ChangeEvent } from 'react';
import {
    User, Briefcase, MapPin, Phone, Mail, Camera, BookOpen,
    Save, X, Plus, DollarSign, Building, FileText,
    Calendar, Award
} from 'lucide-react';
import Header from '../components/Header';

interface Preferences {
    jobType: string;
    minSalary: number;
    maxSalary: number;
    workStyle: string;
    startDate: string;
}

interface Profile {
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    skills: string[];
    preferences: Preferences;
}

const ProfileEdit = () => {
    const [profile, setProfile] = useState<Profile>({
        name: '이지은',
        role: '구직자',
        email: 'jieun.lee@example.com',
        phone: '010-5678-1234',
        location: '서울시 마포구',
        bio: '5년 경력의 마케팅 전문가입니다. 브랜드 전략, 디지털 캠페인 기획, 콘텐츠 마케팅을 중심으로 다양한 산업의 프로젝트를 성공적으로 수행했습니다.',
        skills: ['브랜드 기획', '디지털 마케팅', '콘텐츠 전략', 'SNS 광고 운영'],
        preferences: {
            jobType: '정규직',
            minSalary: 3500000,
            maxSalary: 5000000,
            workStyle: '오피스 근무',
            startDate: '즉시 가능',
        },
    });

    const [newSkill, setNewSkill] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // ✅ 스킬 추가
    const addSkill = (): void => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
            setNewSkill('');
        }
    };

    // ✅ 스킬 삭제
    const removeSkill = (skillToRemove: string): void => {
        setProfile({
            ...profile,
            skills: profile.skills.filter((s) => s !== skillToRemove),
        });
    };

    // ✅ 일반 필드 변경
    const handleChange = (field: keyof Profile, value: string): void => {
        setProfile({ ...profile, [field]: value });
    };

    // ✅ 희망조건 변경
    const handlePreferenceChange = (field: keyof Preferences, value: string | number): void => {
        setProfile({
            ...profile,
            preferences: { ...profile.preferences, [field]: value },
        });
    };

    // ✅ 저장 처리
    const handleSave = (): void => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            {/* ✅ 메인 카드 */}
            <div className="max-w-4xl mx-auto px-4 mt-3">
                <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-8">

                    {/* 아바타 + 프로필 헤더 */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="relative mx-auto md:mx-0">
                            <div className="w-42 h-42 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                                {profile.name[0]}
                            </div>
                            <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-all">
                                <Camera className="w-4 h-4" />
                            </button>
                            <p className="text-center mt-2 text-xs text-gray-500">프로필 사진 변경</p>
                        </div>

                        {/* 이름, 역할, 이메일 등 */}
                        <div className="flex-1 mx-auto md:mx-0 max-w-[640px]">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">프로필 수정</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField icon={User} label="이름" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} />
                                <SelectField icon={Briefcase} label="역할" value={profile.role} options={['구직자', '구인자', '프리랜서']} onChange={(e) => handleChange('role', e.target.value)} />
                                <InputField icon={Mail} label="이메일" value={profile.email} onChange={(e) => handleChange('email', e.target.value)} />
                                <InputField icon={Phone} label="전화번호" value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                                <InputField icon={MapPin} label="위치" value={profile.location} onChange={(e) => handleChange('location', e.target.value)} colSpan />
                            </div>
                        </div>
                    </div>

                    {/* 자기소개 */}
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-[640px]">
                            <Label icon={FileText} text="자기소개" />
                            <textarea
                                rows={4}
                                value={profile.bio}
                                onChange={(e) => handleChange('bio', e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1 text-right">{profile.bio.length} / 500자</p>
                        </div>
                    </div>

                    {/* 스킬 */}
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-[640px]">
                            <Label icon={BookOpen} text="보유 스킬" />
                            <div className="flex flex-wrap gap-2 mb-3">
                                {profile.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow">
                                        <span>{skill}</span>
                                        <button onClick={() => removeSkill(skill)} className="hover:bg-white/20 rounded-full p-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                    placeholder="새 스킬 입력 (예: 콘텐츠 마케팅)"
                                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                                />
                                <button
                                    onClick={addSkill}
                                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
                                >
                                    <Plus className="w-3.5 h-3.5" /> 추가
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 희망 근무 조건 */}
                    <div className="flex flex-col items-center border-t pt-8">
                        <div className="w-full max-w-[640px]">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-green-600" />
                                희망 근무 조건
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <SelectField icon={FileText} label="고용 형태" value={profile.preferences.jobType} options={['정규직', '계약직', '프리랜서']} onChange={(e) => handlePreferenceChange('jobType', e.target.value)} />
                                <SelectField icon={Building} label="근무 방식" value={profile.preferences.workStyle} options={['재택', '출근', '하이브리드']} onChange={(e) => handlePreferenceChange('workStyle', e.target.value)} />
                                <InputField icon={DollarSign} label="희망 최소 급여 (만원)" type="number" value={profile.preferences.minSalary / 10000} onChange={(e) => handlePreferenceChange('minSalary', Number(e.target.value) * 10000)} />
                                <InputField icon={DollarSign} label="희망 최대 급여 (만원)" type="number" value={profile.preferences.maxSalary / 10000} onChange={(e) => handlePreferenceChange('maxSalary', Number(e.target.value) * 10000)} />
                                <InputField icon={Calendar} label="시작 가능일" value={profile.preferences.startDate} onChange={(e) => handlePreferenceChange('startDate', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <button className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50">
                            <X className="w-4 h-4" /> 취소
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    저장 중...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> 변경사항 저장
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ✅ 하위 컴포넌트 타입 명시
interface LabelProps {
    icon: React.FC<{ className?: string }>;
    text: string;
}

const Label = ({ icon: Icon, text }: LabelProps) => (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
        <Icon className="w-3.5 h-3.5" />
        {text}
    </label>
);

interface InputFieldProps {
    icon: React.FC<{ className?: string }>;
    label: string;
    type?: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    colSpan?: boolean;
}

const InputField = ({ icon: Icon, label, type = 'text', value, onChange, colSpan }: InputFieldProps) => (
    <div className={colSpan ? 'md:col-span-2' : ''}>
        <Label icon={Icon} text={label} />
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm transition-colors"
        />
    </div>
);

interface SelectFieldProps {
    icon: React.FC<{ className?: string }>;
    label: string;
    value: string;
    options: string[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    colSpan?: boolean;
}

const SelectField = ({ icon: Icon, label, value, options, onChange, colSpan }: SelectFieldProps) => (
    <div className={colSpan ? 'md:col-span-2' : ''}>
        <Label icon={Icon} text={label} />
        <select
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm transition-colors"
        >
            {options.map((opt, i) => (
                <option key={i} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export default ProfileEdit;
