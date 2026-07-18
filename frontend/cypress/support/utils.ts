export function uniqueEmail(): string {
  return `cypress_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}
