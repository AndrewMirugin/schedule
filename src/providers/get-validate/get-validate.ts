import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GetValidateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetValidateProvider {

  settingUrl:string = 'https://timetable-mmf-bsu-999.herokuapp.com/settings/';
  constructor(public http: HttpClient) {
  }
  getCourseNumber(){
    return this.http.get(this.settingUrl+'courseNumber');
  }
}
