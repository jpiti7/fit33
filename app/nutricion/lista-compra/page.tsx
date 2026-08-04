import { ShoppingListManager } from "@/features/nutrition-planner/components/ShoppingListManager";
import { getMealPlannerAction } from "@/features/nutrition-planner/actions/nutrition-planner.actions";

function currentMonday() {
  const now = new Date();
  const day = now.getDay();
  now.setDate(now.getDate() + (day === 0 ? -6 : 1 - day));
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

type PageProps = {
  searchParams: Promise<{ week?: string }>;
};

export default async function ShoppingListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const weekStart = /^\d{4}-\d{2}-\d{2}$/.test(params.week ?? "")
    ? (params.week as string)
    : currentMonday();
  const { shoppingList } = await getMealPlannerAction(weekStart);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Nutrición Fit33
          </p>
          <h1 className="mt-2 text-3xl font-bold">Lista de la compra</h1>
          <p className="mt-2 text-slate-400">
            Cantidades agrupadas desde el menú semanal. Marca productos y añade
            cualquier extra que necesites.
          </p>
        </header>

        <ShoppingListManager initialList={shoppingList} weekStart={weekStart} />
      </div>
    </main>
  );
}
