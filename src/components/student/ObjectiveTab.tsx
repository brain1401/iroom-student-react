/**
 * 객관식 탭 컴포넌트 (OMR 카드 형식)
 * @description OMR 카드 스타일의 객관식 문제 표시 탭
 */
export function ObjectiveTab() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* OMR 카드 */}
      <div className="bg-white rounded-lg border-2 border-gray-800 p-8 shadow-lg">
        {/* OMR 카드 헤더 */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            객관식 답안지
          </h2>
          <p className="text-gray-600">정답을 선택하여 표시하세요</p>
        </div>

        {/* 문제 목록 */}
        <div className="space-y-8">
          {/* 문제 1 */}
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  1번
                </span>
                <span className="text-sm text-gray-600">배점: 5점</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                다음 중 올바른 답을 고르세요.
              </h3>
              <p className="text-gray-700 leading-relaxed">
                수학 문제 내용이 여기에 표시됩니다. 문제의 구체적인 내용과
                보기들을 확인할 수 있습니다.
              </p>
            </div>

            {/* OMR 보기 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q1"
                  value="1"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ①
                </span>
                <span className="text-gray-700 font-medium">보기 1</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q1"
                  value="2"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ②
                </span>
                <span className="text-gray-700 font-medium">보기 2</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q1"
                  value="3"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ③
                </span>
                <span className="text-gray-700 font-medium">보기 3</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q1"
                  value="4"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ④
                </span>
                <span className="text-gray-700 font-medium">보기 4</span>
              </label>
            </div>
          </div>

          {/* 문제 2 */}
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  2번
                </span>
                <span className="text-sm text-gray-600">배점: 5점</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                두 번째 객관식 문제입니다.
              </h3>
              <p className="text-gray-700 leading-relaxed">
                추가적인 객관식 문제 내용과 보기들을 확인할 수 있습니다.
              </p>
            </div>

            {/* OMR 보기 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q2"
                  value="1"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ①
                </span>
                <span className="text-gray-700 font-medium">보기 1</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q2"
                  value="2"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ②
                </span>
                <span className="text-gray-700 font-medium">보기 2</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q2"
                  value="3"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ③
                </span>
                <span className="text-gray-700 font-medium">보기 3</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
                <input
                  type="radio"
                  name="q2"
                  value="4"
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  ④
                </span>
                <span className="text-gray-700 font-medium">보기 4</span>
              </label>
            </div>
          </div>
        </div>

        {/* OMR 카드 하단 */}
        <div className="mt-8 pt-6 border-t-2 border-gray-800 text-center">
          <p className="text-sm text-gray-600">
            ※ 답안을 선택한 후 확인해주세요
          </p>
        </div>
      </div>
    </div>
  );
}
