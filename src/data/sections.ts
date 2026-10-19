import type { UIKey } from '~/i18n/ui';

/** Seções da página inicial, na ordem. `mascot` é a fala do mascote em cada uma. */
export const sections: { id: string; nav?: UIKey; mascot: UIKey }[] = [
  { id: 'inicio', mascot: 'mascot.hero' },
  { id: 'about', nav: 'nav.about', mascot: 'mascot.about' },
  { id: 'journey', nav: 'nav.journey', mascot: 'mascot.journey' },
  { id: 'tools', nav: 'nav.tools', mascot: 'mascot.tools' },
  { id: 'projects', nav: 'nav.projects', mascot: 'mascot.pro' },
  { id: 'academic', mascot: 'mascot.academic' },
  { id: 'personal', mascot: 'mascot.personal' },
  { id: 'education', nav: 'nav.education', mascot: 'mascot.education' },
  { id: 'contact', nav: 'nav.contact', mascot: 'mascot.contact' },
];
