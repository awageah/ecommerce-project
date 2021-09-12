import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {


  private orderUrl: string = 'http://localhost:8080/api/orders';

  constructor(private httpClient: HttpClient) {

  }

  getOrderHistory(email: string): Observable<getOrderHistoryReponse> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.httpClient.get<getOrderHistoryReponse>(orderHistoryUrl);
  }


}

interface getOrderHistoryReponse {

  _embedded: {
    orders: OrderHistory[];
  }

}
