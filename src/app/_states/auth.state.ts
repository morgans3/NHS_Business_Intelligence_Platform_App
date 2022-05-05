import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { iCredentials, iModelUser, APIService } from "diu-component-library";
import { map } from "rxjs/operators";

export class AuthStateModel {
  user: iModelUser[] = [];
}

export class Login {
  static readonly type = "[Auth] Login";
  constructor(public payload: iCredentials) {}
}

export class ManualSetAuthTokens {
  static readonly type = "[Auth] ManualSetAuthTokens";
  constructor(public payload: iModelUser) {}
}

export class DemoVersion {
  static readonly type = "[Auth] DemoVersion";
  constructor(public payload: iCredentials) {}
}

@State<iModelUser>({
  name: "stateauth",
})
@Injectable()
export class AuthState {
  @Selector()
  static getToken(state: iModelUser) {
    return state.token;
  }

  @Selector()
  static getEmail(state: iModelUser) {
    let email = "";
    const token = state.token!;
    const jwtData = token.split(".")[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    email = decodedJwtData.email;
    return email;
  }

  constructor(private apiService: APIService) {}

  @Action(ManualSetAuthTokens)
  manualSetAuthTokens({ getState, patchState }: StateContext<iModelUser>, { payload }: ManualSetAuthTokens) {
    const state = getState();
    patchState({
      token: payload.token,
    });
  }

  @Action(DemoVersion)
  demoVersion({ getState, patchState }: StateContext<iModelUser>, { payload }: DemoVersion) {
    return this.apiService.login(payload).pipe(
      map((response: iModelUser) => {
        const user = response;
        const state = getState();
        if (user) {
          patchState({ token: user.token });
        }
      })
    );
  }

  @Action(Login)
  login({ getState, patchState }: StateContext<iModelUser>, { payload }: Login) {
    return this.apiService.login(payload).pipe(
      map((response: iModelUser) => {
        const user = response;
        const state = getState();
        if (user) {
          patchState({ token: user.token });
        }
      })
    );
  }
}
