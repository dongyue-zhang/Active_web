import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
  standalone: true
})
export class DistancePipe implements PipeTransform {

  transform(distanceInMeter: number, unit: string = 'km'): string {
    return (distanceInMeter / 1000).toFixed(1);
  }

}
