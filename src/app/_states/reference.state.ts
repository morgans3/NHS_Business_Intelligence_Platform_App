import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ApiGService, iOrganisation, iTeam, APIService } from "diu-component-library";
import { map } from "rxjs/operators";

export class ReferenceStateModel {
  organisations: iOrganisation[] = [];
  teams: iTeam[] = [];
}

export class UpdateTeams {
  static readonly type = "[Team] UpdateTeams";
  constructor() {}
}

export class UpdateOrganisations {
  static readonly type = "[Organisation] UpdateOrganisations";
  constructor() {}
}

@State<ReferenceStateModel>({
  name: "statereference",
})
@Injectable()
export class ReferenceState {
  @Selector()
  static getOrganisations(state: ReferenceStateModel) {
    return state.organisations;
  }

  @Selector()
  static getTeams(state: ReferenceStateModel) {
    return state.teams;
  }

  @Selector()
  static getTeamByTeamCode(state: ReferenceStateModel, teamcode: string) {
    return state.teams.filter((x) => x.code === teamcode);
  }

  constructor(private referenceService: ApiGService, private apiService: APIService) {}

  @Action(UpdateTeams)
  updateTeams({ patchState, getState }: StateContext<ReferenceStateModel>, {}: UpdateTeams) {
    return this.apiService.getTeams().pipe(
      map((response: any) => {
        const tasks = response;
        if (tasks) {
          const sorted = tasks.sort((a: iTeam, b: iTeam) => {
            const nameA = a.name.toString().toLowerCase(),
              nameB = b.name.toString().toLowerCase();
            if (nameA > nameB) {
              return 1;
            }
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          });
          const organisations = getState().organisations;
          patchState({ organisations: organisations, teams: sorted });
        }
      })
    );
  }

  @Action(UpdateOrganisations)
  updateOrganisations({ patchState, getState }: StateContext<ReferenceStateModel>, {}: UpdateOrganisations) {
    return this.referenceService.getOrganisations().pipe(
      map((response: any) => {
        const tasks = response;
        if (tasks) {
          const sorted = tasks.sort((a: iOrganisation, b: iOrganisation) => {
            const nameA = a.name.toString().toLowerCase(),
              nameB = b.name.toString().toLowerCase();
            if (nameA > nameB) {
              return 1;
            }
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          });
          const teams = getState().teams;
          patchState({ organisations: sorted, teams: teams });
        }
      })
    );
  }
}
