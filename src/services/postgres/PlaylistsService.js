const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
// const { mapDBToModel } = require('../../utils')

class PlaylistsService {
  constructor (collaborationService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
  }

  async addPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists as p
                LEFT JOIN collaborations as c ON c.playlist_id = p.id
                LEFT JOIN users as u ON u.id = p.owner
                WHERE p.owner = $1 OR u.id = $1 or c.user_id = $1
                 `,
      values: [owner]
    }
    try {
      const result = await this._pool.query(query)
      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
    }
  }

  async addSongtoPlaylist (playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist')
    }

    return result.rows[0].id
  }

  async getSongsFromPlaylist (id, owner) {
    const query = {
      text: `SELECT songs.id,title,performer FROM playlistsongs
              LEFT JOIN songs ON playlistsongs.song_id = songs.id
              LEFT JOIN playlists ON playlistsongs.playlist_id = playlists.id 
              WHERE (playlists.id = $1 or playlistsongs.playlist_id = $1)`,
      values: [id]
    }
    try {
      const result = await this._pool.query(query)

      if (!result.rowCount) {
        throw new NotFoundError('Playlist tidak ditemukan')
      }

      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async deleteSongFromPlaylistById (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist.')
    }
  }

  async verifyPlaylistOwner (playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
