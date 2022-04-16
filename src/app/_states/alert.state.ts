import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { DynamicApiService, iSystemAlerts } from "diu-component-library";
import { map } from "rxjs/operators";

export class AlertStateModel {
  myAlerts: iSystemAlerts[] = [];
}

export class UpdateAlerts {
  static readonly type = "[Alert] UpdateAlerts";
  constructor() {}
}

@State<AlertStateModel>({
  name: "statealerts",
})
@Injectable()
export class AlertState {
  @Selector()
  static getAlerts(state: AlertStateModel) {
    return state;
  }

  constructor(private taskService: DynamicApiService) {}

  @Action(UpdateAlerts)
  updateAlerts({ patchState }: StateContext<AlertStateModel>, {}: UpdateAlerts) {
    return this.taskService.getActiveSystemAlerts().pipe(
      map((response: any) => {
        const tasks = response;
        if (tasks) {
          const sortedtasks = tasks.sort((a: iSystemAlerts, b: iSystemAlerts) => {
            const nameA = a.startdate.toString().toLowerCase(),
              nameB = b.startdate.toString().toLowerCase();
            if (nameA > nameB) {
              return -1;
            }
            if (nameA < nameB) {
              return 1;
            }
            return 0;
          });
          patchState({ myAlerts: sortedtasks });
        }
      })
    );
  }
}
