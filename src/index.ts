import { resolve, join } from 'node:path';
import fs from 'node:fs';

export interface Set_Env {
    fileName: string;
    readFileFrom: string;
    saveFileTo: string;
}

export interface Options_Set_Env {
    overWrite_Original_Env: boolean;
    createJsonFile: boolean;
    createEnvFile: boolean;
    log: boolean;
}
/**
 * @description: This function will read the env.json file and set the env variables
 * @param {string} readFileFrom - The path of the env.json file
 *
 */
export class JsonToEnv {
  private file: any;
  private obj:any = {};
  private objectobecomeJson:{} = {};
  private writeTo:string = '';
  private sourcePath:string = '';
  public set: Set_Env = {
    fileName: '',
    readFileFrom: '',
    saveFileTo: '',
  };

  /**
   * @description: Default options
   */
  public options:Options_Set_Env = {
    overWrite_Original_Env: false,
    createJsonFile: true,
    createEnvFile: true,
    log: true,
  };

  constructor(set: Set_Env, options: Options_Set_Env) {
    this.set.fileName = set.fileName;
    this.set.readFileFrom = set.readFileFrom;
    this.writeTo = set.saveFileTo;
    this.options.overWrite_Original_Env = options.overWrite_Original_Env;
    this.options.createJsonFile = options.createJsonFile;
    this.options.createEnvFile = options.createEnvFile;
    this.options.log = options.log;
    this.sourcePath = join(this.set.readFileFrom,`${this.getFileName()}.${this.getExtension()}`);
    /**
     * @description: Make sure the file exists
     */
    if (this.set.readFileFrom === '' || this.set.readFileFrom === undefined || this.set.fileName === '' || this.set.fileName === undefined) {
      throw new Error('File path or File name was not defined');
    }
    /**
     * @description: Make sure the file exists
     * if not create a sample json file
     * @returns void
     */
    this.verify(); // Make sure the file exists
    this.readFile(); // Read the file
  }

  private readFile(): void {
    const extencsion = this.getExtension();
    const path = this.sourcePath;
    if (extencsion === 'json') {
      this.file = fs.readFileSync(path, 'utf8');
      this.obj = JSON.parse(this.file);
    } else if (extencsion === 'js' || extencsion === 'ts') {
      const module = require(path).default;
      this.file = JSON.stringify(module); // Module is a Object is the default export
      this.obj = module;
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
    const path = this.sourcePath;
    if (!fs.existsSync(path)) { // Check if the file exists
      const extencsion = this.getExtension();
      if (extencsion === 'json') {
        if(this.options.log) {
          console.log('File does not exist, creating a sample json file');
          console.log(`Creating sample env.${extencsion} file...\nPath:`, path, '\n');
        }
        fs.writeFileSync(path, JSON.stringify({"test_Json":"ok"}, null, 4));
      } else if (extencsion === 'js' || extencsion === 'ts') {
        if(this.options.log) {
          console.log(`File does not exist, creating a sample ${extencsion} file`);
          console.log(`Creating sample env.${extencsion} file...\nPath:`, path, '\n');
        }
        fs.writeFileSync(path, `export default ${JSON.stringify({"test":"ok"}, null, '\t')}`, {
          encoding: 'utf8',
          flag: 'w',
        });
      }
    } else {
      if(this.options.log) {
        console.log('File exists');
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
  /**
   * @description: This function will return the file name
   * @returns string
   */
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
        // console.log(item.split('=',1));
        let [key, value]:string[] = item.split('=',2);
        value = value.replace(/'/g, '');
        envJson[key] = value;
      }
      // console.log('EnvJson', envJson);
      return JSON.stringify(envJson, null, 4);
  }

  public setEnv(): void {
    if (!this.obj) {
      throw new Error('obj is not defined');
    }
    // console.log('obj: ', this.obj);
    const env:string[] = [];
    // Zero level
    for (const key in this.obj) {
      // First level
      if (this.obj[key] instanceof Object) {
        for (const subKey in this.obj[key]) {
          // Second level
          if (this.obj[key][subKey] instanceof Object) {
            for (const thirdKey in this.obj[key][subKey]) {
              // Third level
              if (this.obj[key][subKey][thirdKey] instanceof Object) {
                for (const fourthKey in this.obj[key][subKey][thirdKey]) {
                  if (fourthKey === null) {
                    this.obj[key][subKey][thirdKey][fourthKey] = `'NOT DEFINED - The last value was ${fourthKey} - If you want to set this value, please set useNull: true'`;
                    // console.log('The last value was null, if you want to set this value, please set useNull: true');
                    // throw new Error(`${key} is not defined`);
                  }
                  if (fourthKey === undefined) {
                    this.obj[key][subKey][thirdKey][fourthKey] = `'NOT DEFINED - The last value was ${fourthKey} - If you want to set this value, please set useUndefined: true'`;
                    console.log(`${key} is not defined`);
                    // throw new Error(`${key} is not defined`);
                  }
                  // set the env variable
                  process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}`] = this.obj[key][subKey][thirdKey][fourthKey];
                  if (typeof this.obj[key][subKey][thirdKey][fourthKey] === 'number'
                  || typeof this.obj[key][subKey][thirdKey][fourthKey] === 'boolean'
                  || typeof this.obj[key][subKey][thirdKey][fourthKey] === 'object' // for null.
                  ) {
                    this.objectobecomeJson = {
                      ...this.objectobecomeJson,
                      [`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}`]: this.obj[key][subKey][thirdKey][fourthKey],
                    };
                    env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}=${this.obj[key][subKey][thirdKey][fourthKey]}`);
                  } else {
                    this.objectobecomeJson ={
                      ...this.objectobecomeJson,
                      [`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}`]: `${this.obj[key][subKey][thirdKey][fourthKey]}`,
                    }
                    env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}='${this.obj[key][subKey][thirdKey][fourthKey]}'`)
                  }
                }
              } else {
                // set the env variable
                process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}`] = this.obj[key][subKey][thirdKey];
                if (typeof this.obj[key][subKey][thirdKey] === 'number'
                  || typeof this.obj[key][subKey][thirdKey] === 'boolean'
                  || typeof this.obj[key][subKey][thirdKey] === 'object' // for null.
                ) {
                  this.objectobecomeJson = {
                    ...this.objectobecomeJson,
                    [`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}`]: this.obj[key][subKey][thirdKey],
                  };
                  env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}=${this.obj[key][subKey][thirdKey]}`); 
                } else {
                  this.objectobecomeJson = {
                    ...this.objectobecomeJson,
                    [`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}`]: `${this.obj[key][subKey][thirdKey]}`,
                  };
                  env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}='${this.obj[key][subKey][thirdKey]}'`);
                }
              }
            }
          } else {
            process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}`] =this.obj[key][subKey]; // Set key name plus sub key name
            if (typeof this.obj[key][subKey] === 'number'
                || typeof this.obj[key][subKey] === 'boolean'
                || typeof this.obj[key][subKey] === 'object' // for null.
            ) {
              this.objectobecomeJson = {
                ...this.objectobecomeJson,
                [`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}`]: this.obj[key][subKey],
              };
              env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}=${this.obj[key][subKey]}`); // Set key name plus sub key name
            } else {
              this.objectobecomeJson = {
                ...this.objectobecomeJson,
                [`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}`]: `${this.obj[key][subKey]}`,
              };
              env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}='${this.obj[key][subKey]}'`); // Set key name plus sub key name
            }
          }
        }
      } else {
        process.env[String(key).toLocaleUpperCase()] = this.obj[key]; // set env variable
        if (typeof this.obj[key] === 'number'
        || typeof this.obj[key] === 'boolean'
        || typeof this.obj[key] === 'object') { // for null.
          this.objectobecomeJson = {
            ...this.objectobecomeJson,
            [String(key).toLocaleUpperCase()]: this.obj[key],
          };
          env.push(`${String(key).toLocaleUpperCase()}=${this.obj[key]}`);// Push key name and value
        } else {
          this.objectobecomeJson = {
            ...this.objectobecomeJson,
            [String(key).toLocaleUpperCase()]: `${this.obj[key]}`,
          };
          env.push(`${String(key).toLocaleUpperCase()}='${this.obj[key]}'`);
        }
      }
    }

    /**
     * @description: If the env.json file has changed, then we need to write the new env.json file
     */
    if (this.options.createJsonFile) {
      if(this.options.log) {
        console.log('Creating env.json file at: ', this.sourcePath);
      }
      fs.writeFileSync(
        `${join(process.cwd(), "env.json")}`,
        JSON.stringify(this.objectobecomeJson, null, 4),
      );
    }
    
    /**
     * @description: Write the new .env file
     */
    /**
     * if createEnvFile is true and overWrite_Original_Env is true, then create a new .env file overwriting the old one
     * if createEnvFile is true and overWrite_Original_Env is false, then create a new .env file withouth overwriting the old one
     * if createEnvFile is false, then do not create a new .env file
     */
    if (this.options.createEnvFile) {
      if (!this.options.overWrite_Original_Env) {// If the test is true, then it will not over write the original .env file
        const random = this.getRandomInt(1, 100000)
        if (this.options.log) {
          console.log(`Creating .env.${random} file at: `, this.writeTo + `/.env.${random}`);
        }
        fs.writeFileSync(
          `${this.writeTo, `.env.${random}`}`,
          env.join('\n'),
        );
      } else { // If the test is false, then it will over write the original .env file
        if(this.options.log) {
          console.log('Creating .env file at: ', this.writeTo + '/.env');
        }
        fs.writeFileSync(
          `${this.writeTo, '.env'}`,
          env.join('\n'),
        );
      }
    }
  }
}