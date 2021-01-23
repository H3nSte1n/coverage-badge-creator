import { DependencyOptionsInterface } from '../interfaces/DependencyOptionsInterface';
import { FileUtils } from '../utils/FileUtils';
import { Globals } from '../Globals';

export class SetupValidation {
  static scan() {
    console.info('\nStep 2 -> Setup check process started');

    return Promise.all([
      this.checkFileExists(Globals.DEFAULT_COV_PATH, '❌ No Coverage file found', '✅ Coverage file exist'),
      this.checkFileExists(Globals.BASE_README_PATH, '❌ No README file found', '✅ README file exist')
    ])
      .then((messages) => {
        console.info(messages.join('\n'));
      })
      .catch((errors) => {
        console.error(errors);
      });
  }

  static async loadConfig(): Promise<void> {
    console.info('\nStep 1 -> Loading Configurations process started');
    await Globals.loadArgv();
    const configExist = SetupValidation.checkIfConfigFileExists();
    if (!configExist) return;
    return this.parseConfig();
  }

  private static parseConfig(): Promise<void> {
    const fileBody = FileUtils.readFile(Globals.CONFIG_PATH);
    let config = null;

    return new Promise((resolve, reject) => {
      try {
        config = FileUtils.parseFile<DependencyOptionsInterface>(fileBody);
        Globals.init(config);
      } catch {
        console.error(`❌ Parsing configuration file failed. Configuration is incorrect.`);
        reject();
      }
      resolve();
      console.info('✅ Configuration loaded');
    });
  }

  private static checkIfConfigFileExists() {
    const fileExist = FileUtils.checkFileExist(Globals.CONFIG_PATH);
    if (!fileExist) {
      console.error(`❌ No Config file found\nSkip...`);
    } else {
      console.info(`✅ Config file exist`);
    }
    return !!fileExist;
  }

  private static checkFileExists(path: string, rejectMessage: string, resolveMessage: string) {
    return new Promise((resolve, reject) => {
      const fileExist = FileUtils.checkFileExist(path);
      if (!fileExist) reject(rejectMessage);
      resolve(resolveMessage);
    });
  }
}
