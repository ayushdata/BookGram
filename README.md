# BookGram
Social Media Application using MERN Stack

## Requirements
- Node
- npm
- MongoDB cloud database (MongoDB Atlas can be used to create one)
- Cloudinary account for saving photos posted by users

## Installation
First, clone this repository.
```
$ git clone https://github.com/ayushdata/BookGram.git
$ cd BookGram
```

Create a keys.js file inside the server folder and paste the below code giving the link to your MongoDB cloud database (MongoDB Atlas can be used) and give a random string of alphanumeric characters in the JWT_SECRET field.
```
module.exports = {
    mongoURI: "mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority",
    JWT_SECRET: "RANDOM_STRING_OF_SOME_ALPHANUMERIC_CHARACTERS"
}
```

Create a keys.js file inside the client/src folder and paste the below code giving the cloudName of your Cloudinary account, uploadPreset and the API Base URL of your Cloudinary account.
```
module.exports = {
    uploadPreset: "YOUR_UPLOAD_PRESET_VALUE",
    cloudName: "YOUR_CLOUD_NAME",
    API_URL: "YOUR_API_BASE_URL"
}
```

Navigate to the server folder from the project root directory, install the dependencies and start the server
```
$ cd server
$ npm install
$ nodemon app
```

Navigate to the client folder from the project root directory, install the dependencies and start the client
```
$ cd client
$ npm install
$ npm start
```

Go to localhost:3000 to see your Application running
```
localhost:3000
```
