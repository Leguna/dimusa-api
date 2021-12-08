const { Pool } = require('pg')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getSongsFromPlaylists (userId,playlistId) {
    const query = {
      text: `SELECT songs.* FROM playlistsongs
              LEFT JOIN songs ON playlistsongs.song_id = songs.id
              LEFT JOIN playlists ON playlistsongs.playlist_id = playlists.id 
              WHERE (playlists.id = $1 or playlistsongs.playlist_id = $1)`,
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistsService
