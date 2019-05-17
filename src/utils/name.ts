export const separateName = (name: string) => {
  const nameList = name.split(/\s+/);
  const [firstName, ...lastNameList] = nameList;
  const lastName = lastNameList.join(' ');

  return { firstName, lastName, nameList };
};
