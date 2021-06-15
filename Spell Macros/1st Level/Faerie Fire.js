// DAE macro, just call the macro, nothing else
// setup the spell as normal
if (!game.modules.get("advanced-macros")?.active) {ui.notifications.error("Please enable the Advanced Macros module") ;return;}

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
let target = canvas.tokens.get(lastArg.tokenId)

const DAEItem = lastArg.efData.flags.dae.itemData
const saveData = DAEItem.data.save

if (args[0] === "on") {

    new Dialog({
        title: `Choose the colour for Faerie Fire on ${target.name}`,
        buttons: {
            one: {
                label: "Blue",
                callback: async () => {
                    let color = target.data.lightColor ? target.data.lightColor : "";
                    let dimLight = target.data.dimLight ? target.data.dimLight : "0"
                    await DAE.setFlag(target, 'FaerieFire', {
                        color: color,
                        alpha: target.data.lightAlpha,
                        dimLight: dimLight
                    });
                    target.update({ "lightColor": "#5ab9e2", "lightAlpha": 0.64, "dimLight": "10", "lightAnimation.intensity" : 3 })
                }
            },
            two: {
                label: "Green",
                callback: async () => {
                    let color = target.data.lightColor ? target.data.lightColor : "";
                    let dimLight = target.data.dimLight ? target.data.dimLight : "0"
                    await DAE.setFlag(target, 'FaerieFire', {
                        color: color,
                        alpha: target.data.lightAlpha,
                        dimLight: dimLight
                    });
                    target.update({ "lightColor": "#55d553", "lightAlpha": 0.64, "dimLight": "10","lightAnimation.intensity" : 3  })
                }
            },
            three: {
                label: "Purple",
                callback: async () => {
                    let color = target.data.lightColor ? target.data.lightColor : "";
                    let dimLight = target.data.dimLight ? target.data.dimLight : "0"
                    await DAE.setFlag(target, 'FaerieFire', {
                        color: color,
                        alpha: target.data.lightAlpha,
                        dimLight: dimLight
                    });
                    target.update({ "lightColor": "#844ec6", "lightAlpha": 0.64, "dimLight": "10","lightAnimation.intensity" : 3  })
                }
            }
        }
    }).render(true);
}

if (args[0] === "off") {
    let { color, alpha, dimLight } = await DAE.getFlag(target, "FaerieFire")
    target.update({ "lightColor": color, "lightAlpha": alpha, "dimLight": dimLight })
    DAE.unsetFlag(tactor, "FaerieFire")
}