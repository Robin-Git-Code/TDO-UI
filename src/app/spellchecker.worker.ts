/// <reference lib="webworker" />
import 'devexpress-richedit/dist/custom/nspell';
declare const NSpell: any;

let checkers: any[];

function checkWord(word: string) {
  for (const checker of checkers) {
    if (checker.correct(word)) {
      return true;
    }
  }
  return false;
}

addEventListener('message', ({ data }) => {
  if (!checkers) {
    checkers = [];
    NSpell.dictionaries.forEach(dic => {
      checkers.push(new NSpell.nspell(dic));
    });
  }
  switch (data.command) {
    case 'checkWord': {
      const isCorrect = checkWord(data.word);
      postMessage({
        id: data.id,
        isCorrect,
        suggestions: isCorrect ? undefined : checkers[0].suggest(data.word),
      });
      break;
    }
    case 'addWord': {
      checkers[0].add(data.word);
      break;
    }
  }
});