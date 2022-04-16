import { NgModule } from "@angular/core";

import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from ".";

@NgModule({
  declarations: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective],
  exports: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective],
  providers: [],
})
export class AccordionLinkModule {}
