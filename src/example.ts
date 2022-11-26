import path from "node:path";
import JsonToEnv from "./index";

/**
 * ATTENTION: If you dont want to overwrite your original .env file, set this to true
 * @description: This function will read the env.json file and set the env variables
 * @param {string} filePath - The path of the env.json file
 * @param {boolean} test - ATTENTION: If you dont want to overwrite your original .env file, set this to true
 * @param {boolean} createJsonFile - If you want to create a new json file, set this to true
 * @param {boolean} createEnvFile - If you want to create a new env file, set this to true
 */

  const setEnv = new JsonToEnv({
    readFileFrom: path.join(__dirname, "..","envTree.json"),
    saveFileTo: path.join(__dirname, "..", ".env")
  }, {
    overWrite_Original_Env: true, // if you dont want to overwrite your original .env file, set this to true
    createJsonFile: true, // If you want to create a new json file, set this to true
    createEnvFile: true, // If you want to create a new env file, set this to true
    log: true, // If you want to log the result, set this to true
  });
  setEnv.setEnv();