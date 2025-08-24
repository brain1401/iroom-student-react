import { PokemonCardSkeleton } from "@/components/pokemon";

export function PokemonListLoading() {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="mb-8 space-y-4 text-center">
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
          포켓몬 도감
        </h1>
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
