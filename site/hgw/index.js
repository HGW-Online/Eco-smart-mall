const query = document.querySelector('#query');
const filters = document.querySelector('#filters');
const modules = document.querySelector('#modules');
const count = document.querySelector('#count');
const sourceList = document.querySelector('#source-list');
const picker = document.querySelector('#language');
const languageKey = 'hgw-unified-language';
let selected = '';
let savedLanguage;
try {
  savedLanguage = localStorage.getItem(languageKey);
} catch {
  // Language switching still works when browser storage is unavailable.
}
function supported(value) {
  return Object.hasOwn(ui, value);
}
const requestedLanguage = new URL(location.href).searchParams.get('lang');
let language = supported(requestedLanguage) ? requestedLanguage :
  supported(savedLanguage) ? savedLanguage : 'ar';

function element(tag, value, parent) {
  const node = document.createElement(tag);
  node.textContent = value;
  parent.append(node);
  return node;
}

function link(parent, label, href, note, description) {
  const row = element('li', '', parent);
  const anchor = element('a', label, row);
  if (href.startsWith('./')) {
    const url = new URL(href, 'https://hgw-unified.same-elrefaey.chatgpt.site/');
    url.searchParams.set('lang', language);
    anchor.href = url.href;
  } else {
    anchor.href = href;
  }
  if (note) element('small', '· ' + note, row).className = 'link-note';
  if (description) element('p', description, row).className = 'link-description';
}

function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ى/g, 'ي').replace(/ـ/g, '');
}

function translatedSection(section) {
  if (language === 'ar') return section;
  const column = language === 'en' ? 0 : 1;
  const translation = sectorTranslations[section.id];
  return {
    ...section,
    title: translation[column],
    description: translation[2 + column],
    keywords: [...section.keywords, translation[4 + column]],
    tools: section.tools.map((tool, index) => ({...tool, title: toolTitles[section.id][index][column]})),
    sources: section.sources.map(source => ({...source, title: sourceTitles[source.slug]?.[column] ?? source.title})),
    pages: section.pages.map(page => {
      const slug = page.href.split('/').at(-1).replace(/\.html$/, '');
      return {...page, title: pageTitles[slug]?.[column] ?? page.title};
    })
  };
}

function render() {
  const copy = ui[language];
  const terms = normalize(query.value).split(/\s+/).filter(Boolean);
  const includesTerms = value => terms.every(term => normalize(value).includes(term));
  const matches = [];
  for (const original of catalog) {
    if (selected && original.id !== selected) continue;
    const section = translatedSection(original);
    const titles = [...section.sources, ...section.tools, ...original.sources, ...original.tools].map(item => item.title);
    const descriptions = [section.id, ...toolGuideKeys[section.id], ...section.sources.map(source => source.slug)];
    const sectionText = [section.title, section.description, original.title, ...section.keywords, ...titles, ...descriptions.map(key => guide[key][language])].join(' ');
    const pages = section.pages.filter((page, index) => includesTerms(page.title + ' ' + original.pages[index].title));
    if (includesTerms(sectionText) || pages.length) matches.push({section, pages});
  }
  modules.replaceChildren();
  count.textContent = matches.length
    ? `${copy.count}: ${new Intl.NumberFormat(language).format(matches.length)}`
    : copy.empty;
  for (const {section, pages} of matches) {
    const card = element('article', '', modules);
    card.id = section.id;
    element('h2', section.title, card);
    element('p', section.description, card);
    element('p', guide[section.id][language], card);
    const list = element('ul', '', card);
    list.className = 'tool-list';
    for (const [index, item] of section.tools.entries()) {
      const note = language === 'ar' ? '' : item.href.startsWith('./') ? section.id === 'operations' ? '' : copy.arabicContent : copy.originals;
      link(list, item.title, item.href, note, guide[toolGuideKeys[section.id][index]][language]);
    }
    if (pages.length) {
      const index = element('details', '', card);
      index.open = terms.length > 0;
      element('summary', `${copy.pages} (${pages.length})`, index);
      const pageList = element('ul', '', index);
      for (const page of pages) link(pageList, page.title, page.href, language === 'ar' ? '' : copy.arabicContent);
    }
  }
  for (const button of filters.children) button.setAttribute('aria-pressed', button.dataset.id === selected);
}

function applyLanguage() {
  const copy = ui[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.title = 'HGW | ' + copy.brand;
  picker.value = language;
  for (const node of document.querySelectorAll('[data-text]')) node.textContent = copy[node.dataset.text];
  query.placeholder = copy.placeholder;
  filters.setAttribute('aria-label', copy.sectors);
  modules.setAttribute('aria-label', copy.directory);
  filters.replaceChildren();
  sourceList.replaceChildren();
  const sections = catalog.map(translatedSection);
  for (const section of [{id: '', title: copy.all}, ...sections]) {
    const button = element('button', section.title, filters);
    button.dataset.id = section.id;
    button.addEventListener('click', () => {
      selected = section.id;
      render();
    });
  }
  for (const section of sections) {
    for (const source of section.sources) link(sourceList, `${source.title} · ${section.title}`, source.href, null, guide[source.slug][language]);
  }
  render();
}

picker.addEventListener('change', () => {
  language = picker.value;
  try {
    localStorage.setItem(languageKey, language);
  } catch {
    // The language is also recorded in the current address.
  }
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  history.replaceState(null, '', url);
  applyLanguage();
});
query.addEventListener('input', render);
document.querySelector('header a[href="#sources"]').addEventListener('click', () => {
  document.querySelector('#sources').open = true;
});
applyLanguage();
