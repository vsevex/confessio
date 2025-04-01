import funcArgs from "./getFunctionArguments";

interface DiContainer {
  register(name: string, dependency: any): void;
  factory(name: string, factory: (...args: any[]) => any): void;
  inject<T>(factory: (...args: any[]) => T): T;
  get<T>(name: string): T;
}

/**
 * DI Container
 */
const dependencies: Record<string, any> = {};
const factories: Record<string, (...args: any[]) => any> = {};

export default (): DiContainer => {
  const diContainer: DiContainer = {
    /**
     * Register dependency
     */
    register(name: string, dependency: any): void {
      dependencies[name] = dependency;
    },

    /**
     * Register factory
     */
    factory(name: string, factory: (...args: any[]) => any): void {
      factories[name] = factory;
    },

    /**
     * Inject dependencies into factory
     */
    inject<T>(factory: (...args: any[]) => T): T {
      const args = funcArgs(factory).map((dependency) => this.get(dependency));
      return factory(...args);
    },

    /**
     * Get dependency
     */
    get<T>(name: string): T {
      if (!dependencies[name]) {
        const factory = factories[name];
        dependencies[name] = factory ? this.inject(factory) : undefined;
        if (dependencies[name] === undefined) {
          throw new Error(`Cannot find module: ${name}`);
        }
      }
      return dependencies[name] as T;
    },
  };

  return diContainer;
};
