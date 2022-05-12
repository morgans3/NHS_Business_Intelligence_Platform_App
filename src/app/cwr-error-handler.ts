import { ErrorHandler } from "@angular/core";

declare function cwr(operation: string, payload: any): void;

export class CwrErrorHandler extends ErrorHandler {
  handleError(error: any) {
    cwr("recordError", error);
    super.handleError(error);
  }
}
