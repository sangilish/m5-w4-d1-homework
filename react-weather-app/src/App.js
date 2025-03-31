import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Font Awesome 관련 import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTemperatureLow, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';

// 국가 코드 라이브러리 import 및 언어 등록
import countries from 'i18n-iso-countries';
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

function App() {
  // 1. 상태(state) 설정
  const [apiData, setApiData] = useState({});
  const [getState, setGetState] = useState('Irvine, USA');
  const [state, setState] = useState('Irvine, USA');

  // 2. API 키와 URL 설정 (.env에 저장된 API 키 사용)
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}`;

  // 3. useEffect를 사용하여 state(도시)가 변경될 때마다 API 요청
  useEffect(() => {
    if (!state) return;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setApiData(data))
      .catch((err) => console.error('Error fetching data:', err));
  }, [apiUrl, state]);

  // 4. 이벤트 핸들러 함수들
  // 4-1. inputHandler: 입력 필드에서 값을 받아 getState에 저장
  const inputHandler = (e) => {
    setGetState(e.target.value);
  };

  // 4-2. submitHandler: 입력된 getState 값을 state로 복사(이후 API 요청 시 사용)
  const submitHandler = () => {
    setState(getState);
  };

  // 5. 켈빈 온도를 화씨 온도로 변환 (소수점 없이 반올림)
  const kelvinToFahrenheit = (k) => {
    return ((k - 273.15) * 1.8 + 32).toFixed(0);
  };

  return (
    <div className="App">
      {/* 헤더 영역 */}
      <header className="d-flex justify-content-center align-items-center p-3">
        <h2>React Weather App</h2>
      </header>

      {/* 검색 영역 */}
      <div className="container mt-3 d-flex flex-column justify-content-center align-items-center">
        <div className="col-auto">
          <label htmlFor="location-name" className="col-form-label">
            Enter Location:
          </label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            id="location-name"
            className="form-control"
            onChange={inputHandler}
            value={getState}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={submitHandler}>
          Search
        </button>

        {/* 날씨 카드 영역 */}
        <div className="card mt-3">
          {apiData.main ? (
            <div className="card-body text-center">
              {/* 1차 블록: 아이콘, 현재 온도, 도시명 */}
              <img
                src={`http://openweathermap.org/img/w/${apiData.weather[0].icon}.png`}
                alt="weather status icon"
                className="weather-icon"
              />
              <h2>{kelvinToFahrenheit(apiData.main.temp)}° F</h2>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-dark" />
                <strong>{apiData.name}</strong>
              </p>

              {/* 2차 블록: 최저/최고 온도, 날씨 상태, 국가 */}
              <div className="row mt-4">
                {/* 왼쪽 열: 최저/최고 온도 */}
                <div className="col-md-6">
                  <p>
                    <FontAwesomeIcon icon={faTemperatureLow} className="mr-2 text-primary" />
                    <strong>{kelvinToFahrenheit(apiData.main.temp_min)}° F</strong>
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faTemperatureHigh} className="mr-2 text-danger" />
                    <strong>{kelvinToFahrenheit(apiData.main.temp_max)}° F</strong>
                  </p>
                </div>
                {/* 오른쪽 열: 날씨 상태, 국가 */}
                <div className="col-md-6">
                  <p>
                    <strong>{apiData.weather[0].main}</strong>
                  </p>
                  <p>
                    <strong>
                      {countries.getName(apiData.sys.country, 'en', { select: 'official' })}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-center p-4">Loading...</h1>
          )}
        </div>
      </div>

      {/* 푸터 영역 */}
      <footer className="footer">
        © React Weather App
      </footer>
    </div>
  );
}

export default App;