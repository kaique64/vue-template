export function toUpperCase(text: string) {
    let result = "";

    for (let i = 0; i < text.length; i++) {
        const character = text[i];
        const codeCharacter = character.charCodeAt(0);

        if (codeCharacter >= 97 && codeCharacter <= 122) {
            result += String.fromCharCode(codeCharacter - 32);
        } else {
            result += character;
        }
    }

    return result;
}
