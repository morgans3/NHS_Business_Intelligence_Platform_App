import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { iTeamMembers, iTeam } from "diu-component-library";

export class ConfirmText {
  title: string;
  text: string;
  response = {};
  teams?: iTeamMembers[];
  teamlist?: iTeam[];
}

@Component({
  selector: "dialog-text-confirm",
  templateUrl: "dialogtextconfirm.html"
})
export class ConfirmTextDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmText
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTeamName(code: string): string {
    const team = this.data.teamlist.find(x => x.code === code);
    if (team) {
      return team.name;
    } else {
      return "Unknown Team";
    }
  }
}
