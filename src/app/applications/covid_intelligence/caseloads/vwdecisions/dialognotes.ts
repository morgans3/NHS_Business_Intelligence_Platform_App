import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";

@Component({
  selector: "dialog-notes",
  templateUrl: "dialognotes.html",
})
export class NotesDialogComponent implements OnInit {
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective;
  myForm = new FormGroup({
    notes: new FormControl(null, Validators.required),
  });
  @ViewChild("autosize") autosize: CdkTextareaAutosize;

  constructor(public dialogRef: MatDialogRef<NotesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data && this.data.notes) {
      this.myForm.patchValue({ notes: this.data.notes });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.myForm.controls["notes"].value);
  }

  onClearNotes() {
    this.dialogRef.close(null);
  }
}
