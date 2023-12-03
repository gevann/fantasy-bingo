import React, { useState, useEffect } from 'react';
import {
  Grid,
  GridItem,
  Flipper,
  CellFront,
  CellBack,
  FlipIcon,
  TextArea,
  CellTitle,
  InfoIcon,
  CellFrontContent,
  CheckboxContainer,
  CheckboxLabel,
  StyledCheckbox,
  FatUnicodeCheckMark,
} from './styled/components';

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