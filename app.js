const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        "email_address": email,
        "status": "subscribed",
        "merge_fields": {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/your_list_id"; // Replace 'usX' with your server prefix and 'your_list_id' with your actual list ID.

  const options = {
    method: "POST",
    auth: "8b737edc17c10394ffc4ce4b91c67269-us9" // Replace 'your_api_key' with your Mailchimp API key and keep 'anystring:' before it.
  };

  const request = https.request(url, options, function (response) {
    let responseData = '';

    response.on("data", function (chunk) {
      responseData += chunk;
    });

    response.on("end", function () {
      const result = JSON.parse(responseData);
      if (response.statusCode === 200 && result.members[0].status === "subscribed") {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.on("error", function (error) {
    console.error("Error making request:", error);
    res.send("Failed to subscribe.");
  });

  request.write(jsonData);
  request.end();

  // The rest of your code goes here, if any.
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
