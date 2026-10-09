"use client";

import { useTransition, type FormEvent } from "react";

/**
 * Submits a form to a server action without React's automatic reset of uncontrolled fields,
 * so what the customer typed stays on screen when the server returns a validation error.
 */
export function useKeepValuesSubmit(dispatch: (formData: FormData) => void) {
  const [pending, startTransition] = useTransition();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (submitter?.name) formData.set(submitter.name, submitter.value);
    startTransition(() => dispatch(formData));
  };
  return { onSubmit, pending };
}
