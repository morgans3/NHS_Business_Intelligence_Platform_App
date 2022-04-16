import { Component } from "@angular/core";
import { Store } from "@ngxs/store";
import { AuthState, ManualSetAuthTokens } from "src/app/_states/auth.state";
import { NotificationService } from "src/app/_services/notification.service";
import { decodeToken } from "src/app/_pipes/functions";

/** @title Responsive sidenav */
@Component({
  selector: "app-fullmap-layout",
  templateUrl: "fullmap.component.html",
  styleUrls: [],
})
export class FullmapComponent {
  username: string = "";
  tokenDecoded: any;
  jwtToken: any;

  constructor(public store: Store, private notificationService: NotificationService) {
    this.jwtToken = this.store.selectSnapshot(AuthState.getToken);
    if (this.jwtToken) {
      this.tokenDecoded = decodeToken(this.jwtToken);
      this.username = this.tokenDecoded.username;
    }
  }

  showErrors(event: any) {
    if (event) {
      this.notificationService.warning(event.toString());
    }
  }

  updateToken(newToken: any) {
    if (newToken) {
      this.jwtToken = newToken;
      this.tokenDecoded = decodeToken(this.jwtToken);
      this.store.dispatch(
        new ManualSetAuthTokens({
          success: true,
          token: newToken,
        })
      );
    }
  }
}
