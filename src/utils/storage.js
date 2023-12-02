import { deflate, inflate } from 'pako';
import { v4 as uuidv4 } from 'uuid';
import bingoData from '../bingoData.json'; // Adjust the path as needed

export const exportSheetData = (sheetData) => {
    console.log('sheetData', sheetData)
    const minimizedData = prepareDataForExport(sheetData);
    const jsonString = JSON.stringify(minimizedData);
    const compressed = deflate(jsonString);
    const str = compressed.toString()
    const encoded = btoa(str);
    return encoded;
}

export const importSheetData = (compressedDataStr) => {
    try {
        const decoded = atob(compressedDataStr);
        console.log('decoded', decoded)
        const charData = decoded.split(',');
        const binData = Uint8Array.of(...charData);
        const decompressed = inflate(binData, { to: 'string' });
        const { key, cells } = JSON.parse(decompressed); // Parse JSON
        const expandedCells = expandCellData(cells);

        const newSheet = createNewSheet(key);
        newSheet.cells = newSheet.cells.map((cell, index) => ({
            ...cell,
            input: expandedCells[index].input,
            isHardMode: expandedCells[index].isHardMode
        }));

        return newSheet;
    } catch (error) {
        console.error('Error importing sheet data:', error);
        return null;
    }
};


export const createShareableLink = (sheetData) => {
    const baseUrl = window.location.origin;
    const encodedData = exportSheetData(sheetData);
    const shareableLink = `${baseUrl}?data=${encodeURIComponent(encodedData)}`;
    return shareableLink;
};

export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const loadDataFromQueryParam = () => {
    const encodedData = getQueryParam("data");
    if (encodedData) {
        return importSheetData(encodedData);
    }
    return null; // or your default data
};

export const createNewSheet = (key) => {
    const data = bingoData[key];
        const sheetId = uuidv4();
        const newSheet = {
            key: key,
            id: sheetId,
            title: data.title,
            cells: data.cells.map((cell) => ({
                sheetId: sheetId,
                id: uuidv4(),
                title: cell.title,
                description: cell.description,
                input: '',
                isHardMode: false,
            })),
        };

    return newSheet;
}


const expandCellData = (minimizedCells) => {
    return minimizedCells.map(({ i, h }) => ({
        input: i,
        isHardMode: h === 1
    }));
};

const prepareDataForExport = (sheet) => {
    const { key, cells } = sheet; // Assuming 'key' is the identifier of the sheet structure in your JSON data

    const minimizedCells = cells.map(({ input, isHardMode }) => ({
        i: input || "", // Shorten 'input' to 'i'
        h: isHardMode ? 1 : 0 // Convert boolean to 0/1 for 'isHardMode'
    }));

    return { key, cells: minimizedCells };
};