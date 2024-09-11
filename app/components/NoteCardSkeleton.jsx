
const NoteCardSkeleton = () => {
  return (
    <div
      className="max-w-80 min-w-80 flex gap-8 bg-neutral-700 flex-col rounded-xl  justify-center py-8 px-4 animate-pulse"
    >
      <div className="flex gap-2 items-center">
        <div className="w-10 h-10 rounded-full bg-neutral-500"></div>
        <div className="w-8 h-8 rounded-full bg-neutral-500"></div>
      </div>
      <div className="w-3/4 h-8 bg-neutral-500 rounded-md"></div>
      <div className="w-full h-20 bg-neutral-500 rounded-md"></div>
      <div className="flex justify-between text-white">
        <div className="w-1/4 h-4 bg-neutral-500 rounded-md"></div>
        <div className="w-1/4 h-4 bg-neutral-500 rounded-md"></div>
      </div>
    </div>
  )
}

export default NoteCardSkeleton