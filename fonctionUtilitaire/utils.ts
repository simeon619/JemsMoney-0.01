export function isObjectNotEmpty(obj: any) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return true;
    }
  }
  return false;
}
