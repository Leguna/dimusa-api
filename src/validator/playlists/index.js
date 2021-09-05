const InvariantError = require('../../exceptions/InvariantError')
const { PostPlaylistPayloadSchema, PostPlaylistWithIdPayloadSchema } = require('./schema')

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePlaylistWithIdPayload: (payload) => {
    const validationResult = PostPlaylistWithIdPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator
