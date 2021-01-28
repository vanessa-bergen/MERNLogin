# MERNLogin
Authentication app using the MERN stack.

# Features
Allows user's to register an account and login. Uses bcryptjs to hash password.

<img src="images/login.png" width="40%" hspace="20"> <img src="images/register.png" width="40%" hspace="20"> 

Allows user's to view and update their account information. Uses private routes so that only authenticated users can view the dashboard and account page. 
Uses jsonwebtoken and passport-jwt to authenticate endpoints. 

<img src="images/account.png" width="40%" hspace="20"> <img src="images/changePassword.png" width="40%" hspace="20">

Allows user to recover a lost password. If a valid account email address is entered, an email containing a URL to reset the password will be sent. 
The reset password link is only valid for a certain amount of time and can only be used once.

<img src="images/recoverPassword.png" width="40%" hspace="20"> 

<img src="images/resetPassword.png" width="40%" hspace="20"><img src="images/passwordResetInvalid.png" width="40%" hspace="20">
