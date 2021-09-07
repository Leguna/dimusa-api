const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'songsapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'songsapp_jwt'
    }
  },
  // {
  //   method: 'GET',
  //   path: '/playlists/{playlistId}',
  //   handler: handler.getSongByIdHandler
  // },
  // {
  //   method: 'PUT',
  //   path: '/playlists/{playlistId}',
  //   handler: handler.putSongByIdHandler
  // },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'songsapp_jwt'
    }
  }
]

module.exports = routes
