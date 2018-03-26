import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'staffFilter'
})
  export class FilterPipe1 implements PipeTransform {
      transform(value: any, input: string) {
         console.log(input)
          if (input) {
              
              return value.filter(function (el: any) {
                console.log(el)  
                return el.Name.toLowerCase().indexOf(input.toLowerCase()) > -1;
              })
          }
          return value;
      }
  }