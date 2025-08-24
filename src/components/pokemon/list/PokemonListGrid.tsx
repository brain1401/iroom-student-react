import { PokemonCard } from "@/components/pokemon";

type PokemonItem = {
  name: string;
  url: string;
};

export function PokemonListGrid({ items }: { items: PokemonItem[] }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((pokemon) => (
        <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
      ))}
    </div>
  );
}
