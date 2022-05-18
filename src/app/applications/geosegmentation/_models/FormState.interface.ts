export class FormState {
    Progress: Progress = new Progress();
    Discharge: PanelState = new PanelState();
    Physician: PanelState = new PanelState();
    ARFP: PanelState = new PanelState();
    Meds: PanelState = new PanelState();
    Risk: PanelState = new PanelState();
    Inpatient: PanelState = new PanelState();
    GP: PanelState = new PanelState();
    Admission: PanelState = new PanelState();
    Demographics: PanelState = new PanelState();

    public constructor(init?: Partial<FormState>) {
        Object.assign(this, init);
    }
}

export class PanelState {
    HideAll = false;
    Collapse = false;
    Complete = false;

    public constructor(init?: Partial<PanelState>) {
        Object.assign(this, init);
    }
}

export class Progress {
    Color = ProgressColor.Warn;
    Value = 0;

    public constructor(init?: Partial<Progress>) {
        Object.assign(this, init);
    }
}

export enum ProgressColor {
    Warn = "warn",
    Primary = "primary",
}
