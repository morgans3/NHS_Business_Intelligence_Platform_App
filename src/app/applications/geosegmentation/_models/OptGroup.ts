export interface OptItem {
    value: string;
    viewValue: string;
    list?: boolean;
}

export interface OptGroup {
    name: string;
    option: OptItem[];
}
