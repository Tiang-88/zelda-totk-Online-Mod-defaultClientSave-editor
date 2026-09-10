(function () {
  'use strict';

  const CATALOG = window.TOTK_CATALOG || { categories: {}, enumHashes: {} };
  const H = CATALOG.enumHashes || {};
  const reverseHashes = Object.fromEntries(Object.entries(H).map(([name, value]) => [String(value), name]));
  const DEFAULT_PATH = 'Server/Resources/SaveServer/defaultClientSave.ktml';
  const PRESET_QUANTITY = 300;

  const categoryInfo = {
    weapons: {
      label: '武器 Weapons', noun: 'weapon', section: 'Pouch.Weapon', validNum: 'Pouch.Weapon.ValidNum',
      fields: [
        ['durability', 'Pouch.Weapon.Content.Life', 'number', 'Durability'],
        ['modifier', 'Pouch.Weapon.Content.Effect.Type', 'equipment-modifier', 'Modifier'],
        ['modifierValue', 'Pouch.Weapon.Content.Effect.Value', 'number', 'Modifier value'],
        ['fuseId', 'Pouch.Weapon.Content.Combined.Name', 'item', 'Fusion'],
        ['fuseDurability', 'Pouch.Weapon.Content.Combined.Life', 'number', 'Fuse durability'],
        ['extraDurability', 'Pouch.Weapon.Content.ExtraLife', 'number', 'Current fuse'],
        ['recordExtraDurability', 'Pouch.Weapon.Content.RecordExtraLife', 'number', 'Max fuse']
      ]
    },
    bows: {
      label: '弓 Bows', noun: 'bow', section: 'Pouch.Bow', validNum: 'Pouch.Bow.ValidNum',
      fields: [
        ['durability', 'Pouch.Bow.Content.Life', 'number', 'Durability'],
        ['modifier', 'Pouch.Bow.Content.Effect.Type', 'bow-modifier', 'Modifier'],
        ['modifierValue', 'Pouch.Bow.Content.Effect.Value', 'number', 'Modifier value']
      ]
    },
    shields: {
      label: '盾牌 Shields', noun: 'shield', section: 'Pouch.Shield', validNum: 'Pouch.Shield.ValidNum',
      fields: [
        ['durability', 'Pouch.Shield.Content.Life', 'number', 'Durability'],
        ['modifier', 'Pouch.Shield.Content.Effect.Type', 'shield-modifier', 'Modifier'],
        ['modifierValue', 'Pouch.Shield.Content.Effect.Value', 'number', 'Modifier value'],
        ['fuseId', 'Pouch.Shield.Content.Combined.Name', 'item', 'Fusion'],
        ['fuseDurability', 'Pouch.Shield.Content.Combined.Life', 'number', 'Fuse durability'],
        ['extraDurability', 'Pouch.Shield.Content.ExtraLife', 'number', 'Current fuse']
      ]
    },
    armors: {
      label: '防具 Armor', noun: 'armor', section: 'Pouch.Armor',
      fields: [['dyeColor', 'Pouch.Armor.Content.ColorVariation', 'dye', 'Dye color']]
    },
    arrows: {
      label: '箭矢 Arrows', noun: 'arrow stack', section: 'Pouch.Arrow',
      fields: [['quantity', 'Pouch.Arrow.Content.StockNum', 'number', 'Quantity']]
    },
    materials: {
      label: '材料 Materials', noun: 'material', section: 'Pouch.Material',
      fields: [['quantity', 'Pouch.Material.Content.StockNum', 'number', 'Quantity'], ['getOrder', 'Pouch.Material.Content.GetOrder', 'number', 'Get order'], ['useOrder', 'Pouch.Material.Content.UseOrder', 'number', 'Use order']]
    },
    food: {
      label: '料理 Food', noun: 'food', section: 'Pouch.Food',
      fields: [
        ['quantity', 'Pouch.Food.Content.StockNum', 'number', 'Quantity'],
        ['heartsHeal', 'Pouch.Food.Content.LifeRecover', 'number', 'Heart quarters heal'],
        ['effect', 'Pouch.Food.Content.Effect.Type', 'food-effect', 'Food effect'],
        ['effectMultiplier', 'Pouch.Food.Content.Effect.Level', 'number', 'Effect level'],
        ['effectTime', 'Pouch.Food.Content.Effect.Time', 'number', 'Duration (seconds)'],
        ['price', 'Pouch.Food.Content.Price', 'number', 'Price']
      ], recipe: 'Pouch.Food.Content.MaterialName'
    },
    devices: {
      label: '左纳乌装置 Zonai devices', noun: 'device', section: 'Pouch.SpecialParts',
      fields: [['quantity', 'Pouch.SpecialParts.Content.StockNum', 'number', 'Quantity'], ['useOrder', 'Pouch.SpecialParts.Content.UseOrder', 'number', 'Use order']]
    },
    abilities: {
      label: '特殊能力 Abilities', noun: 'ability', section: 'Pouch.SpecialPower',
      fields: []
    }
  };

  const catalogName = Object.fromEntries(Object.values(CATALOG.categories || {}).flat().map(item => [item.id, item.name]));
  const catalogByCategory = Object.fromEntries(Object.entries(CATALOG.categories || {}).map(([category, items]) => [category, Object.fromEntries(items.map(item => [item.id, item]))]));
  const catalogIdByName = Object.fromEntries(Object.values(CATALOG.categories || {}).flat().map(item => [item.name.toLowerCase(), item.id]));
  const enumOptions = {
    'equipment-modifier': [['None', 'No bonus'], ['DurabilityUp', 'Durability up'], ['DurabilityUpPlus', 'Durability up ++'], ['AttackUp', 'Attack up'], ['AttackUpPlus', 'Attack up ++'], ['FinishBlow', 'Critical hit'], ['LongThrow', 'Throw up']],
    'bow-modifier': [['None', 'No bonus'], ['DurabilityUp', 'Durability up'], ['DurabilityUpPlus', 'Durability up ++'], ['AttackUp', 'Attack up'], ['AttackUpPlus', 'Attack up ++'], ['RapidFire', 'Quick shot'], ['FiveWay', 'Five-way shot']],
    'shield-modifier': [['None', 'No bonus'], ['DurabilityUp', 'Durability up'], ['DurabilityUpPlus', 'Durability up ++'], ['GuardUp', 'Block up'], ['GuardUpPlus', 'Block up ++']],
    dye: [['None', 'Default color'], ['Blue', 'Blue'], ['Red', 'Red'], ['Yellow', 'Yellow'], ['White', 'White'], ['Black', 'Black'], ['Purple', 'Purple'], ['Green', 'Green'], ['LightBlue', 'Light blue'], ['Navy', 'Navy'], ['Orange', 'Orange'], ['Pink', 'Pink'], ['Crimson', 'Crimson'], ['LightYellow', 'Light yellow'], ['Brown', 'Brown'], ['Gray', 'Gray']],
    'food-effect': [['None', 'None'], ['ResistHot', 'Heat resistance'], ['ResistBurn', 'Flame guard'], ['ResistCold', 'Cold resistance'], ['ResistElectric', 'Shock resistance'], ['ResitLightning', 'Lightning resistance'], ['ResistFreeze', 'Freeze resistance'], ['SwimSpeedUp', 'Swim speed up'], ['ClimbSpeedUp', 'Climb speed up'], ['AttackUp', 'Attack up'], ['AttackUpCold', 'Cold weather attack'], ['AttackUpHot', 'Hot weather attack'], ['AttackUpThunderstorm', 'Stormy weather attack'], ['QuietnessUp', 'Stealth up'], ['SandMoveUp', 'Sand speed up'], ['SnowMoveUp', 'Snow speed up'], ['DefenseUp', 'Defense up'], ['AllSpeed', 'Speed up'], ['MiasmaGuard', 'Gloom resistance'], ['LifeMaxUp', 'Extra heart'], ['StaminaRecover', 'Stamina recovery'], ['ExStaminaMaxUp', 'Extra stamina'], ['LifeRepair', 'Gloom recovery'], ['DivingMobilityUp', 'Skydive mobility up'], ['NotSlippy', 'Slip resistance'], ['LightEmission', 'Glow'], ['RupeeGuard', 'Rupee guard'], ['SwordBeamUp', 'Sword beam up'], ['NightMoveSpeedUp', 'Night movement speed'], ['DecreaseWallJumpStamina', 'Wall jump stamina'], ['DecreaseChargeAttackStamina', 'Charge attack stamina'], ['NoBurning', 'No burning'], ['NoFallDamage', 'No fall damage'], ['NoSlip', 'No slip'], ['DecreaseZonauEnergy', 'Zonai energy'], ['ZonauEnergyHealUp', 'Zonai energy recovery'], ['MiasmaDefenseUp', 'Gloom defense'], ['ChargePowerUpCold', 'Cold charge power'], ['ChargePowerUpHot', 'Hot charge power'], ['ChargePowerUpThunderstorm', 'Stormy charge power'], ['LightFootprint', 'Light footprint']]
  };

  const presetItems = {
    weapons: [
      ['Master Sword', 40], ['Gloom Sword', -1], ["Royal Guard's Sword", -1], ['Scimitar of the Seven', -1],
      ['Royal Broadsword', -1], ['White Sword of the Sky', -1], ["Knight's Broadsword", -1], ['Gerudo Scimitar', -1],
      ['Sword of the Hero', -1], ["Forest Dweller's Sword", -1], ['Sea-Breeze Boomerang', -1], ['Eightfold Blade', -1],
      ['Feathered Edge', -1], ["Soldier's Broadsword", -1], ['Zora Sword', -1], ['Mighty Zonaite Sword', -1],
      ['Strong Zonaite Sword', -1], ['Zonaite Sword', -1], ['Magic Rod', -1]
    ],
    bows: [
      ['Savage Lynel Bow', 12], ['Great Eagle Bow', -1], ["Demon King's Bow", 42], ['Royal Bow', -1],
      ['Steel Lizal Bow', -1], ['Dusk Bow', -1], ['Zonaite Bow', -1], ["Knight's Bow", -1],
      ['Strengthened Lizal Bow', -1], ['Gerudo Bow', -1], ['Dragonbone Boko Bow', -1], ['Mighty Construct Bow', -1],
      ['Strong Construct Bow', -1], ['Construct Bow', -1]
    ],
    shields: [
      ['Hylian Shield', 12], ["Royal Guard's Shield", -1], ['Sea-Breeze Shield', -1], ['Savage Lynel Shield', -1],
      ['Royal Shield', -1], ['Mighty Zonaite Shield', -1], ['Daybreaker', -1], ["Knight's Shield", -1],
      ['Steel Lizal Shield', -1], ['Radiant Shield', -1], ['Forest Dweller\'s Shield', -1], ['Gerudo Shield', -1],
      ['Strong Zonaite Shield', -1], ['Dragonbone Boko Shield', -1], ['Zora Shield', -1], ["Shield of the Mind's Eye", -1],
      ['Kite Shield', -1], ['Zonaite Shield', -1], ["Hunter's Shield", -1], ["Fisherman's Shield", -1]
    ],
    armors: [
      'Hylian Hood ★★★★', 'Hylian Hood (lowered) ★★★★', 'Hylian Tunic ★★★★', 'Hylian Trousers ★★★★',
      "Soldier's Helm ★★★★", "Soldier's Armor ★★★★", "Soldier's Greaves ★★★★", 'Snowquill Headdress ★★★★',
      'Snowquill Tunic ★★★★', 'Snowquill Trousers ★★★★', 'Flamebreaker Helm ★★★★', 'Flamebreaker Armor ★★★★',
      'Flamebreaker Boots ★★★★', 'Zora Helm ★★★★', 'Zora Armor ★★★★', 'Zora Greaves ★★★★',
      'Desert Voe Headband ★★★★', 'Desert Voe Spaulder ★★★★', 'Desert Voe Trousers ★★★★', 'Rubber Helm ★★★★',
      'Rubber Armor ★★★★', 'Rubber Tights ★★★★', 'Stealth Mask ★★★★', 'Stealth Chest Guard ★★★★',
      'Stealth Tights ★★★★', "Climber's Bandanna ★★★★", 'Climbing Gear ★★★★', 'Climbing Boots ★★★★',
      'Barbarian Helm ★★★★', 'Barbarian Armor ★★★★', 'Barbarian Leg Wraps ★★★★', 'Radiant Mask ★★★★',
      'Radiant Shirt ★★★★', 'Radiant Tights ★★★★', 'Royal Guard Cap ★★★★', 'Royal Guard Uniform ★★★★',
      'Royal Guard Boots ★★★★', 'Froggy Sleeve ★★★★', 'Glide Mask ★★★★', 'Glide Shirt ★★★★',
      'Glide Tights ★★★★', 'Hood of the Depths ★★★★', 'Tunic of the Depths ★★★★', 'Gaiters of the Depths ★★★★',
      "Miner's Mask ★★★★", "Miner's Top ★★★★", "Miner's Trousers ★★★★", 'Mystic Headpiece', 'Mystic Robe',
      'Mystic Trousers', 'Ember Headdress ★★★★', 'Ember Shirt ★★★★', 'Ember Trousers ★★★★',
      'Charged Headdress ★★★★', 'Charged Shirt ★★★★', 'Charged Trousers ★★★★', 'Frostbite Headdress ★★★★',
      'Frostbite Shirt ★★★★', 'Frostbite Trousers ★★★★', 'Yiga Mask ★★★★', 'Yiga Armor ★★★★',
      'Yiga Tights ★★★★', 'Vah Medoh Divine Helm ★★★★', 'Vah Rudania Divine Helm ★★★★', 'Vah Ruta Divine Helm ★★★★',
      'Vah Naboris Divine Helm ★★★★', 'Zonaite Helm ★★★★', 'Zonaite Waistguard ★★★★', 'Zonaite Shin Guards ★★★★',
      'Diamond Circlet ★★★★', 'Ruby Circlet ★★★★', 'Sapphire Circlet ★★★★', 'Topaz Earrings ★★★★',
      'Opal Earrings ★★★★', 'Amber Earrings ★★★★', 'Well-Worn Hair Band', 'Cece Hat', 'Lightning Helm',
      'Sand Boots ★★★★', 'Snow Boots ★★★★', 'Bokoblin Mask', 'Horriblin Mask', 'Moblin Mask', 'Lizalfos Mask',
      'Lynel Mask', 'Tunic of Memories ★★★★', "Champion's Leather ★★★★", 'Island Lobster Shirt', "Ravio's Hood",
      "Zant's Helmet", "Midna's Helmet", "Majora's Mask", 'Korok Mask', "Tingle's Hood", 'Phantom Helmet',
      'Phantom Armor', 'Phantom Greaves', 'Evil Spirit Mask', 'Evil Spirit Armor', 'Evil Spirit Greaves',
      "Sheik's Mask ★★★★", 'Dark Hood', 'Dark Tunic', 'Dark Trousers', 'Fierce Deity Mask ★★★★',
      'Fierce Deity Armor ★★★★', 'Fierce Deity Boots ★★★★', 'Mask of Awakening ★★★★', 'Tunic of Awakening ★★★★',
      'Trousers of Awakening ★★★★', 'Cap of the Wild ★★★★', 'Tunic of the Wild ★★★★', 'Trousers of the Wild ★★★★',
      'Cap of the Hero ★★★★', 'Tunic of the Hero ★★★★', 'Trousers of the Hero ★★★★', 'Cap of Time ★★★★',
      'Tunic of Time ★★★★', 'Trousers of Time ★★★★', 'Cap of the Wind ★★★★', 'Tunic of the Wind ★★★★',
      'Trousers of the Wind ★★★★', 'Cap of Twilight ★★★★', 'Tunic of Twilight ★★★★', 'Trousers of Twilight ★★★★',
      'Cap of the Sky ★★★★', 'Tunic of the Sky ★★★★', 'Trousers of the Sky ★★★★'
    ]
  };

  const state = {
    document: null,
    sourceName: '',
    dirty: false,
    currentView: 'status',
    inventoryFilter: 'all',
    inventorySearch: '',
    variableSearch: ''
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const getPath = (path, fallback) => {
    if (!state.document) return fallback;
    const parts = path.split('.');
    let value;
    for (const section of Object.values(state.document)) {
      if (section && typeof section === 'object' && Object.prototype.hasOwnProperty.call(section, path)) return section[path];
    }
    return fallback;
  };
  const setPath = (path, value) => {
    for (const section of Object.values(state.document)) {
      if (section && typeof section === 'object' && Object.prototype.hasOwnProperty.call(section, path)) {
        section[path] = value;
        return true;
      }
    }
    return false;
  };
  function bundledInitialPosition() {
    const current = getPath('World_PlayerPos', null);
    if (typeof window.DEFAULT_KTML !== 'string' || !window.KTML || typeof window.KTML.parse !== 'function') {
      return current && typeof current === 'object' ? { ...current } : null;
    }
    try {
      const defaultDocument = window.KTML.parse(window.DEFAULT_KTML);
      for (const section of Object.values(defaultDocument)) {
        const position = section && section.World_PlayerPos;
        if (position && typeof position === 'object' && ['x', 'y', 'z'].every(axis => typeof position[axis] === 'number')) {
          return { x: position.x, y: position.y, z: position.z };
        }
      }
    } catch (error) {
      // Fall back to the currently loaded document if the embedded template
      // cannot be parsed.
    }
    return current && typeof current === 'object' ? { ...current } : null;
  }
  const ensurePath = (sectionName, path, value) => setPath(path, value) || (state.document[sectionName] && (state.document[sectionName][path] = value, true));
  const allValues = () => Object.entries(state.document || {}).flatMap(([sectionName, section]) => Object.entries(section || {}).map(([path, value]) => ({ sectionName, path, value })));
  const hashFor = name => Object.prototype.hasOwnProperty.call(H, name) ? H[name] : 3069107721;
  const nameForId = id => catalogName[id] || id || '空槽位';
  const itemIcon = (category, id) => catalogByCategory[category]?.[id]?.icon || 'zelda-totk/assets/item_icons/unknown.png';
  const categoryArray = (info, property) => getPath(property, []);
  const namePath = info => `${info.section}.Content.Name`;
  const itemCount = info => categoryArray(info, namePath(info)).filter(Boolean).length;
  const capacity = info => info.validNum ? Number(categoryArray(info, info.validNum)[0] || 0) : null;

  // The game uses Pouch.Arrow.EquipIndex to decide which arrow slot is
  // currently available.  A stack with a name and quantity but an EquipIndex
  // of -1 is visible in the pouch yet cannot be fired (the game reports that
  // there are no wooden arrows).  Keep this derived field in sync whenever
  // the arrow inventory changes, and repair old files on load as well.
  function repairArrowEquipIndex() {
    const names = getPath('Pouch.Arrow.Content.Name', []);
    const equipIndex = getPath('Pouch.Arrow.EquipIndex', []);
    if (!Array.isArray(names) || !Array.isArray(equipIndex) || !equipIndex.length) return false;

    const firstActive = names.findIndex(Boolean);
    if (firstActive === -1) {
      if (equipIndex[0] !== -1) {
        equipIndex[0] = -1;
        return true;
      }
      return false;
    }

    const current = Number(equipIndex[0]);
    if (!Number.isInteger(current) || current < 0 || !names[current]) {
      equipIndex[0] = firstActive;
      return true;
    }
    return false;
  }

  function itemIdForName(category, name) {
    return (CATALOG.categories[category] || []).find(item => item.name === name)?.id || '';
  }

  function emptyValueForField(type) {
    if (type === 'number') return -1;
    if (type === 'item') return '';
    return hashFor('None');
  }

  function clearCategory(category) {
    const info = categoryInfo[category];
    const names = categoryArray(info, namePath(info));
    if (!Array.isArray(names)) throw new Error(`${info.label} 缺少物品名称数组`);
    names.fill('');
    for (const [, path, type] of info.fields) {
      const values = categoryArray(info, path);
      if (Array.isArray(values)) values.fill(emptyValueForField(type));
    }
    if (info.recipe) {
      const recipe = categoryArray(info, info.recipe);
      if (Array.isArray(recipe)) recipe.fill('');
    }
  }

  function writePresetCategory(category, entries) {
    const info = categoryInfo[category];
    const names = categoryArray(info, namePath(info));
    if (entries.length > names.length) throw new Error(`${info.label} 需要 ${entries.length} 个槽位，但文件只有 ${names.length} 个`);
    clearCategory(category);

    entries.forEach((entry, index) => {
      const name = typeof entry === 'string' ? entry : entry[0];
      const overrides = typeof entry === 'string' ? {} : entry[1];
      const id = itemIdForName(category, name);
      if (!id) throw new Error(`${info.label} 的目录中找不到 ${name}`);
      names[index] = id;
      for (const [property, path, type] of info.fields) {
        const values = categoryArray(info, path);
        if (!Array.isArray(values)) continue;
        if (overrides && typeof overrides === 'object' && Object.prototype.hasOwnProperty.call(overrides, property)) values[index] = overrides[property];
        else if (type === 'number') values[index] = property === 'quantity' ? PRESET_QUANTITY : property === 'heartsHeal' ? 4 : property === 'price' ? 1 : property === 'durability' ? -1 : property === 'getOrder' || property === 'useOrder' ? index : -1;
        else if (type === 'item') values[index] = '';
        else values[index] = hashFor('None');
      }
    });
  }

  function applyRichInventoryPreset() {
    if (!state.document) return;
    const total = presetItems.weapons.length + presetItems.bows.length + presetItems.shields.length + presetItems.armors.length +
      (CATALOG.categories.materials || []).length + (CATALOG.categories.devices || []).length + 1;
    if (!window.confirm(`将覆盖当前的武器、弓、箭、盾、防具、材料和左纳乌装置，共写入 ${total} 项物资。是否继续？`)) return;

    try {
      setPath('PlayerStatus.CurrentRupee', 999999);
      setPath('PlayerStatus.MaxLife', 160);
      setPath('PlayerStatus.Life', 100);
      setPath('PlayerStatus.MaxStamina', 3000);
      setPath('PlayerStatus.MaxEnergy', 48000);
      ensurePath('UInt', 'Playtime', 3972); // 1:06:12
      ensurePath('Int', 'HorseInnMemberPoint', 0);
      // Preserve the exact raw Vector3 from defaultClientSave.ktml.  The
      // browser UI's XYZ conversion is not used for this preset.
      const presetPosition = bundledInitialPosition();
      if (presetPosition) {
        setPath('World_PlayerPos', presetPosition);
        setPath('PlayerStatus.SavePos', { ...presetPosition });
      }
      const startPoint = getPath('unk3294163435', []);
      if (Array.isArray(startPoint)) {
        startPoint.fill('');
        startPoint[0] = 'StartPoint_WakeupAltar';
        startPoint[1] = 'BeginningIsland';
      }
      for (const info of [categoryInfo.weapons, categoryInfo.bows, categoryInfo.shields]) {
        const sizes = categoryArray(info, info.validNum);
        if (Array.isArray(sizes)) sizes.fill(100);
      }

      writePresetCategory('weapons', presetItems.weapons.map(([name, durability]) => [name, {
        durability, modifier: hashFor('None'), modifierValue: -1, fuseId: '',
        fuseDurability: name === 'Master Sword' ? 0 : -1,
        extraDurability: name === 'Master Sword' ? 0 : -1,
        recordExtraDurability: -1
      }]));
      writePresetCategory('bows', presetItems.bows.map(([name, durability], index) => [name, {
        durability, modifier: hashFor('None'), modifierValue: index === 0 ? 0 : -1
      }]));
      writePresetCategory('shields', presetItems.shields.map(([name, durability], index) => [name, {
        durability, modifier: hashFor('None'), modifierValue: index === 0 ? 0 : -1, fuseId: '', fuseDurability: -1, extraDurability: -1
      }]));
      // Keep the first weapon selected after the pouch is rebuilt.  A real
      // player save containing Master Sword uses slot 0 and this index.
      const weaponEquipIndex = getPath('Pouch.Weapon.EquipIndex', []);
      if (Array.isArray(weaponEquipIndex) && weaponEquipIndex.length) {
        weaponEquipIndex.fill(-1);
        weaponEquipIndex[0] = 0;
      }
      writePresetCategory('armors', presetItems.armors);
      writePresetCategory('arrows', [['Arrow', { quantity: PRESET_QUANTITY }]]);
      writePresetCategory('materials', (CATALOG.categories.materials || []).map(item => [item.name, { quantity: PRESET_QUANTITY }]));
      writePresetCategory('devices', (CATALOG.categories.devices || []).map(item => [item.name, { quantity: PRESET_QUANTITY }]));
      repairArrowEquipIndex();

      state.currentView = 'inventory';
      state.inventoryFilter = 'all';
      state.inventorySearch = '';
      markDirty();
      switchView('inventory');
      setNotice(`“全物资示例”预设已套用：${total} 项物资，${PRESET_QUANTITY} 支木箭，材料与左纳乌装置全部 ${PRESET_QUANTITY}。`, false);
    } catch (error) {
      setNotice(`无法套用预设：${error.message}`, true);
    }
  }

  function setNotice(message, error) {
    const notice = $('#notice');
    if (!message) { notice.hidden = true; notice.textContent = ''; return; }
    notice.hidden = false;
    notice.className = `notice${error ? ' error' : ''}`;
    notice.textContent = message;
  }

  function markDirty() {
    state.dirty = true;
    $('#download').disabled = false;
    const label = state.sourceName ? `${state.sourceName} · 有未保存的修改` : '有未保存的修改';
    $('#file-status').textContent = label;
  }

  function valueAt(path, index) {
    const value = getPath(path, []);
    return Array.isArray(value) ? value[index] : undefined;
  }

  function writeItemField(info, index, field, value) {
    const array = categoryArray(info, field[1]);
    if (!Array.isArray(array)) return;
    array[index] = field[2] === 'number' ? (value === '' ? 0 : Number(value)) : field[2] === 'item' ? String(value) : hashFor(String(value));
    if (info === categoryInfo.arrows) repairArrowEquipIndex();
    markDirty();
  }

  function enumSelect(type, value, className = '') {
    const options = enumOptions[type] || [];
    const currentName = reverseHashes[String(value)] || 'None';
    const html = [`<select class="${className}" data-option-type="${type}">`];
    for (const [name, label] of options) html.push(`<option value="${escapeHtml(name)}"${name === currentName ? ' selected' : ''}>${escapeHtml(label)}</option>`);
    if (!options.some(([name]) => name === currentName)) html.push(`<option value="${escapeHtml(currentName)}" selected>Unknown (${escapeHtml(value)})</option>`);
    html.push('</select>');
    return html.join('');
  }

  function itemInput(info, index, field) {
    const [property, path, type, label] = field;
    const value = valueAt(path, index);
    const data = `data-category="${info.section}" data-index="${index}" data-field="${escapeHtml(property)}"`;
    if (type === 'number') return `<div class="item-field"><span class="field-label">${escapeHtml(label)}</span><input type="number" ${data} value="${escapeHtml(value ?? 0)}"></div>`;
    if (type === 'item') return `<div class="item-field optional"><span class="field-label">${escapeHtml(label)}</span><input class="item-reference" list="catalog-all-items" ${data} value="${escapeHtml(value || '')}" placeholder="物品 ID"></div>`;
    return `<div class="item-field"><span class="field-label">${escapeHtml(label)}</span>${enumSelect(type, value, 'item-enum')}<input type="hidden" ${data} value="${escapeHtml(reverseHashes[String(value)] || 'None')}"></div>`;
  }

  function renderStatus() {
    const statusFields = [
      ['当前卢比', 'PlayerStatus.CurrentRupee', 'number'],
      ['当前生命（四分之一颗心）', 'PlayerStatus.Life', 'number'],
      ['最大生命（四分之一颗心）', 'PlayerStatus.MaxLife', 'number'],
      ['最大精力', 'PlayerStatus.MaxStamina', 'number'],
      ['最大左纳乌能源', 'PlayerStatus.MaxEnergy', 'number'],
      ['额外精力', 'PlayerStatus.ExtraStamina', 'number'],
      ['额外能源', 'PlayerStatus.ExtraEnergy', 'number'],
      ['当前魄', 'PlayerStatus.CurrentMamo', 'number']
    ];
    const loaded = !!state.document;
    if (!loaded) { $('#view-status').innerHTML = $('#empty-template').innerHTML; return; }
    const cards = [
      ['已配置物资', Object.values(categoryInfo).reduce((sum, info) => sum + itemCount(info), 0)],
      ['数据值', allValues().reduce((sum, entry) => sum + (Array.isArray(entry.value) ? entry.value.length : 1), 0)],
      ['卢比', getPath('PlayerStatus.CurrentRupee', 0)],
      ['生命', `${getPath('PlayerStatus.Life', 0)} / ${getPath('PlayerStatus.MaxLife', 0)}`]
    ];
    const sections = [
      ['玩家状态', statusFields.map(([label, path, type]) => `<div class="field"><label>${escapeHtml(label)}<span class="item-id">${escapeHtml(path)}</span></label><input type="number" data-status-path="${path}" value="${escapeHtml(getPath(path, 0))}"></div>`).join('')],
      ['背包容量', Object.entries(categoryInfo).filter(([, info]) => info.validNum).map(([category, info]) => `<div class="field"><label>${escapeHtml(info.label)}<span class="item-id">${escapeHtml(info.validNum)}</span></label><input type="number" min="0" data-capacity-category="${category}" value="${escapeHtml(capacity(info))}"></div>`).join('')],
      ['贤者伙伴', ['PlayerStatus.Companion.Water.IsSummon', 'PlayerStatus.Companion.Wind.IsSummon', 'PlayerStatus.Companion.Fire.IsSummon', 'PlayerStatus.Companion.Electric.IsSummon', 'PlayerStatus.Companion.Soul.IsSummon'].map(path => `<div class="field"><label>${escapeHtml(path)}</label><input type="checkbox" data-bool-path="${path}"${getPath(path, false) ? ' checked' : ''}></div>`).join('')]
    ];
    $('#view-status').innerHTML = `<div class="view-header"><div><h2>初始状态</h2><p>这些值会用于服务器创建新的客户端存档。</p></div><span class="pill">KTML 文档</span></div><div class="summary-grid">${cards.map(([label, value]) => `<div class="summary-card"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(value)}</div></div>`).join('')}</div>${sections.map(([title, fields]) => `<section class="status-section"><h3>${escapeHtml(title)}</h3><div class="field-grid">${fields}</div></section>`).join('')}`;
    $$('#view-status [data-status-path]').forEach(input => input.addEventListener('change', () => { setPath(input.dataset.statusPath, Number(input.value) || 0); markDirty(); renderStatus(); }));
    $$('#view-status [data-capacity-category]').forEach(input => input.addEventListener('change', () => { const info = categoryInfo[input.dataset.capacityCategory]; const values = categoryArray(info, info.validNum); values.fill(Math.max(0, Number(input.value) || 0)); markDirty(); renderStatus(); }));
    $$('#view-status [data-bool-path]').forEach(input => input.addEventListener('change', () => { setPath(input.dataset.boolPath, input.checked); markDirty(); }));
  }

  function ensureDatalists() {
    for (const [category, items] of Object.entries(CATALOG.categories || {})) {
      const info = categoryInfo[category];
      if (!info || document.getElementById(`catalog-${category}`)) continue;
      const datalist = document.createElement('datalist');
      datalist.id = `catalog-${category}`;
      datalist.innerHTML = items.map(item => `<option value="${escapeHtml(item.id)}" label="${escapeHtml(item.name)}"></option>`).join('');
      document.body.appendChild(datalist);
    }
    if (!document.getElementById('catalog-all-items')) {
      const datalist = document.createElement('datalist');
      datalist.id = 'catalog-all-items';
      datalist.innerHTML = Object.values(CATALOG.categories || {}).flat().map(item => `<option value="${escapeHtml(item.id)}" label="${escapeHtml(item.name)}"></option>`).join('');
      document.body.appendChild(datalist);
    }
  }

  function itemRow(info, category, index) {
    const id = valueAt(namePath(info), index) || '';
    const item = catalogByCategory[category]?.[id];
    const active = !!id;
    const recipe = category === 'food' ? `<div class="item-field optional"><span class="field-label">食材 ID（逗号分隔）</span><input class="recipe-input" data-recipe-index="${index}" value="${escapeHtml(categoryArray(info, info.recipe).slice(index * 5, index * 5 + 5).filter(Boolean).join(', '))}" placeholder="最多 5 个食材"></div>` : '';
    return `<div class="item-row${active ? '' : ' empty'}" data-row-category="${category}" data-row-index="${index}"><img class="item-icon" src="${escapeHtml(itemIcon(category, id))}" alt=""><div class="item-main"><div class="item-name">${escapeHtml(nameForId(id))}</div><div class="item-id">${escapeHtml(id || `空槽位 ${index + 1}`)}</div><div class="item-chooser"><input class="catalog-select" list="catalog-${category}" data-name-category="${category}" data-name-index="${index}" value="${escapeHtml(id)}" placeholder="搜索英文名或内部 ID"><button class="browse-catalog" type="button" title="浏览完整目录" aria-label="浏览完整目录" data-browse-category="${category}" data-browse-index="${index}">⌄</button></div></div>${info.fields.map(field => itemInput(info, index, field)).join('')}${recipe}<button class="remove" type="button" title="删除物品" aria-label="删除物品" data-remove-category="${category}" data-remove-index="${index}">×</button></div>`;
  }

  function renderInventory() {
    if (!state.document) { $('#view-inventory').innerHTML = $('#empty-template').innerHTML; return; }
    ensureDatalists();
    const categories = Object.entries(categoryInfo).filter(([category]) => state.inventoryFilter === 'all' || category === state.inventoryFilter).filter(([category]) => {
      if (!state.inventorySearch) return true;
      const query = state.inventorySearch.toLowerCase();
      return (CATALOG.categories[category] || []).some(item => `${item.id} ${item.name}`.toLowerCase().includes(query)) || itemCount(categoryInfo[category]) > 0 && categoryArray(categoryInfo[category], namePath(categoryInfo[category])).some(id => `${id} ${nameForId(id)}`.toLowerCase().includes(query));
    });
    const filterOptions = [['all', '全部分类'], ...Object.entries(categoryInfo).map(([category, info]) => [category, info.label])].map(([value, label]) => `<option value="${value}"${state.inventoryFilter === value ? ' selected' : ''}>${label}</option>`).join('');
    const blocks = categories.map(([category, info]) => {
      const names = categoryArray(info, namePath(info));
      const indices = names.map((id, index) => ({ id, index })).filter(entry => entry.id);
      const rows = indices.length ? indices.map(entry => itemRow(info, category, entry.index)).join('') : '<div class="empty-list">这个背包目前没有物品，添加时会使用第一个空槽位。</div>';
      return `<section class="category-block"><div class="category-title"><h3>${escapeHtml(info.label)}</h3><span class="pill">${indices.length} 项${info.validNum ? ` · 容量 ${capacity(info)}` : ''}</span><div class="category-actions"><button class="small-button" data-add-category="${category}">+ 添加</button>${indices.length && info.fields.some(field => field[0] === 'quantity') ? `<button class="small-button" data-max-category="${category}">数量设为 ${PRESET_QUANTITY}</button>` : ''}</div></div><div class="item-list">${rows}</div></section>`;
    }).join('');
    $('#view-inventory').innerHTML = `<div class="view-header"><div><h2>初始物资</h2><p>使用游戏英文名或内部 ID 选择物品，再编辑数量、耐久与附加效果。</p></div></div><div class="inventory-toolbar"><input class="search" id="inventory-search" value="${escapeHtml(state.inventorySearch)}" placeholder="搜索英文物品名、ID 或分类"><select class="filter" id="inventory-filter">${filterOptions}</select></div>${blocks || '<div class="empty-list">没有匹配的分类或物品。</div>'}`;
    $('#inventory-search').addEventListener('input', event => {
      state.inventorySearch = event.target.value;
      renderInventory();
      const next = $('#inventory-search');
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    });
    $('#inventory-filter').addEventListener('change', event => { state.inventoryFilter = event.target.value; renderInventory(); });
    $$('#view-inventory [data-add-category]').forEach(button => button.addEventListener('click', () => addItem(button.dataset.addCategory)));
    $$('#view-inventory [data-remove-category]').forEach(button => button.addEventListener('click', () => removeItem(button.dataset.removeCategory, Number(button.dataset.removeIndex))));
    $$('#view-inventory [data-max-category]').forEach(button => button.addEventListener('click', () => maxQuantities(button.dataset.maxCategory)));
    $$('#view-inventory [data-name-category]').forEach(input => input.addEventListener('change', () => updateItemId(input)));
    $$('#view-inventory [data-browse-category]').forEach(button => button.addEventListener('click', () => openCatalogPicker(button.dataset.browseCategory, Number(button.dataset.browseIndex), button)));
    $$('#view-inventory .item-reference').forEach(input => input.addEventListener('change', () => { writeItemField(categoryInfo[findCategory(input.dataset.category)], Number(input.dataset.index), categoryInfo[findCategory(input.dataset.category)].fields.find(field => field[0] === input.dataset.field), input.value); }));
    $$('#view-inventory .item-row input[type="number"]').forEach(input => input.addEventListener('change', () => { const category = findCategory(input.dataset.category); const field = categoryInfo[category].fields.find(entry => entry[0] === input.dataset.field); writeItemField(categoryInfo[category], Number(input.dataset.index), field, input.value); }));
    $$('#view-inventory .recipe-input').forEach(input => input.addEventListener('change', () => {
      const info = categoryInfo.food;
      const recipe = categoryArray(info, info.recipe);
      const values = input.value.split(',').map(value => value.trim()).filter(Boolean).slice(0, 5);
      for (let offset = 0; offset < 5; offset++) recipe[Number(input.dataset.recipeIndex) * 5 + offset] = values[offset] || '';
      markDirty();
    }));
    $$('#view-inventory .item-enum').forEach(select => select.addEventListener('change', () => { const wrapper = select.closest('.item-field'); const input = wrapper.querySelector('input[type="hidden"]'); input.value = select.value; const category = findCategory(input.dataset.category); const field = categoryInfo[category].fields.find(entry => entry[0] === input.dataset.field); writeItemField(categoryInfo[category], Number(input.dataset.index), field, select.value); }));
  }

  function closeCatalogPicker() {
    const picker = document.querySelector('.catalog-picker');
    if (picker) picker.remove();
  }

  function openCatalogPicker(category, index, anchor) {
    closeCatalogPicker();
    const info = categoryInfo[category];
    const items = CATALOG.categories[category] || [];
    const picker = document.createElement('div');
    picker.className = 'catalog-picker';
    picker.innerHTML = `<div class="catalog-picker-head"><strong>${escapeHtml(info.label)}</strong><input class="catalog-picker-search" placeholder="搜索 ${items.length} 个英文物品"></div><div class="catalog-picker-list"></div>`;
    document.body.appendChild(picker);
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(420, window.innerWidth - 24);
    picker.style.width = `${width}px`;
    picker.style.left = `${Math.min(Math.max(12, rect.right - width), window.innerWidth - width - 12)}px`;
    picker.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - Math.min(560, window.innerHeight - 24))}px`;
    const search = picker.querySelector('.catalog-picker-search');
    const list = picker.querySelector('.catalog-picker-list');
    const renderOptions = () => {
      const query = search.value.trim().toLowerCase();
      const filtered = items.filter(item => !query || `${item.id} ${item.name}`.toLowerCase().includes(query)).slice(0, 300);
      list.innerHTML = filtered.length ? filtered.map(item => `<button class="catalog-option" type="button" data-catalog-id="${escapeHtml(item.id)}"><img src="${escapeHtml(item.icon)}" alt=""><span class="catalog-option-name">${escapeHtml(item.name)}</span><span class="catalog-option-id">${escapeHtml(item.id)}</span></button>`).join('') : '<div class="empty-list">没有匹配的物品。</div>';
      list.querySelectorAll('[data-catalog-id]').forEach(option => option.addEventListener('click', () => {
        const names = categoryArray(info, namePath(info));
        names[index] = option.dataset.catalogId;
        repairArrowEquipIndex();
        markDirty();
        closeCatalogPicker();
        renderInventory();
      }));
    };
    search.addEventListener('input', renderOptions);
    search.addEventListener('keydown', event => { if (event.key === 'Escape') closeCatalogPicker(); });
    renderOptions();
    search.focus();
    document.addEventListener('click', function outside(event) { if (!picker.contains(event.target) && event.target !== anchor) { closeCatalogPicker(); document.removeEventListener('click', outside); } });
  }

  function findCategory(section) { return Object.keys(categoryInfo).find(category => categoryInfo[category].section === section); }

  function updateItemId(input) {
    const category = input.dataset.nameCategory;
    const info = categoryInfo[category];
    const index = Number(input.dataset.nameIndex);
    const names = categoryArray(info, namePath(info));
    const typed = input.value.trim();
    if (!typed) {
      removeItem(category, index);
      return;
    }
    names[index] = catalogIdByName[typed.toLowerCase()] || typed;
    repairArrowEquipIndex();
    markDirty();
    renderInventory();
  }

  function addItem(category) {
    const info = categoryInfo[category];
    const names = categoryArray(info, namePath(info));
    const index = names.findIndex(value => !value);
    if (index === -1) { setNotice(`${info.label} 已满，共 ${names.length} 个槽位。`, true); return; }
    const first = (CATALOG.categories[category] || [])[0];
    names[index] = first ? first.id : '';
    for (const [property, path, type] of info.fields) {
      const array = categoryArray(info, path);
      if (!Array.isArray(array)) continue;
      if (type === 'number') array[index] = property === 'quantity' ? 1 : property === 'durability' ? (CATALOG.durability[first?.id] || 70) : property === 'heartsHeal' ? 4 : property === 'price' ? 1 : 0;
      else if (type === 'item') array[index] = '';
      else array[index] = hashFor('None');
    }
    repairArrowEquipIndex();
    if (info.recipe) {
      const recipe = categoryArray(info, info.recipe);
      for (let offset = 0; offset < 5; offset++) recipe[index * 5 + offset] = '';
    }
    markDirty();
    renderInventory();
  }

  function removeItem(category, index) {
    const info = categoryInfo[category];
    const names = categoryArray(info, namePath(info));
    for (let slot = index; slot < names.length - 1; slot++) names[slot] = names[slot + 1];
    names[names.length - 1] = '';
    for (const [, path, type] of info.fields) {
      const array = categoryArray(info, path);
      if (!Array.isArray(array)) continue;
      for (let slot = index; slot < array.length - 1; slot++) array[slot] = array[slot + 1];
      array[array.length - 1] = type === 'number' ? 0 : type === 'item' ? '' : hashFor('None');
    }
    if (info.recipe) {
      const recipe = categoryArray(info, info.recipe);
      for (let slot = index; slot < names.length - 1; slot++) {
        for (let offset = 0; offset < 5; offset++) recipe[slot * 5 + offset] = recipe[(slot + 1) * 5 + offset];
      }
      for (let offset = 0; offset < 5; offset++) recipe[(names.length - 1) * 5 + offset] = '';
    }
    repairArrowEquipIndex();
    markDirty();
    renderInventory();
  }

  function maxQuantities(category) {
    const info = categoryInfo[category];
    const quantityField = info.fields.find(field => field[0] === 'quantity');
    if (!quantityField) { setNotice(`${info.label} 没有可编辑的堆叠数量。`, false); return; }
    const array = categoryArray(info, quantityField[1]);
    const names = categoryArray(info, namePath(info));
    names.forEach((id, index) => { if (id) array[index] = PRESET_QUANTITY; });
    repairArrowEquipIndex();
    markDirty();
    renderInventory();
  }

  function genericInput(sectionName, path, value, arrayIndex) {
    const type = sectionName;
    const data = `data-variable-section="${escapeHtml(sectionName)}" data-variable-path="${escapeHtml(path)}"${typeof arrayIndex === 'number' ? ` data-variable-index="${arrayIndex}"` : ''}`;
    if (type === 'Bool' || type === 'BoolArray') return `<input class="variable-input" type="checkbox" ${data}${value ? ' checked' : ''}>`;
    if (type === 'Enum' || type === 'EnumArray') return `<input class="variable-input" type="number" step="1" ${data} value="${escapeHtml(value ?? 0)}" title="${escapeHtml(reverseHashes[String(value)] || '未知枚举值')}">`;
    if (type === 'String64' || type === 'String64Array' || type === 'WString16Array') return `<input class="variable-input" type="text" ${data} value="${escapeHtml(value ?? '')}">`;
    if (typeof value === 'bigint') return `<input class="variable-input" type="text" ${data} value="${escapeHtml(value.toString())}">`;
    if (typeof value === 'number' || type.includes('Int') || type.includes('UInt') || type.includes('Float')) return `<input class="variable-input" type="number" step="${type.includes('Float') ? 'any' : '1'}" ${data} value="${escapeHtml(value ?? 0)}">`;
    return `<input class="variable-input" type="text" ${data} value="${escapeHtml(value ?? '')}">`;
  }

  function variableValueCell(entry, index) {
    const value = entry.value;
    if (Array.isArray(value)) {
      return `<div class="variable-array">${value.map((cell, cellIndex) => `<div class="array-cell"><span class="array-index">${cellIndex}</span>${genericInput(entry.sectionName, entry.path, cell, cellIndex)}</div>`).join('')}</div>`;
    }
    if (value && typeof value === 'object') {
      return `<div class="variable-array">${Object.entries(value).map(([key, cell]) => `<div class="array-cell"><span class="array-index">${escapeHtml(key)}</span>${genericInput(entry.sectionName, `${entry.path}.${key}`, cell)}</div>`).join('')}</div>`;
    }
    return genericInput(entry.sectionName, entry.path, value, index);
  }

  function renderVariables() {
    if (!state.document) { $('#view-variables').innerHTML = $('#empty-template').innerHTML; return; }
    const query = state.variableSearch.toLowerCase();
    const filteredGroups = [];
    const groups = Object.entries(state.document).map(([sectionName, section]) => {
      const entries = Object.entries(section || {}).map(([path, value]) => ({ sectionName, path, value })).filter(entry => !query || `${entry.sectionName} ${entry.path}`.toLowerCase().includes(query));
      if (!entries.length) return '';
      filteredGroups.push({ sectionName, entries });
      return `<details class="variable-group" data-variable-group="${escapeHtml(sectionName)}"${query ? ' open' : ''}><summary>${escapeHtml(sectionName)}<span>${entries.length} 个变量</span></summary><div class="variable-group-content"></div></details>`;
    }).join('');
    $('#view-variables').innerHTML = `<div class="view-header"><div><h2>全部变量</h2><p>按 KTML 原始类型编辑全部字段。非物资变量可以在这里按路径查找。</p></div></div><div class="variable-toolbar"><input class="search" id="variable-search" value="${escapeHtml(state.variableSearch)}" placeholder="搜索变量路径"><span class="pill">${allValues().length} 个键</span></div><div class="variable-groups">${groups || '<div class="empty-list">没有匹配的变量。</div>'}</div>`;
    $('#variable-search').addEventListener('input', event => {
      state.variableSearch = event.target.value;
      renderVariables();
      const next = $('#variable-search');
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    });
    for (const group of filteredGroups) {
      const details = $(`#view-variables [data-variable-group="${group.sectionName}"]`);
      const fill = () => {
        const content = details.querySelector('.variable-group-content');
        if (content.dataset.rendered) return;
        const rows = group.entries.map(entry => `<tr><td><div class="variable-path">${escapeHtml(entry.path)}</div></td><td><div class="variable-type">${escapeHtml(entry.sectionName)}${Array.isArray(entry.value) ? ` · ${entry.value.length}` : ''}</div></td><td>${variableValueCell(entry)}</td></tr>`).join('');
        content.innerHTML = `<table class="variable-table"><thead><tr><th>路径</th><th>类型</th><th>值</th></tr></thead><tbody>${rows}</tbody></table>`;
        content.dataset.rendered = 'true';
        content.querySelectorAll('[data-variable-section]').forEach(input => input.addEventListener('change', () => updateVariable(input)));
      };
      details.addEventListener('toggle', () => { if (details.open) fill(); });
      if (details.open) fill();
    }
  }

  function updateVariable(input) {
    const sectionName = input.dataset.variableSection;
    const path = input.dataset.variablePath;
    const index = input.dataset.variableIndex === undefined ? undefined : Number(input.dataset.variableIndex);
    const section = state.document[sectionName];
    if (!section) return;
    let targetPath = path;
    let objectKey;
    if (path.includes('.') && !Object.prototype.hasOwnProperty.call(section, path)) {
      const split = path.lastIndexOf('.');
      targetPath = path.slice(0, split);
      objectKey = path.slice(split + 1);
    }
    let value = section[targetPath];
    if (objectKey && value && typeof value === 'object') value[objectKey] = input.type === 'number' ? Number(input.value) : input.value;
    else if (Array.isArray(value) && index !== undefined) value[index] = parseVariableValue(sectionName, input);
    else section[targetPath] = parseVariableValue(sectionName, input);
    if (targetPath === 'Pouch.Arrow.Content.Name' || targetPath === 'Pouch.Arrow.Content.StockNum') repairArrowEquipIndex();
    markDirty();
  }

  function parseVariableValue(sectionName, input) {
    if (input.type === 'checkbox') return input.checked;
    if (sectionName === 'Enum' || sectionName === 'EnumArray') return input.value === '' ? 0 : Number(input.value);
    if (sectionName.includes('UInt64')) return input.value === '' ? BigInt(0) : BigInt(input.value);
    if (sectionName.includes('Int') || sectionName.includes('UInt')) return input.value === '' ? 0 : Number(input.value);
    if (sectionName.includes('Float')) return input.value === '' ? 0 : Number(input.value);
    return input.value;
  }

  function render() {
    $('#editor').classList.toggle('hidden', !state.document);
    $('#download').disabled = !state.document;
    $('#apply-preset').disabled = !state.document;
    if (!state.document) { $('#file-status').textContent = '尚未载入文件'; return; }
    const totalItems = Object.values(categoryInfo).reduce((sum, info) => sum + itemCount(info), 0);
    $('#inventory-count').textContent = totalItems;
    $('#variable-count').textContent = allValues().length;
    $('#status-count').textContent = '8 项';
    if (state.currentView === 'status') renderStatus();
    if (state.currentView === 'inventory') renderInventory();
    if (state.currentView === 'variables') renderVariables();
  }

  function loadText(text, sourceName) {
    try {
      state.document = window.KTML.parse(text);
      const arrowRepaired = repairArrowEquipIndex();
      state.sourceName = sourceName || 'KTML 文件';
      state.dirty = arrowRepaired;
      $('#file-status').textContent = `${state.sourceName} · ${arrowRepaired ? '已载入并修复箭矢状态' : '已载入'}`;
      $('#download').disabled = false;
      setNotice(arrowRepaired
        ? '文件载入成功，并已自动修复箭矢装备索引；下载后游戏即可识别木箭。'
        : '文件载入成功。所有改动只保留在浏览器中，直到下载编辑后的 KTML。', false);
      render();
    } catch (error) {
      state.document = null;
      render();
      setNotice(`无法解析这个文件：${error.message}`, true);
    }
  }

  function validateDocument() {
    const problems = [];
    for (const [category, info] of Object.entries(categoryInfo)) {
      const names = categoryArray(info, namePath(info));
      if (!Array.isArray(names)) {
        problems.push(`${info.label} 缺少 ${namePath(info)}`);
        continue;
      }
      for (const [, path] of info.fields) {
        const values = categoryArray(info, path);
        if (!Array.isArray(values)) problems.push(`${info.label} 缺少 ${path}`);
        else if (values.length !== names.length) problems.push(`${path} 有 ${values.length} 项，应为 ${names.length} 项`);
      }
      if (info.recipe) {
        const recipe = categoryArray(info, info.recipe);
        if (!Array.isArray(recipe) || recipe.length !== names.length * 5) problems.push(`${info.recipe} 应为 ${names.length * 5} 项`);
      }
      const firstEmpty = names.findIndex(value => !value);
      if (firstEmpty !== -1 && names.slice(firstEmpty + 1).some(Boolean)) problems.push(`${info.label} 的物品槽位中间存在空项`);
    }
    return problems;
  }

  async function loadDefault() {
    try {
      if (typeof window.DEFAULT_KTML === 'string') { loadText(window.DEFAULT_KTML, 'defaultClientSave.ktml'); return; }
      const response = await fetch(DEFAULT_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      loadText(await response.text(), 'defaultClientSave.ktml');
    } catch (error) {
      setNotice('无法载入内置默认文件。请使用“打开 KTML”手动选择文件。', true);
    }
  }

  function download() {
    if (!state.document) return;
    try {
      // Re-apply derived pouch state immediately before export. This also
      // protects against a manual edit of EquipIndex in the “全部变量” view.
      repairArrowEquipIndex();
      const problems = validateDocument();
      if (problems.length) {
        setNotice(`下载已阻止：${problems.slice(0, 3).join('；')}${problems.length > 3 ? `；另有 ${problems.length - 3} 项` : ''}`, true);
        return;
      }
      const text = window.KTML.stringify(state.document);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = state.sourceName.replace(/\.(ktml|txt)$/i, '') + '-edited.ktml';
      link.click();
      URL.revokeObjectURL(url);
      state.dirty = false;
      $('#file-status').textContent = `${link.download} · 已下载`;
      setNotice('KTML 已下载。部署为服务器默认文件前，请保留原文件备份。', false);
    } catch (error) {
      setNotice(`无法生成 KTML：${error.message}`, true);
    }
  }

  function switchView(view) {
    state.currentView = view;
    $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
    $$('.view').forEach(element => element.classList.toggle('hidden', element.id !== `view-${view}`));
    if (!state.document) return;
    if (view === 'status') renderStatus();
    if (view === 'inventory') renderInventory();
    if (view === 'variables') renderVariables();
  }

  function bind() {
    $('#file-input').addEventListener('change', event => { const file = event.target.files[0]; if (file) file.text().then(text => loadText(text, file.name)); });
    $('#load-default').addEventListener('click', loadDefault);
    $('#apply-preset').addEventListener('click', applyRichInventoryPreset);
    $('#download').addEventListener('click', download);
    $$('.nav-item').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
    const dropzone = $('#dropzone');
    ['dragenter', 'dragover'].forEach(eventName => dropzone.addEventListener(eventName, event => { event.preventDefault(); dropzone.classList.add('dragover'); }));
    ['dragleave', 'drop'].forEach(eventName => dropzone.addEventListener(eventName, event => { event.preventDefault(); dropzone.classList.remove('dragover'); }));
    dropzone.addEventListener('drop', event => { const file = event.dataTransfer.files[0]; if (file) file.text().then(text => loadText(text, file.name)); });
    window.addEventListener('beforeunload', event => { if (state.dirty) { event.preventDefault(); event.returnValue = ''; } });
    switchView('status');
    loadDefault();
  }

  document.addEventListener('DOMContentLoaded', bind);
}());
