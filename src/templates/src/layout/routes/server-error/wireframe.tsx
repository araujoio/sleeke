
export default function WireFrame({unstable_retry}: {unstable_retry: () => void}) {
  return (
    <>
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred. Please try again.</p>
      <button type="button" onClick={() => { 
        unstable_retry();
      }} className="text-blue-500 cursor-pointer hover:underline bg-transparent border-none p-0 m-0 font-inherit">
        Try again
      </button>
    </>
  )
}