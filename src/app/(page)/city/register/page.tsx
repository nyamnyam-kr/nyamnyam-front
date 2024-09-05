"use client";
import { insertCity } from '@/app/service/city/city.api';
import React, { useState, ChangeEvent, FormEvent } from 'react';

// 스타일 객체에 대한 타입 선언
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    maxWidth: '400px',
    margin: '50px auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  result: {
    marginTop: '30px',
    textAlign: 'center',
    color: '#555',
  },
};

export default function Home() {
  const [cityName, setCityName] = useState<string>('');

  // input 필드의 값이 변경될 때 호출되는 함수
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCityName(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const cityData: CityModel = { cityName }; // CityModel 객체 생성
      const result = await insertCity(cityData);
      alert(`입력한 도시 이름: ${cityName}가 저장되었습니다.`);
      setCityName(''); // 입력 후 필드를 비웁니다.
    } catch (error) {
      console.error("Error inserting city:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>도시 이름 입력</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={cityName}
          onChange={handleInputChange}
          placeholder="도시 이름을 입력하세요"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          저장
        </button>
      </form>
      {cityName && (
        <div style={styles.result}>
          <h3>입력한 도시 이름:</h3>
          <p>{cityName}</p>
        </div>
      )}
    </div>
  );
}