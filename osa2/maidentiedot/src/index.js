import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const apixuApiKey = ""

const Countries = ({ countries, setCountriesToShow }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length > 1) {
    return countries.map(c =>
      <div key={c.name}>
        {c.name}
        <button onClick={() => setCountriesToShow([c])}>show</button>
      </div>
    )
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else {
    return <div>Filter by country name</div>
  }
}

const Country = ({ country }) => {
  const [weather, setWeather] = useState(false)

  useEffect(() => {
    if (apixuApiKey === "") return
    axios
      .get(`http://api.apixu.com/v1/current.json?key=${apixuApiKey}&q=${country.capital}`)
      .then(response => {
        if (response.status === 200) {
          console.log("got 200", response)
          const data = response.data.current
          setWeather({
            temp: `${data.temp_c} Celsius`,
            condition: `http:${data.condition.icon}`,
            wind: `${data.wind_kph} kph direction ${data.wind_dir}`
          })
        }
      })
  }, [country.capital])

  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map(l => <li key={l}>{l}</li>)}
      </ul>
      <div>
        {
          weather && (
            <div>
              <h3>Weather in {country.capital}</h3>
              <div>temperature: {weather.temp}</div>
              <div><img alt="condition" src={weather.condition} width="100" /></div>
              <div>wind: {weather.wind}</div>
            </div>
          )
        }
      </div>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [countriesToShow, setCountriesToShow] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data.map(country =>
          ({
            name: country.name,
            capital: country.capital,
            population: country.population,
            languages: country.languages.map(l => l.name),
            flag: country.flag
          })
        ))
      })
  }, [])

  const filterCountries = countryName => {
    setFilter(countryName)
    setCountriesToShow(filter === '' ?
      [] :
      countries.filter(c =>
        c.name.toUpperCase().includes(countryName.toUpperCase())))
  }


  return (
    <div>
      <div>
        find countries
        <input
          value={filter}
          onChange={event => filterCountries(event.target.value)}
        />
      </div>
      <div>
        <Countries countries={countriesToShow} setCountriesToShow={setCountriesToShow} />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
