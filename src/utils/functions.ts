export const toggleItemInArray = (item: any, list: any[]) => {
  const updatedList = [...list];

  const index = updatedList.findIndex(v => v === item);
  if (index > -1) {
    updatedList.splice(index, 1);
  } else {
    updatedList.push(item);
  }

  return updatedList;
};
