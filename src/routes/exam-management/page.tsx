import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

export default function ExamManagementPage() {
  const [activeTab, setActiveTab] = useState<"exam" | "grade">("exam");
  const [activeSubTab, setActiveSubTab] = useState<"score" | "wrong">("wrong");
  const [activeFilter, setActiveFilter] = useState<"unit" | "item" | "exam">("exam");
  const [selectedWrongNote, setSelectedWrongNote] = useState<number | null>(null);

  // URL 쿼리 파라미터에서 탭 정보 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'exam') {
      setActiveTab('exam');
    } else if (tabParam === 'grade') {
      setActiveTab('grade');
    } else {
      // 기본값을 시험관리로 설정
      setActiveTab('exam');
    }
  }, []);

  // 오답노트 상세 페이지로 이동
  const handleWrongNoteClick = (index: number) => {
    setSelectedWrongNote(index);
  };

  // 뒤로가기
  const handleBackClick = () => {
    setSelectedWrongNote(null);
  };

  // 오답노트 상세 페이지가 선택된 경우
  if (selectedWrongNote !== null) {
    return (
      <div className={cn("w-full flex justify-center")}>
        <div className={cn("w-[360px] bg-white p-4")}>
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackClick}
              className="w-[25px] h-[25px] flex items-center justify-center"
            >
              <svg width="6" height="15" viewBox="0 0 6 15" fill="none">
                <path
                  d="M1 1L5 7.5L1 14"
                  stroke="#1C1C1E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="text-[20px] font-bold text-black">가다나 시험</div>
            <div className="w-[25px]"></div>
          </div>

          {/* 구분선 */}
          <div className="h-px w-full bg-black mb-8" />

          {/* 차트 영역 - MainHome과 동일한 스타일 */}
          <div className="bg-white rounded-[10px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] p-4 mb-6">
            {/* 차트 제목 */}
            <div className="text-center mb-2">
              <div className="text-[20px] font-bold text-black mb-1">가다나 시험</div>
            </div>

            {/* 정답률 라벨 */}
            <div className="text-[10.43px] leading-[1] text-[#000] mb-1">
              정답률(%)
            </div>

            {/* 정답률 그래프 - 선택된 필터에 따라 동적으로 변경 */}
            <div className="w-full relative" style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    activeFilter === 'unit' ? [
                      { name: "1단원", rate: 85 },
                      { name: "2단원", rate: 72 },
                      { name: "3단원", rate: 68 },
                      { name: "4단원", rate: 91 },
                      { name: "5단원", rate: 76 },
                    ] : activeFilter === 'item' ? [
                      { name: "덧셈·뺄셈", rate: 100 },
                      { name: "곱셈", rate: 70 },
                      { name: "전개", rate: 50 },
                      { name: "인수분해", rate: 30 },
                      { name: "응용", rate: 50 },
                    ] : [
                      { name: "1차시험", rate: 88 },
                      { name: "2차시험", rate: 75 },
                      { name: "3차시험", rate: 82 },
                      { name: "4차시험", rate: 69 },
                      { name: "5차시험", rate: 93 },
                    ]
                  }
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    width={24}
                    tick={{ fontSize: 10 }}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    height={26}
                  />
                  <Bar 
                    dataKey="rate" 
                    radius={[4, 4, 0, 0]} 
                    barSize={26}
                    fill="#9810FA"
                  >
                    {(
                      activeFilter === 'unit' ? [
                        { name: "1단원", rate: 85 },
                        { name: "2단원", rate: 72 },
                        { name: "3단원", rate: 68 },
                        { name: "4단원", rate: 91 },
                        { name: "5단원", rate: 76 },
                      ] : activeFilter === 'item' ? [
                        { name: "덧셈·뺄셈", rate: 100 },
                        { name: "곱셈", rate: 70 },
                        { name: "전개", rate: 50 },
                        { name: "인수분해", rate: 30 },
                        { name: "응용", rate: 50 },
                      ] : [
                        { name: "1차시험", rate: 88 },
                        { name: "2차시험", rate: 75 },
                        { name: "3차시험", rate: 82 },
                        { name: "4차시험", rate: 69 },
                        { name: "5차시험", rate: 93 },
                      ]
                    ).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#9810FA", "#D499FF", "#D499FF", "#EDD5FF", "#D499FF"][index]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              {/* 성취 레전드: 그래프 내부 우측 상단 오버레이 - 더 위로 이동 */}
              <div className="absolute right-0 top-0 flex flex-col items-end gap-2 pr-2 -mt-12">
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 7.8,
                      height: 7.8,
                      backgroundColor: "#9810FA",
                      borderRadius: 2,
                    }}
                  />
                  <span className="text-[10.43px] leading-[1] text-[#000]">
                    우수
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 7.8,
                      height: 7.8,
                      backgroundColor: "#D499FF",
                      borderRadius: 2,
                    }}
                  />
                  <span className="text-[10.43px] leading-[1] text-[#000]">
                    보통
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 7.8,
                      height: 7.8,
                      backgroundColor: "#EDD5FF",
                      borderRadius: 2,
                    }}
                  />
                  <span className="text-[10.43px] leading-[1] text-[#000]">
                    노력 필요
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 문제 목록 - 선택된 필터에 따라 동적으로 변경 */}
          <div className="space-y-4">
            {(
              activeFilter === 'unit' ? [
                {
                  number: "1단원 문제",
                  topic: "# 식의 계산",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                },
                {
                  number: "2단원 문제",
                  topic: "# 방정식",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "wrong"
                },
                {
                  number: "3단원 문제",
                  topic: "# 함수",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                },
                {
                  number: "4단원 문제",
                  topic: "# 도형",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "wrong"
                },
                {
                  number: "5단원 문제",
                  topic: "# 확률과 통계",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                }
              ] : activeFilter === 'item' ? [
                {
                  number: "덧셈·뺄셈 문제",
                  topic: "# 다항식의 덧셈·뺄셈",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                },
                {
                  number: "곱셈 문제",
                  topic: "# 다항식의 곱셈",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "wrong"
                },
                {
                  number: "전개 문제",
                  topic: "# 다항식의 전개",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                },
                {
                  number: "인수분해 문제",
                  topic: "# 다항식의 인수분해",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "wrong"
                },
                {
                  number: "응용 문제",
                  topic: "# 다항식의 응용",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                }
              ] : [
                {
                  number: "1차시험 문제",
                  topic: "# 중간고사",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                },
                {
                  number: "2차시험 문제",
                  topic: "# 기말고사",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "wrong"
                },
                {
                  number: "3차시험 문제",
                  topic: "# 모의고사",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                },
                {
                  number: "4차시험 문제",
                  topic: "# 수능모의",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "wrong"
                },
                {
                  number: "5차시험 문제",
                  topic: "# 실전연습",
                  type: "유형 : 계산",
                  difficulty: "난이도 : 중",
                  status: "correct"
                }
              ]
            ).map((problem, index) => (
              <div
                key={index}
                className="w-[280px] h-[60px] bg-white rounded-[10px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] p-4 flex items-center justify-between mx-auto"
              >
                <div className="flex items-center gap-4">
                  {/* 상태 표시 원 - 크기 축소 및 흰색 원 삭제 */}
                  <div className="relative">
                    {problem.status === "correct" ? (
                      <div className="w-[20px] h-[20px] bg-[#155DFC] rounded-full"></div>
                    ) : (
                      <div className="w-[20px] h-[20px] bg-[#FF6A71] rounded-full"></div>
                    )}
                  </div>
                  
                  {/* 문제 정보 - 텍스트 간격 축소 및 왼쪽 정렬 */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] font-bold text-black leading-[1.193]">{problem.number}</span>
                      <span className="text-[13px] text-[#427BFF] leading-[1.193]">{problem.topic}</span>
                    </div>
                    <div className="flex gap-4 text-[13px] text-black leading-[1.193]">
                      <span>{problem.type}</span>
                      <span>{problem.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                {/* 화살표 아이콘 */}
                <button className="w-[25px] h-[25px] flex items-center justify-center">
                  <svg width="6" height="15" viewBox="0 0 6 15" fill="none">
                    <path
                      d="M1 1L5 7.5L1 14"
                      stroke="#1C1C1E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full flex justify-center")}>
      <div className={cn("w-[360px] bg-white p-4")}>
        {/* 상단 탭 네비게이션 */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setActiveTab("exam")}
            className={cn(
              "text-[20px] leading-[1.193] transition-all duration-150 hover:scale-110",
              activeTab === "exam" ? "font-bold text-[#000]" : "font-medium text-[#999999]",
            )}
          >
            시험 관리
          </button>
          <button
            onClick={() => setActiveTab("grade")}
            className={cn(
              "text-[20px] leading-[1.193] transition-all duration-150 hover:scale-110",
              activeTab === "grade" ? "font-bold text-[#000]" : "font-medium text-[#9F9F9F]",
            )}
          >
            성적 / 리포트
          </button>
        </div>

        {/* 구분선 */}
        <div className="relative mb-8">
          <div className="h-px w-[250px] bg-[#EBEBEB] mx-auto" />
          <div
            className={cn(
              "absolute top-0 h-0.5 bg-black transition-all duration-300",
              activeTab === "exam"
                ? "w-[125px] left-[25px]"
                : "w-[125px] left-[150px]",
            )}
          />
        </div>

        {/* 그림자 효과가 적용된 컨테이너 */}
        <div className="shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] rounded-[10px] bg-white p-4">
          {activeTab === "exam" ? (
            /* 시험 관리 탭 - 빈 내용 */
            <div className="text-center text-gray-500 py-20">
              시험 관리 기능이 준비 중입니다.
            </div>
          ) : (
            /* 성적 / 리포트 탭 */
            <>
              {/* 하위 탭 */}
              <div className="flex justify-center gap-6 mb-6">
                <button 
                  onClick={() => setActiveSubTab('score')}
                  className={cn(
                    "text-[20px] leading-[1.193] transition-all duration-150 hover:scale-110",
                    activeSubTab === 'score' ? "font-bold text-[#000]" : "font-medium text-[#9F9F9F]",
                  )}
                >
                  시험 점수
                </button>
                <button 
                  onClick={() => setActiveSubTab('wrong')}
                  className={cn(
                    "text-[20px] leading-[1.193] transition-all duration-300 hover:scale-110",
                    activeSubTab === 'wrong' ? "font-bold text-[#000]" : "font-medium text-[#9F9F9F]",
                  )}
                >
                  오답 노트
                </button>
              </div>

              {/* 하위 탭 구분선 */}
              <div className="relative mb-6">
                <div className="h-px w-[200px] bg-[#EBEBEB] mx-auto" />
                <div
                  className={cn(
                    "absolute top-0 h-0.5 bg-black transition-all duration-300",
                    activeSubTab === 'score'
                      ? "w-[100px] left-[25px]"
                      : "w-[100px] left-[125px]",
                  )}
                />
              </div>

              {activeSubTab === 'score' ? (
                /* 시험 점수 탭 - 가나다 시험 카드들 */
                <div className="space-y-4">
                  {[
                    {
                      title: "가나다 시험",
                      correctRate: "정답률 60%",
                      correctCount: "12",
                      wrongCount: "8",
                      totalQuestions: "총 20문항",
                    },
                    {
                      title: "가나다 시험",
                      correctRate: "정답률 60%",
                      correctCount: "12",
                      wrongCount: "8",
                      totalQuestions: "총 20문항",
                    },
                    {
                      title: "가나다 시험",
                      correctRate: "정답률 60%",
                      correctCount: "12",
                      wrongCount: "8",
                      totalQuestions: "총 20문항",
                    },
                  ].map((exam, index) => (
                    <div
                      key={index}
                      className="w-full h-[140px] bg-white rounded-[10px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] p-4 border-b border-[#D7D7D7]"
                    >
                      <div className="flex justify-between items-start h-full">
                        <div className="flex-1">
                          <div className="text-[20px] font-bold leading-[1.193] text-black mb-2">
                            {exam.title}
                          </div>
                          
                          {/* 텍스트 정보들 - 피그마 레이아웃 순서대로 */}
                          <div className="flex items-center gap-4 mb-3">
                            {/* 파란 동그라미 + 12 - 피그마 크기: 15.72px */}
                            <div className="flex items-center gap-1">
                              <div className="w-[10.4px] h-[10.4px] bg-[#155DFC] rounded-full"></div>
                              <div className="text-[20px] font-bold leading-[1.193] text-[#155DFC]">
                                {exam.correctCount}
                              </div>
                            </div>
                            
                            {/* 빨간 동그라미 + 8 - 피그마 크기: 10.4px */}
                            <div className="flex items-center gap-2">
                              <div className="w-[10.4px] h-[10.4px] bg-[#FF6A71] rounded-full"></div>
                              <div className="text-[20px] font-bold leading-[1.193] text-[#FF6A71]">
                                {exam.wrongCount}
                              </div>
                            </div>
                            
                            {/* 총 20문항 */}
                            <div className="text-[15px] leading-[1.193] text-[#999999]">
                              {exam.totalQuestions}
                            </div>
                          </div>
                          
                          {/* 정답률 60% */}
                          <div className="text-[15px] font-medium leading-[1.193] text-[#999999] mb-3">
                            {exam.correctRate}
                          </div>
                          
                          {/* 진행률 바 (Progress Bar) - 피그마 디자인과 동일 */}
                          <div className="w-[265.85px] h-[7.26px] mb-2 flex rounded-sm overflow-hidden">
                            {/* 정답률 진행률 바 (파란색) */}
                            <div 
                              className="h-full bg-[#155DFC]"
                              style={{ 
                                width: `${(parseInt(exam.correctCount) / (parseInt(exam.correctCount) + parseInt(exam.wrongCount))) * 265.85}px`
                              }}
                            ></div>
                            {/* 오답률 진행률 바 (빨간색) */}
                            <div 
                              className="h-full bg-[#FF6A71]"
                              style={{ 
                                width: `${(parseInt(exam.wrongCount) / (parseInt(exam.correctCount) + parseInt(exam.wrongCount))) * 265.85}px`
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <button className="w-[25px] h-[25px] flex items-center justify-center">
                          <svg width="6" height="15" viewBox="0 0 6 15" fill="none" className="self-center">
                            <path
                              d="M1 1L5 7.5L1 14"
                              stroke="#1C1C1E"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* 오답 노트 탭 */
                <>
                  {/* 시험 카드들 */}
                  <div className="space-y-4 mb-2 transition-all duration-300 ease-in-out">
                    {/* 필터 버튼들 - 첫 번째 카드 왼쪽 위에 배치 */}
                    <div className="flex gap-1  mt-2">
                      <button 
                        onClick={() => setActiveFilter('unit')}
                        className={cn(
                          "px-2 py-1 border rounded-[162.7px] text-[9px] leading-[1] transition-colors duration-150",
                          activeFilter === 'unit' 
                            ? "border-[#427BFF] text-[#427BFF] bg-[#427BFF] text-white font-semibold" 
                            : "border-black text-black"
                        )}
                      >
                        단원별
                      </button>
                      <button 
                        onClick={() => setActiveFilter('item')}
                        className={cn(
                          "px-2 py-1 border rounded-[162.7px] text-[9px] leading-[1] transition-colors duration-150",
                          activeFilter === 'item' 
                            ? "border-[#427BFF] text-[#427BFF] bg-[#427BFF] text-white font-semibold" 
                            : "border-black text-black"
                        )}
                      >
                        항목별
                      </button>
                      <button 
                        onClick={() => setActiveFilter('exam')}
                        className={cn(
                          "px-2 py-1 border rounded-[162.7px] text-[9px] leading-[1] transition-colors duration-150",
                          activeFilter === 'exam' 
                            ? "border-[#427BFF] text-[#427BFF] bg-[#427BFF] text-white font-semibold" 
                            : "border-black text-black"
                        )}
                      >
                        시험별
                      </button>
                    </div>
                    
                    {/* 필터별 시험 카드들 */}
                    <div className={cn(
                      "transition-all duration-500 ease-in-out",
                      activeFilter === 'unit' ? 'h-[200px]' : 
                      activeFilter === 'item' ? 'h-[300px]' : 
                      'h-[400px]'
                    )}>
                      {activeFilter === 'unit' && (
                        // 단원별 - 2개만
                        <div className="space-y-4 transition-all duration-500 ease-in-out transform animate-in fade-in-0 slide-in-from-top-2">
                          {[
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                          ].map((exam, index) => (
                            <div
                              key={index}
                              className="w-full h-[77.24px] bg-white rounded-[10px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] p-4 transition-all duration-300 ease-in-out"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-[13px] font-bold leading-[1.193] text-black mb-1">
                                    {exam.title}
                                  </div>
                                  <div className="text-[13px] leading-[1.193] text-[#427BFF] mb-2">
                                    {exam.subtitle}
                                  </div>
                                  <div className="flex gap-3 text-[11px] leading-[1.193] text-black">
                                    <span>유형 : {exam.type}</span>
                                    <span>난이도 : {exam.difficulty}</span>
                                  </div>
                                </div>
                                <button className="w-[25px] h-[25px] flex items-center justify-center">
                                  <svg width="6" height="15" viewBox="0 0 6 15" fill="none" className="self-center mt-4">
                                    <path
                                      d="M1 1L5 7.5L1 14"
                                      stroke="#1C1C1E"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {activeFilter === 'item' && (
                        // 항목별 - 3개만
                        <div className="space-y-4 transition-all duration-500 ease-in-out transform animate-in fade-in-0 slide-in-from-top-2">
                          {[
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                          ].map((exam, index) => (
                            <div
                              key={index}
                              className="w-full h-[77.24px] bg-white rounded-[10px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] p-4 transition-all duration-300 ease-in-out"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-[13px] font-bold leading-[1.193] text-black mb-1">
                                    {exam.title}
                                  </div>
                                  <div className="text-[13px] leading-[1.193] text-[#427BFF] mb-2">
                                    {exam.subtitle}
                                  </div>
                                  <div className="flex gap-3 text-[11px] leading-[1.193] text-black">
                                    <span>유형 : {exam.type}</span>
                                    <span>난이도 : {exam.difficulty}</span>
                                  </div>
                                </div>
                                <button className="w-[25px] h-[25px] flex items-center justify-center">
                                  <svg width="6" height="15" viewBox="0 0 6 15" fill="none" className="self-center mt-4">
                                    <path
                                      d="M1 1L5 7.5L1 14"
                                      stroke="#1C1C1E"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {activeFilter === 'exam' && (
                        // 시험별 - 4개 (기존과 동일)
                        <div className="space-y-4 transition-all duration-500 ease-in-out transform animate-in fade-in-0 slide-in-from-top-2">
                          {[
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                            {
                              title: "가다나 시험 4번",
                              subtitle: "# 1. 식의 계산 - 다항식의 곱셈",
                              type: "계산",
                              difficulty: "중",
                            },
                          ].map((exam, index) => (
                            <div
                              key={index}
                              className="w-full h-[77.24px] bg-white rounded-[10px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] p-4 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg transition-shadow duration-200"
                              onClick={() => handleWrongNoteClick(index)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-[13px] font-bold leading-[1.193] text-black mb-1">
                                    {exam.title}
                                  </div>
                                  <div className="text-[13px] leading-[1.193] text-[#427BFF] mb-2">
                                    {exam.subtitle}
                                  </div>
                                  <div className="flex gap-3 text-[11px] leading-[1.193] text-black">
                                    <span>유형 : {exam.type}</span>
                                    <span>난이도 : {exam.difficulty}</span>
                                  </div>
                                </div>
                                <button className="w-[25px] h-[25px] flex items-center justify-center">
                                  <svg width="6" height="15" viewBox="0 0 6 15" fill="none" className="self-center mt-4">
                                    <path
                                      d="M1 1L5 7.5L1 14"
                                      stroke="#1C1C1E"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

