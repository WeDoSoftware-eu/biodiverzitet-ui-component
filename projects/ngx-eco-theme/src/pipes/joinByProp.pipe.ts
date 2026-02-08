import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinByProp',
  standalone: true,
})
export class JoinByPropPipe implements PipeTransform {
  transform<T>(list: T[], propName: keyof T): string {
    if (!Array.isArray(list) || list.length === 0 || !propName) {
      return '';
    }

    return list
      .map(item => item[propName])
      .filter(value => value != null)
      .join(', ');
  }
}
