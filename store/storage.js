import axios from 'axios'

export const actions = {
  async uploadFile(_, file) {
    console.log(file)
    const formData = new FormData()
    formData.append('profileImage', file, file.name || 'photo.jpeg')
    console.log(formData.get('profileImage'))
    const { data } = await axios.post(
      `${process.env.SOCKET_URL}/uploadImage`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    )
    console.log(data)
    return data
  },
  async uploadAudio(_, file) {
    console.log(file)
    const formData = new FormData()
    formData.append('audio', file, 'audio.webm')
    console.log(formData.get('audio'))
    const { data } = await axios.post(
      `${process.env.SOCKET_URL}/uploadAudio`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    )
    console.log(data)
    return data
  },
}
