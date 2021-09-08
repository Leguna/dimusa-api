const Joi = require('joi')

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().min(25).max(25).required(),
  userId: Joi.string().min(21).max(21).required()
})

module.exports = { CollaborationPayloadSchema }
