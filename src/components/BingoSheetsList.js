/*
* A component that lists all of the user's bingo sheets
* as they have them stored in local storage.
* Sheets have:
*   - UUID (generated by uuidv4 upon creation) 
*   - Title (user input, defaults to "Untitled")
*
* The user can:
*   - Create a new sheet
*   - Delete an existing sheet
*   - Edit the title of an existing sheet
*   - View the bingo sheet (the BingoGrid component)
*/

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import BingoGrid from './BingoGrid';
import bingoData from '../bingoData.json'; // Adjust the path as needed
import {createShareableLink, importSheetData, createNewSheet} from '../utils/storage';

/**
 * A component that give the user a selector of `bingoDataJsonKeys` to choose from
 * and a button to create a new sheet with the selected `bingoDataJsonKey`.
 */
const NewBingoSheetSelector = ({ addSheet }) => {
    const bingoDataJsonKeys = Object.keys(bingoData);
    const [selectedKey, setSelectedKey] = useState(bingoDataJsonKeys[0]);
    
    return (
        <div>
        <div>Create a new bingo sheet:</div>
        <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
        >
            {bingoDataJsonKeys.map((key) => (
            <option key={key} value={key}>
                {key}
            </option>
            ))}
        </select>
        <button onClick={() => addSheet(selectedKey)}>Create</button>
        </div>
    );
};

const BingoSheetsList = () => {
    const getSheetsOrDefault = () => {
      const sheetsFromStorage = JSON.parse(localStorage.getItem('sheets'));
      return sheetsFromStorage || {};
    };
    const [sheets, setSheets] = useState(getSheetsOrDefault());
    const [isEditing, setIsEditing] = useState(false);
    const [isCreatingNewSheet, setIsCreatingNewSheet] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [canCopy, setCanCopy] = useState(false);

    const openModal = (content, canCopy=false) => {
      setCanCopy(canCopy);
      setModalContent(content);
      setIsModalOpen(true);
    };  
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        localStorage.setItem('sheets', JSON.stringify(sheets));
    }, [sheets]);

    useEffect(() => {
      const sheetsFromStorage = JSON.parse(localStorage.getItem('sheets')) || {};
      const queryParams = new URLSearchParams(window.location.search);
      const encodedData = queryParams.get("data");

      if (encodedData) {
          const importedSheet = importSheetData(encodedData);
          if (importedSheet && !sheetsFromStorage[importedSheet.id]) {
              // Add the imported sheet if it doesn't already exist
              const updatedSheets = { ...sheetsFromStorage, [importedSheet.id]: {
                  ...importedSheet,
                  title: importedSheet.title + ' (Imported)',
              }
          };
              setSheets(updatedSheets);
          }
          window.history.replaceState(null, null, window.location.pathname);
      } else {
          // Load sheets from localStorage if no query param
          setSheets(sheetsFromStorage);
      }
  }, []);
    
    const addSheet = (selectedKey) => {
        const newSheet = createNewSheet(selectedKey);
        setSheets({ ...sheets, [newSheet.id]: newSheet });
        toggleSheet(newSheet.id);
        setIsCreatingNewSheet(false);
    };
    
    const deleteSheet = (id) => {
        const newSheets = { ...sheets };
        delete newSheets[id];
        setSheets(newSheets);
    };
    
    const updateSheet = (updatedSheet) => {
        setSheets({ ...sheets, [updatedSheet.id]: updatedSheet });
    };

    const updateCell = (updatedCell) => {
        const sheet = sheets[updatedCell.sheetId];
        const updatedCells = sheet.cells.map((cell) => {
            if (cell.id === updatedCell.id) {
                return updatedCell;
            }
            return cell;
        });        
        const updatedSheet = { ...sheet, cells: updatedCells };
        updateSheet(updatedSheet);
    };

    const [activeSheetId, setActiveSheetId] = useState(null);

    // Function to change the active sheet
    const toggleSheet = (sheetId) => {
        setActiveSheetId(sheetId);
    };

    const handleShareClick = () => {
        const activeSheetData = sheets[activeSheetId];
        if (activeSheetData) {
            const link = createShareableLink(activeSheetData);
            // Handle the link as needed (e.g., copy to clipboard, display in a modal, etc.)
            const canCopy = !!navigator.clipboard;
            openModal(link, canCopy)
        }
    };

    return (
        <Container>
        <SheetList>
            <NewSheetPlaceHolder
                onClick={() => setIsCreatingNewSheet(true)}
            >New</NewSheetPlaceHolder>
            {Object.entries(sheets).map(([sheetId, sheet]) => (
            <SheetListEntry 
                key={sheetId}
                onClick={() => {
                    setIsCreatingNewSheet(false);
                    toggleSheet(sheetId)}
                }
                activeSheetId={activeSheetId}
                sheetId={sheetId}
            >
                <SheetTitle
                    xzvalue={sheet.title}
                    type="text" 
                    value={sheet.title} 
                    isEditing={isEditing}
                    onChange={(e) =>
                        updateSheet({ ...sheet, title: e.target.value })
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            e.target.blur();
                        }
                    }}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                />
                    <DeleteX onClick={() => deleteSheet(sheet.id)}>
                        X
                    </DeleteX>
            </SheetListEntry>
            ))}
        </SheetList>
        <DisplaySheet>
            <div className="share-icon" onClick={handleShareClick}>
                Share {/* Replace with an actual icon */}
            </div>
            {!isCreatingNewSheet && 
                <BingoGrid 
                    sheetId={activeSheetId} 
                    sheet={sheets[activeSheetId]} 
                    updateCell={updateCell}
                    onInfoClick={openModal}
                />}
            {isCreatingNewSheet && <NewBingoSheetSelector addSheet={addSheet} />}
            {isModalOpen && (
                <Modal onClose={closeModal} content={modalContent} canCopy={canCopy}/>
            )}
        </DisplaySheet>
        </Container>
    );
};

export default BingoSheetsList;

// Container holds the sheet list on the left side of the screen in a row,
// and the BingoGrid on the right side of the screen.
const Container = styled.div`
display: flex;
flex-direction: row;
`;

// SheetList displates all of the sheets in a single row
// along the left side of the screen.
// The right side of the screen is the BingoGrid.
const SheetList = styled.div`
  display: flex;
  flex-direction: column; /* Changed from row to column */
  align-items: center;
  width: 20%; /* Set a fixed width or use percentage */
`;

// Takes up the right side of the screen, about 80% of the width.
// Goes to the bottom of the screen.
const DisplaySheet = styled.div`
    position: relative;
    width: 100%;
    background-color: #000;
    min-height: 100vh;

    .share-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        /* Style your icon here */
    }
`;

const DeleteX = styled.div`
cursor: pointer;
font-size: 20px;
font-weight: bold;
color: #fff;
cursor: pointer;
margin-right: 10px;

&:hover {
    transform: scale(1.2)
}
`;

const entryHeight = '50px';
const entryWidth = '100%';

const SheetListEntry = styled(({ sheetId, activeSheetId, ...props }) => <div {...props} />)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between; /* Adjusted for space between title and delete button */
  width: ${entryWidth};
  height: ${entryHeight};
  margin-bottom: 10px; /* Margin for spacing between entries */
  border-radius: 10px;
  &:hover {
    background-color: #333;
  }
  ${props => props.activeSheetId === props.sheetId && `background-color: #333;`}
`;

const NewSheetPlaceHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${entryWidth};
  height: ${entryHeight};
  margin-bottom: 10px; /* Consistent margin with SheetListEntry */
  &:hover {
    background-color: #333;
  }
`;

const SheetTitle = styled(({ xzvlue, isEditing, ...props }) => <textarea {...props} />)`
    max-height: 100px;
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

const Modal = ({ content, onClose, canCopy }) => {
    // Use the custom hooks
    useEscapeKey(onClose);
    useClickOutside(onClose);

    // Add a button to copy the link to the clipboard
  
    return (
      <ModalBackdrop onClick={onClose}>
        <ModalContent 
          className="modal-content" 
          onClick={e => e.stopPropagation()}
          canCopy={canCopy}
        >
          <CloseButton onClick={onClose}>×</CloseButton>
          <CopiableContent
            onClick={() => {
              if (!canCopy) return;
              navigator.clipboard.writeText(content);
              alert('Copied to clipboard!');
            }}
            canCopy={canCopy}
            >{content}</CopiableContent>
          
        </ModalContent>
      </ModalBackdrop>
    );
  };

  
  const CopiableContent = styled(({ canCopy, ...props }) => <div {...props} />)`
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
        color: #fff;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
      }
    `}
  `;
  
  const ModalBackdrop = styled.div`
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
  
  const ModalContent = styled.div`
    color: black;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    max-width: 500px;
    word-wrap: break-word;
    word-break: break-all;
  `;
  
  const CloseButton = styled.button`
    position: absolute;
    top: -30px;
    right: -30px;
    border: none;
    cursor: pointer;
    color: black;
    background-color: #fff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-weight: bold;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

// Close modal when user presses escape key, using useRef and useEffect
const useEscapeKey = (onEscape) => {
    const onEscapeRef = useRef(onEscape);
    useEffect(() => {
      onEscapeRef.current = onEscape;
    }, [onEscape]);
  
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onEscapeRef.current();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, []);
  };
  
  // Close modal when user clicks outside of it, using useRef and useEffect
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
  
// Path: src/components/BingoGrid.js