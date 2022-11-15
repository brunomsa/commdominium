export function orderByDate<T>(array?: any[]): T[] {
  return array?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
