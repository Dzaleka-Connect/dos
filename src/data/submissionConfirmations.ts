interface SubmissionConfirmation {
  title: string;
  message: string;
  nextSteps: string[];
  cta: { text: string; href: string };
}

export const submissionConfirmations: Record<string, SubmissionConfirmation> = {
  default: {
    title: 'Submission received',
    message: 'Your information has been submitted.',
    nextSteps: ['If you need to correct your submission, contact the help desk and tell us which form you used.'],
    cta: { text: 'Return to the home page', href: '/' },
  },
  support: {
    title: 'Support request submitted',
    message: 'Your message has been submitted to the support team.',
    nextSteps: ['If you need to add information, contact the help desk and describe your original request.'],
    cta: { text: 'Return to the help desk', href: '/help-desk' },
  },
  visit: {
    title: 'Visit request submitted',
    message: 'Your visit request has been submitted. Your visit arrangements are not confirmed by this submission.',
    nextSteps: ['Visit Dzaleka now has a dedicated website with visitor information and booking options.'],
    cta: { text: 'Go to Visit Dzaleka', href: 'https://visit.dzaleka.com' },
  },
  'guide-registration': {
    title: 'Guide application submitted',
    message: 'Your application to become a guide has been submitted for review.',
    nextSteps: ['For information about guiding and visits, use the Visit Dzaleka website.'],
    cta: { text: 'Go to Visit Dzaleka', href: 'https://visit.dzaleka.com' },
  },
  legal: {
    title: 'Legal support request submitted',
    message: 'Your legal support request has been submitted. This does not confirm legal advice or representation.',
    nextSteps: ['You can browse the service directory for legal support contact details.'],
    cta: { text: 'Find services', href: '/services' },
  },
  emergency: {
    title: 'Relief request submitted',
    message: 'Your relief request has been submitted. This form is not an emergency response service.',
    nextSteps: ['If you need urgent help, use the emergency contacts on Get help now. Do not wait for a reply to this form.'],
    cta: { text: 'Get help now', href: '/get-help-now' },
  },
  leadership: {
    title: 'Leadership application submitted',
    message: 'Your leadership support application has been submitted for review.',
    nextSteps: ['Submitting an application does not confirm a place or funding.'],
    cta: { text: 'Browse grants and programs', href: '/grants-and-programs' },
  },
  advocacy: {
    title: 'Advocacy request submitted',
    message: 'Your campaign proposal has been submitted for review.',
    nextSteps: ['To correct or add information, contact the help desk with the name of your campaign.'],
    cta: { text: 'Return to applications', href: '/applications' },
  },
  profile: {
    title: 'Profile submitted for review',
    message: 'Your skills exchange profile has been submitted for review. It has not been published yet.',
    nextSteps: ['You can browse existing skills exchange profiles while your submission is being reviewed.'],
    cta: { text: 'Browse skills exchange', href: '/skills-exchange' },
  },
  'profile-update': {
    title: 'Profile update submitted',
    message: 'Your requested changes have been submitted for review. Your published profile has not changed yet.',
    nextSteps: ['If you need to correct the request, contact the help desk with your profile name.'],
    cta: { text: 'Return to skills exchange', href: '/skills-exchange' },
  },
  'opportunity-submission': {
    title: 'Opportunity submitted for review',
    message: 'Your opportunity has been submitted for review before publication.',
    nextSteps: ['To correct the details, contact the help desk with the opportunity title and its official source link.'],
    cta: { text: 'Browse grants and programs', href: '/grants-and-programs' },
  },
};

export function submissionConfirmation(type: string | null) {
  return Object.hasOwn(submissionConfirmations, type || '')
    ? submissionConfirmations[type!]
    : submissionConfirmations.default;
}
