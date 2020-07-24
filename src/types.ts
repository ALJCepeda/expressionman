import {MapOptions} from "./decorators";

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface IContainer<ContainerT> {
  bindValue<T>(token:Newable<T> | symbol, value:T);
  resolve<T>(token:Newable<T> | symbol);
}

export type IChildContainer<ContainerT> = IContainer<ContainerT>;

export interface IParentContainer<ContainerT> extends IContainer<ContainerT> {
  create():IChildContainer<ContainerT>;
}

export interface IHTTPResponse<U> {
  statusCode?: number;
  contentType?: string;
  body: U;
}

export interface RouteHandlerConstructor {
  new (...args: any[]): IRouteHandler
}

export interface IRouteHandler {
  catch?(err:Error): any;
  handle(payload:any): any;
}

export interface PropertyMapOptions<InputType = string>{
  path:string[];
  options:MapOptions<InputType>
}

export type InputMap = {
  [propertyName:string]:PropertyMapOptions<any>
};