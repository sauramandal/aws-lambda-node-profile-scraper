const serverless = require("serverless-http");
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TEST APIS
app.get("/api/info", (req, res) => {
  res.send({ application: "sample-app", version: "1" });
});

app.post("/api/v1/getback", (req, res) => {
  res.send({ ...req.body });
});

/* GET scraped Wiki users summary */
app.get("/users", async (req, res) => {
  async function fetchHTML(url) {
    try {
      const { data } = await axios.get(url);
      return cheerio.load(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  try {
    const { url } = req.query;
    const $ = await fetchHTML(url.toString());
    const contents = $(
      "#mw-content-text > div.mw-parser-output > p:nth-child(5)"
    ).text();
    console.log("contents");
    console.log(contents);
    res.send(JSON.parse(JSON.stringify(contents)));
  } catch (err) {
    console.log("err");
    console.log(err);
    res.send("Failed to load resource");
  }
});

//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
