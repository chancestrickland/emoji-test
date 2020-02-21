const fs = require('fs');
const path = require('path');

const emojiTypeKeyMap: any = {
  component: '_et_c',
  'fully-qualified': '_et_f',
  'minimally-qualified': '_et_m',
  unqualified: '_et_u',
};

let text: string = fs.readFileSync(path.join(__dirname, 'emoji-test.txt'), {
  encoding: 'utf8',
});

for (let key of Object.keys(emojiTypeKeyMap)) {
  text = text.replace(new RegExp(`; ${key}`, 'g'), `; ${emojiTypeKeyMap[key]}`)
}

fs.writeFileSync(
  path.join(__dirname, '../src', 'emoji-test.ts'),
  [
    '// THIS IS A GENERATED FILE! Do not edit directly. See scripts/get-emoji-data.js',
    `type EmojiList = { [key: string]: string };`,
    `let list: EmojiList = ${JSON.stringify(getEmojiList(text))};`,
    `export default list;`,
  ].join('\n')
);

function getEmojiList(src: string) {
  let emojiList: { [key: string]: string } = {};
  let lines = src.split('\n');

  for (let line of lines) {
    if (line && line[0] !== '#') {
      let hashOffset = line.indexOf('#');
      let data = line.substring(0, hashOffset);
      let fields = data.split(';');
      let codePoints = fields[0].trim().split(' ');
      let status = fields[1].trim();
      let emojiString = '';
      for (let codePoint of codePoints) {
        emojiString += String.fromCodePoint(parseInt(codePoint, 16));
      }
      emojiList[emojiString] = status;
    }
  }
  return emojiList;
}
