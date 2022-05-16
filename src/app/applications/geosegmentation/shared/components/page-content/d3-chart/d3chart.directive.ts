import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  Injectable
} from "@angular/core";
import { Chart } from "../../_models/chart";
import { PieChartComponent } from "./piechart.component";
import { BarChartComponent } from "./barchart.component";

const componentMapper = {
  bar: BarChartComponent,
  pie: PieChartComponent
};
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[dynamicD3Component]"
})
export class DynamicD3ChartDirective implements OnInit {
  @Input() chart: any;
  @Input() myDC: any;

  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.chart.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.chart = this.chart;
    this.componentRef.instance.myDC = this.myDC;
  }
}
