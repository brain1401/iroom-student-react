import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function NavigationBar() {
  return (
    <nav className="bg-white border-b shadow-sm p-4">
      <div className="mx-auto flex items-center gap-6">
        <div className="text-xl font-bold text-violet-600">이룸클래스</div>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/">홈</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/examples/pokemon">포켓몬</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
