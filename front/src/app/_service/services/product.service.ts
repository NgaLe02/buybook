import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import {
  ProductModelServer,
  serverResponse,
} from "src/app/_model/models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private url = environment.backApiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(limitOfResults = 10): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + "products", {
      params: {
        limit: limitOfResults.toString(),
      },
    });
  }

  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.url + "products/" + id);
  }

  getProductsFromCategory(catName: String): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(
      this.url + "products/category/" + catName
    );
  }
}
