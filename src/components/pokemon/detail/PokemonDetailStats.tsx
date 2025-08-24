import { Zap, Shield, Swords, Brain, Heart, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatDisplayName, getStatGradient } from "@/utils/pokemonStyles";
import type { Pokemon } from "@/api/pokemon/types";

type Props = {
  pokemon: Pokemon;
};

const statIcons: Record<string, any> = {
  hp: Heart,
  attack: Swords,
  defense: Shield,
  "special-attack": Zap,
  "special-defense": Brain,
  speed: Wind,
};

/** 능력치 섹션 컴포넌트 -함 */
export function PokemonDetailStats({ pokemon }: Props) {
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
        <Zap className="h-5 w-5 text-yellow-500" />
        능력치
      </h3>
      <div className="space-y-4">
        {pokemon.stats.map((s) => {
          const Icon = statIcons[s.stat.name] || Zap;
          return (
            <div key={s.stat.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {getStatDisplayName(s.stat.name)}
                  </span>
                </div>
                <span className="text-lg font-bold">{s.base_stat}</span>
              </div>
              <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-1000",
                    getStatGradient(s.stat.name),
                  )}
                  style={{
                    width: `${Math.min(100, (s.base_stat / 200) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
