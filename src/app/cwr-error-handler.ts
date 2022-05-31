import { ErrorHandler } from "@angular/core";

declare function cwr(operation: string, payload: any): void;

export class CwrErrorHandler extends ErrorHandler {
    handleError(error: any) {
        super.handleError(error);
        cwr("recordError", error);
    }
}
