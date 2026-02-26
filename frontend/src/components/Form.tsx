import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      id: providedId,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="space-y-1">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={id}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={clsx(
            error && errorId,
            helperText && helperId
          )}
          className={clsx(
            'w-full px-4 py-2 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      id: providedId,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="space-y-1">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
        <textarea
          ref={ref}
          id={id}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={clsx(
            error && errorId,
            helperText && helperId
          )}
          className={clsx(
            'w-full px-4 py-2 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
