export const encodeCursor = (cursorStr: string): string => {
  return Buffer.from(cursorStr).toString('base64');
};

export const decodeCursor = (cursorBase64: string): string => {
  return Buffer.from(cursorBase64, 'base64').toString('ascii');
};
