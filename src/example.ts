import { join } from "node:path";
import { JsonToEnv, Set_Env, Options_Set_Env } from "./index";

/**
 * ATTENTION: If you dont want to overwrite your original .env file, set this to true
 * @description: This function will read the env.json file and set the env variables
 * @param {string} filePath - The path of the env.json file
 * @param {boolean} test - ATTENTION: If you dont want to overwrite your original .env file, set this to true
 * @param {boolean} createJsonFile - If you want to create a new json file, set this to true
 * @param {boolean} createEnvFile - If you want to create a new env file, set this to true
 */

  const fileName = 'envTree.json';
  const set:Set_Env = {
    fileName: fileName,
    readFileFrom: join(process.cwd()),
    saveFileTo: join(process.cwd(), "src", fileName),
  };
 
  const options:Options_Set_Env ={
      overWrite_Original_Env: true, // if you dont want to overwrite your original .env file, set this to true
      createJsonFile: true, // If you want to create a new json file, set this to true
      createEnvFile: true, // If you want to create a new env file, set this to true
      log:false, // If you want to log the result, set this to true
  }
  console.log(set);
  const setEnv = new JsonToEnv(set, options);
  setEnv.setEnv();
  // console.log(process.env);