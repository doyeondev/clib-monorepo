// in other pages
// import { notFound } from "next/navigation"
// if() notFound()

export default function NotFount() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2>Page Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  )
}
