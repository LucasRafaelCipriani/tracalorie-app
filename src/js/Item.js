export class Meal {
  #id;
  #name;
  #calories;

  constructor(name, calories) {
    this.#id = Math.random().toString(16).slice(2);
    this.#name = name;
    this.#calories = calories;
  }

  get calories() {
    return this.#calories;
  }

  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }
}

export class Workout {
  #id;
  #name;
  #calories;

  constructor(name, calories) {
    this.#id = Math.random().toString(16).slice(2);
    this.#name = name;
    this.#calories = calories;
  }

  get calories() {
    return this.#calories;
  }

  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }
}
