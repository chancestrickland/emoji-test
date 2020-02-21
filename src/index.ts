import emojiList from './emoji-test';
import regexgen from 'regexgen';

const emojiTypeKeyMap = {
  component: '_et_c',
  'fully-qualified': '_et_f',
  'minimally-qualified': '_et_m',
  unqualified: '_et_u',
};

function getEmojiTestPatterns() {
  let result = {} as RegexResults;
  let emojiKeys = Object.keys(emojiList).sort(
    // Decreasing length (critical!)
    (a, b) => [...b].length - [...a].length
  );

  let trieAll = new regexgen.Trie();
  for (let key of emojiKeys) {
    trieAll.add(key);
  }
  result.all = '(?:' + trieAll.toString('u') + ')';

  let trieComponent = new regexgen.Trie();
  for (let key of emojiKeys) {
    if (emojiList[key] === emojiTypeKeyMap['component']) {
      trieComponent.add(key);
    }
  }
  result.component = '(?:' + trieComponent.toString('u') + ')';

  let trieKeyboard = new regexgen.Trie();
  for (let key of emojiKeys) {
    if (emojiList[key] === emojiTypeKeyMap['fully-qualified']) {
      trieKeyboard.add(key);
    }
  }
  result.keyboard = '(?:' + trieKeyboard.toString('u') + ')';

  let trieDisplay = new regexgen.Trie();
  for (let key of emojiKeys) {
    if (
      emojiList[key] === emojiTypeKeyMap['minimally-qualified'] ||
      emojiList[key] === emojiTypeKeyMap['unqualified']
    ) {
      trieDisplay.add(key);
    }
  }
  result.display = '(?:' + trieDisplay.toString('u') + ')';

  return result;
}

export type RegexResults = {
  all: string;
  display: string;
  component: string;
  keyboard: string;
};

export default getEmojiTestPatterns();
