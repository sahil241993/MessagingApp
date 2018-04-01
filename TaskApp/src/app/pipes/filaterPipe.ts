import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(value: any, input: string) {
       console.log(input)
        if (input) {
            
            return value.filter(function (el: any) {
                return el.Name.toLowerCase().indexOf(input.toLowerCase()) > -1 || el.class.toLowerCase().indexOf(input.toLowerCase()) > -1;
            })
        }
        return value;
    }
}

