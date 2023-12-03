import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const BingoGrid = ({ sheetId, sheet, updateCell, onInfoClick }) => {
  const gridItems = sheet?.cells || [];
  return (
    <Grid>
      {gridItems.map((cell, index) => (
        <BingoCell 
            key={index} 
            cellId={cell.id} 
            cell={cell} 
            updateCell={updateCell} 
            onInfoClick={onInfoClick}
        />
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

const CellFront = styled(({ hasContent, ...props }) => <div {...props} />)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column; // Stack children vertically
  align-items: center;
  justify-content: center;
  transform: rotateY(0deg);
  border-radius: 10px; // Rounded corners
  backface-visibility: hidden;
  border-radius: 10px;
  background-color: #2b2b2b;
  ${props => props.hasContent && `box-shadow: inset 0 0 20px -5px #fff;`}
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
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
`;

// Should go on a line below the H3 title
const CellFrontContent = styled.div`
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
  color: #fff;
`;

const InfoIcon = styled.span`
    margin-left: 5px;
    margin-top: -5px;
    cursor: pointer;
    font-size: 10px;
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

const BingoCell = ({ onInfoClick, cell, updateCell }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const hasContent = !!(cell.input?.length > 0);

  const handleFlipClick = (e) => {
    e.stopPropagation();
    setFlipped(!flipped);
  };

  // If the user clicks outside of the cell, 
  // flip it back over if it's flipped
  const ref = React.useRef();
  useClickOutside(ref, () => {
    if (flipped) {
      setFlipped(false);
    }
  });

  return (
    <div ref={ref}>
    <GridItem 
      isHovered={isHovered}
      >
      <Flipper flipped={flipped}>
        <CellFront
          hasContent={hasContent}
        >
          <CellTitle
            onClick={() => onInfoClick(cell.description)}
          >{cell.title}
            <InfoIcon >ⓘ</InfoIcon>
          </CellTitle>
          {hasContent && (
            <CellFrontContent>
              {cell.input}
              </CellFrontContent>
          )}
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
                value={cell.input} 
                isEditing={isEditing}
                onChange={(e) => updateCell({
                    ...cell,
                    input: e.target.value
                })} 
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
                checked={cell.isHardMode}
                onChange={() => updateCell({
                    ...cell,
                    isHardMode: !cell.isHardMode,
                }) } // Use the handler function
            />
        </CellBack>
      </Flipper>
    </GridItem>
    </div>
  );
};

  // Flip the card back over if the user clicks outside of it
  // if it's flipped
  const useClickOutside = (ref, onClickOutside) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          onClickOutside();
        }
      };
  
      // Delay the activation of the event listener
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100); // Adjust delay as needed
  
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }, [ref, onClickOutside]);
  };