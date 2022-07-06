import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as XLSX from "xlsx";
import { generateID } from "src/app/_pipes/functions";

@Injectable()
export class DatasetService {
    public datasets = new BehaviorSubject([]);

    constructor() { }

    add(type, dataset) {
        new Promise((resolve, reject) => {
            try {
                switch(type) {
                    case "xlsx": {
                        // Setup read function
                        const fileReader = new FileReader();
                        fileReader.onload = () => {
                            // Read file
                            const arrayBuffer: any = fileReader.result;
                            const data = new Uint8Array(arrayBuffer);
                            const arr = [];
                            for (let i = 0; i !== data.length; ++i) {
                                arr[i] = String.fromCharCode(data[i]);
                            }
                            const bstr = arr.join("");

                            // Read as xlsx
                            const newDatasets = [];
                            const workbook = XLSX.read(bstr, { type: "binary" });
                            workbook.SheetNames.forEach((sheetName) => {
                                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });
                                newDatasets.push({
                                    id: generateID(),
                                    title: dataset.name + " - " + sheetName,
                                    // TODO: Check for lat lng fields, add popup to select field key
                                    data: sheetData.map((item: any) => {
                                        return {
                                            type: "Feature",
                                            geometry: {
                                                type: "Point",
                                                coordinates: [
                                                    item.lng || item.longitude || item.Longitude || 0,
                                                    item.lat || item.latitude || item.Latitude || 0
                                                ]
                                            },
                                            properties: item
                                        }
                                    })
                                });
                            });

                            // Emit update
                            this.datasets.next(this.datasets.value.concat(newDatasets));
                            resolve(newDatasets);
                        };

                        // Read file
                        fileReader.readAsArrayBuffer(dataset);
                        break;
                    }
                }
            } catch(error) {
                reject(error);
            }
        });
    }
}
