/**
 * Shared type documentation for weather data structures.
 * Used as a reference across frontend and backend.
 */

/**
 * @typedef {Object} GeoInfo
 * @property {number} lat
 * @property {number} lon
 * @property {string} name
 * @property {string} country
 * @property {string} [state]
 */

/**
 * @typedef {Object} CurrentWeather
 * @property {string} location
 * @property {string} country
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} temperature
 * @property {number} feels_like
 * @property {number} temp_min
 * @property {number} temp_max
 * @property {number} humidity
 * @property {number} pressure
 * @property {string} weather_condition
 * @property {string} description
 * @property {string} icon
 * @property {number} wind_speed
 * @property {number} wind_direction
 * @property {number|null} visibility
 * @property {number} cloudiness
 * @property {number} sunrise
 * @property {number} sunset
 * @property {string} timestamp
 * @property {AirQuality|null} air_quality
 * @property {UVIndex|null} uv_index
 */

/**
 * @typedef {Object} ForecastDay
 * @property {string} date
 * @property {number} temp_min
 * @property {number} temp_max
 * @property {number} avg_temp
 * @property {string} weather_condition
 * @property {number} humidity
 * @property {number} wind_speed
 * @property {string} icon
 */

/**
 * @typedef {Object} HistoricalDay
 * @property {string} date
 * @property {number} temp_max
 * @property {number} temp_min
 * @property {number} precipitation
 * @property {number} wind_speed_max
 * @property {string} weather_condition
 */

/**
 * @typedef {Object} AirQuality
 * @property {number} us_aqi
 * @property {number} pm10
 * @property {number} pm2_5
 * @property {string} category
 */

/**
 * @typedef {Object} UVIndex
 * @property {number} value
 * @property {string} category
 */

/**
 * @typedef {Object} WeatherRecord
 * @property {number} id
 * @property {string} location
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {string|null} start_date
 * @property {string|null} end_date
 * @property {number|null} temperature
 * @property {string|null} weather_condition
 * @property {number|null} humidity
 * @property {number|null} wind_speed
 * @property {string|null} notes
 * @property {ForecastDay[]|null} forecast
 * @property {string} created_at
 * @property {string} updated_at
 */

module.exports = {};
