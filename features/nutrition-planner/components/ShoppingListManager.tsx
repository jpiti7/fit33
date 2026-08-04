"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, Plus, Save, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveShoppingListAction } from "@/features/nutrition-planner/actions/nutrition-planner.actions";
import type {
  IngredientCategory,
  ShoppingList,
  ShoppingListItem,
} from "@/features/nutrition-planner/types";

const CATEGORIES: IngredientCategory[] = [
  "Proteínas",
  "Carbohidratos",
  "Fruta y verdura",
  "Lácteos",
  "Despensa",
  "Otros",
];

type ShoppingListManagerProps = {
  initialList: ShoppingList | null;
  weekStart: string;
};

export function ShoppingListManager({
  initialList,
  weekStart,
}: ShoppingListManagerProps) {
  const [items, setItems] = useState<ShoppingListItem[]>(
    initialList?.items ?? [],
  );
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const grouped = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        items: items.filter((item) => item.category === category),
      })).filter((group) => group.items.length > 0),
    [items],
  );

  const checked = items.filter((item) => item.checked).length;

  function toggleItem(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function addManualItem() {
    const name = newName.trim();
    if (!name) return;
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        quantity: 1,
        unit: "unidad",
        category: "Otros",
        checked: false,
        manual: true,
      },
    ]);
    setNewName("");
  }

  function saveList() {
    setMessage("");
    startTransition(async () => {
      const result = await saveShoppingListAction(weekStart, items);
      setMessage(
        result.success ? "Lista guardada correctamente." : result.message,
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/nutricion/planificador?week=${weekStart}`}
          className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al menú
        </Link>
        <Button
          type="button"
          disabled={isPending}
          onClick={saveList}
          className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
        >
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold">Compra semanal</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {checked} de {items.length} productos comprados.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{
                  width: `${items.length > 0 ? (checked / items.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-300">
            Semana del {weekStart}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Añadir producto manual</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addManualItem();
              }
            }}
            placeholder="Ejemplo: papel de cocina"
            className="border-slate-700 bg-slate-950"
          />
          <Button type="button" onClick={addManualItem} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {message && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {items.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-900/50 text-white">
          <CardContent className="p-10 text-center text-slate-400">
            Genera primero un menú semanal para crear la lista automáticamente.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {grouped.map((group) => (
            <Card
              key={group.category}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardHeader>
                <CardTitle>{group.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      item.checked
                        ? "border-emerald-400/20 bg-emerald-400/5"
                        : "border-slate-800 bg-slate-950/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="h-5 w-5 shrink-0 accent-emerald-400"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-medium ${
                          item.checked
                            ? "text-slate-500 line-through"
                            : "text-white"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.quantity} {item.unit}
                        {item.manual ? " · manual" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar ${item.name}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
