"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/billing/submit-button";
import { darkButton, darkInput } from "@/components/billing/styles";
import { useKeepValuesSubmit } from "@/components/billing/use-submit";
import { cancelCareAction, supportRequestAction, type FormState } from "../actions";

function Result({ state }: { state: FormState }) {
  if (!state) return null;
  return (
    <p role={state.error ? "alert" : "status"} className={`mt-3 text-sm ${state.error ? "text-red-300" : "text-emerald-200"}`}>
      {state.error ?? state.message}
    </p>
  );
}

export function SupportForm({ projects }: { projects: { id: string; label: string }[] }) {
  const [state, action] = useActionState<FormState, FormData>(supportRequestAction, null);
  const { onSubmit, pending } = useKeepValuesSubmit(action);
  if (state?.ok) return <Result state={state} />;
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {projects.length === 1 ? (
        <input type="hidden" name="projectId" value={projects[0].id} />
      ) : (
        <div>
          <label htmlFor="support-project" className="text-sm font-medium">
            Project
          </label>
          <select id="support-project" name="projectId" className={darkInput(false, "h-11")}>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="support-kind" className="text-sm font-medium">
          Request type
        </label>
        <select id="support-kind" name="kind" className={darkInput(false, "h-11")} defaultValue="support">
          <option value="support">Support or a question</option>
          <option value="additional_service">Additional service (new pages, features, changes)</option>
        </select>
      </div>
      <div>
        <label htmlFor="support-subject" className="text-sm font-medium">
          Subject
        </label>
        <input id="support-subject" name="subject" required maxLength={140} className={darkInput(false, "h-11")} />
      </div>
      <div>
        <label htmlFor="support-message" className="text-sm font-medium">
          Message
        </label>
        <textarea id="support-message" name="message" required maxLength={4000} rows={4} className={darkInput(false, "py-2.5")} />
      </div>
      <SubmitButton pending={pending} pendingLabel="Sending…">
        Send request
      </SubmitButton>
      <Result state={state} />
    </form>
  );
}

/** One-click cancellation with a clear statement of when it takes effect. */
export function CancelCareForm({ projectId, effectiveDate }: { projectId: string; effectiveDate: string }) {
  const [state, action] = useActionState<FormState, FormData>(cancelCareAction, null);
  const [confirming, setConfirming] = useState(false);
  if (state?.ok) return <Result state={state} />;
  return (
    <div>
      {!confirming ? (
        <button type="button" onClick={() => setConfirming(true)} className={darkButton.danger}>
          Cancel Website Care
        </button>
      ) : (
        <form action={action} className="border border-night-line bg-night p-4">
          <input type="hidden" name="projectId" value={projectId} />
          <p className="text-[15px] text-white/85">
            Website Care will end on <strong className="text-white">{effectiveDate}</strong> (the end of your current month, or of the three-month minimum if
            later). You won&apos;t be charged after that date.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <SubmitButton variant="danger" pendingLabel="Cancelling…">
              Confirm cancellation
            </SubmitButton>
            <button type="button" onClick={() => setConfirming(false)} className={darkButton.secondary}>
              Keep Website Care
            </button>
          </div>
        </form>
      )}
      <Result state={state} />
    </div>
  );
}
