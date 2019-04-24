<h1>Vote Brexit</h1>

<h2>Proposed V1 design</h2>

A text field for a postcode. 

A map of voting recommendations, keyed on constituency name is loaded automatically (from `vote-recommendations`) when the page is loaded. With only 650 constituencies and GZIP compression this data volume is tiny.

```json
  {
    "Constituency Name": { 
      "candidateName": "Candidate Name",
      "partyCode": "3-Letter Party Code"
    },
    ...
  }
```

As soon as the user enters a valid postcode then a call is made to `/constituency-names?q={postcode}` to get the constituency name, but the result is not shown.

[They Work For You][1] is used to map postcodes to constituency names.

The user then hits the enter key, or the search button and a O(1) look-up is made into into the local map of vote recommendations, keyed on constituency name.

The source of truth for vote recommendations is a [Google Sheet spreadsheet][2]. This makes updating the data and the recommendation algorithm trivial. 

The vote recommendation data is immediately cached by the server and the Google Sheet API is not touched from then on.

The vote recommendation is then displayed to the user.

In the normal flow, every user interaction should appear instantaneous.

<h2>Possible V2 Enhancements</h2>

 - an explanation to be displayed alongside the vote recommendation
 - ability for users to enter geographical names to retrieve constituency names incase they don't know their postcode
 - develop our own postcode-to-constituency-name mapping (S3 bucket?)
 - client-side routing

<h2>Proposed Logical Architecture</h2>

 - [They Work For You][1] API used to map postcodes to constituency names
 - [Google Sheets API][3] used to retrieve vote recommendations, which are then cached in the app 
 - HTTP endpoints deployed to AWS using [serverless][4] and [AWS Lambda][5]
 - Web app deployed as a React app to AWS
 - [votebrexit.vote][6] will be pointed at it via DNS

 <h2>Notes</h2>

 Constituencies are uniquely identified by name. Their name is, in effect, their ID. I was unable to find an established and standard constituency identifier format. The [They Work For You][1] API doesn't offer a useful ID in its responses, so the name <i>itself</i> is currently used.

<h2>Getting Started</h2>

 - Install Node
 - Install NVM
 - Install serverless npm install -g serverless
 - [Configure AWS with a user][7] & access key
 - Configure serverless with the access key: `serverless config credentials --provider aws --key { public-key } --secret { private-key }`

<h2>Environment Variables</h2>

 - `GOOGLE_SHEETS_KEY`
 - `THEY_WORK_FOR_YOU_KEY`

 <h2>Deploy</h2>

 - `serverless deploy --stage dev --region eu-central-1`

 [1]: https://www.theyworkforyou.com/api/docs/getConstituency
 [2]: https://docs.google.com/spreadsheets/d/1lyOFnh5TdSr1G4v2mvS6YYUdpM3kxEpoCDusQKXHFn0/edit#gid=0
 [3]: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#resource-valuerange
 [4]: https://serverless.com
 [5]: https://aws.amazon.com/lambda/
 [6]: votebrexit.vote
 [7]: https://serverless.com/framework/docs/providers/aws/guide/credentials/