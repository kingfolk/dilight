import { Type } from './typing';
import { InjectMeta } from './inject-meta';
import { InjectableConstructor } from './injectable';

export class InjectorParams {
  providers: Type<any>[];
}

/**
 * Module
 * @param params 定义可注入的依赖
 */
export function Module(params?: InjectorParams) {
  return function <T> (target: Type<T>) {
    InjectMeta.registerInjector(target);
    InjectableConstructor(target);
    if (params && params.providers) {
      InjectMeta.registerModuleProviders(target, params.providers);
    }
  };
}
