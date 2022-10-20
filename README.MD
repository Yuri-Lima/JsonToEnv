[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)

<div align="center" width="100%">
    <img src="./converter.jpg" width="128" alt="" />
</div>


# Convert Json Or Js Or Ts  to .Env File [Experimental Project]
### TypeScript, TS-Node-Dev

## ⭐ Features
1. Convert json to .env file and save the .env just created into .env.json file also.
2. Accept up to 4 levels deep of Objects [nested objects]
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
                    "role": "admin",
                    "number": 789
                },
                "password": 12345678
            }
        },
        "logLevel": true,
    }
    ```
- 1.OUTPUT .Env File Example:
    ```.env
    PORT=6666
    ARRRAY_0='a'
    ARRRAY_1='b'
    ARRRAY_2='c'
    DBURI_HOST="127.0.0.1"
    DBURI_PORT=666
    DBURI_DB_NAME="DB_X1"
    DBURI_DB_USER_NAME="ABC"
    DBURI_DB_ARRAY_2_0='1'
    DBURI_DB_ARRAY_2_1='2'
    DBURI_DB_ARRAY_2_2='3'
    DBURI_DB_USER_PASSWORD=null
    DBURI_DB_USER_ROLE="admin"
    DBURI_DB_USER_NUMBER=789
    DBURI_DB_PASSWORD=12345678
    LOGLEVEL=true
    ```
- 2.OUTPUT .Env File Example:
    ```.env.json
    {
        "PORT":"6666",
        "ARRRAY_0"='a'
        "ARRRAY_1"='b'
        "ARRRAY_2"='c'
        "DBURI_HOST":"127.0.0.1",
        "DBURI_PORT":666,
        "DBURI_DB_NAME":"DB_X1",
        "DBURI_DB_USER_NAME":"ABC",
        "DBURI_DB_USER_2_0"='1'
        "DBURI_DB_USER_2_1"='2'
        "DBURI_DB_USER_2_2"='3'
        "DBURI_DB_USER_PASSWORD":null,
        "DBURI_DB_USER_ROLE":"admin",
        "DBURI_DB_USER_NUMBER":789,
        "DBURI_DB_PASSWORD":12345678,
        "LOGLEVEL":true,
    }
## 🚀 How to use it ?

#### Examples
1. Import the module and interface[optinal]
   ```
        import {JsonToEnv, Options_Set_Env, Set_Env} from "dynamic.envs";
    ```
2. Creating a path for the new env file which you may would call `env.[extension you want]`
    * You can use **json, js and ts** _extensions_.*
    ```
    const fileName = "env.json";
    const set:Set_Env = {
        fileName: fileName,
        readFileFrom: join(process.cwd(), "src"),
        saveFileTo: join(process.cwd()),
    };
    ```
    Important:
    * You can use **json, js and ts** _extensions_.
        For js and ts extensions you must use the default export js or ts way.:
        - Example:
            ```
            export default {
                port: 6666,
                dbUri: {
                    host: "123.123.123.123"
                    port: 666,
                    }
                };
            ```

3. Set all the options
   ```
   const options:Options_Set_Env ={
        overWrite_Original_Env: false, // If it is true, it will Over write the existing .env file
        createJsonFile: false, // If you want to create a new json file, set this to true
        createEnvFile: true, // If you want to create a new env file, set this to true
        log: true, // If you want to receive feedbacks/logs, set this to true
    }
    ```
    If **createEnvFile** is true and overWrite_Original_Env is true, then create a new .env file **overwriting** the old one.

    If **createEnvFile** is true and overWrite_Original_Env is false, then create a new .env file **withouth overwriting** the old one.

    if **createEnvFile** is false, then it **will not create** any new .env file.

4. Instance the class and call the method
    ```
    const setEnv = new JsonToEnv(set, options);
    setEnv.setEnv();
    ```


## ⭐ Requirements
1. NodeJS
2. TypeScript

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

## 📝 Progress Table [I will fill that up soon]
| Task           | Time required | Assigned to   | Current Status | Finished | 
|----------------|---------------|---------------|----------------|----------|
| Comming soon   | > 5 hours     |               | in progress    | [x] Test   
| Comming soon   | > 5 hours     |               | in progress    | [x] Test1<br/>[ ] Test2
| Comming soon   | > 5 hours     |               | in progress    | [x] Test1<br/>[ ] Test2
| Comming soon   | > 5 hours     |               | in progress    | [x] Test1<br/>[ ] Test2


If you love this project, please consider giving me a ⭐.


## 🗣️ Discussion

### Issues Page

- You can discuss or ask for help in [issues](https://github.com/Yuri-Lima/JsonToEnv/issues).