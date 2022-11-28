[![Updates Test CI](https://github.com/Yuri-Lima/JsonToEnv/actions/workflows/updates.test.yml/badge.svg?branch=main)](https://github.com/Yuri-Lima/JsonToEnv/actions/workflows/updates.test.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)
![npm](https://img.shields.io/npm/v/dynamic.envs)
![npm](https://img.shields.io/npm/dt/dynamic.envs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<div align="center" width="100%">
    <img src="./images/converter.jpg" width="128" alt="" />
</div>


# Convert Json to .Env File

Supports for CommonJS (CJS) and ECMAScript (ESM).

## ⭐ Features
1. Convert json to .env file.
2. Create env.json file optionally.
3. Overwrite existing .env file optionally.
4. Instantes log messages to show the progress of the process, optionally.
5. Accept up to 5 levels deep of Objects [nested objects]
- INPUT Json File Example:
    ```json
    {
        // First Level
        "port": 6666,
        "array": ["a", "b", "c"],
        "dbUri": {
            // Second Level
            "host": "127.0.0.1",
            "port": 666,
            "db": {
                // Third Level
                "name": "DB_X1",
                "array_2": ["1", "2", "3"],
                "user": {
                    // Fourth Level
                    "name": "ABC",
                    "password": null,
                    "role": {
                        // Fifth Level
                        "name": "ADMIN",
                        "permissions": ["READ", "WRITE", "DELETE"]
                    },
                    "number": 789
                },
                "password": 12345678
            }
        },
        "logLevel": true,
    }
    ```
- 1.OUTPUT .Env File Example [Overwrite][optional]:
    ```env
    PORT=6666
    ARRAY_0='a'
    ARRAY_1='b'
    ARRAY_2='c'
    DBURI_HOST='127.0.0.1'
    DBURI_PORT=666
    DBURI_DB_NAME='DB_X1'
    DBURI_DB_ARRAY_2_0='1'
    DBURI_DB_ARRAY_2_1='2'
    DBURI_DB_ARRAY_2_2='3'
    DBURI_DB_USER_NAME='ABC'
    DBURI_DB_USER_PASSWORD=null
    DBURI_DB_USER_ROLE_NAME='ADMIN'
    DBURI_DB_USER_ROLE_PERMISSIONS=READ,WRITE,DELETE
    DBURI_DB_USER_NUMBER=789
    DBURI_DB_PASSWORD=12345678
    LOGLEVEL=true
    ```
- 2.OUTPUT env.json File Example [Optional][optional]:
    ```json
    {
    "PORT": 6666,
    "ARRAY_0": "a",
    "ARRAY_1": "b",
    "ARRAY_2": "c",
    "DBURI_HOST": "127.0.0.1",
    "DBURI_PORT": 666,
    "DBURI_DB_NAME": "DB_X1",
    "DBURI_DB_ARRAY_2_0": "1",
    "DBURI_DB_ARRAY_2_1": "2",
    "DBURI_DB_ARRAY_2_2": "3",
    "DBURI_DB_USER_NAME": "ABC",
    "DBURI_DB_USER_PASSWORD": null,
    "DBURI_DB_USER_ROLE_NAME": "'ADMIN'",
    "DBURI_DB_USER_ROLE_PERMISSIONS": [
        "READ",
        "WRITE",
        "DELETE"
    ],
    "DBURI_DB_USER_NUMBER": 789,
    "DBURI_DB_PASSWORD": 12345678,
    "LOGLEVEL": true
    }
## Installation

```
npm install --save-dev dynamic.envs
```
## 🚀 Getting started

## Setup

### ESM example:

```js
import JsonToEnv from "dynamic.envs";

const set = new JsonToEnv({
    readFileFrom: path.join(__dirname, "..","FILE_NAME.json"),
    saveFileTo: path.join(__dirname, "..", ".env")
  }, {
    overWrite_Original_Env: true, // if you dont want to overwrite your original .env file, set this to true
    createJsonFile: true, // If you want to create a new json file, set this to true
    createEnvFile: true, // If you want to create a new env file, set this to true
    log: true, // If you want to log the result, set this to true
  });
set.setEnv(); // This will create a new .env file depending on the options you set
```

### CJS example:

```js
const JsonToEnv = require("dynamic.envs").default;

const Set = {
    readFileFrom: path.join(__dirname, "..","FILE_NAME.json"),
    saveFileTo: path.join(__dirname, "..", ".env")
  }
const Options = {
    overWrite_Original_Env: false, // if you dont want to overwrite your original .env file, set this to true
    createJsonFile: false, // If you want to create a new json file, set this to true
    createEnvFile: true, // If you want to create a new env file, set this to true
    log: false // If you want to log the result, set this to true
  }
const sett = new JsonToEnv(Set,Options);
set.setEnv(); // This will create a new .env file depending on the options you set

```
### Setting up Source and Destination

| Option        | Type     | Required | Description                                               |
|---------------|----------|---------|------------------------------------------------------------|
| `readFileFrom`| `String` | Yes   | The path to the json file you want to convert to .env file.  |                                                                      
| `saveFileTo`  | `String` | Yes   | The path to the .env file you want to create.                |  

### Options

| Option                  | Type      | Default | Description                                                                                                         |
|-------------------------|-----------|---------|---------------------------------------------------------------------------------------------------------------------|
| `overWrite_Original_Env`| `Boolean` | False   | If True, it will overWrite the orinal .env file                                                                     |
| `createEnvFile`         | `Boolean` | True    | If True and  overWrite_Original_Env is False is will create a new .env file however if  overWrite_Original_Env is True it will oveWrite the original|
| `createJsonFile`        | `Boolean` | False   | If True, it will create a new .env.json file                                                                        |
| `log`                   | `Boolean` | False   | If True, it will log the result to the console                                                                      |


## 🚨 ALERT
- The interface Options_Set_Env has an important property called `overWrite_Original_Env`.
- By default this property is set to `false`. For safety reasons.
- This property once set to `true` will OVER WRITE the ORIGINAL .env file.(depends on the .env path)
- It's very important to keep set it as `false` if you want to keep the original .env file.

## ⚠️ WARNING
1. For while this is a very simple converter.
2. Thats a brand new project. So, **_still in basics development_**.
3. It does not check if the json file is valid.
4. It does not check if the json file is nested.
5. It does not check if the json file is empty.
6. It does not find .env file automatically.[**YET**]

## 🆕 Features Coming Soon
- [x] Accept nested arrays.
- [ ] Accept nested objects of arrays.
- [ ] Find .env file automatically.

## 🤓 What technology are we using?
- [TypeScript](https://www.typescriptlang.org/) - Static tye checking 

## 💪 Motivation

* I used to use those tools below to deal with .env files but I found them to be too boring sometimes annoing then I decided to use JSON instead, because I think they are more flexible, readble and easy to use. However, I was not able to find a way to convert JSON to .env file automatically. So I decided to write a tool to do that. I hope you will like it.

    - [dotenv](https://www.npmjs.com/package/dotenv)
    - [config](https://www.npmjs.com/package/config)

If you love this project, please consider giving me a ⭐.


## 🗣️ Discussion

### Issues Page

- You can discuss or ask for help in [issues](https://github.com/Yuri-Lima/JsonToEnv/issues).