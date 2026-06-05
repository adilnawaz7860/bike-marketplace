/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 p-1 rounded-full border border-gray-200 dark:border-zinc-700">
      <div className="pl-2 pr-1 text-gray-500 dark:text-zinc-400">
        <Globe size={16} />
      </div>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          currentLanguage === 'en'
            ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        English
      </button>
      <button
        onClick={() => onLanguageChange('hi')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          currentLanguage === 'hi'
            ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
