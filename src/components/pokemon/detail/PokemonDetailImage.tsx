import { cn } from "@/lib/utils";
import { getTypeBgGradient, formatPokemonId } from "@/utils/pokemonStyles";
import type { Pokemon } from "@/api/pokemon/types";
import { usePokemonImage } from "@/hooks/pokemon";

type Props = {
  pokemon: Pokemon;
  idParam: string;
};

/** 이미지 섹션 컴포넌트 -함 */
export function PokemonDetailImage({ pokemon, idParam }: Props) {
  const primaryType = pokemon.types[0]?.type?.name || "normal";
  const bgGradient = getTypeBgGradient(primaryType as any);

  const {
    imageUrl,
    isImageLoading,
    hasImageError,
    handleImageLoad,
    handleImageError,
  } = usePokemonImage(pokemon, idParam);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center p-8 lg:p-12",
        bgGradient,
      )}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/30 blur-xl" />
        <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-white/30 blur-xl" />
      </div>

      <div className="absolute top-6 right-6">
        <span className="text-2xl font-bold text-black/60 dark:text-white/60">
          {formatPokemonId(pokemon.id)}
        </span>
      </div>

      <div className="animate-float relative z-10 aspect-square w-full max-w-sm">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 animate-pulse rounded-full bg-white/30" />
          </div>
        )}

        {hasImageError ? (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/20">
            <span className="text-lg text-white/70">이미지 없음</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={pokemon.name}
            loading="eager"
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn(
              "h-full w-full object-contain drop-shadow-2xl transition-all duration-300",
              "hover:scale-110",
              isImageLoading ? "opacity-0" : "opacity-100",
            )}
          />
        )}
      </div>
    </div>
  );
}
