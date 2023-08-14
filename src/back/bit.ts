const orOperation = (a: Buffer, b: Buffer) => {
  let i = Math.max(a.byteLength, b.byteLength);

  const dest = Buffer.allocUnsafe(i);

  while (i--) {
    dest[i] = a[i] | b[i];
  }
  return dest;
};
const andOperation = (a: Buffer, b: Buffer) => {
  let i = Math.max(a.byteLength, b.byteLength);

  const dest = Buffer.allocUnsafe(i);

  while (i--) {
    dest[i] = a[i] & b[i];
  }
  return dest;
};
const notOperation = (a: Buffer) => {
  let i = a.byteLength;

  const dest = Buffer.allocUnsafe(i);

  while (i--) {
    dest[i] = ~a[i];
  }
  return dest;
};
const offBits = (a: Buffer, b: Buffer) => {
  return andOperation(a, notOperation(b));
};
const isEmpty = (x: Buffer) => {
  return x.every((v) => v == 0x00);
};

export { orOperation, andOperation, notOperation, offBits, isEmpty };
