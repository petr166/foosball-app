import { mergeWith, isArray, uniqBy } from 'lodash';

export const mergeWithConcat = (
  baseData: any,
  addedData: any,
  uniqueProp?: string
) => {
  const newData = { ...baseData };

  mergeWith(newData, addedData, (objValue, srcValue) => {
    if (isArray(objValue)) {
      const fullArray = objValue.concat(srcValue);
      return uniqueProp ? uniqBy(fullArray, uniqueProp) : fullArray;
    }
  });

  return newData;
};
