import {
  getProgressPhotosAction,
  ProgressPhotoForm,
  ProgressPhotoGallery,
} from "@/features/progress-photos";

export default async function ProgressPhotosPage() {
  const photos = await getProgressPhotosAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Progreso privado
          </p>
          <h1 className="mt-2 text-3xl font-black">Fotos de progreso</h1>
          <p className="mt-2 text-slate-400">
            Una línea temporal privada protegida por tu cuenta.
          </p>
        </header>
        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
          <ProgressPhotoForm />
          <ProgressPhotoGallery photos={photos} />
        </div>
      </div>
    </main>
  );
}
