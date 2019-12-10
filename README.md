# Usage CSV Generator


This script uses the raw data you can get from:

https://tokbox.com/account/account/{AccountId}/usage?startDate={startDate}&endDate={endDate}

and generates a CSV file matching the old output found in account portal.

You may need to use this script if you need to keep getting the old format CSV after we changed it in account portal.
This is a URL you can simply copy in your browser in order to get your raw usage data. This data will be processed by this script and generate a CSV file summarizing the data.

`AccountId`: Your account ID. The account you want to get usage.

`startDate` `endDate`: starting and ending dates in epoch miliseconds

### Getting your account Id

1. After logging into account portal, select the desired account from the left navbar.
2. Navigate to https://tokbox.com/account/#/settings
3. Scroll down until you find the OpenTok REST API Section and click on `View Account Keys`. The value you find under "API KEY" is your account ID

### Dependencies

1. Make sure you have NodeJs installed. Version > 10
2. In the root of this project run `npm install` to install dependencies.


### Usage tutorial


1) Login to account portal. Once you login, open a new tab and copy your usage URL. https://tokbox.com/account/account/{AccountId}/usage?startDate={startDate}&endDate={endDate}

2) Select all the output and paste it into a file named `input.json` in the root of this project

3) Run `node generateCsv.js` to generate account level usage CSV or run `node generateCsv.js {projectId}` to generate project level usage CSV