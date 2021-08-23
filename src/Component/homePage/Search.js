
import React, { useEffect } from 'react'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { actions } from "../../redux/Action";

export default function Search() {

  const dispatch = useDispatch()
  const currentCity = useSelector(
    (state) => state.weather.currentCity);

  useEffect(() => {
    search()
  })

  function search() {
    let key = 0
    // this http method return the key of serch city 
    axios({
      method: "get",
      // ${process.env.API_KEY}
      url: `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=GBK5cAlYGOGl1TCFGQB2NVftmF6ALw7E&q=${currentCity}`,
    })
      .then(function (response) {
        key = response?.data[0]?.Key
        // this http method return the temperature of the city
        axios({
          method: "get",
          url: `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=GBK5cAlYGOGl1TCFGQB2NVftmF6ALw7E`,
        }).then(function (response) {
          let temp = response.data[0].Temperature.Metric.Value;
          let weather = response.data[0].WeatherText;
          dispatch(actions.setCurrentTemp({ temp, weather }))

          // this http method return the data of 5 days
          axios({
            method: "get",
            url: `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=GBK5cAlYGOGl1TCFGQB2NVftmF6ALw7E&metric=true`,
          }).then(function (response) {
            dispatch(actions.setArrDays(response.data.DailyForecasts))
          }).catch((err) => {
            console.error(err);
          });
        }).catch((err) => {
          console.error(err);
        });
      })
      .catch((err) => {
        console.error(err);
      });

  }
  return (
    <>
      <input style={{ marginLeft: "40%", marginTop: "3%", fontSize: "150%" }} onChange={(e) => dispatch(actions.setCurrentCity(e.target.value))} value={currentCity}></input>
      <button style={{ fontSize: "150%" }} onClick={search}>Search...</button>
    </>
  );
}