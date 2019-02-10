import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as moment from 'moment';


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  constructor(private http: HttpClient, private db: AngularFireDatabase) { } //note that the HttpClient has to be passed to the constructor. 
  inputSymbol: string =  "";
  inputDuration: string = '1m';

  stockResults: StockResult[];
  stockCompany: CompanyDetail;
  peers: string[];
  watchedItems: Observable<any[]>;
  searches: Observable<any[]>;
  /*writeStockData() {
    defaultDatabase.ref('searches/' + this.inputSymbol).set({
      date : moment().format('L')
    });
  }

 watchedDB = defaultDatabase.ref('watches/1');

 watchedDB.on('value', function(snapshot) {
   this.watchedItems =  snapshot.val();
  )
 })*/

 addWatched() {
  this.db.list('/watched').push({
    symbol: this.stockCompany.symbol,
    companyName: this.stockCompany.companyName,
    date: moment().format('L')
  })
}

 writeStockData() {
  this.db.list('/searches').push({
    symbol: this.stockCompany.symbol,
    companyName: this.stockCompany.companyName,
    date: moment().format('L')
  })
}

searchClick(symbol: string){
  this.inputSymbol = symbol;
  this.symbolChanged();
}

  symbolChanged() {
    this.inputSymbol = this.inputSymbol.toUpperCase();
    this.http.get<StockResult[]>('https://api.iextrading.com/1.0/stock/' + this.inputSymbol + '/chart/' + this.inputDuration).subscribe(res => {
      this.stockResults = res;
    });

    this.http.get<CompanyDetail>('https://api.iextrading.com/1.0/stock/'+this.inputSymbol + '/company').subscribe(res => {
      this.stockCompany = res;
      this.writeStockData();
      this.http.get<any>('https://api.iextrading.com/1.0/stock/'+this.inputSymbol + '/logo').subscribe(res => {
      this.stockCompany.logo = res.url;
  });
  });
    this.http.get<string[]>('https://api.iextrading.com/1.0/stock/'+this.inputSymbol + '/peers').subscribe(res => {
        this.peers = res;
  });
  }

  setSelected(selected: string) {
    this.inputSymbol = selected;
    this.symbolChanged();
  }
  ngOnInit() {
 
  this.searches = this.db.list('/searches').valueChanges();
  this.watchedItems = this.db.list('/watched').valueChanges();

  }
}

interface StockResult {
    date: string;
    close: string;
    changePercent: string;
  }

interface CompanyDetail {
    symbol: string;
    companyName: string;
    exchange: string;
    website: string;
    sector: string;
    logo: string;
  }

interface WatchedStock {
    symbol: string;
    companyName: string;
  }

  interface SearchedStock {
    symbol: string;
    companyName: string;
    date: string;
  }

