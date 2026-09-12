'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CONNECT_GROUPS } from './baby-dedication-form';

interface NamingCeremonyFormData {
  parentName: string;
  parentPhone: string;
  email: string;
  connect: string;
  leaderFirstName: string;
  leaderLastName: string;
  leaderPhone: string;
  ceremonyDate: string;
}

const initialFormState: NamingCeremonyFormData = {
  parentName: '',
  parentPhone: '',
  email: '',
  connect: '',
  leaderFirstName: '',
  leaderLastName: '',
  leaderPhone: '',
  ceremonyDate: '',
};

export function NamingCeremonyForm() {
  const [formData, setFormData] = useState<NamingCeremonyFormData>(initialFormState);
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
      leaderFirstName: match ? match.leaderFirstName : prev.leaderFirstName,
      leaderLastName: match ? match.leaderLastName : prev.leaderLastName,
      leaderPhone: match ? match.leaderPhone : prev.leaderPhone,
    }));

    if (errors.connect) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.connect;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent's name is required";
    }
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = "Parent's phone number is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.connect) {
      newErrors.connect = 'Please select your connect';
    }
    if (!formData.ceremonyDate) {
      newErrors.ceremonyDate = 'Date is required';
    }

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

      const leaderName =
        formData.leaderFirstName || formData.leaderLastName
          ? `${formData.leaderFirstName} ${formData.leaderLastName}`.trim()
          : 'N/A';

      const submitData = new FormData();
      submitData.append('access_key', accessKey);
      submitData.append(
        'subject',
        `Naming Ceremony Request: ${formData.parentName} (${formData.connect})`
      );
      submitData.append('from_name', 'The Votage Church - Pastoral Care');
      submitData.append('replyto', formData.email);

      submitData.append('Service Requested', 'Naming Ceremony');

      // 1. Ceremony Details
      submitData.append(
        '[ 1. CEREMONY DETAILS ]',
        '────────────────────────────────'
      );
      submitData.append(
        'Date of Ceremony',
        formatReadableDate(formData.ceremonyDate)
      );

      // 2. Parent Information
      submitData.append(
        '[ 2. PARENT INFORMATION ]',
        '────────────────────────────────'
      );
      submitData.append("Parent's Full Name", formData.parentName);
      submitData.append("Parent's Phone Number", formData.parentPhone);
      submitData.append('Parent Email Address', formData.email);

      // 3. Connect & Leadership
      submitData.append(
        '[ 3. CHURCH CONNECT & LEADERSHIP ]',
        '────────────────────────────────'
      );
      submitData.append('Connect Group', formData.connect);
      submitData.append("Connect Leader's Name", leaderName);
      submitData.append(
        "Connect Leader's Phone Number",
        formData.leaderPhone || 'N/A'
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

      if (responseData.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(
          responseData.message ||
            'Submission failed with Web3Forms. Please try again.'
        );
      }
    } catch (err: any) {
      console.error('Naming ceremony form submission error:', err);
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
          Naming Ceremony Scheduled
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Thank you! We have received your naming ceremony booking for{' '}
          <strong className="text-black">{formData.parentName}</strong>. Our pastoral team has been notified.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-5 text-left mb-8 space-y-2 text-xs text-gray-700">
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="font-semibold text-gray-500">Parent&apos;s Name:</span>
            <span className="font-medium text-black">{formData.parentName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="font-semibold text-gray-500">Proposed Date:</span>
            <span className="font-medium text-black">{formData.ceremonyDate}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="font-semibold text-gray-500">Connect:</span>
            <span className="font-medium text-black">{formData.connect}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Email:</span>
            <span className="font-medium text-black">{formData.email}</span>
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
        {/* Parent's Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Parent&apos;s Name <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
              errors.parentName ? 'border-red-400' : 'border-transparent'
            } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
          />
          {errors.parentName && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.parentName}</p>
          )}
        </div>

        {/* Parent's Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Parent&apos;s Phone <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="flex rounded bg-[#F3F4F6] border border-transparent focus-within:border-gray-400 focus-within:bg-white overflow-hidden transition-all">
            <div className="px-3 py-2.5 bg-gray-200/70 border-r border-gray-300 text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <span>+234</span>
            </div>
            <input
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              placeholder="801 234 5678"
              className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm text-gray-800"
            />
          </div>
          {errors.parentPhone && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.parentPhone}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Email Address <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
              errors.email ? 'border-red-400' : 'border-transparent'
            } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
          />
          {errors.email && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>
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
                name="leaderFirstName"
                value={formData.leaderFirstName}
                onChange={handleChange}
                placeholder="First"
                className="w-full px-3 py-2.5 rounded bg-[#F3F4F6] border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all"
              />
              <span className="text-[11px] text-gray-500 block mt-1">First</span>
            </div>
            <div>
              <input
                type="text"
                name="leaderLastName"
                value={formData.leaderLastName}
                onChange={handleChange}
                placeholder="Last"
                className="w-full px-3 py-2.5 rounded bg-[#F3F4F6] border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all"
              />
              <span className="text-[11px] text-gray-500 block mt-1">Last</span>
            </div>
          </div>
        </div>

        {/* Connect Leader's Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Connect Leader&apos;s Phone Number
          </label>
          <div className="flex rounded bg-[#F3F4F6] border border-transparent focus-within:border-gray-400 focus-within:bg-white overflow-hidden transition-all">
            <div className="px-3 py-2.5 bg-gray-200/70 border-r border-gray-300 text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <span>+234</span>
            </div>
            <input
              type="tel"
              name="leaderPhone"
              value={formData.leaderPhone}
              onChange={handleChange}
              placeholder="801 234 5678"
              className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm text-gray-800"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Date <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="ceremonyDate"
              value={formData.ceremonyDate}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded bg-[#F3F4F6] border ${
                errors.ceremonyDate ? 'border-red-400' : 'border-transparent'
              } focus:border-gray-400 focus:bg-white focus:outline-none text-sm text-gray-800 transition-all`}
            />
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">dd-MMM-yyyy</span>
          {errors.ceremonyDate && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.ceremonyDate}</p>
          )}
        </div>

        {/* SUBMIT BUTTON - BLACK */}
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
