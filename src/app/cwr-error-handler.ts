import { ErrorHandler } from "@angular/core";

declare function cwr(operation: string, payload: any): void;

export class CwrErrorHandler implements ErrorHandler {
  handleError(error: any) {
    cwr("recordError", error);
    console.dir(error);
  }
}
