# Movie Review Website

### Demo
- [Website](https://thawing-island-64029.herokuapp.com)

### Main Components
- Register&Login
  - Utilized [Passport](http://www.passportjs.org/) to implement authentication, which can avoid security problems of direct storage of passwords.
  - With [Express session](https://www.npmjs.com/package/express-session), the web application applies persistent login sessions.  
- Movies&Reviews
  - Utilized [Mongoose](https://mongoosejs.com/) to design data schema and connect to [MongoDB](https://www.mongodb.com/).
  - Utilized [Joi](https://joi.dev/api/?v=17.5.0) to validate data submitted by users.
  - Without login, users can only do Read operations. After logging in, users can do Create/Update/Delete operations.
  - Users can upload images and these images will be stored on [Cloudinary](https://cloudinary.com/) platform. If users do not upload images, the default image will be used as an alternative.
 


### Technologies&Tools:
- JavaScript, CSS, HTML
- The front-end website is built with [Bootstrap5](https://getbootstrap.com/docs/5.0/getting-started/introduction/) framework.
- The database is based on [MongoDB Cloud](https://cloud.mongodb.com/).
- [Cloudinary](https://cloudinary.com/) platform is used to store images uploaded by users.
- The application is deployed on [Heroku](https://dashboard.heroku.com/apps) platform.


### VS Code Extentions:
- EJS language support


### Other Tools:
- [mapbox](https://www.mapbox.com/)
