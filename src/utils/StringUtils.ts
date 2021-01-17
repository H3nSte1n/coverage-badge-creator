export class StringUtils {
  static replaceString(pattern: string | RegExp, replacement: string, area: string): string {
    return area.replace(pattern, replacement);
  }
}
