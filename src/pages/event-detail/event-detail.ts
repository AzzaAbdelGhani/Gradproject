import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireObject }  from 'angularfire2/database';
import { AngularFireDatabase} from 'angularfire2/database';

/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  person = {} as User;
  userData : FirebaseObjectObservable<User>
  uesrFollowers= []
  uesrFollowing= []
  isenabled = false ;
  personID : string;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private afAuth: AngularFireAuth ,
     private afDatabase: AngularFireDatabase,
      public alertCtrl: AlertController) {

        this.person = this.navParams.get('person');
        this.personID = this.navParams.get('personID');
        console.log(this.person);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailPage');

    this.afAuth.authState.subscribe(data =>{
      if(data && data.email && data.uid){
       this.userData = this.afDatabase.object('user/'+ data.uid).valueChanges();
       this.afDatabase.list('/user/'+ data.uid+'/followersArray/').valueChanges().subscribe(
        _data => {
          this.uesrFollowers = _data ; 
          console.log(this.uesrFollowers) ;
        }
      );
      this.afDatabase.list('/user/'+ data.uid+'/followingArray/').valueChanges().subscribe(
        _data => {
          this.uesrFollowing = _data ; 
          console.log(this.uesrFollowing) ;
        }
      );
       }
      
      
      }
  );

  for(let x of this.uesrFollowers){
    if(x == this.person.email)
      this.isenabled = true ;
  }
  }


  followPerson(person : User){
     //this.person.followersArray = this.userData.email ;
     //this.userData.followingArray = this.person.email ;
     //this.person.followers += 1 ;
     //this.userData.follwing += 1 ;
     //$user = $this->ion_auth->where('email', $email)->users()->row();
     this.afDatabase.object('user/'+ this.personID +'/followersArray/'+ this.uesrFollowing.length).set(this.person.email)
     this.afDatabase.object('user/'+ this.personID +'/followers/').set(this.person.followers + 1)

     this.afAuth.authState.subscribe(auth =>{
      this.afDatabase.object('user/'+ auth.uid+'/followingArray/'+ this.uesrFollowing.length).set(this.person.email)
      this.afDatabase.object('user/'+ auth.uid+'/following/').set(this.uesrFollowing.length + 1)
      this.afDatabase.object('user/'+ this.personID +'/followersArray/'+ this.uesrFollowing.length).set(auth.email)
     this.afDatabase.object('user/'+ this.personID +'/followers/').set(this.person.followers + 1)
    })
    
    //this.afDatabase.object('event/'+ s + '/regNames/' + item.regnumber  ).set(this.userID);
    //this.afDatabase.object('event/'+s).update({"regnumber" : item.regnumber+1});
    this.isenabled = true ;
  }


  unfollowPerson(){
    
  }


}
