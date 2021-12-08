class UploadsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUploadPictureHandler = this.postUploadPictureHandler.bind(this)
  }

  async postUploadPictureHandler (request, h) {
    try {
      const { data } = request.payload

      this._validator.validatePictureHeaders(data.hapi.headers)

      const filename = await this._service.writeFile(data, data.hapi)

      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = UploadsHandler
