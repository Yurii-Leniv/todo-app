// Each test uses a fresh, unique email so tests never collide with
// leftover data from a previous run against the same backend database.
export function uniqueEmail(): string {
  return `cypress_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}
