import type { PendingWorkout } from "@/lib/offline/types";

const DATABASE_NAME = "fit33-offline";
const DATABASE_VERSION = 1;
const WORKOUT_STORE = "pending-workouts";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(WORKOUT_STORE)) {
        database.createObjectStore(WORKOUT_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("No se pudo abrir IndexedDB."));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(WORKOUT_STORE, mode);
    const request = operation(transaction.objectStore(WORKOUT_STORE));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Error de almacenamiento offline."));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () =>
      reject(
        transaction.error ?? new Error("Error en la transacción offline."),
      );
  });
}

export function savePendingWorkout(workout: PendingWorkout) {
  return withStore("readwrite", (store) => store.put(workout));
}

export function removePendingWorkout(id: string) {
  return withStore("readwrite", (store) => store.delete(id));
}

export function getPendingWorkout(id: string) {
  return withStore<PendingWorkout | undefined>("readonly", (store) =>
    store.get(id),
  );
}

export async function getPendingWorkouts(): Promise<PendingWorkout[]> {
  const workouts = await withStore<PendingWorkout[]>("readonly", (store) =>
    store.getAll(),
  );
  return workouts.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function clearPendingWorkouts() {
  return withStore("readwrite", (store) => store.clear());
}
