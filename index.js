const googleTrends = require('google-trends-api');
const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');

function search(term) {
  const searchAsOf = new Date()
  searchAsOf.setDate(searchAsOf.getDate()-365);

  const options = {
    "keyword": term,
    "startTime": searchAsOf
  };

  googleTrends.interestOverTime(options)
  .then((results) => logResponse(results, term))
  .catch((err) => { console.log(term + ";?;?")});

}

function logResponse(result, term) {
  const obj = JSON.parse(result);
  const values = obj.default.timelineData.map((m) =>  m.value[0]);
  const sum = values.reduce((a, b) => a + b, 0);
  const popular = (sum > 1000)? "true" : "false";
  console.log(term + ";" + popular + ";" + sum + ";");
}

const inputFile='data.csv';
const parser = parse({delimiter: ','}, function (err, data) {
 let i = 0;
 data.forEach((line) => {
    const term = line[0];
    i++;
    setTimeout(function () {
      search(term)
    }, 1000*i)
    i++
 });
});
fs.createReadStream(inputFile).pipe(parser);


//search("FreeSkiing");