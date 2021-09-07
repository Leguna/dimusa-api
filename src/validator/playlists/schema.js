const Joi = require('joi')

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required()
})
const PostPlaylistWithIdPayloadSchema = Joi.object({
  songId: Joi.string().min(21).max(21).required()
})

module.exports = { PostPlaylistPayloadSchema, PostPlaylistWithIdPayloadSchema }
