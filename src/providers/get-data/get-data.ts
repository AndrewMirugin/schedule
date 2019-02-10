import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class GetDataProvider {
  myurl:string = 'https://timetable-mmf-bsu-999.herokuapp.com/groups/';
  settingUrl:string = 'https://timetable-mmf-bsu-999.herokuapp.com/settings/';
  constructor(public http: HttpClient) {
  }
  getData(group:number,course:number){
    return this.http.get(this.myurl+group+"/"+course);
  }

  getGroupNumber(course:number){
    return this.http.get(this.settingUrl+'groupsNumber/'+course);
  }

  getGroupsNumber(){
    return this.http.get(this.settingUrl+'groupsNumbers');
  }

  getCourseNumber(){
    return this.http.get(this.settingUrl+'courseNumber');
  }

  getTeachers(){
    return this.http.get(this.settingUrl+'teacherSpis');
  }

  getTeacherTimetable(surname:string){
    return this.http.get(this.settingUrl +'teachersTimetable/'+surname);
  }

}
