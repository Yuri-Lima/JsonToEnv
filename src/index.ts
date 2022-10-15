import { resolve, join } from 'node:path';
import fs from 'node:fs';
import simpleJson from './env.json';

export interface Set_Env {
    fileName: string;
    filePath: string;
}

export interface Options_Set_Env {
    test: boolean;
    createJsonFile: boolean;
    createEnvFile: boolean;
    jsonFile?: any;
    json?: any;
    obj?: any;
}
/**
 * @description: This function will read the env.json file and set the env variables
 * @param {string} filePath - The path of the env.json file
 *
 */
export class JsonToEnv {
  public set: Set_Env = {
    fileName: '',
    filePath: '',
  };

  public options:Options_Set_Env = {
    test: true,
    createJsonFile: false,
    createEnvFile: true,
    jsonFile: '',
    json: {},
    obj: {},
  };

  constructor(set: Set_Env, options: Options_Set_Env) {
    this.set.fileName = set.fileName;// 'env.json';
    this.set.filePath = set.filePath;// join(process.cwd(), this.set.fileName);
    this.options.test = options.test;
    this.options.createJsonFile = options.createJsonFile;
    this.options.createEnvFile = options.createEnvFile;
    this.options.jsonFile = options.jsonFile || '';
    this.options.json = options.json;
    /**
     * @description: Make sure the file exists
     */
    if (this.set.filePath === '' || this.set.filePath === undefined || this.set.fileName === '' || this.set.fileName === undefined) {
      throw new Error('File path or File name was not defined');
    }
    this.verify();
    // this.options.json?console.log('JsonToEnv: ', this.options.json):"";
    this.readFile();
  }

  private readFile(): void {
    if (this.options.jsonFile !== '') {
      // console.log('JsonToEnv: ', this.options.json);
      this.options.json = this.options.jsonFile;
      this.options.obj = JSON.parse(this.options.json);
    } else {
      const extencsion = this.getExtension();
      // console.log('extencsion: ', extencsion);
      if (extencsion === 'json') {
        this.options.json = fs.readFileSync(resolve(this.set.filePath), 'utf8');
        this.options.obj = JSON.parse(this.options.json);
      } else if (extencsion === 'js' || extencsion === 'ts') {
        const module = require(resolve(this.set.filePath)).default;
        this.options.json = JSON.stringify(module); // Module is a Object is the default export
        this.options.obj = module;
        // console.log('module: ', this.options.obj);
      }
    }
  }

  /**
   * @description: Make sure the file exists
   * @returns void
   */
  private verify(): void {
    /**
     * @description: Make sure the file exists
     * if not create a sample json file
     * @returns void
     */
    if (!fs.existsSync(resolve(this.set.filePath))) { // Check if the file exists
      const extencsion = this.getExtension();
      if (extencsion === 'json') {
        console.log(`Creating sample env.${extencsion} file...\nPath:`, this.set.filePath, '\n');
        fs.writeFileSync(resolve(this.set.filePath), JSON.stringify(simpleJson, null, 4));
      } else if (extencsion === 'js' || extencsion === 'ts') {
        console.log(`Creating sample env.${extencsion} file...\nPath:`, this.set.filePath, '\n');
        fs.writeFileSync(resolve(this.set.filePath), `export default ${JSON.stringify(simpleJson, null, '\t')}`, {
          encoding: 'utf8',
          flag: 'w',
        });
      }
    }
  }

  /**
   * @description: This function will return the extension of the file
   * @returns string
   */
  private getExtension(): string {
    return String(this.set.fileName.split('.').pop());
  }
  private getFileName(): string {
    return String(this.set.fileName.split('.').shift());
  }

  /**
   *
   * @param min - The minimum number.
   * @param max - The maximum number.
   * @returns number
   */
  private getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  private ArrayToStringToJson(arr:any):string {
    type ConvertToJson = {
      [key: string]: any
    };
    let envJson: ConvertToJson = {};
      for (const item of arr) {
        let [key, value]:string[] = item.split('=');
        value = value.replace(/'/g, '');
        envJson[key] = value;
      }
      // console.log('EnvJson', envJson);
      return JSON.stringify(envJson, null, 4);
  }

  public setEnv(): void {
    if (!this.options.obj) {
      throw new Error('obj is not defined');
    }
    const env:string[] = [];
    // Zero level
    for (const key in this.options.obj) {
      // First level
      if (this.options.obj[key] instanceof Object) {
        for (const subKey in this.options.obj[key]) {
          // Second level
          if (this.options.obj[key][subKey] instanceof Object) {
            for (const thirdKey in this.options.obj[key][subKey]) {
              // Third level
              if (this.options.obj[key][subKey][thirdKey] instanceof Object) {
                for (const fourthKey in this.options.obj[key][subKey][thirdKey]) {
                  if (fourthKey === null) {
                    this.options.obj[key][subKey][thirdKey][fourthKey] = `'NOT DEFINED - The last value was ${fourthKey} - If you want to set this value, please set useNull: true'`;
                    // throw new Error(`${key} is not defined`);
                  }
                  if (fourthKey === undefined) {
                    this.options.obj[key][subKey][thirdKey][fourthKey] = `'NOT DEFINED - The last value was ${fourthKey} - If you want to set this value, please set useUndefined: true'`;
                    // throw new Error(`${key} is not defined`);
                  }
                  // set the env variable
                  process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}`] = this.options.obj[key][subKey][thirdKey][fourthKey];
                  if (typeof this.options.obj[key][subKey][thirdKey][fourthKey] === 'number'
                  || typeof this.options.obj[key][subKey][thirdKey][fourthKey] === 'boolean'
                  || typeof this.options.obj[key][subKey][thirdKey][fourthKey] === 'object' // for null.
                  ) {
                    env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}=${this.options.obj[key][subKey][thirdKey][fourthKey]}`);
                  } else {
                    env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}='${this.options.obj[key][subKey][thirdKey][fourthKey]}'`)
                  }
                }
              } else {
                // set the env variable
                process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}`] = this.options.obj[key][subKey][thirdKey];
                if (typeof this.options.obj[key][subKey][thirdKey] === 'number'
                  || typeof this.options.obj[key][subKey][thirdKey] === 'boolean'
                  || typeof this.options.obj[key][subKey][thirdKey] === 'object' // for null.
                ) {
                  env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}=${this.options.obj[key][subKey][thirdKey]}`); 
                } else {
                  env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}='${this.options.obj[key][subKey][thirdKey]}'`); 
                }
              }
            }
          } else {
            process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}`] =this.options.obj[key][subKey]; // Set key name plus sub key name
            if (typeof this.options.obj[key][subKey] === 'number'
                || typeof this.options.obj[key][subKey] === 'boolean'
                || typeof this.options.obj[key][subKey] === 'object' // for null.
            ) {
              env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}=${this.options.obj[key][subKey]}`); // Set key name plus sub key name
            } else {
              env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}='${this.options.obj[key][subKey]}'`); // Set key name plus sub key name
            }
          }
        }
      } else {
        process.env[String(key).toLocaleUpperCase()] = this.options.obj[key]; // set env variable
        if (typeof this.options.obj[key] === 'number'
        || typeof this.options.obj[key] === 'boolean'
        || typeof this.options.obj[key] === 'object') { // for null.
          env.push(`${String(key).toLocaleUpperCase()}=${this.options.obj[key]}`);// Push key name and value
        } else {
          env.push(`${String(key).toLocaleUpperCase()}='${this.options.obj[key]}'`);
        }
      }
    }

    /**
     * @description: If the env.json file has changed, then we need to write the new env.json file
     */
    if (this.options.createJsonFile) {
      const envJson = this.ArrayToStringToJson(env);
      fs.writeFileSync(
        `${join(process.cwd(), `${this.getFileName()+".json"}`)}`,
        envJson
      );
    }
    
    /**
     * @description: Write the new .env file
     */
    /**
     * if createEnvFile is true and test is false, then create a new .env file overwriting the old one
     * if createEnvFile is true and test is true, then create a new .env file withouth overwriting the old one
     * if createEnvFile is false, then do not create a new .env file
     */
    if (this.options.createEnvFile) {
      if (this.options.test) {// If the test is true, then it will not over write the original .env file
        fs.writeFileSync(
          `.env.${this.getRandomInt(1, 100000)}`,
          env.join('\n'),
        );
      } else { // If the test is false, then it will over write the original .env file
        fs.writeFileSync(
          `${resolve(process.cwd(), '.env')}`,
          env.join('\n'),
        );
      }
    }
  }
}
