import React from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';

interface BaseFormProps<T extends FieldValues = FieldValues> {
  onSubmit: (data: T) => void;
  defaultValues: T;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
}

export function BaseForm<T extends FieldValues>({
  onSubmit,
  defaultValues,
  children,
}: BaseFormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      {children(methods)}
    </form>
  );
}
