import { resolve, join } from 'node:path';
import fs from 'node:fs';
import Cache, {Options} from "node-cache";


interface Set_Env {
    fileName: string;
    filePath: string;
}
interface Options_Set_Env {
    updateNewJsonFile: boolean;
    createNewEnvFile: boolean;
    useCache: boolean;
    jsonFile?: any;
    json?: any;
    obj?: any;
}
/**
 * @description: This function will read the env.json file and set the env variables
 * @param {string} filePath - The path of the env.json file
 * 
 */
const a = async () => {

} 
class JsonToEnv {
  public set: Set_Env = {
    fileName: "",
    filePath: ""
  };
  public options: Options_Set_Env = {
    updateNewJsonFile: false,
    createNewEnvFile: false,
    useCache: false,
    jsonFile: "",
    json: {},
    obj: {}
  };
  private cache: Cache;

  constructor(set: Set_Env, options: Options_Set_Env) {
    this.set.fileName = set.fileName;
    this.set.filePath = set.filePath;
    this.options.updateNewJsonFile = options.updateNewJsonFile;
    this.options.createNewEnvFile = options.createNewEnvFile;
    this.options.useCache = options.useCache;

    this.options.jsonFile = options.jsonFile
      ? options.jsonFile
      : fs.readFileSync(resolve(this.set.filePath), "utf8");

    this.options.json = options.json || {};
    if(!(this.options.jsonFile instanceof Object)) {
        this.options.obj = options.obj
      ? options.obj
      : JSON.parse(this.options.jsonFile);
    }

    this.cache = new Cache();
    if(this.set.filePath !== "" || this.set.filePath !== undefined) {
        this.verify();
    }
    if (this.options.useCache) {
        this.hasChanged();
    }
  }
  /**
   * @description: Make sure the file exists
   * @returns void
   */
  private verify(): void {
    if (!fs.existsSync(this.set.filePath)) {
      throw new Error(`filePath: ${this.set.filePath} does not exist`);
    }
    if (this.cache === undefined) {
      throw new Error("Cache is not defined");
    }
  }
  /**
   * @description: This function will read the env.json file and set all of them in cache.
   * @returns
   */
  private setCache(): void {
    console.log("Setting cache...");
    this.cache.set(this.set.filePath, this.options.obj, 1000 * 60 * 60 * 24);
  }
  private hasChanged() {
    if (
      this.cache.get(this.set.filePath) === undefined ||
      this.cache.get(this.set.filePath) === null
    ) {
      this.setCache();
      return false;
    }
    if (this.cache.get(this.set.filePath) === this.options.obj) {
        console.log("No changes on .env file");
        return false;
    }
    return true;
  }
  public setEnv(): void {
    if (!this.options.obj) {
      throw new Error("obj is not defined");
    }
    let env:string[] = [];
    // Zero level
    for (let key in this.options.obj) {
      // First level
      if (this.options.obj[key] instanceof Object) {
        for (let subKey in this.options.obj[key]) {
            // Second level
            if(this.options.obj[key][subKey] instanceof Object) {
                for(let thirdKey in this.options.obj[key][subKey]) {
                    // Third level
                    if(this.options.obj[key][subKey][thirdKey] instanceof Object) {
                        for(let fourthKey in this.options.obj[key][subKey][thirdKey]) {
                            if(fourthKey === null) {
                                this.options.obj[key][subKey][thirdKey][fourthKey] = `"NOT DEFINED - The last value was ${fourthKey} - If you want to set this value, please set useNull: true"`;
                                // throw new Error(`${key} is not defined`);
                            }
                            if(fourthKey === undefined) {
                                this.options.obj[key][subKey][thirdKey][fourthKey] = `"NOT DEFINED - The last value was ${fourthKey} - If you want to set this value, please set useUndefined: true"`;
                                // throw new Error(`${key} is not defined`);
                            }
                            //set the env variable
                            process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}`] = this.options.obj[key][subKey][thirdKey][fourthKey];
                            if( typeof this.options.obj[key][subKey][thirdKey][fourthKey] === "number"   || 
                                typeof this.options.obj[key][subKey][thirdKey][fourthKey] === "boolean"  ||
                                typeof this.options.obj[key][subKey][thirdKey][fourthKey] === "object" // for null.             
                            ){
                                env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}=${this.options.obj[key][subKey][thirdKey][fourthKey]}`); 
                            }
                            else{
                                env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}_${String(fourthKey).toLocaleUpperCase()}="${this.options.obj[key][subKey][thirdKey][fourthKey]}"`); 
                            }
                        }

                    }
                    else {
                        // set the env variable
                        process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}`] = this.options.obj[key][subKey][thirdKey];
                        if( typeof this.options.obj[key][subKey][thirdKey] === "number"   || 
                            typeof this.options.obj[key][subKey][thirdKey] === "boolean"  ||
                            typeof this.options.obj[key][subKey][thirdKey] === "object" // for null.             
                        ){
                            env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}=${this.options.obj[key][subKey][thirdKey]}`); 
                        }
                        else{
                            env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}_${String(thirdKey).toLocaleUpperCase()}="${this.options.obj[key][subKey][thirdKey]}"`); 
                        }
                    }
                }
            }
            else{
                process.env[`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}`] =this.options.obj[key][subKey]; // Set key name plus sub key name
                if( typeof this.options.obj[key][subKey] === "number"   || 
                    typeof this.options.obj[key][subKey] === "boolean"  ||
                    typeof this.options.obj[key][subKey] === "object" // for null.             
                ){
                    env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}=${this.options.obj[key][subKey]}`); // Set key name plus sub key name
                }
                else {
                    env.push(`${String(key).toLocaleUpperCase()}_${String(subKey).toLocaleUpperCase()}="${this.options.obj[key][subKey]}"`); // Set key name plus sub key name
                }
            }
        }
      } else {
        process.env[String(key).toLocaleUpperCase()] = this.options.obj[key]; // set env variable
        if( typeof this.options.obj[key] === "number"   ||
            typeof this.options.obj[key] === "boolean"  ||
            typeof this.options.obj[key] === "object" ) {// for null. 
            env.push(`${String(key).toLocaleUpperCase()}=${this.options.obj[key]}`);// Push key name and value
        }
        else {
            env.push(`${String(key).toLocaleUpperCase()}="${this.options.obj[key]}"`);
        }
    }
    }
    /**
     * @description: If the env.json file has changed, then we need to write the new env.json file
     */
    if (this.options.updateNewJsonFile) {
      fs.writeFileSync(
        this.set.filePath,
        JSON.stringify(this.options.obj, null, 4)
      );
    }
    /**
     * @description: Write the new .env file
     */
    if(this.options.createNewEnvFile){
        fs.writeFileSync(
            `.env`,
            env.join("\n")
        );
    }
  }
}
/**
 * @description: This function will read the env.json file and set the env variables
 * @param {string} filePath - The path of the env.json file
 * @param {boolean} createNewJsonFile - If you want to create a new json file, set this to true
 * @param {boolean} useCache - If you want to use the cache to compare the previous json file and the new json file, set this to true
 * @param {boolean} useNull - If you want to set the value to null, set this to true
 * @param {boolean} useUndefined - If you want to set the value to undefined, set this to true
 * @param {string} jsonFile - If you want to directly set the json file
 * @param {string} json - If you want to directly set the json
 */
const fileName = "env.json";
const set = {
  fileName: fileName,
  filePath: join(__dirname, fileName),
};
const options ={
    updateNewJsonFile: false, // If you want to create a new json file, set this to true
    createNewEnvFile: true, // If you want to create a new env file, set this to true
    useCache: false // If you want to use the cache to compare the previous json file and the new json file
  }
const setEnv = new JsonToEnv(set, options);
setEnv.setEnv();
// console.log(process.env);
