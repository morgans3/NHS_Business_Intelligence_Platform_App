import { Component, OnInit, Input, OnChanges, ViewChild } from "@angular/core";
import { Notifications } from "../../../_models/notifications";
import {
  FormGroupDirective,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { UserGroupService } from "../../../_services/usergroup.service";
import { UserDetails } from "../../../_models/ModelUser";
import { NotificationService } from "../../../_services/notification.service";

export interface UserPhotoCollection {
  username: string;
  photobase64: string;
}

@Component({
  selector: "app-ReportNotes",
  templateUrl: "./ReportNotes.component.html",
  styleUrls: ["./ReportNotes.component.scss"],
})
export class ReportNotesComponent implements OnInit, OnChanges {
  @Input() reportID: string;
  selectedreportID: string;
  @Input() username?: string;
  selectedUsername: string;
  @Input() teamcode?: string;
  selectedTeamcode: string;
  userPhotos: UserPhotoCollection[] = [];
  messages: Notifications[] = [];
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective;
  myForm = new FormGroup({
    header: new FormControl(null, Validators.required),
    message: new FormControl(null, Validators.required),
  });

  constructor(
    private userGroupService: UserGroupService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (this.reportID) {
      this.selectedreportID = this.reportID;
      this.getMessages();
    }
  }

  ngOnChanges() {
    if (this.teamcode !== this.selectedTeamcode) {
      this.selectedTeamcode = this.teamcode;
      this.selectedUsername = this.username;
      this.getMessages();
    } else if (this.username && this.username !== this.selectedUsername) {
      this.selectedUsername = this.username;
      this.getMessages();
    }
  }

  getMessages() {
    // get messages
  }

  getUserPhoto(username: string) {
    if (username) {
      const checkcurrentcollection = this.userPhotos.filter(
        (x) => x.username === username
      );
      if (checkcurrentcollection && checkcurrentcollection.length > 0) {
        if (checkcurrentcollection[0].photobase64) {
          return checkcurrentcollection[0].photobase64;
        } else {
          return "";
        }
      } else {
        this.userGroupService
          .getUserProfileByUsername(username)
          .subscribe((user: UserDetails) => {
            this.userPhotos.push({
              username: user.username,
              photobase64: user.photobase64 || "",
            });
            return user.photobase64 || "";
          });
      }
    } else {
      return "";
    }
  }

  sendMessage(form: any) {
    const newMessage: Notifications = {
      _id: null,
      method: "",
      sentdate: new Date(),
      type: "",
      sender: this.username,
      header: form.header,
      message: form.message,
      importance: "Normal",
      archive: false,
    };
    this.messages.push(newMessage);
    this.notificationService.success("Note added");
    this.clearForm();
    // const newNotification: Notifications = {
    //   _id: null,
    //   message: form.message,
    //   teamcode: this.teamcode,
    //   method: "Team",
    //   type: "notification",
    //   sentdate: new Date(),
    //   sender: this.username,
    //   header: form.header,
    //   importance: "Normal",
    //   archive: false
    // };
    // this.messageService.add(newNotification).subscribe((res: any) => {
    //   if (res.success) {
    //     newNotification._id = res._id;
    //     this.messages.unshift(newNotification);
    //     this.formDirective.resetForm();
    //   } else {
    //      this.notificationService.warning("Unable to add message");
    //   }
    // });
  }

  clearForm() {
    this.myForm.reset();
  }

  clearNotes() {
    this.messages = [];
    this.notificationService.info("All notes cleared");
    this.clearForm();
  }

  removeMessage(message: Notifications) {
    const index = this.messages.findIndex((x) => x === message);
    if (index) {
      this.messages.splice(index, 1);
      this.notificationService.info("Note removed");
    } else {
      this.notificationService.warning(
        "Note no longer exists, unable to remove. Please refresh page for latest notes"
      );
    }
  }
}
