import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PokemonListPagination({ page }: { page: number }) {
  return (
    <Card className="py-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant={page === 1 ? "ghost" : "default"}
            disabled={page === 1}
            asChild={page !== 1}
            className="gap-2"
          >
            {page === 1 ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                이전
              </>
            ) : (
              <Link
                to="."
                search={(prev) => ({
                  ...prev,
                  page: Math.max(1, page - 1),
                })}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Link>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">페이지</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
              {page}
            </span>
          </div>

          <Button asChild className="gap-2">
            <Link to="." search={(prev) => ({ ...prev, page: page + 1 })}>
              다음
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
