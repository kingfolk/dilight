import { Type } from './typing';
import { Injector, InstanceInjector } from './injector';

export class Dilight {
  static new(provider: Type<any>[] = [], parentInjector?: Injector) {
    return Injector.create(provider, parentInjector);
  }

  static injectorOf<T>(instance: T): Injector {
    return InstanceInjector.get(instance);
  }
}
