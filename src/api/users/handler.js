
class UsersHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUserHandler = this.postUserHandler.bind(this)
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
  }

  async postUserHandler ({ payload }, h) {
    try {
      this._validator.validateUserPayload(payload)

      const userId = await this._service.addUser(payload)

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return error
    }
  }

  async getUserByIdHandler ({ params }, h) {
    try {
      const user = await this._service.getUserById(params)
      return {
        status: 'success',
        data: {
          user
        }
      }
    } catch (error) {
      return error
    }
  }
}

module.exports = UsersHandler
