
import { Category } from './types';

export const BASE_CATEGORIES: { income: Category[]; expense: Category[] } = {
  income: [
    { id: 'salary', name: 'Salary', icon: '💰', isBase: true },
    { id: 'freelance', name: 'Freelance', icon: '💻', isBase: true },
    { id: 'business', name: 'Business', icon: '💼', isBase: true },
    { id: 'investment', name: 'Investment', icon: '📈', isBase: true },
    { id: 'other-income', name: 'Other', icon: '📋', isBase: true }
  ],
  expense: [
    { id: 'food', name: 'Food', icon: '🍔', isBase: true },
    { id: 'transport', name: 'Transport', icon: '🚗', isBase: true },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', isBase: true },
    { id: 'bills', name: 'Bills', icon: '📄', isBase: true },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', isBase: true },
    { id: 'health', name: 'Health', icon: '🏥', isBase: true },
    { id: 'education', name: 'Education', icon: '📚', isBase: true },
    { id: 'other-expense', name: 'Other', icon: '📋', isBase: true }
  ]
};

export const EMOJIS: string[] = [
  '💵', '💳', '🏡', '🚗', '🍔', '☕', '🛒', '🎁', '💡', '📈', '📉', '💼', '🏥', '📚', '🎬', '✈️', '🐶', '🐱', '🎮', '📱', '👕', '💡', '🔌', '💧', '⚡', '🅿️', '⛽', '📦', '🎉', '🏖️', '🧑‍💻', '🧑‍🎓', '🍎', '🥕', '🥦', '🍞', '🥛', '🥚', '🧀', '🥩', '🍕', '🌮', '🍦', '🍩', '🍪', '🥂', '🍾', '🍻', '🥳', '🎁', '🎂', '🎈', '💍', '🎓', '🏥', '💊', '🩹', '💉', '🧪', '🔬', '🧬', '🦠', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '😈', '👻', '👽', '🤖', '💩', '😹', '😻', '😼', '😽', '😾', '😿', '🙀', '🙉', '🙊', '🐵', '🐸', '🐢', '🐍', '🦎', '🦖', '🦕', '🐳', '🐬', '🐡', '🦈', '🐙', '🐚', '🦀', '🦞', '🦐', '🦑', '🐌', '🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🕸️', '🦂', '🦟', '🪳', '🍄', '🌸', '🌼', '🌻', '🌹', '🌷', '🌿', '🌱', '🌳', '🌲', '🌴', '🌵', '🌾', '🍂', '🍁', '🍀', '🌈', '☀️', '☔', '☁️', '❄️', '☃️', '🌬️', '🔥', '🌊', '🌎', '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '⭐️', '🌟', '✨', '⚡', '☄️', '💥', '🔥', '💯', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '👍', '👎', '👌', '👏', '🙌', '🙏', '🤲', '🤝', '💪', '🦵', '🦶', '👂', '👃', '🧠', '🫀', '🫁', '🦴', '👄', '🦷', '👅', '👁️', '👀', '🧑', '👩', '👨', '👧', '👦', '👶', '👴', '👵', '🧑‍🦳', '🧑‍🦱', '🧑‍🦰', '👱‍♀️', '👱‍♂️', '🧔', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱', '👩‍🦲', '👨‍🦲', '🧑‍🦲', '👵', '👴', '🧑‍🍼', '🤰', '🤱', '🧍‍♀️', '🧍‍♂️', '🚶‍♀️', '🚶‍♂️', '🏃‍♀️', '🏃‍♂️', '💃', '🕺', '👯‍♀️', '👯‍♂️', '🕴️', '👤', '👥', '🫂', '🗣️', '🧑‍🤝‍🧑'
];
