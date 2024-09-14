/* Этот файл будет сохранен в браузере (в LocalStorage.settings).
 * В переменной mudprompt хранится много полезной информации о персонаже.
 * Подробнее см. https://github.com/dreamland-mud/mudjs/wiki/MUD-prompt
 * Расшифровка аффектов: https://github.com/dreamland-mud/mudjs/blob/dreamland/src/components/windowletsPanel/windowletsConstants.js
 */

(() => {
  console.log(mudprompt);

  /*--------------------------------------------------------------------------
   * Триггеры - автоматические действия в ответ на определенные строки в игре.
   *-------------------------------------------------------------------------*/

  const DEBUG_MODE = true; // true - для вывода отладочной информации

  // Переменные состояния игры
  const state = {
    meltCounter: 0, // Противодействие автовыкидыванию
    lastCast: '',
    doorToBash: 'n',
    weapon: 'whip',
    victim: 'нимфа',
    victimLocation: '', // Местоположение жертвы
    victimLocationFound: false, // Флаг, что местоположение жертвы найдено
    locationCodeFound: false, // Флаг, что код местности найден
    locationCode: '', // Код местности
    isEnergyLow: false, // Флаг для отслеживания низкого уровня энергии
    masteryAchieved: false, // Флаг для отслеживания достижения "мастерски владеешь"
    isStarPressed: false, // Флаг для отслеживания нажатия *
    skillToTrain: 'к починка кнут',
    skillCount: 0, // Счетчик выполнения навыка
    maxSkillCount: 99, // Максимальное количество повторений
    isTraining: false, // Переменная для отслеживания процесса обучения
    isHunting: false, // Флаг для отслеживания процесса охоты
    actionLocked: false, // Для предотвращения спама действий
  };

  const logDebug = message => {
    if (DEBUG_MODE) {
      console.log(message);
    }
  };

  const delayedSend = async (command, delay) => {
    logDebug(`Запущена команда: ${command}`);
    logDebug(`Отправляемая команда: ${command}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    logDebug(`Команда после задержки: ${command}`);
    send(command);
  };

  const triggers = {
    'ВЫБИЛ.? у тебя .*, и он.? пада.?т .*!': () => {
      console.log('>>> Подбираю оружие с пола, очищаю буфер команд.\n');
      send('\\');
      send(`взять ${state.weapon}|надеть ${state.weapon}`);
    },
    'Ты хочешь есть.': () => {
      console.log('>>> Сейчас бы шашлычка...\n');
      send('колдов сотворить пищу |есть гриб');
    },
    'Ты хочешь пить.': () => {
      console.log('>>> Сейчас бы вискарика...\n');
      send('колдов родн |пить род');
    },
    'У тебя не хватает энергии': () => {
      handleLowEnergy();
    },
  };

  const handleLowEnergy = () => {
    console.log('>>> Энергии не хватает, засыпаю...\n');
    state.skillCount = 0;
    state.isStarPressed = false; // Немедленно останавливаем цикл
    state.isEnergyLow = true; // Устанавливаем флаг низкой энергии
    send('\\'); // Очищаем буфер команд
    send('спать рай');

    delayedSend('вст', 25000); // Через 25 секунд встаем

    setTimeout(() => {
      state.isStarPressed = true; // Снова запускаем цикл
      state.isEnergyLow = false; // Сбрасываем флаг низкой энергии
      send(state.skillToTrain); // Повторно вызываем команду
      checkMasteryAndRepeat(''); // Возобновляем проверку мастерства
    }, 26000); // Задержка после отдыха
  };

  // Проверка на "мастерски владеешь" и запуск цикла повторения до выполнения
  const checkMasteryAndRepeat = text => {
    if (state.actionLocked) return; // Не увеличиваем счетчик, если действие заблокировано
    logDebug(`Функция checkMasteryAndRepeat вызвана с текстом: ${text}`);

    if (!state.isStarPressed) return; // Не выполнять цикл, если * не нажата

    if (text.includes('мастерски владеешь')) {
      send('\\');
      console.log('Мастерство достигнуто. Очищаем буфер.');
      state.masteryAchieved = true;
      state.isStarPressed = false; // Сбрасываем флаг после завершения
      state.isTraining = false; // Останавливаем тренировку
      state.skillCount = 0; // Сбрасываем счетчик после завершения
    } else if (state.skillCount >= state.maxSkillCount) {
      send('\\'); // Очищаем буфер команд
      console.log(
        'Навык выполнен 99 раз. Очищаем буфер и выполняем команду "ум".'
      );
      send('ум'); // Выполняем команду "ум"
      state.skillCount = 0; // Сбрасываем счетчик
      console.log('Цикл возобновится автоматически.');
      setTimeout(() => {
        send(state.skillToTrain); // Снова запускаем тренировку после команды "ум"
        checkMasteryAndRepeat(''); // Возобновляем проверку
      }, 1000); // Небольшая задержка перед перезапуском цикла
    } else if (!state.isEnergyLow && !state.masteryAchieved) {
      send(state.skillToTrain);
      state.skillCount++; // Увеличиваем счетчик после каждой команды
      logDebug(`Текущий счетчик навыка: ${state.skillCount}`); // Выводим значение счетчика

      // Устанавливаем флаг блокировки действия
      state.actionLocked = true;
      setTimeout(() => {
        state.actionLocked = false; // Разблокируем через 1 секунду
      }, 1000); // Задержка 1 секунда
    }
  };

  // Функция для поиска местоположения жертвы
  const findVictimLocation = text => {
    if (state.victimLocationFound) return; // Пропускаем, если местоположение уже найдено

    if (text.toLowerCase().includes(state.victim.toLowerCase())) {
      const parts = text.toLowerCase().split(state.victim.toLowerCase());
      if (parts.length > 1) {
        const location = parts[1].trim();
        console.log(`Местоположение жертвы: ${location}`);
        state.victimLocation = location;
        state.victimLocationFound = true;
        send(`путь ${state.victimLocation}`);
      } else {
        console.log('Не удалось найти местоположение.');
      }
    } else {
      console.log('Имя жертвы не найдено.');
    }
  };

  // Функция для поиска кода местности
  const findLocationCode = text => {
    if (!state.victimLocationFound || state.locationCodeFound) return;

    if (text && typeof text === 'string') {
      const parts = text.toLowerCase().split(`'${state.victimLocation}':`);
      if (parts.length > 1) {
        const locationCode = parts[1].trim();
        if (locationCode) {
          console.log(`Код местности найден: ${locationCode}`);
          send(`бег ${locationCode}`);
          state.locationCodeFound = true;
          state.isHunting = false;
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

  const handleHuntingState = text => {
    if (!state.victimLocationFound) {
      findVictimLocation(text); // Ищем местоположение жертвы
    }
    if (state.victimLocationFound && !state.locationCodeFound) {
      if (text.toLowerCase().includes(`'${state.victimLocation}':`)) {
        findLocationCode(text); // Передаем строку в функцию
      }
    }
  };

  const handleTrainingState = text => {
    if (text.includes('У тебя не хватает энергии')) {
      handleLowEnergy(); // Вызываем правильную функцию триггера
    } else if (state.isStarPressed && !state.masteryAchieved) {
      checkMasteryAndRepeat(text); // Проверяем, достигнуто ли мастерство
    }
  };

  // Обработка текстовых триггеров
  $('.trigger').off('text.myNamespace');

  $('.trigger').on('text.myNamespace', (e, text) => {
    // logDebug(`Полученный текст: ${text}`);

    if (state.isHunting) {
      handleHuntingState(text);
    }

    if (state.isTraining) {
      handleTrainingState(text);
    }

    for (const [pattern, action] of Object.entries(triggers)) {
      const regex = new RegExp(pattern);
      if (regex.test(text)) {
        action();
        break; // Останавливаемся после первого совпадения
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
        state.victim = args[1];
        console.log(`>>> Твоя мишень теперь ${state.victim}\n`);
      }) || commandHandled;

    commandHandled =
      command(e, '/weapon', text, args => {
        state.weapon = args[1];
        console.log(`>>> Твое оружие теперь ${state.weapon}\n`);
      }) || commandHandled;

    commandHandled =
      command(e, '/iden', text, args => {
        send(`взять ${args[1]} сумка`);
        send(`к опознание ${args[1]}`);
        send(`полож ${args[1]} сумка`);
      }) || commandHandled;

    commandHandled =
      command(e, '/purge', text, args => {
        send(`взять ${args[1]} сумка`);
        send(`бросить ${args[1]}`);
        send(`жертвовать ${args[1]}`);
      }) || commandHandled;

    commandHandled =
      command(e, '/bd', text, args => {
        state.doorToBash = args[1];
        console.log(
          `>>> Поехали, вышибаем по направлению ${state.doorToBash}\n`
        );
        send(`выбить ${state.doorToBash}`);
      }) || commandHandled;

    // Не возвращаем значение из обработчика события
  });

  const go = where => {
    send(where);
  };

  const scan = where => {
    send(`scan ${where}`);
  };

  const shoot = where => {
    send(`к 'вол' ${where}.${state.victim}`);
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
        send('scan');
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
        send(command);
      }
    });
  };

  // Обработчик нажатия клавиш
  $(document).off('keydown.myNamespace');
  $(document).on('keydown.myNamespace', e => {
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
      case 18: // Alt
        send('к гиг д');
        send('к ускор д');
        send('к зв д');
        send('к гиг каб');
        send('к ускор каб');
        send('к зв каб.гол');
        break;
      case KeyCodes.KP_PLUS: // Начать тренировку
        state.isTraining = true; // Обучение запущено
        state.isStarPressed = true; // Устанавливаем флаг нажатия *
        state.masteryAchieved = false; // Сбрасываем флаг достижения мастерства
        state.skillCount = 0; // Сбрасываем счетчик навыка
        send(state.skillToTrain);
        checkMasteryAndRepeat(''); // Запускаем цикл
        break;
      case KeyCodes.KP_MINUS: // Остановить тренировку
        state.isStarPressed = false; // Останавливаем цикл
        state.isTraining = false; // Останавливаем тренировку
        state.skillCount = 0; // Сбрасываем счетчик навыка
        console.log('Цикл остановлен при нажатии минуса');
        break;
      case 36: // Home
        send('взять снад сумка:лечение');
        send('осуш снад');
        break;
      case 35: // End
        send('взять один сумка:лечение');
        send('надеть один');
        send('к леч');
        break;
      case KeyCodes.KP_MUL: // Начать охоту
        state.isHunting = true; // Охота запущена
        state.victimLocationFound = false; // Сбрасываем флаг местоположения
        state.locationCodeFound = false; // Сбрасываем флаг кода
        send(`где ${state.victim}`);
        console.log('Отправлена команда "где victim".');
        break;
      default:
        return;
    }
    e.preventDefault();
  });
})();
