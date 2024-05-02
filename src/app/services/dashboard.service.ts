import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import { AuthServiceService } from './auth-service.service';
import { Utilisateur } from 'app/Model/utilisateur';
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
      console.log(`Active Cards: ${activeCount}, Blocked Cards: ${blockedCount}`);
      // Emit the update to any subscribers
      this.cardStatusUpdate.next({ activeCount, blockedCount });
     
    });
    this.hubConnection.on('SendRechargeUpdate', (rechargeconfirme,rechargeannule) => {
      console.log(` rechargeconfirme : ${rechargeconfirme}`);
      // Emit the update to any subscribers
      this.rechargeUpdate.next( {rechargeconfirme, rechargeannule} );
     
    });
    }
    
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
