// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  try {
    const apiUrlEndpoint = `https://conan.ai/_functions/clibCategoryList`
    const response = await fetch(apiUrlEndpoint)
    const res = await response.json()
    const details = await res.items
    console.log('details', details)
    res.status(200).json({ name: details })
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    // console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
