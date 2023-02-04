// this helper deals with semantic version strings like '1.2.3'
// in the form of Major.Minor.Patch

export function setMajor(round: number): string {
  return `${round.toFixed()}.0.0`;
}

export function updateMajor(round: number, current: string): string {
  const parts = current.split(".");
  return `${round.toFixed()}.${parts[1]}.${parts[2]}`;
}

export function setMinor(offerCount: number, current: string): string {
  const parts = current.split(".");
  return `${parts[0]}.${offerCount.toFixed()}.0`;
}

export function incMinor(current: string): string {
  const parts = current.split(".");
  const newMinor = (+(parts[1] || 0) + 1).toFixed();
  return `${parts[0]}.${newMinor}.0`;
}

export function updateMinor(newMinor: number, current: string): string {
  const parts = current.split(".");
  return `${parts[0]}.${newMinor.toFixed()}.${parts[2]}`;
}

export function incPatch(current: string): string {
  const parts = current.split(".");
  const newPatch = (+(parts[2] || 0) + 1).toFixed();
  return `${parts[0]}.${parts[1]}.${newPatch}`;
}

export function updatePatch(newPatch: number, current: string): string {
  const parts = current.split(".");
  return `${parts[0]}.${parts[1]}.${newPatch}`;
}
