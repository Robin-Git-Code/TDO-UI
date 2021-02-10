import { Injectable } from '@angular/core';

export type RichEditSpellcheckerCallback = (correct: boolean, suggestions: string[]) => void;

@Injectable({
  providedIn: 'root'
})
export class SpellcheckerService {
  private spellCheckerWorker?: Worker;
  private spellCheckerCallbacks: Record<number, RichEditSpellcheckerCallback> = {};
  private spellCheckerWorkerCommandId = 0;

  constructor() { }

  checkWordSpelling(word: string, callback: RichEditSpellcheckerCallback) {
    if (!this.spellCheckerWorker) {
      const myDictionary = JSON.parse(localStorage.getItem('myDictionary')) || [];
      this.spellCheckerWorker = new Worker('./spellchecker.worker', { type: 'module' });
      myDictionary.forEach(word => {
        this.spellCheckerWorker.postMessage({
          command: 'addWord',
          word,
        });
      });
      this.spellCheckerWorker.onmessage = e => {
        const savedCallback = this.spellCheckerCallbacks[e.data.id];
        delete this.spellCheckerCallbacks[e.data.id];
        savedCallback(e.data.isCorrect, e.data.suggestions);
      };
    }
    const currId = this.spellCheckerWorkerCommandId++;
    this.spellCheckerCallbacks[currId] = callback;
    this.spellCheckerWorker.postMessage({
      command: 'checkWord',
      word,
      id: currId,
    });
  }

  addWordToDictionary(word: string) {
    const myDictionary = JSON.parse(localStorage.getItem('myDictionary')) || [];
    myDictionary.push(word);
    localStorage.setItem('myDictionary', JSON.stringify(myDictionary));
    this.spellCheckerWorker.postMessage({
      command: 'addWord',
      word,
    });
  }
}
if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker('./spellchecker.worker', { type: 'module' });
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}