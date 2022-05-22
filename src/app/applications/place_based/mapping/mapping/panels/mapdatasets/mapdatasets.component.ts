import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { iExcelWorkBook } from "src/app/_models/excel.interface";
import { NotificationService } from "src/app/_services/notification.service";
import * as XLSX from "xlsx";

@Component({
    selector: "app-mapdatasets",
    templateUrl: "./mapdatasets.component.html",
})
export class MapdatasetsComponent implements OnInit {
    arrayBuffer: any;
    file: File;
    workbook: iExcelWorkBook;
    sheet: any;
    @ViewChild("file_input_file", { static: false }) fileInput: HTMLInputElement;
    selectedSheet: string;
    @Output() updateMap = new EventEmitter();
    filtertext: string;
    filterrange: { start?: Date; end?: Date } = {};

    constructor(private notificationService: NotificationService) {}

    ngOnInit() {}

    clearFile() {
        this.file = null;
        this.workbook = null;
        this.updateMap.emit([]);
    }

    incomingfile(event) {
        if (event.target.files[0]) {
            this.file = event.target.files[0];
            this.Upload();
        }
    }

    Upload() {
        this.workbook = { name: this.file.name, worksheets: [] };
        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.arrayBuffer = fileReader.result;
            const data = new Uint8Array(this.arrayBuffer);
            const arr = [];
            for (let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            const bstr = arr.join("");
            const workbook = XLSX.read(bstr, { type: "binary" });
            workbook.SheetNames.forEach((sheet) => {
                const selectedSheet = workbook.Sheets[sheet];
                this.workbook.worksheets.push({
                    name: sheet,
                    data: XLSX.utils.sheet_to_json(selectedSheet, { raw: false }),
                });
            });
            if (this.workbook.worksheets.length === 1) {
                this.selectedSheet = "0";
                const mapData = this.workbook.worksheets[this.selectedSheet].data;
                if (mapData) this.updateMap.emit(mapData);
            }
        };
        fileReader.readAsArrayBuffer(this.file);
    }

    storeFile() {
        // TODO: display modal with form for meta data/options & consent to store file
        // TODO: store contents of the file in database
        this.notificationService.info("Feature coming soon");
    }

    showDataset() {
        // TODO: implement method or update HTML
    }
}
