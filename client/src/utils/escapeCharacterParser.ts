export const parseEscapedCharacters = (escapedCharacter: string): string => {
  const parser = new DOMParser();
  return parser.parseFromString(`<!doctype html><body>${escapedCharacter}`, 'text/html').body
    .textContent;
};
