export function parseKebabToCamelCase(attributeKey: string): string {
  return attributeKey
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
