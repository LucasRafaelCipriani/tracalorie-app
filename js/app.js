class CalorieTracker {
  #calorieLimit;
  #totalCalories;
  #meals;
  #workouts;

  constructor() {
    this.#calorieLimit = Storage.getCalorieLimit();
    this.#totalCalories = Storage.getTotalCalories();
    this.#meals = Storage.getMeals();
    this.#workouts = Storage.getWorkouts();

    this.#displayCaloriesLimit();
    this.#render();

    document.getElementById("limit").value = this.#calorieLimit;
  }

  // Public Methods
  addMeal(meal) {
    this.#meals.push(meal);
    this.#totalCalories += meal.calories;

    Storage.setTotalCalories(this.#totalCalories);
    Storage.setMeal({
      id: meal.id,
      name: meal.name,
      calories: meal.calories,
    });
    this.#displayNewMeal(meal);
    this.#render();
  }

  addWorkout(workout) {
    this.#workouts.push(workout);
    this.#totalCalories -= workout.calories;

    Storage.setTotalCalories(this.#totalCalories);
    Storage.setWorkout({
      id: workout.id,
      name: workout.name,
      calories: workout.calories,
    });
    this.#displayNewWorkout(workout);
    this.#render();
  }

  removeMeal(id) {
    const index = this.#meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this.#meals[index];
      this.#totalCalories -= meal.calories;

      Storage.setTotalCalories(this.#totalCalories);
      Storage.removeMeal(id);
      this.#meals.splice(index, 1);
      this.#render();
    }
  }

  removeWorkout(id) {
    const index = this.#workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this.#workouts[index];
      this.#totalCalories += workout.calories;

      Storage.setTotalCalories(this.#totalCalories);
      Storage.removeWorkout(id);
      this.#workouts.splice(index, 1);
      this.#render();
    }
  }

  reset() {
    this.#totalCalories = 0;
    this.#meals = [];
    this.#workouts = [];

    Storage.clearAll();
    this.#render();
  }

  loadItems() {
    this.#meals.forEach((meal) => this.#displayNewMeal(meal));
    this.#workouts.forEach((workout) => this.#displayNewWorkout(workout));
  }

  // Private Methods
  #displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this.#totalCalories;
  }

  #displayCaloriesLimit() {
    const caloriesLimitEl = document.getElementById("calories-limit");
    caloriesLimitEl.innerHTML = this.#calorieLimit;
  }

  #displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed");
    const consumed = this.#meals.reduce((total, meal) => {
      return total + meal.calories;
    }, 0);

    caloriesConsumedEl.innerHTML = consumed;
  }

  #displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");
    const burned = this.#workouts.reduce((total, workout) => {
      return total + workout.calories;
    }, 0);

    caloriesBurnedEl.innerHTML = burned;
  }

  #displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    const progressEl = document.getElementById("calories-progress");
    const remaining = this.#calorieLimit - this.#totalCalories;

    caloriesRemainingEl.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove("bg-light");
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-danger");
      progressEl.classList.add("bg-danger");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove("bg-danger");
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
      progressEl.classList.remove("bg-danger");
    }
  }

  #displayCaloriesProgress() {
    const progressEl = document.getElementById("calories-progress");
    const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
    const width = Math.min(percentage, 100);

    progressEl.style.width = `${width}%`;
  }

  #displayNewMeal(meal) {
    const mealsEl = document.getElementById("meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">${meal.calories}</div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `;

    mealsEl.appendChild(mealEl);
  }

  #displayNewWorkout(workout) {
    const workoutsEl = document.getElementById("workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">${workout.calories}</div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `;

    workoutsEl.appendChild(workoutEl);
  }

  #render() {
    this.#displayCaloriesTotal();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
    this.#displayCaloriesProgress();
  }

  // Getters and Setters
  get totalCalories() {
    return this.#totalCalories;
  }

  get meals() {
    return this.#meals;
  }

  get workouts() {
    return this.#workouts;
  }

  set calorieLimit(calorieLimit) {
    this.#calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);

    this.#displayCaloriesLimit();
    this.#render();
  }
}

class Meal {
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

class Workout {
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

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;

    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }

    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;

    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }

    return totalCalories;
  }

  static setTotalCalories(totalCalories) {
    localStorage.setItem("totalCalories", totalCalories);
  }

  static getMeals() {
    let meals;

    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }

    return meals;
  }

  static setMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });

    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;

    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }

    return workouts;
  }

  static setWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });

    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
  }
}

class App {
  #tracker;

  constructor() {
    this.#tracker = new CalorieTracker();
    this.#loadEventListeners();
    this.#tracker.loadItems();
  }

  #loadEventListeners() {
    document.getElementById("meal-form").addEventListener("submit", this.#newItem.bind(this, "meal"));
    document.getElementById("workout-form").addEventListener("submit", this.#newItem.bind(this, "workout"));

    document.getElementById("meal-items").addEventListener("click", this.#removeItem.bind(this, "meal"));
    document.getElementById("workout-items").addEventListener("click", this.#removeItem.bind(this, "workout"));

    document.getElementById("filter-meals").addEventListener("input", this.#filterItems.bind(this, "meal"));
    document.getElementById("filter-workouts").addEventListener("input", this.#filterItems.bind(this, "workout"));

    document.getElementById("reset").addEventListener("click", this.#reset.bind(this));
    document.getElementById("limit-form").addEventListener("submit", this.#setLimit.bind(this));
  }

  #newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);
    const collapseItem = document.getElementById(`collapse-${type}`);
    new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });

    // Validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      name.focus();
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this.#tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this.#tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";
  }

  #removeItem(type, e) {
    if (e.target.classList.contains("delete") || e.target.classList.contains("fa-xmark")) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal" ? this.#tracker.removeMeal(id) : this.#tracker.removeWorkout(id);
        e.target.closest(".card").remove();
      }
    }
  }

  #filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  #reset() {
    if (confirm("Are you sure?")) {
      this.#tracker.reset();

      document.getElementById("meal-items").innerHTML = "";
      document.getElementById("workout-items").innerHTML = "";
      document.getElementById("filter-meals").value = "";
      document.getElementById("filter-workouts").value = "";
    }
  }

  #setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please add a limit");
      return;
    }

    this.#tracker.calorieLimit = +limit.value;
    limit.value = "";

    const modalEl = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
