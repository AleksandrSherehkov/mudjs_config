/* Этот файл будет сохранен в браузере (в LocalStorage.settings).
 * В переменной mudprompt хранится много полезной информации о персонаже.
 * Подробнее см. https://github.com/dreamland-mud/mudjs/wiki/MUD-prompt
 * Расшифровка аффектов: https://github.com/dreamland-mud/mudjs/blob/dreamland/src/components/windowletsPanel/windowletsConstants.js
 */

(() => {
  /*--------------------------------------------------------------------------
   * Триггеры - автоматические действия в ответ на определенные строки в игре.
   *-------------------------------------------------------------------------*/

  const DEBUG_MODE = true; // true - для вывода отладочной информации

  // Переменные состояния игры, сгруппированные по категориям
  const state = {
    hunting: {
      isActive: false, // Флаг для отслеживания процесса охоты
      attackCommand: 'к вол',
      victim: 'проповедник',
      lootItem: 'page',
      victimLocation: '', // Местоположение жертвы
      isVictimLocationFound: false, // Флаг, что местоположение жертвы найдено
      isLocationCodeFound: false, // Флаг, что код местности найден
      locationCode: '', // Код местности
      isInspecting: false, // Флаг наблюдения
      isVictimKilled: false, // Флаг, указывающий, что жертва убита
      isInCombat: false, // Флаг для отслеживания состояния боя
    },
    training: {
      isActive: false, // Переменная для отслеживания процесса обучения
      skillToTrain: 'к отмен дем',
      skillCount: 0, // Счетчик выполнения навыка
      maxSkillCount: 98, // Максимальное количество повторений
      isMasteryAchieved: false, // Флаг для отслеживания достижения "мастерски владеешь"
      isStarPressed: false, // Флаг для отслеживания нажатия *
    },
    energy: {
      isLow: false, // Флаг для отслеживания низкого уровня энергии
    },
    general: {
      meltCounter: 0, // Противодействие автовыкидыванию
      lastCast: '',
      doorToBash: 'n',
      weapon: 'blue',
      isActionLocked: false, // Для предотвращения спама действий
      isLooting: false, // Флаг для отслеживания процесса лутания
    },
  };

  // Деструктуризация state для удобства доступа
  const { hunting, training, energy, general } = state;

  const logDebug = message => {
    if (DEBUG_MODE) {
      console.log(message);
    }
  };

  // Универсальная функция для отправки команд
  const sendCommand = command => {
    logDebug(`Sending command: ${command}`);
    send(command);
  };

  // Универсальная функция для отправки команды с задержкой
  const delayedSendCommand = (command, delay) => {
    logDebug(`Delaying command: ${command} for ${delay}ms`);
    setTimeout(() => {
      sendCommand(command);
    }, delay);
  };

  const triggers = {
    'ВЫБИЛ.? у тебя .*, и он.? пада.?т .*!': () => {
      console.log('>>> Подбираю оружие с пола, очищаю буфер команд.\n');
      sendCommand('\\');
      sendCommand(`взять ${general.weapon}|надеть ${general.weapon}`);
    },
    'Ты хочешь есть.': () => {
      console.log('>>> Сейчас бы шашлычка...\n');
      sendCommand('колдов сотворить пищу |есть гриб');
    },
    'Ты хочешь пить.': () => {
      console.log('>>> Сейчас бы вискарика...\n');
      sendCommand('колдов родн |пить род');
    },
    'У тебя не хватает энергии': () => {
      handleLowEnergy();
    },
  };

  const handleLowEnergy = () => {
    console.log('>>> Энергии не хватает, засыпаю...\n');
    training.skillCount = 0;
    training.isStarPressed = false; // Немедленно останавливаем цикл
    energy.isLow = true; // Устанавливаем флаг низкой энергии
    sendCommand('\\'); // Очищаем буфер команд
    sendCommand('спать рай');

    delayedSendCommand('вст', 25000); // Через 25 секунд встаем

    setTimeout(() => {
      training.isStarPressed = true; // Снова запускаем цикл
      energy.isLow = false; // Сбрасываем флаг низкой энергии
      sendCommand(training.skillToTrain); // Повторно вызываем команду
      checkMasteryAndRepeat(''); // Возобновляем проверку мастерства
    }, 26000); // Задержка после отдыха
  };

  // Проверка на "мастерски владеешь" и запуск цикла повторения до выполнения
  const checkMasteryAndRepeat = text => {
    if (general.isActionLocked) return; // Не увеличиваем счетчик, если действие заблокировано
    logDebug(`Функция checkMasteryAndRepeat вызвана с текстом: ${text}`);

    if (!training.isStarPressed) return; // Не выполнять цикл, если * не нажата

    if (text.includes('мастерски владеешь')) {
      sendCommand('\\');
      console.log('Мастерство достигнуто. Очищаем буфер.');
      training.isMasteryAchieved = true;
      training.isStarPressed = false; // Сбрасываем флаг после завершения
      training.isActive = false; // Останавливаем тренировку
      training.skillCount = 0; // Сбрасываем счетчик после завершения
    } else if (training.skillCount >= training.maxSkillCount) {
      sendCommand('\\'); // Очищаем буфер команд
      console.log(
        'Навык выполнен 99 раз. Очищаем буфер и выполняем команду "ум".'
      );
      sendCommand('ум'); // Выполняем команду "ум"
      training.skillCount = 0; // Сбрасываем счетчик
      console.log('Цикл возобновится автоматически.');
      setTimeout(() => {
        sendCommand(training.skillToTrain); // Снова запускаем тренировку после команды "ум"
        checkMasteryAndRepeat(''); // Возобновляем проверку
      }, 1000); // Небольшая задержка перед перезапуском цикла
    } else if (!energy.isLow && !training.isMasteryAchieved) {
      sendCommand(training.skillToTrain);
      training.skillCount++; // Увеличиваем счетчик после каждой команды
      logDebug(`Текущий счетчик навыка: ${training.skillCount}`); // Выводим значение счетчика

      // Устанавливаем флаг блокировки действия
      general.isActionLocked = true;
      setTimeout(() => {
        general.isActionLocked = false; // Разблокируем через 1 секунду
      }, 1000); // Задержка 1 секунда
    }
  };

  // Функция для поиска местоположения жертвы
  const findVictimLocation = text => {
    console.log(`text:`, text);
    if (hunting.isVictimLocationFound) return; // Пропускаем, если местоположение уже найдено

    if (text.toLowerCase().includes(hunting.victim.toLowerCase())) {
      const parts = text.toLowerCase().split(hunting.victim.toLowerCase());
      if (parts.length > 1) {
        const location = parts[1].trim();
        console.log(`Местоположение жертвы: ${location}`);
        hunting.victimLocation = location;
        hunting.isVictimLocationFound = true;
        sendCommand(`путь ${hunting.victimLocation}`);
      } else {
        console.log('Не удалось найти местоположение.');
      }
    } else {
      console.log('Имя жертвы не найдено.');
    }
  };

  // Функция для поиска кода местности
  const findLocationCode = text => {
    if (!hunting.isVictimLocationFound || hunting.isLocationCodeFound) return;

    if (text && typeof text === 'string') {
      const parts = text.toLowerCase().split(`'${hunting.victimLocation}':`);
      if (parts.length > 1) {
        const locationCode = parts[1].trim();
        if (locationCode) {
          console.log(`Код местности найден: ${locationCode}`);
          sendCommand(`бег ${locationCode}`);

          hunting.isInspecting = true;
          hunting.isLocationCodeFound = true;
          sendCommand('смотр');
        } else {
          console.log(
            'Код местности не найден; после местоположения только пробелы.'
          );
        }
      } else {
        console.log('Не удалось найти код местности.');
      }
    } else {
      console.log('Текст для обработки недоступен или не является строкой.');
    }
  };

  // Функция для обработки встречи с жертвой
  const handleVictimEncounter = text => {
    console.log(`Получено сообщение:`, text);

    if (
      text.toLowerCase().includes(`${hunting.victim.toLowerCase()} уже труп`)
    ) {
      console.log(`>>> Жертва ${hunting.victim} мертва! Останавливаем охоту.`);
      hunting.isActive = false;
      hunting.isInspecting = false;
      hunting.isVictimKilled = true;
      hunting.isInCombat = false;
      sendCommand('смотр');
    } else if (text.toLowerCase().includes(hunting.victim.toLowerCase())) {
      console.log(`>>> Жертва ${hunting.victim} тут!`);
      if (text.toLowerCase().includes('сбегает')) {
        console.log('>>> Жертва пытается сбежать, продолжаем преследование...');
        sendCommand(`где ${hunting.victim}`);
      } else {
        console.log(`>>> Атакую жертву: ${hunting.victim}`);
        delayedSendCommand(`${hunting.attackCommand} ${hunting.victim}`, 1500);
        hunting.isInspecting = false;
        hunting.isInCombat = true;
        setTimeout(() => {
          continueAttacking();
        }, 2000);
      }
    } else {
      console.log('>>> Жертва не найдена на текущей локации.');
      hunting.isInspecting = false;
    }
  };

  const continueAttacking = () => {
    if (!hunting.isInCombat) return;

    sendCommand(`${hunting.attackCommand} ${hunting.victim}`);

    setTimeout(() => {
      continueAttacking();
    }, 2000);
  };

  const handleHuntingState = text => {
    // Если местоположение жертвы ещё не найдено, продолжаем его искать
    if (!hunting.isVictimLocationFound) {
      findVictimLocation(text); // Ищем местоположение жертвы
    }

    // Если местоположение найдено, но код местности ещё нет, продолжаем искать код
    if (hunting.isVictimLocationFound && !hunting.isLocationCodeFound) {
      if (
        text.toLowerCase().includes(`'${hunting.victimLocation}':`) &&
        !text.toLowerCase().includes('ты уже здесь')
      ) {
        findLocationCode(text); // Ищем код местности
      }
    }

    // Если мы находимся в нужной локации, но ещё не отправляли команду "смотр", ждем осмотра
    if (
      hunting.isVictimLocationFound &&
      hunting.isLocationCodeFound &&
      hunting.isInspecting
    ) {
      if (text.toLowerCase().includes(`${hunting.victim}`)) {
        console.log('>>> В локации жертвы, осматриваюсь.');

        handleVictimEncounter(text); // Обрабатываем текст после осмотра
      }
    }
  };

  const handleTrainingState = text => {
    if (text.includes('У тебя не хватает энергии')) {
      handleLowEnergy(); // Вызываем правильную функцию триггера
    } else if (training.isStarPressed && !training.isMasteryAchieved) {
      checkMasteryAndRepeat(text); // Проверяем, достигнуто ли мастерство
    }
  };

  // Обработка текстовых триггеров
  $('.trigger').off('text.myNamespace');
  $('.trigger').on('text.myNamespace', (e, text) => {
    // logDebug(`Полученный текст: ${text}`);

    if (hunting.isActive) {
      handleHuntingState(text);
    }

    if (training.isActive) {
      handleTrainingState(text);
    }

    for (const [pattern, action] of Object.entries(triggers)) {
      const regex = new RegExp(pattern);
      if (regex.test(text)) {
        action();
        break; // Останавливаемся после первого совпадения
      }
    }

    // Добавляем проверку состояния боя
    if (hunting.isInCombat) {
      if (
        text.toLowerCase().includes(`${hunting.victim.toLowerCase()} уже труп`)
      ) {
        console.log(`>>> Жертва ${hunting.victim} мертва!`);
        sendCommand(`взять ${hunting.lootItem}`);
        hunting.isInCombat = false; // Останавливаем атаку
      } else if (text.toLowerCase().includes('ты не видишь здесь такого')) {
        console.log('>>> Жертва недоступна для атаки.');
        hunting.isInCombat = false; // Останавливаем атаку
      } else if (text.toLowerCase().includes('вы не можете сражаться')) {
        console.log('>>> Вы не можете продолжать бой.');
        hunting.isInCombat = false; // Останавливаем атаку
      } else if (text.toLowerCase().includes('вы умерли')) {
        console.log('>>> Вы погибли.');
        hunting.isInCombat = false; // Останавливаем атаку
      }
    }
  });

  const command = (e, cmd, text, handler) => {
    const re = new RegExp(`^${cmd}\\s*(.*)`);
    const match = re.exec(text);
    if (!match) return false;
    handler(match);
    e.stopPropagation();
    // Не возвращаем значение
  };

  $('.trigger').off('input.myNamespace');
  $('.trigger').on('input.myNamespace', (e, text) => {
    let commandHandled = false;

    commandHandled =
      command(e, '/victim', text, args => {
        hunting.victim = args[1];
        console.log(`>>> Твоя мишень теперь ${hunting.victim}\n`);
      }) || commandHandled;

    commandHandled =
      command(e, '/weapon', text, args => {
        general.weapon = args[1];
        console.log(`>>> Твое оружие теперь ${general.weapon}\n`);
      }) || commandHandled;

    commandHandled =
      command(e, '/iden', text, args => {
        sendCommand(`взять ${args[1]} сумка`);
        sendCommand(`к опознание ${args[1]}`);
        sendCommand(`полож ${args[1]} сумка`);
      }) || commandHandled;

    commandHandled =
      command(e, '/purge', text, args => {
        sendCommand(`взять ${args[1]} сумка`);
        sendCommand(`бросить ${args[1]}`);
        sendCommand(`жертвовать ${args[1]}`);
      }) || commandHandled;

    commandHandled =
      command(e, '/bd', text, args => {
        general.doorToBash = args[1];
        console.log(
          `>>> Поехали, вышибаем по направлению ${general.doorToBash}\n`
        );
        sendCommand(`выбить ${general.doorToBash}`);
      }) || commandHandled;

    // Не возвращаем значение из обработчика события
  });

  const go = where => {
    sendCommand(where);
  };

  const scan = where => {
    sendCommand(`scan ${where}`);
  };

  const shoot = where => {
    sendCommand(`к 'вол' ${where}.${hunting.victim}`);
  };

  // Коды клавиш для цифровой клавиатуры
  const KeyCodes = {
    KP_0: 96,
    KP_1: 97,
    KP_2: 98,
    KP_3: 99,
    KP_4: 100,
    KP_5: 101,
    KP_6: 102,
    KP_7: 103,
    KP_8: 104,
    KP_9: 105,
    KP_MUL: 106,
    KP_PLUS: 107,
    KP_MINUS: 109,
    KP_DOT: 110,
    KP_DIV: 111,
  };

  const dir = (d, e) => {
    if (e.ctrlKey) {
      shoot(d);
    } else if (e.altKey) {
      scan(d);
    } else {
      go(d);
    }
  };

  const handleMovement = e => {
    switch (e.which) {
      case KeyCodes.KP_1:
        dir('down', e);
        break;
      case KeyCodes.KP_2:
        dir('south', e);
        break;
      case KeyCodes.KP_4:
        dir('west', e);
        break;
      case KeyCodes.KP_5:
        sendCommand('scan');
        break;
      case KeyCodes.KP_6:
        dir('east', e);
        break;
      case KeyCodes.KP_8:
        dir('north', e);
        break;
      case KeyCodes.KP_9:
        dir('up', e);
        break;
      default:
        return false;
    }
    return true;
  };

  const buffs = [
    { prop: 'det', value: 'i', command: 'c detect invis' },
    { prop: 'pro', value: 'S', command: 'c shield' },
    { prop: 'enh', value: 'l', command: 'c learning' },
    { prop: 'enh', value: 'g', command: 'c giant' },
    { prop: 'pro', value: 'p', command: "c 'prot shield'" },
    { prop: 'det', value: 'm', command: 'c detect magic' },
    { prop: 'enh', value: 'h', command: 'c haste' },
    { prop: 'trv', value: 'm', command: 'c mental block' },
    { prop: 'pro', value: 'k', command: 'c stone skin' },
    { prop: 'pro', value: 'z', command: 'c stardust' },
    { prop: 'det', value: 'w', command: 'c improved detect' },
    { prop: 'pro', value: 'D', command: 'c dragon skin' },
    { prop: 'pro', value: 'h', command: 'c protection heat' },
    { prop: 'pro', value: 'a', command: 'c armor' },
    { prop: 'pro', value: 'A', command: 'c enhanced armor' },
    { prop: 'enh', value: 'm', command: 'c magic concentrate' },
    { prop: 'pro', value: 'm', command: 'c spell resistance' },
    { prop: 'enh', value: 'c', command: 'c inaction' },
    { prop: 'pro', value: 'l', command: 'c love potion' },
    { prop: 'pro', value: 'a', command: 'c astral projection' },
    { prop: 'pro', value: 'b', command: 'c broom ritual' },
  ];

  const handleBuffs = () => {
    buffs.forEach(buff => {
      const { prop, value, command } = buff;
      if (mudprompt[prop] === 'none' || !mudprompt[prop].a.includes(value)) {
        sendCommand(command);
      }
    });
  };

  // Обработчик нажатия клавиш
  $(document).off('keydown.myNamespace');
  $(document).on('keydown.myNamespace', e => {
    if (e.ctrlKey && e.which >= 96 && e.which <= 105) {
      e.preventDefault();
    }
    if (handleMovement(e)) return;

    switch (e.which) {
      case 27: // Escape
        if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
          $('#input input').val(''); // Очистить поле ввода
        }
        break;
      case 192: // Tilda для баффов
        handleBuffs();
        break;
      case 9: // Tab
        sendCommand('приказ дем к гиг д');
        sendCommand('приказ дем к ускор д');
        sendCommand('приказ дем к зв д');
        sendCommand('приказ дем к гиг 1.гол');
        sendCommand('приказ дем к ускор 1.гол');
        sendCommand('приказ дем к зв 1.гол');
        sendCommand('приказ дем к гиг 2.гол');
        sendCommand('приказ дем к ускор 2.гол');
        sendCommand('приказ дем к зв 2.гол');
        sendCommand('приказ дем к гиг 3.гол');
        sendCommand('приказ дем к ускор 3.гол');
        sendCommand('приказ дем к зв 3.гол');
        break;
      case KeyCodes.KP_PLUS: // Начать тренировку
        training.isActive = true; // Обучение запущено
        training.isStarPressed = true; // Устанавливаем флаг нажатия *
        training.isMasteryAchieved = false; // Сбрасываем флаг достижения мастерства
        training.skillCount = 0; // Сбрасываем счетчик навыка
        sendCommand(training.skillToTrain);
        checkMasteryAndRepeat(''); // Запускаем цикл
        break;
      case KeyCodes.KP_MINUS: // Остановить тренировку
        training.isStarPressed = false; // Останавливаем цикл
        training.isActive = false; // Останавливаем тренировку
        training.skillCount = 0; // Сбрасываем счетчик навыка
        console.log('Цикл остановлен при нажатии минуса');
        break;
      case 36: // Home
        sendCommand('взять снад сумка:лечение');
        sendCommand('осуш снад');
        break;
      case 35: // End
        sendCommand('взять один сумка:лечение');
        sendCommand('надеть один');
        sendCommand('к леч');
        break;
      case KeyCodes.KP_MUL: // Начать охоту
        hunting.isActive = true; // Охота запущена
        hunting.isVictimLocationFound = false; // Сбрасываем флаг местоположения
        hunting.isLocationCodeFound = false; // Сбрасываем флаг кода
        hunting.isInspecting = false;
        sendCommand(`где ${hunting.victim}`);
        console.log('Отправлена команда "где victim".');
        break;
      default:
        return;
    }
    e.preventDefault();
  });
})();
