import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 포켓몬 검색 컴포넌트 Props 인터페이스
 */
interface PokemonSearchProps {
  /** 현재 검색 키워드 */
  keyword?: string;
}

/**
 * 포켓몬 검색 폼 컴포넌트
 *
 * @description 포켓몬 이름 또는 ID로 검색할 수 있는 폼을 제공하며,
 * 검색 결과에 따라 페이지 이동과 검색어 초기화 기능을 포함함
 *
 * @param keyword - 현재 검색 키워드 (URL 파라미터에서 가져옴)
 */
export function PokemonSearch({ keyword = "" }: PokemonSearchProps) {
  // 라우터 네비게이션 훅
  const navigate = useNavigate({ from: "/examples/pokemon" });

  return (
    <form
      className="flex h-[2.7rem] items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchKeyword = formData.get("keyword") as string;

        // 검색 키워드로 페이지 이동 (첫 페이지로 리셋)
        navigate({
          search: (prev) => ({
            ...prev,
            keyword: searchKeyword.trim() || undefined,
            page: 1,
          }),
        });
      }}
    >
      <div className="relative h-full flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <Input
          name="keyword"
          defaultValue={keyword}
          placeholder="포켓몬 이름 또는 ID로 검색하세요..."
          className="focus:ring-primary/20 h-full pr-4 pl-10 text-base transition-all duration-200 focus:ring-2"
        />
      </div>

      <Button type="submit" size="lg" className="h-full gap-2">
        <Search className="h-4 w-4" />
        검색
      </Button>

      {keyword && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            // 검색어 초기화 및 첫 페이지로 이동
            navigate({
              search: (prev) => ({ ...prev, keyword: undefined, page: 1 }),
            });
          }}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          초기화
        </Button>
      )}
    </form>
  );
}
