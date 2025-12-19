import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const token = useAppSelector((s) => s.auth.token);
  const onboarded = useAppSelector((s) => s.auth.onboarded);
  const userType = useAppSelector((s) => s.auth.userType);
  const navigate = useNavigate();
  const location = useLocation();

  // 온보딩 미완료 사용자가 보호된 라우트에 접근하려고 하면 온보딩 페이지로 리디렉션
  useEffect(() => {
    if (token && onboarded !== true) {
      const currentPath = location.pathname;
      const isOnboardingPage = currentPath === '/user/onboarding' || currentPath === '/company/onboarding';
      
      if (!isOnboardingPage) {
        const onboardingPath = userType === 'company' ? '/company/onboarding' : '/user/onboarding';
        console.log('[AuthGuard] 온보딩 미완료 → 온보딩 페이지로 리디렉션:', onboardingPath);
        navigate(onboardingPath, { replace: true });
      }
    }
  }, [token, onboarded, userType, location.pathname, navigate]);

  // 로그인 안 되어 있음 → 모달 + 리다이렉트 UI
  if (!token && onboarded === true) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl text-center">
            <h2 className="text-lg font-semibold mb-3">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6 text-sm">
              해당 기능은 로그인 후 이용할 수 있습니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-100"
              >
                돌아가기
              </button>

              <button
                onClick={() =>
                  navigate("/login", { state: { from: location } })
                }
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                로그인
              </button>
            </div>
          </div>
        </div>

        {/* 페이지는 그대로 렌더링 */}
        {children}
      </>
    );
  }

  // 온보딩 미완료 사용자는 온보딩 페이지로 리디렉션 중이므로 아무것도 렌더링하지 않음
  if (token && onboarded !== true) {
    const currentPath = location.pathname;
    const isOnboardingPage = currentPath === '/user/onboarding' || currentPath === '/company/onboarding';
    
    if (!isOnboardingPage) {
      return null; // 리디렉션 중
    }
  }

  return <>{children}</>;
};

export default AuthGuard;