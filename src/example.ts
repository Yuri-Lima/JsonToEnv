import { join } from "node:path";
import { JsonToEnv, Set_Env, Options_Set_Env } from "./index";

/**
 * ATTENTION: If you dont want to overwrite your original .env file, set this to true
 * @description: This function will read the env.json file and set the env variables
 * @param {string} filePath - The path of the env.json file
 * @param {boolean} test - ATTENTION: If you dont want to overwrite your original .env file, set this to true
 * @param {boolean} createNewJsonFile - If you want to create a new json file, set this to true
 * @param {boolean} useCache - If you want to use the cache to compare the previous json file and the new json file, set this to true
 * @param {boolean} useNull - If you want to set the value to null, set this to true
 * @param {boolean} useUndefined - If you want to set the value to undefined, set this to true
 * @param {string} jsonFile - If you want to directly set the json file
 * @param {string} json - If you want to directly set the json
 */

  const fileName = 'env.json';
  const set = {
    fileName: fileName,
    filePath: join(process.cwd(), 'src', fileName),
  };
 
  const options ={
      test: false, // if you dont want to overwrite your original .env file, set this to true
      updateNewJsonFile: false, // If you want to create a new json file, set this to true
      createNewEnvFile: true, // If you want to create a new env file, set this to true
      useCache: false // If you want to use the cache to compare the previous json file and the new json file
    }
  console.log(set);
  const setEnv = new JsonToEnv(set, options);
  setEnv.setEnv();
  console.log(process.env);