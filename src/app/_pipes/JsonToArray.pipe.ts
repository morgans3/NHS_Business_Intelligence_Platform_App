import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "keys" })
export class KeysPipe implements PipeTransform {
    transform(value): any {
        const keys = [];
        value.forEach((key) => {
            keys.push(key);
        });
        return keys;
    }
}
