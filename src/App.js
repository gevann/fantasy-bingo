import React from 'react';
import styled from 'styled-components';
import BingoSheetsList from './components/BingoSheetsList';

function App() {
  return (
    <AppContainer>
      <BingoSheetsList />
    </AppContainer>
  );
}

export default App;

// Styled Components
const AppContainer = styled.div`
  text-align: center;
`;