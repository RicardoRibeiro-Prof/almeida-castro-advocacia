document.documentElement.classList.add('js')

const menuButton = document.querySelector('[data-menu-button]')
const navigation = document.querySelector('[data-navigation]')

function closeMenu() {
  if (!menuButton || !navigation) return
  navigation.classList.remove('open')
  menuButton.setAttribute('aria-expanded', 'false')
  menuButton.setAttribute('aria-label', 'Abrir menu')
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const willOpen = !navigation.classList.contains('open')
    navigation.classList.toggle('open', willOpen)
    menuButton.setAttribute('aria-expanded', String(willOpen))
    menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu')
  })

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu()
      menuButton.focus()
    }
  })
}

const contactForm = document.querySelector('[data-contact-form]')
const feedback = document.querySelector('[data-form-feedback]')

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const data = new FormData(contactForm)
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').replace(/\D/g, '')
    const subject = String(data.get('subject') || '').trim()
    const message = String(data.get('message') || '').trim()

    if (name.length < 2 || phone.length < 10 || subject.length < 3 || message.length < 10) {
      if (feedback) feedback.textContent = 'Revise os campos. Informe nome, telefone, assunto e uma mensagem com pelo menos 10 caracteres.'
      return
    }

    const text = [
      'Olá! Acessei o site demonstrativo Moura & Queiroz Advocacia.',
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Assunto: ${subject}`,
      `Mensagem: ${message}`,
    ].join('\n')

    if (feedback) feedback.textContent = 'A conversa será aberta no WhatsApp. Nenhum dado é armazenado neste site.'
    window.open(`https://wa.me/5589999999999?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  })
}

const year = document.querySelector('[data-current-year]')
if (year) year.textContent = String(new Date().getFullYear())
