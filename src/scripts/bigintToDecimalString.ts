
const bigintToDecimalString = (bigInt: bigint, decimals: bigint): string => {
    const bigIntString = bigInt.toString();
    const bigIntStringLength = bigIntString.length;
    const decimalIndex = bigIntStringLength - Number(decimals);
    return `${bigIntString.slice(0, decimalIndex)}.${bigIntString.slice(decimalIndex)}`;
  };

export default bigintToDecimalString;