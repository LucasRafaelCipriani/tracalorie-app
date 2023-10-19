import { Storage } from "./Storage";

export default class CalorieTracker {
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
