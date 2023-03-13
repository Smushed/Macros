const castWho = (xScale) => {
  return {
    file: "https://assets.forge-vtt.com/bazaar/modules/animated-spell-effects-cartoon/assets/spell-effects/cartoon/fire/fire_blast_RAY_02.webm",
    anchor: {
      x: -0.08,
      y: 0.5,
    },
    speed: 1,
    angle: 0,
    scale: {
      x: xScale,
      y: 0.2,
    },
  };
};

const onlyOneSelected = (tokens) => {
  if (tokens.length === 0 || tokens.length > 1) {
    ui.notifications.error("Please select only one token");
    return false;
  }
  return true;
};

const FireBoltMessage = `<div class="message-content">
  <div class="dnd5e chat-card item-card" data-actor-id="Zbj4KV2DwyM17GyO" data-item-id="3fHiXZ4ihMBUsn7Z" data-spell-level="0">
    <header class="card-header flexrow">
      <img src="icons/magic/fire/projectile-fireball-smoke-orange.webp" title="Fire Bolt" width="36" height="36">
      <h3 class="item-name">Fire Bolt</h3>
    </header>

    <div class="card-content">
      <p>You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.</p>
      <p>This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).</p>
    </div>

    <footer class="card-footer">
      <span>Cantrip</span>
      <span>V, S</span>
      <span>1 Action</span>
      <span>120 Feet</span>
    </footer>
  </div>
</div>`;

const animateFireBolt = (token, target, t) => {
  let scale;
  let xDist = token.x - target.x;
  let yDist = token.y - target.y;

  if (token.x === target.x) {
    scale = yDist / 1100;
  } else if (token.y === target.y) {
    scale = xDist / 1100;
  } else {
    scale = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)) / 1100;
  }
  canvas.specials.drawSpecialToward(castWho(Math.abs(scale)), token, t);
};

const sendMessage = (message) => {
  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({ token: token._actor }),
    content: message,
  });
};

const rollAttackAndDamage = (charSysDetails, target) => {
  const level = charSysDetails.details.level;
  const spellMod =
    charSysDetails.abilities[charSysDetails.attributes.spellcasting].mod;
  const attackRoll = new Roll(`1d20+${spellMod}`).evaluate({ async: false });
  attackRoll.toMessage({
    rollMode: "roll",
    speaker: { alias: token.document.name },
  });

  if (attackRoll._total >= target.document._actor.system.attributes.ac.value) {
    let damageDice = 1;
    if (level >= 17) {
      damageDice = 4;
    } else if (level >= 11) {
      damageDice = 3;
    } else if (level >= 5) {
      damageDice = 2;
    }

    const damageRoll = new Roll(`${damageDice}d10`).evaluate({ async: false });
    damageRoll.toMessage({
      rollMode: "roll",
      speaker: { alias: token.document.name },
    });
    const { value } = target.document._actor.system.attributes.hp;
    let dmgVal = damageRoll._total;

    let dmgMsg = `Firebolt hit ${target.document.name} `;
    if (target.document._actor.system.traits.dr.value.has("fire")) {
      dmgVal = Math.floor(dmgVal / 2);
      dmgMsg += `for ${dmgVal} fire damage after resistance!`;
    } else {
      dmgMsg += `for ${dmgVal} fire damage!`;
    }
    sendMessage(dmgMsg);

    if (value - dmgVal <= 0) {
      target.document._actor.system.attributes.hp.value = 0;
      sendMessage(`${target.document.name} is dead, scorched!`);
    } else {
      target.document._actor.system.attributes.hp.value -= dmgVal;
    }
  }
};

const castFireBolt = () => {
  const tokens = canvas.tokens.controlled;

  if (!onlyOneSelected(tokens)) {
    return;
  }

  const token = tokens[0];

  game.user.targets.forEach((i, t) => {
    if (token.document.name === i.document.name) {
      ui.notifications.error("Cannot target yourself!");
      return;
    }
    sendMessage(FireBoltMessage);
    rollAttackAndDamage(token.document._actor.system, i);
    animateFireBolt(token, i, t);
  });
};

castFireBolt();
