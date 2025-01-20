export default function slugify(text: string | undefined | null) {
  if (!text) {
    console.warn("Invalid input for slugify:", text); // Debugging log
    return "";
  }

  return text
    .toString()
    .toLowerCase()
    .trim() // Trim whitespace from both sides of the string
    .replace(/\s+/g, "-") // Replace spaces with a dash
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-"); // Replace multiple dashes with a single dash
}
