import { Injectable } from "@angular/core";
import { State, Action, StateContext, createSelector } from "@ngxs/store";
import { APIService } from "diu-component-library";
import { tap } from "rxjs/operators";

export interface DynamicConfigStateModel {
    [key: string]: any;
}

export class GetConfigByID {
    static readonly type = "[Config] Get config by ID";
    constructor(public id: string) {}
}

@State<DynamicConfigStateModel>({
    name: "dynamicConfig",
    defaults: {},
})
@Injectable()
export class DynamicConfigState {
    constructor(private apiService: APIService) {}

    static getConfigById(id: string) {
        return createSelector([DynamicConfigState], (state: DynamicConfigStateModel) => state[id].payload);
    }

    @Action(GetConfigByID)
    getConfigById(ctx: StateContext<DynamicConfigStateModel>, action: GetConfigByID) {
        const configs = ctx.getState();
        let id = action.id;
        if (id.includes("apps_")) id = id.replace("apps_", "");
        if (id.includes("/")) id = id.split("/")[0];
        console.log("Getting config for " + id);

        if (configs[id] && new Date(configs[id].expiry) > new Date()) {
            // If the novel with ID has been already loaded
            // we just break the execution
            return;
        }

        return this.apiService.getPayloadById(id).pipe(
            tap((payload) => {
                ctx.patchState({ [id]: { payload, expiry: new Date(new Date().getTime() + 30 * 60000) } });
            })
        );
    }
}
