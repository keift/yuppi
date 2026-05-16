export const pascalCase = (text: string) =>
  text
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
