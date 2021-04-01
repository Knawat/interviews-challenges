Testing UI:

Test File: signin_create account__specs

1.Sign In: 

To Open Given Test Page and Click on Sign In Button
Is Sign In Button clickable or not 

2.Registration Process with Error Mesage on Empty Credentials

If user dont give any email and click on create an account button
If user give wrong email format and click on create an account button  (Note: Give any wrong format email as input)

------------------------------------------------------------------------------------------------------------------------------------------

Test File: registration_process1_spec

1.To Open Given Test Page and Click on Sign In Button
2.Registration Process with Error Mesage on Empty Credentials

When User give correct format of email
When User click on Register Button Without Giving any Credentials: See System Prompts Error Message

-------------------------------------------------------------------------------------------------------------------------------------------

Test File:registration_process2_spec

1.To Open Given Test Page and Click on Sign In Button
2.Registration Form Feild Validation (When Wrong Format Inputs Given)
  
  Note: To See Validation is Applied on each field mentioned on Registration Form 
 
When user give Name of Wrong Format (First Name, Last Name)
When user give Password Less Than 5 Characters)
When user give wrong Zip/Postal Code
When user give A Large Text in Assign an address alias for future reference Field )

-------------------------------------------------------------------------------------------------------------------------------------------

Test File:registration_process3_spec
1.To Open Given Test Page and Click on Sign In Button
2.Registration Process (With Happy Flow: When All Correct Format Inputs Given)

-------------------------------------------------------------------------------------------------------------------------------------------





Testing rest API

Test File:Authors(Get Request)_spec

1.Api Testing (Get Api With No Parameter)
//Happy Flow
Hit Get Api and Validate:Response Status Code and Body

2.Just make change from "Authors"to "Auth"

-------------------------------------------------------------------------------------------------------------------------------------------

Test File:Authors(Get with Parameters)_spec

1.Hit Get Api with Valid Parameter and Validate:Response Status Code and Body
2.Hit Get Api with Invalid Parameter and Validate:Response Status Code and Body

-------------------------------------------------------------------------------------------------------------------------------------------

Test File:Authors(Post Request)_spec

1.Hit Post Api and Validate:Response Status Code and Body
  //Happy Flow

2.Make Some Alteration in Body and Hit Post Api and Validate:Response Status Code
  //Here make some changes" Remove Id value and First Name

-------------------------------------------------------------------------------------------------------------------------------------------

Test File:Authors(Put Request)_spec

1.Hit Post Api and Validate:Response Status Code and Body

2.Make Some Alteration in Parameter and Hit Post Api and Validate:Response Status Code
  //Just make a change in Paramter: 1111111111111111111

--------------------------------------------------------------------------------------------------------------------------------------------

Test File:cypress.json

Add this code snippet in cypress.json

{
    "chromeWebSecurity": false,
    "modifyObstructiveCode": true,
"experimentalSourceRewriting": true
}

--------------------------------------------------------------------------------------------------------------------------------------------





























