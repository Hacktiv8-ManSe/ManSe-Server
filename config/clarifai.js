const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')
const stub = ClarifaiStub.grpc()
const CLARIFAI_API = process.env.CLARIFAI_API
const MODEL_ID = process.env.MODEL_ID
// This will be used by every Clarifai endpoint call.
const metadata = new grpc.Metadata()
metadata.set('authorization', 'Key ' + CLARIFAI_API)

const predictImage = (url, min_value) => {
  return new Promise((resolve, reject) => {
    stub.PostModelOutputs(
      {
        model_id: MODEL_ID,
        inputs: [{ data: { image: { url } } }],
        model: { output_info: { output_config: { min_value } } }
      },
      metadata,
      (err, response) => {
        if (err) {
          reject(`ERROR: ${err}`)
          return
        }
        // UPDATE THE CODE BELOW TO ONE LINE TO MAXIMISE TEST.JS SCORE COVERAGE
        if (response.status.code !== 10000) {
          reject(
            'Received failed status: ' +
              response.status.description +
              '\n' +
              response.status.details
          )
          return
        }
        // res.status(200).json(response.outputs[0].data.concepts)
        resolve(response.outputs[0].data.concepts)
      }
    )
  })
}

module.exports = predictImage
