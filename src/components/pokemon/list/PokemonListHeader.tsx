import { Sparkles } from "lucide-react";

export function PokemonListHeader() {
  return (
    <div className="mb-8 space-y-4 text-center">
      <div className="mb-2 inline-flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-yellow-500" />
        <span className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          Pokédex Collection
        </span>
        <Sparkles className="h-6 w-6 text-yellow-500" />
      </div>
      <h1 className="animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
        포켓몬 도감
      </h1>
      <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
        다양한 포켓몬들을 만나보세요! 클릭하여 상세 정보를 확인할 수 있습니다.
      </p>
    </div>
  );
}
