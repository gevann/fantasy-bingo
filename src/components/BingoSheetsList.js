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
import BingoGrid from './BingoGrid';
import bingoData from '../bingoData.json'; // Adjust the path as needed
import {
  createShareableLink, 
  importSheetData, 
  createNewSheet, 
  downloadData, 
  storageKeys, 
  getSheetsOrDefault, 
  uploadData,
  restoreBackUp,
  getFirstSheetOrDefault
} from '../utils/storage';

import {
  Container,
  SheetList,
  DisplaySheet,
  NewSheetPlaceHolder,
  SheetListEntry,
  SheetTitle,
  DeleteX,
  ModalBackdrop,
  ModalContent,
  CloseButton,
  CopiableContent,
  SelectorContainer,
  StyledSelect,
  CreateButton
} from './styled/components';

/**
 * A component that give the user a selector of `bingoDataJsonKeys` to choose from
 * and a button to create a new sheet with the selected `bingoDataJsonKey`.
 */
const NewBingoSheetSelector = ({ addSheet }) => {
  const bingoDataJsonKeys = Object.keys(bingoData);
  const [selectedKey, setSelectedKey] = useState(bingoDataJsonKeys[0]);

  return (
    <SelectorContainer>
      <StyledSelect
        value={selectedKey}
        onChange={(e) => setSelectedKey(e.target.value)}
      >
        {bingoDataJsonKeys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </StyledSelect>
      <CreateButton onClick={() => addSheet(selectedKey)}>Create</CreateButton>
    </SelectorContainer>
  );
};


const BingoSheetsList = () => {
    const [sheets, setSheets] = useState(getSheetsOrDefault());
    const [isEditing, setIsEditing] = useState(false);
    const [isCreatingNewSheet, setIsCreatingNewSheet] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [canCopy, setCanCopy] = useState(false);
    const textAreaRefs = useRef({});

    const handleSetIsCreatingNewSheet = (value) => {
      setIsCreatingNewSheet(value);
      
      value && toggleSheet(null);
    };

    const openModal = (content, canCopy=false) => {
      setCanCopy(canCopy);
      setModalContent(content);
      setIsModalOpen(true);
    };  
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        localStorage.setItem(storageKeys.current, JSON.stringify(sheets));
    }, [sheets]);

    useEffect(() => {
      const sheetsFromStorage = JSON.parse(localStorage.getItem(storageKeys.current)) || {};
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
          setSheets(sheetsFromStorage);
      }

      toggleSheet(getFirstSheetOrDefault().id);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      Object.values(textAreaRefs.current).forEach((ref) => {
        if (ref) {
          ref.scrollLeft = 0;
        }
      });
    }
  }, [isEditing]);
    
    const addSheet = (selectedKey) => {
        const newSheet = createNewSheet(selectedKey);
        setSheets({ ...sheets, [newSheet.id]: newSheet });
        toggleSheet(newSheet.id);
        handleSetIsCreatingNewSheet(false);
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
        console.log(`Setting active sheet to ${sheetId}`)
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

    const handleDownload = () => {
      const url = downloadData(getSheetsOrDefault());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MyBingoSheets.json'; // Name of the file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up to avoid memory leaks
    };

    const handleUpload = (e) => {
      const file = e.target.files[0];
      uploadData(file)
        .then(() => {
          alert('Upload successful!');
          setSheets(getSheetsOrDefault());
          toggleSheet(getFirstSheetOrDefault().id);
        })
        .catch((error) => {
          alert('Upload failed. Please try again.');
          console.error(error);
        });
    }

    const handleRestore = () => {
      restoreBackUp();
      setSheets(getSheetsOrDefault());
      toggleSheet(getFirstSheetOrDefault().id)
    }
      
    return (
        <Container>
        <SheetList>
            <NewSheetPlaceHolder
                isCreatingNewSheet={isCreatingNewSheet}
                onClick={() => handleSetIsCreatingNewSheet(true)}
            >New</NewSheetPlaceHolder>
            {Object.entries(sheets).map(([sheetId, sheet]) => (
            <SheetListEntry 
                key={sheetId}
                onClick={() => {
                    handleSetIsCreatingNewSheet(false);
                    toggleSheet(sheetId)}
                }
                activeSheetId={activeSheetId}
                sheetId={sheetId}
            >
                <SheetTitle
                    ref={(el) => (textAreaRefs.current[sheetId] = el)}
                    type="text" 
                    value={sheet.title} 
                    // isEditing={isEditing}
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
            <div className="download-icon" onClick={handleDownload}>
                Download {/* Replace with an actual icon */}
            </div>
            <div className="file-upload">
              <label htmlFor="file-upload" className="custom-upload-button">
                Upload
              </label>
              <input 
                id="file-upload"
                className="upload-input" 
                type="file" 
                onChange={handleUpload}
                accept=".json"
              />
            </div>
            <div className="restore-backup" onClick={handleRestore}>
              Restore
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