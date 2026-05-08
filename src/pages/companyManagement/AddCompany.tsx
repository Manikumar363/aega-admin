import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SAMPLE_COMPANIES } from './mockData';

type FormState = {
  companyName: string;
  founderName: string;
  emailId: string;
  mobileNumber: string;
  designation: string;
  office: string;
  country: string;
  companyDocument1: string;
  companyDocument2: string;
};

const initialState: FormState = {
  companyName: '',
  founderName: '',
  emailId: '',
  mobileNumber: '',
  designation: '',
  office: '',
  country: '',
  companyDocument1: '',
  companyDocument2: '',
};

const STORAGE_KEY = 'companies_list_v1';

const AddCompany: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<{ companyDocument1: boolean; companyDocument2: boolean }>({ companyDocument1: false, companyDocument2: false });
  const [selectedFileName, setSelectedFileName] = useState<{ companyDocument1: string; companyDocument2: string }>({ companyDocument1: '', companyDocument2: '' });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const onDiscard = () => setForm(initialState);

  const handleDocumentUpload = async (field: 'companyDocument1' | 'companyDocument2', file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    setUploadingDoc((p) => ({ ...p, [field]: true }));
    // For now store file name as uploaded path (no real upload in this demo)
    setTimeout(() => {
      setField(field, file.name);
      setSelectedFileName((p) => ({ ...p, [field]: file.name }));
      setUploadingDoc((p) => ({ ...p, [field]: false }));
      toast.success('Uploaded');
    }, 800);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.companyDocument1 || !form.companyDocument2) {
      toast.error('Please upload both company documents.');
      return;
    }
    setIsSubmitting(true);

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SAMPLE_COMPANIES];
      const nextId = list.length ? Math.max(...list.map((x: any) => x.id)) + 1 : 1;
      list.push({ id: nextId, name: form.companyName, owner: form.founderName, mobile: form.mobileNumber, email: form.emailId, region: form.office, initials: form.companyName.slice(0, 3).toUpperCase() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      toast.success('Company created');
      navigate('/office');
    } catch (e) {
      toast.error('Failed to save company');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="text-white">
      <div className="mb-4 text-xs font-semibold text-white">
        <span>Company Management </span>
        <span className="text-[#F68E2D]">&gt; Add Company</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">Add Company</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Company Name" required value={form.companyName} onChange={(v) => setField('companyName', v)} placeholder="Company Name" />
        <Field label="Founder Name" required value={form.founderName} onChange={(v) => setField('founderName', v)} placeholder="Founder Name" />

        <Field label="Email ID" required value={form.emailId} onChange={(v) => setField('emailId', v)} placeholder="Email ID" />
        <Field label="Mobile Number" required value={form.mobileNumber} onChange={(v) => setField('mobileNumber', v)} placeholder="Mobile Number" />

        <SelectField label="Designation" required value={form.designation} onChange={(v) => setField('designation', v)} options={[ '', 'Managing Director', 'Chief Operating Officer', 'Counselor' ]} emptyLabel="Select Designation" />
        <SelectField label="Office" required value={form.office} onChange={(v) => setField('office', v)} options={[ '', 'Hyderabad', 'Bangalore', 'Noida' ]} emptyLabel="Select Office" />
      </div>

      <div className="mt-6">
        <SelectField label="Country" required value={form.country} onChange={(v) => setField('country', v)} options={[ '', 'India', 'UK', 'USA', 'UAE' ]} emptyLabel="Select Country" fullWidth />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <UploadCard label="Company Document 1" value={form.companyDocument1} fileName={selectedFileName.companyDocument1} uploading={uploadingDoc.companyDocument1} onSelectFile={(f) => handleDocumentUpload('companyDocument1', f)} />
        <UploadCard label="Company Document 2" value={form.companyDocument2} fileName={selectedFileName.companyDocument2} uploading={uploadingDoc.companyDocument2} onSelectFile={(f) => handleDocumentUpload('companyDocument2', f)} />
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
        <button type="button" onClick={onDiscard} disabled={isSubmitting || uploadingDoc.companyDocument1 || uploadingDoc.companyDocument2} className="w-full border border-[#C8CDD9] bg-white px-8 py-3 text-base font-medium text-[#A7AEBB] sm:w-56">Discard</button>
        <button type="submit" disabled={isSubmitting || uploadingDoc.companyDocument1 || uploadingDoc.companyDocument2} className="w-full bg-[#F68E2D] px-8 py-3 text-base font-semibold text-white sm:w-56">{isSubmitting ? 'Saving...' : 'Add Company'}</button>
      </div>
    </form>
  );
};

function Field({ label, required, value, onChange, placeholder }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div>
      <label className="mb-2 block text-base font-semibold text-white">{label}{required ? <span className="text-[#E03137]">*</span> : null}</label>
      <div className="relative">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-11 w-full border border-[#383B63] bg-[#1A163E] px-4 pr-12 text-sm text-white outline-none placeholder:text-white/55" />
      </div>
    </div>
  );
}

function SelectField({ label, required, value, onChange, options, emptyLabel, fullWidth }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; emptyLabel?: string; fullWidth?: boolean; }) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <label className="mb-2 block text-base font-semibold text-white">{label}{required ? <span className="text-[#E03137]">*</span> : null}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full appearance-none border border-[#383B63] bg-[#1A163E] px-4 pr-11 text-sm text-white outline-none">
          {options.map((option) => (
            <option key={option || 'empty'} value={option} className="bg-[#1A163E] text-white">{option === '' ? (emptyLabel || 'Select') : option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/90">▾</div>
      </div>
    </div>
  );
}

function UploadCard({ label, value, fileName, uploading, onSelectFile }: { label: string; value: string; fileName: string; uploading: boolean; onSelectFile: (file: File) => void; }) {
  return (
    <div>
      <label className="mb-2 block text-base font-semibold text-white">{label}<span className="text-[#E03137]">*</span></label>
      <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-[#8F93AE] bg-[#1A163E] text-white/70 hover:border-[#F68E2D]/70 hover:text-white">
        <div className="text-white">⬆</div>
        <span className="max-w-[88%] truncate text-xs text-white/85 text-center">{uploading ? 'Uploading...' : fileName || (value ? value : 'Drop file here or click to upload')}</span>
        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => { const file = event.target.files?.[0]; if (file) onSelectFile(file); event.currentTarget.value = ''; }} />
      </label>
    </div>
  );
}

export default AddCompany;
