/* For html and fsm files I use project_id as a key
    for a pdf files I use kb_id as a key
    blob text as a value for html and fsm
    url text a a value for a pdf
*/
export const addItemToCache = (key: string, value: string) => {
  if (sessionStorage.length >= 10) {
    const firstItem = sessionStorage.key(0);
    if (firstItem) sessionStorage.removeItem(firstItem);
    else console.log("sessionStorage element at index 0 doesn't exist");
  }
  sessionStorage.setItem(key, value);
};

export const isItemInCache = (key: string) => {
  if (!sessionStorage.getItem(key)) {
    return false;
  }
  return true;
};

export const getItemFromCache = (key: string) => {
  return sessionStorage.getItem(key);
};

export const removeItemFromCache = (key: string) => {
  return sessionStorage.removeItem(key);
};
