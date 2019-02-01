import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  constructor(private http: HttpClient) { } //note that the HttpClient has to be passed to the constructor. 
  inputSymbol : String =  "";
  inputDuration : String = "1m";

  stockResults: StockResult[];
  stockCompany: CompanyDetail;
  peers: String[];

  symbolChanged(){
    this.inputSymbol = this.inputSymbol.toUpperCase();
    this.http.get<StockResult[]>('https://api.iextrading.com/1.0/stock/'+this.inputSymbol+'/chart/'+this.inputDuration).subscribe(res => {
      this.stockResults = res;
    });

    this.http.get<CompanyDetail>('https://api.iextrading.com/1.0/stock/'+this.inputSymbol+'/company').subscribe(res => {
      this.stockCompany = res;
  });
      this.http.get<String[]>('https://api.iextrading.com/1.0/stock/'+this.inputSymbol+'/peers').subscribe(res => {
        this.peers = res;
  });
  }

  setSelected(selected:String){
    this.inputSymbol = selected;
    this.symbolChanged();
  }
  
  ngOnInit() 
  {

  }
}

  interface StockResult {
    date: string;
    close: string;
    changePercent: string;
  }

  interface CompanyDetail {
    companyName: string;
    exchange: string;
    website: string;
    sector: string;
  }

