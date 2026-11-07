basic setup:
    index.js:
        import dotenv/config: to read from .env
        import app from app.js which is a object of express module
        connect to DB using the connectDB from db/index.js
        if connectDB succeeds .then():
            app.listen on port
        else catch(error):
            db connection failed print error
    app.js:
        app:
            create a web application using express:
                used for scalable apps, routing etc
            specify the .use() for
                cors, cookieParser, json input with size limit,
                urlencoded form data and static file assessable lib
            specify diff route modules using routes
                for users, videos etc
    db/index.js:
        connectDB:
            connect to db using mongoose.connect(mongoDBUrl+database) with try/catch and async/await
    routes dir:
        specify different route groups for different group/category
        all routes add in this using router.route() will first go through the url specified in the app

advanced setup:
    models:
        create different models using mongoose through which we can interact with the database:
            first create schema for each model inside which we can specify the fields and methods
                and add constraints for each fields as json in json
            create model using the schema generated
    multer:
        when you upload a file normally via form it uses multipart/formData and file comes in binary format
        you can directly write through fs.createFileStream to a dir but you need to handle the diskStorage and file separation
            hence we use multer for easy storage and file separation form text: i.e req.text and req.files
        you can specify the destination and filename for multer.diskStorage and added to multer storage and export as upload
        we can use upload to send single or multiple files
    cloudinary:
        img and video files take up large files so it better to store them on cloud and retrieve their urls
        create cloudinary instance using the cloudinary creds and upload to cloudinary using the localPath
            after uploading you will receive a obj consisting of url through which we can get the file
    auth.middleware:
        create methods in user for creation of access and refreshToken
        when login create these both and store them as cookies and also store refreshToken in a var toGenerateAccessToken()
        when logout delete these cookies and delete the stored refreshToken
        and for all other update methods create verifyJwt which checks for accessToken

controllers:
    create different controllers for different route groups
    users:
        preform cred ops on the users model and export them to routes for url mapping
        use different edge cases to mitigate unexpected error
        use different db ops like find, create and also operands like $or and $set
        use cookies to fetch data about the current/loggedIn user
        since mongoDb is a nosql database we can use aggregation functions/pipeline:
            to perform complex ops like joins, groups and func like sum(), count() and return the result
            $cond, $size, $match, $lookup: join, $project: output and other func used as obj in list[obj] sep=,
            

    