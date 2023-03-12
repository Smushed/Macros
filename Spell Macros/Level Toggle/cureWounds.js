const castWho = (xCord) => {
  return {
    file: "modules/animated-spell-effects-cartoon/spell-effects/cartoon/level%2001/cure_wounds_blue_800x800.webm",
    anchor: {
      x: xCord,
      y: 0.5,
    },
    speed: 2,
    angle: 0,
    scale: {
      x: 0.25,
      y: 0.25,
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

const hasSpellSlots = (token, spellLevel) => {
  if (token.document._actor.system.spells[`spell${spellLevel}`].value === 0) {
    ui.notifications.error(
      `${token.document.name} doesn't have any level ${spellLevel} slots available`
    );
    return false;
  }
  return true;
};

const healMessage = (
  spellLevel
) => `<div class="dnd5e chat-card item-card" data-actor-id="FnPG0kVkxCUolVoP" data-item-id="F63ttaA2n3sVBc7i" data-spell-level=${spellLevel}>
    <header class="card-header flexrow">
        <img src="icons/magic/life/heart-cross-green.webp" title="Cure Wounds" width="36" height="36">
        <h3 class="item-name">Cure Wounds</h3>
    </header>
    <div class="card-content" style="display: block;">
        <p>A creature you touch regains a number of hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.</p>
        <p><em>At Higher Levels.</em> When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 + spellcasting ability modifier for each slot level above 1st.</p>
    </div>
    <footer class="card-footer">
        <span>${spellLevel} Level</span>
        <span>V, S</span>
        <span>1 Action</span>
    </footer>
</div>`;

const addHp = (amount, actor) => {
  const { value, max } = actor.system.attributes.hp;
  console.log({ amount, value, max });
  if (amount + value > max) {
    actor.system.attributes.hp.value = max;
  } else {
    actor.system.attributes.hp.value = amount + value;
  }
  console.log({ actor });
};

const castSpell = () => {
  const tokens = canvas.tokens.controlled;

  if (!onlyOneSelected(tokens)) {
    return;
  }

  const token = tokens[0];

  new Dialog({
    title: "Casting Cure Wounds",
    content: `
          <form class="flexcol">
            <h2>What Level are you casting at?</h2>
            <div class="form-group" style="margin-bottom: 15px;">
              <label for="spellLevel">Spell Level:</label>
              <select id="spellLevel">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                </select>
            </div>
          </form>
        `,
    //select element type
    buttons: {
      yes: {
        icon: '<i class="fas fa-bolt"></i>',
        label: "Select",
        callback: async (html) => {
          const spellLevel = html.find("#spellLevel").val();
          if (hasSpellSlots(token, spellLevel)) {
            ChatMessage.create({
              user: game.user._id,
              speaker: ChatMessage.getSpeaker({ token: token._actor }),
              content: healMessage(spellLevel),
            });

            const roll = new Roll(
              `${2 + (spellLevel - 1)}d8+${spellLevel * 2}`
            ).evaluate({ async: false });
            roll.toMessage({
              rollMode: "roll",
              speaker: { alias: token.document.name },
            });
            console.log(roll._total);
            //--token.document._actor.system.spells[`spell${spellLevel}`].value;

            game.user.targets.forEach((i, t) => {
              addHp(roll._total, i.document._actor);
              if (tokens[0].document.name === i.document.name) {
                canvas.specials.drawSpecialToward(castWho(0.5), tokens[0], t);
              } else {
                canvas.specials.drawSpecialToward(castWho(-0.1), tokens[0], t);
              }
            });
          }
        },
      },
    },
  }).render(true);
};

castSpell();
