import {Type} from './typing';

export namespace InjectMeta {
  export function setConstructorParams(target: Type<any>, params: Type<any>[]) {
    Reflect.defineMetadata('inject:target:constructor', params, target);
  }

  export function getConstructorParams(target: Type<any>): Type<any>[] {
    return Reflect.getMetadata('inject:target:constructor', target) || [];
  }

  export function registerInjector(target: Type<any>) {
    Reflect.defineMetadata('inject:target:injector', true, target);
  }

  export function checkInjector(target: Type<any>): boolean {
    return Reflect.getMetadata('inject:target:injector', target);
  }

  export function registerModuleProviders(target: Type<any>, providers: Type<any>[]) {
    Reflect.defineMetadata('inject:target:providers', providers, target);
  }

  export function getModuleProviders(target: Type<any>) {
    return Reflect.getMetadata('inject:target:providers', target);
  }
}
