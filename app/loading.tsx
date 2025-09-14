export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <img src="/placeholder-logo.svg" alt="Logo" className="h-12 w-12" />
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  )
}
