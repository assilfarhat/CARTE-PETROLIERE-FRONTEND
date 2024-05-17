import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import { AuthServiceService } from './auth-service.service';
import { Utilisateur } from 'app/Model/utilisateur';
import { Remise } from 'app/Model/Remise';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private hubConnection: signalR.HubConnection;
   connectionEstablished = new Subject<Boolean>();
  private dashboardHubUrl = environment.api_url+"/dashboardHub";
  private currentuser : Utilisateur;
  cardStatusUpdate = new Subject<{ activeCount: number, blockedCount: number }>();
  rechargeUpdate = new Subject<{ rechargeconfirme: number , rechargeannule : number}>();
  // In your service
  remiseUpdate = new Subject<{ remises: Remise[] }>();

  constructor(private http: HttpClient,private AuthServiceService : AuthServiceService) 
  {
    const options: signalR.IHttpConnectionOptions = {
      accessTokenFactory: () => {
        const getToken = JSON.parse(localStorage.getItem('token'))
        return getToken.access_token;
      }
    };
    if(!this.hubConnection){
      this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.dashboardHubUrl, options 
      ) // Ensure this URL matches your SignalR hub URL
      .build();
  
    this.hubConnection.start().then(() => {
       // console.log('Hub connection started')
      }).catch(err => console.error('Error connecting to SignalR hub:', err));
  
      this.hubConnection.on('ReceiveCardStatusUpdate', (activeCount, blockedCount) => {
     // console.log(`Active Cards: ${activeCount}, Blocked Cards: ${blockedCount}`);
      // Emit the update to any subscribers
      this.cardStatusUpdate.next({ activeCount, blockedCount });
     
    });
    this.hubConnection.on('SendRechargeUpdate', (rechargeconfirme,rechargeannule) => {
      //console.log(` rechargeconfirme : ${rechargeconfirme}`);
      // Emit the update to any subscribers
      this.rechargeUpdate.next( {rechargeconfirme, rechargeannule} );
     
    });
   
    this.hubConnection.on('SendlistRemise', (remises: Remise[]) => {
      console.log('Received remises: ', remises);
      console.log("0",typeof remises);
      // Here you can update your component with the new remises
      this.remiseUpdate.next({ remises: remises });

    });

    }
    
    
  }
 
  

  SendlistRemise(): Observable<any> {
    return this.remiseUpdate.asObservable();
  }

    transactionstat(){
      return this.http.get(`${environment.api_url}/api/Dashboard/transactionstatistic`);
    }

    cardscount(){
      return this.http.get(`${environment.api_url}/api/Dashboard/countcards`);
    }

    rechagecount(){
      return this.http.get(`${environment.api_url}/api/Dashboard/SendRechargesatstic`);
    }
}
