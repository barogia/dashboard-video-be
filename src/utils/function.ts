export function countOcurrences(array: string[]) {
  const obj = {};
  array.forEach((item) => {
    if (obj[item]) obj[item]++;
    else obj[item] = 1;
  });

  return obj;
}

export function sortOcurrences(data) {
  const arr = [] as { _id: string; count: number }[];
  for (const item in data) {
    const obj = { _id: item, count: data[item] };
    arr.push(obj);
  }

  // const sortable = arr.sort((a, b) => +b[1] - +a[1]);
  return arr.sort((a, b) => +b.count - +a.count);
  // return sortable.reduce((acc, cur) => {
  //   acc[cur[0]] = cur[1];
  //   return acc;
  // }, {});
}
