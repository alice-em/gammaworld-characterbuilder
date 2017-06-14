// Shorthand
function _id (ID) {
  return document.getElementById(ID);
}
function greaterOf(one, two) {
  if (one >= two) {
    return one;
  } else {
    return two;
  }
}
function stringify(item) {
  if (Array.isArray(item)) {
    return item.join(', ');
  } else {
    return item;
  }
}
function isThere(item) {
  if (item.name.length > 0) {
    return `<u>${item.name}</u>: ${item.text}<br />`;
  } else {
    return '';
  }
}
function isThereDefense(origin) {
  if (origin.defense.name.length > 0 && origin.defense.text.length > 0) {
    return `<u>${origin.defense.name}</u>: ${origin.defense.text}<br />`;
  } else {
    return '';
  }
}
function isThereExtra(levelOne) {
  let text = '';
  text = isThere(levelOne.one);
  if (levelOne.two) {
    text += isThere(levelOne.two);
  }
  return text;
}

// URL
const originsURL = 'https://alice-em.github.io/gammaworld-characterbuilder/js/origins.json';

// Different Origins
const core = ['android', 'cockroach', 'doppelganger', 'electrokinetic', 'empath', 'felinoid', 'giant', 'gravity controller', 'hawkoid', 'hypercognitive', 'mind breaker', 'mind coercer', 'plant', 'pyrokinetic', 'radioactive', 'rat swarm', 'seismic', 'speedster', 'telekinetic', 'yeti'];
const famineInFargo = ['ai', 'alien', 'arachnoid', 'cryokinetic', 'ectoplasmic', 'entropic', 'exploding', 'fungoid', 'gelatinous', 'magnetic', 'mythic', 'nightmare', 'plaguebearer', 'plastic', 'prescient', 'reanimated', 'shapeshifter', 'simian', 'temporal', 'wheeled'];

// Object Declarations
let character, origins, skills, stats;
// Function Declarations
let getJSON, levelUp, reset, threeDSix;
// Function Objects
let generate = {}, origin = {}, skill = {};

character = {
  ability: {
    'str': '10', 'dex': '10', 'con': '10', 'int': '10', 'wis': '10', 'cha': '10'
  },
  bonus: {'AC': 0, 'fort': 0, 'refl': 0, 'will': 0},
  level: '1',
  mod: function(stat) { return Math.floor((this.ability[stat] - 10) * 0.5); },
  skills: {
    'acrobatics': '', 'athletics': '', 'conspiracy': '', 'insight': '', 'interaction': '', 'mechanics': '', 'nature': '', 'perception': '', 'science': '', 'stealth': ''
  }
};

skills = ['acrobatics', 'athletics', 'conspiracy', 'insight', 'interaction', 'mechanics', 'nature', 'perception', 'science', 'stealth'];
stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

// JSON
getJSON = (url, callback) => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText);
      if (data) { callback(data); }
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
};

// Powers and Level rendering
generate.power = (power) => {
  let text = `<strong>${power.name}</strong>
  <em>${power.flavor}</em>
  <div class="powers-min">${stringify(power.type)}<br />
  ${power.action} <span style="float:right">${power.range}</span><br />`;
  if(power.special) { text += `${power.special} <br />`; }
  if(power.target) { text += `${power.target} <br />`; }
  if(power.trigger) { text += `${power.trigger} <br />`; }
  text += '</div>';
  if (power.attack && power.attack.text.length > 0) {
    text += `<div class="attack">${power.attack.text}</div>`;
  }
  text += `<div class="effect">${power.effect.text}</div>`;
  return text;
};

levelUp = (alpha, beta, level) => {
  let mutation = 1;
  character.level = level;
  switch(level) {
    case 10:
      _id('uber').innerHTML = '<ul><li>Choose one of your origin expert powers. You can use that power one additional time each encounter.</li><li>At the end of each encounter, you can automatically succeed on one Omega Charge check.</li><li>At the end of each encounter, you can choose one of your readied Alpha Mutation cards. You don\'t discard that card, and it remains readied for your next encounter.</li></ul>';
    case 9:
      _id('secondaryExpert').innerHTML = generate.power(beta.powers.expert);
    case 8:
      mutation = greaterOf(mutation, 3);
    case 7:
      _id('secondaryUtility').innerHTML = generate.power(beta.powers.utility);
    case 6:
      _id('secondaryCritical').innerHTML = beta.critical;
    case 5:
      _id('mainExpert').innerHTML = generate.power(alpha.powers.expert);
    case 4:
      mutation = greaterOf(mutation, 2);
    case 3:
      _id('mainUtility').innerHTML = generate.power(alpha.powers.utility);
    case 2:
      _id('mainCritical').innerHTML = alpha.critical;
    default:
      mutation = greaterOf(mutation, 1);
      _id('mutations').innerHTML = `<strong>Alpha Mutations:</strong> ${mutation}`;
      _id('origins').innerHTML = `α: ${alpha.name} | β: ${beta.name}`;
      _id('hitPoints').innerHTML = `<strong>HP:</strong> ${12 + character.mod('con')}`;
      _id('bloodied').innerHTML = `<strong>Bloodied Value:</strong> ${Math.floor((12 + character.mod('con')) * 0.5)}`;
      _id('defenses').innerHTML = `
        <strong>AC:</strong> ${Number(10 + level) + character.bonus.AC} + ____ (Armor, if applicable)<br />
        <strong>Fort:</strong> ${10 + level + greaterOf(character.mod('str'), character.mod('con')) + character.bonus.fort}<br />
        <strong>Reflex:</strong> ${10 + level + greaterOf(character.mod('dex'), character.mod('int')) + character.bonus.refl}<br />
        <strong>Will:</strong>  ${10 + level + greaterOf(character.mod('wis'), character.mod('cha')) + character.bonus.will}`;
      _id('traits').innerHTML = `
        <strong>Appearance:</strong><br />
        ${alpha.appearance}<br />
        ${beta.appearance}<br />
        <strong>Primary Ability:</strong> ${alpha.type.stat.toUpperCase()} | <strong>Secondary Ability:</strong> ${beta.type.stat.toUpperCase()}<br />
        Add +${alpha.type.bonus} to ${stringify(alpha.type.power)} overcharge &amp; add +${beta.type.bonus} to ${stringify(beta.type.power)} overcharge<br />
        <strong>Skills:</strong><br />
        Add +${alpha.skill.bonus} to <u>${stringify(alpha.skill.type)}</u> &amp; add + ${beta.skill.bonus} to <u>${stringify(beta.skill.type)}</u><br />
        <strong>Defense Bonuses:</strong><br />
        ${isThereDefense(alpha)}
        ${isThereDefense(beta)}
        <strong>Special:</strong><br />
        ${isThereExtra(alpha.levelOne)}
        ${isThereExtra(beta.levelOne)}`;
      _id('mainNovice').innerHTML = generate.power(alpha.powers.novice);
      _id('secondaryNovice').innerHTML = generate.power(beta.powers.novice);
  }
};

// ---- Random Character Generation!
// ---------------------------------
generate.defense = (defense) => {
  if (defense.type.length > 0 && Array.isArray(defense.type)) {
    for (let i = 0; i < defense.type.length; i++) {
      character.bonus[defense.type[i]] += Number(defense.bonus);
    }
  } else if (defense.type.length > 0) {
    character.bonus[defense.type] += Number(defense.bonus);
  }
};

generate.random = (origins) => {
  let alpha, beta;
  alpha = origin.random(origins);
  beta = origin.random(origins);
  if (alpha.name === beta.name) { beta = origins.special.human; }
  for (let i = 0; i < 6; i++) { character.ability[stats[i]] = threeDSix(); }
  if (alpha.type.stat === beta.type.stat) {
    character.ability[alpha.type.stat] = 20;
  } else {
    character.ability[alpha.type.stat] = 18;
    character.ability[beta.type.stat] = 16;
  }
  generate.defense(alpha.defense);
  generate.defense(beta.defense);
  let text = '<strong>Stats</strong><br />';
  for (let i = 0; i < stats.length; i++) {
    text += `<div class="stat-cell"><div class="ability-mod">${character.mod(stats[i])}</div><div class="ability-name">${stats[i].toUpperCase()}</div><div class="ability-score">${character.ability[stats[i]]}</div></div>`;
  }
  _id('ability-table').innerHTML = text;
  skill.assignment(alpha, beta);
  let level = Number(_id('level').value);
  levelUp(alpha, beta, level);
};

origin.random = (data) => {
  let book, number, origin;
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
  return data[book][origin];
};

reset = () => {
  _id('uber').innerHTML = '';
  _id('secondaryExpert').innerHTML = '';
  _id('secondaryUtility').innerHTML = '';
  _id('secondaryCritical').innerHTML = '';
  _id('mainExpert').innerHTML = '';
  _id('mutations').innerHTML = '<strong>Alpha Mutations:</strong> 1';
  _id('mainUtility').innerHTML = '';
  _id('mainCritical').innerHTML = '';
  _id('origins').innerHTML = '';
  _id('hitPoints').innerHTML = '';
  _id('bloodied').innerHTML = '';
  _id('defenses').innerHTML = '';
  _id('traits').innerHTML = '';
  _id('mainNovice').innerHTML = '';
  _id('secondaryNovice').innerHTML = '';
};

skill.assignment = (alpha, beta) => {
  for (let i = 0; i < skills.length; i++) {
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
  let text = '<strong>Skills</strong><br /><ul>';
  for (let i = 0; i < skills.length; i++) {
    text += `<li><span class="mono">${character.skills[skills[i]]}</span> ${skills[i]}</li>`;
  }
  text += '</ul>';
  _id('skill-table').innerHTML = text;
};

skill.origin = (originSkill) => {
  if (Array.isArray(originSkill.type)) {
    for (let i = 0; i < originSkill.type.length; i++) {
      character.skills[originSkill.type[i]] += Number(originSkill.bonus);
    }
  } else {
    character.skills[originSkill.type] += Number(originSkill.bonus);
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

// Render process:
getJSON(originsURL, function(data) {
  _id('load-animation').style.display = 'display';
  origins = data;
  generate.random(data);
  console.log('Character:');
  console.dir(character);
});
