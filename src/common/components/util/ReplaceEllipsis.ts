export function replaceEllipsisAfterWords(text: string, wordCount: number) {  
    if (text.length <= wordCount) {
      return text;
    }
    
    return text.replace(text, text.substring(0, wordCount) + '...');
  }