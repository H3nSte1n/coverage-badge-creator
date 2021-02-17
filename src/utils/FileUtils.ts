import fs from 'fs';

export class FileUtils {
  static checkFileExist(filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false;
    return true;
  }
  static readFile(filePath: string): string {
    const file: string = fs.readFileSync(filePath, 'utf8');

    return file;
  }

  static parseFile<T>(fileBody: string): T {
    const file: T = JSON.parse(fileBody);

    return file;
  }

  static writeFile(path: string, content: string) {
    fs.writeFileSync(path, content, 'utf8');
  }
}
