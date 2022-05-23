export interface iExcelWorkBook {
    name: string;
    worksheets: {
        name: string;
        data: any[];
    }[]
}
