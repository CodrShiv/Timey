// Global Declarations
let cities = [],
  countries = [],
  date,
  time,
  timeOptions = { dateStyle: "full", timeStyle: "short" },
  localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  timeDOM = document.querySelector("#clock #time"),
  dateDOM = document.querySelector("#clock #date"),
  locationDOM = document.querySelector("#location"),
  options = [],
  dataCache,
  identifier;

// Accessing the cityMap.json file from the city-timezones Repository licensed under MIT.
fetch(
  "https://raw.githubusercontent.com/kevinroberts/city-timezones/master/data/cityMap.json"
)
  .then((response) => response.json())
  .then((data) => populateOptions(data));

// Initializing the Clock with LocalTimeZone
initializeClock(undefined, localTimeZone);

document.addEventListener("awesomplete-selectcomplete", (e) => {
  if (e.target.value.includes(",")) identifier = e.target.value.split(", ")[0];
  else identifier = e.target.value;
  cityInfo = dataCache.find((info) => {
    if (info.city == identifier || info.country == identifier) return info;
  });
  initializeClock(e.target.value, cityInfo.timezone);
});

// Populate City and Country Options from the dataSet
function populateOptions(dataSet) {
  // Assigning the dataSet to the Global dataCache and clearing the dataSet
  dataCache = dataSet;
  dataSet = null;
  for (i = 0; i < dataCache.length; i++) {
    let cityData = dataCache[i];
    cities.push({
      label: `<div id="city">${cityData.city},</div> <div id="country">${cityData.country}</div><span style="display: none;">${cityData.province}</span>`,
      value: `${cityData.city}, ${cityData.country}`,
    });
    // Preventing Duplicate Country entries
    if (
      countries.some(
        (country) => country.label == `${cityData.country} - ${cityData.iso3}`
      )
    )
      continue;
    countries.push({
      label: `${cityData.country} - ${cityData.iso3}`,
      value: `${cityData.country}`,
    });
  }
  options = [...new Set([...countries, ...cities])];
  new Awesomplete(document.querySelector("#city"), {
    list: options,
    maxItems: 1,
  });
}

// Update the DOM with the specified Location and TimeZone
function initializeClock(location, timeZone) {
  if (location) locationDOM.textContent = location;
  else locationDOM.textContent = timeZone.split("/").reverse().join(", ");
  [date, time] = new Date()
    .toLocaleString("en-GB", { timeZone: timeZone, ...timeOptions })
    .split(" at ");
  updateTime(date, time);

  // Updating the Time every Minute
  setInterval(() => {
    [date, time] = new Date()
      .toLocaleString("en-GB", { timeZone: timeZone, ...timeOptions })
      .split(" at ");
    updateTime(date, time);
  }, 60000);
}
function updateTime(date, time) {
  dateDOM.textContent = date;
  timeDOM.textContent = time;
}
