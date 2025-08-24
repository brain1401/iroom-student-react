import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, AlertCircle } from "lucide-react";

/**
 * 포켓몬 검색 결과가 없을 때 표시하는 컴포넌트
 * @description 검색어에 대한 결과가 없을 때 사용자에게 안내 메시지를 제공
 */
export function PokemonSearchEmpty({
  searchKeyword,
}: {
  searchKeyword: string;
}) {
  return (
    <div className="flex min-h-[25rem] items-center justify-center">
      <Card className="border-muted bg-muted/20 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Search className="text-muted-foreground h-8 w-8" />
          </div>
          <CardTitle className="text-muted-foreground text-xl">
            검색 결과가 없습니다
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">
              '{searchKeyword}'
            </span>
            에 대한 포켓몬을 찾을 수 없습니다.
          </p>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div className="text-left">
                <p className="mb-2 text-sm font-medium text-blue-800">
                  검색 팁:
                </p>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• 포켓몬 이름을 정확히 입력해보세요</li>
                  <li>• 포켓몬 번호로 검색해보세요 (예: 25)</li>
                  <li>• 영어 이름으로 검색해보세요 (예: pikachu)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
