import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'urlSplit',
    standalone: true
})
export class urlSplit implements PipeTransform {

    transform(url: string): string {
        return url.split("//", 2)[1].split("/", 1)[0];
    }

}