/* LEVEL 6-Security
Create an application by Google-Console-----------------------------------------
//0
-Click and read the documentation:  https://www.passportjs.org/packages/passport-google-oauth20/
-Go to:
Usage
Create an Application
 Before using passport-google-oauth20, you must register an application with Google.
 If you have not already done so, a new project can be created in the Google Developers Console
 Your application will be issued a client ID and client secret, which need to be provided to the strategy.
 You will also need to configure a redirect URI which matches the route in your application
//1
-Click: Google Developers Console
-or click directly https://console.cloud.google.com/apis/dashboard?pli=1&project=pristine-gadget-271815
-Create a project
-Project Name: BertiProject
-CREATE

//2
@BertiProject - API&Services - OAuth consent screen:
Edit app registration:
-External
-App name: Roby
-Authorized JavaScript origins: http://localhost:3000
-User support email: namesurname@gmail.com
-Developer contact information: Email addresses: namesurname@gmail.com
-Save and Continue

//3.
@BertiProject - API&Services - Credentials - CREATE CREDENTIALS - OAuth client ID:
- Application type: Web application
- Name: Roby
- Authorized JavaScript origins: http://localhost:3000
so where is that request to Google going to come from. And in our case it's going to come from our local host.
And this is obviously for when we're testing. And when your websites live, you can come back here and change it at any time.

-Authorized redirect URIs: http://localhost:3000/auth/google/roby
So this is a route that we're going to plan out on our server when Google has authenticated our user to return to
so that we can then locally authenticate them and save the session and cookies and all of that.
And I'm gonna come back to this route very very shortly but for now just check to make sure that you have inserted in here exactly the same string as I have
because if it's not, then our authentication will fail and it'll be hard to identify down the line.
So once you've made sure that both of these are correct then go ahead and hit enter and that adds those to our credentials and we can go ahead and create a client ID.
-Create

//4
I'm going to go back to Atom and open up my .env file and I'm going to add  them in using the .env format.
Client_ID=...
Client_SECRET=...

//5
OK

*/





//------------------------------------------------------------------------------
/* LEVEL 6-Security
Create an application by Facebook-----------------------------------------------
https://www.youtube.com/watch?v=KlE9RAOl9KA&t=2s&ab_channel=MarinaKim

//0
-Click and read the documentation:  http://www.passportjs.org/packages/passport-facebook/
-Go to:
Usage
Create an Application
 Before using passport-facebook, you must register an application with Facebook.
 If you have not already done so, a new application can be created at Facebook Developers
 Your application will be issued an app ID and app secret, which need to be provided to the strategy.
 You will also need to configure a redirect URI which matches the route in your application.
//1
-Click: Facebook Developers or click directly https://developers.facebook.com/
-then choose Facebooke log in, click Learn More, click Go to Docs
now will open this page https://developers.facebook.com/docs/facebook-login/
//1
OR go to google and write: implement facebook login
now will open this page https://developers.facebook.com/docs/facebook-login/

//2
-Go to Overview so here:  https://developers.facebook.com/docs/facebook-login/overview
-Go to Start Building - For Web and Mobile Web Apps, so here: https://developers.facebook.com/docs/facebook-login/web

//3 Read
Before You Start
You will need the following:

A Facebook Developer Account
A registered Facebook App with Basic Settings configured
The Facebook JavaScript SDK

//4
-Log in Facebook,
-then click above //3Facebook Developer Account or direclty here https://www.facebook.com/login.php?next=https%3A%2F%2Fdevelopers.facebook.com%2Fapps%2F
in order to create A Facebook Developer Account
then will show this page https://developers.facebook.com/apps/
//5
-Click Create App
Choose None
-Add an app name: Roby
-App contact email: namesurname@gmail.com or let it automatically the email of facebook
-Re-enter facbook Account password
-Submit
then will show a new page
//6
Add a product
Facebook Login
The world's number one social login product.
-Click Setup
//7
se the Quickstart to add Facebook Login to your app. To get started, select the platform for this app.
-Choose Web
//8
Tell Us about Your Website
 Tell us what the URL of your site is.
 Site URL:
   http://localhost:3000/
 Save
//9
In the top-left - Settings - Basic -we have:
App ID: ...............
App secret: ........................

-Copy them and paste into .env file

//10
In the bottom-left - Facebook Login - Settings:
-Valid OAuth Redirect URIs:
 A manually specified redirect_uri used with Login on the web must exactly match one of the URIs listed here.
 This list is also used by the JavaScript SDK for in-app browsers that suppress popups.
 http://localhost:3000/ourRouteForCallBackFunction
 - http://localhost:3000/robyroute
 -Save Changes
 -------------------------------------------------------------------------------
*/
