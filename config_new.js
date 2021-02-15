/*TODO
- вынести список говорунов в переменную/массив [#говоруны]
- вынести #prompt и #battleprompt в chars, на случай если у чаров разный prompt
*/

/* Этот файл будет сохранен в браузере (в LocalStorage.settings).
 * В переменной mudprompt хранится много полезной информации о персонаже.
 * Подробнее см. https://github.com/dreamland-mud/mudjs/wiki/MUD-prompt
 * Расшифровка аффектов: https://github.com/dreamland-mud/mudjs/blob/dreamland/src/prompt.js
 */

var test = true; //true - для вывода всякой отладочной информации
var match;

var my_char = {init: false};


var chars = {
	Miyamoto: {
    	weapon: 'tempered',
    	class: 'necromancer',
    	clan: 'invader',
    	water: 'spring',//'flask',
    	food: 'mushroom'
	},
	Zaleshanin: {
    	weapon: 'long',
    	class: 'thief',
    	water: 'flask',//'flask',
    	food: 'rusk'
	}
};

/*--------------------------------------------------------------------------
 * Триггера - автоматические действия как реакция на какую-то строку в мире.
 *-------------------------------------------------------------------------*/
$('.trigger').on('text', function(e, text) {
    //[#prompt] + [#battleprompt] example: <1111/1111 2222/2222 333/333 [time][exits]>[0W0D]
    match = (/^<([0-9]{1,5})\/([0-9]{1,5}) ([0-9]{1,5})\/([0-9]{1,5}) ([0-9]{1,5})\/([0-9]{1,5}) \[(.*)]\[.*]>\[.*](\([0-9]{1,3}%:[0-9]{1,3}%\))?$/).exec(text);
    if(match) {
        promptRecived(false);
    }
    match = (/^<AFK>[\s]?$/).exec(text);
    if(match) {
        promptRecived(true);
    }
 
    if(!my_char.init) return;
   
    //[#weapon]
    if (text.match(' у тебя оружие, и оно упало на землю!$')) {
        my_char.eqChanged = true;
        my_char.armed = 0;
        if (test) echo('(armed=0)\n');
    }
    if (text.match(' ВЫБИЛ.? у тебя оружие!$')) {
        my_char.eqChanged = true;
        my_char.armed = 1;
        if (test) echo('(armed=1)\n');
    }
    if (my_char.action.act === '\\get' && my_char.action.command === my_char.weapon && text.match('^Ты берешь .*\.$')) {
        clearAction();
        if (my_char.armed === 0) {
            my_char.armed = 1;
            my_char.eqChanged = true;
        }
        if (test) echo('(armed=1)\n');
    }
    if (text.match('^Ты вооружаешься .*\.$')) {
        if (my_char.action.act === '\\wield' && my_char.action.command === my_char.weapon) clearAction();
        my_char.armed = 2;
        if (test) echo('(armed=2)\n');
    }

/*
    if (text.match('ВЫБИЛ.? у тебя оружие, и оно упало на землю!$')) {
//        echo('>>> Подбираю оружие с пола, очистив буфер команд.\n');
//        send('\\');
//        send('взять ' + weapon + '|надеть ' + weapon);
    }
*/
    if (text.match('^Ты умираешь от голода|^Ты умираешь от жажды')) {
        if (mudprompt.p2.pos === 'stand' || mudprompt.p2.pos === 'sit' || mudprompt.p2.pos === 'rest') {
//        echo('>>> Правильно питаюсь, когда не сплю и не сражаюсь.\n');
//        send('взять бочон сумка');
//        send('пить боч|пить боч|пить боч');
//        send('положить боч сумка');
        }
    }

    if (text.match('Обессилев, ты падаешь лицом вниз!')) {
//        echo('>>> ЕЩЕ РАЗОК!!!\n');
//        send('встать|выбить ' + doorToBash);
    }

    // к стандартным уведомлениям добавлен хрустальный шар и поздравлялки. Убраны уведомления от некоторых мобов. [#говоруны]
	if (!text.match('^Валькирия |^Русалка |^The Ofcol cityguard |^Стражник |^Водяной |^The weaponsmith |^Архивариус |^Мальчик |^Булочник |^Колдун |^Ювелир |^Хассан |^Охранник султана |^Продавец доспехов |^Оружейник |^Бакалейщик ')
    	&& (
        	text.match('^\\[ic\\] ') ||
        	text.match('^\\[ooc\\] ') ||
        	text.match(' говорит тебе \'.*\'$') ||
        	text.match(' произносит \'.*\'$') ||
        	text.match('^\\[RULER\\].*$') ||
        	text.match('^\\Тихий голос из хрустального шара:\\ .*$') ||
        	text.match('\\ поздравляет \'.*\'$')
    	)
	) {
    	notify(text);
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
    re = new RegExp('^' + cmd + ' *(.*)');
    match = re.exec(text);
    if (!match)
       return false;
	
	// Нашли соответствие. Аргументы передаем в параметры функции-обработчика команды.
    handler(match);
    e.stopPropagation(); // команда обработана локально - не отправлять на сервер
}

// Примеры алиасов.
$('.trigger').on('input', function(e, text) {
    // Установить жертву для выстрелов, например: /victim hassan
    command(e, '/victim', text, function(args) {
        victim = args[1];
        echo('>>> Твоя мишень теперь ' + victim + "\n");
    });
    
    // Установить оружие (см. тригер выше), например: /weapon меч
    command(e, '/weapon', text, function(args) {
        weapon = args[1];
        echo('>>> Твое оружие теперь ' + weapon + "\n");
    });
    
    // Опознать вещь из сумки, например: /iden кольцо
    command(e, '/iden', text, function(args) {
        send('взять ' + args[1] + ' сумка');
        send('к опознание ' + args[1]);
        send('полож ' + args[1] + ' сумка');
    });

    // Выбросить и уничтожить вещь из сумки: /purge барахло
    command(e, '/purge', text, function(args) {
        send('взять ' + args[1] + ' сумка');
        send('бросить ' + args[1]);
        send('жертвовать ' + args[1]);
    });
   
    // Начать выбивать двери (см. тригер выше): /bd юг
    command(e, '/bd', text, function(args) {
        doorToBash = args[1];
        echo('>>> Поехали, вышибаем по направлению ' + doorToBash + '\n');
        send('выбить ' + doorToBash);
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
    send('scan ' + where);
}

// Рейнджеры могут стрелять по жертве victim из лука, а маги и клеры - 
// бить заклинаниями в соседнюю комнату.
function shoot(where) {
//    send('стрелять ' + where + ' ' + victim); 
//    send("к 'стен лезв' " + where + '.' + victim);
//    send("к 'струя кисл' " + where + '.' + victim);
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
    KP_DIV = 111;

// Просто клавиша - идти по направлению, ctrl+клавиша - стрелять, alt+клавиша - всмотреться.
function dir(d, e) {
    if(e.ctrlKey) {
        shoot(d);
    } else if(e.altKey) {
        scan(d);
    } else {
        go(d);
    }
}

// Назначаем горячие клавиши и их действия.
keydown=function(e) {
    switch(e.which) {
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
            
        case 27: // escape
            if(!e.shiftKey && !e.ctrlKey && !e.altKey) {
                $('#input input').val(''); // очистить поле воода
            } else {
                return;
            }
            break;
            
/*
        case 192: // tilde.
            // Пример автобаффа: проверяем какие аффекты отсутствуют и вешаем их.
            if (mudprompt.enh === 'none' || mudprompt.enh.a.indexOf("l") == -1)
                send("c learning");                    
            if (mudprompt.enh === 'none' || mudprompt.enh.a.indexOf("g") == -1)
                send("c giant");
            if (mudprompt.enh === 'none' || mudprompt.enh.a.indexOf("f") == -1)
                send("c frenzy");
            if (mudprompt.enh === 'none' || mudprompt.enh.a.indexOf("h") == -1)
                send("order rat c haste fiorine");  // Тут подставьте ваше имя.
            if (mudprompt.pro === 'none' || mudprompt.pro.a.indexOf("p") == -1)
                send("c 'prot shield'");
            if (mudprompt.pro === 'none' || mudprompt.pro.a.indexOf("s") == -1)
                send("c sanctuary");
            // ... и так далее 
            break;
*/

/*
        case KP_0:
            break;
        case KP_2:
            break;        
        case KP_7:
            break;
        case KP_MUL:
            break;
        case KP_PLUS:
            break;
        case KP_MINUS:
            break;
        case KP_DOT:
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

        default: 
            return; // по умолчанию просто посылаем клавишу на сервер
    }
    
    e.preventDefault(); // не посылать клавишу на сервер если обработана выше
};

function charInit() {
    if (test) echo(' -->charInit()');

    let charname = getCharName();
    
    if (test) echo(' -->charname='+charname);
    
    if (chars[charname] !== undefined)
        my_char = new Pchar(charname, chars[charname]);
    else {
        if(test) echo(' -->chars['+charname+'] == undefined');
    }    
}

function getCharName() {
    let result = '';
    if(isEqualChar(mudprompt.group.leader))
        return mudprompt.group.ln;

    for (var i in mudprompt.group.pc) {
        if(isEqualChar(mudprompt.group.pc[i])) {
            return mudprompt.group.pc[i].sees;
        };
    }        
    return result;
}

function isEqualChar(ch) {
    if(ch.hit==mudprompt.hit && ch.max_hit==mudprompt.max_hit)
        return true;

    return false;    
}

function doAct(act, comm, tag) {
	if (test) echo('-->doAct(' + act + ', ' + comm + ', ' + tag + ')');
	my_char.action = new Action(act, comm, tag);

	var result = '';

	if (act)
    	result += act;

	if (act === 'cast' && comm !== undefined) {
    	result += ' \'' + comm + '\'';
	} else if (act !== comm && comm !== undefined) {
    	result += ' ' + (act==='order'?tag:comm);
	}

	if (tag /*&& tag !== 'self'*/) {
    	result += ' ' + (act==='order'?comm:tag);
	}

	if (result !== '') {
    	echo('-->[' + result + ']\n');
    	send(result);
	} else
    	echo('\ndoAct(' + act + ',' + comm + ',' + tag + '): ERROR\n');
}
function clearAction() {
    if(test) echo(' -->clearAction()');
	for (var key in my_char.action) {
    	my_char.action[key] = undefined;
	}
}
//[#prompt]
function promptRecived(afk) {
    if(test) echo('prompt(ok)');
    
    if (!my_char.init) {
        charInit();
        if(test) echo('\n');
    } 
    my_char.afk = afk;

    if(test) echo(' --> status:'
    +'afk:'+my_char.afk+';'
    +' pos:'+mudprompt.p2.pos
    +(mudprompt.p2.posf!=''?'; posf:'+mudprompt.p2.posf:'')
    +'\n');
    checking();
    
}

//[#checks] [#проверялки]
function checking() {
	if (test) echo(' -->checking()');

	if (my_char.eqChanged)
    	checkEquip();
}

function checkEquip() {
    if (test) echo(' -->checkEquip()');
    my_char.eqChanged=false;
    
	if (my_char.armed === 0 && my_char.action.act !== '\\get') {
    	doAct('\\get', my_char.weapon);
    }
	if (my_char.armed === 1 && my_char.action.act !== '\\wield') {
    	doAct('\\wield', my_char.weapon);
    }
}

//[#Конструкторы]
function Action(act, command, target) {
	this.act = act; //spelling, wearing, drinking, eating, getting, slooking
	this.command = command;
	this.target = target;
}

function Pchar (name, char){
    if (test)
        echo(' -->Pchar() (name:' + name + ';weapon:' + char.weapon + ')');

    this.init = true;
    this.afk = false;

    this.name = name;

    this.weapon = char.weapon;
    //[#armed] 0 - без оружия(оружие на земле), 1 - оружие в мешке, 2 - вооружен
	this.armed = false; 

    this.food = char.food;
    this.water = char.water;
    //[#action] act - команда к выполеннию (н-р: \\get, \\wield, cast)
    //          command - 'acid blast' | target 
    //          target - цель
    this.action = {
    	act: undefined,
    	command: undefined,
    	target: undefined
	};

}