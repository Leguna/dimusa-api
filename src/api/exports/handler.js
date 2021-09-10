class ExportsHandler {
  constructor (service, validator, playlistService) {
    this._service = service
    this._validator = validator
    this._playlistService = playlistService

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this)
  }

  async postExportPlaylistsHandler (request, h) {
    try {
      this._validator.validateExportPlaylistsPayload(request.payload)

      const credentialId = request.auth.credentials.id
      const playlistId = request.params.playlistId

      const message = {
        userId: credentialId,
        targetEmail: request.payload.targetEmail,
        playlistId
      }

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.sendMessage('export:playlists', JSON.stringify(message))

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses'
      })
      response.code(201)
      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = ExportsHandler
