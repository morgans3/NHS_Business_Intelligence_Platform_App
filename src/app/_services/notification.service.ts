import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class NotificationService {

  private toastr: any;

  constructor(
    private dialog: MatDialog,
    toastrService: ToastrService
  ) {
    //Set defaults
    this.toastr = <any>toastrService;
    this.toastr.options = {
      positionClass: "toast-bottom-right",
    }
  }

  question(message, buttons = null): Promise<any> {
    return new Promise((resolve) => {
      import("../shared/question-modal/question.modal").then((c) => {
        //Open modal with data
        let questionModal = this.dialog.open(c.QuestionModalComponent, {
          data: { message: message, buttons: buttons }
        })

        //Listen for close
        questionModal.afterClosed().subscribe((value) => {
          resolve(value || false);
        })
      });
    });
  }

  success(message?: string) {
    this.displayToast(message || "Success!", "success");
  }

  error(message?: string) {
    this.displayToast(message || "Error!", "error");
  }

  info(message?: string) {
    this.displayToast(message || "Info", "info");
  }

  warning(message: string) {
    this.displayToast(message, "warning");
  }

  private displayToast(message: string, type: string) {
    switch (type) {
      case "default":
        this.toastr.default(message);
        break;
      case "info":
        this.toastr.info(message);
        break;
      case "success":
        this.toastr.success(message);
        break;
      case "wait":
        this.toastr.wait(message);
        break;
      case "error":
        this.toastr.error(message);
        break;
      case "warning":
        this.toastr.warning(message);
        break;
    }
  }
}
