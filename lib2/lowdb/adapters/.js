const fs = require('fs')
const chalk = require('chalk')

global.baileys = require('@whiskeysockets/baileys') 
global.adiwajshing = require('@adiwajshing/baileys') 
global.wawebjs = require('@library/wawebjs') 

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})