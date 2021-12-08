require('dotenv').config()
const amqp = require('amqplib')
const NotesService = require('./PlaylistsService')
const MailSender = require('./MailSender')
const Listener = require('./listener')

const init = async () => {
  const playlistsService = new NotesService()
  const mailSender = new MailSender()
  const listener = new Listener(playlistsService, mailSender)

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
  const channel = await connection.createChannel()

  await channel.assertQueue('export:playlists', {
    durable: true
  })

  channel.consume('export:playlists', listener.listen, { noAck: true })
  console.log("Start Consumer.");
}

init()
