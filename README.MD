[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)

<div align="center" width="100%">
    <img src="./converter.jpg" width="128" alt="" />
</div>


# Convert Json to .Env File
### TypeScript, Node-Cache, DotEnv, TS-Node-Dev

## ⭐ Features
1. Convert json to .env file
2. Accept up to 4 levels deep of Objects [nested objects]
- INPUT Json File Example:
    ```json
    {
        // First Level
        "port": 6666,
        "dbUri": {
            // Second Level
            "host": "127.0.0.1",
            "port": 666,
            "db": {
                // Third Level
                "name": "DB_X1",
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
- OUTPUT .Env File Example:
    ```.env
    PORT=6666
    DBURI_HOST="127.0.0.1"
    DBURI_PORT=666
    DBURI_DB_NAME="DB_X1"
    DBURI_DB_USER_NAME="ABC"
    DBURI_DB_USER_PASSWORD=null
    DBURI_DB_USER_ROLE="admin"
    DBURI_DB_USER_NUMBER=789
    DBURI_DB_PASSWORD=12345678
    LOGLEVEL=true
    ```
## 🆕 Coming Soon
1. Convert object to .env file
3. Convert txt to .env file
4. Accept nested arrays
5. Accept nested objects of arrays

## What technology are we using?
- [TypeScript](https://www.typescriptlang.org/) - Static tye checking 

## 💪 Motivation

* I used to use those tools below to deal with .env files but I found them to be too boring sometimes annoing then I decided to use JSON instead, because I think they are more flexible, readble and easy to use. However, I was not able to find a way to convert JSON to .env file automatically. So I decided to write a tool to do that. I hope you will like it.

    - [dotenv](https://www.npmjs.com/package/dotenv)
    - [config](https://www.npmjs.com/package/config)

If you love this project, please consider giving me a ⭐.


## 🗣️ Discussion

### Issues Page

- You can discuss or ask for help in [issues](https://github.com/Yuri-Lima/Json_TO_Env/issues).