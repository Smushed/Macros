//DAE Macro , Effect Value = @attributes.spelldc
if(!game.modules.get("advanced-macros")?.active) {ui.notifications.error("Please enable the Advanced Macros module") ;return;}

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);

const DAEItem = lastArg.efData.flags.dae.itemData
const saveData = DAEItem.data.save
const DC = args[1]

if (args[0] === "each") {
    new Dialog({
        title: "Use action to make a wisdom save to end Irresistible Dance?",
        buttons: {
            one: {
                label: "Yes",
                callback: async () => {
                    const flavor = `${CONFIG.DND5E.abilities[saveData.ability]} DC${DC} ${DAEItem?.name || ""}`;
                    let saveRoll = (await tactor.rollAbilitySave(saveData.ability, { flavor })).total;

                    if (saveRoll >= DC) {
                        tactor.deleteEmbeddedEntity("ActiveEffect", lastArg.effectId);
                    }
                    if (saveRoll < DC) {
                        ChatMessage.create({ content: `${tactor.name} fails the save` });
                    }
                }
            },
            two: {
                label: "No",
                callback: () => {
                }
            }
        }
    }).render(true);
}