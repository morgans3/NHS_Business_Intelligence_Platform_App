import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { APIService } from "diu-component-library";
import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthState } from "../_states/auth.state";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { NotificationService } from "./notification.service";
import { environment } from "../../environments/environment";
import { ModalService } from "./modal.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
    lastRequest: any = null;

    constructor(
        public store: Store,
        private apiService: APIService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private router: Router
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        if (request !== this.lastRequest) {
            this.lastRequest = request;
            return next.handle(this.addTokenToRequest(request, this.store.selectSnapshot(AuthState.getToken) || "")).pipe(
                catchError((err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        // Handle 403 error
                        if (err.status === 403) {
                            this.notificationService
                                .notify({
                                    status: "warning",
                                    message: "You do not have the required permissions to access this page.",
                                    actions: [
                                        { id: "close", name: "Close" },
                                        { id: "request", name: "Request Permission" },
                                    ],
                                })
                                .then((snackbar) => {
                                    snackbar.instance.dismissed.subscribe((action) => {
                                        // Check action
                                        if (action === "request") {
                                            window.open(
                                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                                `${window.location.origin}/profile/access?capabilities=${err.error.data.join(",")}`
                                            );
                                        }
                                    });
                                });
                        }

                        // Handle 401 error
                        if (err.status === 401) {
                            this.notificationService
                                .notify({
                                    status: "error",
                                    message: "You are no longer logged in. Please login again.",
                                    actions: [{ id: "close", name: "Login" }],
                                })
                                .then((snackbar) => {
                                    snackbar.instance.dismissed.subscribe(() => {
                                        this.router.navigate(["/login"]);
                                    });
                                });
                        }

                        // Handle 500 error
                        if ([500, 504].includes(err.status)) {
                            this.notificationService
                                .notify({
                                    status: "error",
                                    message: "A system error has occurred. If this issue persists click to report it...",
                                    actions: [
                                        { id: "close", name: "Close" },
                                        { id: "report", name: "Report issue" },
                                    ],
                                })
                                .then((snackbar) => {
                                    snackbar.instance.dismissed.subscribe((action) => {
                                        if (action === "report") {
                                            this.modalService.requestHelp({
                                                message: "I'm experiencing a system error on the page at " + location.href,
                                                attributes: {
                                                    error_status: err.status,
                                                    error_message: err.message,
                                                    error_url: err.url,
                                                },
                                            });
                                        }
                                    });
                                });
                        }

                        // Handle 404 error
                        if (err.status === 404) {
                            if (err.error.msg === "No requests found") return;
                            this.notificationService
                                .notify({
                                    status: "error",
                                    message: err.error.msg || "Item not found",
                                    actions: [
                                        { id: "close", name: "Close" },
                                        { id: "report", name: "Report issue" },
                                    ],
                                })
                                .then((snackbar) => {
                                    snackbar.instance.dismissed.subscribe((action) => {
                                        if (action === "report") {
                                            this.modalService.requestHelp({
                                                message: "I'm experiencing a 404 error on the page at " + location.href,
                                                attributes: {
                                                    error_status: err.status,
                                                    error_message: err.message,
                                                    error_url: err.url,
                                                },
                                            });
                                        }
                                    });
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
