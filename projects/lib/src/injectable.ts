import 'reflect-metadata';
import {Type} from './typing';
import {InjectMeta} from './inject-meta';

export function Injectable() {
  return InjectableConstructor;
}

// TODO: angular prod will strip decorator meta.
// https://github.com/angular/angular-cli/issues/2799
// https://github.com/angular/angular-cli/issues/9306
export function InjectableConstructor<T>(target: Type<T>) {
  const types = Reflect.getMetadata('design:paramtypes', target);
  if (types) {
    const paramPrototypes = types.map((type) => type);
    InjectMeta.setConstructorParams(target, paramPrototypes);
  }
}
