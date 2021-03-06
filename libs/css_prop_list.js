let fontManager = require('font-manager');
let fs = require('fs');
let _ = require('lodash');

const defaults = require('../resources/css_prop_list_defaults.json');
const all = require('../resources/css_prop_list.json');
const presets = require('../_presets/defaults.json');
var ins_fontlist = fs.readdirSync('resources/fonts');
var web_fontlist = require('../resources/web_font_list_defaults.json');
var sys_fontlist = fontManager.getAvailableFontsSync();
var fontlist = null

module.exports.setSystemFonts = function () {
  sys_fontlist = _.groupBy(sys_fontlist,(font)=>font.family);
  fontlist = {"browser fonts": ins_fontlist, "default fonts":web_fontlist, "system fonts":Object.keys(sys_fontlist) }
  defaults.typography.g_1[0].options = fontlist;
}

module.exports.list = {
  defaults: defaults,
  all: all,
  fontList: fontlist,
}

module.exports.presets = presets.map((preset)=>{
  let presetIcon = document.createElement('span');

  presetIcon.className = 'preset-wrapper label';
  presetIcon.innerHTML = preset.icon;

  _.each(preset.rules,(rule)=>{
    presetIcon.style[rule.property] = rule.value;
  })

  presetIcon.setAttribute('data', JSON.stringify(preset));

  return presetIcon;
});
