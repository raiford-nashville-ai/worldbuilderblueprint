// Caller runs this after a field is visible. CSS owns its minimum/maximum size.
export function autoGrow(field) {
  const upperLimit = parseFloat(getComputedStyle(field).maxHeight) || Infinity;
  field.style.height = 'auto';
  field.style.height = `${Math.min(field.scrollHeight + 2, upperLimit)}px`;
  field.style.overflowY = field.scrollHeight > upperLimit ? 'auto' : 'hidden';
}
