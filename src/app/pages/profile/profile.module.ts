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
import { ProfilePictureUploadComponent } from "./details/picture-upload/picture-upload.component";
import { ProfileTeamsComponent } from "./teams/teams.component";
import { DiuComponentLibraryModule } from "diu-component-library";
import { PasswordComponentsModule } from "../forms/password-reset/password-components.module";
import { RoleCapabilityListModule } from "./details/rolecapabilitylist/rolecapabilitylist.component";

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
        RoleCapabilityListModule,
        DiuComponentLibraryModule,
    ],
    declarations: [ProfileComponent, ProfileDetailsComponent, ProfilePictureUploadComponent, ProfileTeamsComponent],
})
export class ProfileModule {}
