import { mergeWith, isArray } from 'lodash';

export const mergeWithConcat = (baseData: any, addedData: any) => {
  const newData = { ...baseData };

  mergeWith(newData, addedData, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });

  return newData;
};
