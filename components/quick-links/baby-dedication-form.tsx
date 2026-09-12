'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';

export interface ConnectGroupInfo {
  id: string;
  name: string;
  location: string;
  leaderFirstName: string;
  leaderLastName: string;
  leaderPhone: string;
}

export const CONNECT_GROUPS: ConnectGroupInfo[] = [
  {
    id: 'kabod',
    name: 'KABOD CONNECT',
    location: '144 Airport Road, After ADP Junction',
    leaderFirstName: 'Pst Tobi',
    leaderLastName: 'Tijani',
    leaderPhone: '+234 904 535 4864',
  },
  {
    id: 'newness',
    name: 'NEWNESS CONNECT',
    location: '144 Airport Road, After ADP Junction',
    leaderFirstName: 'Pst Happysteve',
    leaderLastName: 'Agbonghale',
    leaderPhone: '+234 809 417 0863',
  },
  {
    id: 'gatekeepers',
    name: 'GATEKEEPERS CONNECT',
    location: '144 Airport Road, After ADP Junction',
    leaderFirstName: 'Pst Blessing',
    leaderLastName: 'Ochade',
    leaderPhone: '+234 706 699 5249',
  },
  {
    id: 'florish',
    name: 'FLORISH CONNECT',
    location: '144 Airport Road, After ADP Junction',
    leaderFirstName: 'Pst Osaretin',
    leaderLastName: 'Osarumwense',
    leaderPhone: '+234 805 928 1336',
  },
  {
    id: 'ugbowo',
    name: 'UGBOWO CONNECT',
    location: 'The Orchard Garden',
    leaderFirstName: 'Min Petry',
    leaderLastName: 'Ebhonu',
    leaderPhone: '+234 813 613 2716',
  },
  {
    id: 'koinonia',
    name: 'KOINONIA CONNECT',
    location: '144 Airport Road, After ADP Junction',
    leaderFirstName: 'Pst Obianuju',
    leaderLastName: 'Okpala',
    leaderPhone: '+234 814 547 7860',
  },
  {
    id: 'ekehuan',
    name: 'EKEHUAN CONNECT',
    location: 'Education Field',
    leaderFirstName: 'Min Petry',
    leaderLastName: 'Ebhonu',
    leaderPhone: '+234 813 613 2716',
  },
  {
    id: 'online',
    name: 'ONLINE / OTHER CONNECT',
    location: 'The Votage Virtual',
    leaderFirstName: '',
    leaderLastName: '',
    leaderPhone: '',
  },
];

interface FormDataState {
  fatherFirstName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherLastName: string;
  babyName: string;
  babyGender: 'Male' | 'Female' | '';
  babyDob: string;
  fatherPhone: string;
  motherPhone: string;
  parentEmail: string;
  connect: string;
  cellLeaderFirstName: string;
  cellLeaderLastName: string;
  cellLeaderPhone: string;
}

const initialFormState: FormDataState = {
  fatherFirstName: '',
  fatherLastName: '',
  motherFirstName: '',
  motherLastName: '',
  babyName: '',
  babyGender: '',
  babyDob: '',
  fatherPhone: '',
  motherPhone: '',
  parentEmail: '',
  connect: '',
  cellLeaderFirstName: '',
  cellLeaderLastName: '',
  cellLeaderPhone: '',
};

export function BabyDedicationForm() {
  const [formData, setFormData] = useState<FormDataState>(initialFormState);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleConnectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedConnect = e.target.value;
    const match = CONNECT_GROUPS.find((g) => g.name === selectedConnect);

    setFormData((prev) => ({
      ...prev,
      connect: selectedConnect,
      cellLeaderFirstName: match ? match.leaderFirstName : prev.cellLeaderFirstName,
      cellLeaderLastName: match ? match.leaderLastName : prev.cellLeaderLastName,
      cellLeaderPhone: match ? match.leaderPhone : prev.cellLeaderPhone,
    }));

    if (errors.connect) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.connect;
        return next;
      });
    }
  };

  const handleGenderChange = (gender: 'Male' | 'Female') => {
    setFormData((prev) => ({ ...prev, babyGender: gender }));
    if (errors.babyGender) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.babyGender;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fatherFirstName.trim())
      newErrors.fatherFirstName = "Father's first name is required";
    if (!formData.fatherLastName.trim())
      newErrors.fatherLastName = "Father's last name is required";
    if (!formData.motherFirstName.trim())
      newErrors.motherFirstName = "Mother's first name is required";
    if (!formData.motherLastName.trim())
      newErrors.motherLastName = "Mother's last name is required";
    if (!formData.babyName.trim())
      newErrors.babyName = "Baby's name is required";
    if (!formData.babyGender)
      newErrors.babyGender = "Please select baby's gender";
    if (!formData.babyDob)
      newErrors.babyDob = "Baby's date of birth is required";
    if (!formData.fatherPhone.trim())
      newErrors.fatherPhone = "Father's phone number is required";

    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = "Parent's email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }

    if (!formData.connect)
      newErrors.connect = 'Please select your connect';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementsByName(firstErrorKey)[0];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const accessKey =
        process.env.NEXT_PUBLIC_BABY_DEDICATION_WEB3FORMS_KEY ||
        '7e42e5f4-a722-4986-bd49-f7c1e576145b';

      // Format readable date
      const formatReadableDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        try {
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            const date = new Date(
              parseInt(parts[0]),
              parseInt(parts[1]) - 1,
              parseInt(parts[2])
            );
            return date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          }
        } catch {
          // fallback
        }
        return dateStr;
      };

      const leader =
        formData.cellLeaderFirstName || formData.cellLeaderLastName
          ? `${formData.cellLeaderFirstName} ${formData.cellLeaderLastName}`.trim()
          : 'N/A';

      const submitData = new FormData();
      submitData.append('access_key', accessKey);
      submitData.append(
        'subject',
        `Baby Dedication Request: ${formData.babyName} (${formData.connect})`
      );
      submitData.append('from_name', 'The Votage Church - Pastoral Care');
      submitData.append('replyto', formData.parentEmail);

      submitData.append('Service Requested', 'Baby Dedication');

      // 1. Baby Details
      submitData.append(
        '[ 1. BABY DETAILS ]',
        '────────────────────────────────'
      );
      submitData.append("Baby's Full Name", formData.babyName);
      submitData.append("Baby's Gender", formData.babyGender);
      submitData.append(
        "Baby's Date of Birth",
        formatReadableDate(formData.babyDob)
      );

      // 2. Parents' Details
      submitData.append(
        "[ 2. PARENTS' INFORMATION ]",
        '────────────────────────────────'
      );
      submitData.append(
        "Father's Full Name",
        `${formData.fatherFirstName} ${formData.fatherLastName}`.trim()
      );
      submitData.append("Father's Phone Number", formData.fatherPhone);
      submitData.append(
        "Mother's Full Name",
        `${formData.motherFirstName} ${formData.motherLastName}`.trim()
      );
      submitData.append("Mother's Phone Number", formData.motherPhone || 'N/A');
      submitData.append("Parent's Email Address", formData.parentEmail);

      // 3. Connect & Leadership
      submitData.append(
        '[ 3. CHURCH CONNECT & LEADERSHIP ]',
        '────────────────────────────────'
      );
      submitData.append('Connect Group', formData.connect);
      submitData.append("Connect Leader's Name", leader);
      submitData.append(
        "Connect Leader's Phone Number",
        formData.cellLeaderPhone || 'N/A'
      );

      // 4. Submission Metadata
      submitData.append(
        '[ 4. SUBMISSION INFO ]',
        '────────────────────────────────'
      );
      submitData.append(
        'Submission Timestamp',
        new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        })
      );

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: submitData,
      });

      const responseData = await response.json();

      try {
        await fetch('/api/quick-links/baby-dedication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
          }),
        });
      } catch {
        // Non-blocking
      }

      if (responseData.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(
          responseData.message ||
            'Submission failed with Web3Forms. Please try again.'
        );
      }
    } catch (err: any) {
      console.error('Baby dedication form submission error:', err);
      setSubmissionError(
        err?.message ||
          'Something went wrong while submitting the form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setIsSubmitted(false);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center w-full max-w-3xl mx-auto shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Baby Dedication Form Submitted
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Thank you! We have received your baby dedication request for{' '}
          <strong className="text-black">{formData.babyName}</strong>. A confirmation has been sent to our pastoral team.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-5 text-left mb-8 space-y-2 text-xs text-gray-700">
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="font-semibold text-gray-500">Baby's Name:</span>
            <span className="font-medium text-black">{formData.babyName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="font-semibold text-gray-500">Parents:</span>
            <span className="font-medium text-black">
              {formData.fatherFirstName} & {formData.motherFirstName}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="font-semibold text-gray-500">Connect:</span>
            <span className="font-medium text-black">{formData.connect}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Email:</span>
            <span className="font-medium text-black">{formData.parentEmail}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 rounded border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            Submit Another Response
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 lg:p-14 shadow-sm w-full max-w-4xl mx-auto">
      {submissionError && (
        <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
          <p className="font-semibold mb-0.5">Error</p>
          <p>{submissionError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Father's Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Father&apos;s Name <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="fatherFirstName"
                value={formData.fatherFirstName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
                  errors.fatherFirstName ? 'border-red-400' : 'border-transparent'
                } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
              />
              <span className="text-[11px] text-gray-500 block mt-1">First</span>
              {errors.fatherFirstName && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.fatherFirstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="fatherLastName"
                value={formData.fatherLastName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
                  errors.fatherLastName ? 'border-red-400' : 'border-transparent'
                } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
              />
              <span className="text-[11px] text-gray-500 block mt-1">Last</span>
              {errors.fatherLastName && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.fatherLastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mother's Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Mother&apos;s Name <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="motherFirstName"
                value={formData.motherFirstName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
                  errors.motherFirstName ? 'border-red-400' : 'border-transparent'
                } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
              />
              <span className="text-[11px] text-gray-500 block mt-1">First</span>
              {errors.motherFirstName && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.motherFirstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="motherLastName"
                value={formData.motherLastName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
                  errors.motherLastName ? 'border-red-400' : 'border-transparent'
                } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
              />
              <span className="text-[11px] text-gray-500 block mt-1">Last</span>
              {errors.motherLastName && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.motherLastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Baby's Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Baby&apos;s Name <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            name="babyName"
            value={formData.babyName}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
              errors.babyName ? 'border-red-400' : 'border-transparent'
            } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
          />
          {errors.babyName && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.babyName}</p>
          )}
        </div>

        {/* Baby's Gender */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-2">
            Baby&apos;s Gender <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="flex items-center gap-8">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-gray-800">
              <input
                type="radio"
                name="babyGender"
                checked={formData.babyGender === 'Male'}
                onChange={() => handleGenderChange('Male')}
                className="w-4 h-4 text-[#E46B0A] focus:ring-[#E46B0A] border-gray-300"
              />
              <span>Male</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-gray-800">
              <input
                type="radio"
                name="babyGender"
                checked={formData.babyGender === 'Female'}
                onChange={() => handleGenderChange('Female')}
                className="w-4 h-4 text-[#E46B0A] focus:ring-[#E46B0A] border-gray-300"
              />
              <span>Female</span>
            </label>
          </div>
          {errors.babyGender && (
            <p className="text-[11px] text-red-500 mt-1">{errors.babyGender}</p>
          )}
        </div>

        {/* Baby's Date of Birth */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Baby&apos;s Date of Birth <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="babyDob"
              value={formData.babyDob}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
                errors.babyDob ? 'border-red-400' : 'border-transparent'
              } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
            />
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">dd-MMM-yyyy</span>
          {errors.babyDob && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.babyDob}</p>
          )}
        </div>

        {/* Father's Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Father&apos;s Phone Number <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="flex rounded bg-[#F3F4F6] border border-transparent focus-within:border-gray-400 focus-within:bg-white overflow-hidden transition-all">
            <div className="px-3 py-2.5 bg-gray-200/70 border-r border-gray-300 text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <span>+234</span>
            </div>
            <input
              type="tel"
              name="fatherPhone"
              value={formData.fatherPhone}
              onChange={handleChange}
              placeholder="801 234 5678"
              className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm text-gray-800"
            />
          </div>
          {errors.fatherPhone && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.fatherPhone}</p>
          )}
        </div>

        {/* Mother's Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Mother&apos;s Phone Number
          </label>
          <div className="flex rounded bg-[#F3F4F6] border border-transparent focus-within:border-gray-400 focus-within:bg-white overflow-hidden transition-all">
            <div className="px-3 py-2.5 bg-gray-200/70 border-r border-gray-300 text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <span>+234</span>
            </div>
            <input
              type="tel"
              name="motherPhone"
              value={formData.motherPhone}
              onChange={handleChange}
              placeholder="801 234 5678"
              className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm text-gray-800"
            />
          </div>
        </div>

        {/* Parent's Email Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Parent&apos;s Email Address <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
              errors.parentEmail ? 'border-red-400' : 'border-transparent'
            } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
          />
          {errors.parentEmail && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.parentEmail}</p>
          )}
        </div>

        {/* Connect */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Connect <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            name="connect"
            value={formData.connect}
            onChange={handleConnectChange}
            className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
              errors.connect ? 'border-red-400' : 'border-transparent'
            } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
          >
            <option value="">-Select-</option>
            {CONNECT_GROUPS.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.connect && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.connect}</p>
          )}
        </div>

        {/* Connect Leader's Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Connect Leader&apos;s Name
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="cellLeaderFirstName"
                value={formData.cellLeaderFirstName}
                onChange={handleChange}
                placeholder="First"
                className="w-full px-3 py-2.5 rounded bg-[#F3F4F6] border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all"
              />
              <span className="text-[11px] text-gray-500 block mt-1">First</span>
            </div>
            <div>
              <input
                type="text"
                name="cellLeaderLastName"
                value={formData.cellLeaderLastName}
                onChange={handleChange}
                placeholder="Last"
                className="w-full px-3 py-2.5 rounded bg-[#F3F4F6] border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all"
              />
              <span className="text-[11px] text-gray-500 block mt-1">Last</span>
            </div>
          </div>
        </div>

        {/* Connect Leader's Phone number */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Connect Leader&apos;s Phone number
          </label>
          <input
            type="tel"
            name="cellLeaderPhone"
            value={formData.cellLeaderPhone}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded bg-[#F3F4F6] border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-12 py-3 rounded bg-black hover:bg-neutral-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
