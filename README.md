### Verification Test Project

## Live Action: https://blys-verification.herokuapp.com/

#### Features

A small application that allows users to input 6-digit codes as
a part of user verification flow.

* User should able to both manually enter the digits and paste the
code from clipboard (from first field or any field).
* Only one digit is allowed per input, entering a digit should
automatically focus on the next input.
* After entering the code and clicking submit, the application will
send a POST request to the server and handle success/error response.
* If the request results in an error, a “Verification Error” message
will be displayed.
* If the request is successful, the user will be routed to /success page
* Validated on client-side. If any of the inputs is empty or contains
non-numeric value, input is highlighted in red. The highlight is removed
if the value for that input changes.
* Add test suite available for both front-end and API side.
 
##### Server Side
* If received code is not 6 digits long OR the last digit is 7, 
return an error. Otherwise, treat the request as success.

#### Structure

NodeJS<br />
|<br />
|--- ReactJS Client<br />
|--- `__test__` (for api)<br />
|--- server.js<br />

#### Stacks and Tech

* NodeJS
* ReactJS
* TypeScript

#### Test Suite
* Jest

#### Start

To start the server and react js in development mode, just run this command:

`npm run dev`

http://localhost:3080/

It will start both server and react js concurrently.

Or for production mode:

`npm run build:client`

and then

`npm run start`

http://localhost:3080/

#### Test Suite

To run test suite for both server and react js run this command:

`npm run test`

Make sure previously running server are stopped
