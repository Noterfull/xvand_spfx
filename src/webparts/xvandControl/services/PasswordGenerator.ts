// export const generateSecurePassword = (): string => {
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
//   const length = 12;
//   const array = new Uint32Array(length);
//   window.crypto.getRandomValues(array);

//   return Array.from(array)
//     .map(x => characters[x % characters.length])
//     .join('');
// };

export const generateSecurePassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%&';
  const all = uppercase + lowercase + digits + special;

  const getRandom = (str: string): string =>
    str[Math.floor(Math.random() * str.length)];

  const length = 12;
  const required = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(digits),
    getRandom(special),
  ];

  const remainingLength = length - required.length;
  const array = new Uint32Array(remainingLength);
  window.crypto.getRandomValues(array);

  const rest = Array.from(array, x => all[x % all.length]);
  const full = [...required, ...rest];

  return full
    .sort(() => Math.random() - 0.5)
    .join('');
};