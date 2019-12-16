# Usage CSV Generator
​
This script is used to obtain usage information in the previous CSV file format. It can also be used to obtain account level usage information which combines usage data across all of your projects.
​
## Usage URL 
​
The Usage URL is for accessing your raw usage data.
https://tokbox.com/account/account/{AccountId}/usage?startDate={startDate}&endDate={endDate}
​
The URL contains three fields:
​
`AccountId`: Your [Account ID](#getting-your-account-id)
​
`startDate` and `endDate`: starting and ending dates in [epoch miliseconds](#getting-epoch-time)
​
Copy and paste this URL into your browser to get your raw usage data. 
​
### Getting your account Id
1. After logging into account portal, select the desired account from the left navigation menu.
​
2. Navigate to https://tokbox.com/account/#/settings or select account settings on the left navigation menu.
​
3. Scroll down until you find the OpenTok REST API Section and click on `View Account Keys`. The value you find under "API KEY" is your account ID
​
### Getting Epoch Time
Simply use a website like https://www.epochconverter.com/ to convert your date into epoch time. 
​
​
## Converting into CSV Format
### Dependencies
1. Make sure you have NodeJs installed. Version > 10
​
2. In the root of this project run `npm install` to install dependencies.
​
### Usage 
1. Log in to account portal, open a new tab, and enter your [Usage URL](#usage-url)
​
2. Select all the output and paste it into a file named `input.json` in the root of this project
​
3. Run `node generateCsv.js` to generate account level usage CSV or run `node generateCsv.js {projectId}` to generate project level usage CSV