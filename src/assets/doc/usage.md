## Usage

Simple usage scenario means you only want create a global injector to serve all your global services.

```typescript
import {Dilight, Injectable} from 'dilight';

@Injectable()
class ServiceA {}

@Injectable()
class ServiceB {
  constructor(private a: ServiceA) {}
}

const injector = Dilight.new();

class SomeComponent {
  someMethod() {
    const b = injector.get(ServiceB);
  }
}
```

In most cases, you would like to create multiple injectors and build parent-child relation between some of those.

```typescript
import {Dilight, Injectable} from 'dilight';

@Injectable()
class ServiceA {}

@Injectable()
class ServiceB {
  constructor(private a: ServiceA) {}
}

const parentInjector = Dilight.new();

// childInjector will have its own ServiceB provider
const childInjector = Dilight.new([ServiceB], parentInjector);

// will log false
console.log(childInjector.get(ServiceB) === parentInjector.get(ServiceB));

// will log true
console.log(childInjector.get(ServiceA) === parentInjector.get(ServiceA));
```

You can also define provider like [angular component providers](https://angular.io/guide/providers#limiting-provider-scope-with-components).

```typescript
import {Dilight, Injectable, Module, Injector} from 'dilight';

@Injectable()
class ServiceA {}

@Injectable()
class ServiceB {
  constructor(private a: ServiceA) {}
}

@Module({
  providers: [ServiceB],
})
class SomeComponent {
  constructor(public childInjector: Injector) {}
}

const parentInjector = Dilight.new();
const comp = parentInjector.get(SomeComponent);

// will log false
console.log(comp.childInjector.get(ServiceB) === parentInjector.get(ServiceB));

// will log true
console.log(comp.childInjector.get(ServiceA) === parentInjector.get(ServiceA));
```

