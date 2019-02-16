# CSV to JSON Converter

A quick and easy way to convert CSV files to JSON

![CSV To JSON Converter](https://s3-us-west-1.amazonaws.com/codereed/git-repo-images/csv-converter.png)

## Getting Started

Clone this repo and install dependencies with `npm install` or `yarn`. To start the app, run `nodemon` and (in a separate terminal) `yarn start` or `npm start`. Point your browser to `http://localhost:3000`.

## Editing the JSON Output

The default behavior is to transform each row of the CSV to the corresponding JSON. This output can be customized in `server/index.js`:

### Turn Header Rows Off

To convert files that do not contain a header row, change `csv({ noheader: false })` to `csv({ noheader: true })`. If you are further editing the behavior as described below, note that you will need to use `field1`, `field2`, etc to target particular rows.

### Customize Output

Once the rows have been converted, they are passed to a `.then()` and can be customized here:

```
.then(lines => {
  for (let line of lines) {
    // Do something with each line
  }
```

For example, say you have a CSV file with location data that looks something like this, and want to group the JSON data by state, and also format the coordinates:

| id  | city         | state | lat    | lon      |
| --- | ------------ | ----- | ------ | -------- |
| 1   | Anchorage    | AK    | 61.218 | -149.900 |
| 2   | Juneau       | AK    | 58.302 | -134.420 |
| 3   | Birmingham   | AL    | 33.521 | -86.802  |
| 4   | Decatur      | AL    | 34.606 | -86.983  |
| 5   | Mobile       | AL    | 30.694 | -88.043  |
| 6   | Jacksonville | AR    | 34.866 | -92.110  |
| 7   | Little Rock  | AR    | 34.746 | -92.290  |
| 8   | Texarkana    | AR    | 33.442 | -94.038  |

```
const data = {};
for (let line of lines) {
  if (!data.hasOwnProperty(line.state)) {
    data[line.state] = {};
  }
  data[line.state][line.city] = {
    coords: `${line.lat}, ${line.lon}`,
  };
}
```

** Note: ** If you are not using a header row, `line.state` becomes `line.field3`, `line.city` becomes `line.field4`, etc.

To write the correct data to the file and get the right preview information, we'll also update the write command and response to use the data object we just created:

```
fs.writeFile(`public/downloads/${filename}.json`, JSON.stringify(data, null, 2), function(error) {
  if (error) {
    res.status(422).json({ error });
  }
  res.status(200).json({ filename, preview: data[Object.keys(data)[0]] });
});
```

The resulting file should look like this:

```
{
  "AK": {
    "Anchorage": {
      "coords": "61.218, -149.9"
    },
    "Juneau": {
      "coords": "58.302, -134.42"
    }
  },
  "AL": {
    "Birmingham": {
      "coords": "33.521, -86.802"
    },
    "Decatur": {
      "coords": "34.606, -86.983"
    },
    "Mobile": {
      "coords": "30.694, -88.043"
    }
  },
  "AR": {
    "Jacksonville": {
      "coords": "34.866, -92.11"
    },
    "Little Rock": {
      "coords": "34.746, -92.29"
    },
    "Texarkana": {
      "coords": "33.442, -94.038"
    }
  }
}
```

Now imagine we want to use this as a sort of JSON location map, so we'll need to make some more adjustments. Let's make all the properties lowercase and get rid of the spaces. To retain the proper capitalization and formatting, we'll also add a formatted location field:

```
const data = {};
for (let line of lines) {
  if (!data.hasOwnProperty(line.state.toLowerCase())) {
    data[line.state.toLowerCase()] = {};
  }
  data[line.state.toLowerCase()][
    line.city
      .toLowerCase()
      .split(' ')
      .join('_')
  ] = {
    coords: `${line.lat}, ${line.lon}`,
    formatted_location: `${line.city}, ${line.state}`,
  };
}
```

Our output now has everything we need:

```
{
  "ak": {
    "anchorage": {
      "coords": "61.218, -149.9",
      "formatted_location": "Anchorage, AK"
    },
    "juneau": {
      "coords": "58.302, -134.42",
      "formatted_location": "Juneau, AK"
    }
  },
  "al": {
    "birmingham": {
      "coords": "33.521, -86.802",
      "formatted_location": "Birmingham, AL"
    },
    "decatur": {
      "coords": "34.606, -86.983",
      "formatted_location": "Decatur, AL"
    },
    "mobile": {
      "coords": "30.694, -88.043",
      "formatted_location": "Mobile, AL"
    }
  },
  "ar": {
    "jacksonville": {
      "coords": "34.866, -92.11",
      "formatted_location": "Jacksonville, AR"
    },
    "little_rock": {
      "coords": "34.746, -92.29",
      "formatted_location": "Little Rock, AR"
    },
    "texarkana": {
      "coords": "33.442, -94.038",
      "formatted_location": "Texarkana, AR"
    }
  }
}
```

## Built With

- [Reactjs](https://reactjs.org/) via [Create React App](https://github.com/facebook/create-react-app) - Frontend library
- [Express](https://expressjs.com/) - Server side framework
- [CSVtoJSON](https://github.com/Keyang/node-csvtojson) - The magic behind everything
- [React Dropzone](https://github.com/react-dropzone/react-dropzone) - For drag and drop file capabilities
- [Multer](https://github.com/expressjs/multer) Middleware for handling files
- [SuperAgent](https://github.com/visionmedia/superagent) - HTTP request library

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
