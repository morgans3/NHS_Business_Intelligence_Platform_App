import { AuthState } from "../_states/auth.state";
import { BehaviorSubject, throwError } from "rxjs";
import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { APIService } from "diu-component-library";
import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Store } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { ModalService } from "./modal.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
    lastRequest: any = null;

    constructor(
        public store: Store,
        private apiService: APIService,
        private notificationService: NotificationService,
        private modalService: ModalService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        if (request !== this.lastRequest) {
            this.lastRequest = request;
            return next.handle(this.addTokenToRequest(request, this.store.selectSnapshot(AuthState.getToken) || "")).pipe(
                catchError((err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        // Handle 403 error
                        if (err.status === 403) {
                            // TODO: Ask if the user wants to request capabilities required
                            this.notificationService.error("Insufficent privileges");
                            return throwError(err.statusText);
                        }

                        // Handle 401 error
                        if (err.status === 401) {
                            return this.tokenSubject.pipe(
                                filter((token) => token != null),
                                take(1),
                                switchMap((token) => {
                                    return next.handle(this.addTokenToRequest(request, token));
                                })
                            );
                        }

                        // Handle 500 error
                        if([500, 504].includes(err.status)) {
                            this.notificationService
                                .notify({
                                    status: "error",
                                    message: "A system error has occurred. If this issue persists click to report it...",
                                    actions: [
                                        { id: "close", name: "Close" },
                                        { id: "report", name: "Report issue" }
                                    ]
                                })
                                .then((snackbar) => {
                                    snackbar.instance.dismissed.subscribe((action) => {
                                        if(action === "report") {
                                            this.modalService.requestHelp({
                                                message: "I'm experiencing a system error on the page at " + location.href,
                                                attributes: {
                                                    error_status: err.status,
                                                    error_message: err.message,
                                                    error_url: err.url
                                                }
                                            });
                                        }
                                    })
                                });
                        }

                        // Handle application error
                        const applicationError = err.headers.get("Application-Error");
                        if (applicationError) {
                            if (applicationError === "Invalid refresh token") {
                                this.apiService.logout("www." + environment.websiteURL);
                            } else {
                                this.notificationService.error(applicationError);
                                return throwError(applicationError);
                            }
                        }

                        const serverError = err.error;
                        let modelStateErrors = "";
                        if (serverError && typeof serverError === "object") {
                            for (const key in serverError) {
                                if (serverError[key]) {
                                    const value = serverError[key] as string;
                                    modelStateErrors += value + "\n";
                                }
                            }
                        }
                        // this.notificationService.error(modelStateErrors || serverError || "Server Error");
                        // this.notificationService.error("Connection to Server Error");
                        return throwError(modelStateErrors || serverError || "Server Error");
                    } else {
                        return throwError(err);
                    }
                })
            );
        }
    }

    private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        if (request.url.includes("rss2json.com") || request.url.includes("postcodes.io")) {
            return request;
        }
        return request.clone({
            headers: new HttpHeaders({
                Authorization: "JWT " + `${token}`,
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                "Access-Control-Allow-Origin": "*",
            }),
        });
    }
}
