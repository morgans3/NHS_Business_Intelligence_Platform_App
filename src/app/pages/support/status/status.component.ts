import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MFAAuthService } from "diu-component-library";
import { environment } from "src/environments/environment";
import { NotificationService } from "../../../_services/notification.service";
import { MonitoredServices } from "./services";

@Component({
  selector: "app-support-status",
  templateUrl: "./status.component.html",
})
export class StatusComponent implements OnInit {
  MonitoredServices = MonitoredServices;
  monitoring: boolean = false;
  lastCloseResult: string = "";

  constructor(private notificationService: NotificationService, private authService: MFAAuthService, private http: HttpClient) {}

  ngOnInit() {
    this.MonitoredServices.sort((a, b) => {
      var textA = a.description.toUpperCase();
      var textB = b.description.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    this.refreshAll();
  }

  refreshAll() {
    this.MonitoredServices.forEach((service) => {
      this.fireevent(service);
    });
  }

  fireevent(service: any) {
    let selectedservice = null;
    switch (service.statename) {
      case "auth":
        selectedservice = this.authService;
        break;
      default:
        this.otherService(service.statename, service);
        return;
    }
    if (selectedservice) {
      selectedservice.checkendpoint().subscribe(
        (res: any) => {
          if (res.length > 0 && res === "Invalid endpoint") {
            service.status.msg = "Online";
            service.status.state = "green";
          }
        },
        (err: any) => {
          this.notificationService.warning("Unable to contact " + service.description + " at this time.");
          service.status.msg = "Offline";
          service.status.state = "darkred";
        }
      );
    }
  }

  otherService(subd: string, service: any) {
    this.http.get(this.combineURL(subd), { responseType: "text" }).subscribe(
      (res: any) => {
        if (res.length > 0 && res === "Invalid endpoint") {
          service.status.msg = "Online";
          service.status.state = "green";
        }
      },
      (err) => {
        this.notificationService.warning("Unable to contact " + service.description + " Service at this time.");
        service.status.msg = "Offline";
        service.status.state = "darkred";
      }
    );
  }

  private combineURL(subdomain: string) {
    const origin = window.location.href;
    const domain = origin.split("//")[1].split("/")[0].replace("www", "");
    if (domain.includes("localhost")) {
      return "https://" + subdomain + ".dev." + environment.websiteURL + "/";
    } else if (domain.includes("dev") || domain.includes("demo")) {
      return "https://" + subdomain + "." + domain + "/";
    }
    return "https://" + subdomain + domain + "/";
  }

  monitor() {
    this.monitoring = !this.monitoring;
    if (this.monitoring) {
      this.notificationService.info("Monitoring Enabled, server checks will happen every 30 seconds until monitoring stopped");
      this.monitorEvent();
      return;
    }
    this.notificationService.info("Monitoring Disabled");
  }

  monitorEvent() {
    if (this.monitoring) {
      this.refreshAll();
      setTimeout(() => {
        this.monitorEvent();
      }, 30 * 1000);
    }
  }
}
