export function orderByDate(array?: any[]) {
  return array?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
