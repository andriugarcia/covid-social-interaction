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
    // Demo mode - return a placeholder URL
    return {
      location: 'https://picsum.photos/800/600?random=' + Date.now(),
      filename: file.name
    }
  },
  async uploadProfilePicture(_, file) {
    // Demo mode - return a placeholder profile picture URL
    return {
      location: 'https://picsum.photos/200/200?random=' + Date.now(),
      filename: file.name
    }
  },
  async uploadVideo(_, file) {
    // Demo mode - return a placeholder video URL
    return {
      location: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      filename: file.name
    }
  },
  async uploadAudio(_, file) {
    // Demo mode - return a placeholder audio URL
    return {
      location: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3',
      filename: file.name
    }
  },
}
