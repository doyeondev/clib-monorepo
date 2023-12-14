export const Loader = () => {
  return (
    <div className="flex h-full w-full flex-col justify-center bg-white text-sm ">
      <div className="mb-2 text-center text-xs font-semibold tracking-wide text-gray-600">문서를 로딩중입니다</div>
      <div className="loading-screen">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  )
}
