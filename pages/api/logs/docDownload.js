export async function post_downloadLog(data) {
  console.log('entered submitSurvey')
  const apiUrlEndpoint = `https://conan.ai/_functions/submitDownloadLog`

  const body = JSON.stringify({
    // _id: data._id,
    data: data,
  })

  return fetch(apiUrlEndpoint, {
    method: 'post',
    body,
  })
    .then(response => {
      console.log('response', response)
      if (response.ok) {
        return response.json()
      }
      return Promise.reject('fetch to wix function has failed ' + response.status)
    })
    .catch(e => {
      console.log(`Error :  ${String(e)}`)
    })
}
