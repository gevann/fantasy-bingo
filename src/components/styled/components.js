import styled from 'styled-components';
import React from 'react';

/**
 * Colors
 */
// Basic
const colorRgbaBlack08 = 'rgba(0, 0, 0, 0.8)';
const colorWhite = '#fff';
const colorOffWhite = '#a9a9a9';
const colorOffWhiteBright = '#c8c8c8'
const colorDarkGray2b2b2b = '#2b2b2b';
const colorDarkGray303131 = '#303131';
const colorDarkDarkGray282828 = '#282828';
const colorTeal = '#025959';
const colorBlack = '#000';
const colorDarkGray333 = '#333';
const colorLightGrayCcc = '#ccc';
const colorBlue = '#0558b0';
// By usage
const colorHighlight = colorBlue;
const colorBackgroundMain = colorDarkGray2b2b2b;
const colorBackgroundSecondary = colorBlack;
const colorFontMain = colorOffWhite;
const colorFontSecondary = colorOffWhiteBright;

// Styled Components
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

export const GridItem = styled(({ isHovered, ...props }) => <div {...props} />)`
  position: relative;
  perspective: 1000px;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  transform: ${props => props.isHovered ? 'translate(-2px, -2px)' : 'none'};
  transition: transform 0.3s ease-in-out;
`;

export const Flipper = styled(({ flipped, ...props }) => <div {...props} />)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

export const FlipIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: ${colorFontMain};
  cursor: pointer;  
`;

export const TextArea = styled(({ isEditing, ...props }) => <textarea {...props} />)`
    width: 90%; // Adjust as needed
    height: 80%; // Adjust as needed
    border: none;
    background: none;
    outline: none;
    color: ${colorFontMain};
    resize: none; // Disable resizing
    font-size: 16px;
    overflow: auto; // Allow scrolling
    word-wrap: ${props => props.isEditing ? 'none' : 'break-word'};
    word-break: ${props => props.isEditing ? 'break-all' : 'normal'};
    white-space: ${props => props.isEditing ? 'pre' : 'normal'};
    overflow-wrap: ${props => props.isEditing ? 'break-word' : 'normal'};
`;

export const CellFront = styled(({ hasContent, ...props }) => <div {...props} />)`
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
  background-color: ${props => props.hasContent ? colorTeal : colorDarkDarkGray282828};
`;

export const CellBack = styled(CellFront)`
  transform: rotateY(180deg);
  color: ${colorFontMain};
  transform: rotateY(180deg);
  background-color: ${colorDarkGray303131};
  position: relative;
  padding-top: 20px;
`;

export const CellTitle = styled.h3`
  margin: 0;
  padding: 0;
  cursor: pointer;
  font-size: 16px;
  color: ${colorFontMain};
  text-align: center;
  text-shadow: 0 0 10px ${colorRgbaBlack08};
`;

// Should go on a line below the H3 title
export const CellFrontContent = styled.div`
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
  color: ${colorFontMain};
`;

export const InfoIcon = styled.span`
    margin-left: 5px;
    margin-top: -5px;
    cursor: pointer;
    font-size: 10px;
`;

// Styled checkbox component
export const CheckboxContainer = styled.div`
  position: absolute; // Positioning it absolutely within the CellBack
  bottom: 25px; // Distance from the bottom
  left: 5px; // Distance from the left
  display: flex;
  align-items: center;
`;

export const CheckboxLabel = styled.label`
  margin-left: 5px;
  cursor: pointer;
`;

export const StyledCheckbox = styled.div`
  display: inline-block;
  width: 15px;
  height: 15px;
  position: relative;
  background: ${props => props.checked ? colorDarkGray303131 : 'transparent'};
  border: 2px solid ${colorFontMain};
  border-radius: 3px;
  transition: all 150ms;
  cursor: pointer;
`;

export const FatUnicodeCheckMark = styled(({ checked, ...props }) => <span {...props} />)`
    visibility: ${props => props.checked ? 'visible' : 'hidden'};
    position: absolute;
    top: -10px;
    left: 0;
    font-size: 24px;
    font-weight: bolder;
    font-family: Arial, sans-serif;
    color: ${colorFontMain};
    shadow: 0 0 10px ${colorRgbaBlack08};
`;

// Container holds the sheet list on the left side of the screen in a row,
// and the BingoGrid on the right side of the screen.
export const Container = styled.div`
display: flex;
flex-direction: row;
`;

// SheetList displates all of the sheets in a single row
// along the left side of the screen.
// The right side of the screen is the BingoGrid.
export const SheetList = styled.div`
  display: flex;
  flex-direction: column; /* Changed from row to column */
  align-items: center;
  width: 20%; /* Set a fixed width or use percentage */
  background-color: ${colorBackgroundSecondary};
  color: ${colorFontSecondary};
`;

// Takes up the right side of the screen, about 80% of the width.
// Goes to the bottom of the screen.
export const DisplaySheet = styled.div`
    position: relative;
    width: 100%;
    background-color: ${colorBackgroundMain};
    color: ${colorFontMain};
    min-height: 100vh;

    .share-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;

        &:hover {
          transform: scale(1.2)
      }
        /* Style your icon here */
    }

    .download-icon {
        position: absolute;
        top: 30px;
        right: 10px;
        cursor: pointer;

        &:hover {
            transform: scale(1.2)
        }
        /* Style your icon here */
    }

    .upload-input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .custom-upload-button {
      position: absolute;
        top: 50px;
        right: 10px;
        cursor: pointer;

        &:hover {
            transform: scale(1.2)
        }
    }

    .restore-backup {
      position: absolute;
        top: 70px;
        right: 10px;
        cursor: pointer;

        &:hover {
            transform: scale(1.2)
        }
`;

export const DeleteX = styled.div`
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: ${colorWhite};
  cursor: pointer;
  margin-right: 10px;
        
  &:hover {
      transform: scale(1.2)
  }
`;

export const entryHeight = '50px';
export const entryWidth = '100%';

export const NewSheetPlaceHolder = styled(({ isCreatingNewSheet, ...props }) => <div {...props} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${entryWidth};
  height: ${entryHeight};
  margin-bottom: 10px; /* Consistent margin with SheetListEntry */
  ${props => props.isCreatingNewSheet && `background-color: ${colorHighlight};`}

  &:hover {
    background-color: ${colorHighlight};
  }
`;

export const SheetListEntry = styled(({ sheetId, activeSheetId, ...props }) => <div {...props} />)`
  display: flex;
  flex-direction: row;
  align-items: center; // Centers items vertically in the flex container
  justify-content: space-between; // Space between title and delete button
  width: ${entryWidth};
  height: ${entryHeight};
  margin: 10px;
  border-radius: 10px;
  &:hover {
    background-color: ${colorHighlight};
  }
  ${props => props.activeSheetId === props.sheetId && `background-color: ${colorHighlight};`}
`;

// export const SheetTitle = styled(({ isEditing, ...props }) => <textarea {...props} />)`
//     height: auto; // Allows the textarea to grow and shrink
//     max-height: 20px; // Set this to the line-height or height of your text
//     // Additional styles for single-line appearance
//     overflow: hidden; // Hides the overflow text
//     text-overflow: ellipsis; // Adds an ellipsis for overflow text
//     white-space: nowrap; // Prevents text wrapping
//     border: none;
//     background: none;
//     outline: none;
//     color: ${colorWhite};
//     resize: none; // Disable resizing
//     font-size: 16px;
//     margin: 0 20px; // Removed top and bottom margins to allow vertical centering
//     word-wrap: ${props => props.isEditing ? 'none' : 'break-word'};
//     word-break: ${props => props.isEditing ? 'break-all' : 'normal'};
//     white-space: ${props => props.isEditing ? 'pre' : 'nowrap'};
//     overflow-wrap: ${props => props.isEditing ? 'break-word' : 'normal'};
// `;

const Textarea = styled.textarea`
height: auto; // Allows the textarea to grow and shrink
max-height: 20px; // Set this to the line-height or height of your text
// Additional styles for single-line appearance
overflow: hidden; // Hides the overflow text
text-overflow: ellipsis; // Adds an ellipsis for overflow text
white-space: nowrap; // Prevents text wrapping
border: none;
background: none;
outline: none;
color: ${colorWhite};
resize: none; // Disable resizing
font-size: 16px;
margin: 0 20px; // Removed top and bottom margins to allow vertical centering
word-wrap: ${props => props.isEditing ? 'none' : 'break-word'};
word-break: ${props => props.isEditing ? 'break-all' : 'normal'};
white-space: ${props => props.isEditing ? 'pre' : 'nowrap'};
overflow-wrap: ${props => props.isEditing ? 'break-word' : 'normal'};
`;

export const SheetTitle = React.forwardRef(({ isEditing, ...props }, ref) => (
    <Textarea ref={ref} {...props} />
));

export const CopiableContent = styled(({ canCopy, ...props }) => <div {...props} />)`
    position: relative;
    cursor: default;
    justify-content: left;
    ${props => props.canCopy && `
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }

      &:after {
        content: 'Copy to clipboard';
        position: absolute;
        top: -20px;
        left: 0;
        font-size: 12px;
        color: ${colorWhite};
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
      }
    `}
  `;
  
  export const ModalBackdrop = styled.div`
    position: fixed; /* Covers the entire viewport */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  `;
  
  export const ModalContent = styled(({ canCopy, ...props }) => (<div {...props} />))`
    color: black;
    background-color: ${colorWhite};
    padding: 20px;
    border-radius: 10px;
    position: relative;
    max-width: 500px;
    word-wrap: break-word;
    word-break: ${props => props.canCopy ? 'break-all' : 'normal'};
  `;
  
  export const CloseButton = styled.button`
    position: absolute;
    top: -30px;
    right: -30px;
    border: none;
    cursor: pointer;
    color: black;
    background-color: ${colorWhite};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-weight: bold;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;


export const SelectorContainer = styled.div`
  padding: 20px;
  background: none;
  border-radius: 10px;
  margin: 20px;
  text-align: center;
  width: 80%;
`;

export const StyledSelect = styled.select`
  padding: 8px 12px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid ${colorLightGrayCcc};
  background-color: white;
`;

export const CreateButton = styled.button`
  padding: 8px 15px;
  background-color: ${colorDarkGray333}; // Adjust for your app's color scheme
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${colorHighlight}; // Adjust for hover state
  }
`;