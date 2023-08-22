export const getEnumKeyByStringValue = function <T extends { [index: string]: any }>(
  myEnum: T,
  enumValue: string,
): keyof T | null {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x].toString() === enumValue);
  return keys.length > 0 ? keys[0] : null;
};

export const getLengthOfEnum = function <T extends { [index: string]: any }>(myEnum: T): number {
  let count = Object.keys(myEnum).filter((key) => isNaN(Number(key))).length;
  return count;
};

interface EnumEntry {
  key: string;
  value: string;
}

export const getEntriesFromEnum = <T extends { [index: string]: any }>(myEnum: T): EnumEntry[] =>
  Object.keys(myEnum)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      key: key,
      value: myEnum[key],
    }));
