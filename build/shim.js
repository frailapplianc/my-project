/* ==========================================================================
   SHIM — связывает логику index 4.html с разметкой дизайна 1111.html.
   Меняются только «адреса» элементов (селекторы), поведение кода не трогается.
   ========================================================================== */
(function () {
  'use strict';

  /* 1. Вешаем недостающие id на существующие элементы дизайна.
        index-4 обращается к ним напрямую: $('#logoZone'), $('#searchInput') и т.д. */
  const idMap = [
    ['.topbar', 'logoZone'],      // зона логотипа в шапке (клик — загрузить свой)
    ['#logo', 'logoImg'],         // сам логотип
    ['#search', 'searchInput'],   // поле поиска дизайна = поиск журнала
    ['#period', 'periodFilter'],  // селектор периода дизайна = фильтр периода
    ['#from', 'customFrom'],      // доп. дата «с»
    ['#to', 'customTo']           // доп. дата «по»
  ];
  for (const [sel, id] of idMap) {
    const el = document.querySelector(sel);
    if (el && !document.getElementById(id)) el.id = id;
  }

  /* 2. Маппинг селекторов: модалка дизайна <dialog id="dialog"> играет роль
        #modalBox/#overlay, панель #viewData — роль <main id="main">. */
  function remap(s) {
    if (!s || typeof s !== 'string') return s;
    return s
      .replace(/#modalBox\b/g, '#dialog')
      .replace(/#overlay\b/g, '#dialog')
      .replace(/#main\b/g, '#viewData');
  }
  const _qs = Document.prototype.querySelector;
  Document.prototype.querySelector = function (sel) {
    if (!(this instanceof Document)) return _qs.apply(this, arguments);
    return _qs.call(this, remap(sel));
  };

  /* 3. Закрытие диалога по клику на подложку (как в index-4: клик вне #modalBox). */
  const dlg = document.getElementById('dialog');
  if (dlg) dlg.addEventListener('click', (e) => {
    const r = dlg.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside && dlg.open && !e.target.closest('.modal')) dlg.close();
  });

  /* 4. Инициализируем общие поля дизайна значениями по умолчанию из index-4
        (ui.period = 'all', пустой поиск). */
  const period = document.getElementById('period');
  if (period) period.value = 'all';
  const search = document.getElementById('search');
  if (search) search.value = '';
})();
