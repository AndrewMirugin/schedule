import {Component, Injectable} from '@angular/core';
import {NavController, LoadingController, ToastController} from 'ionic-angular';
import {GetDataProvider} from "../../providers/get-data/get-data";
import {Storage} from "@ionic/storage";

class TDays{
  day:string;
  spis:TDay[];
}
class TDay{
  additional:Adds[];
  lectureHall:string;
  subject:string;
  timeStart:string;
}
class Adds{
  group:number;
  subgroup:string;
  course:number;
}

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})

@Injectable()
export class ContactPage {
  teachers:any;
  teachersTimetable:TDays[];
  valid:boolean = true;
  result:boolean;
  userType:string='';
  teacherFam:string='';
  constructor(public navCtrl: NavController, public gd:GetDataProvider, public toastCtrl: ToastController, public storage: Storage, public loadingCtrl:LoadingController) {

  }

  goHome(value: {groupNumber: number, kursNumber: number, teacherFam:string, groupType: string,  }){
    let loading = this.loadingCtrl.create({
      content: 'Получение данных...'
    });
    loading.present();
    if (this.storage.get('data') != undefined && this.storage.get('data')) {
      this.storage.remove('data');
    }
    this.storage.set('whoIsUser',this.userType);
    this.storage.set('data', value);
    if(value!=null && value!=undefined)
    {
      this.gd.getData(value.groupNumber,value.kursNumber).subscribe(data=>{
        this.storage.set('days',data['days']);
        setTimeout(() => {
        loading.dismiss();
        this.navCtrl.parent.select(0);
      }, 2000);
      },error2 => {
        if(error2.status==0){
          loading.dismiss();
          this.errorStatus(error2);
          // this.faildConnection();
        }
        else{
          loading.dismiss();
          this.errorStatus(error2);
        }
      });
    }
  }

  incorrectData(){
    let toast = this.toastCtrl.create({
      message: 'Проверьте правильность введённых данных',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  faildConnection(){
    let toast = this.toastCtrl.create({
      message: 'Что-то пошло не так. Проверьте соединение с интернетом',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  errorStatus(er:any){
    let toast = this.toastCtrl.create({
      message: 'Что-то пошло не так. Код ошибки: ' + er.status,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  getTeachersFromLocal(){
    this.storage.get('teachers').then(
      (data) => {
        if (data != null && data != undefined) {
          this.teachers=data;
        }
      }
    );
  }

  // getTimetableFromLocal(){
  //   this.storage.get('timetable').then(
  //     (data) => {
  //       if (data != null && data != undefined) {
  //         this.teachersTimetable=data;
  //       }
  //     }
  //   );
  // }



  ionViewWillEnter(){
    let loading = this.loadingCtrl.create({
      content: 'Получение данных о преподавателях...'
    });
    loading.present();
    this.storage.get('teachers').then((data)=>{
      if(data==undefined || data==null){
        this.gd.getTeachers().subscribe(data=>{
            this.teachers = data;
            this.teachers.sort();
            this.storage.set('teachers',this.teachers);
            loading.dismiss();
          }, error2 => {
            this.errorStatus(error2);
            // this.faildConnection();
            this.navCtrl.parent.select(0);
            loading.dismiss();
          }
        );
      }
      else {
        this.getTeachersFromLocal();
        loading.dismiss();
      }
    }
    );
    // if(this.storage.get('teachers').then((data)=>data==undefined) || this.storage.get('teachers').then((data)=>data==null)){
    //
    // }



  }

  getTeachers(){
    if(this.storage.get('teachers').then((data)=>data==undefined) || this.storage.get('teachers').then((data)=>data==null)){
      this.gd.getTeachers().subscribe(data=>{
          this.teachers = data;
          this.teachers.sort();
          this.storage.set('teachers',this.teachers);
        }, error2 => {
          this.faildConnection();
        }
      );
    }
    else {
      this.getTeachersFromLocal();

    }
  }

  teacherGoHome(teacherFam:string){

    let loading = this.loadingCtrl.create({
      content: 'Получение данных...'
    });
    loading.present();
    if (this.storage.get('data') != undefined && this.storage.get('data')) {
      this.storage.remove('data');
    }
    if (this.storage.get('whoIsUser') != undefined && this.storage.get('whoIsUser')) {
      this.storage.remove('whoIsUser');
    }
    this.storage.set('whoIsUser',this.userType);
    this.storage.set('data', {teacherFam:teacherFam});
    if(teacherFam!=null && teacherFam!=undefined && teacherFam!='')
    {
      this.gd.getTeacherTimetable(teacherFam).subscribe(data => {
          this.teachersTimetable = data['teachersTimeTable'];

          console.log(this.teachersTimetable);
          for(let i=0;i<this.teachersTimetable.length;i++){
            this.teachersTimetable[i].spis.sort(this.compareStr);
          }
          for(let i=0;i<this.teachersTimetable.length;i++){
            this.teachersTimetable[i].spis.sort(this.compareStrByLength);
          }
          //this.teachersTimetable.sort(this.compareStr);

          console.log(this.teachersTimetable);
          if (this.storage.get('timetable') != undefined && this.storage.get('timetable')) {
            this.storage.remove('timetable');
          }
          this.storage.set('timetable', this.teachersTimetable);
        setTimeout(() => {
          loading.dismiss();
          this.navCtrl.parent.select(0);
        }, 2000);
        }, error2 => {
        if (error2.status == 0) {
          loading.dismiss();
          this.faildConnection();
        }
        else {
          loading.dismiss();
          this.errorStatus(error2);
        }
      });
    }

  }

  compareStr(a:any ,b:any ){
    const af=a.timeStart;
    const bf=b.timeStart;
    let comparison = 0;
    if (af > bf) {
      comparison = 1;
    } else if (af < bf) {
      comparison = -1;
    }
    return comparison;
  }

  compareStrByLength(a:any,b:any){
    const af=a.timeStart.length;
    const bf=b.timeStart.length;
    let comparison = 0;
    if (af > bf) {
      comparison = 1;
    } else if (af < bf) {
      comparison = -1;
    }
    return comparison;
  }

  setTimeTable(surname: string) {
    this.gd.getTeacherTimetable(surname).subscribe(data => {
        this.teachersTimetable = data['teachersTimeTable'];
        if (this.storage.get('timetable') != undefined && this.storage.get('timetable')) {
          this.storage.remove('timetable');
        }
        this.storage.set('timetable', this.teachersTimetable);
      }, error2 => {
        this.faildConnection();
      }
    );
  }

  isValid(value: {groupNumber: number, kursNumber: number, teacherFam:string, groupType: string, }){
    let loading = this.loadingCtrl.create({
      content: 'Проверка данных...'
    });
    loading.present();
    this.gd.getData(value.groupNumber,value.kursNumber).subscribe(data=>{
      loading.dismiss();
      this.goHome(value);

     },error=>{
      if(error.status == 404){
          this.incorrectData();
          loading.dismiss();

      }
      else{
          this.faildConnection();
          loading.dismiss();
      }
    });

  }

  updateTeachers(ev:any){
    this.getTeachersFromLocal();
    this.teacherFam = ev.target.value;

  }

}

