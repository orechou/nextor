/**
 * Inline CSS styles for WeChat Official Account export
 * WeChat doesn't support <style> tags, so we need to inline styles directly on elements
 */

interface StyleRule {
  selector: string
  declarations: { [property: string]: string }
  specificity: number
}

// Parse CSS into style rules with better handling
function parseCSS(css: string): StyleRule[] {
  const rules: StyleRule[] = []

  // Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')

  // Match CSS rules - improved regex
  const ruleRegex = /([^{]+)\{([^}]+)\}/g
  let match

  while ((match = ruleRegex.exec(css)) !== null) {
    const selector = match[1].trim()
    const declarationsStr = match[2].trim()

    if (!selector) continue

    const declarations: { [property: string]: string } = {}
    const declRegex = /([^:]+):\s*([^;]+);?/g
    let declMatch

    while ((declMatch = declRegex.exec(declarationsStr)) !== null) {
      const property = declMatch[1].trim()
      const value = declMatch[2].trim()
      if (property && value) {
        declarations[property] = value
      }
    }

    rules.push({
      selector,
      declarations,
      specificity: calculateSpecificity(selector)
    })
  }

  return rules
}

// Calculate CSS selector specificity
function calculateSpecificity(selector: string): number {
  let specificity = 0

  // ID selectors
  specificity += (selector.match(/#/g) || []).length * 100

  // Class selectors, pseudo-classes, attribute selectors
  specificity += (selector.match(/\.|:|\[/g) || []).length * 10

  // Element selectors
  const tagMatch = selector.match(/^[a-z][a-z0-9-]*/i)
  if (tagMatch && !selector.startsWith('.') && !selector.startsWith('#')) {
    specificity += 1
  }

  // Universal selector
  if (selector === '*') {
    specificity = 0
  }

  return specificity
}

// Check if an element matches a selector
function matchesSelector(element: Element, selector: string): boolean {
  // Handle universal selector
  if (selector === '*') {
    return true
  }

  // Handle ID selector
  if (selector.startsWith('#')) {
    return element.id === selector.slice(1)
  }

  // Handle class selectors (single class only for simplicity)
  if (selector.startsWith('.') && !selector.includes(' ')) {
    return element.classList.contains(selector.slice(1))
  }

  // Handle tag selectors
  if (!selector.includes('.') && !selector.includes('#') && !selector.includes(' ')) {
    return selector === element.tagName.toLowerCase()
  }

  // Handle compound selectors (e.g., "div.container")
  if (selector.includes('.') && !selector.includes(' ')) {
    const [tag, className] = selector.split('.')
    return element.tagName.toLowerCase() === tag && element.classList.contains(className)
  }

  // For simplicity, try native matches
  try {
    return element.matches(selector)
  } catch {
    return false
  }
}

// Apply styles from CSS to HTML
export function inlineCSS(html: string, css: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const rules = parseCSS(css)

  // Sort by specificity (higher specificity = applied later)
  rules.sort((a, b) => a.specificity - b.specificity)

  // Apply rules to matching elements
  const allElements = doc.body.querySelectorAll('*')
  allElements.forEach(element => {
    const elementStyles: { [property: string]: string } = {}

    // Find all matching rules and apply in order
    rules.forEach(rule => {
      if (matchesSelector(element, rule.selector)) {
        // Later rules override earlier ones
        Object.assign(elementStyles, rule.declarations)
      }
    })

    // Apply accumulated styles to the element
    if (Object.keys(elementStyles).length > 0) {
      const styleString = Object.entries(elementStyles)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ')

      const existingStyle = element.getAttribute('style') || ''
      element.setAttribute('style', existingStyle ? `${existingStyle}; ${styleString}` : styleString)
    }
  })

  // Return innerHTML of body (for WeChat)
  return doc.body.innerHTML
}
