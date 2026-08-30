/**
 * Clipboard write with a fallback for older browsers.
 *
 * Safari only allows this inside a direct user gesture, so call it synchronously
 * from the click handler — never after an `await`.
 */
export function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => legacyCopy(text),
    );
  }

  return Promise.resolve(legacyCopy(text));
}

function legacyCopy(text: string): boolean {
  const field = document.createElement("textarea");

  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  field.remove();

  return copied;
}
