import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { InputComponent } from "../input/input.component";
import { ButtonComponent } from "../button/button.component";
import { SelectComponent } from "../select/select.component";
import { DateComponent } from "../date/date.component";
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import {
  FieldConfig,
  Validator
} from "../../../../_models/field.interface";
import { SignatureComponent } from "../signature/signature.component";
import { DividerComponent } from "../../page-content/divider/divider.component";
import { FormParagraphComponent } from "../formparagraph/formparagraph.component";
import { FormHeaderComponent } from "../formheader/formheader.component";
import { FormLinkComponent } from "../formlink/formlink.component";
import { FormBulletListComponent } from "../formbulletlist/formbulletlist.component";
import { FormNumberListComponent } from "../formnumberlist/formnumberlist.component";

const componentMapper = {
  input: InputComponent,
  button: ButtonComponent,
  select: SelectComponent,
  date: DateComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent,
  signature: SignatureComponent,
  header: FormHeaderComponent,
  paragraph: FormParagraphComponent,
  divider: DividerComponent,
  link: FormLinkComponent,
  orderedlist: FormNumberListComponent,
  unorderedlist: FormBulletListComponent
};
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[dynamicField]"
})
export class DynamicFieldDirective implements OnInit {
  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }
}
