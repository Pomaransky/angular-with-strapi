# Pulsar (still under development - new features etc.)
A platform for publishing posts and comments. Users can create posts, browse the feed on the home page, and open individual posts with a paginated list of comments. Admin can view and block users. The app supports a light/dark theme and multiple languages with ngx-translate and PrimeNG locale.

#### Demo: https://pulsar-app.netlify.app/
#### Strapi Cloud Demo (backend) project is scaled down to save resources. Strapi needs time to start back up - so the first request may take longer (wait a moment and try to refresh the page if it takes too long).
Test admin credentials:
Username: **admin**
Password: **zaq1@WSX**
Test user credentials:
Username/Email: **userExample** or **userexample@email.com**
Password: **123456**

#### To develop locally:

1. Run **npm install** in the **/strapi** directory
2. Create a **.env** file based on **.env.example** in the **/strapi** directory
3. Run **npm run dev** in the **/strapi** directory
4. Create a Strapi admin account (local)
5. Create an admin user

6. Run **npm install** in the **/frontend** directory
7. Run **npm run start** in the **/frontend** directory
8. Log in to the created admin/user or register a new user

