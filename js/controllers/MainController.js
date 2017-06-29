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
          return Math.floor(($scope.character.ability[ability] - 10) * 0.5);
        }
      },
      alpha: {},
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
        stealth: ''
      }
    },
    $scope.i = {
      defense: {
        AC: function() {
          return 10 + $scope.character.level + greaterOf()
        }
      }
      mutation: function() {
        return greaterOf($scope.i.mutation, 1);
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

generate.defense = (defense) => { // app.character.alpha.defense
  for (type in defense.type) {
    app.character.bonus[type] += Number(defense.bonus);
  }
};

generate.character = (alpha, beta) => { // app.character.alpha
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
  generate.defense(alpha.defense);
  generate.defense(beta.defense);
  skill.assignment(alpha, beta);
  let level = Number(_id('level').value);
  levelUp(alpha, beta, level);
};

generate.origin.selected = () => {};

generate.origin.random = (origins) => {
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

generate.abilities.random = () => {
  for (i in stats) {
    app.character.ability[stats[i]] = threeDSix();
  }
}

skill.assignment = (alpha, beta) => {
  for (i in skills) {
    switch (skills[i]) {
      case 'athletics':
        character.skills[skills[i]] = Number(character.mod('str')) + Number(character.level);
        break;
      case 'acrobatics':
      case 'stealth':
        character.skills[skills[i]] = Number(character.mod('dex')) + Number(character.level);
        break;
      case 'conspiracy':
      case 'mechanics':
      case 'science':
        character.skills[skills[i]] = Number(character.mod('int')) + Number(character.level);
        break;
      case 'insight':
      case 'nature':
      case 'perception':
        character.skills[skills[i]] = Number(character.mod('wis')) + Number(character.level);
        break;
      case 'interaction':
        character.skills[skills[i]] = Number(character.mod('cha')) + Number(character.level);
        break;
    }
  }
  skill.origin(alpha.skill);
  skill.origin(beta.skill);
  skill.random();
};

skill.origin = (originSkill) => { // alpha.skill
  for (i in originSkill) {
    app.character.skills[originSkill.type[i]] += Number(originSkill.bonus);
  }
};

skill.random = () => {
  let _random = Math.floor(Math.random() * 10);
  let _skill = skills[_random];
  character.skills[_skill] += 4;
};

threeDSix = () => {
  return Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
};

function greaterOf(one, two) {
  return one >= two
    ? one
    : two;
}
