<script>
/* ==========================================================================
   АДАПТЕР — связывает логику из index 4.html с разметкой из 1111.html.
   Меняет только «адреса» элементов (селекторы), поведение кода не трогает.
   ========================================================================== */

/* index-4 ищет элементы по id; в дизайне те же роли живут у классов или
   имеют другие id — добавляем недостающие id существующим элементам. */
(function ensureIds() {
  const map = [
    ['.topbar', 'logoZone'],        // зона логотипа в шапке дизайна (клик — загрузить)
    ['#logo', 'logoImg'],           // сам логотип
    ['#search', 'searchInput'],     // поле поиска дизайна = поиск журнала
    ['#period', 'periodFilter'],    // селектор периода дизайна = фильтр периода
    ['#from', 'customFrom'],        // доп. дата «с»
    ['#to', 'customTo'],            // доп. дата «по»
    ['#tabs', 'main'],              // область вкладок/содержимого
    ['.container', 'overlay'],      // контейнер служит «подложкой» для закрытия диалога по клику вне
  ];
  for (const [sel, id] of map) {
    const el = document.querySelector(sel);
    if (el && !document.getElementById(id)) el.id = id;
  }
})();

/* Диалог дизайна <dialog id="dialog"> играет роль модального окна #modalBox,
   панель #viewData — роль <main id="main">, секция .block — роль карточки .card. */
const _origQSA = Document.prototype.querySelectorAll;
const _origQS  = Document.prototype.querySelector;

function remapSelector(s) {
  if (!s || typeof s !== 'string') return s;
  return s
    .replace(/#modalBox\b/g, '#dialog')
    .replace(/#main\b/g, '#viewData')
    .replace(/\.card\b(?![-\w])/g, '.block');
}
function needsMutation(s) {
  return typeof s === 'string' && /#modalBox|#main|(^|[,;\s])\.card([^-.\s;,\w]|$)/.test(s);
}
function mutateDom(el) {
  if (!el || !(el instanceof Element)) return el;
  if (el.id === 'dialog') el.classList.add('swap');          // мягкая смена содержимого (анимация дизайна)
  return el;
}

Document.prototype.querySelector = function (sel) {
  if (!(this instanceof Document)) return _origQS.apply(this, arguments);
  if (!needsMutation(sel)) return _origQS.call(this, sel);
  return mutateDom(_origQS.call(this, remapSelector(sel)));
};
Document.prototype.querySelectorAll = function (sel) {
  if (!(this instanceof Document)) return _origQSA.apply(this, arguments);
  if (!needsMutation(sel)) return _origQSA.call(this, sel);
  const list = _origQSA.call(this, remapSelector(sel));
  list.forEach(mutateDom);
  return list;
};

/* В дизайн-разметке нет панели фильтров по банкам (#bankbar) — создаём её
   в стиле тулбара дизайна (те же токены отступов, шрифтов, радиусов). */
if (!document.getElementById('bankbar')) {
  const bb = document.createElement('div');
  bb.className = 'bankbar';
  bb.id = 'bankbar';
  const mount = document.querySelector('#viewData > .block');
  if (mount) mount.insertBefore(bb, mount.firstChild);
  else document.querySelector('.container').appendChild(bb);
}

/* Значения по умолчанию для полей дизайна, которые index-4 использует как свои:
   период «Всё время» (как ui.period='all'), пустой поиск. */
(function initSharedFields() {
  const period = document.getElementById('period');
  if (period) period.value = 'all';
  const search = document.getElementById('search');
  if (search) search.value = '';
})();
</script>
