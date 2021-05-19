import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from './Table';
import { sortData } from './util';
// import "leaflet/dist/leaflet.css";
// import MapData from './MapData';

const App = () => {
    const [countries,setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData,setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    // const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796})
    // const [mapZoom, setMapZoom] = useState(3);
    // const [mapCountries, setMapCountries] = useState([]);

    //once the app.js load it should fire once
    useEffect(()=> {
       fetch("https://disease.sh/v3/covid-19/all")
       .then(response => response.json())
       .then(data => {
           setCountryInfo(data);
       });
    },[]);

    useEffect(()=> {
      const getCountriesData = async() => {
          await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response)=> response.json())
          .then((data)=> {
              const countries = data.map((country)=> ({
                      name: country.country,
                      value : country.countryInfo.iso2,
              }));
            const sortedData = sortData(data);
              setTableData(sortedData);
              setCountries(countries);
              //setMapCountries(data);
          });
      }
      getCountriesData();
  },[]);

  const onChangeCountry = async(event) => {
        const countryCode = event.target.value;
        // console.log(countryCode);

        // https://disease.sh/v3/covid-19/all
        // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

        const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(url)
        .then(response => response.json())
        .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
            // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            // setMapZoom(4);
        })
  };

  console.log("COUNTRY INFO >>> : ", countryInfo);

    return (
        <div className="app">
        <div className="app__left">
        <div className="app__header">
                <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                    <Select variant="outlined" onChange={onChangeCountry} value={country}>
                    <MenuItem value="worldwide">Worldwide</MenuItem>
                        {countries.map((country)=> (
                                 <MenuItem value={country.value}>{country.name}</MenuItem>
                        ))}
                    </Select>
                    </FormControl>
        </div>


        {/* InfoBox */}
        <div className="app__stats">
            <InfoBox title="coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
            <InfoBox title="recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
            <InfoBox title="deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        {/* Rendering Map */}
        {/* <MapData
        countries={mapCountries} 
        center={mapCenter} 
        zoom={mapZoom}
        /> */}
        </div>


        {/* right side app */}
        <Card className="app__right">
            <CardContent>
            {/* Tables */}
                <h3>Live cases by country</h3>
                <Table countries={tableData}/>
                <h3>Worldwide new cases</h3>
                <LineGraph casesType={casesType}/>
            </CardContent>
        </Card>
        </div>
    )
}

export default App
