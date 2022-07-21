import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as XLSX from "xlsx";
import { generateID } from "src/app/_pipes/functions";
import { APIService } from "diu-component-library";
import { HttpClient, HttpBackend } from "@angular/common/http";
import { NotificationService } from "src/app/_services/notification.service";

@Injectable()
export class DatasetService {
    public datasets = new BehaviorSubject([
        {
            id: "gp-practices",
            title: "GP Practices",
            data: (map, layer) => { return this.getGpPracticeDataset(map) },
            filterables: []
        },
        {
            id: "data.police.uk",
            title: "Police UK Crime",
            data: (map, layer) => { return this.getCrimeDataset(map, layer);  },
            filterables: []
        },
        {
            id: "org-boundaries",
            title: "NHS Organisation Boundaries",
            data: (map, layer) => { return this.getOrganisationBoundaries(map);  },
            filterables: []
        }
    ]);

    constructor(
        private http: HttpClient,
        private handler: HttpBackend,
        private apiService: APIService,
        private notificationService: NotificationService
    ) { }

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
                                    }),
                                    filterables: Object.keys(sheetData[0]).reduce((acc, filterable) => {
                                        acc.push({ type: "string", name: filterable });
                                        return acc;
                                    }, []),
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

    async getGpPracticeDataset(map) {
        return await this.apiService.getGPPractices().toPromise();
    }

    async getCrimeDataset(map, layer) {
        if(map.getZoom() >= 13) {
            // Check map bounds
            if(layer.getBounds().isValid() === true && map.getBounds().contains(layer.getBounds().pad(0.2))) {
                return false;
            }

            // Create polygon
            const poly =
                map.getBounds().getSouthWest().lat + "," + map.getBounds().getSouthWest().lng + ":" +
                map.getBounds().getSouthEast().lat + "," + map.getBounds().getSouthEast().lng + ":" +
                map.getBounds().getNorthEast().lat + "," + map.getBounds().getNorthEast().lng + ":" +
                map.getBounds().getNorthWest().lat + "," + map.getBounds().getNorthWest().lng;

            // Get crimes
            const crimes = await new HttpClient(this.handler).get(
                `https://data.police.uk/api/crimes-street/all-crime?poly=${poly}`
            ).toPromise() as Array<any>;

            // Reformat and return
            return crimes.map((item: any) => {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [
                            item.location.longitude || 0,
                            item.location.latitude || 0
                        ]
                    },
                    properties: item
                }
            });
        } else {
            // Ask user to increase zoom level
            this.notificationService.info("Please zoom in futher to view crime data");
            return [];
        }
    }

    async getOrganisationBoundaries(map) {
        return await this.apiService.getOrgBoundaries().toPromise();
    }
}
