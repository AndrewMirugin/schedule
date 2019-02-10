import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CourseChoosingPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'courseChoosing',
})
export class CourseChoosingPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(data:any[],teacherFam: string) {
    if(teacherFam&&teacherFam.trim()!=''){
      return data.filter((teacher)=>{
        return (teacher.toLowerCase().indexOf(teacherFam.toLowerCase())>-1);
      })
    }
    return data;
  }
}
