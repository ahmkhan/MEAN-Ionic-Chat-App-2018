import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  BASEURL:string = 'http://localhost:4000/api/chatapp';

  constructor(private http: HttpClient) { }

  getMessagesServiceMethod(senderId, receiverId):Observable<any> {
    return this.http.get(`${this.BASEURL}/get-messages/${senderId}/${receiverId}`);
  };

  sendMessagesServiceMethod(senderId, senderUserName, receiverId, receiverUserName, textMessage):Observable<any> {
    return this.http.post(`${this.BASEURL}/send-messages/${senderId}/${receiverId}`, {
      senderId,
      senderUserName,
      receiverId,
      receiverUserName,
      textMessage
    })
  };
}
