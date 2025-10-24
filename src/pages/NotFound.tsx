import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FallingText from "../components/NotFound/FallingText";
import Footer from "../components/Footer";

const NotFound = () => {
  const navigate = useNavigate();
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  // ✅ Header 높이 계산
  useEffect(() => {
    const headerEl = document.querySelector("header");
    if (headerEl) setHeaderHeight(headerEl.offsetHeight);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* 공통 Header */}
      <Header />

      {/* Main */}
      <main
        className="relative flex-1 flex flex-col items-center justify-center overflow-hidden"
        style={{
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        {/* FallingText (화면 전체) */}
        <div className="absolute inset-0">
          <FallingText
            className="flex items-center justify-center white-space: nowrap"
            text="❓ ❓ ❓ ❓ ❓ ❓ ❓ ❓ ❓ "
            highlightWords={["❓"]}
            trigger="hover"
            backgroundColor="transparent"
            gravity={0.6}
            fontSize="5rem"
            mouseConstraintStiffness={0.8}
          />
        </div>

        {/* 404 텍스트와 설명 */}
        <div className="relative text-center z-10">
          <h1 className="text-[6rem] sm:text-[8rem] font-extrabold leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400 drop-shadow-sm">
            404
          </h1>
          <p className="mt-3 text-gray-700 text-lg sm:text-xl font-medium">
            요청하신 페이지를 찾을 수 없습니다.
          </p>
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            주소가 변경되었거나 삭제된 페이지일 수 있습니다.
          </p>

          {/* 버튼 */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </main>

      {/* 공통 Footer */}
      <Footer />
    </div>
  );
};

export default NotFound;
