app.controller('MainController', [
  $scope,
  function($scope) {
    $scope.character = {
      ability: {
        str: '10',
        dex: '10',
        con: '10',
        int: '10',
        wis: '10',
        cha: '10',
        modifier: function(ability) {
          return Math.floor((app.character.ability[ability] - 10) * 0.5);
        }
      },
      alpha: {},
      armor: {
        none: 0,
        light: 2,
        heavy: 4
      },
      beta: {},
      bonus: {
        AC: 0,
        fort: 0,
        refl: 0,
        will: 0
      },
      defense: {
        AC: 0,
        fort: 0,
        refl: 0,
        will: 0
      },
      level: 1,
      skills: {
        acrobatics: '',
        athletics: '',
        conspiracy: '',
        insight: '',
        interaction: '',
        mechanics: '',
        nature: '',
        perception: '',
        science: '',
        stealth: '',
        list: function() {
          let text = '';
          for (i in skills) {
            text += `<li><span class="mono"> ${skills[i]}</span> ${app.character.skill[skill]}</li>`
          }
          return text;
        }
      },
      special: weapon: {
        light: 2,
        heavy: 3
      }
    },
    $scope.i = {
      mutation: function() {
        return greaterOf(app.i.mutation, 1);
      }
    }
  }
]);

// Object Declarations
let skills,
  stats;
// Function Declarations
let getJSON,
  levelUp,
  reset,
  threeDSix;
// Function Objects
let generate = {},
  origin = {},
  skill = {};
// Global Variables
let random = true;

skills = [
  'acrobatics',
  'athletics',
  'conspiracy',
  'insight',
  'interaction',
  'mechanics',
  'nature',
  'perception',
  'science',
  'stealth'
];
stats = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha'
];
// URL
const originsURL = 'https://alice-em.github.io/gammaworld-characterbuilder/js/origins.json';

// Different Origins
const core = [
  'android',
  'cockroach',
  'doppelganger',
  'electrokinetic',
  'empath',
  'felinoid',
  'giant',
  'gravity controller',
  'hawkoid',
  'hypercognitive',
  'mind breaker',
  'mind coercer',
  'plant',
  'pyrokinetic',
  'radioactive',
  'rat swarm',
  'seismic',
  'speedster',
  'telekinetic',
  'yeti'
];
const famineInFargo = [
  'ai',
  'alien',
  'arachnoid',
  'cryokinetic',
  'ectoplasmic',
  'entropic',
  'exploding',
  'fungoid',
  'gelatinous',
  'magnetic',
  'mythic',
  'nightmare',
  'plaguebearer',
  'plastic',
  'prescient',
  'reanimated',
  'shapeshifter',
  'simian',
  'temporal',
  'wheeled'
];

generate.abilities.random = () => {
  for (i in stats) {
    app.character.ability[stats[i]] = threeDSix();
  }
}

generate.character = (alpha, beta) => { // example: app.character.alpha
  if (alpha.name === beta.name) {
    beta = origins.special.human;
  }
  generate.abilities.random();
  if (alpha.type.stat === beta.type.stat) {
    app.character.ability[alpha.type.stat] = 20;
  } else {
    app.character.ability[alpha.type.stat] = 18;
    app.character.ability[beta.type.stat] = 16;
  }
  generate.character.defense(alpha.defense);
  generate.character.defense(beta.defense);
  skill.assignment(alpha, beta);
  let level = Number(_id('level').value);
  app.character.defense.AC = Number(10 + level) + app + character.bonus.AC;
  app.character.defense.fort = generate.defenses('fort');
  app.character.defense.refl = generate.defenses('refl');
  app.character.defense.will = generate.defenses('will');
  levelUp(alpha, beta, level);
};
generate.character.defense = (defense) => { // example: app.character.alpha.defense
  for (type in defense.type) {
    app.character.bonus[type] += Number(defense.bonus);
  }
};
generate.defenses = (defense) => { // example: 'fort'
  let modifier;
  switch (defense) {
    case 'fort':
      modifier = greaterOf(app.character.mod('str'), app.character.mod('con'));
      break;
    case 'refl':
      modifier = greaterOf(app.character.mod('dex'), app.character.mod('int'));
      break;
    case 'will':
      modifier = greaterOf(app.character.mod('wis'), app.character.mod('cha'));
      break;
  }
  return 10 + app.character.level + modifier + app.character.bonus[defense];
}

generate.origin.random = (origins) => { // example: jsonData
  let randomizer = (origins) => {
    let book,
      number,
      origin;
    number = Math.floor(Math.random() * 20 + 1);
    if (number >= 11) {
      book = 'core';
      number = (Math.floor(Math.random() * 20));
      origin = core[number];
    } else {
      book = 'famineInFargo';
      number = (Math.floor(Math.random() * 20));
      origin = famineInFargo[number];
    }
    return origins[book][origin];
  }
  app.character.alpha = randomizer(origins);
  app.character.beta = randomizer(origins);
};

generate.origin.selected = () => {};

generate.power.text = (power) => { // example: app.character.alpha.power.novice
  let text = `<strong>${power.name}</strong>
  <em>${power.flavor}</em>
  <div class="powers-min">${stringify(power.type)}<br />
  ${power.action} <span style="float:right">${power.range}</span><br />`;
  if (power.special) {
    text += `${power.special} <br />`;
  }
  if (power.target) {
    text += `${power.target} <br />`;
  }
  if (power.trigger) {
    text += `${power.trigger} <br />`;
  }
  text += '</div>';
  if (power.attack && power.attack.text.length > 0) {
    text += `<div class="attack">${power.attack.text}</div>`;
  }
  text += `<div class="effect">${power.effect.text}</div>`;
  power.text = text;
};

skill.assignment = (alpha, beta) => { // example: app.character.alpha
  for (i in skills) {
    switch (skills[i]) {
      case 'athletics':
        app.character.skills[skills[i]] = Number(app.character.mod('str')) + Number(app.character.level);
        break;
      case 'acrobatics':
      case 'stealth':
        app.character.skills[skills[i]] = Number(app.character.mod('dex')) + Number(app.character.level);
        break;
      case 'conspiracy':
      case 'mechanics':
      case 'science':
        app.character.skills[skills[i]] = Number(app.character.mod('int')) + Number(app.character.level);
        break;
      case 'insight':
      case 'nature':
      case 'perception':
        app.character.skills[skills[i]] = Number(app.character.mod('wis')) + Number(app.character.level);
        break;
      case 'interaction':
        app.character.skills[skills[i]] = Number(app.character.mod('cha')) + Number(app.character.level);
        break;
    }
  }
  skill.origin(alpha.skill);
  skill.origin(beta.skill);
  random
    ? skill.random()
    : ();
};

skill.origin = (skill) => { // example: alpha.skill
  for (i in skill) {
    app.character.skills[skill.type[i]] += Number(skill.bonus);
  }
};

skill.random = () => {
  let _random = Math.floor(Math.random() * 10);
  let _skill = skills[_random];
  app.character.skills[_skill] += 4;
};

threeDSix = () => {
  return Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
};

function greaterOf(one, two) {
  return one >= two
    ? one
    : two;
}

function isThere(item) {
  return item.name.length > 0
    ? `<u>${item.name}</u>: ${item.text}<br />`
    : '';
}

function isThereExtra(levelOne) {
  let text = isThere(levelOne.one);
  text += levelOne.two
    ? isThere(levelOne.two)
    : '';
  return text;
}