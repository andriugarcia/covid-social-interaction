import axios from 'axios'

export const actions = {
  async uploadFile(_, file) {
    const formData = new FormData()
    formData.append('profileImage', file, file.name || 'photo.jpeg')
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/uploadImage`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    )
    return data
  },
  async uploadAudio(_, file) {
    const formData = new FormData()
    formData.append('audio', file, 'audio.webm')
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/uploadAudio`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    )
    return data
  },
}
