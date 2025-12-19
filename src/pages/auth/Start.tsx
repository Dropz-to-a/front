import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextBg from "@/assets/StartTextbg.png";

const Start: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] =
    useState<"personal" | "company">("personal");

  const handleLogin = () => navigate(`/login?type=${category}`);
  const handleRegister = () => navigate(`/register?type=${category}`);

  return (
    <div className="flex min-h-screen text-gray-900 bg-white">
      {/* Left: Hero */}
      <section
        className="
              relative flex-1 px-8 md:px-20 lg:px-28 py-10 
              flex flex-col justify-center gap-16
              -translate-y-[100px]
            "
      >
        <span
          aria-hidden
          className="pointer-events-none select-none absolute top-[+150px] left-[48%] sm:left-[62%] md:left-[66%] lg:left-[70%] rotate-[-5deg]
            text-[84px] sm:text-[108px] md:text-[128px] lg:text-[140px] drop-shadow-[0_10px_22px_rgba(0,0,0,0.14)]"
        >
          🏢
        </span>

        <div className="flex items-center gap-4">
          <img
            src="/SVG JOBIT LOGO.svg"
            alt="JOBIT"
            className="w-72 md:w-80 lg:w-[360px] h-auto object-contain select-none"
            draggable={false}
          />
        </div>

        <div>
          <h1 className="relative text-5xl font-extrabold leading-tight md:text-6xl lg:text-6xl">
            일자리 추천부터{" "}
            <span className="relative inline-block">
              <img
                src={TextBg}
                alt=""
                className="absolute left-1/2 -translate-x-1/2 bottom-[-12px] w-[180px] lg:w-[150px] max-w-none h-auto z-0 pointer-events-none select-none"
                draggable={false}
              />
              <span className="relative z-10 font-extrabold text-white">
                취업
              </span>
            </span>{" "}
            까지
          </h1>

          <p className="mt-6 text-lg font-medium text-gray-500 md:text-xl">
            기업과 개인 모두에게 최적의 매칭 솔루션 제공
          </p>
        </div>

        <span
          aria-hidden
          className="absolute bottom-2 left-12 md:left-20 -rotate-6 text-[100px] md:text-[130px] lg:text-[160px]
            drop-shadow-[0_14px_30px_rgba(0,0,0,0.2)] pointer-events-none select-none"
        >
          💼
        </span>
      </section>

      <div className="hidden w-px lg:block bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

      {/* Right */}
      <section className="w-full lg:w-[580px] bg-gray-50 px-6 md:px-10 py-10 flex items-center justify-center">
        <div className="w-full max-w-sm p-8 space-y-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <h2 className="text-lg font-semibold text-center text-gray-800">
            사용하실 버전을 선택해주세요
          </h2>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-500">
              카테고리
            </label>
            <div className="grid grid-cols-2 p-1 bg-gray-100 border border-gray-200 rounded-xl">
              <button
                className={`py-2 font-semibold rounded-lg transition ${
                  category === "personal"
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setCategory("personal")}
              >
                개인
              </button>
              <button
                className={`py-2 font-semibold rounded-lg transition ${
                  category === "company"
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setCategory("company")}
              >
                기업
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <button
              onClick={handleRegister}
              className="h-12 font-bold transition border border-gray-300 rounded-xl hover:bg-gray-100"
            >
              {category === "company"
                ? "기업용 회원가입"
                : "개인용 회원가입"}
            </button>
            <button
              onClick={handleLogin}
              className="h-12 font-bold text-white transition bg-gray-900 rounded-xl hover:bg-gray-800"
            >
              로그인
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Start;