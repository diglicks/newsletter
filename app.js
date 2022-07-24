const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const userData = req.body;
  const jsonData = JSON.stringify({
    members: [
      {
        email_address: userData.email,
        status: "subscribed",
        merge_fields: {
          FNAME: userData.firstName,
          LNAME: userData.lastName
        }
      }
    ]
  });
  const url = "https://us11.api.mailchimp.com/3.0/lists/4a07137f1e";
  const options = {
    method: "POST",
    auth: "DiGlicks:366d73d261dc310d6e32a07d1da99c1d-us11"
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200 ) {
      response.on("data", (data) => {
        res.sendFile(__dirname + "/success.html");
      })
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("error", (error) => {
      console.log("Error! - " + error);
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
  console.log("Server is listening in port " + port + ".");
});

// 366d73d261dc310d6e32a07d1da99c1d-us11
// 4a07137f1e
