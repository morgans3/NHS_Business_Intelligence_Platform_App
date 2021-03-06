import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ProfileRoutes } from "./profile.routing";
import { ProfileComponent } from "./profile.component";
import { ImageUploaderModule } from "ngx-image-uploader-next";
import { ProfileDetailsComponent } from "./details/details.component";
import { ProfileTeamsComponent } from "./teams/teams.component";
import { DiuComponentLibraryModule } from "diu-component-library";
import { PasswordComponentsModule } from "../forms/password-reset/password-components.module";
import { ProfileAccessComponent } from "./access/access.component";
import { CapabilitiesSelectModule } from "../../shared/components/capabilities-select/capabilities-select.module";
import { RolesSelectModule } from "../../shared/components/roles-select/roles-select.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ImageUploaderModule,
        PasswordComponentsModule,
        RouterModule.forChild(ProfileRoutes),
        RolesSelectModule,
        CapabilitiesSelectModule,
        DiuComponentLibraryModule,
    ],
    declarations: [ProfileComponent, ProfileDetailsComponent, ProfileTeamsComponent, ProfileAccessComponent],
})
export class ProfileModule {}
