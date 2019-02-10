import {Component, Injectable} from '@angular/core';
import {GetDataProvider} from "../../providers/get-data/get-data";
import {Storage} from "@ionic/storage";
import {ActionSheetController, LoadingController, ToastController, ModalController} from "ionic-angular";
import {GroupPage} from "../group/group";

class Group {
  group: number;
  days: Day[];
}
class Day {
  day: string;
  subjects: Subject[];
}
class Subject {
  timeStart: string;
  subject: string;
  teacher: string;
  lectureHall: string;
  subgroup: string;
  week:string;
  type:string;
}

class TDays{
  day:string;
  spis:TDay[];
}
class TDay{
  additional:Adds[];
  lectureHall:string;
  type:string;
  week:string;
  subject:string;
  timeStart:string;
}
class Adds{
  group:number;
  subgroup:string;
  course:number;
}



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

@Injectable()
export class HomePage {
  userIs:string;
  settingsInfo: { groupNumber: number, kursNumber: number, teacherFam: string, groupType: string, };
  daysArray: Group[];
  teacherTimetable:TDays[];

  constructor(public storage: Storage,public gd:GetDataProvider,public toastCtrl: ToastController, public actionSheetCtrl:ActionSheetController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {

  }

  ionViewWillEnter() {
    this.getAll();
  }

  update(refresher) {
    if (this.userIs == "student") {
      this.gd.getData(this.settingsInfo.groupNumber, this.settingsInfo.kursNumber).subscribe(data => {
        this.storage.set('days', data['days']);
        setTimeout(() => {
          this.getAll();
          refresher.complete();
        }, 2000);
      }, error2 => {
        if (error2.status == 0) {
          refresher.complete();
          this.faildConnection();
        }
        else {
          refresher.complete();
          this.errorStatus(error2);
        }
      });
    }
    else {
      console.log(this.userIs);
      if (this.userIs != undefined || this.userIs != null || this.userIs != '') {
        this.gd.getTeacherTimetable(this.settingsInfo.teacherFam).subscribe(data => {
            this.storage.remove('timeTable');
            let tt: any;
            tt = data['teachersTimeTable'];
            console.log(tt);
            for (let i = 0; i < tt.length; i++) {
              tt[i].spis.sort(this.compareStr);
            }
            for (let i = 0; i < tt.length; i++) {
              tt[i].spis.sort(this.compareStrByLength);
            }
            if (this.storage.get('timetable') != undefined && this.storage.get('timetable')) {
              this.storage.remove('timetable');
            }
            this.storage.set('timetable', tt);
            console.log(tt);
            setTimeout(()=>{this.storage.get('timetable').then((data)=>{console.log(data);}); this.getAll();refresher.complete();}, 2000);
        }, error2 => {
          if (error2.status == 0) {
            refresher.complete();
            this.faildConnection();
          }
          else {
            refresher.complete();
            this.errorStatus(error2);
          }
        });
      }
    }



  }

  presentModal(value:any){
    let modal = this.modalCtrl.create(GroupPage, {'data':value});
    modal.present();
  }

  changeSubGroup(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Выберите подгруппу',
      buttons: [
        {
          text: 'A',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Обновление...'
            });
            loading.present();
            this.storage.remove('data');
            this.storage.set('data',{groupNumber: this.settingsInfo.groupNumber, kursNumber: this.settingsInfo.kursNumber, teacherFam:this.settingsInfo.teacherFam, groupType: "А",  });
            setTimeout(()=>{
              this.getAll();
              loading.dismiss();

            }, 2000);
          }
        },
        {
          text: 'Б',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Обновление...'
            });
            loading.present();
            this.storage.remove('data');
            this.storage.set('data',{groupNumber: this.settingsInfo.groupNumber, kursNumber: this.settingsInfo.kursNumber, teacherFam:this.settingsInfo.teacherFam, groupType: "Б",  })
            setTimeout(()=>{
              this.getAll();
              loading.dismiss();

            }, 2000);
          }

        },{
          text: 'Вся группа',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Обновление...'
            });
            loading.present();
            this.storage.remove('data');
            this.storage.set('data',{groupNumber: this.settingsInfo.groupNumber, kursNumber: this.settingsInfo.kursNumber, teacherFam:this.settingsInfo.teacherFam, groupType: "Вся группа",  })
            setTimeout(()=>{
              this.getAll();
              loading.dismiss();

            }, 2000);
          }

        },{
          text: 'Отмена',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
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

  getAll(){
    this.storage.get('data').then(
      (data) => {
        this.settingsInfo = data;
        if (data != null && data != undefined) {
          this.storage.get('days').then(
            (days) => {
              this.daysArray = days;
            }
          )
        }
      }
    );
    this.storage.get('whoIsUser').then(
      (data) => {
        if (data != null && data != undefined) {
          this.storage.get('whoIsUser').then(
            (text) => {
              this.userIs = text;
            }
          )
        }
      }
    );


    this.storage.get('timetable').then((data)=>{
      if(data!=undefined  &&  data!=null){
        this.teacherTimetable=data;
        // this.teacherTimetable.sort();
      }
    })
  }
  ionViewDidLoad() {
    this.storage.get('data').then(
      (data) => {
        this.settingsInfo = data;
        if (data != null && data != undefined) {
          this.storage.get('days').then(
            (days) => {
              this.daysArray = days;
            }
          )
        }
      }
    );
    this.storage.get('whoIsUser').then(
      (data) => {
        if (data != null && data != undefined) {
          this.storage.get('whoIsUser').then(
            (text) => {
              this.userIs = text;
            }
          )
        }
      }
    );


    this.storage.get('timetable').then((data)=>{
      if(data!=undefined  &&  data!=null){
        this.teacherTimetable=data;
      }
    })
  }


}

