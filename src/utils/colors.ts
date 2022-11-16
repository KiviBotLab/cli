export const colors = {
  red: colorful(31),
  green: colorful(32),
  yellow: colorful(33),
  blue: colorful(34),
  magenta: colorful(35),
  cyan: colorful(36),
  white: colorful(37)
}

/**
 * 控制台彩色字体
 *
 * @param {number} code - ANSI escape code
 */
function colorful(code: number) {
  return (msg: string) => `\u001b[${code}m${msg}\u001b[0m`
}
