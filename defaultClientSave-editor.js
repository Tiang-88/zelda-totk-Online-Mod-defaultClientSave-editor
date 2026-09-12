(function () {
  'use strict';

  const CATALOG = window.TOTK_CATALOG || { categories: {}, enumHashes: {} };
  const H = CATALOG.enumHashes || {};
  const reverseHashes = Object.fromEntries(Object.entries(H).map(([name, value]) => [String(value), name]));
  const DEFAULT_PATH = 'Server/Resources/SaveServer/defaultClientSave.ktml';
  const PRESET_QUANTITY = 300;

  const translations = {
    zh: {
      'meta.title': '王国之泪初始存档编辑器',
      'app.title': '初始存档编辑器',
      'button.open': '打开 KTML',
      'button.loadDefault': '载入服务器默认文件',
      'button.applyPreset': '套用物资预设',
      'button.download': '下载 KTML',
      'language.switch': '切换为英文',
      'drop.title': '拖入一个',
      'drop.file': '文件',
      'drop.hint': '也可以使用上方的“打开 KTML”。原文件不会被直接修改。',
      'file.none': '尚未载入文件',
      'file.loaded': '{name} · 已载入',
      'file.repaired': '{name} · 已载入并修复箭矢状态',
      'file.dirty': '{name} · 有未保存的修改',
      'file.dirtyUnnamed': '有未保存的修改',
      'file.downloaded': '{name} · 已下载',
      'file.defaultName': 'KTML 文件',
      'sidebar.title': '编辑器',
      'nav.status': '基本状态',
      'nav.inventory': '初始物资',
      'nav.variables': '全部变量',
      'sidebar.note': '物品目录来自当前目录内的 TOTK 编辑器。英文名称和内部 ID 会同时保留，方便核对实际写入值。',
      'empty.title': '尚未载入文件',
      'empty.text': '打开 KTML 后即可开始编辑。',
      'category.weapons': '武器',
      'category.bows': '弓',
      'category.shields': '盾牌',
      'category.armors': '防具',
      'category.arrows': '箭矢',
      'category.materials': '材料',
      'category.food': '料理',
      'category.devices': '左纳乌装置',
      'category.abilities': '特殊能力',
      'filter.all': '全部分类',
      'status.title': '初始状态',
      'status.description': '这些值会用于服务器创建新的客户端存档。',
      'status.document': 'KTML 文档',
      'status.configuredItems': '已配置物资',
      'status.dataValues': '数据值',
      'status.rupees': '卢比',
      'status.hearts': '生命',
      'status.player': '玩家状态',
      'status.capacity': '背包容量',
      'status.companions': '贤者伙伴',
      'status.currentRupees': '当前卢比',
      'status.currentHearts': '当前生命（四分之一颗心）',
      'status.maximumHearts': '最大生命（四分之一颗心）',
      'status.maximumStamina': '最大精力',
      'status.maximumEnergy': '最大左纳乌能源',
      'status.extraStamina': '额外精力',
      'status.extraEnergy': '额外左纳乌能源',
      'status.currentPoes': '当前魄',
      'companion.water': '希多的盟约（水之贤者）',
      'companion.wind': '丘栗的盟约（风之贤者）',
      'companion.fire': '阿沅的盟约（火之贤者）',
      'companion.lightning': '露珠的盟约（雷之贤者）',
      'companion.spirit': '米涅鲁的盟约（魂之贤者）',
      'inventory.title': '初始物资',
      'inventory.description': '使用游戏英文名或内部 ID 选择物品，再编辑数量、耐久与附加效果。',
      'inventory.search': '搜索英文物品名、ID 或分类',
      'inventory.emptyPouch': '这个背包目前没有物品，添加时会使用第一个空槽位。',
      'inventory.noMatches': '没有匹配的分类或物品。',
      'inventory.add': '+ 添加',
      'inventory.setQuantity': '数量设为 {quantity}',
      'inventory.itemId': '物品 ID',
      'inventory.searchItem': '搜索英文名或内部 ID',
      'inventory.browse': '浏览完整目录',
      'inventory.remove': '删除物品',
      'inventory.emptySlot': '空槽位',
      'inventory.emptySlotNumber': '空槽位 {number}',
      'inventory.recipe': '食材 ID（逗号分隔）',
      'inventory.recipeHint': '最多 5 个食材',
      'inventory.catalogSearch': '搜索 {count} 个英文物品',
      'inventory.noItemMatches': '没有匹配的物品。',
      'variables.title': '全部变量',
      'variables.description': '按 KTML 原始类型编辑全部字段。非物资变量可以在这里按路径查找。',
      'variables.search': '搜索变量路径',
      'variables.none': '没有匹配的变量。',
      'variables.path': '路径',
      'variables.type': '类型',
      'variables.value': '值',
      'variables.unknownEnum': '未知枚举值',
      'count.items': '{count} 项',
      'count.variables': '{count} 个变量',
      'count.keys': '{count} 个键',
      'count.capacity': '{count} 项 · 容量 {capacity}',
      'field.Durability': '耐久度',
      'field.Modifier': '特性',
      'field.Modifier value': '特性值',
      'field.Fusion': '余料建造',
      'field.Fuse durability': '融合素材耐久度',
      'field.Current fuse': '当前融合耐久度',
      'field.Max fuse': '最大融合耐久度',
      'field.Dye color': '染色',
      'field.Quantity': '数量',
      'field.Get order': '获取顺序',
      'field.Use order': '使用顺序',
      'field.Heart quarters heal': '恢复生命（四分之一颗心）',
      'field.Food effect': '料理效果',
      'field.Effect level': '效果等级',
      'field.Duration (seconds)': '持续时间（秒）',
      'field.Price': '价格',
      'enum.No bonus': '无奖励',
      'enum.Durability ↑': '耐久度提升 ↑',
      'enum.Durability ↑↑': '耐久度提升 ↑↑',
      'enum.Attack ↑': '攻击力提升 ↑',
      'enum.Attack ↑↑': '攻击力提升 ↑↑',
      'enum.Critical Hit ↑': '结束暴击 ↑',
      'enum.Throw ↑↑': '远距离投掷 ↑↑',
      'enum.Quick Shot': '速射',
      'enum.Arrow Shot x5': '五连发',
      'enum.Block ↑': '盾防提升 ↑',
      'enum.Block ↑↑': '盾防提升 ↑↑',
      'enum.Default color': '默认颜色',
      'enum.None': '无',
      'enum.Blue': '蓝色',
      'enum.Red': '红色',
      'enum.Yellow': '黄色',
      'enum.White': '白色',
      'enum.Black': '黑色',
      'enum.Purple': '紫色',
      'enum.Green': '绿色',
      'enum.Light blue': '浅蓝色',
      'enum.Navy': '深蓝色',
      'enum.Orange': '橙色',
      'enum.Pink': '粉色',
      'enum.Crimson': '深红色',
      'enum.Light yellow': '浅黄色',
      'enum.Brown': '棕色',
      'enum.Gray': '灰色',
      'preset.confirm': '将覆盖当前的武器、弓、箭、盾、防具、材料和左纳乌装置，共写入 {count} 项物资。是否继续？',
      'preset.applied': '“全物资示例”预设已套用：{count} 项物资，{quantity} 支木箭，材料与左纳乌装置全部 {quantity}。',
      'preset.failed': '无法套用预设：{error}',
      'error.missingNames': '{category} 缺少物品名称数组',
      'error.slotsNeeded': '{category} 需要 {needed} 个槽位，但文件只有 {available} 个',
      'error.catalogMissing': '{category} 的目录中找不到 {name}',
      'inventory.full': '{category} 已满，共 {count} 个槽位。',
      'inventory.noQuantity': '{category} 没有可编辑的堆叠数量。',
      'notice.loadRepaired': '文件载入成功，并已自动修复箭矢装备索引；下载后游戏即可识别木箭。',
      'notice.loadSuccess': '文件载入成功。所有改动只保留在浏览器中，直到下载编辑后的 KTML。',
      'notice.parseFailed': '无法解析这个文件：{error}',
      'validate.missing': '{category} 缺少 {path}',
      'validate.length': '{path} 有 {actual} 项，应为 {expected} 项',
      'validate.expected': '{path} 应为 {expected} 项',
      'validate.gap': '{category} 的物品槽位中间存在空项',
      'notice.loadDefaultFailed': '无法载入内置默认文件。请使用“打开 KTML”手动选择文件。',
      'notice.downloadBlocked': '下载已阻止：{problems}{more}',
      'notice.moreProblems': '；另有 {count} 项',
      'notice.downloadSuccess': 'KTML 已下载。部署为服务器默认文件前，请保留原文件备份。',
      'notice.generateFailed': '无法生成 KTML：{error}'
    },
    en: {
      'meta.title': 'Tears of the Kingdom Initial Save Editor',
      'app.title': 'Initial Save Editor',
      'button.open': 'Open KTML',
      'button.loadDefault': 'Load Server Default',
      'button.applyPreset': 'Apply Inventory Preset',
      'button.download': 'Download KTML',
      'language.switch': 'Switch to Chinese',
      'drop.title': 'Drop a',
      'drop.file': 'file',
      'drop.hint': 'You can also use “Open KTML” above. The original file will not be modified.',
      'file.none': 'No file loaded',
      'file.loaded': '{name} · Loaded',
      'file.repaired': '{name} · Loaded and arrow state repaired',
      'file.dirty': '{name} · Unsaved changes',
      'file.dirtyUnnamed': 'Unsaved changes',
      'file.downloaded': '{name} · Downloaded',
      'file.defaultName': 'KTML file',
      'sidebar.title': 'Editor',
      'nav.status': 'Status',
      'nav.inventory': 'Initial Inventory',
      'nav.variables': 'All Variables',
      'sidebar.note': 'Item names come from the included TOTK Savegame Editor. Standard English names and internal IDs are both shown for verification.',
      'empty.title': 'No File Loaded',
      'empty.text': 'Open a KTML file to start editing.',
      'category.weapons': 'Weapons',
      'category.bows': 'Bows',
      'category.shields': 'Shields',
      'category.armors': 'Armors',
      'category.arrows': 'Arrows',
      'category.materials': 'Materials',
      'category.food': 'Food',
      'category.devices': 'Zonai Devices',
      'category.abilities': 'Abilities',
      'filter.all': 'All Categories',
      'status.title': 'Initial Status',
      'status.description': 'These values are used when the server creates a new client save.',
      'status.document': 'KTML Document',
      'status.configuredItems': 'Configured Items',
      'status.dataValues': 'Data Values',
      'status.rupees': 'Rupees',
      'status.hearts': 'Hearts',
      'status.player': 'Player Status',
      'status.capacity': 'Pouch Size',
      'status.companions': 'Sage Companions',
      'status.currentRupees': 'Rupees',
      'status.currentHearts': 'Current Hearts (quarter hearts)',
      'status.maximumHearts': 'Max. Hearts (quarter hearts)',
      'status.maximumStamina': 'Max. Stamina',
      'status.maximumEnergy': 'Battery Size',
      'status.extraStamina': 'Extra Stamina',
      'status.extraEnergy': 'Extra Zonai Energy',
      'status.currentPoes': 'Current Poes',
      'companion.water': 'Vow of Sidon, Sage of Water',
      'companion.wind': 'Vow of Tulin, Sage of Wind',
      'companion.fire': 'Vow of Yunobo, Sage of Fire',
      'companion.lightning': 'Vow of Riju, Sage of Lightning',
      'companion.spirit': 'Vow of Mineru, Sage of Spirit',
      'inventory.title': 'Initial Inventory',
      'inventory.description': 'Select items by their standard English name or internal ID, then edit quantities, durability, and effects.',
      'inventory.search': 'Search English item names, IDs, or categories',
      'inventory.emptyPouch': 'This pouch is empty. The first empty slot will be used when an item is added.',
      'inventory.noMatches': 'No matching categories or items.',
      'inventory.add': '+ Add',
      'inventory.setQuantity': 'Set Quantity to {quantity}',
      'inventory.itemId': 'Item ID',
      'inventory.searchItem': 'Search English name or internal ID',
      'inventory.browse': 'Browse Full Catalog',
      'inventory.remove': 'Remove Item',
      'inventory.emptySlot': 'Empty Slot',
      'inventory.emptySlotNumber': 'Empty Slot {number}',
      'inventory.recipe': 'Ingredient IDs (comma-separated)',
      'inventory.recipeHint': 'Up to 5 ingredients',
      'inventory.catalogSearch': 'Search {count} English items',
      'inventory.noItemMatches': 'No matching items.',
      'variables.title': 'All Variables',
      'variables.description': 'Edit every field using its original KTML type. Search non-inventory fields by path here.',
      'variables.search': 'Search variable paths',
      'variables.none': 'No matching variables.',
      'variables.path': 'Path',
      'variables.type': 'Type',
      'variables.value': 'Value',
      'variables.unknownEnum': 'Unknown enum value',
      'count.items': '{count} items',
      'count.variables': '{count} variables',
      'count.keys': '{count} keys',
      'count.capacity': '{count} items · Capacity {capacity}',
      'field.Durability': 'Durability',
      'field.Modifier': 'Modifier',
      'field.Modifier value': 'Modifier Value',
      'field.Fusion': 'Fusion',
      'field.Fuse durability': 'Fuse Durability',
      'field.Current fuse': 'Current Fuse Durability',
      'field.Max fuse': 'Max Fuse Durability',
      'field.Dye color': 'Dye Color',
      'field.Quantity': 'Quantity',
      'field.Get order': 'Get Order',
      'field.Use order': 'Use Order',
      'field.Heart quarters heal': 'Heart Quarters Healed',
      'field.Food effect': 'Food Effect',
      'field.Effect level': 'Effect Level',
      'field.Duration (seconds)': 'Duration (seconds)',
      'field.Price': 'Price',
      'preset.confirm': 'This will replace the current weapons, bows, arrows, shields, armor, materials, and Zonai devices with {count} inventory entries. Continue?',
      'preset.applied': 'The Full Inventory Example preset was applied: {count} items, {quantity} arrows, and {quantity} of every material and Zonai device.',
      'preset.failed': 'Could not apply the preset: {error}',
      'error.missingNames': '{category} is missing its item-name array',
      'error.slotsNeeded': '{category} needs {needed} slots, but this file has only {available}',
      'error.catalogMissing': '{name} was not found in the {category} catalog',
      'inventory.full': '{category} is full ({count} slots).',
      'inventory.noQuantity': '{category} has no editable stack quantity.',
      'notice.loadRepaired': 'File loaded successfully. The arrow equip index was repaired automatically, so the game can recognize arrows after download.',
      'notice.loadSuccess': 'File loaded successfully. Changes remain in the browser until you download the edited KTML.',
      'notice.parseFailed': 'Could not parse this file: {error}',
      'validate.missing': '{category} is missing {path}',
      'validate.length': '{path} has {actual} entries; expected {expected}',
      'validate.expected': '{path} should contain {expected} entries',
      'validate.gap': '{category} has an empty slot between occupied item slots',
      'notice.loadDefaultFailed': 'Could not load the bundled default file. Use “Open KTML” to select a file manually.',
      'notice.downloadBlocked': 'Download blocked: {problems}{more}',
      'notice.moreProblems': '; {count} more',
      'notice.downloadSuccess': 'KTML downloaded. Keep a backup of the original before deploying this as the server default.',
      'notice.generateFailed': 'Could not generate the KTML: {error}'
    }
  };

  function initialLanguage() {
    try {
      return localStorage.getItem('defaultClientSaveEditor.language') === 'en' ? 'en' : 'zh';
    } catch (error) {
      return 'zh';
    }
  }

  const categoryInfo = {
    weapons: {
      label: 'category.weapons', noun: 'weapon', section: 'Pouch.Weapon', validNum: 'Pouch.Weapon.ValidNum',
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
      label: 'category.bows', noun: 'bow', section: 'Pouch.Bow', validNum: 'Pouch.Bow.ValidNum',
      fields: [
        ['durability', 'Pouch.Bow.Content.Life', 'number', 'Durability'],
        ['modifier', 'Pouch.Bow.Content.Effect.Type', 'bow-modifier', 'Modifier'],
        ['modifierValue', 'Pouch.Bow.Content.Effect.Value', 'number', 'Modifier value']
      ]
    },
    shields: {
      label: 'category.shields', noun: 'shield', section: 'Pouch.Shield', validNum: 'Pouch.Shield.ValidNum',
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
      label: 'category.armors', noun: 'armor', section: 'Pouch.Armor',
      fields: [['dyeColor', 'Pouch.Armor.Content.ColorVariation', 'dye', 'Dye color']]
    },
    arrows: {
      label: 'category.arrows', noun: 'arrow stack', section: 'Pouch.Arrow',
      fields: [['quantity', 'Pouch.Arrow.Content.StockNum', 'number', 'Quantity']]
    },
    materials: {
      label: 'category.materials', noun: 'material', section: 'Pouch.Material',
      fields: [['quantity', 'Pouch.Material.Content.StockNum', 'number', 'Quantity'], ['getOrder', 'Pouch.Material.Content.GetOrder', 'number', 'Get order'], ['useOrder', 'Pouch.Material.Content.UseOrder', 'number', 'Use order']]
    },
    food: {
      label: 'category.food', noun: 'food', section: 'Pouch.Food',
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
      label: 'category.devices', noun: 'device', section: 'Pouch.SpecialParts',
      fields: [['quantity', 'Pouch.SpecialParts.Content.StockNum', 'number', 'Quantity'], ['useOrder', 'Pouch.SpecialParts.Content.UseOrder', 'number', 'Use order']]
    },
    abilities: {
      label: 'category.abilities', noun: 'ability', section: 'Pouch.SpecialPower',
      fields: []
    }
  };

  const catalogName = Object.fromEntries(Object.values(CATALOG.categories || {}).flat().map(item => [item.id, item.name]));
  const catalogByCategory = Object.fromEntries(Object.entries(CATALOG.categories || {}).map(([category, items]) => [category, Object.fromEntries(items.map(item => [item.id, item]))]));
  const catalogIdByName = Object.fromEntries(Object.values(CATALOG.categories || {}).flat().map(item => [item.name.toLowerCase(), item.id]));
  const enumOptions = {
    'equipment-modifier': [['None', 'No bonus'], ['DurabilityUp', 'Durability ↑'], ['DurabilityUpPlus', 'Durability ↑↑'], ['AttackUp', 'Attack ↑'], ['AttackUpPlus', 'Attack ↑↑'], ['FinishBlow', 'Critical Hit ↑'], ['LongThrow', 'Throw ↑↑']],
    'bow-modifier': [['None', 'No bonus'], ['DurabilityUp', 'Durability ↑'], ['DurabilityUpPlus', 'Durability ↑↑'], ['AttackUp', 'Attack ↑'], ['AttackUpPlus', 'Attack ↑↑'], ['RapidFire', 'Quick Shot'], ['FiveWay', 'Arrow Shot x5']],
    'shield-modifier': [['None', 'No bonus'], ['DurabilityUp', 'Durability ↑'], ['DurabilityUpPlus', 'Durability ↑↑'], ['GuardUp', 'Block ↑'], ['GuardUpPlus', 'Block ↑↑']],
    dye: [['None', 'Default color'], ['Blue', 'Blue'], ['Red', 'Red'], ['Yellow', 'Yellow'], ['White', 'White'], ['Black', 'Black'], ['Purple', 'Purple'], ['Green', 'Green'], ['LightBlue', 'Light blue'], ['Navy', 'Navy'], ['Orange', 'Orange'], ['Pink', 'Pink'], ['Crimson', 'Crimson'], ['LightYellow', 'Light yellow'], ['Brown', 'Brown'], ['Gray', 'Gray']],
    'food-effect': [['None', 'None'], ['ResistHot', 'Heat Resistance'], ['ResistBurn', 'Flame Guard'], ['ResistCold', 'Cold Resistance'], ['ResistElectric', 'Shock Resistance'], ['ResitLightning', 'Lightning Resistance'], ['ResistFreeze', 'Freeze Resistance'], ['SwimSpeedUp', 'Swim Speed Up'], ['ClimbSpeedUp', 'Climb Speed Up'], ['AttackUp', 'Attack Up'], ['AttackUpCold', 'Cold Weather Attack Up'], ['AttackUpHot', 'Hot Weather Attack Up'], ['AttackUpThunderstorm', 'Stormy Weather Attack Up'], ['QuietnessUp', 'Stealth Up'], ['SandMoveUp', 'Sand Speed Up'], ['SnowMoveUp', 'Snow Speed Up'], ['DefenseUp', 'Defense Up'], ['AllSpeed', 'Speed Up'], ['MiasmaGuard', 'Gloom Resistance'], ['LifeMaxUp', 'Extra Heart'], ['StaminaRecover', 'Stamina Recovery'], ['ExStaminaMaxUp', 'Extra Stamina'], ['LifeRepair', 'Gloom Recovery'], ['DivingMobilityUp', 'Skydive Mobility Up'], ['NotSlippy', 'Slip Resistance'], ['LightEmission', 'Glow'], ['RupeeGuard', 'Rupee Guard'], ['SwordBeamUp', 'Sword Beam Up'], ['NightMoveSpeedUp', 'Night Movement Speed'], ['DecreaseWallJumpStamina', 'Wall Jump Stamina'], ['DecreaseChargeAttackStamina', 'Charge Attack Stamina'], ['NoBurning', 'No Burning'], ['NoFallDamage', 'No Fall Damage'], ['NoSlip', 'No Slip'], ['DecreaseZonauEnergy', 'Zonai Energy'], ['ZonauEnergyHealUp', 'Zonai Energy Recovery'], ['MiasmaDefenseUp', 'Gloom Defense'], ['ChargePowerUpCold', 'Cold Charge Power'], ['ChargePowerUpHot', 'Hot Charge Power'], ['ChargePowerUpThunderstorm', 'Stormy Charge Power'], ['LightFootprint', 'Light Footprint']]
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
    language: initialLanguage(),
    fileStatus: 'none',
    downloadedName: '',
    currentView: 'status',
    inventoryFilter: 'all',
    inventorySearch: '',
    variableSearch: ''
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const t = (key, values = {}) => {
    const template = translations[state.language]?.[key] ?? translations.en[key] ?? key;
    return String(template).replace(/\{(\w+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match);
  };
  const categoryLabel = info => t(info.label);
  const fieldLabel = label => t(`field.${label}`);
  const enumLabel = label => state.language === 'zh' ? (translations.zh[`enum.${label}`] || label) : label;
  const emptyMarkup = () => `<div class="empty-state"><div class="empty-symbol">◇</div><h3>${escapeHtml(t('empty.title'))}</h3><p>${escapeHtml(t('empty.text'))}</p></div>`;
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
  const nameForId = id => catalogName[id] || id || t('inventory.emptySlot');
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
    if (!Array.isArray(names)) throw new Error(t('error.missingNames', { category: categoryLabel(info) }));
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
    if (entries.length > names.length) throw new Error(t('error.slotsNeeded', { category: categoryLabel(info), needed: entries.length, available: names.length }));
    clearCategory(category);

    entries.forEach((entry, index) => {
      const name = typeof entry === 'string' ? entry : entry[0];
      const overrides = typeof entry === 'string' ? {} : entry[1];
      const id = itemIdForName(category, name);
      if (!id) throw new Error(t('error.catalogMissing', { category: categoryLabel(info), name }));
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
    if (!window.confirm(t('preset.confirm', { count: total }))) return;

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
      setNotice(t('preset.applied', { count: total, quantity: PRESET_QUANTITY }), false);
    } catch (error) {
      setNotice(t('preset.failed', { error: error.message }), true);
    }
  }

  function setNotice(message, error) {
    const notice = $('#notice');
    if (!message) { notice.hidden = true; notice.textContent = ''; return; }
    notice.hidden = false;
    notice.className = `notice${error ? ' error' : ''}`;
    notice.textContent = message;
  }

  function updateFileStatus() {
    const status = $('#file-status');
    if (!status) return;
    if (!state.document || state.fileStatus === 'none') {
      status.textContent = t('file.none');
      return;
    }
    if (state.fileStatus === 'dirty') {
      status.textContent = state.sourceName ? t('file.dirty', { name: state.sourceName }) : t('file.dirtyUnnamed');
      return;
    }
    if (state.fileStatus === 'downloaded') {
      status.textContent = t('file.downloaded', { name: state.downloadedName || state.sourceName });
      return;
    }
    status.textContent = t(state.fileStatus === 'repaired' ? 'file.repaired' : 'file.loaded', { name: state.sourceName });
  }

  function applyLanguage() {
    document.documentElement.lang = state.language === 'en' ? 'en' : 'zh-CN';
    document.title = t('meta.title');
    $$('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
    const toggle = $('#language-toggle');
    const target = $('#language-target');
    const nextLanguage = state.language === 'en' ? 'zh' : 'en';
    target.textContent = nextLanguage === 'en' ? 'EN' : 'ZH';
    toggle.title = t('language.switch');
    toggle.setAttribute('aria-label', t('language.switch'));
    updateFileStatus();
    closeCatalogPicker();
    render();
  }

  function toggleLanguage() {
    state.language = state.language === 'en' ? 'zh' : 'en';
    try {
      localStorage.setItem('defaultClientSaveEditor.language', state.language);
    } catch (error) {
      // Language switching still works when browser storage is unavailable.
    }
    setNotice('', false);
    applyLanguage();
  }

  function markDirty() {
    state.dirty = true;
    state.fileStatus = 'dirty';
    $('#download').disabled = false;
    updateFileStatus();
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
    for (const [name, label] of options) html.push(`<option value="${escapeHtml(name)}"${name === currentName ? ' selected' : ''}>${escapeHtml(enumLabel(label))}</option>`);
    if (!options.some(([name]) => name === currentName)) html.push(`<option value="${escapeHtml(currentName)}" selected>Unknown (${escapeHtml(value)})</option>`);
    html.push('</select>');
    return html.join('');
  }

  function itemInput(info, index, field) {
    const [property, path, type, label] = field;
    const value = valueAt(path, index);
    const data = `data-category="${info.section}" data-index="${index}" data-field="${escapeHtml(property)}"`;
    if (type === 'number') return `<div class="item-field"><span class="field-label">${escapeHtml(fieldLabel(label))}</span><input type="number" ${data} value="${escapeHtml(value ?? 0)}"></div>`;
    if (type === 'item') return `<div class="item-field optional"><span class="field-label">${escapeHtml(fieldLabel(label))}</span><input class="item-reference" list="catalog-all-items" ${data} value="${escapeHtml(value || '')}" placeholder="${escapeHtml(t('inventory.itemId'))}"></div>`;
    return `<div class="item-field"><span class="field-label">${escapeHtml(fieldLabel(label))}</span>${enumSelect(type, value, 'item-enum')}<input type="hidden" ${data} value="${escapeHtml(reverseHashes[String(value)] || 'None')}"></div>`;
  }

  function renderStatus() {
    const statusFields = [
      [t('status.currentRupees'), 'PlayerStatus.CurrentRupee'],
      [t('status.currentHearts'), 'PlayerStatus.Life'],
      [t('status.maximumHearts'), 'PlayerStatus.MaxLife'],
      [t('status.maximumStamina'), 'PlayerStatus.MaxStamina'],
      [t('status.maximumEnergy'), 'PlayerStatus.MaxEnergy'],
      [t('status.extraStamina'), 'PlayerStatus.ExtraStamina'],
      [t('status.extraEnergy'), 'PlayerStatus.ExtraEnergy'],
      [t('status.currentPoes'), 'PlayerStatus.CurrentMamo']
    ];
    const loaded = !!state.document;
    if (!loaded) { $('#view-status').innerHTML = emptyMarkup(); return; }
    const cards = [
      [t('status.configuredItems'), Object.values(categoryInfo).reduce((sum, info) => sum + itemCount(info), 0)],
      [t('status.dataValues'), allValues().reduce((sum, entry) => sum + (Array.isArray(entry.value) ? entry.value.length : 1), 0)],
      [t('status.rupees'), getPath('PlayerStatus.CurrentRupee', 0)],
      [t('status.hearts'), `${getPath('PlayerStatus.Life', 0)} / ${getPath('PlayerStatus.MaxLife', 0)}`]
    ];
    const companions = [
      ['PlayerStatus.Companion.Water.IsSummon', 'companion.water'],
      ['PlayerStatus.Companion.Wind.IsSummon', 'companion.wind'],
      ['PlayerStatus.Companion.Fire.IsSummon', 'companion.fire'],
      ['PlayerStatus.Companion.Electric.IsSummon', 'companion.lightning'],
      ['PlayerStatus.Companion.Soul.IsSummon', 'companion.spirit']
    ];
    const sections = [
      [t('status.player'), statusFields.map(([label, path]) => `<div class="field"><label>${escapeHtml(label)}<span class="item-id">${escapeHtml(path)}</span></label><input type="number" data-status-path="${path}" value="${escapeHtml(getPath(path, 0))}"></div>`).join('')],
      [t('status.capacity'), Object.entries(categoryInfo).filter(([, info]) => info.validNum).map(([category, info]) => `<div class="field"><label>${escapeHtml(categoryLabel(info))}<span class="item-id">${escapeHtml(info.validNum)}</span></label><input type="number" min="0" data-capacity-category="${category}" value="${escapeHtml(capacity(info))}"></div>`).join('')],
      [t('status.companions'), companions.map(([path, label]) => `<div class="field"><label>${escapeHtml(t(label))}<span class="item-id">${escapeHtml(path)}</span></label><input type="checkbox" data-bool-path="${path}"${getPath(path, false) ? ' checked' : ''}></div>`).join('')]
    ];
    $('#view-status').innerHTML = `<div class="view-header"><div><h2>${escapeHtml(t('status.title'))}</h2><p>${escapeHtml(t('status.description'))}</p></div><span class="pill">${escapeHtml(t('status.document'))}</span></div><div class="summary-grid">${cards.map(([label, value]) => `<div class="summary-card"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(value)}</div></div>`).join('')}</div>${sections.map(([title, fields]) => `<section class="status-section"><h3>${escapeHtml(title)}</h3><div class="field-grid">${fields}</div></section>`).join('')}`;
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
    const recipe = category === 'food' ? `<div class="item-field optional"><span class="field-label">${escapeHtml(t('inventory.recipe'))}</span><input class="recipe-input" data-recipe-index="${index}" value="${escapeHtml(categoryArray(info, info.recipe).slice(index * 5, index * 5 + 5).filter(Boolean).join(', '))}" placeholder="${escapeHtml(t('inventory.recipeHint'))}"></div>` : '';
    return `<div class="item-row${active ? '' : ' empty'}" data-row-category="${category}" data-row-index="${index}"><img class="item-icon" src="${escapeHtml(itemIcon(category, id))}" alt=""><div class="item-main"><div class="item-name">${escapeHtml(nameForId(id))}</div><div class="item-id">${escapeHtml(id || t('inventory.emptySlotNumber', { number: index + 1 }))}</div><div class="item-chooser"><input class="catalog-select" list="catalog-${category}" data-name-category="${category}" data-name-index="${index}" value="${escapeHtml(id)}" placeholder="${escapeHtml(t('inventory.searchItem'))}"><button class="browse-catalog" type="button" title="${escapeHtml(t('inventory.browse'))}" aria-label="${escapeHtml(t('inventory.browse'))}" data-browse-category="${category}" data-browse-index="${index}">⌄</button></div></div>${info.fields.map(field => itemInput(info, index, field)).join('')}${recipe}<button class="remove" type="button" title="${escapeHtml(t('inventory.remove'))}" aria-label="${escapeHtml(t('inventory.remove'))}" data-remove-category="${category}" data-remove-index="${index}">×</button></div>`;
  }

  function renderInventory() {
    if (!state.document) { $('#view-inventory').innerHTML = emptyMarkup(); return; }
    ensureDatalists();
    const categories = Object.entries(categoryInfo).filter(([category]) => state.inventoryFilter === 'all' || category === state.inventoryFilter).filter(([category]) => {
      if (!state.inventorySearch) return true;
      const query = state.inventorySearch.toLowerCase();
      const info = categoryInfo[category];
      return `${category} ${categoryLabel(info)}`.toLowerCase().includes(query) || (CATALOG.categories[category] || []).some(item => `${item.id} ${item.name}`.toLowerCase().includes(query)) || itemCount(info) > 0 && categoryArray(info, namePath(info)).some(id => `${id} ${nameForId(id)}`.toLowerCase().includes(query));
    });
    const filterOptions = [['all', t('filter.all')], ...Object.entries(categoryInfo).map(([category, info]) => [category, categoryLabel(info)])].map(([value, label]) => `<option value="${value}"${state.inventoryFilter === value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('');
    const blocks = categories.map(([category, info]) => {
      const names = categoryArray(info, namePath(info));
      const indices = names.map((id, index) => ({ id, index })).filter(entry => entry.id);
      const rows = indices.length ? indices.map(entry => itemRow(info, category, entry.index)).join('') : `<div class="empty-list">${escapeHtml(t('inventory.emptyPouch'))}</div>`;
      const count = info.validNum ? t('count.capacity', { count: indices.length, capacity: capacity(info) }) : t('count.items', { count: indices.length });
      return `<section class="category-block"><div class="category-title"><h3>${escapeHtml(categoryLabel(info))}</h3><span class="pill">${escapeHtml(count)}</span><div class="category-actions"><button class="small-button" data-add-category="${category}">${escapeHtml(t('inventory.add'))}</button>${indices.length && info.fields.some(field => field[0] === 'quantity') ? `<button class="small-button" data-max-category="${category}">${escapeHtml(t('inventory.setQuantity', { quantity: PRESET_QUANTITY }))}</button>` : ''}</div></div><div class="item-list">${rows}</div></section>`;
    }).join('');
    $('#view-inventory').innerHTML = `<div class="view-header"><div><h2>${escapeHtml(t('inventory.title'))}</h2><p>${escapeHtml(t('inventory.description'))}</p></div></div><div class="inventory-toolbar"><input class="search" id="inventory-search" value="${escapeHtml(state.inventorySearch)}" placeholder="${escapeHtml(t('inventory.search'))}"><select class="filter" id="inventory-filter">${filterOptions}</select></div>${blocks || `<div class="empty-list">${escapeHtml(t('inventory.noMatches'))}</div>`}`;
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
    picker.innerHTML = `<div class="catalog-picker-head"><strong>${escapeHtml(categoryLabel(info))}</strong><input class="catalog-picker-search" placeholder="${escapeHtml(t('inventory.catalogSearch', { count: items.length }))}"></div><div class="catalog-picker-list"></div>`;
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
      list.innerHTML = filtered.length ? filtered.map(item => `<button class="catalog-option" type="button" data-catalog-id="${escapeHtml(item.id)}"><img src="${escapeHtml(item.icon)}" alt=""><span class="catalog-option-name">${escapeHtml(item.name)}</span><span class="catalog-option-id">${escapeHtml(item.id)}</span></button>`).join('') : `<div class="empty-list">${escapeHtml(t('inventory.noItemMatches'))}</div>`;
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
    if (index === -1) { setNotice(t('inventory.full', { category: categoryLabel(info), count: names.length }), true); return; }
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
    if (!quantityField) { setNotice(t('inventory.noQuantity', { category: categoryLabel(info) }), false); return; }
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
    if (type === 'Enum' || type === 'EnumArray') return `<input class="variable-input" type="number" step="1" ${data} value="${escapeHtml(value ?? 0)}" title="${escapeHtml(reverseHashes[String(value)] || t('variables.unknownEnum'))}">`;
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
    if (!state.document) { $('#view-variables').innerHTML = emptyMarkup(); return; }
    const query = state.variableSearch.toLowerCase();
    const filteredGroups = [];
    const groups = Object.entries(state.document).map(([sectionName, section]) => {
      const entries = Object.entries(section || {}).map(([path, value]) => ({ sectionName, path, value })).filter(entry => !query || `${entry.sectionName} ${entry.path}`.toLowerCase().includes(query));
      if (!entries.length) return '';
      filteredGroups.push({ sectionName, entries });
      return `<details class="variable-group" data-variable-group="${escapeHtml(sectionName)}"${query ? ' open' : ''}><summary>${escapeHtml(sectionName)}<span>${escapeHtml(t('count.variables', { count: entries.length }))}</span></summary><div class="variable-group-content"></div></details>`;
    }).join('');
    $('#view-variables').innerHTML = `<div class="view-header"><div><h2>${escapeHtml(t('variables.title'))}</h2><p>${escapeHtml(t('variables.description'))}</p></div></div><div class="variable-toolbar"><input class="search" id="variable-search" value="${escapeHtml(state.variableSearch)}" placeholder="${escapeHtml(t('variables.search'))}"><span class="pill">${escapeHtml(t('count.keys', { count: allValues().length }))}</span></div><div class="variable-groups">${groups || `<div class="empty-list">${escapeHtml(t('variables.none'))}</div>`}</div>`;
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
        content.innerHTML = `<table class="variable-table"><thead><tr><th>${escapeHtml(t('variables.path'))}</th><th>${escapeHtml(t('variables.type'))}</th><th>${escapeHtml(t('variables.value'))}</th></tr></thead><tbody>${rows}</tbody></table>`;
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
    if (!state.document) { updateFileStatus(); renderStatus(); return; }
    const totalItems = Object.values(categoryInfo).reduce((sum, info) => sum + itemCount(info), 0);
    $('#inventory-count').textContent = totalItems;
    $('#variable-count').textContent = allValues().length;
    $('#status-count').textContent = t('count.items', { count: 8 });
    if (state.currentView === 'status') renderStatus();
    if (state.currentView === 'inventory') renderInventory();
    if (state.currentView === 'variables') renderVariables();
  }

  function loadText(text, sourceName) {
    try {
      state.document = window.KTML.parse(text);
      const arrowRepaired = repairArrowEquipIndex();
      state.sourceName = sourceName || t('file.defaultName');
      state.dirty = arrowRepaired;
      state.fileStatus = arrowRepaired ? 'repaired' : 'loaded';
      updateFileStatus();
      $('#download').disabled = false;
      setNotice(arrowRepaired
        ? t('notice.loadRepaired')
        : t('notice.loadSuccess'), false);
      render();
    } catch (error) {
      state.document = null;
      state.sourceName = '';
      state.fileStatus = 'none';
      render();
      setNotice(t('notice.parseFailed', { error: error.message }), true);
    }
  }

  function validateDocument() {
    const problems = [];
    for (const [category, info] of Object.entries(categoryInfo)) {
      const names = categoryArray(info, namePath(info));
      if (!Array.isArray(names)) {
        problems.push(t('validate.missing', { category: categoryLabel(info), path: namePath(info) }));
        continue;
      }
      for (const [, path] of info.fields) {
        const values = categoryArray(info, path);
        if (!Array.isArray(values)) problems.push(t('validate.missing', { category: categoryLabel(info), path }));
        else if (values.length !== names.length) problems.push(t('validate.length', { path, actual: values.length, expected: names.length }));
      }
      if (info.recipe) {
        const recipe = categoryArray(info, info.recipe);
        if (!Array.isArray(recipe) || recipe.length !== names.length * 5) problems.push(t('validate.expected', { path: info.recipe, expected: names.length * 5 }));
      }
      const firstEmpty = names.findIndex(value => !value);
      if (firstEmpty !== -1 && names.slice(firstEmpty + 1).some(Boolean)) problems.push(t('validate.gap', { category: categoryLabel(info) }));
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
      setNotice(t('notice.loadDefaultFailed'), true);
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
        const separator = state.language === 'zh' ? '；' : '; ';
        const more = problems.length > 3 ? t('notice.moreProblems', { count: problems.length - 3 }) : '';
        setNotice(t('notice.downloadBlocked', { problems: problems.slice(0, 3).join(separator), more }), true);
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
      state.fileStatus = 'downloaded';
      state.downloadedName = link.download;
      updateFileStatus();
      setNotice(t('notice.downloadSuccess'), false);
    } catch (error) {
      setNotice(t('notice.generateFailed', { error: error.message }), true);
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
    $('#language-toggle').addEventListener('click', toggleLanguage);
    $$('.nav-item').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
    const dropzone = $('#dropzone');
    ['dragenter', 'dragover'].forEach(eventName => dropzone.addEventListener(eventName, event => { event.preventDefault(); dropzone.classList.add('dragover'); }));
    ['dragleave', 'drop'].forEach(eventName => dropzone.addEventListener(eventName, event => { event.preventDefault(); dropzone.classList.remove('dragover'); }));
    dropzone.addEventListener('drop', event => { const file = event.dataTransfer.files[0]; if (file) file.text().then(text => loadText(text, file.name)); });
    window.addEventListener('beforeunload', event => { if (state.dirty) { event.preventDefault(); event.returnValue = ''; } });
    applyLanguage();
    switchView('status');
    loadDefault();
  }

  document.addEventListener('DOMContentLoaded', bind);
}());
