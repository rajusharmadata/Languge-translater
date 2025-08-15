const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Translate up to 5,000 characters/day',
      'Access to 60 languages',
      'Basic AI translation',
    ],
    button: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: [
      'Unlimited translations',
      'Access to 120+ languages',
      'Advanced AI translation',
      'Voice translation support',
    ],
    button: 'Upgrade Now',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'All Pro features',
      'Team collaboration tools',
      'Dedicated support',
      'Custom integrations',
    ],
    button: 'Contact Us',
    highlight: false,
  },
]

export default plans
