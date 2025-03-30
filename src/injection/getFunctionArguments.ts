/**
 * Parsing function argument names
 */
export default (fn: Function): string[] => {
  let src = fn.toString();
  src = src.replace(/(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/gm, ""); // Remove comments
  src = src.replace("async", ""); // Remove 'async' if present

  const bi = src.indexOf("("); // Index of '('
  const ai = src.indexOf("=>"); // Index of arrow function '=>'

  // Check for arrow functions, extract arguments based on their position
  let args =
    ai > 0 && (ai < bi || bi < 0)
      ? src.slice(0, ai) // If arrow function, get everything before '=>'
      : src.slice(bi + 1, src.indexOf(")")); // Otherwise, get everything between '(' and ')'

  args = args.replace(/\s+/g, ""); // Remove whitespace

  return args ? args.split(",") : []; // Return argument names as an array
};
