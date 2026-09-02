class SkillsRenderer {
  #lastSkills;

  constructor(container) {}

  render(data) {
    const filteredSkills = data.filteredSkills;
    if (filteredSkills.length === 0) {
      this.container.innerHTML = this.getEmptyHtml();
      return;
    }

    // change detection is here

    // first clean up
    

    this.#lastSkills = JSON.parse(JSON.stringify(data.filteredSkills));
  }

  getEmptyHtml() {
    return `<div class="content__skills-empty">No skills were found.</div>`;
  }

  getCardContainerHtmlElements() {
    const hardSkillsContainer = document.createElement("div");
    const softSkillsContainer = document.createElement("div");
    softSkillsContainer.classList.add("content__skills-cards");
    hardSkillsContainer.classList.add("content__skills-cards");
    softSkillsContainer.innerHTML = `<div class="content__skills-card-title-container">
        <span class="content__skills-card-title">Soft Skills</span>
    </div>`;
    hardSkillsContainer.innerHTML = `<div class="content__skills-card-title-container">
        <span class="content__skills-card-title">Hard Skills</span>
    </div>`;
    this.container.appendChild(hardSkillsContainer);
    this.container.appendChild(hardSkillsContainer);
    return [hardSkillsContainer, softSkillsContainer];
  }

  getCardHtml(skill) {
    
  }
}

class SkillsFilterRenderer {
  #lastFilter;

  render(data) {
    // detect changes
  }
}

class SkillsFilterManager {
  #searchTermChangeTimeout;
  #callback;

  constructor(callback) {
    this.#callback = callback;
  }

  onTagChanged(tag) {
    // if it included in tags then remove otherwise push
    data.filter.tags.push(tag);
    // call apply();
  }

  onSearchTermChanged(value) {
    // use debounce
    // and after 300ms call apply
  }

  apply() {
    // filter skills and write to filteredSkills
    // call this.#callback()
  }
}

// Initializations
// DATA:
/**
 * interface Skill {
 *  name: string;
 *  description: string;
 *  level: 1 | 2 | 3 | 4 | 5;
 *  type: 'hard' | 'soft';
 *  iconClassNames: string;
 *  tags: string[];
 * }
 */
const skills = [
  {
    name: "HTML5",
    description: "",
    level: 5,
    type: "hard",
    iconClassNames: "fa-html5",
    tags: ["Programming"],
  },
  // ...
];

/**
 * interface Filter {
 *  tags: string[];
 *  searchTerm: string;
 * }
 */
const filter = {
  tags: [],
  searchTerm: "",
};

const data = {
  skills,
  filteredSkills: skills,
  filter,
};

// RENDERERS
const renderers = [new SkillsFilterRenderer(), new SkillsRenderer()];

function render() {
  renderers.forEach((rendrer) => rendrer.render(data));
}

const filterManager = new SkillsFilterManager(() => render());

function onSkillsFilterTagChanged(tag) {
  filterManager.onTagChanged(tag);
}

function onSkillsFilterSearchTermChanged(event) {
  filterManager.onSearchTermChanged(event.target.value);
}

render();
