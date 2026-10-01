export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getPhotoUrl = (photoPath) => {
  if (!photoPath) {
    return ''
  }

  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath
  }

  return `${API_URL}${photoPath}`
}