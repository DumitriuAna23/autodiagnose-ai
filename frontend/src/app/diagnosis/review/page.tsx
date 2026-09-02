export default function ReviewPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          AutoDiagnose AI
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Diagnostic information collected
        </h1>

        <p className="mt-4 max-w-xl text-zinc-400">
          Vehicle, symptoms and adaptive diagnostic answers
          have been saved successfully.
        </p>
      </div>
    </main>
  );
}