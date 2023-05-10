export const splitToChunks = <T>(arr: T[], chunkSize: number): Array<Array<T>> => {
  const result: Array<Array<T>> = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}