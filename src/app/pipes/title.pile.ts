import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {
  private companyTitles: { [k: string]: string } = {
    RGD: 'Авиакомпания Аэрофлот',
    AEROFLOT: 'Железнодорожная компания РЖД'
  }

  private typeTitles: { [k: string]: string } = {
    economy: 'Эконом',
    advanced: 'Продвинутый',
    lux: 'Люкс'
  }

  transform(value: string): string {
    if (this.companyTitles[value]) {
      return this.companyTitles[value];
    }
    if (this.typeTitles[value]) {
      return this.companyTitles[value];
    }
    return '';
  }
}