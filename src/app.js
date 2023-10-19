import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse } from "bootstrap";
import CalorieTracker from "./js/Tracker";
import { Meal, Workout } from "./js/Item";

import "./css/bootstrap.css";
import "./css/style.css";

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
    new Collapse(collapseItem, {
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
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }
}

new App();
