//base by DGXeon (Xeon Bot Inc.)
//re-upload? recode? copy code? give credit ya :)
//YouTube: @DGXeon
//Instagram: unicorn_xeon13
//Telegram: @DGXeon
//GitHub: @DGXeon
//WhatsApp: +916909137213
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@DGXeon
//telegram channel: https://t.me/+WEsVdEN2B9w4ZjA9


const { proto, delay, getContentType } = require('@adiwajshing/baileys')
const chalk = require('chalk')
const axios = require('axios');
const { sizeFormatter } = require('human-readable');
const fs = require("fs");
const Jimp = require("jimp");

// exports serialize
exports.serialize = (ptz, m) => {
m.isGroup = m.key.remoteJid.endsWith('@g.us')
try{
const berak = Object.keys(m.message)[0]
m.type = berak
} catch {
m.type = null
}
try{
const context = m.message[m.type].contextInfo.quotedMessage
if(context["ephemeralMessage"]){
m.quotedMsg = context.ephemeralMessage.message
}else{
m.quotedMsg = context
}
m.isQuotedMsg = true
m.quotedMsg.sender = m.message[m.type].contextInfo.participant
m.quotedMsg.fromMe = m.quotedMsg.sender === ramz.user.id.split(':')[0]+'@s.whatsapp.net' ? true : false
m.quotedMsg.type = Object.keys(m.quotedMsg)[0]
let ane = m.quotedMsg
m.quotedMsg.chats = (ane.type === 'conversation' && ane.conversation) ? ane.conversation : (ane.type == 'imageMessage') && ane.imageMessage.caption ? ane.imageMessage.caption : (ane.type == 'documentMessage') && ane.documentMessage.caption ? ane.documentMessage.caption : (ane.type == 'videoMessage') && ane.videoMessage.caption ? ane.videoMessage.caption : (ane.type == 'extendedTextMessage') && ane.extendedTextMessage.text ? ane.extendedTextMessage.text : (ane.type == 'buttonsMessage') && ane.buttonsMessage.contentText ? ane.buttonsMessage.contentText : ""
m.quotedMsg.id = m.message[m.type].contextInfo.stanzaId
}catch{
m.quotedMsg = null
m.isQuotedMsg = false
}

try{
const mention = m.message[m.type].contextInfo.mentionedJid
m.mentioned = mention
}catch{
m.mentioned = []
}
    
if (m.isGroup){
m.sender = m.participant
}else{
m.sender = m.key.remoteJid
}
if (m.key.fromMe){
m.sender = ptz.user.id.split(':')[0]+'@s.whatsapp.net'
}

m.from = m.key.remoteJid
m.now = m.messageTimestamp
m.fromMe = m.key.fromMe

return m
}

exports.randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

exports.color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)

}
exports.getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
     }

exports.generateProfilePicture = async (buffer) => {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
  };
};

exports.getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}


exports.toRupiah = function(x){
x = x.toString()
var pattern = /(-?\d+)(\d{3})/
while (pattern.test(x))
x = x.replace(pattern, "$1.$2")
return x
}

exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

exports.bytesToSize = (bytes, decimals = 2) => {
if (bytes === 0) return '0 Bytes';
const k = 1024;
const dm = decimals < 0 ? 0 : decimals;
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

exports.msToDate = (ms) => {
  let years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
  let months = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );
  let weeks = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7)
  );
  let days = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
  );
  return `${years} tahun ${months} bulan ${weeks} minggu ${days} hari`;
};

exports.msToDay = (ms) => {
  let temp = ms;
  let years = Math.floor(temp / (365 * 24 * 60 * 60 * 1000));
  temp = temp % (365 * 24 * 60 * 60 * 1000);
  let months = Math.floor(temp / (30 * 24 * 60 * 60 * 1000));
  temp = temp % (30 * 24 * 60 * 60 * 1000);
  let weeks = Math.floor(temp / (7 * 24 * 60 * 60 * 1000));
  temp = temp % (7 * 24 * 60 * 60 * 1000);
  let days = Math.floor(temp / (24 * 60 * 60 * 1000));
  temp = temp % (24 * 60 * 60 * 1000);
  let hours = Math.floor(temp / (60 * 60 * 1000));
  temp = temp % (60 * 60 * 1000);
  let minutes = Math.floor(temp / (60 * 1000));
  temp = temp % (60 * 1000);

  let result = "";
  if (years > 0) {
    result += years + (years > 1 ? " tahun " : " tahun ");
  }
  if (months > 0) {
    result += months + (months > 1 ? " bulan " : " bulan ");
  }
  if (weeks > 0) {
    result += weeks + (weeks > 1 ? " minggu " : " minggu ");
  }
  if (days > 0) {
    result += days + (days > 1 ? " hari " : " hari ");
  }
  if (hours > 0) {
    result += hours + (hours > 1 ? " jam " : " jam ");
  }
  if (minutes > 0) {
    result += minutes + (minutes > 1 ? " menit " : " menit ");
  }
  return result.trim();
};

exports.checkBandwidth = async () => {
let ind = 0;
let out = 0;
for (let i of await require("node-os-utils").netstat.stats()) {
ind += parseInt(i.inputBytes);
out += parseInt(i.outputBytes);
}
return {
download: exports.bytesToSize(ind),
upload: exports.bytesToSize(out),
};
};

exports.formatSize = (bytes) => {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes === 0) return '0 Bytes';
const i = Math.floor(Math.log(bytes) / Math.log(1024));
return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

exports.getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

exports.getBuffer = async (url, options) => {
try {
options = options || {};
const res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
});
return res.data;
} catch (err) {
return err;
}
};

exports.isUrl = (url) => {
return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
};

exports.jsonformat = (string) => {
return JSON.stringify(string, null, 2);
};

exports.nganuin = async (url, options) => {
try {
options = options || {};
const res = await axios({
method: 'GET',
url: url,
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
},
...options
});
return res.data;
} catch (err) {
return err;
}
};

exports.pickRandom = (ext) => {
return `${Math.floor(Math.random() * 10000)}${ext}`;
};

exports.runtime = function (seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600 * 24));
var h = Math.floor(seconds % (3600 * 24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);
var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
return dDisplay + hDisplay + mDisplay + sDisplay;
};

exports.shorturl = async function shorturl(longUrl) {
try {
const data = { url: longUrl };
const response = await axios.post('https://shrtrl.vercel.app/', data);
return response.data.data.shortUrl;
} catch (error) {
return error;
}
};

exports.msToTime = (ms) => {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h + ' Jam ', m + ' Menit ', s + ' Detik'].map(v => v.toString().padStart(2, 0)).join(' ')
}
    
exports.msToHour = (ms) => {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
return [h + ' Jam '].map(v => v.toString().padStart(2, 0)).join(' ')
}
    
exports.msToMinute = (ms) => {
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
return [m + ' Menit '].map(v => v.toString().padStart(2, 0)).join(' ')
}
    
exports.msToSecond = (ms) => {
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [s + ' Detik'].map(v => v.toString().padStart(2, 0)).join(' ')
}


exports.fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}
exports.clockString = (ms) => {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}

exports.formatp = sizeFormatter({
std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
decimalPlaces: 2,
keepTrailingZeroes: false,
render: (literal, symbol) => `${literal} ${symbol}B`
});

exports.smsg = (ptz, m, store) => {
    try {
if (!m) return m;
let M = proto.WebMessageInfo;
if (m.key) {
m.id = m.key.id;
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
m.chat = m.key.remoteJid;
m.fromMe = m.key.fromMe;
m.isGroup = m.chat.endsWith('@g.us');
m.sender = ptz.decodeJid(m.fromMe && ptz.user.id || m.participant || m.key.participant || m.chat || '');
if (m.isGroup) m.participant = ptz.decodeJid(m.key.participant) || '';
}
if (m.message) {
m.mtype = getContentType(m.message);
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text;
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null;
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
if (m.msg.caption) {
m.caption = m.msg.caption;
}
if (m.quoted) {
let type = Object.keys(m.quoted)[0];
m.quoted = m.quoted[type];
if (['productMessage'].includes(type)) {
type = Object.keys(m.quoted)[0];
m.quoted = m.quoted[type];
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
};
m.quoted.mtype = type;
m.quoted.id = m.msg.contextInfo.stanzaId;
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false;
m.quoted.sender = ptz.decodeJid(m.msg.contextInfo.participant);
m.quoted.fromMe = m.quoted.sender === ptz.decodeJid(ptz.user.id);
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false;
let q = await store.loadMessage(m.chat, m.quoted.id, ptz);
return smsg(ptz, q, store);
};
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
});
m.quoted.delete = () => ptz.sendMessage(m.quoted.chat, { delete: vM.key });
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => ptz.copyNForward(jid, vM, forceForward, options);
m.quoted.download = () => ptz.downloadMediaMessage(m.quoted);
}
}
if (m.msg.url) m.download = () => ptz.downloadMediaMessage(m.msg);
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || '';
m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? ptz.sendMedia(chatId, text, 'file', '', m, { ...options }) : ptz.sendText(chatId, text, m, { ...options });
m.copy = () => smsg(ptz, M.fromObject(M.toObject(m)));
m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => ptz.copyNForward(jid, m, forceForward, options);
ptz.appenTextMessage = async(text, chatUpdate) => {
let messages = await generateWAMessage(m.chat, { text: text, mentions: m.mentionedJid }, {
userJid: ptz.user.id,
quoted: m.quoted && m.quoted.fakeObj
});
messages.key.fromMe = areJidsSameUser(m.sender, ptz.user.id);
messages.key.id = m.key.id;
messages.pushName = m.pushName;
if (m.isGroup) messages.participant = m.sender;
let msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)],
type: 'append'
};
ptz.ev.emit('messages.upsert', msg);
};

return m;
        } catch (e) {
            
        }
};

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
