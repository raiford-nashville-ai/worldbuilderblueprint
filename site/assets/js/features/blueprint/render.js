function node(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
}

// Rendering owns only the document subtree. User text always enters as text,
// never HTML. Stage changes, focus and the current Blueprint belong to main.
export function renderBlueprint(blueprint, root) {
  root.querySelector('#blueprintTitle').textContent = blueprint.title;
  root.querySelector('#blueprintDescription').textContent = blueprint.description;
  root.querySelector('#createdDate').textContent = new Date(blueprint.createdISO).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const container = root.querySelector('#blueprintBody');
  container.replaceChildren(node('p', 'document-opening', blueprint.opening));
  blueprint.sections.forEach((section, index) => {
    const region = node('section', 'document-section');
    region.append(node('span', 'section-index', String(index + 1).padStart(2, '0')));
    region.append(node('h3', '', section.heading));
    const paragraphGroup = section.boxed ? node('div', 'connection-box') : region;
    section.paragraphs.forEach(text => paragraphGroup.append(node('p', '', text)));
    if (section.boxed) region.append(paragraphGroup);
    section.quotations.forEach(quote => {
      region.append(node('p', 'source-label', quote.label));
      region.append(node('blockquote', '', quote.text));
    });
    container.append(region);
  });
  if (blueprint.openThreads.length) {
    const region = node('section', 'document-section');
    region.append(node('span', 'section-index', String(blueprint.sections.length + 1).padStart(2, '0')));
    region.append(node('h3', '', 'Doors left open'));
    region.append(node('p', '', 'These questions are unfinished, and they are allowed to remain that way. Return to them only if they make your idea more interesting.'));
    const list = node('ul', 'open-threads');
    blueprint.openThreads.forEach(item => {
      const li = node('li');
      li.append(node('span', '', item.label), document.createTextNode(item.question));
      list.append(li);
    });
    region.append(list);
    if (blueprint.remainingOpen) region.append(node('p', '', `${blueprint.remainingOpen} more ${blueprint.remainingOpen === 1 ? 'question remains' : 'questions remain'} open, ready whenever you are.`));
    container.append(region);
  }
}
