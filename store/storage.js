import axios from '../axios'
import imageCompression from 'browser-image-compression'

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

export const actions = {
  async uploadFile(_, file) {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.7,
    }

    let imageCompressed = file

    // En iOS produce un bug
    if (!iOS()) {
      imageCompressed = await imageCompression(file, options)
    }

    const formData = new FormData()

    const lastDot = file.name.lastIndexOf('.')

    const fileName = file.name.substring(0, lastDot)
    const ext = file.name.substring(lastDot + 1)

    formData.append(
      'profileImage',
      imageCompressed,
      file.name || 'photo.' + ext
    )
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/uploadImage`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,enq=0.8',
          'Content-Type': `multipart/form-data boundary=${formData._boundary}`,
        },
      }
    )
    return data
  },
  async uploadProfilePicture(_, file) {
    const options = {
      maxSizeMB: 0.25,
      maxWidthOrHeight: 500,
      useWebWorker: true,
      initialQuality: 0.6,
    }

    const imageCompressed = await imageCompression(file, options)

    const formData = new FormData()

    const lastDot = file.name.lastIndexOf('.')

    const fileName = file.name.substring(0, lastDot)
    const ext = file.name.substring(lastDot + 1)

    formData.append(
      'profileImage',
      imageCompressed,
      file.name || 'photo.' + ext
    )
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/uploadImage`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,enq=0.8',
          'Content-Type': `multipart/form-data boundary=${formData._boundary}`,
        },
      }
    )
    return data
  },
  async uploadVideo(_, file) {
    const formData = new FormData()

    const lastDot = file.name.lastIndexOf('.')

    const fileName = file.name.substring(0, lastDot)
    const ext = file.name.substring(lastDot + 1)

    formData.append('video', file, file.name || 'video.' + ext)
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/uploadVideo`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,enq=0.8',
          'Content-Type': `multipart/form-data boundary=${formData._boundary}`,
        },
      }
    )
    return data
  },
  async uploadAudio(_, file) {
    const formData = new FormData()
    formData.append('audio', file, 'audio.mp3')
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/uploadAudio`,
      formData,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,enq=0.8',
          'Content-Type': `multipart/form-data boundary=${formData._boundary}`,
        },
      }
    )
    return data
  },
}
