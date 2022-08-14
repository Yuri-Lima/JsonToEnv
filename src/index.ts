import { resolve, join } from 'node:path';
import fs from 'node:fs';
import Cache, {Options} from "node-cache";
import simpleJson from "./env.json";
import { v4 as uuidv4 } from "uuid";

export interface Set_Env {
    fileName: string;
    filePath: string;
}
export interface Options_Set_Env {
    test: boolean;
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
export class JsonToEnv {
  public set: Set_Env = {
    fileName: "",
    filePath: ""
  };
  public options: Options_Set_Env = {
    test: false,
    updateNewJsonFile: false,
    createNewEnvFile: false,
    useCache: false,
    jsonFile: "",
    json: {},
    obj: {}
  };
  private cache: Cache;

  constructor(set: Set_Env, options: Options_Set_Env) {
    this.set.fileName = set.fileName;//"env.json";
    this.set.filePath = set.filePath;//join(process.cwd(), this.set.fileName);
    this.options.test = options.test;
    this.options.updateNewJsonFile = options.updateNewJsonFile;
    this.options.createNewEnvFile = options.createNewEnvFile;
    this.options.useCache = options.useCache;
    this.options.jsonFile = options.jsonFile || "";
    this.options.json = options.json || {};
    this.cache = new Cache();
    /**
     * @description: Make sure the file exists
     */
    if(this.set.filePath === "" || this.set.filePath === undefined || this.set.fileName === "" || this.set.fileName === undefined){
      throw new Error("File path or File name was not defined");
    }
    this.verify();
    if (this.options.useCache) {
        // this.hasChanged();
    }
    console.log("JsonToEnv: ", this.options.json);
    this.readFile();
  }
  private readFile(): void {
    if (this.options.jsonFile !== "") {    
      console.log("JsonToEnv: ", this.options.jsonFile);
      this.options.json = this.options.jsonFile;
      this.options.obj  = JSON.parse(this.options.json);
    }
    else{
      const extencsion = this.getExtension();
      // console.log("extencsion: ", extencsion);
      if(extencsion === "json"){
        this.options.json = fs.readFileSync(resolve(this.set.filePath), "utf8");
        this.options.obj  = JSON.parse(this.options.json);
      }
      else if(extencsion === "js" || extencsion === "ts"){
        const module = require(resolve(this.set.filePath)).default;
        this.options.json = JSON.stringify(module); //Module is a Object is the default export
        this.options.obj  = module;
        // console.log("module: ", this.options.obj);
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
    if (!fs.existsSync(resolve(this.set.filePath))) {
      const extencsion = this.getExtension();
      if(extencsion === "json"){
        console.log(`Creating sample env.${extencsion} file...\nPath:`, this.set.filePath, "\n");
        fs.writeFileSync(resolve(this.set.filePath), JSON.stringify(simpleJson, null, 4));
      }
      else if(extencsion === "js" || extencsion === "ts"){
        console.log(`Creating sample env.${extencsion} file...\nPath:`, this.set.filePath, "\n");
        fs.writeFileSync(resolve(this.set.filePath), `export default ${JSON.stringify(simpleJson, null, "\t")}`,{
          encoding: "utf8",
          flag: "w"
        });
    }
    if (this.cache === undefined) {
      throw new Error("Cache is not defined");
    }
  }
}
  /**
   * @description: This function will return the extension of the file
   * @returns string
   */
  private getExtension(): string {
    return String(this.set.fileName.split(".").pop());
  }
  /**
   * @description: This function will read the env.json file and set all of them in cache.
   * @returns
   */
  private setCache(): void {
    console.log("Setting cache...");
    this.cache.set(this.set.filePath, this.options.obj, 1000 * 60 * 60 * 24);
  }
  private hasChanged(): boolean {
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
    if (!this.options.obj) {
      throw new Error("obj is not defined");
    }
    let env:string[] = [];
    // console.log(this.options.obj);
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
    if (this.options.updateNewJsonFile){
      fs.writeFileSync(
        `${this.set.filePath}.${this.getRandomInt(1, 100000)}`,
        JSON.stringify(this.options.obj, null, "\t")
      );
    }
    // else{
    //   fs.writeFileSync(
    //     `${this.set.filePath}`,
    //     JSON.stringify(this.options.obj, null, "\t")
    //   );
    // }
    /**
     * @description: Write the new .env file
     */
    if(this.options.createNewEnvFile){
      if(this.options.test){
        fs.writeFileSync(
          `.env.${this.getRandomInt(1, 100000)}`,
          env.join("\n")
        );
      }
      else{
        fs.writeFileSync(
          `${resolve(process.cwd(), ".env")}`,
          env.join("\n")
        );
      }
    }

  }
}
// /**
//  * ATTENTION: If you dont want to overwrite your original .env file, set this to true
//  * @description: This function will read the env.json file and set the env variables
//  * @param {string} filePath - The path of the env.json file
//  * @param {boolean} test - ATTENTION: If you dont want to overwrite your original .env file, set this to true
//  * @param {boolean} createNewJsonFile - If you want to create a new json file, set this to true
//  * @param {boolean} useCache - If you want to use the cache to compare the previous json file and the new json file, set this to true
//  * @param {boolean} useNull - If you want to set the value to null, set this to true
//  * @param {boolean} useUndefined - If you want to set the value to undefined, set this to true
//  * @param {string} jsonFile - If you want to directly set the json file
//  * @param {string} json - If you want to directly set the json
//  */
// const fileName = "env.json";
// const set = {
//   fileName: fileName,
//   filePath: join(process.cwd(), "src", fileName),
// };
// const options ={
//     test: true,// if you dont want to overwrite your original .env file, set this to true
//     updateNewJsonFile: false, // If you want to create a new json file, set this to true
//     createNewEnvFile: true, // If you want to create a new env file, set this to true
//     useCache: false // If you want to use the cache to compare the previous json file and the new json file
//   }
//   console.log(`${set.filePath}`);
// const setEnv = new JsonToEnv(set, options);
// setEnv.setEnv();
// console.log(process.env);
