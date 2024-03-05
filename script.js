let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Palito"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'Palito', power: 5 },
  { name: 'Machete', power: 30 },
  { name: 'Martillo de clavos', power: 50 },
  { name: 'Espada', power: 100 }
];
const monsters = [
  {
    name: "Flaver",
    level: 2,
    health: 15
  },
  {
    name: "Barrito",
    level: 8,
    health: 60
  },
  {
    name: "Dragón",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Ve a la tienda", "Ve a la cueva", "Pelea con el Dragón"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Estas en la plaza del pueblo. Hay una señal que pone \"Tienda\"."
  },
  {
    name: "store",
    "button text": ["Vida (10 de oro)", "Arma (30 de oro)", "Plaza del pueblo"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Has entrado a la tienda."
  },
  {
    name: "cave",
    "button text": ["Pelea contra Flaver", "Pelea contra Barrito", "Plaza del pueblo"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Entras a la cueva, aqui hay monstruos."
  },
  {
    name: "fight",
    "button text": ["Ataca", "Esquiva", "Corre por tu vida"],
    "button functions": [attack, dodge, goTown],
    text: "Estas peleando contra un monstruo."
  },
  {
    name: "kill monster",
    "button text": ["Plaza del pueblo", "Plaza del pueblo", "Plaza del pueblo"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'El monstruo grita: "Arg!" mientra muere. Ganaste experiencia y encontraste oro.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Has muerto. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "¡Has matado al dragón! ¡Has liberado al pueblo camarada! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "¡Sácame de aquí Jesus!"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Has encontrado un juego prohibido. Escoge un número. Se ecogerán 10 números aleatorios entre el 1 y el 10. Si tu número esta entre alguno, ganas, si no me quedaré parte de tu vida."
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Ha robar carteras que no hay pasta para la vida.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Ahora tienes un@ " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " En tu inventario hay: " + inventory;
    } else {
      text.innerText = "Tu pobresa no te permite comprar armas.";
    }
  } else {
    text.innerText = "¡Actualmente tienes el arma más poderosa!";
    button2.innerText = "Vende tu arma en BackMarket por 15 de oro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Has vendido un@ " + currentWeapon + ".";
    text.innerText += " En tu inventario hay: " + inventory;
  } else {
    text.innerText = "Son malos tiempos para quedarte sin armas Charlie ¡No vendas la última!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "El " + monsters[fighting].name + " ataca.";
  text.innerText += " Tu atacas con tu " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Perdiste.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Tu " + inventory.pop() + " se ha rompido.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Has esquivado el ataque de " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Palito"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Has escogido " + guess + ". Aqui estan los números aleatorios:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Correcto! Has ganado 20 de oro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Mal! Pierdes 10 de vida!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}