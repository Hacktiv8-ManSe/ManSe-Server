const { default: axios } = require('axios')
const IMAGE_BB_KEY = process.env.IMAGE_BB_KEY
const FormData = require('form-data')
const fs = require('fs')

const getImageUrl = imageUrl => {
  const formData = new FormData()
  formData.append('image', fs.createReadStream(imageUrl))
  return axios.post(
    'https://api.imgbb.com/1/upload?key=' + process.env.IMAGE_BB_KEY,
    formData,
    { headers: formData.getHeaders() }
  )
}

module.exports = { getImageUrl }
