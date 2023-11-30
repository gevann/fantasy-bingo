import React, { useState } from 'react';
import styled from 'styled-components';
import BingoGrid from './components/BingoGrid';
import bingoData from './bingoData.json';

function App() {
  const [year, setYear] = useState('2023');
  const years = Object.keys(bingoData);

  return (
    <AppContainer>
      <h1>r/Fantasy Bingo Challenge</h1>
      <YearSelector
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </YearSelector>
      <BingoGrid year={year} />
    </AppContainer>
  );
}

export default App;

// Styled Components
const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const YearSelector = styled.select`
  margin-bottom: 20px;
`;
