//DAE Macro , Effect Value = @damage


const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId)


let amount = args[1]
/**
 * Update HP and Max HP to roll formula, save result as flag
 */
if (args[0] === "on") {
        let hpMax = tactor.data.data.attributes.hp.max;
        let hp = tactor.data.data.attributes.hp.value;
        await tactor.update({"data.attributes.hp.max": (hpMax + amount), "data.attributes.hp.value": (hp + amount) });
        ChatMessage.create({content: `${target.name} gains ${amount} Max HP`});
        await DAE.setFlag(tactor, 'HeroesFeast', amount);
};

// Remove Max Hp and reduce HP to max if needed
if (args[0] === "off") {
        let amountOff = await DAE.getFlag(tactor, 'HeroesFeast');
        let hpMax = tactor.data.data.attributes.hp.max;
        let newHpMax = hpMax - amountOff;
        let hp = tactor.data.data.attributes.hp.value > newHpMax ? newHpMax : tactor.data.data.attributes.hp.value
        await tactor.update({"data.attributes.hp.max": newHpMax, "data.attributes.hp.value" : hp });
        ChatMessage.create({content: target.name + "'s Max HP returns to normal"});
        DAE.unsetFlag(tactor, 'HeroesFeast');
}