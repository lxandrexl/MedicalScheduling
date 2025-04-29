const { Container } = require("inversify");
const { helpers } = require("inversify-vanillajs-helpers");

class ContainerDependency {
  constructor() {
    this.container = new Container({ skipBaseClassChecks: true });
    this.register = helpers.register(this.container);
    this.dependencies = [];
    this.usecase = {};
  }

  registerDependencies(dependencies) {
    this.dependencies = [];
    dependencies.forEach((dependencie) => {
      const name = dependencie.name;
      const type = Symbol.for(name);
      this.dependencies.push(type);
      if (!this.container.isBound(type)) {
        this.register(type)(dependencie);
      }
    });
  }

  registerUsecase(usecase) {
    const name = usecase.name;
    const type = Symbol.for(name);
    this.usecase[name] = type;
    if (!this.container.isBound(type)) {
      this.register(type, this.dependencies)(usecase);
      // console.log(usecase, " | Dependencies ", this.dependencies);
      // console.log(usecase, " | Container", this.container.getAll(type));
    }
  }

  getContainer() {
    return this.container;
  }

  getUsecase() {
    const usecases = Object.keys(this.usecase);
    if (usecases.length === 1) return this.usecase[usecases[0]];
    return this.usecase;
  }
}

module.exports = { ContainerDependency };
