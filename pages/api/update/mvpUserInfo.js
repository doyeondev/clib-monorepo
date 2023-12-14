// export async function post_mvpUserInfo(data) {
//   console.log('entered registerAccount')
//   const apiUrlEndpoint = `https://conan.ai/_functions/updateMvp`

//   const body = JSON.stringify({
//     // _id: data._id,
//     data: data,
//   })

//   return fetch(apiUrlEndpoint, {
//     method: 'post',
//     body,
//   })
//     .then(response => {
//       console.log('response', response)
//       if (response.ok) {
//         return response.json()
//       }
//       return Promise.reject('fetch to wix function has failed ' + response.status)
//     })
//     .catch(e => {
//       console.log(`Error :  ${String(e)}`)
//     })
// }
