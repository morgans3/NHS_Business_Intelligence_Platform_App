import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  Injectable
} from "@angular/core";
import { CardTitleComponent } from "../cardtitle/cardtitle.component";
import { CardComponent } from "../card/card.component";
import { FormComponent } from "../form/form.component";
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { SpanComponent } from "../span/span.component";
import { DividerComponent } from "../divider/divider.component";
import { IconComponent } from "../icon/icon.component";
import { ImageComponent } from "../image/image.component";
import { ChipListComponent } from "../chip/chiplist.component";
import { OrderedlistComponent } from "../orderedlist/orderedlist.component";
import { UnorderedlistComponent } from "../unorderedlist/unorderedlist.component";
import { MatlistComponent } from "../mat-list/matlist.component";
import { MatselectionlistComponent } from "../mat-list/matselectionlist.component";
import { VerticaltabsComponent } from "../verticaltabs/verticaltabs.component";
import { DTOComponents } from "../../../../_models/PageEntities";
import { LinkComponent } from "../link/link.component";
import { StepperComponent } from "../stepper/stepper.component";
import { StepComponent } from "../stepper/step.component";

const componentMapper = {
  card: CardComponent,
  cardtitle: CardTitleComponent,
  form: FormComponent,
  header: HeaderComponent,
  paragraph: ParagraphComponent,
  span: SpanComponent,
  button: CardTitleComponent,
  divider: DividerComponent,
  link: LinkComponent,
  orderedlist: OrderedlistComponent,
  unorderedlist: UnorderedlistComponent,
  matlist: MatlistComponent,
  checklist: MatselectionlistComponent,
  icon: IconComponent,
  verticaltabs: VerticaltabsComponent,
  horizontaltabs: CardTitleComponent,
  indicator: CardTitleComponent,
  chart: CardTitleComponent,
  globalmap: CardTitleComponent,
  datamap: CardTitleComponent,
  table: CardTitleComponent,
  panels: CardTitleComponent,
  modals: CardTitleComponent,
  slider: CardTitleComponent,
  stepper: StepperComponent,
  step: StepComponent,
  tree: CardTitleComponent,
  chiplist: ChipListComponent,
  image: ImageComponent
};
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[dynamicComponent]"
})
export class DynamicComponentDirective implements OnInit {
  @Input() component: DTOComponents;

  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.component.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.component = this.component;
  }
}
