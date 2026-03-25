/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Home, 
  Users, 
  Sparkles, 
  Smile, 
  CheckCircle2,
  Calendar,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'landing' | 'form' | 'summary' | 'success';

interface FormData {
  // Section 1: Basic
  fullName: string;
  nickname: string;
  gender: 'ወንድ' | 'ሴት' | '';
  birthdayDay: string;
  birthdayMonth: string;
  birthdayYear: string;
  phone: string;
  address: string;
  neighborhood: string;

  // Section 2: Family Background
  fatherName: string;
  motherName: string;
  siblingsCount: string;
  schoolName: string;
  grade: string;
  emergencyContact: string;
  guardianName: string;
  birthOrder: string;

  // Section 3: Spiritual Life
  salvationTestimony: string;
  acceptedChristDay: string;
  acceptedChristMonth: string;
  acceptedChristYear: string;
  baptismStatus: 'የተጠመቁ' | 'ያልተጠመቁ' | '';
  bibleReadingHabit: string;
  familyReligion: string;
  familyChurchSupport: string;
  economicSituation: 'የተረጋጋ' | 'መካከለኛ' | 'አስቸጋሪ' | '';
  livingSituation: 'የግል' | 'የኪራይ' | '';
  familyNotes: string;
  prayerLife: string;

  // Section 4: Church Participation
  teenEventAttendance: string;
  sundayServiceAttendance: string;
  spiritualMaturity: string;
  struggles: string;
  prayerRequests: string;
  bibleStudyAttendance: string;

  // Section 5: Talents & Personal Development
  talents: string;
  ministryInvolvement: string;
  leadershipPotential: string;
  hobbies: string;

  // Section 6: Social Environment
  closeFriends: string;
  friendsInfluence: string;
  interests: string;
  careerInterest: string;
  parentRelationship: string;
  churchRelationship: string;

  // Section 7: Mentorship Tracking
  lastMentorshipDay: string;
  lastMentorshipMonth: string;
  lastMentorshipYear: string;
  nextFollowUpDay: string;
  nextFollowUpMonth: string;
  nextFollowUpYear: string;
  leaderNotes: string;

  // Section 8: Bible Lessons
  lessonName: string;
  lessonTopic: string;
  lessonTeacher: string;
  growthLevel: string;
  lessonCompletedDay: string;
  lessonCompletedMonth: string;
  lessonCompletedYear: string;

  // Section 9: Teen Events
  eventName: string;
  eventDay: string;
  eventMonth: string;
  eventYear: string;
  eventType: string;
  understandingLevel: string;
  attendeeRole: string;
  eventNote: string;
}

const INITIAL_DATA: FormData = {
  fullName: '', nickname: '', gender: '', birthdayDay: '', birthdayMonth: '', birthdayYear: '', phone: '', address: '', neighborhood: '',
  fatherName: '', motherName: '', siblingsCount: '', schoolName: '', grade: '', emergencyContact: '', guardianName: '', birthOrder: '',
  salvationTestimony: '', acceptedChristDay: '', acceptedChristMonth: '', acceptedChristYear: '', baptismStatus: '', bibleReadingHabit: '', familyReligion: '', familyChurchSupport: '', economicSituation: '', livingSituation: '', familyNotes: '', prayerLife: '',
  teenEventAttendance: '', sundayServiceAttendance: '', spiritualMaturity: '', struggles: '', prayerRequests: '', bibleStudyAttendance: '',
  talents: '', ministryInvolvement: '', leadershipPotential: '', hobbies: '',
  closeFriends: '', friendsInfluence: '', interests: '', careerInterest: '', parentRelationship: '', churchRelationship: '',
  lastMentorshipDay: '', lastMentorshipMonth: '', lastMentorshipYear: '', nextFollowUpDay: '', nextFollowUpMonth: '', nextFollowUpYear: '', leaderNotes: '',
  lessonName: '', lessonTopic: '', lessonTeacher: '', growthLevel: '', lessonCompletedDay: '', lessonCompletedMonth: '', lessonCompletedYear: '',
  eventName: '', eventDay: '', eventMonth: '', eventYear: '', eventType: '', understandingLevel: '', attendeeRole: '', eventNote: ''
};

const ETHIOPIAN_MONTHS = [
  'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

// --- Components ---

const ProgressBar = ({ step, totalSteps }: { step: number, totalSteps: number }) => (
  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-8">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${(step / totalSteps) * 100}%` }}
      className="h-full bg-amber-400"
    />
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
        <Icon size={20} />
      </div>
      <h2 className="text-2xl font-bold text-stone-800">{title}</h2>
    </div>
    {subtitle && <p className="text-stone-500 text-sm leading-relaxed">{subtitle}</p>}
  </div>
);

const InputLabel = ({ label, optional = false }: { label: string, optional?: boolean }) => (
  <label className="block text-sm font-semibold text-stone-700 mb-2">
    {label} {optional && <span className="text-stone-400 font-normal ml-1">(አማራጭ)</span>}
  </label>
);

const EthiopianDateInput = ({ 
  label, 
  dayField, 
  monthField, 
  yearField, 
  optional = false,
  formData,
  updateField,
  future = false
}: { 
  label: string, 
  dayField: keyof FormData, 
  monthField: keyof FormData, 
  yearField: keyof FormData,
  optional?: boolean,
  formData: FormData,
  updateField: (field: keyof FormData, value: any) => void,
  future?: boolean
}) => {
  const currentYear = 2018; // Approx current Ethiopian year
  const years = future 
    ? Array.from({ length: 10 }, (_, i) => currentYear + i)
    : Array.from({ length: 60 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-2">
      <InputLabel label={label} optional={optional} />
      <div className="grid grid-cols-3 gap-2">
        <select 
          value={formData[dayField]}
          onChange={(e) => updateField(dayField, e.target.value)}
          className="p-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
        >
          <option value="">ቀን</option>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select 
          value={formData[monthField]}
          onChange={(e) => updateField(monthField, e.target.value)}
          className="p-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
        >
          <option value="">ወር</option>
          {ETHIOPIAN_MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select 
          value={formData[yearField]}
          onChange={(e) => updateField(yearField, e.target.value)}
          className="p-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
        >
          <option value="">ዓ.ም</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <p className="text-[10px] text-stone-400 italic">በኢትዮጵያ ዘመን አቆጣጠር</p>
    </div>
  );
};

const LandingPage = ({ setView }: { setView: (v: View) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-md mx-auto px-6 py-16 text-center"
  >
    <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
      <Heart className="text-amber-500 w-10 h-10 fill-current" />
    </div>
    <h1 className="text-4xl font-bold text-stone-900 mb-4">የበለጠ እንድንተዋወቅ 💛</h1>
    <p className="text-stone-600 text-lg mb-12 leading-relaxed">
      ይህ እርስዎን ለመርዳት፣ አብረን ለመጸለይ እና አብረን ለማደግ ይረዳናል። የእርስዎ ድምፅ ለእኛ ትልቅ ዋጋ አለው።
    </p>
    
    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mb-12 flex gap-3 text-left">
      <Info className="text-amber-500 shrink-0" size={20} />
      <p className="text-sm text-stone-500 italic">
        ለማጋራት የማይመችዎትን ማንኛውንም ነገር መዝለል ይችላሉ። ይህ ደህንነቱ የተጠበቀ ቦታ ነው።
      </p>
    </div>

    <button 
      onClick={() => setView('form')}
      className="w-full bg-stone-800 text-stone-50 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-stone-700 transition-all flex items-center justify-center gap-2"
    >
      ጀምር <ChevronRight size={20} />
    </button>
  </motion.div>
);

const FormStep = ({ 
  step, 
  totalSteps, 
  formData, 
  updateField, 
  setStep, 
  setView 
}: { 
  step: number, 
  totalSteps: number, 
  formData: FormData, 
  updateField: (field: keyof FormData, value: any) => void,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  setView: (v: View) => void
}) => {
  return (
    <motion.div 
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md mx-auto px-6 py-8"
    >
      <ProgressBar step={step} totalSteps={totalSteps} />
      
      {step === 1 && (
        <div className="space-y-6">
          <SectionTitle icon={User} title="መሠረታዊ መረጃ" subtitle="ተባረክ! በመሠረታዊ ነገሮች እንጀምር።" />
          <div>
            <InputLabel label="ሙሉ ስም" />
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              placeholder="ሙሉ ስምዎን እዚህ ይጻፉ"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="የቅጽል ስም" />
              <input 
                type="text" 
                value={formData.nickname}
                onChange={(e) => updateField('nickname', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="የቅጽል ስም"
              />
            </div>
            <div>
              <InputLabel label="ጾታ" />
              <select 
                value={formData.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all appearance-none"
              >
                <option value="">ይምረጡ</option>
                <option value="ወንድ">ወንድ</option>
                <option value="ሴት">ሴት</option>
              </select>
            </div>
          </div>
          <EthiopianDateInput 
            label="የልደት ቀን" 
            dayField="birthdayDay" 
            monthField="birthdayMonth" 
            yearField="birthdayYear" 
            formData={formData}
            updateField={updateField}
          />
          <div>
            <InputLabel label="ስልክ ቁጥር" />
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              placeholder="09..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="አድራሻ" />
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="አድራሻ"
              />
            </div>
            <div>
              <InputLabel label="ሰፈር/መንደር" />
              <input 
                type="text" 
                value={formData.neighborhood}
                onChange={(e) => updateField('neighborhood', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="ሰፈር"
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <SectionTitle icon={Home} title="የቤተሰብ ሁኔታ" subtitle="ተባረክ! ስለ ቤተሰብዎ ጥቂት ይንገሩን።" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="የአባት ስም" />
              <input 
                type="text" 
                value={formData.fatherName}
                onChange={(e) => updateField('fatherName', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <InputLabel label="የእናት ስም" />
              <input 
                type="text" 
                value={formData.motherName}
                onChange={(e) => updateField('motherName', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="የወንድሞችና እህቶች ብዛት" />
              <input 
                type="number" 
                value={formData.siblingsCount}
                onChange={(e) => updateField('siblingsCount', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <InputLabel label="የውልደት ቅደም ተከተል" />
              <input 
                type="text" 
                value={formData.birthOrder}
                onChange={(e) => updateField('birthOrder', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="ለምሳሌ፡ 1ኛ"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="የትምህርት ቤት ስም" />
              <input 
                type="text" 
                value={formData.schoolName}
                onChange={(e) => updateField('schoolName', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <InputLabel label="ክፍል" />
              <input 
                type="text" 
                value={formData.grade}
                onChange={(e) => updateField('grade', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <InputLabel label="የአደጋ ጊዜ ተጠሪ" />
            <input 
              type="text" 
              value={formData.emergencyContact}
              onChange={(e) => updateField('emergencyContact', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              placeholder="ስም እና ስልክ"
            />
          </div>
          <div>
            <InputLabel label="የሞግዚት ስም" optional />
            <input 
              type="text" 
              value={formData.guardianName}
              onChange={(e) => updateField('guardianName', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <SectionTitle icon={Sparkles} title="መንፈሳዊ ሕይወት" subtitle="የእምነት ጉዞዎ።" />
          <div>
            <InputLabel label="የመዳን ምስክርነት" />
            <textarea 
              value={formData.salvationTestimony}
              onChange={(e) => updateField('salvationTestimony', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
              placeholder="እንዴት ጌታን እንደተቀበሉ..."
            />
          </div>
          <EthiopianDateInput 
            label="ክርስቶስን የተቀበሉበት ቀን" 
            dayField="acceptedChristDay" 
            monthField="acceptedChristMonth" 
            yearField="acceptedChristYear" 
            optional
            formData={formData}
            updateField={updateField}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="የጥምቀት ሁኔታ" />
              <select 
                value={formData.baptismStatus}
                onChange={(e) => updateField('baptismStatus', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all appearance-none"
              >
                <option value="">ይምረጡ</option>
                <option value="የተጠመቁ">የተጠመቁ</option>
                <option value="ያልተጠመቁ">ያልተጠመቁ</option>
              </select>
            </div>
            <div>
              <InputLabel label="የመጽሐፍ ቅዱስ ንባብ ልምድ" />
              <input 
                type="text" 
                value={formData.bibleReadingHabit}
                onChange={(e) => updateField('bibleReadingHabit', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="በየቀኑ፣ በሳምንት..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="የቤተሰብ ሃይማኖት" />
              <input 
                type="text" 
                value={formData.familyReligion}
                onChange={(e) => updateField('familyReligion', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <InputLabel label="የቤተሰብ የቤተክርስቲያን ድጋፍ" />
              <input 
                type="text" 
                value={formData.familyChurchSupport}
                onChange={(e) => updateField('familyChurchSupport', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <InputLabel label="የጸሎት ሕይወት" />
            <textarea 
              value={formData.prayerLife}
              onChange={(e) => updateField('prayerLife', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
              placeholder="ስለ ጸሎት ሕይወትዎ..."
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <SectionTitle icon={Users} title="የቤተክርስቲያን ተሳትፎ" subtitle="በቤተክርስቲያን ውስጥ ያለዎት እንቅስቃሴ።" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="በወጣቶች ፕሮግራሞች መገኘት" />
              <input 
                type="text" 
                value={formData.teenEventAttendance}
                onChange={(e) => updateField('teenEventAttendance', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="ሁልጊዜ፣ አልፎ አልፎ..."
              />
            </div>
            <div>
              <InputLabel label="በእሁድ አገልግሎት መገኘት" />
              <input 
                type="text" 
                value={formData.sundayServiceAttendance}
                onChange={(e) => updateField('sundayServiceAttendance', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <InputLabel label="መንፈሳዊ ብስለት" />
            <input 
              type="text" 
              value={formData.spiritualMaturity}
              onChange={(e) => updateField('spiritualMaturity', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="ፈተናዎች/ትግሎች" />
            <textarea 
              value={formData.struggles}
              onChange={(e) => updateField('struggles', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
              placeholder="ምን እየከበደዎት ነው?"
            />
          </div>
          <div>
            <InputLabel label="የጸሎት ጥያቄዎች" />
            <textarea 
              value={formData.prayerRequests}
              onChange={(e) => updateField('prayerRequests', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
            />
          </div>
          <div>
            <InputLabel label="በመጽሐፍ ቅዱስ ጥናት መገኘት" />
            <input 
              type="text" 
              value={formData.bibleStudyAttendance}
              onChange={(e) => updateField('bibleStudyAttendance', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <SectionTitle icon={Smile} title="ተሰጥኦ እና የግል እድገት" subtitle="ተሰጥኦዎችዎ እና ፍላጎቶችዎ።" />
          <div>
            <InputLabel label="ተሰጥኦዎች" />
            <textarea 
              value={formData.talents}
              onChange={(e) => updateField('talents', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
              placeholder="ምን ዓይነት ተሰጥኦዎች አሉዎት?"
            />
          </div>
          <div>
            <InputLabel label="የአገልግሎት ተሳትፎ" />
            <input 
              type="text" 
              value={formData.ministryInvolvement}
              onChange={(e) => updateField('ministryInvolvement', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="የመሪነት ብቃት" />
            <input 
              type="text" 
              value={formData.leadershipPotential}
              onChange={(e) => updateField('leadershipPotential', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="የትርፍ ጊዜ ማሳለፊያዎች" />
            <textarea 
              value={formData.hobbies}
              onChange={(e) => updateField('hobbies', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
            />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-6">
          <SectionTitle icon={Users} title="ማህበራዊ አካባቢ" subtitle="ጓደኞች እና ግንኙነቶች።" />
          <div>
            <InputLabel label="ቅርብ ጓደኞች" />
            <textarea 
              value={formData.closeFriends}
              onChange={(e) => updateField('closeFriends', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
            />
          </div>
          <div>
            <InputLabel label="የጓደኞች ተጽዕኖ" />
            <input 
              type="text" 
              value={formData.friendsInfluence}
              onChange={(e) => updateField('friendsInfluence', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="የወደፊት የሥራ ፍላጎት" />
            <input 
              type="text" 
              value={formData.careerInterest}
              onChange={(e) => updateField('careerInterest', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="ከወላጆች ጋር ያለው ግንኙነት" />
            <input 
              type="text" 
              value={formData.parentRelationship}
              onChange={(e) => updateField('parentRelationship', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="ከቤተክርስቲያን ጋር ያለው ግንኙነት" />
            <input 
              type="text" 
              value={formData.churchRelationship}
              onChange={(e) => updateField('churchRelationship', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-6">
          <SectionTitle icon={CheckCircle2} title="የክትትል መረጃ" subtitle="የመሪዎች ክትትል ማስታወሻ።" />
          <EthiopianDateInput 
            label="የመጨረሻው የክትትል ስብሰባ" 
            dayField="lastMentorshipDay" 
            monthField="lastMentorshipMonth" 
            yearField="lastMentorshipYear" 
            formData={formData}
            updateField={updateField}
          />
          <EthiopianDateInput 
            label="የሚቀጥለው ክትትል" 
            dayField="nextFollowUpDay" 
            monthField="nextFollowUpMonth" 
            yearField="nextFollowUpYear" 
            future
            formData={formData}
            updateField={updateField}
          />
          <div>
            <InputLabel label="የመሪው ማስታወሻ" />
            <textarea 
              value={formData.leaderNotes}
              onChange={(e) => updateField('leaderNotes', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-32"
            />
          </div>
        </div>
      )}

      {step === 8 && (
        <div className="space-y-6">
          <SectionTitle icon={Info} title="የመጽሐፍ ቅዱስ ትምህርቶች" subtitle="የተወሰዱ ትምህርቶች ዝርዝር።" />
          <div>
            <InputLabel label="የትምህርቱ ስም" />
            <input 
              type="text" 
              value={formData.lessonName}
              onChange={(e) => updateField('lessonName', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="ርዕስ" />
            <input 
              type="text" 
              value={formData.lessonTopic}
              onChange={(e) => updateField('lessonTopic', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="አስተማሪ" />
            <input 
              type="text" 
              value={formData.lessonTeacher}
              onChange={(e) => updateField('lessonTeacher', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="የመንፈሳዊ እድገት ደረጃ" />
            <input 
              type="text" 
              value={formData.growthLevel}
              onChange={(e) => updateField('growthLevel', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <EthiopianDateInput 
            label="የተጠናቀቀበት ቀን" 
            dayField="lessonCompletedDay" 
            monthField="lessonCompletedMonth" 
            yearField="lessonCompletedYear" 
            formData={formData}
            updateField={updateField}
          />
        </div>
      )}

      {step === 9 && (
        <div className="space-y-6">
          <SectionTitle icon={Calendar} title="የወጣቶች ዝግጅቶች" subtitle="የተሳተፉባቸው ዝግጅቶች።" />
          <div>
            <InputLabel label="የዝግጅቱ ስም" />
            <input 
              type="text" 
              value={formData.eventName}
              onChange={(e) => updateField('eventName', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <EthiopianDateInput 
            label="ቀን" 
            dayField="eventDay" 
            monthField="eventMonth" 
            yearField="eventYear" 
            formData={formData}
            updateField={updateField}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel label="የዝግጅቱ ዓይነት" />
              <input 
                type="text" 
                value={formData.eventType}
                onChange={(e) => updateField('eventType', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <InputLabel label="የመረዳት ደረጃ" />
              <input 
                type="text" 
                value={formData.understandingLevel}
                onChange={(e) => updateField('understandingLevel', e.target.value)}
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <InputLabel label="የተሳታፊው ሚና" />
            <input 
              type="text" 
              value={formData.attendeeRole}
              onChange={(e) => updateField('attendeeRole', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <InputLabel label="ማስታወሻ" />
            <textarea 
              value={formData.eventNote}
              onChange={(e) => updateField('eventNote', e.target.value)}
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all h-24"
            />
          </div>
        </div>
      )}

      <div className="mt-12 flex gap-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(s => s - 1)}
            className="flex-1 p-4 rounded-2xl border border-stone-300 text-stone-600 font-bold flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} /> ተመለስ
          </button>
        )}
        <button 
          onClick={() => {
            if (step < totalSteps) setStep(s => s + 1);
            else setView('summary');
          }}
          className="flex-[2] bg-stone-800 text-stone-50 p-4 rounded-2xl font-bold shadow-lg hover:bg-stone-700 transition-all flex items-center justify-center gap-2"
        >
          {step === totalSteps ? 'ከልስ' : 'ቀጥል'} <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const SummaryPage = ({ 
  formData, 
  setView 
}: { 
  formData: FormData, 
  setView: (v: View) => void 
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-md mx-auto px-6 py-12"
  >
    <h2 className="text-3xl font-bold text-stone-800 mb-8">ታሪክዎን ይከልሱ</h2>
    <div className="space-y-6 mb-12">
      {[
        { label: 'ስም', value: formData.fullName },
        { label: 'ጾታ', value: formData.gender },
        { label: 'ስልክ', value: formData.phone },
        { label: 'ልደት', value: formData.birthdayDay ? `${formData.birthdayDay}/${formData.birthdayMonth}/${formData.birthdayYear}` : '' },
        { label: 'የመዳን ምስክርነት', value: formData.salvationTestimony },
        { label: 'የጸሎት ጥያቄዎች', value: formData.prayerRequests },
      ].map((item) => (
        <div key={item.label} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{item.label}</p>
          <p className="text-stone-700">{item.value || 'አልተገለጸም'}</p>
        </div>
      ))}
      <p className="text-xs text-stone-400 italic text-center">
        ሁሉም መልሶችዎ ተቀምጠዋል እና ለመላክ ዝግጁ ናቸው።
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <button 
        onClick={() => {
          console.log('Final Form Data:', formData);
          localStorage.removeItem('youth_connect_draft_amharic');
          setView('success');
        }}
        className="w-full bg-amber-400 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-amber-500 transition-all"
      >
        ታሪኬን ላክ
      </button>
      <button 
        onClick={() => setView('form')}
        className="w-full text-stone-500 font-medium py-2"
      >
        ተመለስና አስተካክል
      </button>
    </div>
  </motion.div>
);

const SuccessPage = ({ 
  setFormData, 
  setStep, 
  setView 
}: { 
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  setView: (v: View) => void
}) => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="max-w-md mx-auto px-6 py-24 text-center"
  >
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
      <CheckCircle2 className="text-green-500 w-12 h-12" />
    </div>
    <h2 className="text-3xl font-bold text-stone-800 mb-4">እናመሰግናለን!</h2>
    <p className="text-stone-600 mb-12">
      መረጃዎ ደርሶናል። ይህንን ስላካፈሉን በጣም ደስተኞች ነን።
    </p>
    <button 
      onClick={() => {
        setFormData(INITIAL_DATA);
        setStep(1);
        setView('landing');
      }}
      className="bg-stone-800 text-stone-50 px-8 py-4 rounded-2xl font-bold"
    >
      ወደ መጀመሪያው ገጽ ተመለስ
    </button>
  </motion.div>
);

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('youth_connect_draft_amharic');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('youth_connect_draft_amharic', JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalSteps = 9;

  return (
    <div className="min-h-screen bg-[#fdfcfb] font-sans text-stone-900 selection:bg-amber-100">
      <AnimatePresence mode="wait">
        {view === 'landing' && <LandingPage setView={setView} />}
        {view === 'form' && (
          <FormStep 
            step={step} 
            totalSteps={totalSteps} 
            formData={formData} 
            updateField={updateField} 
            setStep={setStep} 
            setView={setView} 
          />
        )}
        {view === 'summary' && <SummaryPage formData={formData} setView={setView} />}
        {view === 'success' && (
          <SuccessPage 
            setFormData={setFormData} 
            setStep={setStep} 
            setView={setView} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
