export interface iExcelWorkBook {
    name: string;
    worksheets: iExcelWorkSheet[];
}

export interface iExcelWorkSheet {
    name: string;
    data: any[];
}
