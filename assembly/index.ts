import { Product,listedProducts } from "./model";
import {ContractPromiseBatch, context} from "near-sdk-as";

export function setProduct(product: Product):void{
    const storedProduct = listedProducts.get(product.id);
    if(storedProduct !== null){
        throw new Error(`A product with ${product.id} already exists`);
    }
    listedProducts.set(product.id, Product.fromPayload(product));
}

export function getProduct(id:string):Product | null{
    return listedProducts.get(id);
}

export function getProducts():Product []{
    return listedProducts.values();
}

export function buyProduct(productId:string):void{

    const product = getProduct(productId);
    
    if(product == null){
        throw new Error(`Product not found`);
    }
    if(product.price.toString() != context.attachedDeposit.toString()){
        throw new Error("The deposit amount and the price does not match");
    }
    ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit);
    product.incrementSoldAmount();
    product.changeOwner();
    listedProducts.set(productId,product);

}