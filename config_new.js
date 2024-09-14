var test = false; //true - для вывода всякой отладочной информации
var fight = false;
var opponent = null;
var kach = false;
var envenom = false;
var skill_active = {};
var opDown = false;
var fromRoom = null;

//противодействие автовыкидыванию
var melt_counter = 0; 
var commandCounter = {
    command: '',
    count: 0
};

//номер панели заклинаний
var numpad_set = 0;
var panel_set = 0;
var str, con, dex, wis, int, cha;
var str_max, con_max, dex_max, wis_max, int_max, cha_max;
var count=0, total=0;
var chars = {
    'Ochokochi': {
        name: 'Ochokochi',
        align: 'n',
        weapon: 'scalpel',
        class: 'thief',
        water: 'barrel',
        water_container: 'bag:food',
        food: 'rusk',
        food_container: 'bag:food',
        weapons: {
            //weapon_main: { name: 'sting', pattern: 'короткий меч "Жало"'},
            //weapon_main: { name: 'knife', pattern: 'резак'},
            //weapon_main: { name: 'sap', pattern: 'мешочек ворюги'},
            //weapon_main: { name: 'awl', pattern: 'старое шило'},
            //weapon_main: { name: 'sword', pattern: 'жестяная сабля'},
            weapon_main: { name: 'scalpel', pattern: 'скальпель владельца Цирка'},
            //shield: { name: 'крышка', pattern: 'крышка от мусорного бака'},
            shield: { name: 'shield', pattern: 'покрытый металлом щит с шипами'},
            range_throw: { name: 'dagger'},
        },
        buffs_needs: {
            //(всегда, при фулбафе, всегда на члена группы, при фулбафе на члена группы)
            //skills:thief:
            'detect hide': new Buff_need(true, true, false, false),
            //'sneak': new Buff_need(true, true, false, false),
            //'hide': new Buff_need(true, true, false, false),
        }
    },
    'Miyamoto': {
        name: 'Miyamoto',
        align: 'n',
        weapon: 'lightsaber',//swiftbird 'warhammer',//'sword',//'hickey', //'арапник',
        weapons: {
            weapon_main: { name: 'lightsaber' },
            weapon_second: { name: 'eyed' },
            range_shoot: { name: 'bow', type: 'bow'}, //type: bow, two-handed
            range_throw: { name: 'spear'},
            hold: 'luck',
            shield: {name: 'shield'},
        },
        class: 'samurai',
        clan: 'hunter',
        water: 'barrel',//'flask',
        water_container: 'bag',
        food: 'rusk',
        food_container: 'bag:food',
        buffs_needs: {
            //(всегда, при фулбафе, всегда на члена группы, при фулбафе на члена группы)
            'ruler aura': new Buff_need(true, true, false, false),
            'group defense': new Buff_need(false, false, false, true),
            'holy word': new Buff_need(false, false, false, true),
            'inspire': new Buff_need(false, true, false, true),
            'shadow cloak': new Buff_need(false, true, false, false),
            'dark shroud': new Buff_need(false, true, false, true),
            'shield': new Buff_need(false, true, false, true),
            'protective shield': new Buff_need(false, true, false, true), 
            'armor': new Buff_need(false, true, false, true),
            'stone skin': new Buff_need(false, true, false, true),
            'protection good': new Buff_need(false, true, false, false),
            'spell resistance': new Buff_need(false, true, false, true),
            'mental block': new Buff_need(true, true, false, false),
            'magic concentrate': new Buff_need(false, true, false, false),
            'protection negative': new Buff_need(false, true, false, false),
            'protection cold': new Buff_need(false, true, false, false),
            'giant strength': new Buff_need(false, false, false, true),
            'detect invis': new Buff_need(false, true, false, false),
            'improved detect': new Buff_need(false, false, false, false),
            'infravision': new Buff_need(false, false, false, false),
            'detect magic': new Buff_need(true, false, false, false),
            'benediction': new Buff_need(false, true, false, true),
        
            //pets:
            'stardust': new Buff_need(false, true, false, true),
            'sanctuary': new Buff_need(true, true, false, true),
            'enhanced armor': new Buff_need(false, true, false, true),
            'haste': new Buff_need(false, false, false, true),
            'bless': new Buff_need(false, true, false, true),
            'dragon skin': new Buff_need(false, true, false, true),
            'frenzy': new Buff_need(false, false, false, true),
        }
    },
    'Ash': {
        name: 'Ash',
        align: 'e',
        weapon: 'whip',//'electrum',
        weapons: {
            weapon_main: { name: 'snake', pattern: 'Кнут с Двумя Головами Змей'},
            shield: { name: 'shield', pattern: 'опасный щит с шипами'},
        },
        class: 'vampire',
        buffs_needs: {}
    },
    'Uesugi': {
        name: 'Uesugi',
        align: 'e',
        weapon: 'warhammer',//'hickey', //'арапник',
        class: 'warrior',
        clan: '',
        water: 'juice',//'flask',
        food: 'rusk',
        buffs_needs: {
            //(всегда, при фулбафе, всегда на члена группы, при фулбафе на члена группы)
            'ruler aura': new Buff_need(true, true, false, false),
            'group defense': new Buff_need(false, false, false, true),
            'holy word': new Buff_need(false, false, false, true),
            'inspire': new Buff_need(false, true, false, true),
            'shadow cloak': new Buff_need(false, true, false, false),
            'dark shroud': new Buff_need(false, true, false, true),
            'shield': new Buff_need(false, true, false, true),
            'protective shield': new Buff_need(false, true, false, true), 
            'armor': new Buff_need(false, true, false, true),
            'stone skin': new Buff_need(false, true, false, true),
            'protection good': new Buff_need(false, true, false, false),
            'spell resistance': new Buff_need(false, true, false, true),
            'mental block': new Buff_need(true, true, false, false),
            'magic concentrate': new Buff_need(false, true, false, false),
            'protection negative': new Buff_need(false, true, false, false),
            'protection cold': new Buff_need(false, true, false, false),
            'giant strength': new Buff_need(false, false, false, true),
            'detect invis': new Buff_need(false, true, false, false),
            'improved detect': new Buff_need(false, false, false, false),
            'infravision': new Buff_need(false, false, false, false),
            'detect magic': new Buff_need(true, false, false, false),
            'benediction': new Buff_need(false, true, false, true),
        
            //pets:
            'stardust': new Buff_need(false, true, false, true),
            'sanctuary': new Buff_need(true, true, false, true),
            'enhanced armor': new Buff_need(false, true, false, true),
            'haste': new Buff_need(false, false, false, true),
            'bless': new Buff_need(false, true, false, true),
            'dragon skin': new Buff_need(false, true, false, true),
            'frenzy': new Buff_need(false, false, false, true),
        }
    },
    'Zaleshanin': {
        name: 'Zaleshanin',
        align: 'n',
        weapon: 'long',
        class: 'thief',
        water: 'flask',
        food: 'rusk',
        buffs_needs: {
            //(всегда, при фулбафе, всегда на члена группы, при фулбафе на члена группы)
            //skills:thief:
            'detect hide': new Buff_need(true, true, false, false),
        }
    },
};
var rest_rooms =  {
    9510:   'lawn',     // Общ.площадь Нового Талоса
    9706:   'mat',      // Кабинет помощника мэра Нового Талоса
    3054:   'chair',    // Храм Лео
    40032:  'mat',      // Мачта галеона   
    580: 'gold',        // Наемники
    10320: 'sill',      // Утеха
};
var match;

var my_char = new Pchar();

var attack_spell_wait = undefined;

var buffQueue = [];

var hasHarp = false;
var isHarp = false;
var timeout = false;
var herbCooldown = false;
var slook = {progress:0};
var lSlook = false;
var counterSkill = {
    attacks: 0,
    counter: 0,
    improves: 0,
    opp: 100,
};
var haggleSkill = {
    rooms: [{vnum: 9628, obj: 'candle', pattern: 'свечу'}],
    room: {},
    has: false,
};
var kachThrowingWeapon = {
    status: false,
    target: "stag",
    targetName: "Белый олень",
    missile: "dagger",
    container: 'bag:throwing',
    missilePattern: 'Бронзовый кинжал .* оставлен здесь\.$',
    missileName: 'бронзовый кинжал',
    missileOnFloor: false,
    missileOnInventory: false,
    targetHere: false,
    targetDirection: '',
    missileWield: false,
};
/*--------------------------------------------------------------------------
 * Триггера - автоматические действия как реакция на какую-то строку в мире.
 *-------------------------------------------------------------------------*/
$('.trigger').on('text', function (e, text) {
    if(text==='') return;
    if(text.match('^no parse:')) return;
    if(text.match('^[kach]')) return;
    if(text.match('^Входящие команды очищены\.$') && my_char.action.act) {
        return;
    }
    if(text.match('^.* наносит повреждения .*\.$')) {
        console.log(`>>>${text}<<<`);
    }
    match = (/^Полночь. Начинается день (.*)\./).exec(text);
    if(match) {
        logWithDate(`[${mudprompt.date.d} (${match[1]}) ${mudprompt.date.m} ${mudprompt.date.y}]`);
    }
    //качаем throwing weapon
    if(kach){ 
        //TODO Ты слишком устал для этого.
        if(text.match('Ты прицеливаешься и мечешь .* на .*\.$')) {
            //echo('<span style="color:red;">ПИУ!!!</span>');
            kachThrowingWeapon.status=true;
            kachThrowingWeapon.missileWield=false;
            if(my_char.action.act==='throw')
                clearAction();
        }
        if(text.match(kachThrowingWeapon.targetName+' стоит слишком близко для броска\.$')) {
            //echo('<span style="color:red;">Клиент на месте!!!</span>');
            kachThrowingWeapon.targetHere=true;
            if(my_char.action.act==='throw')
                clearAction();
        }

        if(text.match('Ты не видишь ничего подобного в .*\.$')) {
            kachThrowingWeapon.status=false;
            //echo('<span style="color:red;">ЗАКОНЧИЛИСЬ ПАТРОНЫ!!!</span>');
            if(my_char.action.act==='get')
                clearAction();
        }
        if(text.match(kachThrowingWeapon.missilePattern)) {
            //echo('<span style="color:red;">о! ножичек!!!</span>');
            kachThrowingWeapon.missileOnFloor=true;
        }
        if(text.match('Ты берешь '+kachThrowingWeapon.missileName+'\.$')) {
            //echo('<span style="color:red;">моё!!!</span>');
            kachThrowingWeapon.missileOnFloor=false;
            kachThrowingWeapon.missileOnInventory=true;
            if(my_char.action.act==='get')
                clearAction();
        }

        if(text.match('Ты берешь '+kachThrowingWeapon.missileName+' из .*\.$')) {
            //echo('<span style="color:red;">перезарядка!!!</span>');
            kachThrowingWeapon.missileOnInventory=true;
            if(my_char.action.act==='get')
                clearAction();
        }

        if(text.match('Ты вооружаешься ')) {
            //echo('<span style="color:red;">READY!!!</span>');
            kachThrowingWeapon.missileOnInventory=false;
            kachThrowingWeapon.missileWield=true;
            if(my_char.action.act==='wield')
                clearAction();
        }

        if(text.match(kachThrowingWeapon.targetName+' прискакал ')) {
            //echo('<span style="color:red;">добрый вечер!!!</span>');
            kachThrowingWeapon.targetHere=true;
        }
    }

    //качаем lore
    if(text.match('^Ты пытаешься вспомнить хоть что-то из древних преданий про эту вещь, но безуспешно.$|^.* -- это .* [0-9]{1,3} уровня.')){
        if(test) console.log("[lore detected]");
        clearAction('lore');
        return;
    }
    
    /* if(text.match(' в прекрасном состоянии\.$')){
        if(test) console.log("[look detected]");
        clearAction('look');
        return;
    } */
    if(my_char.action.act=="look" && text.match("^\\(.*, .* размера\\) .*\.$")){
        if(test) console.log("[look detected]");
        clearAction('look');
        return;
    }
    if(text.match('^Яд, отравлявший .*, испаряется и высыхает\.$')) {
        envenom = false;
        return;
    }
    if(text.match('^Прикосновение .* наполняется смертельным ядом\.$|^Прикосновение .* уже напоено ядом\.$')) {
        envenom = true;
        clearAction('envenom');
        return;
    }
    if(text.match('^Твоя попытка отравления закончилась неудачей$')) {
        envenom = false;
        clearAction('envenom');
        return;
    }

    if(text.match('^Ты перестаешь скрываться в тенях.$') ||
        text.match('^Ты чувствуешь, что снова производишь слишком много шума при ходьбе.$')) {
            if(test) console.log("[vis detected]");
        clearAction('visible');
    }
    if(text.match('^Без указания цели это умение можно применять только в бою\.$')){
        if(my_char.action.act==='trip' || my_char.action.act==='dirt' )
            clearAction();
    }
    //dirt
    if(text.match('^Твой бросок грязью ')) {
        clearAction('dirt');
    }
    if(text.match('^У .* глаза на стебельках -- их засыпать грязью не получится\.$|^У .* нет глаз -- на нее это умение не подействует\.$|^Ты метко швыряешь .* прямо в глаза .*, ослепляя .*!$|^.* уже ничего не вид.*\.$')) {
        skill_active['dirt kicking']=true;
        clearAction('dirt');
    }
    if(text.match('^.* наконец протирает глаза от попавшей туда грязи\.$')) {
        skill_active['dirt kicking']=false;
        clearAction('dirt');
    }
    //kick
    if(text.match('^Твой пинок ')) {
        clearAction('kick');
    }
    //trip
    if(text.match('^Твоя подножка ')) {
        clearAction('trip');
    }
    if(text.match('^Твоя подсечка не сможет навредить летучему противнику\.$|^У .* нет ног, подсекать тут нечего\.$|^.* падает навзничь!$|^.* уже лежит\.$')) {
        skill_active['trip']=true;
        clearAction('trip');
    }
    if(text.match('^.* поднимается и встает, готовясь атаковать\.$')) {
        skill_active['trip']=false;
        clearAction('trip');
    }

    match = (/^(?<type>Умение|Заклинание) '(?<name>.*?)' или '(?<runame>.*?)', входит в групп(?:у|ы) .*\.$/).exec(text);
    if(match){
        if(test) console.log("TRIGGER: slook detected!");
        lSlook = true;
        slook.name = match.groups.name;
        slook.runame = match.groups.runame;
        slook.type = match.groups.type==='Умение'?'skills':'spells';

        clearAction('slook');
        return;
    }
    if(lSlook) {
        //Доступно тебе с уровня 20, изучено на 49%, работает на 48%.
        //* Доступно тебе с уровня 1, пока не изучено.
        match = (/\* Доступно тебе с уровня [0-9]{1,3}, (?:(пока не изучено)|(?:изучено на ([0-9]{1,3})%))(?:, работает на [0-9]{1,3}%)?\./).exec(text);
        if(match) {
            if(test) console.log("TRIGGER: slook progress detected!");
            slook.progress = match[1]==='пока не изучено' ? 1 : match[2];
            return;
        }
        match = (/\* Расход (?:маны (?<mana>[0-9]{1,4}))?(?:, )?(?:шагов (?<moves>[0-9]{1,4}))?\./).exec(text);
        if(match) {
            if(test) console.log("TRIGGER: slook cost detected!");
            slook.mana = match.groups.mana ? match.groups.mana : 0;
            slook.moves = match.groups.moves ? match.groups.moves : 0;
            return;
        }

        if(text.match('(^См. также (справка|help) .*\.$)|(^Формат: .*$)')) {
            if(test) {
                console.log("TRIGGER: slook finish detected!");
                console.log('TRIGGER [slook result]:');console.log(slook);
            }
            logWithDate(`-->${slook.name}: ${slook.progress}%`);
            let skillName;
            if(my_char[slook.type][slook.name]==undefined)
                skillName = slook.runame;
            if(my_char[slook.type][slook.runame]==undefined)
                skillName = slook.name;

            if(my_char[slook.type]==undefined) my_char[slook.type] = {};
            if(my_char[slook.type][skillName]==undefined) my_char[slook.type][skillName] = {};
            Object.assign(my_char[slook.type][skillName], slook);
            //console.log('my_char['+slook.type+']['+skillName+']',my_char[slook.type][skillName]);
            slook = {progress:0};
            lSlook = false;
        }
        return;
    }
    //качаем haggle
    if(text.match(`Ты покупаешь ${haggleSkill?.room?.pattern ?? 'свечу'} за `)){
        haggleSkill.has = true;
        clearAction("buy");
    }
    if(text.match(`Ты продаешь ${haggleSkill?.room?.pattern ?? 'свечу'} за `)){
        haggleSkill.has = false;
        clearAction("sell");
    }

    match = (/^Ты учишься на своих ошибках, и твое умение ('.*') совершенствуется.$|^Теперь ты гораздо лучше владеешь искусством ('.*')!$/).exec(text);
    if(match){
        if(test)console.log('match',match);
        let slookSkill = match[1]==undefined?match[2]:match[1];
        //echo('-->[slook '+slookSkill+']');
        doAct('slook', slookSkill);
        if(kach && slookSkill === "'counter'") {
            counterSkill.improves++;
        }
        return;
    }
    // *** качаем wand *** //
    /* if(text.match("Ты берешь арфу из большого камня.")){
        hasHarp=true;
        clearAction('get');
    }
    if(text.match("Ты берешь в руки арфу.")){
        isHarp=true;
        clearAction('hold');
    }
    if(text.match("Твоя арфа разваливается на куски.")){
        hasHarp=false;
        isHarp=false;
    }
    if(text.match("Ты взмахиваешь арфой на себя.")){
        clearAction('use');
    } */
    /*  if(text.match("Твоя арфа разваливается на куски.")){
            echo('-->[new harp]');
            send('get harp rock|wear harp|use harp');
        }
        if(text.match("Ты взмахиваешь арфой на себя.")){
            echo('-->[s|s|use harp]');
            send('s|s|use harp');
        }
    */
    // *** end wand *** //

    if(text.match("Ты садишься отдыхать.|Ты садишься .* и отдыхаешь.")){
        clearAction('rest');
    }
    if(text.match("$Ты ложишься спать|Ты засыпаешь.")){
        clearAction('sleep');
    }
    if(text.match("Ты ищешь целебные травы, но ничего не находишь.")) {
        clearAction('herb');
    } 
    if(text.match("Ты собираешь ароматные травы на окрестных холмах.")
    || text.match("Ты пока не можешь искать травы, подожди немного.")){
        herbCooldown = true;
        clearAction('herb');
    }
    if(text.match("Ты чувствуешь, что вновь настало удачное время для сбора лечебных трав.")){
        herbCooldown=false;
    }

    match = (/^ *сила *([0-9]{1,2}) \(из ([0-9]{1,2})\) *сложение *([0-9]{1,2}) \(из ([0-9]{1,2})\) *ловкость *([0-9]{1,2}) \(из ([0-9]{1,2})\)$/).exec(text);
    if(match) {
        str = Number(match[1]);
        str_max = Number(match[2]); 
        con = Number(match[3]);
        con_max = Number(match[4]); 
        dex = Number(match[5]);
        dex_max = Number(match[6]); 
        return;
    }
    match = (/^ *мудрость *([0-9]{1,2}) \(из ([0-9]{1,2})\) *интеллект *([0-9]{1,2}) \(из ([0-9]{1,2})\) *обаяние *([0-9]{1,2}) \(из ([0-9]{1,2})\)$/).exec(text);
    if(match) {
        wis = Number(match[1]);
        wis_max = Number(match[2]); 
        int = Number(match[3]);
        int_max = Number(match[4]); 
        cha = Number(match[5]);
        cha_max = Number(match[6]);
        //bonus = (wis+int+dex) - (wis_max+dex_max+int_max-3);
        total = wis + int + cha + str + con + dex;
        if(
            str>=15 && cha >= 18 && 
            (wis+con+dex) >= (wis_max+dex_max+con_max-3)
        ) {
            echo("("+total+")?("+(int+15+18+wis_max+dex_max+con_max-3)+") "+"YES: "+(wis+dex+int)+" >= "+(wis_max+dex_max+int_max-3)+ "("+int+"int)");
        }else{
            count++;
            if(count>20) {send("sca s");count=0;}
            echo("("+total+")?("+(int+15+18+wis_max+dex_max+con_max-3)+") "+"NO: "+(wis+dex+con)+" >= "+(wis_max+dex_max+con_max-3) + "("+str+"str)" + "("+cha+"cha)"+ "("+int+"int)");
            send("гов лекарь нет");
        }
        return;
    }

    /* [#prompt] + [#battleprompt] example: <1111/1111 2222/2222 333/333 [time][exits]>[0W0D]
     * промпт по умолчанию   
     *      <3084/3084зд 4800/4800ман 756/756шг 3939оп Вых:СВЮЗ>
     *      <3084/3084зд 4309/4800ман 756/756шг 3939оп Вых:СВЮЗ> [100%:90%]
     * Miyamoto, Ash
     *      prompt [%r] %S||%L%c<{r%h{x/%H {b%m{x/%M %v/%V [%T][{y%e{x]>[%W]
     *      battleprompt [%r] %S||%L%c<{r%h{x/%H {b%m{x/%M %v/%V [%T][{y%e{x]>[%W]({r%y{x:{Y%o{x) 
     * */
    match = (/^(<([0-9]{1,5})\/([0-9]{1,5}) ([0-9]{1,5})\/([0-9]{1,5}) ([0-9]{1,5})\/([0-9]{1,5}) \[(.*)]\[.*]>\[.*](\([0-9]{1,3}%:(?<opp>[0-9]{1,3})%\))?)|(<([0-9]{1,5})\/([0-9]{1,5})зд ([0-9]{1,5})\/([0-9]{1,5})ман ([0-9]{1,5})\/([0-9]{1,5})шг ([0-9]{1,5})оп Вых:.*>( \[[0-9]{1,3}%:[0-9]{1,3}%\])?)$/).exec(text);
    if (match) {
        if(match?.groups?.opp) fight = true;
        else {
            fight = false;
            opponent = null;
            skill_active = {};
        }

        if(kach && match.groups && match.groups.opp) {
            counterSkill.opp = match.groups.opp;
            if(kach && my_char.hasSkill("counter") && my_char.action.act === undefined) {
                echo("<span style='color:red;'>prompt flee</span>");
                doAct('flee');
            }
        }
        promptRecived(false);
        return;
    }
    match = (/^<(AFK|АФК)>[\s]?$/).exec(text);
    if (match) {
        promptRecived(true);
        return;
    }
    if (!my_char.init) return;
    if(fight) {
        match = (/(.*) ((в прекрасном состоянии)|(име.* несколько царапин)|(име.* несколько небольших синяков и царапин)|(име.* довольно много ран)|(име.* несколько больших, опасных ран и царапин)|(выгляд.* сильно поврежденн.*)|(в ужасном состоянии))\./).exec(text);
        if(match)
            opponent = match[1];
    }

    match = (/^Режим AFK в(ы)?ключен.$/).exec(text);
    if (match) {
        if(test) console.log("[AFK trigger]");
        clearAction('afk');
    }
    if (text.match('^Ты прячешься в тенях.$')) {
        if(test) console.log("[Fade trigger]");
        my_char.was_fade = null;
        clearAction('fade');
    }

    if (text.match('^Ты растворяешься в воздухе.$')) {
        if (++melt_counter % 10 === 0)
            send('who');
        else
            send('where');
        echo('[melt:' + melt_counter + ']');

    }

    if (text.match('В твоей голове звучат торжественные слова на тайном наречии Азазеля:')) {
        if(test) console.log("[wait for Azazel words]");
        lAzazel = true;
        return;
    }
    
    if(lAzazel) {
        match = (/[\s]*([\w\s]*), ([\w\s]*), ([\w\s]*)/).exec(text);
        if(match) {
            if(test) console.log('[new Azazel words]',[match[1],match[2],match[3]]);
            azazel = new Azazel(match[1],match[2],match[3]);
            setTimeout(() => azazel=new Azazel(), 35*60*1000);
        } else {
            if(test) console.log('[no any Azazel words]');
        }
        lAzazel = false;
    }

    if(test) console.log(`[buffPatterns check started]:[${text}]`);
    buffPatterns.forEach(function (elem) {
        if (buffs_list[elem[0]] !== undefined) {
            if (text.match(elem[1])) {
                if(test) console.log("[buffPattert trigger]:"+elem[0]);
                
                my_char.affChanged = true;
                buffQueue.push(new BuffQueue(elem[0], elem[2], elem[3], new Action(my_char.action.act, my_char.action.command, my_char.action.target)));
                if (my_char.action.command !== undefined
                    && my_char.action.command === 'cancellation')
                    clearAction();
            }
        }
    });
    if(test) console.log("[buffPatterns check finished]");

    //[#trip]
    if (text.match('^От неудачного удара стражник тролль оступается и неуклюже валится наземь!$')
    || text.match('^От неудачной попытки уворота стражник тролль оступается и неуклюже валится наземь!$')
    || text.match('^Когда ты уворачиваешься от атаки стражника тролля, он оступается и неуклюже валится наземь!$')
    || text.match('^Стражник тролль не может устоять на ногах и падает вниз!$')) {
        opDown = true;
    }
    if (text.match('^Стражник тролль наконец поднимается и встает, готовясь атаковать.$')) {
        opDown = false;
    }

    //-------------------------------------------------------------------------//
    if(kach && my_char.hasSkill("counter")) {
        //[#counter]
        /*
            - нападает вор - убегаем
            - убежали - ждем вора
            - не получилось убежать - убегаем
            - уронились - встаём (выносим за кач)
            - если у вора мало жизни, бежим в северо-западный угол вокруг всей доски
        */
        if(text.match("^Ты пронзительно кричишь 'Помогите! На меня напал вор!'$")) {
            if(test)console.log('kach->counter: attack trigger');
            counterSkill.attacks++;
            if(checkPose('fight') && my_char.hasSkill("counter"))
                doAct('flee');
        }
        if(text.match("^Ты направляешь удар вора против него!$")) {
            if(test)console.log('kach->counter: counter trigger');
            counterSkill.counter++;
        }
        if(text.match("^Ты убегаешь с поля битвы!$")) {
            if(test)console.log('kach->counter: flee trigger');

            clearAction('flee');            
            if(mudprompt.vnum===4200) {
                if(checkPose('stand')) send('run W');
            }

            if(40 > counterSkill.opp) {
                if(checkPose('stand')) send('run WSENW');
            }

        }
        match = (/^Вор сбежал на (?<direction>.*)\.$/).exec(text);
        if(match && match.groups && match.groups.direction) {
            if(test) console.log('kach->counter: try to follow thief: ->', match.groups.direction)
            if(checkPose('stand')) send(match.groups.direction);
        }
        if(text.match("^Это будет слишком большим позором для тебя!$")) {
            if(test)console.log('kach->counter: samurai trigger');

            clearAction('flee');
            if(my_char.hasSkill("counter") && checkPose('fight'))
                doAct('flee');
        }
        if(text.match("^Ты поднимаешься и встаешь, готовясь атаковать.$")) {
            clearAction('stand');
            if(my_char.hasSkill("counter") && checkPose('fight'))
                doAct('flee');
        }
        //[/#counter]
    }
    if(text.match("^Уфф\.\.\. Но ведь ты отдыхаешь\.\.\.$")) {
        if(my_char.action.act!==undefined) clearAction();
        my_char.needsChanged = true;
    }
    if(text.match("^Ты не можешь удержать равновесие и неуклюже валишься на .*\.$|^Ты падаешь навзничь!$")) {
        if(test)console.log('---->: drop trigger');
        my_char.needsChanged = true;
        /* if(my_char.action.act === 'flee' || my_char.action.act === 'trip' || my_char.action.act === 'dirt') {
            clearAction();
            send("\\");
        }
        if(my_char.action.act===undefined)
            doAct('stand'); */
    }
    if(text.match("^Ты поднимаешься и встаешь, готовясь атаковать\.$|^Ты встаешь\.$")) {
        clearAction('stand');        
        my_char.needsChanged = true;
    }

    //-------------------------------------------------------------------------//
    //[#weapon]
    if (text.match('ВЫБИЛ.? у тебя .*, и он.? пада.?т .*!')) {
        //console.log('MATCH:'+text+'\n');
        if(test)console.log('[#weapon] armed:'+my_char.armed+' armed_second:'+my_char.armed_second+'\n');

        my_char.eqChanged = true;
        if(!my_char.armed || my_char.armed==2) {
            my_char.armed = 0;
            //if(test) 
            console.log('[#weapon](set armed=0) ['+text+']');
        }
        if(my_char.armed_second==3){
            my_char.armed_second = 0;
           //if(test) 
           console.log('[#weapon](set armed_second=0) ['+text+']');
        }
    }
    if (text.match(' ВЫБИЛ.? у тебя оружие!$')) {
        //console.log('MATCH:'+text+'\n');
        if(test) console.log('[#weapon] armed:'+my_char.armed+' armed_second:'+my_char.armed_second+'\n');

        my_char.eqChanged = true;
        my_char.armed = 1;
        echo('<span style="color:red;">*******NEED FIX*********</span>');
        //if(test) 
        console.log('[#weapon](set armed=1)*******NEED FIX*********\n');
    }
    if (my_char.action.act === 'get' && text.match('^Ты берешь .*\.$')) {
        //console.log('MATCH:'+text+'\n');
        if(test) console.log('[#weapon] armed:'+my_char.armed+' armed_second:'+my_char.armed_second+'\n');

        clearAction();
        if (my_char.armed === 0) {
            my_char.armed = 1;
            my_char.eqChanged = true;
            //if(test) 
            console.log('[#weapon](set armed=1) ['+text+']');
        }
        if (my_char.armed_second === 0) {
            my_char.armed_second = 1;
            my_char.eqChanged = true;
            //if(test) 
            console.log('[#weapon](set armed_second=1) ['+text+']');
        }
    }
    match = (/^От боли ты роняешь (.*)!$/).exec(text);
    if (match) {
        my_char.eqChanged = true;
        if(my_char.shield_equip?.pattern 
            && match[1].match(my_char.shield_equip.pattern)) {
            my_char.shield = false;
            if(kach) send('nsh');
            return;
        } else if(my_char.weapon?.pattern 
            && match[1].match(my_char.weapon.pattern)) {
            my_char.armed = 0;
            console.log('[#weapon](set armed=0) ['+text+']');
            return;
        } else if(my_char.second?.pattern 
            && match[1].match(my_char.second.pattern)) {
            my_char.armed_second = 0;
            console.log('[#weapon](set armed_second=0) ['+text+']');
            return;
        } 
        echo('<span style="color:red;">*******УРОНЕННОЕ НЕ ОБРАБОТАНО*********</span>');
        console.warn(`НЕ ОТРАБОТАЛО УРОНЕННОЕ: [${text}]`);
    }
    //[#shield]
    if (text.match('^.* превращается в труху и опилки.$')
    || text.match('^.* раскалывается на куски.$')
    || text.match('^.* распадается на части.$')) {
        my_char.shield = false;
        if(kach) send('nsh');
    }
    if (text.match('^Ты надеваешь .* как щит.$')) {
        my_char.shield = true;
    }

    match = (/^Ты вооружаешься .*?(?<main> как основным оружием)?(?<second> как вторичным оружием)?\.$/).exec(text);
    if (match) {
        //console.log('MATCH:'+text+'\n');
        if(test) console.log('[#weapon] armed:'+my_char.armed+' armed_second:'+my_char.armed_second+'\n');

        if(match.groups && match.groups.main) {
            my_char.armed_second = 3;
            //if(test) 
            console.log('[#weapon](set armed_second=3) ['+text+']');
            return;
        }
        if(match.groups && match.groups.second
            && my_char.action.act === 'second' && my_char.action.command === my_char.second.name) {
            clearAction();
            my_char.armed_second = 2;
            //if(test) 
            console.log('[#weapon](set armed_second=2) ['+text+']');
            return;
        }

        
        clearAction("wield");
        my_char.armed = 2;
        //if(test) 
        console.log('[#weapon](set armed=2) ['+text+']');
        if(my_char.armed_second!==false && my_char.armed_second===3) {
            my_char.armed_second=1;
            //if(test) 
            console.log('[#weapon](set armed=1) ['+text+']');
            my_char.eqChanged = true;
        }
    }
    //[#armed] 0 - без оружия(оружие на земле), 1 - оружие в мешке, 2 - вооружен
    //[#armed_second] false; 0 - на земле, 1 - инвентарь, 2 - вооружен, 3 - первичное
    
    //Ты снимаешь световой меч Миямото.
    //Ты снимаешь глазастый кинжал Миямото.
    //Ты снимаешь охотничий лук Миямото.
    //Ты снимаешь колчан.
    if(text.match('Ты снимаешь колчан.')) {
        console.log("MATCH: remove:"+text, my_char.action);
        my_char.quiver = false;
        console.log('[#weapon_change][set quiver = false]');
    }
    match = (/^Ты снимаешь .*\.$/).exec(text);
    if(match && my_char.action.act === 'remove') {
        //console.log("MATCH: remove:"+text, my_char.action);
        if(my_char.action.command === my_char.weapon.name) {
            console.log('[#weapon_change][set armed = 1] ['+text+']');
            my_char.armed = 1;
            my_char.eqChanged = true;
        }

        if(my_char.action.command === my_char.second.name) {
            console.log('[#weapon_change][set armed_second = 1] ['+text+']');
            my_char.armed_second=1;
            my_char.eqChanged = true;
        }

        if(my_char.action.command === 'quiver') {
            console.log('[#weapon_change][set quiver = false] ['+text+']');
            my_char.quiver=false;
            my_char.eqChanged = true;
        }

        if(my_char.eqChanged) {
            clearAction();
            return;
        }
    }
     if(text.match('Ты берешь в руки колчан.')) {
        console.log("MATCH:"+text, my_char.action);
        my_char.quiver = true;
        console.log('[#weapon_change][set quiver = true] ['+text+']');
        if(my_char.action.act === 'wear' && my_char.action.command==='quiver') {
            my_char.eqChanged = true;
            clearAction();
            return;          
        }
    }
    
    //-------------------------------------------------------------------------//

    if (text.match('^Ты не можешь сконцентрироваться.$')
        || text.match('^Увы, никого с таким именем в этой местности обнаружить не удается.$')
        || text.match('^Ты пытаешься сотворить заклинание, но изолирующий экран блокирует тебя.$')
        || text.match('^Ты пытаешься сотворить заклинание, но теряешь концентрацию и терпишь неудачу.$')
        || text.match('^Твоя попытка закончилась неудачей.$')
        || text.match('На кого именно ты хочешь произнести заклинание') 
        || text.match('Это заклинание нельзя использовать во время сражения.') ) {
        
        if(test) console.log('[spell fail trigger]')
        clearAction();
        if (my_char.fullbuff.target && (text.match('На кого именно ты хочешь произнести заклинание') || text.match('^Увы, никого с таким именем в этой местности обнаружить не удается.$'))) {
        	my_char.fullbuff = new Fullbuff();
        	echo('[target not found -> fullbuff canceled]\n');
    	}
    }
    if (text.match('^Ты просыпаешься и встаешь.$')
        || text.match('^Ты уже стоишь.$') || text.match('^Ты встаешь.$') || text.match('^Ты уже сражаешься!$')) {

        clearAction();
        if (my_char.fullbuff.target && text.match('На кого именно ты хочешь произнести заклинание')) {
        	my_char.fullbuff = new Fullbuff();
        	echo('[target not found -> fullbuff canceled]\n');
    	}
    }
    //[#ruler badge]
    if (text.match('^Серебряный символ Хранителя Закона превращается в пыль.$')) {
        //if(test)
        echo("[ruler badge expire triger]");
        my_char.ruler_badge = false;
        my_char.needsChanged = true;
    }
    if (text.match('^Ты надеваешь символ Хранителя Закона!$') 
        || text.match('^Но у тебя уже что-то надето на шею.$')) {
        //if(test)
        echo("[ruler badge wear triger]");
        my_char.ruler_badge = true;
        my_char.needsChanged = true;
        if (my_char.action.command !== undefined 
            && my_char.action.command === 'ruler badge') {
            clearAction();
        }

    }

    //[#food][#drink]
    if (text.match('^Ты ешь .*\.$') || text.match('^У тебя нет этого.$') || text.match('^Это несъедобно.$')) {
        if (my_char.action.act !== undefined) {
            clearAction('eat');
            my_char.lfood = false;
        }
    }
    if (text.match('^Ты больше не чувствуешь голода.$')) {
        my_char.hunger = 0;
        my_char.needsChanged = true;
    }
    if (text.match('^Ты хочешь есть.$')) {
        my_char.hunger++;
        my_char.needsChanged = true;
    }
    if (text.match('^Ты умираешь от голода!$')) {
        my_char.hunger = 10;
        my_char.needsChanged = true;
    }
    if (text.match('^Ты взмахиваешь руками, и с неба падает манна небесная.$')
        || text.match('^Волею Дворкина тебе в руки падает манна небесная на пропитание.$')
        || text.match('^Ты прищуриваешься и выращиваешь у себя на ладони магический гриб.$')//Ты взмахиваешь руками и создаешь магический гриб.
    ) {
        my_char.lfood = 1;
        my_char.needsChanged = true;
        if (my_char.action.command === 'create food')
            clearAction();
    }
    if(text.match('^Ты берешь .* из .*\.$')) {
        if(my_char.action.act == 'get ' + my_char.food + ' ' + my_char.food_container) {
            my_char.lfood = 1;
            my_char.needsChanged = true;
            clearAction();
        }
        if(my_char.action.act == 'get ' + my_char.water + ' ' + my_char.water_container) {
            my_char.lwater = 1;
            my_char.water_location = 'inv';
            my_char.needsChanged = true;
            clearAction();
        }
    }

    if (text.match(' родник высыхает.$')) {
        my_char.lwater = false;
    }
    //Ты не находишь этого.
    if (text.match('^Ты не находишь это(го)?.$') || text.match('^Здесь пусто.$')) {
        clearAction('drink');
        my_char.lwater = false;
    }
    if (text.match('^Ты хочешь пить.$')) {
        my_char.thirst++;
        my_char.needsChanged = true;
        // echo('[буль-буль:' + my_char.thirst + ']\n');
    }
    if (text.match('^Ты умираешь от жажды!$')) {
        my_char.thirst = 10;
        my_char.needsChanged = true;
        // echo('[буль-буль:' + my_char.thirst + ']\n');
    }
    if (text.match('^Ты щелкаешь пальцами, и из земли пробивается магический родник.$') //text.match(' родник пробивается сквозь землю.$')        
        || text.match('^Милостью .* из земли пробивается священный родник.$')
        || text.match('^Жестяная фляга наполнена.$')
        || text.match('^Милостью .* ты наполняешь жестяную флягу святой водой.$')
        || text.match('^В жестяной фляге уже что-то плещется.$')
        || text.match('^Ты хочешь сделать тут озеро?')
        || text.match('^В этой местности и так есть чем напиться.')) {
        if(test) console.log("[water creation trigger]");
        my_char.lwater = 1;
        if (my_char.action.command == 'spring' || my_char.action.command == 'create water')
            clearAction();
    }
    if (text.match('^Ты пьешь [^\s]* из ')) {
        if (my_char.action.act == 'drink')
            clearAction();
    }
    if (text.match('^Ты больше не чувствуешь жажды.$')) {
        my_char.thirst = 0;
        //my_char.lwater = false;
        my_char.needsChanged = true;
    }
    if(text.match('^Ты кладешь .* в .*.$')) {
        if(my_char.action.act == 'put ' + my_char.water + ' ' + my_char.water_container) {
            //TODO: отслеживать жидкость в сосуде. Наполнять если пустой по возможности.
            my_char.lwater = false;
            my_char.water_location = my_char.water_container;
            clearAction();
        }
    }

    //[#else]
    if (text.match('^(Ok|Твой последователь должен быть рядом с тобой)\.$')) {
        var not_here = '';
        if(text.match('Твой последователь должен быть рядом с тобой')){
            not_here = '[not here]';
            my_char.fullbuff.away.push(my_char.group.members[my_char.action.target].name);
        }
        if(test) console.log('-->"Ok.'+not_here+'" match!!!<--\n');
        if (my_char.action.act !== undefined) {
            if (my_char.action.act==='order') {
                clearAction();
            }
        }
    }
    if (text.match('^.* произносит \'Хозяин, у меня мана кончилась!\'\.$')) {
        if(test) console.log('-->empty mana trigger!!!<--\n');
        if (my_char.action.act !== undefined) {
            if(my_char.fullbuff.target!=null) {
                my_char.fullbuff.empty.push(my_char.group.members[my_char.action.target].name);
            }
            if (my_char.action.act==='order') {
                clearAction();
            }
        }
    }


    if (text.match('Обессилев, ты падаешь лицом вниз!')) {
        //        echo('>>> ЕЩЕ РАЗОК!!!\n');
        //        send('встать|выбить ' + doorToBash);
    }

    // к стандартным уведомлениям добавлен хрустальный шар и поздравлялки. Убраны уведомления от некоторых мобов. [#говоруны]
    if (!text.match('^Валькирия |^Русалка |^The Ofcol cityguard |^Стражник |^Водяной |^The weaponsmith |^Архивариус |^Мальчик |^Булочник |^Колдун |^Ювелир |^Хассан |^Охранник султана |^Продавец доспехов |^Оружейник |^Бакалейщик ')
        && (
            //text.match('^\\[ic\\] ') ||
            //text.match('^\\[ooc\\] ') ||
            text.match(' говорит тебе \'.*\'$') ||
            text.match(' произносит \'.*\'$') // ||
            //text.match('^\\[RULER\\].*$') ||
            //text.match('^\\Тихий голос из хрустального шара:\\ .*$') ||
            //text.match('\\ поздравляет \'.*\'$')
        )
    ) {
        //notify(text);
        logWithDate(text);
    }
    if(text.match('^Ты говоришь .* \'.*\'$') || text.match('^Ты произносишь \'.*\'$')){
        logWithDate(text);
    }

});

/*----------------------------------------------------------------------------
 * Алиасы - свои команды с аргументами. Так же см. help alias про алиасы в игре.
 *----------------------------------------------------------------------------*/
// Здесь хранится текущая жертва для выстрелов из лука или удаленных заклинаний.
var victim;

// Здесь хранится, какую дверь пытаемся вышибить.
var doorToBash = 'n';

// Здесь хранится оружия для триггера на выбивание из рук.
var weapon = 'dagger';

// Вспомогательная функция для выполнения команды с аргументами.
function command(e, cmd, text, handler) {
    var match, re;

    // Попытаться распознать команду в формате 'cmd' или 'cmd аргумент'
    re = new RegExp('^' + cmd + '(?:(?: +)(.*))?$');
    match = re.exec(text);
    if (!match)
        return false;

    // Нашли соответствие. Аргументы передаем в параметры функции-обработчика команды.
    handler(match);
    e.stopPropagation(); // команда обработана локально - не отправлять на сервер
}

// Примеры алиасов.
$('.trigger').on('input', function (e, text) {
    //цифра - номер заклинания для установки в my_char.attack_spells.set
    if(attack_spell_wait!=undefined){
        match = (/^([0-9]{1,2}) ?/).exec(text);
        if(match) {
            let new_spell = my_char.attack_spells.list[attack_spell_wait.group][match[0]];
            if(new_spell!=undefined) {
                my_char.attack_spells.set[numpad_set][attack_spell_wait.group][attack_spell_wait.key]= new_spell;

                echo(my_char.attack_spells.get_prompt());
 
                if(test) console.log('new attack spell ['+attack_spell_wait.group+']['+attack_spell_wait.key+']->'+new_spell);
            }
            attack_spell_wait=undefined;
            e.stopPropagation();
        }
    }
    //смена оружия
     command(e, '[0-9]{1}', text, function (args) {
        if (my_char.weapon_sets[args[0]]) {
            if(my_char.weapon_sets[args[0]]!==my_char.weapon_set) {
                my_char.weapon_set_change = my_char.weapon_sets[args[0]];
                my_char.eqChanged = true;
                //if(test) console.log
                console.log('-->new weapon set ['+my_char.weapon_set+']->['+my_char.weapon_set_change+']');
                my_char.eqChanged = true;
                checkEquip();
                e.stopPropagation();
            } else {
                echo('match:'+args[0]+'('+my_char.weapon_sets[args[0]]+') weapon_set:'+my_char.weapon_set);
            }
        }
    });

    // Установить оружие (см. тригер выше), например: /weapon меч
    command(e, '/weapon', text, function (args) {
        weapon = args[1];
        echo('>>> Твое оружие теперь ' + weapon + "\n");
    });

    //приказать всем
    command(e, 'ord(?:er)?', text, function (args) {
        args = args[1].toLowerCase().split(' ');

        if (test) {
            args.forEach(function (t, number) {
                //if (number > 0)
                console.log(number + ':[' + t + '];\n');
            });
            console.log('(total:' + args.length + ')\n');
        }
        if (args[0] === 'clear') {
            my_char.order = new Order();
            my_char.ordersChange = true;
        } else if (args[0] === 'all') {
            echo('>>> Начинаем всем приказывать \n');
            my_char.order = new Order(args.join(' ').replace(args[0] + ' ', ''));
            if(test) console.log('-->' + my_char.order.command);
            my_char.ordersChange = true;
            doOrder();
        } else {
            send(text);
        }
    });
    
    command(e, 'var', text, function (args) {
        let result;
        if(args[1]==='char') result=my_char;

        console.log(args[1],result);
    });
    command(e, 'kach', text, function (args) {
        kach=!kach;
        let msg = "KACH "+(kach?"ON":"OFF")+"!!!";
        echo(`<span style='color:lightgreen;'>${msg}</span>`);
        console.log(msg)
        send('');
    });
    command(e, 'test', text, function (args) {
        test=!test;
        let msg = "TEST "+(test?"ON":"OFF")+"!!!";
        echo(`<span style='color:lightgreen;'>${msg}</span>`);
        console.log(msg);
        send('');
    });
    
    //обкаст fullbuff
    command(e, 'fb', text, function (args) {
        if(test)
            console.log('test fullbuff start --> ok. args['+args+"]("+args.length+")");

        var bclass;
        var match;

        if (my_char.fullbuff.target) {
        	my_char.fullbuff = new Fullbuff();
        	echo('[fullbuff canceled]\n');
    	}
    	else {
            match = (/^fb[\s]?([\S]*)?[\s]?([\S]*)?[\s]?([\S]*)?$/i).exec(args[0]);
            if (match[1] === undefined || match[1] === "") {
            	my_char.fullbuff = new Fullbuff(undefined, 'self');
        	}
        	else {
            	bclass = getBuffClass(match[1]);
            	if (match[2] === undefined) {
                	if (bclass) {
                    	//fb protect
                    	my_char.fullbuff = new Fullbuff(bclass, 'self');
                	} else if (match[1] === 'all') {
                    	//fb all
                    	my_char.fullbuff = new Fullbuff(undefined, 'self', true);
                	} else {
                    	//fb self
                    	my_char.fullbuff = new Fullbuff(undefined, match[1]);
                	}
            	}
            	else if (match[3] === undefined) {
                	if (bclass) {
                    	//fb protect all
                    	//fb protect self
                    	if (match[2] === 'all') {
                        	my_char.fullbuff = new Fullbuff(bclass, 'self', true);
                    	} else {
                        	my_char.fullbuff = new Fullbuff(bclass, match[2]);
                    	}
                	} else if (match[1] === 'all') {
                    	//fb all self
                    	my_char.fullbuff = new Fullbuff(undefined, match[1], true);
                	}
            	} else {
                	//fb protect all self
                	my_char.fullbuff = new Fullbuff(bclass, match[3], true);
            	}
        	}
        	echo('[fullbuff start]\n');
        	checkBuffv2();
        }
    });
/*Чтобы воззвать к Азазелю, произнеси его имя и добавь тайные слова -- 
например, сказать azazel sefer yetsirah. Используй их вовремя и с умом,
ибо безжалостный Азазель не прощает ошибок.*/
    command(e, 'ah', text, function (args) {
        azazel.heal.use();
    });
    command(e, 'ac', text, function (args) {
        azazel.curse.use();
    });
    command(e, 'aa', text, function (args) {
        azazel.attack.use();
    });
    //ввод азазелевых слов вручную
    command(e,'azazel',text,function(args){
        match = (/^[\s]?([\w\s]*), ([\w\s]*), ([\w\s]*)$/).exec(args[1]);
        if(match) {
            if(test) console.log('[new Azazel words]');
            azazel = new Azazel(match[1],match[2],match[3]);
            setTimeout(() => azazel=new Azazel(), AZAZEL_TIMER*60*1000);
        } else {
            if(test) console.log('[no any Azazel words]');
        }
    });

    // Установить жертву для выстрелов, например: /victim hassan
    command(e, '/victim', text, function (args) {
        victim = args[1];
        echo('>>> Твоя мишень теперь ' + victim + "\n");
    });
 
    // Опознать вещь из сумки, например: /iden кольцо
    command(e, '/iden', text, function (args) {
        send('взять ' + args[1] + ' сумка');
        send('к опознание ' + args[1]);
        send('полож ' + args[1] + ' сумка');
    });

    // Выбросить и уничтожить вещь из сумки: /purge барахло
    command(e, '/purge', text, function (args) {
        send('взять ' + args[1] + ' сумка');
        send('бросить ' + args[1]);
        send('жертвовать ' + args[1]);
    });

    // Начать выбивать двери (см. тригер выше): /bd юг
    command(e, '/bd', text, function (args) {
        doorToBash = args[1];
        echo('>>> Поехали, вышибаем по направлению ' + doorToBash + '\n');
        send('выбить ' + doorToBash);
    });

    command(e, 'zz', text, function (args) {
        send('get ' + args[1] + " rock|sell "+args[1]+" |drop "+args[1]);
    });

});


/*------------------------------------------------------------------------------
 * Горячие клавиши - по умолчанию умеет ходить/стрелять/всматриваться через кейпад. 
 *------------------------------------------------------------------------------*/

// Вспомогательные функции для горячих клавиш.
function go(where) {
    send(where);
}

function scan(where) {
    echo('-->[scan ' + where+']')
    send('scan ' + where);
}

// Рейнджеры могут стрелять по жертве victim из лука, а маги и клеры - 
// бить заклинаниями в соседнюю комнату.
function shoot(where,key) {
    if(!victim) {
        echo('<span style="color:red;">[NO TARGET]</span>');
        return;
    }
    if(my_char.weapon_set=='shoot') {
        echo(`-->[shoot ${where} ${victim}]`);
        send(`shoot ${where} ${victim}`)
    } else {
        let spell = my_char.attack_spells.get_spell('range',key);
        echo("-->[cast '"+spell+"' "+where+"."+victim+"]");
        send("cast '"+spell+"' "+where+"."+victim);
    }
}
function cast(group,key) {
    let spell = my_char.attack_spells.get_spell(group,key);
    echo("-->[cast '"+spell+"' "+victim+"]");
    send("cast '"+spell+"' "+victim);
}

// Коды клавиш на кейпаде.
var KP_0 = 96,
    KP_1 = 97,
    KP_2 = 98,
    KP_3 = 99,
    KP_4 = 100,
    KP_5 = 101,
    KP_6 = 102,
    KP_7 = 103,
    KP_8 = 104,
    KP_9 = 105,
    KP_MUL = 106,
    KP_PLUS = 107,
    KP_MINUS = 109,
    KP_DOT = 110,
    KP_DIV = 111,
    N_1 = 49,
    N_2 = 50,
    N_3 = 51,
    N_4 = 52,
    N_5 = 53,
    N_6 = 54,
    N_7 = 55,
    N_8 = 56,
    N_9 = 57,
    N_0 = 58,
    N_DASH = 189,
    N_EQUAL = 187;

// Просто клавиша - идти по направлению, ctrl+клавиша - стрелять, alt+клавиша - всмотреться.
function dir(d, e) {
    if(test) console.log("dir("+d+")"
        +(e.ctrlKey?" ctrl":"")
        +(e.altKey?" alt":"")
        +(e.shiftKey?" shift":""));
    /* if (e.ctrlKey && e.shiftKey) {
        shoot(d,1);
    } else  */
    if (e.ctrlKey && e.altKey) {
        shoot(d,1);
    } else if (e.ctrlKey) {
        shoot(d,0);
    } else if (e.altKey) {
        scan(d);
    } else {
        go(d);
    }
}

function setSpell(g,key,e) {
    if(test) console.log("setSpell("+g+")"
        +(e.ctrlKey?" ctrl":"")
        +(e.altKey?" alt":"")
        +(e.shiftKey?" shift":""));
    if(e.ctrlKey) {
        if(e.shiftKey) {
            attack_spell_wait = {
                'group':g,
                'key':key
            };
            my_char.attack_spells.showSpells(g,key);
            return true;
        } else if (e.altKey) {
            my_char.attack_spells.changeSpell(g,key);
            return true;
        } else {
            //TODO shoot spell by Ctrl+1-0 key
            return false;
        }
    } 
    
    return false;
}

function castSpell(group, e) {
    if (e.shiftKey) {
        cast(group,2);
    } else if (e.ctrlKey) {
        cast(group,1);
    } else {
        cast(group,0);
    }
}

// Назначаем горячие клавиши и их действия.
keydown = function (e) {
    switch (e.which) {
        case KP_3:
            dir('down', e);
            break;
        case KP_1:
            dir('down', e);
            break;
        case KP_2:
            dir('south', e);
            break;
        case KP_4:
            dir('west', e);
            break;
        case KP_5:
            send('scan');
            break;
        case KP_6:
            dir('east', e);
            break;
        case KP_8:
            dir('north', e);
            break;
        case KP_9:
            dir('up', e);
            break;
        case KP_PLUS:
            castSpell("close", e);
            break;            
        case KP_MINUS:
            castSpell("curse", e);
            break;
        case KP_DOT:
            castSpell("room", e);
            break;

        case 27: // escape
            if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
                $('#input input').val(''); // очистить поле воода
            } else {
                return;
            }
            break;


        /*
                case KP_0:
                    break;
                case KP_2:
                    break;        
                case KP_7:
                    break;
                case KP_MUL:
                    break;
                
                case KP_DIV:
                    break;
                case 112: // F1
                    break;
                case 113: // F2
                    break;
                case 114: // F3
                    break;
                case 115: // F4
                    break;
                case 116: // F5
                    break;
                    
               // Для кодов остальных клавиш смотри https://keycode.info 
        */
        case N_1:
            if (setSpell('range','0',e))
                break;
            else
                return;
        case N_2:
            if (setSpell('range','1',e))
                break;
            else
                return;
        case N_3:
            if (setSpell('close','0',e))
                break;
            else
                return;
        case N_4:
            if (setSpell('close','1',e))
                break;
            else
                return;
        case N_5:
            if (setSpell('close','2',e))
                break;
            else
                return;
        case N_6:
            if (setSpell('curse','0',e))
                break;
            else
                return;
        case N_7:
            if (setSpell('curse','1',e))
                break;
            else
                return;                        
        case N_8:
            if (setSpell('curse','2',e))
                break;
            else
                return; 
        case N_9:
            if (setSpell('room','0',e))
                break;
            else 
                return;
        case N_0:
            if (setSpell('room','1',e))
                break;
            else
                return;
        case N_DASH:
            if (setSpell('room','2',e))
                break;
            else
                return;
        case N_EQUAL:
            /* if (setSpell('room','2',e))
                break;
            else */
                return;
        default:
            return; // по умолчанию просто посылаем клавишу на сервер
    }

    e.preventDefault(); // не посылать клавишу на сервер если обработана выше
};

function charInit() {
    if(test) console.log('charInit()');

    kach = false;

    let char_obj = getChar();

    if(test) console.log(' -->charname=' + char_obj.sees);

    if (chars[char_obj.sees] !== undefined){
        my_char = new Pchar(char_obj.sees, chars[char_obj.sees], char_obj.level);
    } else {
        if(test) console.log(' -->chars[' + char_obj.sees + '] == undefined');
    }
    console.log(`charInit(): `, my_char.name);
}

function getChar() {
    let result = '';
    if (isEqualChar(mudprompt.group.leader))
        return mudprompt.group.leader;

    for (var i in mudprompt.group.pc) {
        if (isEqualChar(mudprompt.group.pc[i])) {
            return mudprompt.group.pc[i];
        };
    }
    return result;
}

function isEqualChar(ch) {
    if (ch.hit == mudprompt.hit && ch.max_hit == mudprompt.max_hit)
        return true;

    return false;
}
function checkOrders() {
	if(test) console.log('->checkOrders()\n');
	if (my_char.order.proced==mudprompt.group.npc.length) {
        echo("->doOrder()[finished]");
    	my_char.ordersChange = false;
    	my_char.order = new Order();
	} else {
        doOrder();
    }

}
function doOrder() {
    var vict_name;
    if(my_char.action.act != undefined) {
        return;
    }
    if(test) console.log('->doOrder('+(my_char.order.proced+1)+'/'+mudprompt.group.npc.length+')');

    if(my_char.order.command!== undefined && mudprompt.group.npc[my_char.order.proced]!=undefined) {
        vict_name = mudprompt.group.npc[my_char.order.proced].sees;
        if(test) console.log('-->proceed:' + my_char.order.proced + ' mudprompt.group.npc['+my_char.order.proced+']:' + vict_name);

        if(my_char.order.name_num[vict_name]==undefined) {
            my_char.order.name_num[vict_name] = 1;
        } else {
            my_char.order.name_num[vict_name]++;
        }
        vict_name = '' + my_char.order.name_num[vict_name] + '.' + vict_name;
        vict_name="'"+vict_name+"'";
        if(test) console.log("-->changed:"+vict_name);

        if(my_char.action.act === undefined) {
            my_char.order.proced++;
            doAct('order',my_char.order.command,vict_name);
        }
    } 
}
function doAct(act, comm, tag) {
    if(test) console.log('-->doAct(action:' + act + ', command:' + comm + ', target:' + tag + ')');
    //melt
    if(commandCounter.command===act) {
        commandCounter.count += 1;
        if(commandCounter.count >= 20) {
            if(kach)
                send('replay all');
            else
                send('where');
            commandCounter.count = 0;
        }
    } else {
        commandCounter.command = act;
        commandCounter.count = 1;
    }

    my_char.action = new Action(act, comm, tag);

    var result = '';

    if (act)
        result += act;

    if (act === 'cast' && comm !== undefined) {
        result += ' \'' + comm + '\'';
    } else if (act !== comm && comm !== undefined) {
        result += ' ' + (act === 'order' ? tag : comm);
    }

    if (tag /*&& tag !== 'self'*/) {
        result += ' ' + (act === 'order' ? comm : tag);
    }

    if (result !== '') {
        echo('-->[doAct: ' + result + ']\n');
        send(result);
    } else
        echo('\ndoAct(' + act + ',' + comm + ',' + tag + '): ERROR\n');
}
function clearAction(act) {
    if(act!==undefined && my_char.action.act !== act) 
        return;
    if(test) console.log(` -->clearAction(${act?act:''})==>action(${my_char.action.act?my_char.action.act:''})\n`);

    for (var key in my_char.action) {
        my_char.action[key] = undefined;
    }
}
//[#prompt]
function promptRecived(afk) {
    if(test) {
        console.log('prompt(ok)');
        //echo("["+mudprompt.vnum+"]");
    }

    if (!my_char.init || my_char.name != getChar().sees) {
        charInit();
        if(test) console.log('\n');
    }
    if (my_char.was_fade &&  (mudprompt['trv']!==undefined && mudprompt['trv']!=='none' && mudprompt['trv'].a.indexOf('F')!==-1)) {
        my_char.was_fade = null;
    }

    my_char.afk = afk;

    if (my_char.was_afk !== undefined && my_char.afk && my_char.action.act!="afk") {
        my_char.was_afk = undefined;
    }

    if (my_char.last_pose) {
        if (my_char.last_pose == mudprompt.p2.pos) {
            my_char.last_pose = undefined;
        }
        if (my_char.action.act == mudprompt.p2.pos)
            clearAction();
    }

    if(fromRoom!=mudprompt.vnum) {
        fromRoom==null;
        if(['north','south','west','east','down','up'].indexOf(my_char.action.act)!=-1) {
            clearAction();
            kachThrowingWeapon.targetHere = false;
            echo('<span style="color:red;">когда переехал не помню...</span>');
        }
    }


    checking();

}

//[#checks] [#проверялки]
function checking() {
    let message = '';
    if(test) message += "["+mudprompt.vnum+"]";
    if(test) console.log(' -->checking()');
    if(test) console.log(' -->status:'
        + (my_char.afk ? '[afk]' : '')
        + ((mudprompt['trv']!==undefined && mudprompt['trv']!=='none' && mudprompt['trv'].a.indexOf('F')!==-1) ? '[fade]' : '')
        + (my_char.last_pose != undefined ? '[last:' + my_char.last_pose + ']' : '')
        + (my_char.was_afk != undefined ? '[was_afk]' : '')
        + (my_char.was_fade ? '[was_fade]' : '')
        + (my_char.action.act != undefined ? '[act:' + my_char.action.act + ']' : '')
        + ' pos:' + mudprompt.p2.pos
        + (mudprompt.p2.posf != '' ? '; posf:' + mudprompt.p2.posf : '')
        + '\n');
    let azazelStr = '';
    azazelStr = azazel.stat();

    if (buffQueue.length)
    	changeBuffsStatus();
    //if (my_char.affChanged)
    checkBuffv2();

    if (my_char.eqChanged)
        checkEquip();

    if (my_char.needsChanged)
        checkNeeds();
    
    if(kach) {
        let kachPrompt = '';
        if(opDown)
            kachPrompt += '<span style="color:red;">[opp:down]</span>';
        if(!my_char.shield)
            kachPrompt += '<span style="color:red;">[SHIELD]</span>';
        
        kachPrompt += checkKach();

        //echo(kachPrompt);
        message += kachPrompt;
    }

    if(my_char.init) echo(my_char.attack_spells.get_prompt());
    
    let needsStatus = '';
    if (my_char.needsChanged)
        needsStatus = ''
            + (my_char.hunger ? '[h:' + my_char.hunger + ']' : '')
            + (my_char.thirst ? '[t:' + my_char.thirst + ']' : '')
            + (fight && positions.indexOf('fight') > positions.indexOf(mudprompt.p2.pos) ? '[<span style="color:red">down</span>]' : '');

    let group_length = 0;
    if(mudprompt.group.pc!==undefined)
        group_length += mudprompt.group.pc.length;

    if(mudprompt.group.npc!=undefined)
        group_length += mudprompt.group.npc.length;

    if (Object.keys(my_char.group.members).length != group_length) 
        checkGroup();

    if(azazelStr!='')
        echo(azazelStr);

    if (my_char.hunger + my_char.thirst > 0)
        message += needsStatus;
        //echo(needsStatus);

    if(my_char.action.act != undefined) echo('[act:' + my_char.action.act + ' command:'+my_char.action.command+' target:'+my_char.action.target+']');

    if(my_char.ordersChange)
    	checkOrders();

    if (!my_char.needsChanged && !my_char.eqChanged
        && (my_char.last_pose || my_char.was_afk))
        restoreStatus();
    
    if(fight) {
        if(my_char.hasSkill('dirt kicking')) {
            if(skill_active['dirt kicking']===true) {
                message += '<span style="color:green;">[blind]</span>';
            }
        } 
    }
    if(message!=='') echo(message);
}
function checkKach() {
    if(test) console.warn("---->checkKach()", my_char.skills['counter'], my_char.skills['counter']?.progress);
    if(my_char.skills['counter']!=undefined && counterSkill.attacks>0 
        && my_char.skills['counter'].progress!=undefined
        && my_char.skills['counter'].progress<100) 
            echo(`[counter:a=${counterSkill.attacks};c=${counterSkill.counter};i=${counterSkill.improves}]`);
    let result = '[kach]';

    if(my_char.action.act != undefined)
        return '';
    
    else if(test) console.warn("---->act:", my_char.action);

    let notEnoughManaMove = false;
    if(kachThrowingWeapon.status) {
        let throwing_weapon_progress = `throwing weapon:${my_char.skills['throwing weapon'].progress}%`;

        if(my_char.skills['throwing weapon'].progress>=100) {
            echo('<span style="color:red;">-->DONE!!!</span>');
            kachThrowingWeapon.status = false;

            return result+`[${throwing_weapon_progress}]`;
        }
        if(!checkPose('stand')) {
            echo('<span style="color:red;">-->ПОДЪЕМ!!!</span>');
            return result+`[${throwing_weapon_progress}->stand]`
        }

        if(mudprompt.move < (my_char.skills['throwing weapon'].moves ?? 0)) {
            echo('<span style="color:red;">-->устал!!!</span>');
            notEnoughManaMove = true;
            return result + `[${throwing_weapon_progress} ${mudprompt.move}/${my_char.skills['throwing weapon'].moves}mv]`;
        }

        let throwing_weapon_direction = mudprompt.vnum == 4247 ? 'south' : 'north';

        if([4247, 4255].indexOf(mudprompt.vnum)==-1) {
            echo('<span style="color:red;">-->потерялася я!!!</span>');
            return result+`[${throwing_weapon_progress}->LOST]`;
        }
        if(kachThrowingWeapon.targetHere) {
            echo('<span style="color:red;">-->MOVE!!!</span>');
            kachThrowingWeapon.missileOnFloor = false;
            fromRoom=mudprompt.vnum;
            doAct(throwing_weapon_direction);
            return result+`[${throwing_weapon_progress}->${throwing_weapon_direction}]`;
        }

        if(kachThrowingWeapon.missileWield) {
            echo('<span style="color:red;">-->ФАЯЯЯЯЯЯЯ!!!</span>');
            doAct("throw",` ${kachThrowingWeapon.missile} ${throwing_weapon_direction} ${kachThrowingWeapon.target}`);
            return result+`[${throwing_weapon_progress}->throwing]`;
        }
        if(kachThrowingWeapon.missileOnInventory) {
            echo('<span style="color:red;">-->RELOAD!!!</span>');
            doAct('wield', 'dagger');
            return result+`[${throwing_weapon_progress}->missile on inventory]`;
        }
        if(kachThrowingWeapon.missileOnFloor) {
            echo('<span style="color:red;">-->АПОРТ!!!</span>');
            doAct('get', 'dagger');
            return result+`[${throwing_weapon_progress}->missile on floor]`;
        } else if(!kachThrowingWeapon.missileOnInventory && !kachThrowingWeapon.missileWield) {
            echo('<span style="color:red;">-->ПАТРОНОВ!!!</span>');
            doAct("get",` ${kachThrowingWeapon.missile} ${kachThrowingWeapon.container}`);
            return result+`[${throwing_weapon_progress}->missile in container]`;
        }
        
    }

    if(test) console.warn("---->skills:",my_char.skills);
    for(let skill in my_char.skills) {
        if(test) console.log('---->skill:', skill, my_char.skills[skill]);
        let msg = skill;
        //в бою пропускаем не боевые и наоборот
        if(test) console.log(`---->pos: current:${mudprompt.p2.pos}, skill:${my_char.skills[skill]?.pos}, fight:${fight}`);
        if((fight && my_char.skills[skill]?.pos!=="fight")
            || (!fight && my_char.skills[skill]?.pos==="fight")) {
            if(test) console.log(`  -->[${msg}: ${fight?'':'no '}fight: ${my_char.skills[skill].pos==="fight"?'':'no '} fight skill]`);
            continue;
        }

        //определяем процент разученности
        if(my_char.skills?.[skill]?.progress===undefined) {
            if(test) console.log(`[${my_char.skills?.[skill]?.progress}]  -->[${msg}:no skills.${skill} --> slook ${skill}`);
            doAct('slook', skill);
            result += `[${msg}:slook]`;
            return result;
        }

        //пропускаем если 100%
        if(my_char.skills[skill].progress >= 100) {
            //result += `[${msg}:${my_char.skills[skill].progress}%]`;
            if(test) console.log(`checkKach [${msg}:${my_char.skills[skill].progress}%] skipped`);
            continue;
        }
        //пропускаем если нет парамтров для прокачки
        if(my_char.skills?.[skill]?.act===undefined) {
            if(test) console.log(`  -->[${msg}:no act]`);
            result += `[${msg}:${my_char.skills[skill].progress}%]`;
            //result += `[${msg}:no command]`;
            continue;
        }

        //пропускаем уже активные
        if(test) console.log('---->active:', skill_active[skill]);
        if(skill_active[skill]) {
            if(test) console.log(`  -->[${msg}: skill active]`);
            result += `[${msg}:${my_char.skills[skill].progress}% active]`;
            continue;
        }
        //проверка на бафф
        if(buffs_list[skill]) {
            if(test)console.log('  -->buff_check', buffs_list[skill]);

            if(my_char.hasBuff(skill)) {
                result += `[${msg}:${my_char.skills[skill].progress}% active]`;
                continue;
            }
        }

        //проверка на move/mana
        if(mudprompt.move < (my_char.skills[skill].moves ?? 0)  
            || mudprompt.mana < (my_char.skills[skill].mana ?? 0)) {
            result += `[${msg}:${my_char.skills[skill].progress}%${(mudprompt.move < my_char.skills[skill].moves) ? ' '+mudprompt.move+'/'+my_char.skills[skill].moves + 'mv' : ''}${(mudprompt.mana < my_char.skills[skill].mana) ? ' '+mudprompt.mana+'/'+my_char.skills[skill].mana + 'mn' : ''}]`;
            if(test) {
                console.log("      -->skip: not enough moves/mana", 
                    my_char.skills[skill].moves, 
                    mudprompt.move, 
                    my_char.skills[skill].mana, 
                    mudprompt.mana
                );
            }
            notEnoughManaMove = true;
            continue;
        } else {
            if(test) console.log("  -->mana/moves check ok!")
        }
        //проверяем на АФК
        if (my_char.afk) {
            changeAFK();
            my_char.needsChanged = true;
            result += `[${msg}:${my_char.skills[skill].progress}%:afk]`
            return result;
        }
        //проверяем pos
        if(skills[skill]!=undefined && skills[skill].pos!=undefined && !checkPose(skills[skill].pos)) {
            if(test) console.log("      -->skip: position");
            result += `[${msg}:${my_char.skills[skill].progress}% req:${skills[skill].pos}]`;
            break;
        }
        
        if(skills[skill].act===null) {
            result += `[${msg}:${my_char.skills[skill].progress}%]`;
            continue;
        }

        result += `[${msg}:${my_char.skills[skill].progress}%-->run]`;
        doAct(
            skills[skill].act.act, 
            skills[skill].act.command, 
            skills[skill].act.target
        );
        return result;
    }

    if((my_char.hasSkill("sneak")&&my_char.skills['sneak'].progress!==100&&my_char.hasBuff('sneak'))
        || (my_char.hasSkill("hide")&&my_char.skills['hide'].progress!==100&&my_char.hasBuff('hide'))
        || (my_char.hasSpell("invisibility")&&my_char.spell['invisibility'].progress!==100&&my_char.hasBuff('invisibility'))
        || (my_char.hasSpell("improved invis")&&my_char.spell['improved invis'].progress!==100&&my_char.hasBuff('improved invis'))) {
        //проверяем на АФК
        if (my_char.afk) {
            changeAFK();
            my_char.needsChanged = true;
            result += `[${msg}:${my_char.skills[skill].progress}%:afk]`
            return result;
        }
        doAct('visible');
        return result;
    }

    if(!fight && !checkPose('rest')) return result;

    //haggle
    if(my_char.hasSkill("haggle") && my_char.skills['haggle'].progress!==100) {
        haggleSkill.room = {};
        for(let room of haggleSkill.rooms) {
            if(mudprompt.vnum==room.vnum) {
                haggleSkill.room = room;
                break;
            }
        }
        if(haggleSkill.room.vnum!=undefined) {
            if(!haggleSkill.has)
                doAct('buy',haggleSkill.room.obj);
            else
                doAct('sell',haggleSkill.room.obj);

            return result;
        }
    }

    if(notEnoughManaMove && !fight && !timeout && my_char.action.act === undefined) {
        echo('<span style="color:red;">TIMEOUT SET</span>');
        timeout = true;
        setTimeout(() => { echo('<span style="color:red;">TIMEOUT</span>');timeout=false; send(""); }, 10*1000);
    }
    /* if(my_char.hasSkill('herbs')) {
        console.log("      check herbs:");
        if(mudprompt.p2.pos==='fight') {
            console.log("      -->skip: fight");
        } else {
            if(!herbCooldown 
                && mudprompt.move==mudprompt.max_move 
                && mudprompt.mana==mudprompt.max_mana) {
                if(checkPose('stand')) {
                    doAct('herbs');
                    console.log("      -->[herbs]");
                }
                return result;
            } else {
                let timeoutCount = 10000;
                if(herbCooldown) {
                    timeoutCount = 30000;
                    result += '<span style="color:green;">[herb cooldown]</span>';
                }
                if(mudprompt.p2.pos!=="fight" && mudprompt.p2.pos!=="rest") {
                    doAct('rest');
                }
                result += '[timeout]';
                if(!timeout) {
                    setTimeout(function(){send('');timeout=false;}, timeoutCount);
                    timeout = true;
                }
                console.log("      -->skip:timeout");
            }
        }
    } */
/*     if(my_char.hasSkill('berserk')) {
        console.log("      check berserk:");
        if(mudprompt.p2.pos=='fight'
        && mudprompt.mana > mudprompt.max_mana-100
        && mudprompt.move==mudprompt.max_move ) {
            if(mudprompt['enh'].a.indexOf('z')===-1) {
                echo("[berserk]");
                send('berserk');
                console.log("      -->[berserk]");
            } {
                console.log("      -->has one!");
            }
        } else {
            console.log("      -->skip");
        }
    }
 */

    //harp
    /* 
    if(!hasHarp) {
        doAct('get', 'harp', 'rock');
        return '';
    }

    if(!isHarp) {
        doAct('hold', 'harp');
        return '';
    }

    if(mudprompt.move==mudprompt.max_move) {
        doAct('use', 'harp');
    } else {
        result += '[timeout]';
        if(!timeout) {
            setTimeout(function(){send('');timeout=false;},10000);
            timeout = true;
        }
    } 
    */

    return result;
}
function checkGroup() {
    if(test) console.log("->checkGroup()");
    my_char.group = new Group();
    if(mudprompt.group.pc!==undefined)
        setGroupMembersFrom(mudprompt.group.pc);

    if(mudprompt.group.npc!==undefined)
        setGroupMembersFrom(mudprompt.group.npc);

    if(test) console.log("-->members:"+Object.keys(my_char.group.members).length+" pet_spells:"+my_char.group.spells.length);
}

function setGroupMembersFrom(list) {
    if(test) console.log("-->setGroupMembersFrom("+list.length+")");

    for(let member in list) {
        if(test) console.log("---->menber",member);
        if(test) console.log(`---->sees${[list[member].sees]}`);
        if(test) console.log(`---->list${pets[list[member].sees]}`);
        let name = pets[list[member].sees]
            ? pets[list[member].sees].ename
            : list[member].sees;
        let level = list[member].level;
        let i = 1;
        let new_name = i+"."+name;
        while(my_char.group.members[new_name]!=undefined) {
            new_name = ++i + "." + name;
        }
    
        my_char.group.members[new_name] = new GroupMember(name, new_name);
        //пишем спелы доступные чармису в my_char.group.spells
        //выборка кастуемых спелов в checkBuff()
        if(pets[list[member].sees]!=undefined && pets[list[member].sees].spells.length>0){
            for(let pet_spell of pets[list[member].sees].spells){
                if(buffs_list[pet_spell]===undefined) 
                    continue;

                my_char.group.spells.push([name,pet_spell,level]);
            }
        }
    }

    if(test) {
        console.log("setGroupMembersFrom()");
        console.log(my_char.group.members);
    }
}
function checkBuffv2() {
	if (test) {
        console.log('\n->chkBffv2()');
        console.log("chckBuffv2 started");
        console.log("my_char.fullbuff:",my_char.fullbuff);
        console.log("my_char.buffs_needs:",my_char.buffs_needs);
    }
    //console.log(1);
    //чар чем-то занят - прерываем
    if (my_char.action.act === undefined && ["stand", "sit", "rest", "sleep"].indexOf(mudprompt.p2.pos)!=-1) {
        my_char.affChanged = false;
    } else {
        return;
    }
    //console.log(2);
    var fb = my_char.fullbuff.target === undefined ? false : true;
    var fb_all = my_char.fullbuff.all === undefined ? false : my_char.fullbuff.all;
    var fb_class = my_char.fullbuff.class;
    var fb_target = my_char.fullbuff.target;
    var targets = [];
    //console.log(3);
    if(fb_target===undefined || fb_target==='self') {
        targets.push(my_char.name);
    } else if(fb_all) {
        for(let member_name in my_char.group.members) {
            targets.push(member_name);
        }
        targets.push(my_char.name);
    } else {
        targets.push(fb_target);
    }
    //console.log(4);
    /*  
    собирается список всех спелов 
    в случае прокачки спелов - только спелы чара
    в остальных случаях спелы чаров могут быть заменены спелами чармиса с уровнем выше уровня чара 
    */
    var oSpells = {}; 
    //мои бафы
    if(test) {
        console.log(my_char);
        console.log(Object.keys(my_char.spells));
        console.log(Object.keys(my_char.skills));
    }
    var spellsAndSkills = Object.keys(my_char.spells).concat(Object.keys(my_char.skills));
    if(test) console.log('->spellsAndSkills:', spellsAndSkills);
    for(let spell of spellsAndSkills) {
        if(test) console.log('-->spell/skill:',spell);
        //х.з. что с этим спелом дальше делать!
        if(my_char.buffs_needs[spell]==undefined) {
            if(test) console.log('-->not in buffs_needs', my_char.buffs_needs);
            continue;
        }

        if((my_char.buffs_needs[spell].always
            || my_char.buffs_needs[spell].gm_always
            || my_char.buffs_needs[spell].fullbuff
            || my_char.buffs_needs[spell].gm_fullbuff)==false) {
                if(test) console.log('-->not in buffs_needs.needs');
                continue;
            }
    
        //вообще не баффы - пропускем
        if (['combat', 'creation', 'maladiction'].indexOf(buffs_list[spell].class) >= 0) {
            if(test) console.log('-->not a buff');

            continue;
        }
        //не тот класс заклинания - пропускаем
        if(fb_class!==undefined && fb_class !== buffs_list[spell].class) {
            if(test) console.log('-->wrong class',  fb_class, buffs_list[spell].class);

            continue;
        }
        oSpells[spell]=new MemberSpell(my_char.name, my_char.level);
    }
    //бафы чармисов
    for(let aSpell of my_char.group.spells) {
        //х.з. что с этим спелом дальше делать!
        if(my_char.buffs_needs[aSpell[1]]==undefined) continue;
        if((my_char.buffs_needs[aSpell[1]].always
            || my_char.buffs_needs[aSpell[1]].gm_always
            || my_char.buffs_needs[aSpell[1]].fullbuff
            || my_char.buffs_needs[aSpell[1]].gm_fullbuff)==false) continue;
        //вообще не бафф - пропусем
        if (['combat', 'creation', 'maladiction'].indexOf(buffs_list[aSpell[1]].class) >= 0) continue;
        //не тот класс заклинания - пропускаем
        if(fb_class!==undefined && fb_class !== buffs_list[aSpell[1]].class) continue;

        //во время прокачки, с чармисов оставляем только обязательные (buff==1) 
        if(my_char.pract && my_char.buffs_needs[aSpell[1]].always==false && my_char.buffs_needs[aSpell[1]].gm_always==false) continue; 

        //пропускаем если при фулбафе не кастуется
        if(my_char.buffs_needs[aSpell[1]].always==false
            && my_char.buffs_needs[aSpell[1]].gm_always==false
            && my_char.buffs_needs[aSpell[1]].fullbuff==false
            && my_char.buffs_needs[aSpell[1]].gm_fullbuff==false) continue;
        
        if(oSpells[aSpell[1]]!=undefined) {
            //пропускаем если уже зареган спел большего уровня
            if(oSpells[aSpell[1]].level>=aSpell[2]) continue;

            //пропускаем если уже зареган, и бафается только на себя
            if(buffs_list[aSpell[1]].target==false) continue;
        }            
        //кастер заблудился
        if(my_char.fullbuff.away.indexOf(aSpell[0])!=-1) continue;
        //у кастера закончилась мана
        if(my_char.fullbuff.empty.indexOf(aSpell[0])!=-1) continue;

        oSpells[aSpell[1]]=new MemberSpell(aSpell[0], aSpell[2]);
    }
    if(test) {
        console.log('chkBuffv2::targets:',targets);
        console.log('chkBuffv2::oSpells:',oSpells);
    }
    let spell_to_cast, victim, caster, victim_align, group_member;
    let isSpell, isSkill;
    for(let spell_name in oSpells) {
        caster = oSpells[spell_name].member;
        spell_to_cast = spell_name;
        victim = undefined; victim_align = undefined;
        isSpell = buffs_list[spell_name] instanceof Spell;
        isSkill = buffs_list[spell_name] instanceof Skill;

        if(test) console.log("---->["+caster+"]["+spell_name+"]"+'[key:'+buffs_list[spell_name].mgroup+"-"+buffs_list[spell_name].mbrief+']');
    
        //не фулбаф, не обязательный - пропускаем
        if(!fb) {
            group_member=true;
            if(my_char.buffs_needs[spell_name].always==false) {
                if(test) console.log('------>not fullbuff not required spell skipped!');
                continue;
            }
        }
        for(let target_name of targets) {
            if(test) console.log('------>check "'+spell_name+'" for '+target_name);
            //если на чаре уже числится бафф - пропускаем чара
            if(my_char.fullbuff.hasBuff(target_name, spell_name)) {
                if(test) console.log("------>skipped (char have one)");
                continue;
            }
            if(target_name==my_char.name) {
                group_member=true;
                victim_align = my_char.align;
                //на меня не кастуется - пропускаем
                if(!fb) {
                    //не фулбаф, не обязательный - пропускаем
                    if(my_char.buffs_needs[spell_name].always==false) {
                        if(test) console.log('------>spell skipped: not fullbuff not required!');
                        continue;
                    }
                } else {
                    //фулбаф, не вешается - пропускаем
                    if(my_char.buffs_needs[spell_name].fullbuff==false) {
                        if(test) console.log('------>spell skipped: not required while fullbuff!');
                        continue;
                    }
                }
                //на цель не вешается, пытаемся сменить на своё
                if(!buffs_list[spell_name].target && !buffs_list[spell_name].party && caster!=my_char.name) {
                    if(test) console.log("на цель не вешается, пытаемся сменить на своё");
                    for(let my_spell in my_char.spells) {
                        if((my_spell[0]==spell_name || buffs_list[spell_name].ally.indexOf(my_spell[0])!=-1) 
                            && my_spell[1]<=my_char.level){
                            spell_to_cast = my_spell[0];
                            caster = my_char.name;
                            break;
                        }
                    }
                    if(caster!=my_char.name) {
                        if(test) console.log('------>only for self ('+caster+') spell skipped for me!');
                        continue;
                    }
                }
            } else if(my_char.group.members[target_name]!=undefined){
                let pet_name;
                if(pets[my_char.group.members[target_name].name]!=undefined) {
                    pet_name = my_char.group.members[target_name].name;
                }
                victim_align = my_char.group.members[target_name].align;
                //на чармиса не кастуется - пропускаем
                if(!fb) {
                    //не фулбаф, не обязательный - пропускаем
                    if(my_char.buffs_needs[spell_name].gm_always==false) {
                        if(test) console.log('------>spell skipped: not fullbuff not required for charmed!');
                        continue;
                    }
                } else {
                    //фулбаф, не вешается - пропускаем
                    if(my_char.buffs_needs[spell_name].gm_fullbuff==false) {
                        if(test) console.log('------>spell skipped: not required for charmed while fullbuff!');
                        continue;
                    }
                }
                //на цель не вешается, пытаемся сменить на своё
                if(!buffs_list[spell_name].target && caster!=my_char.group.members[target_name].name) {
                    if(pet_name==undefined) {
                        if(test) console.log('------>only for self ('+caster+') spell skipped for uncknown pet '+target_name+'!');
                        continue;
                    }
                    
                    if(pets[pet_name].spells.indexOf(spell_name)!=-1) {
                        if(test) console.log('------>caster '+caster+' changed to '+pet_name+' for self use spell!');
                        caster = pet_name;
                    }
                    if(caster!=pet_name) {
                        for(let pet_spell of pets[pet_name].spells) {
                            if(buffs_list[spell_name].ally.indexOf(pet_spell)) {
                                echo('------>caster '+caster+' changed to '+pet_name+', spell "'+spell_name+'" changed to "'+pet_spell+'"!');
                                caster = pet_name;
                                spell_to_cast = pet_sepll;
                                break;
                            }
                        }
                    }

                    if(caster!=pet_name) {
                        if(test) console.log('------>only for self ('+caster+') spell skipped for pet '+pet_name+'!');
                        continue;
                    }
                }

            } else {
                group_member=false;
                //баф на кого-то еще...
                //пропускаем бафы на группу
                if(buffs_list[spell_name].party==true) {
                    if(test) console.log('------>party spell skipped for not group member: '+target_name+'!');
                    continue;
                }
                //на цель не вешается
                if(!buffs_list[spell_name].target) {
                    if(test) console.log('------>only for self ('+caster+') spell skipped for: '+target_name+'!');
                    continue;
                }
            }
            victim = target_name;
        }
        if(victim==undefined){
            if(test) console.log('------>chars dont need buff - skipped');
            continue;
        } 
        if(isSpell && victim_align!=undefined) {
            //не подходит по алигну:
            if(buffs_list[spell_name].aligns.indexOf(victim_align)==-1) {
                //ищем аналоги:
                if(buffs_list[spell_name].ally!=undefined) {
                    for(let ally of buffs_list[spell_name].ally) {
                        if(buffs_list[ally].aligns.indexOf(victim_align)==-1){
                            continue;
                        }
                        if(oSpells[ally]!=undefined) {
                            spell_to_cast = ally;
                            caster = oSpells[ally].member;
                        }                       
                    }
                }
                if(spell_to_cast==spell_name) {
                    if(test) console.log("------>skipped for "+target_name+"(align:"+buffs_list[spell_name].align+":"+victim_align+")");
                    continue;
                }
                if(test) console.log("------>spell changed: "+spell_to_cast);
            }
        }
        //проверка на количество маны/мувов:
        if(isSkill) {
            if(mudprompt.mana<buffs_list[spell_name].mana||mudprompt.move<buffs_list[spell_name].move) {
                if(test) console.log('------>Skill skeepped: not enough mana/move');
                continue;
            }
        }

        //если член группы или я - нет ли группового спела с этим баффом.
        if(group_member && buffs_list[spell_name].grSpell!=undefined 
            && oSpells[buffs_list[spell_name].grSpell]!=undefined && fb){
            spell_to_cast = buffs_list[spell_name].grSpell;
            caster = oSpells[spell_to_cast].member;
            victim = caster;

            if(test) console.log('------>spell changet to group spell:"'+spell_to_cast+'", caster:'+caster);
        }       
       
        if(test) console.log("---->spell:'"+spell_to_cast+"' caster:"+caster+" target:"+victim);

        if (my_char.afk) {
            changeAFK();
            my_char.affChanged = true;
            return;
        }    
        if(mudprompt['trv']!==undefined && mudprompt['trv']!=='none' && mudprompt['trv'].a.indexOf('F')!==-1) {
            my_char.was_fade = true;
        }
        if(caster==my_char.name) {
            if (mudprompt.p2.pos === "stand") {
                my_char.affChanged = true;
                if(isSpell)
                    doAct('cast', spell_to_cast, victim==my_char.name?'self':victim);
                if(isSkill)
                    doAct(buffs_list[spell_to_cast].command);
                return;
            } else {
                echo('надо чё-та кастануть!!!');
                my_char.affChanged = true;
                doAct('stand');
                return;
            }
        } else {
            my_char.affChanged = true;
            doAct('order', "cast '"+spell_to_cast+"'"+(caster==victim?'':" "+victim), caster);
            return;
        } 

    }

    if(my_char.fullbuff.target) {
        echo('[fullbuff done]');
        my_char.fullbuff = new Fullbuff();
    }
};

function changeBuffsStatus() {
	if(test) console.log('-->changeBuffsStatus()');
	var buff; var action;
	while (buffQueue.length) {
    	buff = buffQueue.pop();
        action = new Action(buff.action.act,buff.action.command,buff.action.target);
    	if(test) console.log('---->(buff status change: ' + buff.sBuff + ':' + buff.lStatus + ' {a:'+action.act+',c:'+action.command+',t:'+action.target+'})');

        if(action.act == 'order') {
            let match = (/^(cast) '(.*)'(?: (.*))?$/).exec(action.command);
            if(match) {
                action = new Action(match[1],match[2],match[3]?match[3]:action.target);
            } else {
            }
        }       
    	buffChange(buff.sBuff, buff.lStatus, buff.lActionDone, action);
	}
}
function buffChange(sBuff, lStatus, lActionDone, action) {
	if(test) console.log('-->buffChange('+sBuff+','+lStatus+','+lActionDone +',{a:'+action.act+',c:'+action.command+',t:'+action.target+'})');

	var forGroup = false;
	var forGroupMember = false;
	var forSelf = false;
	var forTarg = false;
    let actionCommandBuff = buffs_list[sBuff] instanceof Spell 
        ? sBuff === action.command
        : buffs_list[sBuff].command === action.act;

	var lGroupAlly = false;
	if (sBuff in buffs_list) {
    	if(test) console.log('---->("' + sBuff + '" имеется в buffs_list)');

        if(buffs_list[sBuff].grSpell != undefined) {
            if(test) console.log('---->(есть grSpell)');
            if (buffs_list[sBuff].grSpell === action.command){
                if(test) console.log('---->(group spell: ' + action.command + ')');
                lGroupAlly = true;
                sBuff = action.command;
            }
        }

    	if (buffs_list[sBuff].ally !== undefined) {
        	if(test) console.log('---->(есть ally)');
        	buffs_list[sBuff].ally.forEach(function (spell) {
            	if (spell === action.command && buffs_list[spell].target)
                	if(test) console.log('---->(ally4group ' + spell + ')');
            	lGroupAlly = true;
        	});
    	}
    	if (buffs_list[sBuff].target || lGroupAlly) {
        	if(test) console.log('---->(ally4group&me)');
        	forGroup = true;
        	forSelf = true;
    	}
    	if (actionCommandBuff && action.target !== 'self') {
        	if(test) console.log('---->(not4me?' + my_char.fullbuff.target + ')');
        	if (action.target === my_char.fullbuff.target) {
            	if(test) console.log('---->(not4me4: fb.target:' + my_char.fullbuff.target + ', act.target:'+action.target+')');
                forGroup = false;
                forSelf = false;
            	forTarg = true;
        	} else {
            	if(test) console.log('---->(4group?)');
                for(let member_name in my_char.group.members) {
                    if (member_name == action.target) {
                        if(test) console.log('---->(4"' + member_name + '")');
                        forGroupMember = true;
                    }
                }
        	}

    	}
    	if (action.target === 'self' || (!forGroup && !forTarg && !forGroupMember)) {
        	if(test) console.log('---->(4self)'+"(+target_self:"+(action.target === 'self')+")");
        	forSelf = true;
    	}
    	if (!lStatus && buffs_list[sBuff].party) {
        	if(test) console.log('---->(remove from group)');
        	forGroup = true;
    	}

    	if (!actionCommandBuff && buffs_list[sBuff].antogonist !== undefined) {
        	buffs_list[sBuff].antogonist.forEach(function (spell) {
            	if (spell === action.command) {
                	sBuff = action.command;
            	}
        	});
    	}
	}
	//Результаты:
	if(test) console.log('---->(result_finale: 4Self:' + forSelf + ' 4Group:' + forGroup + ' 4Targ:' + forTarg + ' 4GroupMember:' + forGroupMember + ')');
	if (forSelf) {
    	//вешаем на себя
    	
        if(lStatus && !my_char.hasBuff(sBuff)) {
            if(test) console.log('---->(forSelf:' + sBuff + ': ' + lStatus + ')->add to buffs[missing in mudprompt] ');

            my_char.buffs.set(sBuff);
        } else if (!lStatus && my_char.hasBuff(sBuff)) {
            if(test) console.log('---->(forSelf:' + sBuff + ': ' + lStatus + ')->removing from buffs');
            my_char.buffs.remove(sBuff);
        }
    	//my_char.hasBuff(sBuff) = lStatus;
	}
	if (forGroup) {
    	//вешаем на группу
        for(let member_name in my_char.group.members) {
            if(test) console.log('---->(forGroup:' + sBuff + ' ' + member_name + ' ' + lStatus + ')');
        	my_char.group.members[member_name].buffs[sBuff] = lStatus;
        }
	}
	if (forTarg) {
    	if(test) console.log('---->(forTarg:' + sBuff + ' ' + action.target + ' ' + lStatus + ')');
    	my_char.fullbuff.buffs[sBuff] = lStatus;
	}
	if (forGroupMember) {
    	//вешаем на кого скастовано
        if(test) console.log('---->(forGroupMember:' + sBuff + ' ' + action.target + ' ' + lStatus + ')');
        my_char.group.members[action.target].buffs[sBuff] = lStatus;
	}

    if (actionCommandBuff && lActionDone)
        clearAction();
}

function checkEquip() {
    if(test) console.log(' -->checkEquip() my_char:', my_char);
    my_char.eqChanged = false;

    //перевооружение
    if (my_char.weapon_set_change && my_char.weapon_set !== my_char.weapon_set_change && my_char.action.act === undefined) {
        console.log('-->weapon_set_change:',my_char.weapon_set_change);
        if(my_char.weapon_set==='shoot' && my_char.quiver) {
            doAct('remove', 'quiver');
        } else if(my_char.second!=undefined && my_char.armed_second===2) {
            doAct('remove', my_char.second.name);
        } else if(my_char.weapon && my_char.armed===2) {
            doAct('remove', my_char.weapon.name);
        } else if(my_char.armed===1 && my_char.armed_second===1) {
            if(my_char.weapon_set_change==='shoot' && !my_char.quiver) {
                doAct('wear', 'quiver');
            } else {
                my_char.weapon_set = my_char.weapon_set_change;
                if(my_char.weapon_set=='shoot') {
                    my_char.weapon = my_char.shoot;
                    my_char.second = {};
                } 
                if(my_char.weapon_set=='main') {
                    my_char.weapon = my_char.weapon_main;
                    my_char.second = my_char.weapon_second;
                }
            }
        }
    }

    if(my_char.action.act && (my_char.action.act !== 'get' || my_char.action.act !== 'wield' || my_char.action.act !== 'second')) {
        clearAction();
    }
    send("\\");

    if (my_char.armed === 0 && my_char.action.act !== 'get') {
        doAct('get', my_char.weapon.name);
    }
    if (my_char.armed_second === 0 && my_char.action.act !== 'get') {
        doAct('get', my_char.second.name);
    }

    if(my_char.action.act !== undefined) return;

    if (my_char.second!=undefined && my_char.second.name && my_char.armed_second === 1 && my_char.armed === 2 && my_char.action.act !== 'second') {
        doAct('second', my_char.second.name);
    }
    if (my_char.armed === 1 && my_char.action.act !== 'wield') {
        doAct('wield', my_char.weapon.name);
    }
}

function checkNeeds() {
    if(test) console.log('->checkNeeds(hunger:' + my_char.hunger + ' f:' + my_char.lfood
        + ' thirst:' + my_char.thirst + ' w:' + my_char.lwater + ')' +
    `(fight:${fight} ${positions.indexOf('fight')}<= ${positions.indexOf(mudprompt.p2.pos)})`);
    
    if (my_char.hunger + my_char.thirst == 0 
        && (my_char.ruler_badge===true || my_char.ruler_badge===undefined)
        && (!fight || positions.indexOf('fight') <= positions.indexOf(mudprompt.p2.pos))) {
        my_char.needsChanged = false;
        // поели, попили, раскладываем всё по местам (бочку в сумку)
        if(my_char.water_container!=='' && my_char.water_location!==my_char.water_container) {
            doAct('put ' + my_char.water + ' ' + my_char.water_container);
        }
        return;
    }
    if (my_char.action.act !== undefined) {
        return;
    }
    if (fight && positions.indexOf('fight') > positions.indexOf(mudprompt.p2.pos)) {
        my_char.needsChanged = true;
        doAct('stand');
        return;
    }

    if ((my_char.hunger + my_char.thirst > 0)) {
        if(!kach && (my_char.hunger <= 1 && my_char.thirst <= 1)
           && !(my_char.pract && (my_char.hunger || my_char.thirst))) {
                //TODO питаться если не полное здоровье/мана!!!
            if(test) console.log('-->[not so hunger/thirst - EXIT]');
            return;
        }
    }

    if (!kach && ['fight', 'stun', 'incap', 'mort', 'dead'].indexOf(mudprompt.p2.pos) !== -1 ) {
        return;
    }

    if (my_char.afk) {
        if(test) console.log('---->my_char.afk');
        changeAFK();
        my_char.needsChanged = true;
        return;
    }
    if(mudprompt['trv']!==undefined && mudprompt['trv']!=='none' && mudprompt['trv'].a.indexOf('F')!==-1) {
        my_char.was_fade = true;
    }
    //[#food]
    if (my_char.hunger) {
        if (!my_char.lfood) {
            if (my_char.food == 'manna' || my_char.food == 'mushroom') {
                if (checkPose('stand')) {
                    my_char.needsChanged = true;
                    doAct('cast', 'create food');
                    return;
                }
            } else if (my_char.food !== '') {
                if (checkPose('rest') && my_char.food_container!='') {
                    my_char.needsChanged = true;
                    doAct('get ' + my_char.food + ' ' + my_char.food_container);
                    return;
                }
            }
        } else {
            if (checkPose('rest')) {
                my_char.needsChanged = true;
                doAct('eat', my_char.food);
                return;
            }
        }

        if (my_char.action.act !== undefined) return;
    }
    //[#drink]
    if (my_char.thirst) {
        if(test) console.log("-->хочу пить!(water:"+my_char.water+" lwater:"+my_char.lwater+" water_location:"+my_char.water_location+")");
        if (!my_char.lwater) {
            if (my_char.water === 'spring') {
                if (checkPose('stand')) {
                    my_char.needsChanged = true;
                    doAct('cast', 'spring');
                    return;
                }
            }
            if (my_char.water_container!=='' && my_char.water_location!=='inv') {
                doAct('get ' + my_char.water + ' ' + my_char.water_container);
                return;
            }
            if (my_char.hasSpell("create water")) {
                if(test) console.log('-->(create water=' + my_char.spells.indexOf('create water') + ')');
                if(test) console.log(my_char.spells);
                if (my_char.spells.indexOf('create water') !== undefined) {
                    if(test) console.log('->(create water !== undefined)');
                    if (checkPose('stand')) {
                        my_char.needsChanged = true;
                        doAct('cast', 'create water', my_char.water);
                        return;
                    }
                }
            }
        } else {
            if (checkPose('rest')) {
                my_char.needsChanged = true;
                doAct('drink', my_char.water=='spring'?'':my_char.water);
                return;
            }
        }
    } 
    //[#ruler badge]
    if (my_char.ruler_badge===false && my_char.hasSpell("ruler badge")
        && my_char.action.act==undefined) {
        if (checkPose('stand')) {
            my_char.needsChanged = true;
            doAct('cast','ruler badge');
            return;
        }
    }

}
function checkPose(need_pose) {
    if(my_char.action.act != undefined) {
        return;
    }
    let need_index = positions.indexOf(need_pose),
        current_index = positions.indexOf(mudprompt.p2.pos);
    if(test) {
        console.log('-->checkPose()', need_pose); 
        console.log('  -->need', need_index, need_pose);
        console.log('  -->current', current_index, mudprompt.p2.pos);
    }

    //if(need_index === 7 && fight) return true;

    if(need_index === current_index) return true;

    if(need_index < current_index) {
        if(kach) {
            if(test) console.log("    -->kach:down");
            let command =  rest_rooms[mudprompt.vnum] ?? '';
            if(position_commands.indexOf(need_pose)!==-1) {
                doAct(need_pose, command);
                return false;
            } 
        }
        return true;
    }
    
    if(need_index > current_index || position_commands.indexOf(need_pose)===-1) {
        for(let i=need_index; i < positions.length; i++) {
            if(position_commands.indexOf(positions[i])!==-1) {
                need_pose = positions[i];
                break;
            }
        }
    }

    if (need_pose == mudprompt.p2.pos)
        return true;

    if(!my_char.last_pose) my_char.last_pose = mudprompt.p2.pos;

    doAct(need_pose);
    return false;
}
function changeAFK() {
    my_char.was_afk = my_char.afk ? true : false;
    doAct('afk');
}
function restoreStatus() {
    if(test) console.log('->restoreStatus()');
    if (test && my_char.last_pose) console.log('[last:' + my_char.last_pose + ']');
    if (test && my_char.was_afk) console.log('[was_afk]');
    if (test && my_char.was_fade) console.log('[was_fade]');
    if (my_char.action.act !== undefined) {
        if(test) console.log('[' + my_char.action.act + '->EXIT]');
        return;
    }
    if (my_char.was_fade && !((mudprompt['trv']!==undefined && mudprompt['trv']!=='none') && mudprompt['trv'].a.indexOf('F')!==-1)) {
        doAct('fade');
        return;
    }
    if (my_char.last_pose && my_char.last_pose != mudprompt.p2.pos && !fight) {
        let command =  rest_rooms[mudprompt.vnum] ?? '';
        doAct(my_char.last_pose, command);
        my_char.last_pose = null;
        return;
    }
    if (my_char.was_afk && !my_char.afk) {
        doAct('afk');
        return;
    }
}

//[#Конструкторы]
function Action(act, command, target) {
    this.act = act===undefined ? undefined : act; //spelling, wearing, drinking, eating, getting, slooking
    this.command = command===undefined ? undefined : command;
    this.target = target===undefined ? undefined : target;
}

function GroupMember(name, index_name) {
    this.name = name;
    this.index_name = index_name;
    this.align = pets[name] != undefined ? pets[name].align : 'n';
    this.buffs = {};
}
function Group() {
    this.members = {};
    this.spells = [];
}
function MemberSpell(member_name, member_level) {
    this.member = member_name;
    this.level = member_level;
}

function Pchar(name, char, level) {
    if (test)
        console.log(' -->Pchar() name:' + name, char);

    if( char === undefined ) char = {};

    this.init = name !== undefined; 
    this.afk = false;

    this.pract = false; //признак состояния прокачки скилов
    this.last_pose = null;
    this.was_afk = null;
    this.was_fade = null;

    this.name = name;
    this.level = level;

    this.needsChanged = true; //проверить рулер бэйдж при входе
    this.ruler_badge = (char===undefined || char.clan!='ruler') ? undefined : false;
    
    this.weapon_main = char?.weapons?.weapon_main ?? {name: char?.weapon};
    this.weapon_second = char?.weapons?.weapon_second;
    this.shoot = char?.weapons?.range_shoot ?? {};
    this.throw = char?.weapons?.range_throw ?? {};
    this.hold_equip = char?.weapons?.hold ?? '';
    this.shield_equip = char?.weapons?.shield ?? {};
    this.weapon_change = false;

    this.weapon = this.weapon_main;
    this.second = this.weapon_second;
    this.weapon_set = 'main';
    this.weapon_sets = [];
    
    this.weapon_sets[1] = 'main';
    if(this.shoot.name!==undefined) {
        this.weapon_sets[2] = 'shoot';
        this.quiver = false;
    }
    if(this.throw.name!==undefined)
        this.weapon_sets[3] = 'throw'; 
    //shoot throw
    /*
    wield bow
    Ты снимаешь красный чекан "Магодробитель".
    Ты вооружаешься Титаническим луком Стрельца.
    Титанический лук Стрельца становится частью тебя!

    wear qui
    Ты снимаешь счастливые кости.
    Ты берешь в руки колчан.

    shoot e.rab
    Твоя вторая рука должна быть свободна!

    wield war
    Ты снимаешь Титанический лук Стрельца.
    Ты вооружаешься красным чеканом "Магодробитель".
    Красный чекан "Магодробитель" становится частью тебя!   

    wear luck
    Ты снимаешь колчан.
    Ты берешь в руки счастливые кости.
    */

    this.align = char?.align;
    this.buffs_needs = char==undefined ? {} : char.buffs_needs;
    //[#armed] 0 - без оружия(оружие на земле), 1 - оружие в мешке, 2 - вооружен
    this.armed = 2;
    //[#armed_second] false; 0 - на земле, 1 - инвентарь, 2 - вооружен, 3 - первичное
    this.armed_second = 2;
    this.shield = true;

    this.affChanged = true; //проверить бафы

    this.food = char?.food;
    this.water = char?.water;
    this.thirst = 0;
    this.hunger = 0;
    this.lfood = false;
    this.lwater = false;
    //сосуд в инвентаре или в конейнере
    this.water_container = char.water_container;
    this.water_location = char.water_container===''?'inv':char.water_container;
    this.food_container = char.food_container===''?'inv':char.food_container;

    //[#action] act - команда к выполеннию (н-р: get, wield, cast)
    //          command - 'acid blast' | target 
    //          target - цель
    this.action = new Action(); 

    this.ordersChange = false;

    this.spells = getSpells(char, level);
    if(test) {
        console.log("getSpells() --> result:", this.spells);
    }
    this.skills = getSkills(char, level);
    if(test) {
        console.log("getSkills() --> result:", this.skills);
    }
    //this.kach_skills = {};

    this.hasBuff = function(cast){
        if(cast==="envenom") return envenom;
        if((mudprompt[buffs_list[cast].mgroup]!==undefined && mudprompt[buffs_list[cast].mgroup]!=='none') && mudprompt[buffs_list[cast].mgroup].a.indexOf(buffs_list[cast].mbrief)!==-1){
            if(test) console.log("------>Pchar->hasBuff("+cast+")->have one in mudprompt!");
            return true;
        } else if(this.buffs.isSet(cast)) { 
            if(test) console.log("------>Pchar->hasBuff("+cast+")->have one in my_char.buffs!");
            return true;
        }


        if(buffs_list[cast].ally!=undefined) {
            for(let ally of buffs_list[cast].ally) {
                if((mudprompt[buffs_list[ally].mgroup]!==undefined && mudprompt[buffs_list[ally].mgroup]!=='none') && mudprompt[buffs_list[ally].mgroup].a.indexOf(buffs_list[ally].mbrief)!==-1){
                    if(test) console.log("------>Pchar->hasBuff("+cast+")->have ally("+ally+")!");
                    return true;
                } else if (this.buffs.isSet(ally)) { 
                    if(test) console.log("------>Pchar->hasBuff("+cast+")->have ally("+ally+") in my_char.buffs!");
                    return true;
                }
            }
        }
        if(test) console.log("------>Pchar->hasBuff=>FALSE");
        return false;
    };
    this.hasSpell = (spell) => this.spells.indexOf(spell) >= 0 ? true : false;
    this.hasSkill = (skill) => this.skills.hasOwnProperty(skill);

    this.fullbuff = new Fullbuff();

	this.order = new Order();

    this.group = new Group();
    this.buffs = {
        list: {},
        set : function(spell) {
            this.list[spell] = spell;
        },
        get : function(spell) {
            return this.list[spell];
        },
        remove : function(spell) {
            this.list[spell] = undefined;
        },
        isSet : function(spell) {
            return this.get(spell) != undefined;
        }
    };
    this.attack_spells = {
        list:{
            close:[],
            range:[],
            curse:[],
            room:[],
        },
        set: undefined,
        get_prompt: function() {
            let groups_hints = {
                "range":{
                    short: 'rng',
                    key: '>',
                    alts: ['c','c+a'],
                },
                "close":{
                    short: 'cls',
                    key: '+',
                    alts: ['','c','s'],
                },
                "curse":{
                    short: 'crs',
                    key: '-',
                    alts: ['','c','s'],
                },
                "room":{
                    short: 'rm',
                    key: '.',
                    alts: ['','c','s'],
                },
            };
            let result = "";
            if(this.set==undefined) {
                this.set_attack_spells();
            }
            for(let group in groups_hints) {
                if(this.set[numpad_set][group]==undefined || this.set[numpad_set][group].length==0) continue;

                result += "<b>[</b>"+groups_hints[group].short+"["+groups_hints[group].key+"]:";
                for(let key in this.set[numpad_set][group]) {
                    if(key>0) result += "/";
                    result += '<b>'+attack_spells_list[this.set[numpad_set][group][key]].short+'</b>'
                        + (groups_hints[group].alts[key]!='' ? '['+groups_hints[group].alts[key]+']' : '');
                }

                result += "<b>]</b> ";
            }
            return result!="" ? ("("+numpad_set+") "+result) : result;

        },
        set_attack_spells: function() {
            this.set = []
            this.set[numpad_set]={};
            for(let spell of my_char.spells) {
                if(attack_spells_list[spell]==undefined) continue;

                if(attack_spells_list[spell].class=="room" || attack_spells_list[spell].area) 
                    this.addSpell(spell,'room');

                if(attack_spells_list[spell].range) 
                    this.addSpell(spell,'range');

                if(attack_spells_list[spell].target && attack_spells_list[spell].class=="attack") 
                    this.addSpell(spell,'close');

                if(attack_spells_list[spell].class=="maladiction") 
                    this.addSpell(spell,'curse');
            }   
            //console.log(this);
        },
        addSpell:function(spell,group) {
            let max_key = group=='range' ? 2 : 3;
            this.list[group].push(spell);
            if(this.set[numpad_set][group]==undefined) 
                this.set[numpad_set][group] = [];
            
            if(this.set[numpad_set][group].length >= max_key)
                return;

            for(let key = 0; key<max_key; key++)
                if(this.set[numpad_set][group][key]==undefined){
                    this.set[numpad_set][group][key]=spell;
                    break;
                }
        },
        changeSpell:function(group,key){
            let curr_spell = my_char.attack_spells.set[numpad_set][group][key];
            let new_index = my_char.attack_spells.list[group].indexOf(curr_spell)+1;
            if(new_index>=my_char.attack_spells.list[group].length) new_index = 0;

            my_char.attack_spells.set[numpad_set][group][key] = my_char.attack_spells.list[group][new_index];

            echo(this.attack_spells.get_prompt());
        },
        showSpells:function(group,key) {
            let result = '';
            for(let i in my_char.attack_spells.list[group]){
                result += "["+i+"."+my_char.attack_spells.list[group][i]+"]";
            }
            echo(result);
        },
        get_spell: function(group,key){
            return my_char.attack_spells.set[numpad_set][group][key];
        },
    };
}
//структура fullbuff
function Fullbuff(bclass, btarget, all) {
    if(test) console.log('->Fullbuff('+bclass+','+btarget+','+all+')');
	this.class = bclass === undefined ? undefined : bclass;
	this.target = btarget === undefined ? undefined : btarget;
	this.all = all === undefined ? false : all;
	this.buffs = {};
    this.empty = [];
    this.away = [];
    this.hasBuff = function (ch_name, spell_name) {
        if(ch_name==my_char.name) {
            if(my_char.hasBuff(spell_name)) {
                if(test)console.log("------->Fullbuff->hasBuff(has one)");
                return true;
            }
            if(buffs_list[spell_name].antogonist!=undefined) {
                for(let antogonist of buffs_list[spell_name].antogonist) {
                    if(my_char.hasBuff(antogonist)) {
                        if(test)console.log("------->Fullbuff->hasBuff(has antogonist: "+antogonist+")");
                        return true;
                    }
                }
            }
            if(buffs_list[spell_name].ally!=undefined) {
                for(let ally of buffs_list[spell_name].ally) {
                    if(my_char.hasBuff(ally)) {
                        if(test)console.log("------->Fullbuff->hasBuff(has ally: "+ally+")");
                        return true;
                    }
                }
            }
        } else if (my_char.group.members[ch_name]!=undefined) {
            if(my_char.group.members[ch_name].buffs[spell_name]) {
                if(test)console.log("------->Fullbuff->hasBuff(member have one)");
                return true;
            }
            if(buffs_list[spell_name].antogonist!=undefined) {
                for(let antogonist in buffs_list[spell_name].antogonist) {
                    //my_char.group.members[target_name].buffs[spell_name]
                    if(my_char.group.members[ch_name].buffs[antogonist]) {
                        if(test)console.log("------->Fullbuff->hasBuff(member has antogonist: "+antogonist+")");
                        return true;
                    }
                }
            }
            if(buffs_list[spell_name].ally!=undefined) {
                for(let ally in buffs_list[spell_name].ally) {
                    if(my_char.group.members[ch_name].buffs[ally]) {
                        if(test)console.log("------->Fullbuff->hasBuff(member has ally: "+ally+")");
                        return true;
                    }
                }
            }
        } else {
            if(my_char.fullbuff.buffs[spell_name]) {
                if(test) console.log("------->Fullbuff->hasBuff(target have one)");
                return true;
            }
            if(buffs_list[spell_name].antogonist!==[]) {
                for(let antogonist in buffs_list[spell_name].antogonist) {
                    //my_char.group.members[target_name].buffs[spell_name]
                    if(my_char.fullbuff.buffs[antogonist]) {
                        if(test)console.log("------->Fullbuff->hasBuff(target has antogonist: "+antogonist+")");
                        return true;
                    }
                }
            }
            if(buffs_list[spell_name].ally!==[]) {
                for(let ally in buffs_list[spell_name].ally) {
                    if(my_char.fullbuff.buffs[ally]) {
                        if(test)console.log("------->Fullbuff->hasBuff(target has ally: "+ally+")");
                        return true;
                    }
                }
            }
        }
        if(test)console.log("------->Fullbuff->hasBuff()==FALSE!")
        return false;
    }
}

function Order(comm) {
	this.command = comm===undefined ? undefined : comm;
	this.proced = comm===undefined ? undefined : 0;
    this.name_num = [];
}

function getSkills(char, level) {
    let result = {};
    let askills = [];

    if(char===undefined) return askills;

    askills.push(['throwing weapon', 1]);

    if(char.class=== 'thief') {
        askills.push(['dodge', 1]);
        askills.push(['shield block', 7]);
        askills.push(['hand to hand', 1]);
        askills.push(['dagger', 1]);
        askills.push(['sword', 1]);
        askills.push(['detect hide', 5]);
        askills.push(['haggle', 6]);
        askills.push(['mace', 6]);
        askills.push(['circle', 7]);
        askills.push(['envenom', 16]);
        askills.push(['sneak', 4]);
        askills.push(['hide', 4]);
        askills.push(['peek', 2]);        
        askills.push(['lore', 13]);
        askills.push(['dirt kicking', 3]);
        askills.push(['trip', 3]);
        askills.push(['kick', 5]);  
    }
    if(char.class=== 'vampire') {
        askills.push(['lore', 20]);
    }

    if(char.class=== 'samurai') {
        askills.push(['kick', 2]);
        askills.push(['trip', 9]);
        askills.push(['herbs', 12]);
        askills.push(['berserk', 20]);
        askills.push(['lore', 22]);
        askills.push(['counter', 28]);
    }

    askills = askills
        .filter(function(item, index, array){
            return item[1]<=level;
        })
        .map(function(item, index, array){
            return item[0]
        });
    
    for(let skill of askills) {
        result[skill] = skills[skill];
    }

    return result;
}

function getSpells(char, level) {
    let spells = [], result = [];
    if (char!==undefined && char.clan === 'invader') {
        spells.push(['shadow cloak',10]);
        spells.push(['shadowlife',30]);
        spells.push(['evil spirit',33]);
        spells.push(['nightfall',16]);
    }
    if (char!==undefined && char.clan === 'ruler') {
        spells.push(['ruler aura',10]);
        spells.push(['ruler badge',10]);
    }
    if (char!==undefined && char.clan === 'hunter') {
        spells.push(['wolf',20]);spells.push(['detect trap',25]);spells.push(['find object',25]);
    }
    if (char!==undefined && char.class === 'cleric') {
        spells.push(['heal',2]);spells.push(['harm',2]);spells.push(['create water',3]);spells.push(['refresh',7]);spells.push(['create food',8]);spells.push(['observation',10]);spells.push(['cure blindness',11]);spells.push(['detect evil',11]);spells.push(['detect good',11]);spells.push(['shield',12]);spells.push(['blindness',14]);spells.push(['faerie fire',15]);spells.push(['detect magic',15]);spells.push(['fireproof',16]);spells.push(['earthquake',19]);spells.push(['cure disease',19]);spells.push(['armor',20]);spells.push(['bless',20]);spells.push(['continual light',21]);spells.push(['poison',22]);spells.push(['summon',22]);spells.push(['cure poison',23]);spells.push(['weaken',24]);spells.push(['infravision',25]);spells.push(['calm',26]);spells.push(['heating',27]);spells.push(['dispel evil',27]);spells.push(['dispel good',27]);spells.push(['spring',27]);spells.push(['control weather',28]);spells.push(['sanctuary',29]);spells.push(['fly',30]);spells.push(['locate object',30]);spells.push(['enchant armor',30]);spells.push(['awakening',31]);spells.push(['faerie fog',31]);spells.push(['teleport',32]);spells.push(['remove curse',32]);spells.push(['pass door',32]);spells.push(['word of recall',32]);spells.push(['cancellation',32]);spells.push(['curse',33]);spells.push(['plague',33]);spells.push(['enhanced armor',33]);spells.push(['remove fear',34]);spells.push(['frenzy',34]);spells.push(['portal',35]);spells.push(['learning',35]);spells.push(['mental block',35]);spells.push(['gate',35]);spells.push(['mind light',36]);spells.push(['identify',36]);spells.push(['stone skin',36]);spells.push(['ray of truth',37]);spells.push(['bluefire',37]);spells.push(['compound',37]);spells.push(['superior heal',38]);spells.push(['slow',38]);spells.push(['protective shield',38]);spells.push(['protection heat',39]);spells.push(['giant strength',39]);spells.push(['dragon skin',40]);spells.push(['healing light',41]);spells.push(['cursed lands',41]);spells.push(['sanctify lands',41]);spells.push(['flamestrike',42]);spells.push(['energy drain',42]);spells.push(['dispel affects',43]);spells.push(['protection cold',44]);spells.push(['severity force',45]);spells.push(['group defense',45]);spells.push(['improved detect',45]);spells.push(['holy word',48]);spells.push(['inspire',49]);spells.push(['cure corruption',50]);spells.push(['aid',53]);spells.push(['nexus',55]);spells.push(['master healing',58]);spells.push(['desert fist',58]);spells.push(['blade barrier',60]);spells.push(['group heal',65]);spells.push(['restoring light',71]);spells.push(['benediction',80]);//spells.push(['detect invis',17]);
    }
    if (char!==undefined && char.class === 'necromancer') {
        spells.push(['dark shroud',21]);
        spells.push(['shield',12]);
        spells.push(['protective shield',18]);
        spells.push(['armor',20]);
        spells.push(['stone skin',30]);
        spells.push(['protection good',17]);
        spells.push(['spell resistance',69]);
        spells.push(['mental block',36]);
        spells.push(['magic concentrate',60]);
        spells.push(['protection negative',15]);
        spells.push(['protection cold',50]);
        spells.push(['giant strength',28]);
        spells.push(['detect invis',6]);
        spells.push(['improved detect',40]);
        spells.push(['infravision',21]);
        spells.push(['fly',23]);
        spells.push(['pass door',27]);
        //spells.push(['learning',33]);
        //spells.push(['create water',11]);
        //spells.push(['create food',12]);
        //spells.push(['create spring',31]);
        spells.push(['disruption',40]);
        spells.push(['acid blast',63]);
        spells.push(['hand of undead',44]);
        spells.push(['magic missile',1]);
        //spells.push(['acid arrow',48]);
        spells.push(['burning hands',10]);
        spells.push(['chill touch',5]);
        spells.push(['sonic resonance',28]);
        spells.push(['lightning ward ',41]);
        spells.push(['lightning bolt',23]);
        spells.push(['chain lightning',33]);
        spells.push(['spectral furor',35]);
        spells.push(['hurricane',65]);
        spells.push(['cursed lands',64]);
        spells.push(['narcotic mist',27]);
        spells.push(['shielding',53]);
        spells.push(['energy drain',45]);
        spells.push(['magic jar',68]);
        spells.push(['power word kill',78]);
        spells.push(['insanity',59]);
        spells.push(['curse',34]);
        spells.push(['plague',36]);
        spells.push(['corruption',63]);
        spells.push(['web',58]);
        spells.push(['blindness',22]);
        spells.push(['poison',23]);
        spells.push(['slow',29]);
        spells.push(['weaken',100]);
        spells.push(['fear',51]);
        spells.push(['dispel affects',24]);
        spells.push(['evil spirit',33]);
    }
    if (char!==undefined && char.class === 'samurai') {
        spells.push(['cure blindness',20]);spells.push(['refresh',28]);spells.push(['cure poison',35]);spells.push(['calm',60]);
    }
    if (char!==undefined && char.class === 'vampire') {
    }
    spells = spells
        .filter(function(item, index, array){
            return item[1]<=level;
        })
        .map(function(item, index, array){
            return item[0]
        });
    for(let spell of spells) {
        result[spell] = {};
    }
    return result;
}

function getBuffClass(text) {
	/*
	det - detection, 
	trv - transport&travel
    enh - fightmaster&enhancement, 
	pro - protective,
    cln - clan skills and spells
	*/
	// detection  protective
	if (text.match('^def.*|^pro.*')) {
    	return 'protective';
	}
	if (text.match('^det')) {
    	return 'detection';
	}
	return false;
}
function BuffQueue(sBuff, lStatus, lActionDone, action) {
	this.sBuff = sBuff;
	this.lStatus = lStatus;
	this.lActionDone = lActionDone;
	this.action = action;
}
var buffPatterns = [
	// pattern, status, active
    ['ruler aura', '^Аура Правителя исчезает, и ты теряешь возможность видеть незримое иным.$', false, false],
	['ruler aura', '^Жемчужно-серая аура Правителя окружает тебя, даруя способность видеть незримое иным.$', true, true],
	['ruler aura', '^Аура Рулера исчезает.$', false, false],
	['ruler aura', '^Теперь ты чувствуешь себя более информированным, правя Миром.$', true, true],
	['ruler aura', '^Ты и так уже знаешь многое в этом мире, неподвластное другим.$', true, true],
	['learning', '^Желание учиться покидает тебя.$', false, false],
	['learning', '^Ты концентрируешься на учебе.$', true, true],
	['learning', '^.* будет учиться лучше!$', true, true],
	['learning', '^Куда уж больше.$', true, true],
	['learning', '^.* уже учится.$', true, true],
	['learning', '^Ему это не поможет.$', true, true],
	['aid', '^Ты можешь помочь еще кому-нибудь.$', false, false],
	['aid', '^Волна тепла согревает твое тело.$', true, true],
	['aid', '^Это заклинание использовалось совсем недавно.$', true, true],
	['armor', '^Окружавшая тебя броня исчезает.$', false, false],
	['armor', '^Священная броня окружает .*.$', true, true],
 	['armor', '^.* окружает священная броня, дарованная .*.$', true, true],
	['armor', '^Тебя окружает священная броня, дарованная .*$', true, true],
    //['armor', '^Волшебная броня окружает .*.$', true, true],
	['armor', '^.* окружает магическая броня, улучшающая защитные навыки.$', true, true],
	//['armor', '^.* уже защищен(а)? заклинанием брони.$', true, true],
	['armor', '^.* уже под воздействием заклинания брони.$', true, true],
	['armor', '^Ты уже под воздействием заклинания брони.$', true, true],
    ['shield', '^Щит, окружавший тебя, исчезает.$', false, false],
	['shield', '^Божественная энергия окружает .* щитом.$', true, true],
    ['shield', '^.* окружает священный щит, дарованный .*\.', true, true],
	['shield', '^Тебя окружает священный щит, дарованный .*\.$', true, true],
	//['shield', '^Волшебный щит окружает .*.$', true, true],
    ['shield', '^.* окружает магический щит, помогающий блокировать удары.$', true, true],
	//['shield', '^.* уже защищен(а)? заклинанием щита.$', true, true],
	['shield', '^.* уже под воздействием этого заклинания.$', true, true],
	['enhanced armor', '^Силовое поле, защищавшее тебя, исчезает.$', false, false],
	//['enhanced armor', '^Силовая защита окружает .*.$', true, true],
    ['enhanced armor', '^.* окружает силовое поле, дарованное .*.$', true, true],
    ['enhanced armor', '^Тебя окружает силовое поле, помогающее уходить от ударов.*.$', true, true],
    ['enhanced armor', '^Тебя окружает силовое поле, дарованное .*$', true, true],
//	['enhanced armor', '^Силовое поле уже защищает тебя.$', true, true],
	['enhanced armor', 'Ты уже под защитой силового поля.$', true, true],
	['enhanced armor', '.* уже под защитой силового поля\.$', true, true],
	['enhanced armor', '^Силовое поле уже окружает .*.$', true, true],
    ['benediction', '^Ты ощущаешь дарованную .* благость!$', true, true],
    ['benediction', '^Ты уже наслаждаешься благостью богов.$', true, true],
    ['benediction', '^.* ощущает дарованную .* благость!$', true, true],
    ['benediction', '^.* уже наслаждается благостью богов.$', true, true],
    ['benediction', '^Аура божественной благости вокруг тебя исчезает.$', false, false],
    ['bless', '^Ты больше не чувствуешь божественного благословления.$', false, false],
	['bless', '^Ты больше не чувствуешь божественного благословения.$', false, false],
	['bless', '^Ты чувствуешь благословение .*!$', true, true],
	['bless', '^Ты чувствуешь божественное благословение.$', true, true],
	['bless', '^.* уже благословлен.?\.$', true, true],
	['bless', '.* уже под воздействием этого заклинания\.$', true, true],
	['bless', '^Ты даришь .* благословение своих богов\.$', true, true],
	['bless', '^Благословение .* снисходит на .*\.$', true, true],
	['bless', '^Благословение богов снисходит на .*\.$', true, true],
	['sanctuary', '^Белая аура вокруг тебя исчезает.$', false, false],
	['sanctuary', '^Белая аура окружает .*.$', true, true],
	['sanctuary', '^Вокруг .* вспыхивает белая аура, дарованная .*.$', true, true],
	['sanctuary', '^.* уже под защитой святилища.', true, true],
	['sanctuary', '^Аура святилища уже защищает .*.', true, true],
	['sanctuary', 'Аура святилища уже защищает тебя.$', true, true],
	['sanctuary', '^.* уже под защитой темных богов.', true, true],
	['observation', '^Ты больше не видишь состояния других.$', false, false],
	['observation', '^Теперь ты замечаешь состояние других.$', true, true],
	['observation', '^Теперь ты можешь диагностировать негативные аффекты других существ.$', true, true],
	['observation', '^Ты уже замечаешь состояние других.$', true, true],
	['fly', '^Ты медленно опускаешься на землю.$', false, false],
	['fly', '^Твои ноги отрываются от земли.$', true, true],
	['fly', '^.*? поднимается в воздух\.$', true, true],
	['fly', '^.* уже находи.*ся в воздухе\.$', true, true],
	['fly', '^.* уже находи.*ся в воздухе\.$', true, true],
	['fly', '^.* может подняться в воздух и без твоей помощи\.$', true, true],
	['stardust', '^Звездная пыль вокруг тебя рассеивается.$', false, false],
	['stardust', '^Мерцающая звездная пыль закружилась вокруг .*\.$', true, true],
	['stardust', '^Звездная пыль уже кружится вокруг .*\.$', true, true],
	['stardust', '.* уже под воздействием звездной пыли, этого достаточно.$', true, true],
	['sanctuary', '.* уже под воздействием звездной пыли, этого достаточно.$', true, true],
	['stardust', '.* уже под защитой святилища.$', true, true],
//	['stardust', '^.* уже под защитой святилища\.$', true, true],
	['stardust', '^.* может подняться в воздух и без твоей помощи\.$', true, true],
	['frenzy', '^Твой гнев проходит.$', false, false],
	['frenzy', '^Дикая ярость наполняет тебя!$', true, true],
	['frenzy', '^В глазах .* вспыхивает дикая ярость!$', true, true],
	['frenzy', '^Волею .* глаза .*зажигаются диким огнем!$', true, true],
	['frenzy', '^Твои боги не благосклонны к ', true, true],
	['frenzy', '^Кажется, .* не по душе Дворкину.', true, true],
	['frenzy', '^Сейчас ничто не может разозлить ', true, true],
	['frenzy', '^.* уже в ярости!$', true, true],
    ['frenzy', 'молит о неистовстве, но богам явно не по душе .*$', true, true],
    ['frenzy', 'слишком миролюбив для этого.*$', true, true],
    ['frenzy', 'Ты молишь о неистовстве, но .* явно не по душе .*\.$', true, true],
	['stone skin', '^Твоя кожа становится мягче.$', false, false],
    ['stone skin', '^Каменная корка на твоей коже трескается под ударами и исчезает.$', false, false],
	//['stone skin', '^Твоя кожа становится тверже камня.$', true, true],
    ['stone skin', '^Твоя кожа становится серой, превращаясь в камень.$', true, true],
    ['stone skin', '^Кожа .* становится серой, превращаясь в камень.$', true, true],
	['stone skin', 'Твоя кожа уже тверда как камень.$', true, true],
	['dragon skin', '^Твоя кожа становится мягче.$', false, false],
	['dragon skin', '^Твоя кожа уже тверда, как драконья.$', true, true],
	['dragon skin', '^Твоя кожа становится тверже драконьей.$', true, true],
	['dragon skin', '^Твоя кожа покрывается драконьей чешуей.$', true, true],
	['protective shield', '^Охранный щит вокруг тебя исчезает.$', false, false],
	//['protective shield', '^Охранный щит окружает тебя.$', true, true],
    ['protective shield', '^.* окружает тускло светящийся охранный щит, отклоняющий резкие толчки и удары.$', true, true],
	['protective shield', '^Охранный щит уже окружает тебя.$', true, true],
	['protective shield', '^Тебя окружает тускло светящийся охранный щит, дарованный .*.$', true, true],
	['protective shield', 'Ты уже под воздействием охранного щита.$', true, true],
	['protective shield', '^Предохранительный щит окружает тебя.$', true, true],
	['giant strength', '^Ты становишься слабее.$', false, false],
	['giant strength', '^Слабость проходит... но лишь на мгновение.$', false, true],
	['giant strength', '^Ты чувствуешь, как силы возвращаются к тебе.$', false, true],
//	['giant strength', ' станови[тшь]{1,2}ся намного сильнее.$', true, true],
	['giant strength', '^Ты становишься намного сильнее!$', true, true],
	['giant strength', '^.* напрягает мускулы, становясь намного сильнее!$', true, true],
//	['giant strength', '^.* не може[тшь]{1,2} быть еще сильнее.$', true, true],
	['giant strength', '^(Ты||.*) уже обладае(шь||ет) гигантской силой.$', true, true],
	['giant strength', ' уже обладает гигантской силой.$', true, true],
	['protection heat', '^Твоя защищенность от воздействия высоких температур понижается.$', false, false],
	['protection heat', '^Твоя защищенность от воздействия высоких температур повышается.$', true, true],
	['protection heat', '^Ты теперь лучше защищен от воздействия высоких температур.$', true, true],
	['protection heat', '^Ты уже защищен от огня.$', true, true],
//	['protection cold', '^Твоя защищенность от воздействия низких температур повышается.$', true, true],
	['protection cold', '^Ты теперь лучше защищен от воздействия низких температур.$', true, true],
	['protection cold', '^Ты уже защищен от холода.$', true, true],
//	['protection cold', '^Твоя защищенность от воздействия низких температур понижается.$', false, false],
	['protection cold', '^Ты теряешь защиту от воздействия низких температур.$', false, false],
	['inspire', '^Твое воодушевление проходит.$', false, false],
	['inspire', 'Ты чувствуешь воодушевление!', true, true],
	['inspire', '^Ты уже воодушевлен.$', true, true],
	['inspire', 'Волею .* ты чувствуешь воодушевление!', true, true],
	//['detect invis', '^Ты более не чувствуешь присутствие невидимых сил.$', false, false],
	['detect invis', '^Ты больше не видишь невидимое.$', false, false],
//	['detect invis', '^Теперь ты чувствуешь присутствие невидимых сил.$', true, true],
	['detect invis', '^Теперь ты можешь увидеть невидимое.$', true, true],
//	['detect invis', '^Ты уже чувствуешь присутствие невидимых сил.$', true, true],
	['detect invis', '^Ты уже видишь невидимое.$', true, true],
	['detect invis', '^Глаза .* сужаются, получая способность видеть невидимое.$', true, true],
	['detect magic', '^Теперь ты чувствуешь ауру магии вокруг предметов и существ.$', true, true],
	['detect magic', '^Ты больше не различаешь ауру магии вокруг предметов и существ.$', false, false],
	['infravision', '^Твои глаза загораются красным светом.$', true, true],
//	['improved detect', '^Ты теперь не замечаешь очень невидимые силы.$', false, false],
	['improved detect', '^Твои глаза расслабляются, теряя способность видеть очень невидимое.$', false, false],
//	['improved detect', '^Теперь ты чувствуешь присутствие очень невидимых сил.$', true, true],
	['improved detect', '^Теперь ты можешь увидеть очень невидимое.$', true, true],
//	['improved detect', '^Ты уже чувствуешь присутствие очень невидимых сил.$', true, true],
	['improved detect', '^Ты уже видишь очень невидимое.$', true, true],
	['invisibility', '^Ты появляешься из ниоткуда.$', false, false],
	['invisibility', '^Теперь окружающие видят тебя.$', false, false],
	['invisibility', '^Ты становишься невидимым.$', true, true],
	['invisibility', '^Тебя уже и так не видно.$', true, true],
	['improved invis', '^Ты становишься видимым для окружающих.$', false, false],
	['improved invis', '^Ты становишься совсем невидимым.$', true, true],
	['infravision', '^Ты более не видишь в темноте.$', false, false],
	['infravision', '^Твои глаза загораются красным светом.$', true, true],
	['infravision', '^Ты уже видишь в темноте.$', true, true],
	['detect good', '^Ты больше не видишь Золотой ауры.$', false, false],
	['detect good', '^Теперь ты чувствуешь присутствие добра.$', true, true],
	['detect good', '^Ты уже чувствуешь присутствие добрых сил.$', true, true],
	['detect evil', '^Ты больше не видишь Красной ауры.$', false, false],
	['detect evil', '^Теперь ты чувствуешь зло.$', true, true],
	['detect evil', '^Ты уже чувствуешь присутствие дьявольских сил.$', true, true],
	['protection good', '^Ты беззащитен перед добром.$', false, false],
	['protection good', '^Ты чувствуешь защиту темных сил.$', true, true],
//	['protection good', '^Ты уже защищен.$', true, true],
	['protection evil', '^Ты чувствуешь себя беззащитнее перед злом.$', false, false],
	['protection evil', '^Ты чувствуешь защиту светлых сил.$', true, true],
//	['protection evil', '^Ты уже защищен.$', true, true],
    //['haste', '^Твои движения становятся намного быстрее.$', true, true],
	['haste', '^Твои движения и метаболизм ускоряются!$', true, true],
    //['haste', '^Ты не можешь двигаться быстрее, чем сейчас!$', true, true],
    ['haste', 'Ты уже мечешься вокруг как ежик Соник.$', true, true],
	['haste', ' не может двигаться еще быстрее.$', true, true],
	//['mental block', '^Теперь ты будешь блокировать все попытки ментального контакта с тобой.$', true, true],
	['mental block', '^Вокруг твоей головы возникает кокон, защищая от транспортных заклятий.$', true, true],
	['mental block', '^Вокруг головы .* возникает кокон, защищая от транспортных заклятий.$', true, true],
	['mental block', '^Ты уже блокируешь все попытки ментального контакта.$', true, true],
	['mental block', '^.* уже блокирует все попытки ментального контакта.$', true, true],
	['mental block', '^Ты теряешь способность блокировать ментальный контакт.$', false, false],
	['transform', '^Здоровье, приданное тебе магией, исчезает прочь.$', false, false],
	['transform', '^Прилив жизненной силы затмевает твой разум.$', true, true],
	['transform', '^Ты уже переполнен жизненной энергией.$', true, true],
	//['magic concentrate', '^Ты чувствуешь, как сверхмощная способность к разрушению заполняет все твое тело.', true, true],
	['magic concentrate', '^Меж твоих ладоней вспыхивает яркая искра, даруя способность фокусировать магию.', true, true],
//	['magic concentrate', '^Ты уже достаточно сконцентрирован.', true, true],
	['magic concentrate', '^Ты уже готов фокусировать магию.', true, true],
//	['magic concentrate', '^Ты теряешь невидимую нить, связывающую тебя с источником магической силы.', false, false],
	['magic concentrate', '^Искра между твоих ладоней исчезает, и ты теряешь способность фокусировать магию.', false, false],
	//['spell resistance', '^Теперь заклинания причиняют тебе меньший вред.', true, true],
	['spell resistance', '^Ты окутываешься энергетическим коконом, защищающим от заклинаний.', true, true],
	//['spell resistance', '^Ты уже имеешь эту защиту.', true, true],
    ['spell resistance', 'Ты уже устойчив(а)? к заклинаниям.$', true, true],
	['spell resistance', '^Заклинания вновь имеют полную силу против тебя.', false, false],
	['blindness', '^Тебя ослепили!$', true, true],
	['blindness', '^Не получилось.$', false, true],
	['blindness', '^Ты вновь обретаешь зрение.$', false, true],
	['blindness', '^Твое зрение в порядке.$', false, false],
	['blindness', '^Твое зрение в порядке.$', false, true],
	['faerie fire', '^Тебя окружает Розовая аура.$', true, true],
	['faerie fire', '^Розовая аура вокруг тебя исчезает.$', false, false],
	['dark shroud', '^Темная аура вокруг тебя исчезает.$', false, false],
	['dark shroud', '^Белая аура вокруг тебя исчезает.$', false, false],
	['dark shroud', '^Темная аура окружает .*.$', true, true],
	['dark shroud', '^.* уже под защитой святилища.', true, true],
	['dark shroud', '^.* уже под защитой темных богов.', true, true],
    ['dark shroud', '^.* уже под воздействием темной ауры, этого достаточно.', true, true],
    ['sanctuary', '^.* уже под воздействием темной ауры, этого достаточно.', true, true],
    ['stardust', '^.* уже под воздействием темной ауры, этого достаточно.', true, true],
    ['dark shroud', '^Темная аура защитит только злых персонажей.$', true, true],
//	['protection negative', '^Ты беззащитен перед своими атаками.$', false, false],
	['protection negative', '^Багровый щит, защищающий тебя от темной энергии, исчезает.$', false, false],
//	['protection negative', '^Ты приобретаешь иммунитет к негативным атакам.$', true, true],
	['protection negative', '^Ты окутываешься багровым щитом, получая сопротивляемость к темной энергии.$', true, true],
//	['protection negative', '^У тебя уже есть иммунитет к негативным атакам.', true, true],
	['protection negative', '^Ты уже защищен от темной энергии.', true, true],
	['shadow cloak', '^Призрачная мантия, окутывавшая тебя, тает.$', false, false],
	['shadow cloak', '^Жажда чужих душ стихает внутри тебя.$', false, false],
	//['shadow cloak', '^Призрачная мантия окутывает тебя.$', true, true],
    ['shadow cloak', '^Призрачная мантия окутывает тебя. Ты погружаешься во тьму.$', true, true],
    ['shadow cloak', '^Призрачная мантия уже защищает тебя.$', true, true],
    ['shadow cloak', '^В тебе загорается огонь, жаждущий душ ангелов.$', true, true],
	['shadow cloak', '^Призрачная мантия уже защищает тебя.$', true, true],
	['shadow cloak', '^Жажда душ уже горит в тебе.$', true, true],

	['detect undead', '^Ты перестаешь чувствовать мертвецов.$', false, false],
	['detect undead', '^Теперь ты чувствуешь нежить.$', true, true],
	['detect undead', '^Ты уже чувствуешь нежить.', true, true],
    ['detect hide', 'Ты пытаешься увидеть скрытое, но у тебя ничего не выходит.', false, true],
    ['detect hide', 'Ты перестаешь замечать скрытые детали в окружающей обстановке.', false, false],
    ['detect hide', '^Теперь ты можешь увидеть скрытое.$', true, true],
    ['sneak', '^Ты начинаешь двигаться бесшумно.$', true, true],
    ['sneak', '^Ты чувствуешь, что снова производишь слишком много шума при ходьбе.$', false, false],
    ['sneak', '^Ты пытаешься двигаться бесшумно, но терпишь неудачу.$', false, true],
    ['hide', '^Ты тщательно скрываешься, прячась в тенях у стены.$', true, true],
    ['hide', '^Ты пытаешься скрыться, но терпишь неудачу.$', false, true],
    ['hide', '^Ты перестаешь скрываться в тенях.$', false, false],
    ['berserk', '^Твой пульс учащается, когда ты входишь в ярость!$', true, true],
    ['berserk', '^Ты уже в состоянии боевой ярости!$', true, true],
    ['berserk', '^Тебе не удается войти в боевую ярость.$', false, true],
    ['berserk', '^Твой пульс замедляется, и боевая ярость пропадает.$', false, false],
    ['detect trap', '^Теперь ты будешь замечать чужие ловушки\.$', true, true],
    ['detect trap', '^Ты и так в состоянии отличить бревно от капкана\.$', true, true],
    ['detect trap', '^Ты теряешь способность замечать чужие ловушки\.$', false, false],
];
var pets = {
    'белый тур': {
        'spells' : [
            'armor', 'bless', 'calm', 'continual light', 'control weather', 'create food', 'cure blindness', 'cure disease', 'cure poison', 'detect invis', 'dragon skin', 'enhanced armor', 'faerie fog', 'fly', 'frenzy', 'giant strength', 'heal', 'infravision', 'learning', 'mind light', 'pass door', 'protection evil', 'protection good', 'protection heat', 'protective shield', 'refresh', 'remove curse', 'sanctuary', 'shield', 'spring', 'stone skin', 'word of recall'
        ],
        'align' : 'n',
        'ename' : 'aurochs',
    },
    'ослик': {
        'spells' : [
            'armor', 'bless', 'calm', 'continual light', 'control weather', 'create food', 'cure blindness', 'cure disease', 'cure poison', 'detect invis', 'dragon skin', 'enhanced armor', 'faerie fog', 'fly', 'frenzy', 'giant strength', 'heal', 'infravision', 'learning', 'mind light', 'pass door', 'protection heat', 'protective shield', 'refresh', 'remove curse', 'remove fear', 'sanctuary', 'shield', 'spring', 'stone skin', 'word of recall'
        ],
        'align' : 'g',
        'ename' : 'donkey',
    },
    'Легенда': {
        'spells' : ['armor', 'acute vision', 'continual light', 'control weather', 
            'create food', 'create rose', 'spring', 'detect invis', 'dragon skin', 
            'enhanced armor', 'faerie fog', 'fly', 'giant strength', 'haste', 'improved detect', 
            'improved invis', 'infravision', 'invisibility', 'knock', 'learning', 'link', 
            'pass door', 'protection cold', 'protection heat', 'protective shield', 'refresh',
            'shield', 'spell resistance', 'stardust', 'stone skin'
        ],
        'align' : 'n',
        'ename' : 'legend',
    },
    'коровища': {
        'spells' : ['aid', 'armor', 'bless', 'calm', 'continual light', 'control weather', 'create food', 'spring', 'cure blindness', 'cure disease', 'cure poison', 'detect invis', 'dragon skin', 'enhanced armor', 'faerie fog', 'fly', 'frenzy', 'giant strength', 'group defense', 'group heal', 'heal', 'healing light', 'improved detect', 'infravision', 'inspire', 'learning', 'mind light', 'pass door', 'protection cold', 'protection heat', 'protective shield', 'refresh', 'remove curse', 'remove fear', 'restoring light', 'sanctify lands', 'sanctuary', 'shield', 'stone skin'
        ],
        'align' : 'n',
        'ename' : 'cow',
    },
    'ночная тен' :{
        'spells' : ['armor', 'assist', 'create food', 'spring', 'dark shroud', 'detect invis', 'fly', 'giant strength', 'improved detect', 'infravision', 'invisibility', 'knock', 'learning', 'link', 'pass door', 'protection cold', 'protection good', 'protection negative', 'protective shield', 'refresh', 'shield', 'spell resistance', 'stone skin'],
        'align' : 'e',
        'ename' : 'night'
    },
    'призванная' :{
        'spells' : ['armor', 'assist', 'create food', 'spring', 'detect invis', 'fly', 'giant strength', 'improved detect', 'infravision', 'invisibility', 'knock', 'learning', 'link', 'pass door', 'protection cold', 'protection negative', 'protective shield', 'refresh', 'shield', 'spell resistance', 'stone skin'],
        'align' : 'n',
        'ename' : 'shadow',
    },
    'теневой дв':{
        'spells' : ['armor', 'assist', 'create food', 'spring', 'detect invis', 'fly', 'giant strength', 'improved detect', 'infravision', 'invisibility', 'knock', 'learning', 'link', 'pass door', 'protection cold', 'protection negative', 'protective shield', 'refresh', 'shield', 'spell resistance', 'stone skin'],
        'align' : 'n',
        'ename' : 'shadow',
    },
    "каменный г" : {
        'spells' : [],
        'align' : 'n',
        'ename' : 'stone',
    },
    "малый голе" : {
        'spells' : [],
        'align' : 'n',
        'ename' : 'lesser',
    },
    "железный г" : {
        'spells' : [],
        'align' : 'n',
        'ename' : 'iron',
    },
    "адамантито" : {
        'spells' : [],
        'align' : 'n',
        'ename' : 'adamantite',
    },
    
};

var buffs_list = {
    //Spell(name, brief, mgroup, sclass, target, party, aAntogonist, aAlly, grSpell, aligns)
    'rainbow shield': new Spell('rainbow shield', 'R', 'pro','protective'),

    //cler
    'group defense': new Spell('group defense', 'gd', 'pro', 'protective', false, true,[],["shield","armor","sanctuary"]),
    'holy word': new Spell('holy word', 'hw', 'enh', 'protective', false, true,[],["inspire","frenzy"]),
    'inspire': new Spell('inspire', 'i','enh','protective', false, true, ['holy word']),
    'learning': new Spell('learning', 'l', 'enh', 'protective', true, false),
    'benediction': new Spell('benediction', 'B', 'enh', 'protective', true, false),
    
    //invader:
    'shadow cloak': new Spell('shadow cloak', 'S', 'cln', 'protective'),

    //hunter
    'detect trap': new Spell('detect trap', 'd', 'cln', 'protective'),

    //ruler:
    'ruler aura': new Spell('ruler aura', 'A', 'cln', 'protective',false,false,[],['detect invis', 'detect hide']),

    //protect:
    //necr
    'dark shroud': new Spell('dark shroud', 'd', 'pro', 'protective', true, false,[],['stardust','sanctuary'],undefined,'e'),
    'shield':  new Spell('shield', 'S', 'pro', 'protective',true , false,[],[],'group defense'),
    'protective shield': new Spell('protective shield','p', 'pro', 'protective'),
    'armor': new Spell('armor', 'a', 'pro', 'protective', true, false,[],[],'group defense'),
    'stone skin': new Spell('stone skin', 'k', 'pro', 'protective'),
    'protection good': new Spell('protection good', 'g', 'pro', 'protective'),
    'spell resistance': new Spell('spell resistance', 'm', 'pro', 'protective', false, false,[],['rainbow shield']),
    'mental block': new Spell('mental block', 'm', 'trv', 'protective', true),
    'magic concentrate': new Spell('magic concentrate', 'm', 'enh', 'protective'),
    'protection negative': new Spell('protection negative', 'n', 'pro', 'protective'),
    'protection cold': new Spell('protection cold', 'c', 'pro', 'protective'),
    'giant strength': new Spell('giant strength', 'g', 'enh', 'protective', true),
    'detect invis': new Spell('detect invis', 'i', 'det', 'detection'),
    'improved detect': new Spell('improved detect', 'w', 'det', 'detection'),
    'infravision': new Spell('infravision', 'r', 'det', 'detection'),
    'detect magic': new Spell('detect magic', 'm', 'det', 'detection'),

    //pets:
    'stardust': new Spell('stardust', 'z', 'pro', 'protective', true, false,[],['dark shroud','sanctuary']),
    'sanctuary': new Spell('sanctuary', 's', 'pro', 'protective', true, false,[],['dark shroud','stardust'],'group defense'),
    'enhanced armor': new Spell('enhanced armor', 'A', 'pro', 'protective', true),
    'haste': new Spell('haste', 'h', 'enh', 'protective', true),
    'bless': new Spell('bless', 'b', 'enh', 'protective', true),
    'dragon skin': new Spell('dragon skin', 'D', 'pro', 'protective'),
    'frenzy': new Spell('frenzy', 'f', 'enh', 'protective', true, false, ['holy word'],[],undefined,'ng'),
    'invisibility': new Spell('invisibility', 'i', 'trv', 'protective', true, false),
    'improved invis': new Spell('improved invis', 'I', 'trv', 'protective', true, false),

    //skills: thief
    //Spell(name, brief, mgroup, sclass, target, party, aAntogonist, aAlly, grSpell, aligns)
    //Skill(name, command, brief, mgroup, sclass, target, min_mana, min_move, aAlly)
    'detect hide': new Skill('detect hide', 'detect', 'h', 'det', 'detection', false, 50, 50, ['ruler aura']),
    'sneak': new Skill('sneak', 'sneak', 's', 'trv', 'enchant', false, 0, 40),
    'hide': new Skill('hide', 'hide', 'h', 'trv', 'enchant', false, 0, 40),
    'envenom': new Skill('envenom', 'envenom'),

    //skills: samurai
    //Skill(name, command, brief, mgroup, sclass, target, min_mana, min_move, aAlly)
    'berserk': new Skill('berserk', 'berserk', 'z', 'enh', 'enchant', false, 50, 100),
};
var attack_spells_list = {
    //AttackSpell(sName,sClass,lTarget,lRange,lArea,lFight,sDamage)
    //cleric
    'harm': new AttackSpell('harm','harm','attack',true,true,false,true),
    'bluefire': new AttackSpell('bluefire','blFr','attack',true,true,false,true),
    'heating': new AttackSpell('heating','heat','attack',true,false,false,true,'fire'),
    'ray of truth': new AttackSpell('ray of truth','RoT','attack',true,true,false,true),
    'flamestrike': new AttackSpell('flamestrike','flam','attack',true,true,false,true,'fire'),
    'severity force': new AttackSpell('severity force','SevF','attack',true,false,false,true),
    'desert fist': new AttackSpell('desert fist','dFst','attack',true,true,false,true),
    'blade barrier': new AttackSpell('blade barrier','bdBr','attack',true,true,false,true),
    //RULER
    //optic resonance 
    //necromancer
    'shadowlife': new AttackSpell('shadowlife','shLf','maladiction',true,false,false,false),
    'magic missile': new AttackSpell('magic missile','mm','attack',true,true,false,true,'energy'),
    'acid blast': new AttackSpell('acid blast','aBst','attack',true,true,false,true,'acid'),
    'acid arrow': new AttackSpell('acid arrow','aArr','attack',true,true,false,true,'acid'),
    'burning hands': new AttackSpell('burning hands','burHnd','attack',true,false,false,true,'fire'),
    'chill touch': new AttackSpell('chill touch','chTch','attack',true,false,false,true,'cold'),
    'sonic resonance': new AttackSpell('sonic resonance','sonic','attack',true,true,false,true,'energy'),
    'lightning ward': new AttackSpell('lightning ward','lngW','room',false,false,true,false,'lightning'),
    'lightning bolt': new AttackSpell('lightning bolt','lngB','attack',true,true,false,true,'lightning'),
    'disruption': new AttackSpell('disruption','disr','attack',true,true,false,true,'energy'),
    'chain lightning': new AttackSpell('chain lightning','chLng','attack',true,false,true,true,'lightining'),
    'spectral furor': new AttackSpell('spectral furor','spect','attack',true,true,false,true,'energy'),
    'hurricane': new AttackSpell('hurricane','hur','attack',false,false,true,true,'other'),
    'cursed lands': new AttackSpell('cursed lands','curLd','room',false,false,true,false),
    'narcotic mist': new AttackSpell('narcotic mist','myst','room',false,false,true,false),
    'hand of undead': new AttackSpell('hand of undead','HoU','attack',true,true,false,true,'energy'),
    'shielding': new AttackSpell('shielding','shng','maladiction',true,false,false,false),
    'energy drain': new AttackSpell('energy drain','engDr','attack',true,false,false,true,'energy'),
    'insanity': new AttackSpell('insanity','ins','maladiction',true,false,false,true),
    'curse': new AttackSpell('curse','crs','maladiction',true,false,false,true),
    'plague': new AttackSpell('plague','plg','maladiction',true,false,false,true),
    'corruption': new AttackSpell('corruption','corr','maladiction',true,false,false,true),
    'magic jar': new AttackSpell('magic jar','jar','maladiction',true,false,false,false),
    'power word kill': new AttackSpell('power word kill','pwk','attack',true,false,false,false,'energy'),
    'web': new AttackSpell('web','web','maladiction',true,true,false,true),
    'blindness': new AttackSpell('blindness','blind','maladiction',true,false,false,true),
    'poison': new AttackSpell('poison','pois','maladiction',true,false,false,true),
    'slow': new AttackSpell('slow','slow','maladiction',true,false,false,true),
    'weaken': new AttackSpell('weaken','weak','maladiction',true,false,false,true),
    'fear': new AttackSpell('fear','fear','maladiction',true,false,false,true),
    'dispel affects': new AttackSpell('dispel affects','dispAff','maladiction',true,false,false,true),
    'evil spirit': new AttackSpell('evil spirit','evilSp','room',false,false,true,false),
}
function Buff_need(always, fullbuff, gm_always, gm_fullbuff){
    this.always = always ? true : false;
    this.gm_always = gm_always ? true : false;
    this.fullbuff = fullbuff ? true : false;
    this.gm_fullbuff = gm_fullbuff ? true : false;
};
function Skill(name, command, brief, mgroup, sclass, target, min_mana, min_move, aAlly) { //party, aAntogonist, aAlly, grSpell, aligns //brief, mgroup, sclass, buff, group, party, aAntogonist, aAlly, grSpell, aligns
    //buff: 0 - никогда, 1 - всегда, 2 - fullbuff, 3 - только при прокачке
    //group (кастовать на членов группы): 0-no, 1-yes, 2-full, 3-target
    //party (кастуется на всю группу)
    this.name = name;
    this.command = command;
    this.mbrief = brief; //буква из mudprompt
    this.mgroup = mgroup; //группа из mudprompt
    this.class = sclass; //внутреннее погонялово для класса заклинания
    this.target = target === undefined ? false : target; //кастуется ли на цель
    this.mana = min_mana ?? 0;
    this.move = min_move ?? 0;
    //this.buff = buff === undefined ? 0 : buff;
    //this.group = group === undefined ? 0 : group;
    //this.party = party === undefined ? false : party; //кастуется на свою группу
    //this.antogonist = aAntogonist==undefined ? [] : aAntogonist; //противоположности
    //this.ally = aAlly==undefined ? [] : aAlly; //альтернативные
    //this.aligns = aligns === undefined ? 'eng' : aligns; //ограничение по алигну
    //this.progress = 0; // прокачка
    //this.grSpell = grSpell; //спел, которым вешается несколько баффов в т.ч. и текущий
}
function Spell(name, brief, mgroup, sclass, target, party, aAntogonist, aAlly, grSpell, aligns) { //brief, mgroup, sclass, buff, group, party, aAntogonist, aAlly, grSpell, aligns
    //buff: 0 - никогда, 1 - всегда, 2 - fullbuff, 3 - только при прокачке
    //group (кастовать на членов группы): 0-no, 1-yes, 2-full, 3-target
    //party (кастуется на всю группу)
    this.name = name;
    this.mbrief = brief; //буква из mudprompt
    this.mgroup = mgroup; //группа из mudprompt
    this.class = sclass; //внутреннее погонялово для класса заклинания
    this.target = target === undefined ? false : target; //кастуется ли на цель
    //this.buff = buff === undefined ? 0 : buff;
    //this.group = group === undefined ? 0 : group;
    this.party = party === undefined ? false : party; //кастуется на свою группу
    this.antogonist = aAntogonist==undefined ? [] : aAntogonist; //противоположности
    this.ally = aAlly==undefined ? [] : aAlly; //альтернативные
    this.aligns = aligns === undefined ? 'eng' : aligns; //ограничение по алигну
    this.progress = 0; // прокачка
    this.grSpell = grSpell; //спел, которым вешается несколько баффов в т.ч. и текущий
}
function AttackSpell(sName,sShort,sClass,lTarget,lRange,lArea,lFight,sDamage) {
    this.name = sName;
    this.short = sShort;
    this.class = sClass;
    this.target = lTarget ? true : false;
    this.range = lRange ? true : false;
    this.area = lArea ? true : false;
    this.fight = lFight ? true : false;
    this.damtype = sDamage; 
}

/************* Azazel Religion **************/
var lAzazel = false;
var azazel = new Azazel();
var AZAZEL_TIMER = 50;
var AZAZEL_WORDS_TIMER = 25;

function Azazel(heal_words, curse_words, attack_words) {
    if(heal_words!=undefined && curse_words!=undefined && attack_words!=undefined) {
        this.start=Date.now();
        this.is_set = true;
    } else {
        this.start=-1;
        this.is_set = false;
    }
    this.heal = new Words('heal',heal_words);
    this.curse = new Words('curse',curse_words);
    this.attack = new Words('attack',attack_words);

    this.stat = function() {
        if(!this.is_set) return '';

        return this.heal.get()+this.curse.get()+this.attack.get();
    };
};
function Words(name, str) {
    this.name = name ? name : undefined;
	this.words = str ? str : undefined;
    //когда использован:
	this.used = -1;
    this.use = function(){
        if(this.words==undefined) {
            echo('[AZAZEL ERROR: no words]');
            return;
        }
        send("say azazel "+this.words);
        echo('-->[Azazel '+this.name.toUpperCase()+']');
        this.used=Date.now();
    };
    this.get = function(){
        let sec_timer = 0;
        
        if(this.used != -1)
            sec_timer = AZAZEL_WORDS_TIMER*60 - Math.floor((Date.now()-this.used)/1000);
        
        if(sec_timer <= 0)
            this.used = -1;

        if(this.used > 0) {
            return '['+Math.floor((sec_timer)/60)+']';
        } else {
            return '[a'+this.name.substring(0,1)+']';
        }
    };
};
function logWithDate(str) {
    let date = new Date();
    console.log(`${date.toLocaleString()} ${str}`);
};
/****************SKILLS FOR KACH **************/
var skills = {
    haggle: {
        act: null,
        pos: "rest",
    },
    dodge: {
        act: null,
        pos: "fight",
    },
    'shield block': {
        act: null,
        pos: "fight",
    },
    dagger: {
        act: null,
        pos: "fight",
    },
    "hand to hand": {
        act: null,
        pos: "fight",
    },
    sword: {
        act: null,
        pos: "fight",
    },
    mace: {
        act: null,
        pos: "fight",
    },
    envenom: {
        act: {
            act: 'envenom',
            command: 'scalpel',
        },
        pos: "rest",
    },
    lore: {
        act: {
            act: 'lore',
            command: 'jar',
        },
        pos: "rest",
    },
    peek: {
        act: {
            act: 'look',
            command: 'snail',
        },
        pos: "rest",
    },
    berserk: {
        act: {
            act: 'berserk',
        },
        pos: 'fight',
    },
    counter: {
        act: null,
        post: null
    },
    'detect hide': {
        act: {
            act: 'detect',
        },
        pos: "rest",
    },
    'dirt kicking': {
        act: {
            act: 'dirt',
        },
        pos: "fight",
    },
    trip: {
        act: {
            act: 'trip',
        },
        pos: "fight",
    },
    kick: {
        act: {
            act: 'kick',
        },
        pos: "fight",
    },
    sneak: {
        act: {
            act: 'sneak',
        },
        pos: "stand",
    },
    hide: {
        act: {
            act: 'hide',
        },
        post: 'rest',
    },
}
var position_commands = [
    "sleep",
    "rest",
    "sit",
    "stand",
];
var positions = [
    "dead",
    "mort",
    "incap",
    "stun",
    "sleep",
    "rest",
    "sit",
    "fight",
    "stand",
];

//возвращаем серый фон
$('.terminal').css("background-color", "#2e3436");
$('.terminal-wrap').css("background-color", "#2e3436");
$('body').css("background-color", "#353535");
$('input').css("background-color", "#2e3436");
$('#cs-subject').css("color","#F8F8F2");
