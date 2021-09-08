
class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postSongHandler = this.postSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
  }

  async postSongHandler ({ payload }, h) {
    try {
      this._validator.validateSongPayload(payload)

      const songId = await this._service.addSong(payload)

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId: songId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return error
    }
  }

  async getSongsHandler () {
    const songs = await this._service.getSongs()
    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongByIdHandler ({ params }, h) {
    try {
      const { songId } = params
      const song = await this._service.getSongById(songId)
      return {
        status: 'success',
        data: {
          song
        }
      }
    } catch (error) {
      return error
    }
  }

  async putSongByIdHandler (request, h) {
    try {
      this._validator.validateSongPayload(request.payload)
      const { songId } = request.params

      await this._service.editSongById(songId, request.payload)

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui'
      }
    } catch (error) {
      return error
    }
  }

  async deleteSongByIdHandler ({ params }, h) {
    try {
      const { songId } = params
      await this._service.deleteSongById(songId)

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus'
      }
    } catch (error) {
      return error
    }
  }
}

module.exports = SongsHandler
