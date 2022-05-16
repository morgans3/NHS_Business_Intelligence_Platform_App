import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
  selector: "app-Data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.scss"]
})
export class HiDataComponent implements OnInit {
  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() { }
}
