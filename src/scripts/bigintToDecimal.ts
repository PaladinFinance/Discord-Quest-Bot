const bigintToDecimal = (bigInt: bigint, decimals: bigint): number => {
  const bigIntString = bigInt.toString();
  const bigIntStringLength = bigIntString.length;
  const decimalIndex = bigIntStringLength - Number(decimals);

  const string =
    bigIntString.slice(0, decimalIndex < 0 ? 0 : decimalIndex) +
    '.' +
    '0'.repeat(decimalIndex < 0 ? -decimalIndex : 0) +
    bigIntString.slice(decimalIndex < 0 ? 0 : decimalIndex);
  return Number(string);
};

export default bigintToDecimal;
