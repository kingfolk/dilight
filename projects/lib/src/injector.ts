import { InjectMeta } from './inject-meta';
import { Injectable } from './injectable';
import { Type } from './typing';
import { isModule } from './utils';

export class InstanceInjector {
  static map = new WeakMap<Object, Injector>();

  static set<T>(instance: T, injector: Injector) {
    InstanceInjector.map.set(instance, injector);
  }

  static get<T>(instance: T): Injector {
    return InstanceInjector.map.get(instance);
  }
}

@Injectable()
export class Injector {
  static INJECTOR_ID = 0;

  static InjectorMap = new Map<number, Injector>();

  private providers = new Set<Type<any>>();

  private instances = new Map<Type<any>, Object>();

  id = Injector.INJECTOR_ID ++;

  readonly parent: Injector;

  private childrenIds: number[] = [];

  get children() {
    return this.childrenIds.map((id) => Injector.InjectorMap.get(id));
  }

  static create(providers: Type<any>[] = [], parentInjector?: Injector) {
    const injector = new Injector(parentInjector);
    providers.forEach((p) => {
      injector.addProvider(p);
    });
    return injector;
  }

  static createModule<T>(target: Type<T>, parentInjector?: Injector): T {
    const providers = InjectMeta.getModuleProviders(target) || [];
    const injector = Injector.create(providers, parentInjector);
    const instance = injector.createInstance(target);
    return instance;
  }

  constructor(parentInjector?: Injector) {
    this.providers.add(Injector);
    this.instances.set(Injector, this);
    Injector.InjectorMap.set(this.id, this);
    if (parentInjector) {
      this.parent = parentInjector;
      parentInjector.childrenIds.push(this.id);
    }
  }

  get<T>(provider: Type<T>): T {
    if (!this.hasOwnProvider(provider) && this.parent) {
      return this.parent.get(provider);
    }  else {
      return this.getInstance(provider);
    }
  }

  snapshot() {
    const providers = Array.from(this.providers).map((provider) => provider.name);
    const instances = Array.from(this.instances.keys()).map((provider) => provider.name);
    const children = this.children.map((c) => c.snapshot());
    return {injectorId: this.id, providers, instances, children};
  }

  private addProvider<T>(provider: Type<T>) {
    if (this.providers.has(provider)) {
      throw Error(`Duplicate provider ${provider.name}`);
    } else {
      this.providers.add(provider);
    }
  }

  private getInstance<T>(provider: Type<T>): T {
    if (this.instances.has(provider)) {
      return this.instances.get(provider) as T;
    }

    let instance: T;
    if (isModule(provider)) {
      instance = Injector.createModule(provider, this);
    } else {
      instance = this.createInstance(provider);
    }
    this.registerInstance(provider, instance);

    return instance;
  }

  private createInstance<T>(provider: Type<T>): T {
    const constructorParams = InjectMeta.getConstructorParams(provider);
    // If constructorParams meta does not meet with provider's constructor params. then throw error.
    if (constructorParams.length !== provider.length) {
      throw Error(`class ${provider.name} is not injectable`);
    }
    const paramInstances = constructorParams.map((paramProvider) => this.get(paramProvider));
    const hostInstance = new provider(...paramInstances);

    return hostInstance;
  }

  private registerInstance<T>(provider: Type<T>, instance: T) {
    InstanceInjector.set(instance, this);
    this.instances.set(provider, instance);
  }

  private hasOwnProvider<T>(provider: Type<T>) {
    return this.providers.has(provider);
  }
}
