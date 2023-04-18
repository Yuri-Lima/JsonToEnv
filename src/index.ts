import fs from 'node:fs';
import { Set_Env, Options } from './types/types';

type T = keyof typeof Object; // TODO: fix this

/**
 * @description: This function will read the env.json file and set the env variables
 * @param {string} readFileFrom - The path of the env.json file
 *
 */
export default class JsonToEnv {
  protected set: Set_Env;
  protected options: Options;
  protected content:string = '';
  protected obj:any;
  protected objectobecomeJson: Object = {};

  constructor(set: Set_Env, options: Options) {
    this.set = set;
    this.options = options;

    /**
     * If the class is not instantiated, return a new instance.
     * This is useful for the static methods.
     */
     if (!(this instanceof JsonToEnv)) {
      return new JsonToEnv(set, options);
    }
    /**
     * @description: Set the default options
     * @returns void
     */
    this._setDefaultsOptions(this.options);
    
    if(this.options.log) {
      console.log('JsonToEnv is running...');
    }

    if(!this.set.readFileFrom) {
      throw new Error('Please provide a path to read the file from');
    }

    if(!this.set.saveFileTo) {
      throw new Error('Please provide a path to save the file to');
    }
    
    this._verify();
    this._readFile();
    this._setObjects();
  }

  /**
   * @description: Default options
   */
   _setDefaultsOptions(opt: Options) {
    opt.overWrite_Original_Env = opt.overWrite_Original_Env || false;
    opt.createJsonFile = opt.createJsonFile || false;
    opt.createEnvFile = opt.createEnvFile || false;
    opt.log = opt.log || true;
   }

   /**
   * @description: Make sure the file exists
   * @returns void
   */
  _verify(): void {
    if (!fs.existsSync(this.set.readFileFrom)) { // Check if the file exists
      if(this.options.log) {
        console.log(`The file path doesn't exist: ${this.set.readFileFrom}`);
      }
      throw new Error(`The file path doesn't exist`);
    }
  }

  _readFile(): string {
    const pathFile = this.set.readFileFrom;
    this.content = fs.readFileSync(pathFile, 'utf8');
    return this.content;
  }

  _setObjects(): void {
    this.obj = JSON.parse(this.content);
  }

  _getObjecKeys(obj:any):string[] {
    return Object.keys(obj as Object);
  }

  _getObjecValues(obj:any):string[] {
    return Object.values(obj as Object);
  }

  /**
   * @description: This function will return the extension of the file
   * @returns string
   */
  private getExtension(): string {
    return String(this.set.readFileFrom.split('.').pop());
  }
  /**
   * @description: This function will return the file name
   * @returns string
   */
  private getFileName(): string {
    return String(this.set.readFileFrom.split('.').shift());
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

  public setEnv(): void {
    if (!this.obj) {
      throw new Error('obj is not defined');
    }
    // console.log('obj: ', this.obj);
    const env:string[] = [];
    // First level
    for (const key in this.obj) {
      // Second level
      if (this.obj[key] instanceof Object) {
        for (const subKey in this.obj[key]) {
          // Third level
          if (this.obj[key][subKey] instanceof Object) {
            for (const thirdKey in this.obj[key][subKey]) {
              // Forth level
              if (this.obj[key][subKey][thirdKey] instanceof Object) {
                for (const fourthKey in this.obj[key][subKey][thirdKey]) {
                  // Fifth level
                  if (this.obj[key][subKey][thirdKey][fourthKey] instanceof Object) {
                    for (const fifthKey in this.obj[key][subKey][thirdKey][fourthKey]) {
                      if(typeof this.obj[key][subKey][thirdKey][fourthKey][fifthKey] === 'number'
                      || typeof this.obj[key][subKey][thirdKey][fourthKey][fifthKey] === 'boolean'
                      || typeof this.obj[key][subKey][thirdKey][fourthKey][fifthKey] === 'object'
                      ) {
                        this.objectobecomeJson = {
                          ...this.objectobecomeJson,
                          [`${String(key).toUpperCase()}_${String(subKey).toUpperCase()}_${String(thirdKey).toUpperCase()}_${String(fourthKey).toUpperCase()}_${String(fifthKey).toUpperCase()}`]: this.obj[key][subKey][thirdKey][fourthKey][fifthKey]
                        }
                        env.push(`${String(key).toUpperCase()}_${String(subKey).toUpperCase()}_${String(thirdKey).toUpperCase()}_${String(fourthKey).toUpperCase()}_${String(fifthKey).toUpperCase()}=${this.obj[key][subKey][thirdKey][fourthKey][fifthKey]}`);
                      } else {
                        this.objectobecomeJson = {
                          ...this.objectobecomeJson,
                          [`${String(key).toUpperCase()}_${String(subKey).toUpperCase()}_${String(thirdKey).toUpperCase()}_${String(fourthKey).toUpperCase()}_${String(fifthKey).toUpperCase()}`]: `'${this.obj[key][subKey][thirdKey][fourthKey][fifthKey]}'`
                        }
                        env.push(`${String(key).toUpperCase()}_${String(subKey).toUpperCase()}_${String(thirdKey).toUpperCase()}_${String(fourthKey).toUpperCase()}_${String(fifthKey).toUpperCase()}='${this.obj[key][subKey][thirdKey][fourthKey][fifthKey]}'`);
                      }
                    }
                  }else {
                    // set the env variable
                    // process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}`] = this.obj[key][subKey][thirdKey][fourthKey];
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
                }
              } else {
                // set the env variable
                // process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}`] = this.obj[key][subKey][thirdKey];
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
            // process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}`] =this.obj[key][subKey]; // Set key name plus sub key name
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
        // process.env[String(key).toLocaleUpperCase()] = this.obj[key]; // set env variable
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
      const destination = `${this.set.saveFileTo}.EnvJsonCreated.json`;

      if(this.options.log) console.log('Creating env.json file at: ', destination);
      
      fs.writeFileSync(
        destination,
        JSON.stringify(this.objectobecomeJson, null, 4),
      );
    }
    // Internal use to generate types definition for process.env
    const destination = `${__dirname}/.env.DoNotDelete.json`;    
    fs.writeFileSync(
      destination,
      JSON.stringify(this.objectobecomeJson, null, 4),
    );
    
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
        const destination = `${this.set.saveFileTo}_${random}`
        if (this.options.log) console.log(`Creating .env file at: `, destination);
        
        fs.writeFileSync(
          destination,
          env.join('\n'),
        );
      } else { // If the test is false, then it will over write the original .env file
        const destination = `${this.set.saveFileTo}`
        if(this.options.log) console.log('Creating .env file at: ', destination);
        fs.writeFileSync(
          destination,
          env.join('\n'),
        );
      }
    }
  }
}