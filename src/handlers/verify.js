const QRCode = require('qrcode')
const UUID = require('uuid')
const Discord = require('discord.js')
const Canvas = require('canvas')
const { BRIGHT_ID_APP_DEEPLINK } = require('../endpoints')

const { QRCodeError } = require('../error-utils')
const verifiedUsers = require('../verifiedUsers')

// Component will render if user does not exist or is not sponsored
module.exports = async function verify(member) {
  const ID = UUID.v5(member.id, process.env.UUID_NAMESPACE)
  const role = member.guild.roles.cache.find(r => r.name === 'Verified')
  //   if (verifiedUsers["contextIds"].includes(ID)) {
  //     member.roles.add(role)
  //     member.send(`We recognized you! You're now a verified user in ${member.guild.name}`)
  //     return
  //   }
  const deepLink = `${BRIGHT_ID_APP_DEEPLINK}/${ID}`
  const generateQR = async uri => {
    try {
      const canvas = Canvas.createCanvas(700, 250)
      await QRCode.toCanvas(canvas, uri)
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        'qrcode.png',
      )
      member.send(`Connect with BrightID\n ${deepLink}`, attachment)
      member.send(
        'After linking in the BrghtID app, type the `!me` command in any channel to add the **Verified** role',
      )
    } catch (err) {
      console.log('err: ', err)
      throw new QRCodeError(`QRCode could not be generated from ${deepLink}`)
    }
  }
  await generateQR(deepLink)
}