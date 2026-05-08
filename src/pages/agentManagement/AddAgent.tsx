import React, { useEffect, useState } from 'react';
import type { EditableAgent } from './mockData';

type AuthorizationKey = keyof NonNullable<EditableAgent['authorization']>;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  designation: string;
  office: string;
  country: string;
  auth: Record<AuthorizationKey, boolean>;
};

type AddAgentProps = {
  editAgent?: EditableAgent | null;
  onSuccess?: (agent: EditableAgent) => void;
  onDiscard?: () => void;
};

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  designation: '',
  office: '',
  country: '',
  auth: {
    addAgent: false,
    editAgent: false,
    assignUni: false,
    addOffice: false,
    editOffice: false,
    removeOffice: false,
    assignRegion: false,
    assignCourse: false,
    removeAgent: false,
  },
};

const toFormState = (agent: EditableAgent): FormState => ({
  firstName: agent.firstName ?? '',
  lastName: agent.lastName ?? '',
  email: agent.emailId ?? '',
  mobile: agent.mobileNumber ?? '',
  designation: agent.designation ?? '',
  office: agent.office ?? '',
  country: agent.country ?? '',
  auth: {
    addAgent: agent.authorization?.addAgent ?? false,
    editAgent: agent.authorization?.editAgent ?? false,
    assignUni: agent.authorization?.assignUni ?? false,
    addOffice: agent.authorization?.addOffice ?? false,
    editOffice: agent.authorization?.editOffice ?? false,
    removeOffice: agent.authorization?.removeOffice ?? false,
    assignRegion: agent.authorization?.assignRegion ?? false,
    assignCourse: agent.authorization?.assignCourse ?? false,
    removeAgent: agent.authorization?.removeAgent ?? false,
  },
});

const AddAgent: React.FC<AddAgentProps> = ({ editAgent, onSuccess, onDiscard }) => {
  const isEditMode = Boolean(editAgent?.id);
  const [form, setForm] = useState<FormState>(() => (editAgent ? toFormState(editAgent) : initialState));

  useEffect(() => {
    setForm(editAgent ? toFormState(editAgent) : initialState);
  }, [editAgent]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAuth = (key: AuthorizationKey) => {
    setForm((prev) => ({
      ...prev,
      auth: { ...prev.auth, [key]: !prev.auth[key] },
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: EditableAgent = {
      id: editAgent?.id || `agent-${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      emailId: form.email.trim(),
      mobileNumber: form.mobile.trim(),
      designation: form.designation,
      office: form.office,
      country: form.country,
      authorization: {
        addAgent: form.auth.addAgent,
        editAgent: form.auth.editAgent,
        assignUni: form.auth.assignUni,
        addOffice: form.auth.addOffice,
        editOffice: form.auth.editOffice,
        removeOffice: form.auth.removeOffice,
        assignRegion: form.auth.assignRegion,
        assignCourse: form.auth.assignCourse,
        removeAgent: form.auth.removeAgent,
      },
    };

    onSuccess?.(payload);
  };

  return (
    <form onSubmit={onSubmit} className="text-white">
      <div className="mb-3 text-xs text-white/70">
        <span>Agent Management </span>
        <span className="text-[#F68E2D]">&gt; {isEditMode ? 'Edit Agent' : 'Add Agent'}</span>
      </div>

      <h1 className="mb-6 text-2xl font-bold">{isEditMode ? 'Edit Agent' : 'Add Agent'}</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="First Name" required value={form.firstName} onChange={(v) => setField('firstName', v)} placeholder="First Name" />
        <Field label="Last Name" required value={form.lastName} onChange={(v) => setField('lastName', v)} placeholder="Last Name" />

        <Field label="Email ID" required value={form.email} onChange={(v) => setField('email', v)} placeholder="Email ID" />
        <Field label="Mobile Number" required value={form.mobile} onChange={(v) => setField('mobile', v)} placeholder="Mobile Number" />

        <SelectField label="Designation" required value={form.designation} onChange={(v) => setField('designation', v)} options={['', 'Managing Director', 'Chief Operating Officer', 'Counselor']} emptyLabel="Select Designation" />
        <SelectField label="Office" required value={form.office} onChange={(v) => setField('office', v)} options={['', 'Hyderabad', 'Bangalore', 'Noida', 'Delhi', 'Chennai', 'Pune', 'Mumbai', 'London']} emptyLabel="Select Office" />
      </div>

      <div className="mt-6">
        <SelectField label="Country" required value={form.country} onChange={(v) => setField('country', v)} options={['', 'India', 'UK', 'USA', 'UAE']} emptyLabel="Select Country" fullWidth />
      </div>

      <div className="mt-8">
        <label className="mb-3 block text-lg font-semibold">
          Authorization<span className="text-[#FF4D4F]">*</span>
        </label>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {[
            ['Add Agent', 'addAgent'],
            ['Edit Agent', 'editAgent'],
            ['Assign Uni', 'assignUni'],
            ['Add Office', 'addOffice'],
            ['Edit Office', 'editOffice'],
            ['Remove Office', 'removeOffice'],
            ['Assign Region', 'assignRegion'],
            ['Assign Course', 'assignCourse'],
            ['Remove Agent', 'removeAgent'],
          ].map(([label, key]) => (
            <AuthItem key={key} label={label} checked={form.auth[key as AuthorizationKey]} onChange={() => toggleAuth(key as AuthorizationKey)} />
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onDiscard}
          className="h-12 w-60 rounded border border-[#2FD3C8] bg-[#E8E8E8] text-xl font-semibold text-[#9AA0A6]"
        >
          Discard
        </button>
        <button type="submit" className="h-12 w-60 rounded bg-[#F68E2D] text-xl font-semibold text-white transition-colors hover:bg-[#e57d1f]">
          {isEditMode ? 'Update Agent' : 'Add Agent'}
        </button>
      </div>
    </form>
  );
};

function Field({ label, required, value, onChange, placeholder }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-lg font-semibold">
        {label}
        {required ? <span className="text-[#FF4D4F]">*</span> : null}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full border border-[#2C2A45] bg-[#14112E] px-4 text-base text-white outline-none placeholder:text-white/55"
      />
    </div>
  );
}

function SelectField({ label, required, value, onChange, options, emptyLabel, fullWidth }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; emptyLabel?: string; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <label className="mb-2 block text-lg font-semibold">
        {label}
        {required ? <span className="text-[#FF4D4F]">*</span> : null}
      </label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full appearance-none border border-[#2C2A45] bg-[#14112E] px-4 pr-10 text-base text-white outline-none">
          {options.map((opt) => (
            <option key={opt || 'empty'} value={opt} className="bg-[#14112E] text-white">
              {opt === '' ? emptyLabel || 'Select' : opt}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function AuthItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex h-12 cursor-pointer items-center justify-between border border-[#2C2A45] bg-[#14112E] px-4">
      <span className="text-base text-white/90">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border border-white/70 bg-transparent accent-white" />
    </label>
  );
}

export default AddAgent;
