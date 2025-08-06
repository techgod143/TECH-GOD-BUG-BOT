const axios = require('axios');
const BodyForm = require('form-data');
const { fromBuffer } = require('file-type');
const fetch = require('node-fetch');
const fs = require('fs');
const cheerio = require('cheerio');

async function TelegraPh(Path) {
  if (!fs.existsSync(Path)) {
    throw new Error("File not Found");
  }

  const form = new BodyForm();
  form.append("file", fs.createReadStream(Path));

  try {
    const { data } = await axios.post("https://telegra.ph/upload", form, {
      headers: form.getHeaders(),
    });
    return "https://telegra.ph" + data[0].src;
  } catch (err) {
    throw new Error(String(err));
  }
}


async function UploadFileUgu(input) {
  const form = new BodyForm();
  form.append("files[]", fs.createReadStream(input));

  try {
    const { data } = await axios.post("https://uguu.se/upload.php", form, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        ...form.getHeaders(),
      },
    });

    return data.files[0];
  } catch (err) {
    throw err;
  }
}

async function webp2mp4File(path) {
  const form = new BodyForm();
  form.append('new-image-url', '');
  form.append('new-image', fs.createReadStream(path));

  try {
    const { data } = await axios.post('https://s6.ezgif.com/webp-to-mp4', form, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
      },
    });

    const bodyFormThen = new BodyForm();
    const $ = cheerio.load(data);
    const file = $('input[name="file"]').attr('value');
    bodyFormThen.append('file', file);
    bodyFormThen.append('convert', "Convert WebP to MP4!");

    const { data: secondData } = await axios.post('https://ezgif.com/webp-to-mp4/' + file, bodyFormThen, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`,
      },
    });

    const $2 = cheerio.load(secondData);
    const result = 'https:' + $2('div#output > p.outfile > video > source').attr('src');

    return {
      status: true,
      message: "Created By Zetsuboxygen",
      result: result
    };
  } catch (err) {
    throw err;
  }
}

async function floNime(medianya, options = {}) {
  const { ext } = await fromBuffer(medianya) || options.ext;
  var form = new BodyForm();
  form.append('file', medianya, 'tmp.' + ext);
  let response = await fetch('https://flonime.my.id/upload', {
    method: 'POST',
    body: form
  });
  let jsonnya = await response.json();
  return jsonnya;
}

module.exports = { TelegraPh, UploadFileUgu, webp2mp4File, floNime };
