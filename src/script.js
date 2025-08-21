// Переводы
const translations = {
  ru: {
    title: "Оцените качество обслуживания по вашему обращению",
    appealInfo: {
      appealNumber: "Номер обращения",
      submissionDate: "Дата подачи", 
      completionDate: "Дата завершения",
      serviceResponse: "Ответ службы"
    },
    rating: {
      labels: [
        "Очень плохо",
        "Плохо", 
        "Удовлетворительно",
        "Хорошо",
        "Отлично"
      ]
    },
    comment: {
      placeholder: "Ваш комментарий…",
      counter: "символов"
    },
    submit: "Отправить отзыв",
    messages: {
      success: "Спасибо! Ваш отзыв отправлен.",
      invalidLink: "Отзыв уже был отправлен или ссылка недействительна.",
      serviceUnavailable: "Сервис временно недоступен.",
      selectRating: "Пожалуйста, выберите оценку.",
      commentTooLong: "Комментарий слишком длинный (500 символов).",
      confirmCaptcha: "Подтвердите, что вы не робот."
    }
  },
  kz: {
    title: "Осы өтініш бойынша қызмет сапасын бағалаңыз",
    appealInfo: {
      appealNumber: "Өтініш нөмірі",
      submissionDate: "Жіберілген күні",
      completionDate: "Аяқталған күні", 
      serviceResponse: "Қызмет жауабы"
    },
    rating: {
      labels: [
        "Өте нашар",
        "Нашар",
        "Қанағаттанарлық", 
        "Жақсы",
        "Тамаша"
      ]
    },
    comment: {
      placeholder: "Сіздің пікіріңіз…",
      counter: "таңба"
    },
    submit: "Пікірді жіберу",
    messages: {
      success: "Рахмет! Сіздің пікіріңіз жіберілді.",
      invalidLink: "Пікіріңіз бұрын жіберілген немесе сілтеме жарамсыз.",
      serviceUnavailable: "Қызмет уақытша қолжетімсіз.",
      selectRating: "Бағалауды таңдаңыз.",
      commentTooLong: "Пікір тым ұзақ (500 таңбадан артық).",
      confirmCaptcha: "Робот еместігіңізді растаңыз."
    }
  }
};

// Состояние приложения
let currentLang = 'ru';
let currentRating = 0;
let hoverRating = 0;
let formState = 'idle'; // idle, loading, success, error, invalid

// Мок данные
const appealData = {
  appealNumber: "123456",
  submissionDate: "15.07.2025",
  completionDate: "20.07.2025",
  serviceResponse: "Ваше обращение рассмотрено. Проблема с мусором во дворе решена. Спасибо за обращение."
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupLanguageSwitcher();
  setupStarRating();
  setupCommentField();
  setupForm();
  updateContent();
}

// Настройка переключателя языков
function setupLanguageSwitcher() {
  const ruButton = document.getElementById('lang-ru');
  const kzButton = document.getElementById('lang-kz');
  
  ruButton.addEventListener('click', () => switchLanguage('ru'));
  kzButton.addEventListener('click', () => switchLanguage('kz'));
}

function switchLanguage(lang) {
  currentLang = lang;
  updateLanguageButtons();
  updateContent();
}

function updateLanguageButtons() {
  const ruButton = document.getElementById('lang-ru');
  const kzButton = document.getElementById('lang-kz');
  
  ruButton.classList.toggle('active', currentLang === 'ru');
  kzButton.classList.toggle('active', currentLang === 'kz');
}

// Обновление контента
function updateContent() {
  const t = translations[currentLang];
  
  // Заголовок
  document.getElementById('page-title').textContent = t.title;
  
  // Информация об обращении
  document.getElementById('appeal-number-label').textContent = t.appealInfo.appealNumber;
  document.getElementById('submission-date-label').textContent = t.appealInfo.submissionDate;
  document.getElementById('completion-date-label').textContent = t.appealInfo.completionDate;
  document.getElementById('service-response-label').textContent = t.appealInfo.serviceResponse;
  
  // Комментарий
  document.getElementById('comment-textarea').placeholder = t.comment.placeholder;
  updateCommentCounter();
  
  // Кнопка отправки
  document.getElementById('submit-button').textContent = t.submit;
  
  // Обновление рейтинга
  updateRatingLabel();
}

// Настройка звёздного рейтинга
function setupStarRating() {
  const stars = document.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    const rating = index + 1;
    
    star.addEventListener('mouseenter', () => {
      hoverRating = rating;
      updateStars();
      updateRatingLabel();
    });
    
    star.addEventListener('mouseleave', () => {
      hoverRating = 0;
      updateStars();
      updateRatingLabel();
    });
    
    star.addEventListener('click', () => {
      currentRating = rating;
      updateStars();
      updateRatingLabel();
    });
  });
}

function updateStars() {
  const stars = document.querySelectorAll('.star');
  const activeRating = hoverRating || currentRating;
  
  stars.forEach((star, index) => {
    const rating = index + 1;
    star.classList.toggle('filled', rating <= activeRating);
    star.classList.toggle('hover', hoverRating > 0 && rating <= hoverRating);
  });
}

function updateRatingLabel() {
  const label = document.getElementById('rating-label');
  const t = translations[currentLang];
  const activeRating = hoverRating || currentRating;
  
  if (activeRating > 0) {
    label.textContent = t.rating.labels[activeRating - 1];
  } else {
    label.textContent = '';
  }
}

// Настройка поля комментария
function setupCommentField() {
  const textarea = document.getElementById('comment-textarea');
  textarea.addEventListener('input', updateCommentCounter);
}

function updateCommentCounter() {
  const textarea = document.getElementById('comment-textarea');
  const counter = document.getElementById('comment-counter');
  const t = translations[currentLang];
  
  const length = textarea.value.length;
  counter.textContent = `${length}/500 ${t.comment.counter}`;
}

// Настройка формы
function setupForm() {
  const form = document.getElementById('evaluation-form');
  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const t = translations[currentLang];
  const comment = document.getElementById('comment-textarea').value;
  
  // Валидация
  if (!currentRating) {
    showToast(t.messages.selectRating, 'error');
    return;
  }
  
  if (comment.length > 500) {
    showToast(t.messages.commentTooLong, 'error');
    return;
  }
  
  // Установка состояния загрузки
  setFormState('loading');
  
  // Симуляция API запроса
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Симуляция успешного ответа
  setFormState('success');
  showToast(t.messages.success, 'success');
}

function setFormState(state) {
  formState = state;
  const form = document.getElementById('evaluation-form');
  const submitButton = document.getElementById('submit-button');
  const loadingSpinner = document.getElementById('loading-spinner');
  const stateMessage = document.getElementById('state-message');
  
  switch (state) {
    case 'loading':
      submitButton.disabled = true;
      loadingSpinner.classList.remove('hidden');
      document.getElementById('comment-textarea').disabled = true;
      break;
      
    case 'success':
      form.classList.add('hidden');
      stateMessage.classList.remove('hidden');
      showSuccessMessage();
      break;
      
    case 'error':
      form.classList.add('hidden');
      stateMessage.classList.remove('hidden');
      showErrorMessage();
      break;
      
    case 'invalid':
      form.classList.add('hidden');
      stateMessage.classList.remove('hidden');
      showInvalidMessage();
      break;
      
    default:
      submitButton.disabled = false;
      loadingSpinner.classList.add('hidden');
      document.getElementById('comment-textarea').disabled = false;
  }
}

function showSuccessMessage() {
  const stateMessage = document.getElementById('state-message');
  const t = translations[currentLang];
  
  stateMessage.innerHTML = `
    <svg class="state-icon success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <p class="state-text success">${t.messages.success}</p>
  `;
}

function showErrorMessage() {
  const stateMessage = document.getElementById('state-message');
  const t = translations[currentLang];
  
  stateMessage.innerHTML = `
    <svg class="state-icon error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
    </svg>
    <p class="state-text error">${t.messages.serviceUnavailable}</p>
  `;
}

function showInvalidMessage() {
  const stateMessage = document.getElementById('state-message');
  const t = translations[currentLang];
  
  stateMessage.innerHTML = `
    <svg class="state-icon warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
    </svg>
    <p class="state-text warning">${t.messages.invalidLink}</p>
  `;
}

// Toast уведомления
function showToast(message, type = 'info') {
  // Удаляем существующий toast если есть
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Создаём новый toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Показываем с анимацией
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Скрываем через 4 секунды
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}