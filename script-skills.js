class SkillsRenderer {
  #container;

  constructor(container) {
    this.#container = container;
  }

  render(data) {
    const filteredSkills = data.filteredSkills;
    if (filteredSkills.length === 0) {
      this.#container.innerHTML = this.getEmptyHtml();
      return;
    }

    this.#container.innerHTML = "";

    const [hardSkillsContainer, softSkillsContainer] =
      this.getCardContainerHtmlElements();

    const hardSkills = filteredSkills.filter((x) => x.type === "hard");

    const softSkills = filteredSkills.filter((x) => x.type === "soft");

    if (hardSkills.length > 0) {
      hardSkillsContainer.innerHTML += hardSkills
        .map(this.getCardHtml)
        .join(" ");
      this.#container.appendChild(hardSkillsContainer);
    }

    if (softSkills.length > 0) {
      softSkillsContainer.innerHTML += softSkills
        .map(this.getCardHtml)
        .join(" ");

      this.#container.appendChild(softSkillsContainer);
    }
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
    return [hardSkillsContainer, softSkillsContainer];
  }

  getCardHtml(skill) {
    return `<div class="content__skills-card ${skill.type === "soft" ? "content__skills-card-soft" : ""}">
        <div class="content__skills-card-icon-container">
            <i class="${skill.iconClassNames} content__skills-card-icon"></i>
        </div>
        <div class="content__skills-card-body">
            <div class="content__skills-card-body-header">
                <h2 class="content__skill-name">${skill.name}</h2>
                <div class="content__skill-tags">
                    ${skill.tags.map((x) => `<span class="content__skill-tag">${x}</span>`).join(" ")}
                </div>
                <div class="content__skills-level-container">
                    ${[1, 2, 3, 4, 5]
                      .map((x) =>
                        x <= skill.level
                          ? '<div class="content__skills-level content__skills-level--active"></div>'
                          : '<div class="content__skills-level"></div>',
                      )
                      .join(" ")}
                </div>
            </div>
            <div class="content__skills-card-body-content">
                ${skill.description}
            </div>
        </div>
    </div>`;
  }
}

class SkillsFilterRenderer {
  #lastFilter;

  render(data) {
    const [activateTags, deactivateTags] = this.getChangedTags(data.filter);

    const filterIcon = document.querySelector(
      ".content__skills-search-filters-icon",
    );
    if (filterIcon) {
      if (data.filter.searchTerm || data.filter.tags.length) {
        if (
          !filterIcon.classList.contains(
            "content__skills-search-filters-icon--active",
          )
        ) {
          filterIcon.classList.add(
            "content__skills-search-filters-icon--active",
          );
        }
      } else {
        if (
          filterIcon.classList.contains(
            "content__skills-search-filters-icon--active",
          )
        ) {
          filterIcon.classList.remove(
            "content__skills-search-filters-icon--active",
          );
        }
      }
    }

    document
      .querySelectorAll(".content__skills-search-filters-tag")
      .forEach((x) => {
        const tagName = x.textContent.trim();
        if (activateTags.includes(tagName)) {
          x.classList.add("content__skills-search-filters-tag--active");
        } else if (deactivateTags.includes(tagName)) {
          x.classList.remove("content__skills-search-filters-tag--active");
        }
      });

    this.#lastFilter = JSON.parse(JSON.stringify(data.filter));
  }

  getChangedTags(currentFilter) {
    if (!this.#lastFilter) {
      return [currentFilter.tags, []];
    }

    let activateTags = [];
    let deactivateTags = this.#lastFilter.tags.map((x) => x);
    for (let i = 0; i < currentFilter.tags.length; i++) {
      const currentTag = currentFilter.tags[i];
      const previousTag = this.#lastFilter.tags.find((x) => x === currentTag);
      if (previousTag) {
        deactivateTags.splice(deactivateTags.indexOf(previousTag), 1);
      } else {
        activateTags.push(currentTag);
      }
    }
    return [activateTags, deactivateTags];
  }
}

class SkillsFilterManager {
  #searchTermChangeTimeout;
  #callback;
  #data;

  constructor(callback, data) {
    this.#callback = callback;
    this.#data = data;
  }

  onTagChanged(tag) {
    const indexOfTag = data.filter.tags.indexOf(tag);
    if (indexOfTag >= 0) {
      this.#data.filter.tags.splice(indexOfTag, 1);
    } else {
      this.#data.filter.tags.push(tag);
    }

    this.apply();
  }

  onSearchTermChanged(value) {
    if (this.#searchTermChangeTimeout) {
      clearTimeout(this.#searchTermChangeTimeout);
    }

    this.#searchTermChangeTimeout = setTimeout(() => {
      this.#data.filter.searchTerm = value;

      this.apply();
    }, 300);
  }

  apply() {
    const filter = this.#data.filter;
    const searchTerm = filter.searchTerm?.trim()?.toLowerCase() ?? "";
    if (searchTerm !== "" || filter.tags.length > 0) {
      this.#data.filteredSkills = this.#data.skills.filter(
        (x) =>
          (!searchTerm || x.name.toLowerCase().includes(searchTerm)) &&
          (!filter.tags.length ||
            x.tags.some((tag) => filter.tags.includes(tag))),
      );
    } else {
      this.#data.filteredSkills = this.#data.skills;
    }

    this.#callback();
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
    description: `I started studying HTML since 2025 soon will be a year,
                  studied in collage and was developing it step by step, until i
                  saw my progress then tried to focus to connect other
                  frameworks/libraries to it.`,
    level: 5,
    type: "hard",
    iconClassNames: "fa-brands fa-html5",
    tags: ["Programming"],
  },
  {
    name: "CSS3",
    description: `I started studying CSS3 in 2025 along with HTML, studied in
                  collage along with HTML i was developing skills for both of
                  them, in collage exams really helped me to develop my skills
                  and after individual practices as well i achieved this level.`,
    level: 5,
    type: "hard",
    iconClassNames: "fa-brands fa-css3-alt",
    tags: ["Programming"],
  },
  {
    name: "SCSS",
    description: `I started studying SCSS in 2026, studied in
                collage, SCSS really upgraded my skills as for CSS as for itself.
                `,
    level: 5,
    type: "hard",
    iconClassNames: "fa-brands fa-sass",
    tags: ["Programming"],
  },
  {
    name: "Tailwind CSS",
    description: `I started studying Tailwind in collage, at first it was weird but by the time i developed my skills and really enjoyed using this framework`,
    level: 3,
    type: "hard",
    iconClassNames: "fa-brands fa-tailwind-css",
    tags: ["Framework"],
  },
  {
    name: "JavaScript",
    description: `Started learning in collage as well, developed many of my
                  skills by my individual practices, collage helped me as well`,
    level: 4,
    type: "hard",
    iconClassNames: "fa-brands fa-square-js",
    tags: ["Programming"],
  },
  {
    name: "TypeScript",
    description: `I started studying TypeScript at the start of 2026, it got
                  easier for me to study as i learned JavaScript in details, i
                  had few projects from collage and exams so it helped me to
                  understand this typed superset of JavaScript better and helped
                  me to develop my skills.`,
    level: 4,
    type: "hard",
    iconClassNames: "fa-brands fa-typescript",
    tags: ["Programming"],
  },
  {
    name: "React",
    description: `I started studying React by myself i was watching videos and was doing some small task, now i'm learning it in collage`,
    level: 3,
    type: "hard",
    iconClassNames: "fa-brands fa-react",
    tags: ["Library"],
  },
  {
    name: "Figma",
    description: `In collage our teacher showed us how to use it, did few projects on it in collage`,
    level: 3,
    type: "hard",
    iconClassNames: "fa-brands fa-figma",
    tags: ["Design"],
  },
  {
    name: "Git",
    description: `Studied in collage as well, i do have few projects on my Git (not all of them are finished)`,
    level: 4,
    type: "hard",
    iconClassNames: "fa-brands fa-git-alt",
    tags: ["Version Control"],
  },

  {
    name: "Georgian",
    description: `Native`,
    level: 5,
    type: "soft",
    iconClassNames: "fa-solid fa-flag-usa",
    tags: ["Language"],
  },
  {
    name: "English",
    description: `B2-C1`,
    level: 4,
    type: "soft",
    iconClassNames: "fa-solid fa-flag-usa",
    tags: ["Language"],
  },
  {
    name: "Russian",
    description: `B2`,
    level: 4,
    type: "soft",
    iconClassNames: "fa-solid fa-flag-usa",
    tags: ["Language"],
  },
  {
    name: "Korean",
    description: `A1-A2`,
    level: 1,
    type: "soft",
    iconClassNames: "fa-solid fa-flag-usa",
    tags: ["Language"],
  },
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
const renderers = [
  new SkillsFilterRenderer(),
  new SkillsRenderer(document.querySelector(".content__skills-card-container")),
];

function render() {
  renderers.forEach((rendrer) => {
    rendrer.render(data);
  });
}

const filterManager = new SkillsFilterManager(() => render(), data);

function onSkillsFilterTagChanged(tag) {
  filterManager.onTagChanged(tag);
}

function onSkillsFilterSearchTermChanged(value) {
  filterManager.onSearchTermChanged(value);
}

render();
