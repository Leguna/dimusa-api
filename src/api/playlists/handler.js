const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this)
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this)
    this.deleteSongsFromPlaylistHandler = this.deleteSongsFromPlaylistHandler.bind(this)
  }

  async postPlaylistHandler (request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload)

      const { name } = request.payload
      const { id: credentialId } = request.auth.credentials
      const playlistId = await this._service.addPlaylist({ name, owner: credentialId })

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    try {
      const playlists = await this._service.getPlaylists(credentialId)
      return {
        status: 'success',
        data: {
          playlists
        }
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }
    }
  }

  async deletePlaylistByIdHandler (request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const { playlistId } = request.params
      await this._service.verifyPlaylistOwner(playlistId, credentialId)
      await this._service.deletePlaylistById(playlistId)

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async postSongToPlaylistHandler (request, h) {
    try {
      this._validator.validatePlaylistWithIdPayload(request.payload)

      const { playlistId } = request.params
      const { songId } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.addSongtoPlaylist(playlistId, songId)

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist'
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getSongsFromPlaylistHandler (request, h) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, credentialId)

    try {
      const songs = await this._service.getSongsFromPlaylist(playlistId, credentialId)
      return {
        status: 'success',
        data: {
          songs
        }
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }
    }
  }

  async deleteSongsFromPlaylistHandler (request, h) {
    try {
      this._validator.validatePlaylistWithIdPayload(request.payload)

      const { id: credentialId } = request.auth.credentials
      const { playlistId } = request.params
      const { songId } = request.payload

      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.deleteSongFromPlaylistById(playlistId, songId)

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = PlaylistsHandler
