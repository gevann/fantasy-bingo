import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import bingoData from '../bingoData.json'; // Adjust the path as needed

const BingoGrid = ({ year }) => {
  const gridItems = bingoData[year]?.cells || [];

  return (
    <Grid>
      {gridItems.map((cell, index) => (
        <BingoCell key={index} cellId={index} cell={cell} />
      ))}
    </Grid>
  );
};

export default BingoGrid;

// Styled Components
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const GridItem = styled(({ isHovered, ...props }) => <div {...props} />)`
  position: relative;
  perspective: 1000px;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  box-shadow: ${props => props.isHovered ? '0px 0px 10px rgba(0, 0, 0, 0.8)' : '0px 0px 8px rgba(0, 0, 0, 0.2)'};
  transform: ${props => props.isHovered ? 'translate(-2px, -2px)' : 'none'};
  transition: transform 0.3s ease-in-out;
`;

const Flipper = styled(({ flipped, ...props }) => <div {...props} />)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const FlipIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #fff;
  cursor: pointer;  
`;

const TextArea = styled(({ isEditing, ...props }) => <textarea {...props} />)`
    width: 100%; // Adjust as needed
    height: 80%; // Adjust as needed
    border: none;
    background: none;
    outline: none;
    color: #fff;
    resize: none; // Disable resizing
    font-size: 16px;
    overflow: auto; // Allow scrolling
    margin: 20px; // Add some margin
    word-wrap: ${props => props.isEditing ? 'none' : 'break-word'};
    word-break: ${props => props.isEditing ? 'break-all' : 'normal'};
    white-space: ${props => props.isEditing ? 'pre' : 'normal'};
    overflow-wrap: ${props => props.isEditing ? 'break-word' : 'normal'};
`;

const CellFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotateY(0deg);
  border-radius: 10px; // Rounded corners
  backface-visibility: hidden;
  border-radius: 10px;
  background-color: #2b2b2b;
`;

const CellBack = styled(CellFront)`
  transform: rotateY(180deg);
  color: #fff;
  transform: rotateY(180deg);
  background-color: #303131;
  position: relative;
  padding-top: 20px;
`;

const CellTitle = styled.h3`
  margin: 0;
  padding: 0;
`;

const InfoIcon = styled.span`
    margin-left: 5px;
    margin-top: -5px;
    cursor: pointer;
    font-size: 10px;
`;

const CellDescription = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #666;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
  z-index: 10;

  ${GridItem}:hover & {
    display: block;
  }
`;

// Styled checkbox component
const CheckboxContainer = styled.div`
  position: absolute; // Positioning it absolutely within the CellBack
  bottom: 25px; // Distance from the bottom
  left: 5px; // Distance from the left
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  margin-left: 5px;
  cursor: pointer;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 15px;
  height: 15px;
  position: relative;
  background: ${props => props.checked ? '#303131' : 'transparent'};
  border: 2px solid #fff;
  border-radius: 3px;
  transition: all 150ms;
  cursor: pointer;
`;

const FatUnicodeCheckMark = styled(({ checked, ...props }) => <span {...props} />)`
    visibility: ${props => props.checked ? 'visible' : 'hidden'};
    position: absolute;
    top: -10px;
    left: 0;
    font-size: 24px;
    font-weight: bolder;
    font-family: Arial, sans-serif;
    color: #fff;
    shadow: 0 0 10px rgba(0, 0, 0, 0.8);
`;

const Checkbox = ({ className, checked, onChange }) => (
    <CheckboxContainer className={className}
        onClick={() => onChange({ target: { checked: !checked } })} // Attach the onClick event here
    >
      <StyledCheckbox>
        <FatUnicodeCheckMark checked={checked} >
        ✓
        </FatUnicodeCheckMark>
      </StyledCheckbox>
      <CheckboxLabel>Hard Mode</CheckboxLabel>
    </CheckboxContainer>
  );

const BingoCell = ({ cellId, cell }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState(() => {
    return localStorage.getItem(`cell-${cellId}`) || '';
  });
  const [isHardMode, setIsHardMode] = useState(() => {
    return localStorage.getItem(`cell-hardmode-${cellId}`) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(`cell-${cellId}`, input.trim());
  }, [input, cellId]);

  useEffect(() => {
    localStorage.setItem(`cell-hardmode-${cellId}`, isHardMode);
  }, [isHardMode, cellId]);

  const handleFlipClick = (e) => {
    e.stopPropagation();
    setFlipped(!flipped);
  };

  const handleCheckboxChange = (e) => {
    console.log('checkbox changed', e.target.checked);
    setIsHardMode(e.target.checked);
  };


  return (
    <GridItem isHovered={isHovered}>
      <Flipper flipped={flipped}>
        <CellFront>
          <CellTitle>{cell.title}</CellTitle>
          <InfoIcon 
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
          >ⓘ</InfoIcon>
          {showDescription && <CellDescription>{cell.description}</CellDescription>}
          <FlipIcon 
            onClick={handleFlipClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >⇄</FlipIcon> {/* Flip Icon */}
        </CellFront>
        <CellBack>
            <FlipIcon 
                    onClick={handleFlipClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
            >⇄</FlipIcon> {/* Flip Icon */}
            <TextArea 
                type="text" 
                value={input} 
                isEditing={isEditing}
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                    }
                }}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                placeholder="Enter book name..." 
            />
            <Checkbox
                checked={isHardMode}
                onChange={handleCheckboxChange} // Use the handler function
            />
        </CellBack>
      </Flipper>
    </GridItem>
  );
};