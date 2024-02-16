import React from 'react';
import * as ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { QuestionRow } from 'constants/interfaces';
import { processCompositionOrSpecializedQuestion, processTableQuestion } from './CSVExport';
import { underscoreAmount } from './utils';
interface DataItem {
  Category: string;
  Item: string;
  Value: number;
}

export const XlsxGenerator = ({questionItems}:{questionItems: any[]}) => {
    const generateExcel = () => {
        let array: QuestionRow[] = []
        for (let questionItem of questionItems) {
            const element: QuestionRow = {
                id: questionItem.id,
                prompt_en: questionItem.prompt?.en,
                prompt_fr: questionItem?.prompt?.fr,
                answer: questionItem?.answer,
            };
            array.push(element);
            if (questionItem.__class__ === 'CompositionQuestion') {
                for (let nestedQuestionItem of questionItem.compositionGroups) {
                    const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
                    array = array.concat(subArray);
                }
            }
            if (questionItem.__class__ === 'SpecializedGroup') {
                for (let nestedQuestionItem of questionItem.questions) {
                const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
                array = array.concat(subArray);
                }
            }
            if (questionItem.__class__ === 'NumericTable') {
                const subArray = processTableQuestion(questionItem);
                array = array.concat(subArray);
            }
        }
        // Create a new Excel Workbook
        const workbook = new ExcelJS.Workbook();
        const sheetName = 'Sheet1';
        const sheet = workbook.addWorksheet(sheetName);
        
        sheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'English', key: 'prompt_en', width: 32 },
        { header: 'French', key: 'prompt_fr', width: 10, outlineLevel: 1 },
        { header: 'Answer', key: 'answer', width: 32 },
        ];
        for (let i = 0; i < array.length; ++i) {
            const level = underscoreAmount(array[i].id);
            if (level === 0) {
                const row = {id: array[i].id.replaceAll('_','.'),...array[i]}
                sheet.addRow(row).commit();
            } else {
                const row = [];
                row.fill('',0,level*3-1);
                row.push(array[i].id.replaceAll('_','.'));
                row.push(array[i].prompt_en);
                row.push(array[i].prompt_fr);
                row.push(array[i].answer);
                sheet.addRow(row).commit();
            }
            sheet['_rows'][i+1]['_outlineLevel'] = level;
        }
        // Add a row by contiguous Array (assign to columns A, B & C)
        sheet.addRow([3, 'Sam', new Date()]);

        // Add a row by sparse Array (assign to columns A, E & I)
        const rowValues = [];
        rowValues[1] = 4;
        rowValues[5] = 'Kyle';
        rowValues[9] = new Date();
        sheet.addRow(rowValues);
        
        for (let i = 1; i < array.length; i++) {
            const row = sheet['_rows'][i];
            const r = i+1;
            if (row) {
                sheet.getCell("D"+r).font = {
                        name: 'Calibri',
                        color: { argb: 'FF702BF5' },
                        size: 12,
                    };
                const outlineLevel = row['_outlineLevel'];
                if (outlineLevel === 0) {
                    sheet.getCell("A"+r).font = {
                        name: 'Calibri',
                        color: { argb: 'FFFF0000' },
                        size: 12,
                    };
                    sheet.getCell("B"+r).font = {
                        name: 'Calibri',
                        color: { argb: 'FFFF0000' },
                        size: 12,
                    };
                    sheet.getCell("C"+r).font = {
                        name: 'Calibri',
                        color: { argb: 'FFFF0000' },
                        size: 12,
                    };
                } else if (outlineLevel === 1) {
                    sheet.getCell("A"+r).font = {
                        name: 'Calibri',
                        color: { argb: 'FF008E00' },
                        size: 12,
                    };
                    sheet.getCell("B"+r).font = {
                        name: 'Calibri',
                        color: { argb: 'FF008E00' },
                        size: 12,
                    };
                    sheet.getCell("C"+r).font = {
                        name: 'Calibri',
                        color: { argb: 'FF008E00' },
                        size: 12,
                    };
                } else if (outlineLevel === 2) {
                    sheet.getCell("A"+r).font = {
                        color: { argb: 'FF1B2BF5' },
                        size: 12,
                    };
                    sheet.getCell("B"+r).font = {
                        color: { argb: 'FF1B2BF5' },
                        size: 12,
                    };
                    sheet.getCell("C"+r).font = {
                        color: { argb: 'FF1B2BF5' },
                        size: 12,
                    };
                }
            }
        }
        
        // workbook.xlsx.writeFile('./data.xlsx');
        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); 
            saveAs(blob, 'data.xlsx');
        });
        // write to a new buffer
        // const buffer = workbook.xlsx.writeBuffer();
        // // Add the worksheet to the workbook
        // XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        // // Generate Excel file as binary string
        // const excelFile = XLSX.write(workbook, { type: 'binary' });

        // // Convert binary string to ArrayBuffer
        // const buffer = new ArrayBuffer(excelFile.length);
        // const view = new Uint8Array(buffer);
        // for (let i = 0; i < excelFile.length; i++) {
        //     view[i] = excelFile.charCodeAt(i) & 0xFF;
        // }

        // // Save file
        // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // saveAs(blob, 'data.xlsx');
    };

    return (
        <div>
        <button onClick={generateExcel}>Generate Excel</button>
        </div>
    );
}
