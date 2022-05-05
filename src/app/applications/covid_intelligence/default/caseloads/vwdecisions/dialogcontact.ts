import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";

@Component({
  selector: "dialog-contact",
  templateUrl: "dialogcontact.html",
})
export class ContactDialogComponent implements OnInit {
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective;
  myForm = new FormGroup({
    contact: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data && this.data.newContact) {
      this.myForm.patchValue({ contact: this.data.newContact });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.myForm.controls["contact"].value);
  }

  onClearContact() {
    this.dialogRef.close(null);
  }
}
