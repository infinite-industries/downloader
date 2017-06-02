#### INSTALL
* run: npm install
* copy .env.sample to .env and fill in values (a live LIVE_MAILGUN_API_KEY key is required)
* run: node index.js

### System Dependencies
* MongoDB
* MailGun Account
* Amazon s3 account

### Using the Demo
* First you will need to have setup
   * A MailGun account
   * An Amazon s3 bitbucket containing a file called "test-download-file.zip"
   * Set the keys and relevant fields for the above services in your .env file
* Navigate to http://localhost:7777
* Enter your e-mail and click enter

curl -H "Content-Type: application/json" -X POST -d '{"user_email":"dog@dog.com","password":"xyz"}' http://localhost:7777/api/

or postman
